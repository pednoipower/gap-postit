/* ============================================================================
   THE WORDS THAT MATTER
   ----------------------------------------------------------------------------
   Each gap in config.js carries a `highlight`: the few words inside its
   sentence that the room should catch first — ระบบคัดกรอง, ระบบส่งต่อ,
   เฉพาะผู้ป่วยซับซ้อน, การทำ ACP ยังจำกัด. They are picked out in Blossom Pink
   wherever the gap is shown, on the wall and on the phone, which is the one
   job pink has in this design.

   The gaps reach the pages from the room, not from config, and the room's
   `groups` table has no column for this — so the highlight is looked up by
   matching the label text. That keeps the database untouched: nobody has to
   re-run schema.sql to change which words are picked out.

   Matching is done on the WHOLE sentence and then mapped onto the wrapped
   lines by character offset. Guessing per line — "this line ends with the
   first few characters of the phrase, so it must be the start of it" — marks
   การ inside อาการทรุด, which is what the first version did on the wall.
   ========================================================================== */
(function () {
  "use strict";

  function forLabel(label) {
    const cfg = window.CONFIG || {};
    const hit = (cfg.seedThemes || []).find(t => t.label === label);
    return (hit && hit.highlight) || "";
  }

  /* Every [start, end) of the phrase inside the text. */
  function spans(text, mark) {
    const out = [];
    if (!mark || !text) return out;
    let i = text.indexOf(mark);
    while (i >= 0) { out.push([i, i + mark.length]); i = text.indexOf(mark, i + mark.length); }
    return out;
  }

  /* Where each wrapped line begins in the original text. Wrapping collapses
     runs of whitespace and can add a hyphen, so the cursor walks the text
     and the line together rather than assuming they are identical. */
  function lineStarts(text, lines) {
    const starts = [];
    let c = 0;
    for (const ln of lines) {
      while (c < text.length && /\s/.test(text[c])) c++;
      starts.push(c);
      for (const ch of ln) {
        if (c < text.length && text[c] === ch) c++;
        else if (/\s/.test(ch)) { while (c < text.length && /\s/.test(text[c])) c++; }
        // anything else the layout added (a hyphen, an ellipsis) has no
        // counterpart in the text: leave the cursor where it is
      }
    }
    return starts;
  }

  /* Runs for one line, given its offset in the text. */
  function runsAt(line, start, marks) {
    const out = [];
    let i = 0;
    for (const [a, b] of marks) {
      const from = Math.max(0, a - start), to = Math.min(line.length, b - start);
      if (to <= 0 || from >= line.length || to <= from) continue;
      if (from > i) out.push({ t: line.slice(i, from), on: false });
      out.push({ t: line.slice(from, to), on: true });
      i = to;
    }
    if (i < line.length) out.push({ t: line.slice(i), on: false });
    return out.length ? out : [{ t: line, on: false }];
  }

  /* The whole wrapped paragraph, line by line. */
  function lineRuns(text, mark, lines) {
    const marks = spans(text, mark);
    if (!marks.length) return lines.map(ln => [{ t: ln, on: false }]);
    const starts = lineStarts(text, lines);
    return lines.map((ln, i) => runsAt(ln, starts[i], marks));
  }

  /* One unwrapped string, for the HTML surfaces. `esc` is the page's own
     escaper. */
  function html(label, esc) {
    const mark = forLabel(label);
    if (!mark) return esc(label);
    return runsAt(label, 0, spans(label, mark))
      .map(r => r.on ? '<em class="hl">' + esc(r.t) + "</em>" : esc(r.t))
      .join("");
  }

  window.Highlight = { forLabel, spans, lineRuns, html };
})();
