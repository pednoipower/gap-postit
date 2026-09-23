/* ============================================================================
   PAPER
   ----------------------------------------------------------------------------
   Everything the projector draws is paper: the gaps are cards, the notes are
   post-its. Nothing interlocks, nothing is a puzzle piece — the room is
   looking at a wall of notes, which is what it is.

   COLOUR carries discipline — nephrology against palliative care — and a
   small MARK in the corner carries role, so the two signals never compete for
   the same channel. Someone who is colour-blind can still read the marks;
   someone at the back of the room can still read the colours.
   ========================================================================== */

(function () {
  "use strict";

  /* A paler version of a colour: paper is pale, its edge is not. */
  function tint(hex, amount) {
    const h = hex.replace("#", "");
    const n = parseInt(h.length === 3 ? h.split("").map(c => c + c).join("") : h, 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    const m = v => Math.round(v + (255 - v) * amount);
    return "#" + [m(r), m(g), m(b)].map(v => v.toString(16).padStart(2, "0")).join("");
  }

  const PALETTE = {};
  function colorFor(discipline) {
    if (!Object.keys(PALETTE).length) {
      const c = (window.CONFIG && window.CONFIG.colors) || {};
      Object.assign(PALETTE, c);
    }
    return PALETTE[discipline] || PALETTE.fallback ||
           { base: "#8C8FA3", ink: "#1B1C24", glow: "#C3C6D8" };
  }

  /* Doctor / nurse / allied is shown as a small mark in the corner rather than
     another colour, so it layers on top of discipline instead of fighting it. */
  const ROLE_MARK = {
    doctor: "M2 7h10M7 2v10",                       // a cross
    nurse:  "M7 2 L12 7 L7 12 L2 7 Z",              // a diamond
    allied: "M2 9 L7 3 L12 9 Z",                    // a triangle
    other:  "M7 7 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0"  // a circle
  };

  /* ------------------------------------------------------------------------
     A plain post-it: a square of paper on a wall, nothing more. Pale
     discipline colour, strong edge, dark text, role mark in the corner.
     ---------------------------------------------------------------------- */
  function postitSVG(opts) {
    const w = opts.width || 240;
    const h = opts.height || 150;
    const col = colorFor(opts.discipline);
    const pad = 10;                          // just enough for the shadow

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `${-pad} ${-pad} ${w + pad * 2} ${h + pad * 2}`);
    svg.setAttribute("width", w + pad * 2);
    svg.setAttribute("height", h + pad * 2);
    svg.style.overflow = "visible";

    const shadow = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    shadow.setAttribute("x", 3); shadow.setAttribute("y", 5);
    shadow.setAttribute("width", w); shadow.setAttribute("height", h);
    shadow.setAttribute("rx", 3);
    shadow.setAttribute("fill", "rgba(0,0,0,.34)");
    svg.appendChild(shadow);

    const paper = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    paper.setAttribute("x", 0); paper.setAttribute("y", 0);
    paper.setAttribute("width", w); paper.setAttribute("height", h);
    paper.setAttribute("rx", 3);
    paper.setAttribute("fill", tint(col.base, 0.68));
    paper.setAttribute("stroke", col.base);
    paper.setAttribute("stroke-width", "2.2");
    svg.appendChild(paper);

    // a strip of full colour along the top, like the glue edge of a real one
    const strip = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    strip.setAttribute("x", 0); strip.setAttribute("y", 0);
    strip.setAttribute("width", w); strip.setAttribute("height", Math.max(6, h * 0.07));
    strip.setAttribute("rx", 3);
    strip.setAttribute("fill", col.base);
    strip.setAttribute("opacity", ".55");
    svg.appendChild(strip);

    if (opts.role && ROLE_MARK[opts.role]) {
      const mk = document.createElementNS("http://www.w3.org/2000/svg", "path");
      mk.setAttribute("d", ROLE_MARK[opts.role]);
      mk.setAttribute("transform", `translate(${w * 0.045}, ${h * 0.12}) scale(${Math.min(w,h)/150})`);
      mk.setAttribute("stroke", col.base);
      mk.setAttribute("stroke-width", "1.9");
      mk.setAttribute("stroke-linecap", "round");
      mk.setAttribute("fill", opts.role === "nurse" || opts.role === "allied" ? col.base : "none");
      mk.setAttribute("opacity", ".75");
      svg.appendChild(mk);
    }

    // optional tag in the top-right corner, e.g. which gap an idea answers
    if (opts.tag) {
      const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
      t.setAttribute("x", w * 0.95); t.setAttribute("y", h * 0.2);
      t.setAttribute("text-anchor", "end");
      t.setAttribute("font-size", Math.max(10, Math.round(h / 11)));
      t.setAttribute("font-weight", "800");
      t.setAttribute("font-family", "ui-sans-serif, system-ui, sans-serif");
      t.setAttribute("fill", opts.tagColor || col.ink);
      t.setAttribute("opacity", ".9");
      t.textContent = opts.tag;
      svg.appendChild(t);
    }

    return { svg, color: col, pad, fill: tint(col.base, 0.68), ink: col.ink };
  }

  /* ------------------------------------------------------------------------
     A gap card: a dark card with a coloured
     edge and a band of the same colour along the top, so it reads as one of
     the notes on the wall rather than as a shape waiting to be slotted in.
     Same call signature as before, so the projector needs no special case.
     ---------------------------------------------------------------------- */
  function problemSVG(opts) {
    const w = opts.width || 420, h = opts.height || 260;
    const pad = opts.pad != null ? opts.pad : 8;   // room for the shadow only
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `${-pad} ${-pad} ${w + pad*2} ${h + pad*2}`);
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.overflow = "visible";

    const accent = opts.accent || "#6E7BA8";
    const r = Math.max(4, Math.min(w, h) * 0.035);
    const rect = (x, y, rw, rh, rx) => {
      const e = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      e.setAttribute("x", x); e.setAttribute("y", y);
      e.setAttribute("width", rw); e.setAttribute("height", rh);
      e.setAttribute("rx", rx);
      return e;
    };

    const shadow = rect(3, 6, w, h, r);
    shadow.setAttribute("fill", "rgba(0,0,0,.42)");
    svg.appendChild(shadow);

    const card = rect(0, 0, w, h, r);
    card.setAttribute("fill", "#15352c");      // Nuvo dark surface
    card.setAttribute("stroke", accent);
    card.setAttribute("stroke-width", "2.4");
    svg.appendChild(card);

    // the coloured band across the top, like the glued edge of a post-it
    const strip = rect(0, 0, w, Math.max(5, h * 0.045), r);
    strip.setAttribute("fill", accent);
    strip.setAttribute("opacity", ".85");
    svg.appendChild(strip);

    return { svg, pad };
  }

  /* Word-wrap text onto an SVG card. SVG has no automatic wrapping, so we
     measure and break the lines ourselves, and shrink the type if someone
     wrote a lot. */
  function layoutText(svgEl, text, box, opts) {
    opts = opts || {};
    const NS = "http://www.w3.org/2000/svg";
    const maxW = box.w, maxH = box.h;
    let size = opts.size || 16;
    const minSize = opts.min || 9;
    // Chula Nuvo's text face; the SVG has no stylesheet of its own, so the
    // stack is spelled out here and ends in Sarabun like every other stack
    const family = opts.family ||
      '"Anuphan", "Sarabun", ui-sans-serif, system-ui, -apple-system, "Noto Sans Thai", sans-serif';

    // Measuring with a canvas rather than the page means this works even
    // before the card has been added to the document. Measuring a detached
    // SVG silently returns zero width, which is how you end up with text
    // running straight off the edge of a card.
    const ctx = (layoutText._ctx ||
      (layoutText._ctx = document.createElement("canvas").getContext("2d")));

    /* Thai, Lao, Khmer and friends do not put spaces between words, so
       splitting on whitespace would treat a whole Thai sentence as one word.
       The browser's own segmenter knows where Thai words end; where it is
       missing (very old phones) we fall back to spaces. Each token keeps its
       trailing space so lines can simply be concatenated. */
    const tokens = (() => {
      const str = String(text);
      if (typeof Intl !== "undefined" && Intl.Segmenter) {
        const seg = new Intl.Segmenter(undefined, { granularity: "word" });
        return Array.from(seg.segment(str), x => x.segment).filter(Boolean);
      }
      return str.split(/(\s+)/).filter(Boolean);
    })();
    const hyphenate = tok => /[A-Za-z]/.test(tok);   // Thai does not take a hyphen

    function wrapAt(fs) {
      ctx.font = `${opts.weight || 600} ${fs}px ${family}`;
      const lines = []; let line = "";
      for (const tok of tokens) {
        if (/^\s+$/.test(tok)) { if (line) line += " "; continue; }
        const test = line + tok;
        if (ctx.measureText(test).width > maxW && line.trim()) { lines.push(line.trimEnd()); line = tok; }
        else line = test;
      }
      if (line.trim()) lines.push(line.trimEnd());
      // a single word longer than the card still has to be broken somewhere
      const out = [];
      for (let ln of lines) {
        while (ctx.measureText(ln).width > maxW && ln.length > 1) {
          const hy = hyphenate(ln) ? "-" : "";
          let cut = ln.length;
          while (cut > 1 && ctx.measureText(ln.slice(0, cut) + hy).width > maxW) cut--;
          out.push(ln.slice(0, cut) + hy); ln = ln.slice(cut);
        }
        if (ln) out.push(ln);
      }
      return out;
    }

    /* Shrink the type until the longest single word fits across the card.
       Without this, a word like "deteriorates" gets chopped in half, which
       looks like a bug to everyone in the room. Breaking a word is the last
       resort, not the first. */
    const words = tokens.map(t => t.trim()).filter(Boolean);
    const widest = fs => {
      ctx.font = `${opts.weight || 600} ${fs}px ${family}`;
      return words.reduce((m, w) => Math.max(m, ctx.measureText(w).width), 0);
    };
    while (widest(size) > maxW && size > minSize) size -= 1;

    let lines = wrapAt(size);
    while (lines.length * size * 1.28 > maxH && size > minSize) {
      size -= 1;
      lines = wrapAt(size);
    }
    if (lines.length * size * 1.28 > maxH) {
      const fit = Math.max(1, Math.floor(maxH / (size * 1.28)));
      lines = lines.slice(0, fit);
      lines[lines.length - 1] = lines[lines.length - 1].replace(/.{0,2}$/, "…");
    }
    const t = document.createElementNS(NS, "text");
    t.setAttribute("font-family", family);
    t.setAttribute("font-size", size);
    t.setAttribute("font-weight", opts.weight || "600");
    t.setAttribute("fill", opts.fill || "#fff");
    const blockH = lines.length * size * 1.28;
    const startY = box.y + (maxH - blockH) / 2 + size * 0.95;
    /* opts.mark picks a phrase out of the text in another colour. A phrase
       can wrap, so the runs carry state from one line to the next. */
    const mark = opts.mark && opts.mark.text ? opts.mark : null;
    const state = {};
    lines.forEach((ln, i) => {
      const ts = document.createElementNS(NS, "tspan");
      ts.setAttribute("x", box.x);
      ts.setAttribute("y", startY + i * size * 1.28);
      if (mark && window.Highlight) {
        for (const run of window.Highlight.runs(ln, mark.text, state)) {
          if (!run.t) continue;
          if (!run.on) { ts.appendChild(document.createTextNode(run.t)); continue; }
          const em = document.createElementNS(NS, "tspan");
          em.setAttribute("fill", mark.fill || "#ec88ac");
          em.textContent = run.t;
          ts.appendChild(em);
        }
      } else {
        ts.textContent = ln;
      }
      t.appendChild(ts);
    });
    svgEl.appendChild(t);
    return { size, lines: lines.length };
  }

  window.Paper = { postitSVG, problemSVG, layoutText, colorFor, tint, ROLE_MARK };
  if (typeof module !== "undefined" && module.exports)
    module.exports = { postitSVG, problemSVG, tint };
})();
