/* ============================================================================
   EXPORTS
   ----------------------------------------------------------------------------
   Three formats, each for a different job:

     .txt   feed this to the AI for grouping. Nothing but labels and words.
     .xlsx  a real Excel file, colour-coded, for you and your colleagues.
     .json  a complete backup of the session, and the format for re-importing.

   The Excel file is written from scratch here rather than with a library. An
   .xlsx is really just a zip full of XML, so building it by hand costs about
   two hundred lines and means the export works with no internet, on a locked
   down hospital laptop, from a USB stick.
   ========================================================================== */

(function () {
  "use strict";

  /* ---- a minimal ZIP writer ---------------------------------------------- */

  const CRC_TABLE = (() => {
    const t = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
      t[i] = c >>> 0;
    }
    return t;
  })();

  function crc32(bytes) {
    let c = 0xFFFFFFFF;
    for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  const enc = new TextEncoder();

  /* Files are stored uncompressed. A workshop's worth of text is a few hundred
     kilobytes at most, and "no compression" removes an entire category of
     things that can go subtly wrong in a file Excel has to open. */
  function makeZip(files) {
    const chunks = [], central = [];
    let offset = 0;

    const u16 = n => [n & 255, (n >> 8) & 255];
    const u32 = n => [n & 255, (n >> 8) & 255, (n >> 16) & 255, (n >> 24) & 255];

    for (const f of files) {
      const nameBytes = enc.encode(f.name);
      const data = typeof f.data === "string" ? enc.encode(f.data) : f.data;
      const crc = crc32(data);

      const local = [].concat(
        u32(0x04034b50), u16(20), u16(0), u16(0), u16(0), u16(0),
        u32(crc), u32(data.length), u32(data.length),
        u16(nameBytes.length), u16(0)
      );
      chunks.push(new Uint8Array(local), nameBytes, data);

      central.push([].concat(
        u32(0x02014b50), u16(20), u16(20), u16(0), u16(0), u16(0), u16(0),
        u32(crc), u32(data.length), u32(data.length),
        u16(nameBytes.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset)
      ), nameBytes);

      offset += local.length + nameBytes.length + data.length;
    }

    const centralParts = [];
    let centralSize = 0;
    for (let i = 0; i < central.length; i += 2) {
      const head = new Uint8Array(central[i]);
      centralParts.push(head, central[i + 1]);
      centralSize += head.length + central[i + 1].length;
    }

    const end = new Uint8Array([].concat(
      u32(0x06054b50), u16(0), u16(0),
      u16(files.length), u16(files.length),
      u32(centralSize), u32(offset), u16(0)
    ));

    return new Blob([...chunks, ...centralParts, end],
      { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  }

  /* ---- Excel ------------------------------------------------------------- */

  const esc = s => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");   // Excel rejects these outright

  const colName = n => {
    let s = "";
    n++;
    while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); }
    return s;
  };

  /* A palette for the problem groups, so each cluster gets its own row colour
     both on screen and in the spreadsheet. Chosen to stay distinguishable when
     printed in greyscale and to avoid red/green confusion. */
  const GROUP_FILLS = [
    "FFD9E8F5", "FFF6E3D3", "FFE2EFDA", "FFF3E2F0", "FFFCF2CC",
    "FFDDEEEE", "FFF7DDDD", "FFE8E4F3", "FFE5F0DA", "FFF9E4EC",
    "FFDCE9F7", "FFF5EAD6"
  ];

  function buildStyles(disciplineFills) {
    const fills = [
      '<fill><patternFill patternType="none"/></fill>',
      '<fill><patternFill patternType="gray125"/></fill>'
    ];
    const map = {};
    const add = (key, argb) => {
      map[key] = fills.length;
      fills.push(`<fill><patternFill patternType="solid"><fgColor rgb="${argb}"/><bgColor indexed="64"/></patternFill></fill>`);
    };
    add("header", "FF23293A");
    GROUP_FILLS.forEach((c, i) => add("g" + i, c));
    Object.keys(disciplineFills).forEach(k => add("d_" + k, disciplineFills[k]));

    const fonts = [
      '<font><sz val="11"/><color theme="1"/><name val="Calibri"/></font>',
      '<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>',
      '<font><sz val="10"/><color rgb="FF6B6B6B"/><name val="Consolas"/></font>',
      '<font><b/><sz val="11"/><color theme="1"/><name val="Calibri"/></font>'
    ];

    const xfs = ['<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'];
    const styleIndex = {};
    const addXf = (key, fontId, fillId, extra) => {
      styleIndex[key] = xfs.length;
      xfs.push(`<xf numFmtId="0" fontId="${fontId}" fillId="${fillId}" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="top" wrapText="1"${extra || ""}/></xf>`);
    };
    addXf("header", 1, map.header);
    addXf("plain", 0, 0);
    addXf("mono", 2, 0);
    addXf("bold", 3, 0);
    GROUP_FILLS.forEach((_, i) => addXf("g" + i, 0, map["g" + i]));
    Object.keys(disciplineFills).forEach(k => addXf("d_" + k, 0, map["d_" + k]));

    const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="${fonts.length}">${fonts.join("")}</fonts>
<fills count="${fills.length}">${fills.join("")}</fills>
<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="${xfs.length}">${xfs.join("")}</cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;
    return { xml, styleIndex };
  }

  function sheetXml(rows, opts) {
    opts = opts || {};
    const widths = opts.widths || [];
    const cols = widths.length
      ? `<cols>${widths.map((w, i) => `<col min="${i+1}" max="${i+1}" width="${w}" customWidth="1"/>`).join("")}</cols>`
      : "";

    const body = rows.map((row, r) => {
      const cells = row.map((cell, c) => {
        const v = cell && typeof cell === "object" ? cell.v : cell;
        const s = cell && typeof cell === "object" && cell.s != null ? ` s="${cell.s}"` : "";
        const ref = colName(c) + (r + 1);
        if (v === "" || v == null) return `<c r="${ref}"${s}/>`;
        if (typeof v === "number" && isFinite(v)) return `<c r="${ref}"${s}><v>${v}</v></c>`;
        return `<c r="${ref}"${s} t="inlineStr"><is><t xml:space="preserve">${esc(v)}</t></is></c>`;
      }).join("");
      return `<row r="${r + 1}"${r === 0 ? ' ht="22" customHeight="1"' : ""}>${cells}</row>`;
    }).join("");

    const freeze = `<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>`;
    const filter = rows.length > 1
      ? `<autoFilter ref="A1:${colName(rows[0].length - 1)}${rows.length}"/>` : "";

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
${freeze}${cols}<sheetData>${body}</sheetData>${filter}</worksheet>`;
  }

  function buildWorkbook(sheets, stylesXml) {
    const files = [];

    files.push({ name: "[Content_Types].xml", data:
`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
${sheets.map((s,i)=>`<Override PartName="/xl/worksheets/sheet${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("")}
<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>` });

    files.push({ name: "_rels/.rels", data:
`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>` });

    files.push({ name: "xl/workbook.xml", data:
`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets>${sheets.map((s,i)=>`<sheet name="${esc(s.name)}" sheetId="${i+1}" r:id="rId${i+1}"/>`).join("")}</sheets>
</workbook>` });

    files.push({ name: "xl/_rels/workbook.xml.rels", data:
`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
${sheets.map((s,i)=>`<Relationship Id="rId${i+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i+1}.xml"/>`).join("")}
<Relationship Id="rId${sheets.length+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>` });

    sheets.forEach((s, i) => files.push({ name: `xl/worksheets/sheet${i+1}.xml`, data: s.xml }));
    files.push({ name: "xl/styles.xml", data: stylesXml });

    return makeZip(files);
  }

  /* ---- turning a workshop into files ------------------------------------- */

  /* Roles and disciplines carry a `label`; prompts carry a `title`. Accept
     either, so a config change never silently empties a column. */
  function labelFor(list, id) {
    if (id == null || id === "") return "";
    const hit = (list || []).find(x => x.id === id);
    return hit ? (hit.label || hit.title || id) : id;
  }

  /* The warm-up round is there to teach the sentence and break the ice; its
     notes are not about CKM at all. Everything that leaves this file is
     built from a snapshot with that round taken out. */
  function withoutPractice(snap, cfg) {
    const pid = (cfg && cfg.practice && cfg.practice.id) || "G0";
    if (!cfg || !cfg.practice) return snap;
    return Object.assign({}, snap, {
      groups:    (snap.groups || []).filter(g => g.id !== pid),
      solutions: (snap.solutions || []).filter(x => x.group_id !== pid)
    });
  }

  function toXLSX(snap, cfg) {
    snap = withoutPractice(snap, cfg);
    const discFills = {};
    (cfg.disciplines || []).forEach(d => {
      const c = (cfg.colors[d.id] || cfg.colors.fallback).base.replace("#", "");
      // pale version so black text stays readable on the cell
      const r = parseInt(c.slice(0,2),16), g = parseInt(c.slice(2,4),16), b = parseInt(c.slice(4,6),16);
      const m = v => Math.round(v + (255 - v) * 0.62).toString(16).padStart(2,"0");
      discFills[d.id] = "FF" + m(r) + m(g) + m(b);
    });
    const { xml: stylesXml, styleIndex } = buildStyles(discFills);

    const H = v => ({ v, s: styleIndex.header });
    const groupOrder = {};
    (snap.groups || []).forEach((g, i) => groupOrder[g.id] = i);
    const groupStyle = gid => gid != null && groupOrder[gid] != null
      ? styleIndex["g" + (groupOrder[gid] % GROUP_FILLS.length)] : styleIndex.plain;
    const discStyle = d => styleIndex["d_" + d] != null ? styleIndex["d_" + d] : styleIndex.plain;
    const gById = {}; (snap.groups || []).forEach(g => gById[g.id] = g);

    const pById = {}; (snap.participants || []).forEach(p => pById[p.id] = p);
    const settingOf = row => { const p = pById[row.participant_id]; return p ? labelFor(cfg.settings || [], p.setting) : ""; };
    const when = iso => (iso || "").replace("T", " ").slice(0, 19);
    const KIND = { cause: "Cause (gap exists here)", works: "Works here (no gap)", asset: "Already exists", idea: "New idea", facilitator: "Would help", barrier: "Obstacle" };

    /* Sheet 1 — why: causes where the gap exists, and what makes it work where it doesn't */
    const causeRows = [[
      H("Ref"), H("Gap"), H("Gap label"), H("Type"), H("ใคร (actor)"), H("มักจะ/จะ (response)"), H("เมื่อ (situation/condition)"), H("เนื่องจาก (reason)"),
      H("Role"), H("Discipline"), H("Setting"), H("Phone id"), H("Time")
    ]];
    for (const r of snap.solutions.filter(x => x.kind === "cause" || x.kind === "works")) {
      const gs = groupStyle(r.group_id), g = gById[r.group_id] || {};
      causeRows.push([
        { v: r.ref, s: styleIndex.mono }, { v: r.group_id, s: gs }, { v: g.label || "", s: gs },
        { v: KIND[r.kind], s: gs },
        { v: labelFor((cfg.actors || []).concat((cfg.practice && cfg.practice.actors) || []), r.actor), s: gs },
        { v: r.body, s: gs }, { v: r.context || "", s: gs }, { v: r.reason || "", s: gs },
        { v: labelFor(cfg.roles, r.role), s: gs },
        { v: labelFor(cfg.disciplines, r.discipline), s: discStyle(r.discipline) },
        { v: settingOf(r), s: gs }, { v: r.participant_id || "", s: styleIndex.mono }, { v: when(r.created_at), s: styleIndex.mono }
      ]);
    }

    /* Sheet 2 — what we would do: existing assets and new ideas, each with why it would work */
    const fixRows = [[
      H("Ref"), H("Gap"), H("Gap label"), H("Type"), H("What"), H("Why it would work here"),
      H("Role"), H("Discipline"), H("Setting"), H("Phone id"), H("Time")
    ]];
    for (const r of snap.solutions.filter(x => x.kind === "asset" || x.kind === "idea")) {
      const gs = groupStyle(r.group_id), g = gById[r.group_id] || {};
      fixRows.push([
        { v: r.ref, s: styleIndex.mono }, { v: r.group_id, s: gs }, { v: g.label || "", s: gs },
        { v: KIND[r.kind] || r.kind || "", s: gs },
        { v: r.body, s: gs }, { v: r.reason || "", s: gs },
        { v: labelFor(cfg.roles, r.role), s: gs },
        { v: labelFor(cfg.disciplines, r.discipline), s: discStyle(r.discipline) },
        { v: settingOf(r), s: gs }, { v: r.participant_id || "", s: styleIndex.mono }, { v: when(r.created_at), s: styleIndex.mono }
      ]);
    }

    /* Sheet 3 — crosstab: gap × discipline × role */
    const xRows = [[H("Gap"), H("Gap label"), H("Discipline"), H("Role"), H("Causes"), H("Works here"), H("Already exists"), H("New ideas")]];
    for (const g of (snap.groups || [])) {
      for (const d of (cfg.disciplines || [])) for (const r of (cfg.roles || [])) {
        const sel = x => x.group_id === g.id && x.discipline === d.id && x.role === r.id;
        const c = snap.solutions.filter(x => sel(x) && x.kind === "cause").length;
        const w = snap.solutions.filter(x => sel(x) && x.kind === "works").length;
        const a = snap.solutions.filter(x => sel(x) && x.kind === "asset").length;
        const i = snap.solutions.filter(x => sel(x) && x.kind === "idea").length;
        if (!c && !w && !a && !i) continue;
        const gs = groupStyle(g.id);
        xRows.push([{ v: g.id, s: styleIndex.mono }, { v: g.label, s: gs },
          { v: labelFor(cfg.disciplines, d.id), s: discStyle(d.id) }, { v: r.label, s: gs },
          { v: c, s: gs }, { v: w, s: gs }, { v: a, s: gs }, { v: i, s: gs }]);
      }
    }

    /* Sheet 4 — the gaps themselves */
    const summaryRows = [[
      H("Gap"), H("Label"), H("Problem"), H("Survey"), H("Proposal"), H("Causes"), H("Already exists"),
      H("New ideas"), H("Answered by nephrology"), H("Answered by palliative")
    ]];
    for (const g of (snap.groups || [])) {
      const rs = snap.solutions.filter(x => x.group_id === g.id);
      const gs = groupStyle(g.id);
      summaryRows.push([
        { v: g.id, s: styleIndex.mono }, { v: g.label, s: gs }, { v: g.problem_statement, s: gs },
        { v: g.stat || "", s: gs }, { v: g.proposal || "", s: gs },
        { v: rs.filter(x => x.kind === "cause").length, s: gs },
        { v: rs.filter(x => x.kind === "asset").length, s: gs },
        { v: rs.filter(x => x.kind === "idea").length, s: gs },
        { v: rs.filter(x => x.discipline === "nephro").length, s: gs },
        { v: rs.filter(x => x.discipline === "palliative").length, s: gs }
      ]);
    }

    /* Sheet 5 — who was in the room */
    const counts = {};
    for (const p of (snap.participants || [])) {
      const k = p.discipline + "|" + p.role + "|" + (p.setting || "");
      counts[k] = (counts[k] || 0) + 1;
    }
    const whoRows = [[H("Discipline"), H("Role"), H("Setting"), H("People")]];
    Object.keys(counts).sort().forEach(k => {
      const [d, r, st] = k.split("|");
      whoRows.push([labelFor(cfg.disciplines, d), labelFor(cfg.roles, r), labelFor(cfg.settings || [], st), counts[k]]);
    });
    whoRows.push([{ v: "Total", s: styleIndex.bold }, "", "",
                  { v: (snap.participants || []).length, s: styleIndex.bold }]);

    const sheets = [
      { name: "Why",            xml: sheetXml(causeRows,   { widths: [9, 6, 30, 20, 16, 40, 40, 46, 12, 16, 16, 38, 20] }) },
      { name: "What we would do", xml: sheetXml(fixRows,   { widths: [9, 6, 30, 14, 52, 52, 12, 16, 16, 38, 20] }) },
      { name: "Crosstab",       xml: sheetXml(xRows,       { widths: [6, 30, 16, 12, 10, 12, 14, 10] }) },
      { name: "Gaps",           xml: sheetXml(summaryRows, { widths: [6, 30, 52, 36, 52, 10, 14, 10, 20, 20] }) },
      { name: "Who was there",  xml: sheetXml(whoRows,     { widths: [18, 14, 18, 10] }) }
    ];
    return buildWorkbook(sheets, stylesXml);
  }

  /* ---- plain text, for handing to an AI ---------------------------------- */
  function toTXT(snap, cfg) {
    const L = [];
    L.push("THE MISSING PIECE — participant concerns");
    L.push("Room: " + (snap.room ? snap.room.code : "?") +
           "   Exported: " + new Date(snap.exportedAt).toLocaleString());
    L.push("Concerns: " + snap.concerns.length +
           "   Participants: " + (snap.participants || []).length);
    L.push("");
    L.push("Each line is one concern, in the form:");
    L.push("  LABEL | discipline | role | the concern as it was written");
    L.push("The LABEL is what the AI must refer back to. Do not renumber them.");
    L.push("");

    const byPrompt = {};
    for (const c of snap.concerns) (byPrompt[c.prompt_id] = byPrompt[c.prompt_id] || []).push(c);

    for (const p of (cfg.prompts || [])) {
      const list = byPrompt[p.id];
      if (!list || !list.length) continue;
      L.push("=".repeat(74));
      L.push("QUESTION: " + p.title);
      if (p.subtitle) L.push("          " + p.subtitle);
      L.push("=".repeat(74));
      for (const c of list) {
        L.push(`${c.ref} | ${c.discipline} | ${c.role} | ${String(c.body).replace(/\s+/g, " ").trim()}`);
      }
      L.push("");
    }
    const orphans = snap.concerns.filter(c => !(cfg.prompts || []).some(p => p.id === c.prompt_id));
    if (orphans.length) {
      L.push("=".repeat(74));
      L.push("OTHER");
      L.push("=".repeat(74));
      orphans.forEach(c => L.push(`${c.ref} | ${c.discipline} | ${c.role} | ${String(c.body).replace(/\s+/g," ").trim()}`));
    }
    return L.join("\n");
  }

  function toSolutionsTXT(snap, cfg) {
    snap = withoutPractice(snap, cfg);
    const L = [];
    const clean = v => String(v || "").replace(/\s+/g, " ").trim();
    L.push("THE MISSING PIECE — why each gap happens, and what we would do");
    L.push("Exported: " + new Date(snap.exportedAt).toLocaleString());
    L.push("");
    L.push("WHY lines: LABEL | team | role | ใคร (actor) | มักจะ/จะ (response) | เมื่อ (situation/condition) | เนื่องจาก (reason)");
    L.push("HOW lines: LABEL | team | role | what — why it would work here");
    L.push("");
    for (const g of (snap.groups || [])) {
      const rs = snap.solutions.filter(x => x.group_id === g.id);
      const c = rs.filter(x => x.kind === "cause"), w = rs.filter(x => x.kind === "works"), a = rs.filter(x => x.kind === "asset"), i = rs.filter(x => x.kind === "idea");
      if (!rs.length && g.id === "GX") continue;
      L.push("=".repeat(74));
      L.push(`${g.id}  ${clean(g.label)}`);
      if (g.stat) L.push("SURVEY:   " + clean(g.stat));
      if (g.proposal) L.push("PROPOSAL: " + clean(g.proposal));
      L.push("-".repeat(74));
      L.push("WHY IT HAPPENS — from hospitals where the gap exists (" + c.length + "):");
      const sent = x => `ใคร ${clean(x.actor)} | มักจะ/จะ ${clean(x.body)} | เมื่อ ${clean(x.context)} | เนื่องจาก ${clean(x.reason)}`;
      c.forEach(x => L.push(`  ${x.ref} | ${x.discipline} | ${x.role} | ${sent(x)}`));
      L.push("");
      L.push("WHAT MAKES IT WORK — from hospitals where it does not (" + w.length + "):");
      w.forEach(x => L.push(`  ${x.ref} | ${x.discipline} | ${x.role} | ${sent(x)}`));
      L.push("");
      L.push("ALREADY EXISTS, USE IT MORE (" + a.length + "):");
      a.forEach(x => L.push(`  ${x.ref} | ${x.discipline} | ${x.role} | ${clean(x.body)} — ${clean(x.reason)}`));
      L.push("");
      L.push("NEW IDEAS (" + i.length + "):");
      i.forEach(x => L.push(`  ${x.ref} | ${x.discipline} | ${x.role} | ${clean(x.body)} — ${clean(x.reason)}`));
      L.push("");
    }
    return L.join("\n");
  }

  /* ---- saving ------------------------------------------------------------ */
  function stamp(d) {
    d = d || new Date();
    const p = n => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`;
  }

  function download(filename, content, mime) {
    const blob = content instanceof Blob
      ? content : new Blob([content], { type: mime || "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1500);
  }

  window.Exporter = { toXLSX, toTXT, toSolutionsTXT, download, stamp, makeZip };
  if (typeof module !== "undefined" && module.exports)
    module.exports = { crc32, makeZip, sheetXml, buildStyles, buildWorkbook, toTXT, toXLSX, toSolutionsTXT };
})();
