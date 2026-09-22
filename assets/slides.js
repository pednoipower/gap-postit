/* ============================================================================
   SLIDES — the one sequence both the projector and the control panel use.
   Built from config, so the number of questions and the number of gaps set
   the number of slides, and the two pages can never disagree about which
   slide is number 5.

   The 45-minute run:
     title → who → question(s) → the gaps → one "react" slide per gap →
     their own ideas → closing

   A slide carries the room changes that picking it implies: which phase the
   phones switch to, which question or gap is active, whether the board is
   open. The "react" slide starts BLIND (phase "react", board open); the
   facilitator presses Reveal, which flips the phase to "reveal" and closes
   the board on that gap — so nothing written after the reveal can have been
   influenced by it.
   ========================================================================== */
(function () {
  "use strict";

  function build(cfg) {
    const out = [
      { key: "title", label: "Title, QR code and room code", phase: "lobby" },
      { key: "who",   label: "Who's in the room",             phase: "lobby" }
    ];
    (cfg.prompts || []).forEach(p => out.push({
      key: "prompt:" + p.id, promptId: p.id, phase: "concerns",
      label: "Question: " + p.title
    }));
    out.push({ key: "evidence", phase: "evidence", label: "The gaps the evidence points to" });
    (cfg.seedThemes || []).forEach((t, i) => out.push({
      key: "react:G" + (i + 1), gapId: "G" + (i + 1), phase: "react",
      label: "Gap G" + (i + 1) + ": " + t.label
    }));
    out.push({ key: "solve",   phase: "solutions", label: "Their own ideas (if / then / because)" });
    out.push({ key: "closing", phase: "closing",   label: "Closing slide" });
    return out;
  }

  /* The room changes implied by moving to slide i. */
  function changesFor(slides, i) {
    const s = slides[Math.max(0, Math.min(slides.length - 1, i))];
    const c = { slide: slides.indexOf(s), phase: s.phase };
    c.prompt    = s.promptId || null;
    c.spotlight = s.gapId || null;
    c.open      = s.phase === "concerns" || s.phase === "react" || s.phase === "solutions";
    return c;
  }

  window.Slides = { build, changesFor };
})();
