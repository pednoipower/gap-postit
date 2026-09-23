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
   ========================================================================== */
(function () {
  "use strict";

  function forLabel(label) {
    const cfg = window.CONFIG || {};
    const hit = (cfg.seedThemes || []).find(t => t.label === label);
    return (hit && hit.highlight) || "";
  }

  /* Split one line into runs, marked or not. `state` carries across the lines
     of a wrapped paragraph: Thai wraps mid-phrase, so a highlight can begin on
     one line and finish on the next. */
  function runs(line, mark, state) {
    state = state || {};
    if (!mark || !line) return [{ t: line, on: false }];
    const out = [];
    let i = 0;

    // finishing a highlight that began on the line before
    if (state.pending) {
      const tail = state.pending;
      if (line.startsWith(tail)) { out.push({ t: tail, on: true }); i = tail.length; state.pending = ""; }
      else if (tail.startsWith(line)) { state.pending = tail.slice(line.length); return [{ t: line, on: true }]; }
      else state.pending = "";
    }

    let at = line.indexOf(mark, i);
    while (at >= 0) {
      if (at > i) out.push({ t: line.slice(i, at), on: false });
      out.push({ t: mark, on: true });
      i = at + mark.length;
      at = line.indexOf(mark, i);
    }

    // the highlight may start here and run onto the next line
    if (i < line.length) {
      const rest = line.slice(i);
      let split = 0;
      for (let n = Math.min(rest.length, mark.length - 1); n >= 2; n--) {
        if (rest.endsWith(mark.slice(0, n))) { split = n; break; }
      }
      if (split) {
        if (rest.length > split) out.push({ t: rest.slice(0, rest.length - split), on: false });
        out.push({ t: rest.slice(rest.length - split), on: true });
        state.pending = mark.slice(split);
      } else {
        out.push({ t: rest, on: false });
      }
    }
    return out.length ? out : [{ t: line, on: false }];
  }

  /* For the HTML surfaces. `esc` is the page's own escaper. */
  function html(label, esc) {
    const mark = forLabel(label);
    if (!mark) return esc(label);
    return runs(label, mark, {})
      .map(r => r.on ? '<em class="hl">' + esc(r.t) + "</em>" : esc(r.t))
      .join("");
  }

  window.Highlight = { forLabel, runs, html };
})();
