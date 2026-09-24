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

  const PAT = /^tmr:(run|hold):(\d+)$/;
  /* A clock older than this is not a clock, it is yesterday: a control panel
     left open overnight, or a timer state nobody cleared. Show nothing
     rather than 1192:01. */
  const STALE_MS = 2 * 60 * 60 * 1000;

  const Timer = {
    _key: null,
    _at: Date.now(),

    read(room) {
      const m = room && room.active_prompt_id && PAT.exec(room.active_prompt_id);
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

  window.Timer = Timer;
})();
