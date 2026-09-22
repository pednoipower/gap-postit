/* ============================================================================
   LOCAL ADAPTER — the fallback
   ----------------------------------------------------------------------------
   Talks to the small server you run on your own laptop (server/server.js).
   Used when there is no internet, when the hospital network blocks Supabase,
   or when your Supabase project is asleep and will not wake up in time.

   Same shape as the Supabase adapter, so nothing else in the app changes.
   ========================================================================== */

(function () {
  "use strict";
  const cfg = window.CONFIG;

  // If localServerUrl is blank we assume the server is whatever served this
  // page — which is the normal case, because the laptop server hosts the
  // pages as well as the data.
  const base = () => (cfg.localServerUrl || "").replace(/\/+$/, "") || "";
  const api = p => base() + "/api" + p;

  async function req(path, opts, timeoutMs) {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), timeoutMs || 8000);
    try {
      const res = await fetch(api(path), Object.assign({
        signal: ctl.signal,
        headers: { "Content-Type": "application/json" }
      }, opts));
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        const err = new Error("Local server " + res.status + ": " + text.slice(0, 300));
        if (res.status >= 400 && res.status < 500) err.permanent = true;
        throw err;
      }
      const txt = await res.text();
      return txt ? JSON.parse(txt) : null;
    } finally { clearTimeout(t); }
  }

  const q = s => encodeURIComponent(s);

  window.LocalAdapter = {
    name: "local",

    async ping() { await req("/ping", {}, 4000); return true; },

    async getRoom(code)          { return req("/room?code=" + q(code)); },
    async listGroups(code)       { return req("/groups?code=" + q(code)); },
    async listParticipants(code) { return req("/participants?code=" + q(code)); },

    async listConcerns(code, since) {
      return req("/concerns?code=" + q(code) + (since ? "&since=" + q(since) : ""));
    },
    async listSolutions(code, since) {
      return req("/solutions?code=" + q(code) + (since ? "&since=" + q(since) : ""));
    },

    async join(code, p) {
      return req("/join", { method: "POST",
        body: JSON.stringify({ code, id: p.id, role: p.role, discipline: p.discipline,
                               setting: p.setting || null }) });
    },

    async insert(table, payload) {
      return req("/insert", { method: "POST", body: JSON.stringify({ table, payload }) });
    },

    async control(code, token, changes) {
      return req("/control", { method: "POST", body: JSON.stringify({ code, token, changes }) });
    },
    async importGroups(code, token, groups) {
      return req("/import", { method: "POST", body: JSON.stringify({ code, token, groups }) }, 20000);
    },
    async resetRoom(code, token) {
      return req("/reset", { method: "POST", body: JSON.stringify({ code, token }) }, 20000);
    }
  };
})();
