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
    const hit = (list || []).find(x => x.id === id);
    return hit ? (hit.label || hit.title || id) : id;
  }

  function toXLSX(snap, cfg) {
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

    /* Sheet 1 — every concern, in the order it was said */
    const concernRows = [[
      H("Ref"), H("Question"), H("Concern"), H("Role"), H("Discipline"),
      H("Problem group"), H("Problem statement"), H("Time")
    ]];
    for (const c of snap.concerns) {
      const gs = groupStyle(c.group_id);
      concernRows.push([
        { v: c.ref, s: styleIndex.mono },
        { v: labelFor(cfg.prompts, c.prompt_id), s: gs },
        { v: c.body, s: gs },
        { v: labelFor(cfg.roles, c.role), s: gs },
        { v: labelFor(cfg.disciplines, c.discipline), s: discStyle(c.discipline) },
        { v: c.group_id || "(not grouped)", s: gs },
        { v: c.group_id && gById[c.group_id] ? gById[c.group_id].problem_statement : "", s: gs },
        { v: (c.created_at || "").replace("T", " ").slice(0, 19), s: styleIndex.mono }
      ]);
    }

    /* Sheet 2 — every solution, against the problem it answers */
    const solutionRows = [[
      H("Ref"), H("Problem group"), H("Problem statement"), H("Proposed solution"),
      H("Role"), H("Discipline"), H("Time")
    ]];
    for (const s of snap.solutions) {
      const gs = groupStyle(s.group_id);
      solutionRows.push([
        { v: s.ref, s: styleIndex.mono },
        { v: s.group_id, s: gs },
        { v: gById[s.group_id] ? gById[s.group_id].problem_statement : "", s: gs },
        { v: s.body, s: gs },
        { v: labelFor(cfg.roles, s.role), s: gs },
        { v: labelFor(cfg.disciplines, s.discipline), s: discStyle(s.discipline) },
        { v: (s.created_at || "").replace("T", " ").slice(0, 19), s: styleIndex.mono }
      ]);
    }

    /* Sheet 3 — the problems, with who raised them and who answered */
    const summaryRows = [[
      H("Group"), H("Short name"), H("Problem statement"), H("Concerns behind it"),
      H("Solutions offered"), H("Raised by nephrology"), H("Raised by palliative"),
      H("Source refs")
    ]];
    for (const g of (snap.groups || [])) {
      const cs = snap.concerns.filter(c => c.group_id === g.id);
      const ss = snap.solutions.filter(s => s.group_id === g.id);
      const gs = groupStyle(g.id);
      summaryRows.push([
        { v: g.id, s: styleIndex.mono },
        { v: g.label, s: gs },
        { v: g.problem_statement, s: gs },
        { v: cs.length, s: gs },
        { v: ss.length, s: gs },
        { v: cs.filter(c => c.discipline === "nephro").length, s: gs },
        { v: cs.filter(c => c.discipline === "palliative").length, s: gs },
        { v: cs.map(c => c.ref).join(", "), s: styleIndex.mono }
      ]);
    }

    /* Sheet 4 — who was in the room */
    const counts = {};
    for (const p of (snap.participants || [])) {
      const k = p.discipline + "|" + p.role;
      counts[k] = (counts[k] || 0) + 1;
    }
    const whoRows = [[H("Discipline"), H("Role"), H("People")]];
    Object.keys(counts).sort().forEach(k => {
      const [d, r] = k.split("|");
      whoRows.push([labelFor(cfg.disciplines, d), labelFor(cfg.roles, r), counts[k]]);
    });
    whoRows.push([{ v: "Total", s: styleIndex.bold }, "",
                  { v: (snap.participants || []).length, s: styleIndex.bold }]);

    const sheets = [
      { name: "Concerns",   xml: sheetXml(concernRows,  { widths: [9, 30, 62, 14, 17, 15, 52, 20] }) },
      { name: "Solutions",  xml: sheetXml(solutionRows, { widths: [9, 15, 52, 62, 14, 17, 20] }) },
      { name: "Problems",   xml: sheetXml(summaryRows,  { widths: [9, 26, 62, 18, 17, 20, 20, 40] }) },
      { name: "Who was there", xml: sheetXml(whoRows,   { widths: [22, 18, 10] }) }
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
    const L = [];
    L.push("THE MISSING PIECE — proposed solutions");
    L.push("Exported: " + new Date(snap.exportedAt).toLocaleString());
    L.push("");
    for (const g of (snap.groups || [])) {
      const cs = snap.concerns.filter(c => c.group_id === g.id);
      const ss = snap.solutions.filter(s => s.group_id === g.id);
      L.push("=".repeat(74));
      L.push(`${g.id}  ${g.label}`);
      L.push("PROBLEM: " + g.problem_statement);
      L.push("-".repeat(74));
      L.push("Built from these concerns:");
      cs.forEach(c => L.push(`  ${c.ref} [${c.discipline}/${c.role}] ${String(c.body).replace(/\s+/g," ").trim()}`));
      L.push("");
      L.push("Solutions proposed (" + ss.length + "):");
      ss.forEach(s => L.push(`  ${s.ref} [${s.discipline}/${s.role}] ${String(s.body).replace(/\s+/g," ").trim()}`));
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
