/* ============================================================================
   THE ROUND CLOCK — one clock, two screens.
   ----------------------------------------------------------------------------
   The facilitator starts, pauses and resets the clock from the control panel;
   the projector shows the same seconds. So the state has to live in the room
   rather than in either page, and it rides in the room's `active_prompt_id`
   column, which the 45-minute format no longer uses for prompts:

     tmr:run:<epoch ms the clock is counting from>
     tmr:hold:<milliseconds already elapsed>

   Moving to another slide clears the column (slides.js sends prompt: null),
   so every round starts its own clock without anyone pressing anything. Until
   somebody pauses, both pages simply count from the moment the room last
   moved — which is why a clock is running the instant a slide appears.
   ========================================================================== */
(function () {
  "use strict";

  /* `active_prompt_id` carries a few small flags for the room, separated by
     a pipe: the round clock, and whether the room has been switched to the
     backup form. Two flags in one column, because adding a column would mean
     SQL everyone has to remember to run. */
  const PAT = /^tmr:(run|hold):(\d+)$/;
  const FORM = "form";

  function tokens(room) {
    return String((room && room.active_prompt_id) || "").split("|").filter(Boolean);
  }
  /* A clock older than this is not a clock, it is yesterday: a control panel
     left open overnight, or a timer state nobody cleared. Show nothing
     rather than 1192:01. */
  const STALE_MS = 2 * 60 * 60 * 1000;

  const Timer = {
    _key: null,
    _at: Date.now(),

    read(room) {
      const m = tokens(room).map(t => PAT.exec(t)).find(Boolean);
      if (!m) return null;
      const st = { state: m[1], value: Number(m[2]) };
      if (st.state === "run" && Date.now() - st.value > STALE_MS) return null;
      if (st.state === "hold" && st.value > STALE_MS) return null;
      return st;
    },

    /* True when the clock has been running longer than any round could last:
       the page has been open since another day, not since this slide. */
    stale(room) { return this.elapsed(room) > STALE_MS; },

    /* Milliseconds on the clock right now. */
    elapsed(room) {
      const st = this.read(room);
      if (st && st.state === "run")  return Math.max(0, Date.now() - st.value);
      if (st && st.state === "hold") return st.value;
      return Math.max(0, Date.now() - this._localStart(room));
    },

    held(room) { const st = this.read(room); return !!st && st.state === "hold"; },

    /* No state in the room: count from when the room last moved. Each page
       keeps this itself, which is exact enough — they both learn about the
       move within one poll. */
    _localStart(room) {
      const key = room ? (room.current_slide | 0) + ":" + room.phase : "none";
      if (key !== this._key) { this._key = key; this._at = Date.now(); }
      return this._at;
    },

    /* ---- what the control panel writes ---- */
    runFrom(elapsedMs) { return "tmr:run:" + (Date.now() - Math.max(0, elapsedMs)); },
    holdAt(elapsedMs)  { return "tmr:hold:" + Math.max(0, Math.round(elapsedMs)); },
    fromZero()         { return "tmr:run:" + Date.now(); },

    mmss(secs) {
      secs = Math.max(0, Math.floor(secs));
      return Math.floor(secs / 60) + ":" + String(secs % 60).padStart(2, "0");
    }
  };

  /* The backup form: on or off for the whole room, set from the control
     panel, and kept through a slide change — the timer is not. */
  window.RoomMode = {
    formOn(room) { return tokens(room).includes(FORM); },
    /* Build a new value: keep the form flag if asked, carry or drop the clock. */
    compose(opts) {
      const out = [];
      if (opts.timer) out.push(opts.timer);
      if (opts.form) out.push(FORM);
      return out.length ? out.join("|") : null;
    },
    timerToken(room) {
      const t = tokens(room).find(x => PAT.test(x));
      return t || null;
    }
  };

  window.Timer = Timer;
})();
