/* ============================================================================
   WORD CLOUD
   ----------------------------------------------------------------------------
   When 400 post-its are on the board, nobody at the back can read any of them.
   The word cloud is the view that still says something at that scale: it shows
   what the room keeps coming back to.

   Words are coloured by which discipline says them most, so you can see at a
   glance whether a worry is shared or belongs to one side of the room.
   ========================================================================== */

(function () {
  "use strict";

  /* Words that carry no meaning on their own. Kept deliberately short: it is
     better to show a slightly noisy cloud than to quietly delete something a
     participant thought was important. */
  const STOP = new Set(("a an and are as at be been being but by can cant cannot could did do does " +
    "doesnt dont for from had has have he her him his how i if in into is it its just me my no not " +
    "of on or our out she should so some such than that the their them then there these they this " +
    "those to too us very was we were what when where which who why will with would you your it's " +
    "i'm we're don't doesn't isn't aren't get got have has had am been more most much many lot lots " +
    "thing things also even still yet about over under after before because").split(/\s+/));

  /* Scripts written without spaces between words — Thai, Lao, Khmer, Chinese,
     Japanese — cannot be split into words by looking for spaces. We keep such
     a phrase whole rather than chopping it up, and leave it out of the cloud
     rather than showing a meaningless fragment on a wall-sized screen. Those
     answers still appear in full on the post-it wall and in every export.

     Note `\p{M}`: Thai vowels and tone marks are "marks", not "letters". Leave
     them out of the allowed set and every Thai word shatters into syllables. */
  const UNSEGMENTED = /[\u0E00-\u0E7F\u0E80-\u0EFF\u1780-\u17FF\u3040-\u30FF\u4E00-\u9FFF]/;

  function tokenise(text) {
    return String(text)
      .toLowerCase()
      .replace(/[^\p{L}\p{M}\p{N}\s'-]/gu, " ")
      .split(/\s+/)
      .map(w => w.replace(/^[-']+|[-']+$/g, ""))
      .filter(w => {
        if (w.length <= 2 || STOP.has(w) || /^\d+$/.test(w)) return false;
        // an unsegmented run longer than a plausible single word is a phrase
        if (UNSEGMENTED.test(w) && w.length > 14) return false;
        return true;
      });
  }

  function tally(notes) {
    const counts = new Map();
    for (const n of notes) {
      const seen = new Set();                 // one note counts a word once
      for (const w of tokenise(n.body)) {
        if (seen.has(w)) continue;
        seen.add(w);
        const e = counts.get(w) || { word: w, n: 0, by: {} };
        e.n++;
        e.by[n.discipline] = (e.by[n.discipline] || 0) + 1;
        counts.set(w, e);
      }
    }
    return [...counts.values()].sort((a, b) => b.n - a.n);
  }

  /* Lay words out on a widening spiral, keeping any that do not overlap
     something already placed. Boxes are compared rather than pixels — plenty
     accurate at this size and fast enough to redraw as answers arrive. */
  function layout(words, W, H, opts) {
    opts = opts || {};
    const ctx = document.createElement("canvas").getContext("2d");
    const family = opts.family ||
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans Thai", sans-serif';
    const maxN = words.length ? words[0].n : 1;
    const minSize = opts.minSize || 13;
    const maxSize = opts.maxSize || Math.min(W, H) * 0.14;

    const placed = [];
    const hits = (a) => placed.some(b =>
      !(a.x + a.w < b.x || b.x + b.w < a.x || a.y + a.h < b.y || b.y + b.h < a.y));

    const limit = Math.min(words.length, opts.max || 110);
    for (let i = 0; i < limit; i++) {
      const word = words[i];
      /* Scale from the LOWEST count upwards, not from zero. Otherwise, early in
         a round when almost every word has been said once, everything comes out
         nearly the same size and the cloud says nothing. This way a word only
         grows once the room starts repeating it. */
      const span = Math.max(1, maxN - 1);
      const t = Math.sqrt(Math.max(0, word.n - 1) / span);
      const size = Math.max(minSize, Math.round(minSize + (maxSize - minSize) * t));
      ctx.font = `700 ${size}px ${family}`;
      const w = ctx.measureText(word.word).width;
      const h = size * 1.06;

      let angle = (i % 7) * 0.9, radius = 0, ok = null;
      const step = Math.max(2.4, Math.min(W, H) / 170);
      for (let tries = 0; tries < 2600; tries++) {
        const cx = W / 2 + radius * Math.cos(angle) * 1.55;   // wider than tall
        const cy = H / 2 + radius * Math.sin(angle) * 0.85;
        const box = { x: cx - w / 2, y: cy - h / 2, w: w + 8, h: h + 5 };
        if (box.x > 4 && box.y > 4 && box.x + box.w < W - 4 && box.y + box.h < H - 4 && !hits(box)) {
          ok = { ...box, cx, cy, size, word: word.word, n: word.n, by: word.by };
          break;
        }
        angle += 0.32;
        radius += step * 0.055;
      }
      if (ok) placed.push(ok);
    }
    return placed;
  }

  /* Which discipline owns this word? Strongly one-sided words take that
     discipline's colour; words both sides use are drawn neutral, which is
     usually the most interesting thing on the slide. */
  function colorOf(entry, colors) {
    const keys = Object.keys(entry.by);
    if (!keys.length) return "#C4CCDD";
    const total = keys.reduce((s, k) => s + entry.by[k], 0);
    let top = keys[0];
    for (const k of keys) if (entry.by[k] > entry.by[top]) top = k;
    const share = entry.by[top] / total;
    if (share < 0.62) return "#AEB8CC";                 // genuinely shared
    const c = colors[top] || colors.fallback;
    return c ? c.glow : "#AEB8CC";
  }

  function render(container, notes, opts) {
    opts = opts || {};
    const colors = (window.CONFIG && window.CONFIG.colors) || {};
    const W = container.clientWidth, H = container.clientHeight;
    if (W < 40 || H < 40) return [];

    const words = tally(notes);
    const placed = layout(words, W, H, opts);

    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("width", W);
    svg.setAttribute("height", H);
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);

    for (const p of placed) {
      const t = document.createElementNS(NS, "text");
      t.setAttribute("x", p.cx);
      t.setAttribute("y", p.cy);
      t.setAttribute("text-anchor", "middle");
      t.setAttribute("dominant-baseline", "central");
      t.setAttribute("font-size", p.size);
      t.setAttribute("font-weight", "700");
      t.setAttribute("fill", colorOf(p, colors));
      t.setAttribute("font-family",
        'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans Thai", sans-serif');
      t.textContent = p.word;
      const title = document.createElementNS(NS, "title");
      title.textContent = `${p.word} — said in ${p.n} note${p.n === 1 ? "" : "s"}`;
      t.appendChild(title);
      svg.appendChild(t);
    }

    container.replaceChildren(svg);
    return placed;
  }

  window.WordCloud = { render, tally, tokenise };
})();
