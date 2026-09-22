/* ============================================================================
   SLIDES — the one sequence both the projector and the control panel use.
   Built from config, so the number of gaps sets the number of slides, and
   the two pages can never disagree about which slide is number 5.

   The 45-minute run:
     title → who → the gaps (with the survey numbers)
     → for each gap: WHY is this happening here?  then  HOW would we fix it?
     → an overall round for ideas not about one gap → closing

   Each "why" and "how" slide collects BLIND (projector shows a count) until
   the facilitator presses Reveal, which flips the phase to "why_reveal" /
   "how_reveal" and closes the board — so nothing written after the reveal
   can have been shaped by what is on screen.
   ========================================================================== */
(function () {
  "use strict";

  const OVERALL = "GX";

  function build(cfg) {
    const out = [
      { key: "title",    label: "Title, QR code and room code", phase: "lobby" },
      { key: "who",      label: "Who's in the room",             phase: "lobby" },
      { key: "evidence", label: "The gaps from the pre-survey",  phase: "evidence" }
    ];
    (cfg.seedThemes || []).forEach((t, i) => {
      const id = "G" + (i + 1);
      out.push({ key: "why:" + id, gapId: id, phase: "why", label: id + " — why is this happening? · " + t.label });
      out.push({ key: "how:" + id, gapId: id, phase: "how", label: id + " — how would we fix it? · " + t.label });
    });
    out.push({ key: "how:" + OVERALL, gapId: OVERALL, phase: "how", label: "Overall — ideas not about one gap" });
    out.push({ key: "closing", phase: "closing", label: "Closing slide" });
    return out;
  }

  /* The room changes implied by moving to slide i. */
  function changesFor(slides, i) {
    const s = slides[Math.max(0, Math.min(slides.length - 1, i))];
    return {
      slide: slides.indexOf(s), phase: s.phase,
      prompt: null,
      spotlight: s.gapId || null,
      open: s.phase === "why" || s.phase === "how"
    };
  }

  /* Reveal / un-reveal for the current slide. */
  function revealChanges(slide, revealed) {
    if (!slide || !slide.gapId) return null;
    return revealed
      ? { phase: slide.phase === "why" || slide.phase === "why_reveal" ? "why_reveal" : "how_reveal", open: false }
      : { phase: slide.phase === "why" || slide.phase === "why_reveal" ? "why" : "how", open: true };
  }

  window.Slides = { build, changesFor, revealChanges, OVERALL };
})();
