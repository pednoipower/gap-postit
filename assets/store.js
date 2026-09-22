/* ============================================================================
   STORE — the app's connection to wherever the data lives.
   ----------------------------------------------------------------------------
   Every page in this app talks to `Store`. Store then talks to either Supabase
   or the little laptop server, and the pages never need to know which.
   That is why swapping backends is a config change, not a rewrite.

   WHY POLLING INSTEAD OF A LIVE SOCKET
   ------------------------------------
   The obvious design is to give every phone a permanent live connection. We
   deliberately do not, for three reasons:

     1. Supabase's free plan allows 200 live connections at once. 150 people
        plus anyone who refreshes would sit right on that ceiling.
     2. Hospital wifi drops constantly. A dropped socket needs nursing back to
        life; a failed POST just gets retried.
     3. Participants are looking at a projector, not at their own screen.

   So: phones only ever SEND. The projector and your control panel ASK for new
   notes a few times a second. That is 2 connections instead of 152, and it
   makes the whole thing far harder to break.
   ========================================================================== */

(function () {
  "use strict";

  const cfg = window.CONFIG;

  /* -- tiny helpers -------------------------------------------------------- */

  function uuid() {
    if (crypto && crypto.randomUUID) return crypto.randomUUID();
    // fallback for older phones
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  /* Try something a few times, waiting longer each time. Hospital wifi is
     flaky; one failure should never mean a lost contribution. */
  async function withRetry(fn, { tries = 4, base = 400 } = {}) {
    let lastErr;
    for (let i = 0; i < tries; i++) {
      try { return await fn(); }
      catch (e) {
        lastErr = e;
        if (e && e.permanent) throw e;       // no point retrying a rejection
        if (i < tries - 1) await sleep(base * Math.pow(2, i) + Math.random() * 200);
      }
    }
    throw lastErr;
  }

  /* ------------------------------------------------------------------------
     THE OUTBOX
     ------------------------------------------------------------------------
     If a participant hits Send while their signal is gone, we do not lose it
     and we do not make them retype it. It goes in a queue in their phone's
     own storage and is sent the moment the connection comes back — even if
     they locked the phone and put it in their pocket in between.
     ---------------------------------------------------------------------- */
  const Outbox = {
    KEY: "missingpiece.outbox",

    read() {
      try { return JSON.parse(localStorage.getItem(this.KEY) || "[]"); }
      catch { return []; }
    },
    write(items) {
      try { localStorage.setItem(this.KEY, JSON.stringify(items)); } catch {}
    },
    add(item) { const q = this.read(); q.push(item); this.write(q); },
    remove(id) { this.write(this.read().filter(x => x.payload.id !== id)); },
    get size() { return this.read().length; }
  };

  /* ------------------------------------------------------------------------
     PUBLIC INTERFACE
     ------------------------------------------------------------------------ */
  const Store = {
    backend: null,        // which adapter we ended up using
    adapter: null,
    outbox: Outbox,
    _listeners: [],
    _poll: null,
    _seen: { concerns: new Set(), solutions: new Set() },
    _state: { room: null, concerns: [], solutions: [], groups: [], participants: [] },

    /* Choose a backend. With backend:"auto" we try Supabase and quietly fall
       back to the laptop server if it cannot be reached — so a dead internet
       connection on the morning does not end the workshop. */
    async init() {
      const want = (cfg.backend || "auto").toLowerCase();

      const trySupabase = async () => {
        const a = window.SupabaseAdapter;
        if (!a) throw new Error("supabase adapter not loaded");
        if (!cfg.supabaseUrl || cfg.supabaseUrl.includes("YOUR-PROJECT")) {
          const e = new Error("Supabase keys not filled in yet"); e.permanent = true; throw e;
        }
        await a.ping();
        return a;
      };
      const tryLocal = async () => {
        const a = window.LocalAdapter;
        if (!a) throw new Error("local adapter not loaded");
        await a.ping();
        return a;
      };

      if (want === "supabase") { this.adapter = await trySupabase(); this.backend = "supabase"; }
      else if (want === "local") { this.adapter = await tryLocal(); this.backend = "local"; }
      else {
        try { this.adapter = await trySupabase(); this.backend = "supabase"; }
        catch (e1) {
          try { this.adapter = await tryLocal(); this.backend = "local"; }
          catch (e2) {
            const err = new Error(
              "Could not reach Supabase or a local server.\n" +
              "Supabase said: " + (e1.message || e1) + "\n" +
              "Local server said: " + (e2.message || e2)
            );
            err.bothFailed = true;
            throw err;
          }
        }
      }
      return this.backend;
    },

    /* ---- reading ---- */
    async getRoom()         { return this.adapter.getRoom(cfg.roomCode); },
    async listConcerns(since)     { return this.adapter.listConcerns(cfg.roomCode, since); },
    async listSolutions(since)    { return this.adapter.listSolutions(cfg.roomCode, since); },
    async listGroups()      { return this.adapter.listGroups(cfg.roomCode); },
    async listParticipants(){ return this.adapter.listParticipants(cfg.roomCode); },

    /* ---- participants ---- */
    async join(role, discipline, setting) {
      const id = uuid();
      await withRetry(() => this.adapter.join(cfg.roomCode, { id, role, discipline, setting: setting || null }));
      return id;
    },

    /* ---- submitting ----
       Note the client-generated id. If a phone sends a note, loses signal
       before hearing back, and retries, the server sees the same id twice and
       keeps only one. No duplicate post-its on the board. */
    async addConcern({ promptId, body, situation, role, discipline, participantId }) {
      const payload = {
        id: uuid(), room_code: cfg.roomCode, prompt_id: promptId,
        body, situation: situation || null,
        role, discipline, participant_id: participantId || null
      };
      return this._send("concerns", payload);
    },

    /* kind: "facilitator" | "barrier" | "idea"
       reason: the how / why (required on the phone for every kind)
       outcome: the "then" of an idea; null for facilitators and barriers */
    async addSolution({ groupId, kind, body, reason, outcome, actor, context, role, discipline, participantId }) {
      const payload = {
        id: uuid(), room_code: cfg.roomCode, group_id: groupId,
        kind: kind || "idea", body, reason: reason || null, outcome: outcome || null,
        actor: actor || null, context: context || null,
        role, discipline, participant_id: participantId || null
      };
      return this._send("solutions", payload);
    },

    async _send(table, payload) {
      try {
        await withRetry(() => this.adapter.insert(table, payload), { tries: 3 });
        return { ok: true, queued: false, id: payload.id };
      } catch (e) {
        if (e && e.permanent) return { ok: false, queued: false, error: e.message };
        Outbox.add({ table, payload });
        this._emit("outbox");
        return { ok: true, queued: true, id: payload.id };
      }
    },

    /* Called on a timer and whenever the phone reports it is back online. */
    async flushOutbox() {
      const q = Outbox.read();
      if (!q.length) return { sent: 0, left: 0 };
      let sent = 0;
      for (const item of q) {
        try {
          await this.adapter.insert(item.table, item.payload);
          Outbox.remove(item.payload.id);
          sent++;
        } catch (e) {
          if (e && e.permanent) { Outbox.remove(item.payload.id); }
          else break;   // still offline — stop and try again later
        }
      }
      if (sent) this._emit("outbox");
      return { sent, left: Outbox.size };
    },

    /* ---- facilitator only ---- */
    async control(token, changes) { return this.adapter.control(cfg.roomCode, token, changes); },
    async importGroups(token, groups) { return this.adapter.importGroups(cfg.roomCode, token, groups); },
    async resetRoom(token) { return this.adapter.resetRoom(cfg.roomCode, token); },

    /* ---- live updates, for the projector and control panel only ---- */
    onChange(fn) { this._listeners.push(fn); return () => {
      this._listeners = this._listeners.filter(f => f !== fn);
    }; },
    _emit(what) { for (const fn of this._listeners) { try { fn(what, this._state); } catch (e) { console.error(e); } } },

    get state() { return this._state; },

    /* Ask for anything new, a few times a second. Only new rows come back, so
       each round trip stays small no matter how full the board gets. */
    async startWatching({ intervalMs = 1200 } = {}) {
      if (this._poll) return;
      const tick = async () => {
        try {
          const [room, groups] = await Promise.all([this.getRoom(), this.listGroups()]);
          const roomChanged = JSON.stringify(room) !== JSON.stringify(this._state.room);
          const groupsChanged = JSON.stringify(groups) !== JSON.stringify(this._state.groups);
          this._state.room = room;
          this._state.groups = groups;

          const newConcerns  = await this.listConcerns(this._watermark("concerns"));
          const newSolutions = await this.listSolutions(this._watermark("solutions"));

          const addedC = this._merge("concerns", newConcerns);
          const addedS = this._merge("solutions", newSolutions);

          if (roomChanged)   this._emit("room");
          if (groupsChanged) this._emit("groups");
          if (addedC.length) this._emit("concerns", addedC);
          if (addedS.length) this._emit("solutions", addedS);
          this._offlineSince = null;
        } catch (e) {
          if (!this._offlineSince) { this._offlineSince = Date.now(); this._emit("offline"); }
        }
      };
      await tick();
      this._poll = setInterval(tick, intervalMs);
    },

    stopWatching() { clearInterval(this._poll); this._poll = null; },

    _watermark(kind) {
      const arr = this._state[kind];
      if (!arr.length) return null;
      // step back a little to be safe against clock skew between rows
      const newest = arr[arr.length - 1].created_at;
      return newest;
    },

    /* Add rows we have not seen before, keeping the list in time order.
       The `_seen` set is what makes an overlapping fetch harmless. */
    _merge(kind, rows) {
      const added = [];
      for (const r of rows || []) {
        if (this._seen[kind].has(r.id)) continue;
        this._seen[kind].add(r.id);
        this._state[kind].push(r);
        added.push(r);
      }
      if (added.length) {
        this._state[kind].sort((a, b) =>
          (a.created_at < b.created_at ? -1 : a.created_at > b.created_at ? 1 : (a.ref < b.ref ? -1 : 1)));
      }
      return added;
    },

    /* Everything in the room, for exporting. */
    async snapshot() {
      const [room, concerns, solutions, groups, participants] = await Promise.all([
        this.getRoom(), this.listConcerns(null), this.listSolutions(null),
        this.listGroups(), this.listParticipants()
      ]);
      return { room, concerns, solutions, groups, participants,
               exportedAt: new Date().toISOString(), backend: this.backend };
    },

    uuid
  };

  window.Store = Store;

  /* Retry the outbox whenever the phone thinks it is back online, and every
     15 seconds regardless (phones lie about being online). */
  window.addEventListener("online", () => Store.adapter && Store.flushOutbox());
  setInterval(() => { if (Store.adapter && Outbox.size) Store.flushOutbox(); }, 15000);
})();
