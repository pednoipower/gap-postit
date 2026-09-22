/* ============================================================================
   SUPABASE ADAPTER
   ----------------------------------------------------------------------------
   Talks to Supabase over plain HTTP. There is deliberately no supabase-js
   library here: one less thing to download, one less thing to break if the
   venue blocks a CDN, and the whole app keeps working offline from a USB stick.
   ========================================================================== */

(function () {
  "use strict";
  const cfg = window.CONFIG;

  const base = () => (cfg.supabaseUrl || "").replace(/\/+$/, "");
  const rest = () => base() + "/rest/v1";
  const rpc  = () => base() + "/rest/v1/rpc";

  function headers(extra) {
    return Object.assign({
      "apikey": cfg.supabaseAnonKey,
      "Authorization": "Bearer " + cfg.supabaseAnonKey,
      "Content-Type": "application/json"
    }, extra || {});
  }

  async function req(url, opts, timeoutMs) {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), timeoutMs || 8000);
    try {
      const res = await fetch(url, Object.assign({ signal: ctl.signal }, opts));

      // 409 = "we already have a row with that id". That happens when a phone
      // retried after losing signal. It is a success, not a failure.
      if (res.status === 409) return { duplicate: true };

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        const err = new Error("Supabase " + res.status + ": " + text.slice(0, 300));
        // 4xx means the request itself is wrong — retrying will not help.
        if (res.status >= 400 && res.status < 500 && res.status !== 429) err.permanent = true;
        throw err;
      }
      if (res.status === 204) return null;
      const txt = await res.text();
      return txt ? JSON.parse(txt) : null;
    } finally { clearTimeout(t); }
  }

  const q = s => encodeURIComponent(s);

  window.SupabaseAdapter = {
    name: "supabase",

    /* Is the project awake and reachable? Also the thing that detects a
       PAUSED project, which is the single most likely way this breaks. */
    async ping() {
      const url = rest() + "/rooms?select=code&limit=1";
      try {
        await req(url, { headers: headers() }, 6000);
        return true;
      } catch (e) {
        if (/50[0-9]|paused|not found/i.test(e.message)) {
          e.hint = "Your Supabase project may be paused. Open your Supabase " +
                   "dashboard and click Restore, then wait a couple of minutes.";
        }
        throw e;
      }
    },

    async getRoom(code) {
      const rows = await req(
        rest() + "/rooms?select=code,title,phase,current_slide,board_open,active_prompt_id,spotlight_group&code=eq." + q(code),
        { headers: headers() });
      return (rows && rows[0]) || null;
    },

    async listConcerns(code, since) {
      let url = rest() + "/concerns?select=id,ref,prompt_id,body,situation,role,discipline,participant_id,group_id,created_at"
              + "&room_code=eq." + q(code) + "&order=created_at.asc&limit=5000";
      if (since) url += "&created_at=gte." + q(since);
      return (await req(url, { headers: headers() })) || [];
    },

    async listSolutions(code, since) {
      let url = rest() + "/solutions?select=id,ref,group_id,kind,body,reason,outcome,role,discipline,participant_id,created_at"
              + "&room_code=eq." + q(code) + "&order=created_at.asc&limit=5000";
      if (since) url += "&created_at=gte." + q(since);
      return (await req(url, { headers: headers() })) || [];
    },

    async listGroups(code) {
      return (await req(
        rest() + "/groups?select=id,label,problem_statement,rationale,proposal,color_index,sort_order"
        + "&room_code=eq." + q(code) + "&order=sort_order.asc",
        { headers: headers() })) || [];
    },

    async listParticipants(code) {
      return (await req(
        rest() + "/participants?select=id,role,discipline,setting,joined_at&room_code=eq." + q(code) + "&limit=1000",
        { headers: headers() })) || [];
    },

    async join(code, p) {
      return req(rest() + "/participants", {
        method: "POST",
        headers: headers({ "Prefer": "return=minimal,resolution=ignore-duplicates" }),
        body: JSON.stringify({ id: p.id, room_code: code, role: p.role, discipline: p.discipline,
                               setting: p.setting || null })
      });
    },

    async insert(table, payload) {
      return req(rest() + "/" + table, {
        method: "POST",
        headers: headers({ "Prefer": "return=minimal,resolution=ignore-duplicates" }),
        body: JSON.stringify(payload)
      });
    },

    /* ---- facilitator ---- */
    async control(code, token, c) {
      return req(rpc() + "/room_control", {
        method: "POST", headers: headers(),
        body: JSON.stringify({
          p_room: code, p_token: token,
          p_phase:  c.phase  === undefined ? null : c.phase,
          p_slide:  c.slide  === undefined ? null : c.slide,
          p_open:   c.open   === undefined ? null : c.open,
          p_prompt: c.prompt === undefined ? null : (c.prompt === null ? "__null__" : c.prompt),
          p_spot:   c.spotlight === undefined ? null : (c.spotlight === null ? "__null__" : c.spotlight)
        })
      });
    },

    async importGroups(code, token, groups) {
      return req(rpc() + "/import_groups", {
        method: "POST", headers: headers(),
        body: JSON.stringify({ p_room: code, p_token: token, p_groups: groups })
      }, 20000);
    },

    async resetRoom(code, token) {
      return req(rpc() + "/reset_room", {
        method: "POST", headers: headers(),
        body: JSON.stringify({ p_room: code, p_token: token })
      }, 20000);
    }
  };
})();
