/* ============================================================================
   JIGSAW PIECES
   ----------------------------------------------------------------------------
   The whole workshop metaphor lives in this file.

   SHAPE carries meaning, and it is deliberately not colour:

     A CONCERN  has a NOTCH bitten out of it.  Something is missing.
     A SOLUTION has a TAB sticking out of it.  Something fills a gap.
     A PROBLEM  is a large piece with several notches around its edge,
                waiting for solutions to be plugged into them.

   A solution's tab is exactly the shape of a concern's notch, so on screen
   they visibly belong together. That is the point being made in the room:
   neither discipline is complete on its own.

   COLOUR is kept for discipline — nephrology against palliative care — so the
   two signals never compete for the same channel. Someone who is colour-blind
   can still read the shapes; someone at the back of the room can still read
   the colours.
   ========================================================================== */

(function () {
  "use strict";

  /* One edge of a piece, drawn as a smooth curve.
     `bump` is  +1 for a tab sticking out, -1 for a notch cut in, 0 for flat.
     Everything is in a 0..1 space and then scaled, so pieces stay the same
     shape at any size. */
  function edgePath(x0, y0, x1, y1, bump, depthRatio) {
    if (!bump) return `L ${x1} ${y1}`;

    const dx = x1 - x0, dy = y1 - y0;
    const len = Math.hypot(dx, dy);
    const ux = dx / len, uy = dy / len;      // along the edge
    const nx = -uy, ny = ux;                 // at right angles to it
    // Each edge is drawn in a different direction as we go round the piece, so
    // "outwards" points a different way each time. Negating here makes the sign
    // mean the same thing on all four sides:  +1 sticks out, -1 cuts in.
    const d = len * (depthRatio || 0.19) * -bump;

    // Points along the edge where the knob starts, peaks and ends
    const P = (t, off) => [
      x0 + ux * len * t + nx * off,
      y0 + uy * len * t + ny * off
    ];

    const a  = P(0.36, 0);
    const c1 = P(0.30, d * 0.10);
    const c2 = P(0.30, d * 0.82);
    const b  = P(0.42, d * 0.94);
    const c3 = P(0.47, d * 1.22);
    const c4 = P(0.53, d * 1.22);
    const c5 = P(0.58, d * 0.94);
    const c6 = P(0.70, d * 0.82);
    const c7 = P(0.70, d * 0.10);
    const e  = P(0.64, 0);

    return `L ${a[0]} ${a[1]} `
         + `C ${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${b[0]} ${b[1]} `
         + `C ${c3[0]} ${c3[1]} ${c4[0]} ${c4[1]} ${c5[0]} ${c5[1]} `
         + `C ${c6[0]} ${c6[1]} ${c7[0]} ${c7[1]} ${e[0]} ${e[1]} `
         + `L ${x1} ${y1}`;
  }

  /* A four-sided piece. `edges` is {top,right,bottom,left}, each -1, 0 or +1.
     Corners are slightly rounded so the pieces feel like paper, not glass. */
  function piecePath(w, h, edges, depth) {
    const e = Object.assign({ top: 0, right: 0, bottom: 0, left: 0 }, edges || {});
    const r = Math.min(w, h) * 0.055;

    let d = `M ${r} 0 `;
    d += edgePath(r, 0, w - r, 0, e.top, depth);
    d += ` Q ${w} 0 ${w} ${r} `;
    d += edgePath(w, r, w, h - r, e.right, depth);
    d += ` Q ${w} ${h} ${w - r} ${h} `;
    d += edgePath(w - r, h, r, h, e.bottom, depth);
    d += ` Q 0 ${h} 0 ${h - r} `;
    d += edgePath(0, h - r, 0, r, e.left, depth);
    d += ` Q 0 0 ${r} 0 Z`;
    return d;
  }

  /* Mix a colour towards white. Used to turn the strong discipline colour into
     a paper-like note that still reads as that discipline from the back row. */
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
     A single note as an SVG element.
     kind: "concern" (notch on the right) | "solution" (tab on the left)
     ---------------------------------------------------------------------- */
  function noteSVG(opts) {
    const w = opts.width || 240;
    const h = opts.height || 150;
    const kind = opts.kind || "concern";
    const col = colorFor(opts.discipline);

    // Concerns are open on the right; solutions reach out to the left.
    const edges = kind === "concern"
      ? { right: -1 }
      : { left: 1 };

    const pad = Math.max(w, h) * 0.22;      // room for a tab to stick out
    const vb = `${-pad} ${-pad} ${w + pad * 2} ${h + pad * 2}`;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", vb);
    svg.setAttribute("width", w + pad * 2);
    svg.setAttribute("height", h + pad * 2);
    svg.style.overflow = "visible";

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

    const shadow = document.createElementNS("http://www.w3.org/2000/svg", "path");
    shadow.setAttribute("d", piecePath(w, h, edges));
    shadow.setAttribute("fill", "rgba(0,0,0,.34)");
    shadow.setAttribute("transform", "translate(2.5,4)");
    g.appendChild(shadow);

    /* The note is a pale version of the discipline colour with a strong edge of
       the full colour, and dark text on top. Bright colour with white text
       looked fine on a laptop and washed out badly on a projector — dark text
       on pale paper is what survives a weak bulb and a lit room. */
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", piecePath(w, h, edges));
    path.setAttribute("fill", tint(col.base, 0.68));
    path.setAttribute("stroke", col.base);
    path.setAttribute("stroke-width", "2.2");
    g.appendChild(path);

    // role mark, tucked into the top-left so it never covers the words
    if (opts.role && ROLE_MARK[opts.role]) {
      const mk = document.createElementNS("http://www.w3.org/2000/svg", "path");
      mk.setAttribute("d", ROLE_MARK[opts.role]);
      mk.setAttribute("transform", `translate(${w * 0.045}, ${h * 0.05}) scale(${Math.min(w,h)/150})`);
      mk.setAttribute("stroke", col.base);
      mk.setAttribute("stroke-width", "1.9");
      mk.setAttribute("stroke-linecap", "round");
      mk.setAttribute("fill", opts.role === "nurse" || opts.role === "allied" ? col.base : "none");
      mk.setAttribute("opacity", ".75");
      g.appendChild(mk);
    }

    svg.appendChild(g);
    return { svg, color: col, pad, fill: tint(col.base, 0.68), ink: col.ink };
  }

  /* ------------------------------------------------------------------------
     A problem statement: a big piece with a notch for every solution slot.
     Notches alternate around the edge so that, when solutions plug in, the
     two disciplines end up interlocking around the same problem.
     ---------------------------------------------------------------------- */
  function problemSVG(opts) {
    const w = opts.width || 420, h = opts.height || 260;
    const pad = Math.max(w, h) * 0.2;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `${-pad} ${-pad} ${w + pad*2} ${h + pad*2}`);
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.overflow = "visible";

    const accent = opts.accent || "#6E7BA8";
    const d = piecePath(w, h, { left: -1, right: -1, top: -1, bottom: -1 }, 0.13);

    const shadow = document.createElementNS("http://www.w3.org/2000/svg", "path");
    shadow.setAttribute("d", d);
    shadow.setAttribute("fill", "rgba(0,0,0,.42)");
    shadow.setAttribute("transform", "translate(3,6)");
    svg.appendChild(shadow);

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    path.setAttribute("fill", "#1A2030");
    path.setAttribute("stroke", accent);
    path.setAttribute("stroke-width", "2.4");
    svg.appendChild(path);

    return { svg, pathData: d, pad };
  }

  /* Word-wrap text onto an SVG piece. SVG has no automatic wrapping, so we
     measure and break the lines ourselves, and shrink the type if someone
     wrote a lot. */
  function layoutText(svgEl, text, box, opts) {
    opts = opts || {};
    const NS = "http://www.w3.org/2000/svg";
    const maxW = box.w, maxH = box.h;
    let size = opts.size || 16;
    const minSize = opts.min || 9;
    const family = opts.family ||
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans Thai", sans-serif';

    // Measuring with a canvas rather than the page means this works even
    // before the piece has been added to the document. Measuring a detached
    // SVG silently returns zero width, which is how you end up with text
    // running straight off the edge of a piece.
    const ctx = (layoutText._ctx ||
      (layoutText._ctx = document.createElement("canvas").getContext("2d")));

    function wrapAt(fs) {
      ctx.font = `${opts.weight || 600} ${fs}px ${family}`;
      const words = String(text).split(/\s+/).filter(Boolean);
      const lines = []; let line = "";
      for (const word of words) {
        const test = line ? line + " " + word : word;
        if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = word; }
        else line = test;
      }
      // a single word longer than the piece still has to be broken somewhere
      const out = [];
      for (let ln of (line ? lines.concat([line]) : lines)) {
        while (ctx.measureText(ln).width > maxW && ln.length > 1) {
          let cut = ln.length;
          while (cut > 1 && ctx.measureText(ln.slice(0, cut) + "-").width > maxW) cut--;
          out.push(ln.slice(0, cut) + "-"); ln = ln.slice(cut);
        }
        if (ln) out.push(ln);
      }
      return out;
    }

    /* Shrink the type until the longest single word fits across the piece.
       Without this, a word like "deteriorates" gets chopped in half, which
       looks like a bug to everyone in the room. Breaking a word is the last
       resort, not the first. */
    const words = String(text).split(/\s+/).filter(Boolean);
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
    lines.forEach((ln, i) => {
      const ts = document.createElementNS(NS, "tspan");
      ts.setAttribute("x", box.x);
      ts.setAttribute("y", startY + i * size * 1.28);
      ts.textContent = ln;
      t.appendChild(ts);
    });
    svgEl.appendChild(t);
    return { size, lines: lines.length };
  }

  window.Jigsaw = { piecePath, noteSVG, problemSVG, layoutText, colorFor, tint, ROLE_MARK };
  if (typeof module !== "undefined" && module.exports)
    module.exports = { piecePath, edgePath };
})();
