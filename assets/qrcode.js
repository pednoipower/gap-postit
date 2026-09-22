/* ============================================================================
   QR CODE GENERATOR
   ----------------------------------------------------------------------------
   Draws the join QR code for the title slide.

   Why this is written out by hand instead of loading a library: the whole app
   has to work with no internet, on a hospital network that may block outside
   websites, from a USB stick if it comes to that. A QR code that only appears
   when a CDN is reachable is a QR code that fails on the day.

   Supports versions 1-10 in byte mode, which covers any sensible web address.
   ========================================================================== */

(function () {
  "use strict";

  /* -- How much fits, and how the error correction is split into blocks ----
     For each version: [ec codewords per block, blocks in group 1, data
     codewords per group-1 block, blocks in group 2, data codewords per
     group-2 block]. Straight from the QR specification. */
  const EC_TABLE = {
    L: {
      1:[7,1,19,0,0],   2:[10,1,34,0,0],  3:[15,1,55,0,0],  4:[20,1,80,0,0],
      5:[26,1,108,0,0], 6:[18,2,68,0,0],  7:[20,2,78,0,0],  8:[24,2,97,0,0],
      9:[30,2,116,0,0], 10:[18,2,68,2,69]
    },
    M: {
      1:[10,1,16,0,0],  2:[16,1,28,0,0],  3:[26,1,44,0,0],  4:[18,2,32,0,0],
      5:[24,2,43,0,0],  6:[16,4,27,0,0],  7:[18,4,31,0,0],  8:[22,2,38,2,39],
      9:[22,3,36,2,37], 10:[26,4,43,1,44]
    }
  };

  // Where the little alignment squares go, per version
  const ALIGN = {
    1:[], 2:[6,18], 3:[6,22], 4:[6,26], 5:[6,30],
    6:[6,34], 7:[6,22,38], 8:[6,24,42], 9:[6,26,46], 10:[6,28,50]
  };

  const EC_BITS = { L:0b01, M:0b00, Q:0b11, H:0b10 };

  /* -- Galois field arithmetic, the maths behind error correction --------- */
  const EXP = new Uint8Array(512), LOG = new Uint8Array(256);
  (function initGF() {
    let x = 1;
    for (let i = 0; i < 255; i++) {
      EXP[i] = x; LOG[x] = i;
      x <<= 1;
      if (x & 0x100) x ^= 0x11D;          // the QR standard's polynomial
    }
    for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
  })();

  const gfMul = (a, b) => (a === 0 || b === 0) ? 0 : EXP[LOG[a] + LOG[b]];

  function rsGenerator(degree) {
    let poly = [1];
    for (let i = 0; i < degree; i++) {
      const next = new Array(poly.length + 1).fill(0);
      for (let j = 0; j < poly.length; j++) {
        next[j] ^= gfMul(poly[j], 1);
        next[j + 1] ^= gfMul(poly[j], EXP[i]);
      }
      poly = next;
    }
    return poly;
  }

  function rsEncode(data, ecLen) {
    const gen = rsGenerator(ecLen);
    const res = new Array(data.length + ecLen).fill(0);
    for (let i = 0; i < data.length; i++) res[i] = data[i];
    for (let i = 0; i < data.length; i++) {
      const factor = res[i];
      if (factor === 0) continue;
      for (let j = 0; j < gen.length; j++) res[i + j] ^= gfMul(gen[j], factor);
    }
    return res.slice(data.length);
  }

  /* -- Turn the text into bits -------------------------------------------- */
  function toBytes(str) {
    return Array.from(new TextEncoder().encode(str));
  }

  function capacity(version, level) {
    const [ec, b1, d1, b2, d2] = EC_TABLE[level][version];
    return b1 * d1 + b2 * d2;
  }

  function pickVersion(byteLen, level) {
    for (let v = 1; v <= 10; v++) {
      const countBits = v <= 9 ? 8 : 16;
      const needed = Math.ceil((4 + countBits + byteLen * 8) / 8);
      if (needed <= capacity(v, level)) return v;
    }
    return null;
  }

  function buildData(bytes, version, level) {
    const countBits = version <= 9 ? 8 : 16;
    const bits = [];
    const push = (val, len) => { for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1); };

    push(0b0100, 4);              // "this is raw bytes"
    push(bytes.length, countBits);
    bytes.forEach(b => push(b, 8));

    const total = capacity(version, level) * 8;
    for (let i = 0; i < 4 && bits.length < total; i++) bits.push(0);   // terminator
    while (bits.length % 8 !== 0) bits.push(0);

    const codewords = [];
    for (let i = 0; i < bits.length; i += 8) {
      let b = 0;
      for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j];
      codewords.push(b);
    }
    // pad to full with the two alternating filler bytes the standard specifies
    const pads = [0xEC, 0x11];
    let p = 0;
    while (codewords.length < capacity(version, level)) codewords.push(pads[p++ % 2]);
    return codewords;
  }

  /* Split into blocks, add error correction to each, then weave them together
     so that damage to one part of the code is spread across many blocks. */
  function interleave(codewords, version, level) {
    const [ecLen, b1, d1, b2, d2] = EC_TABLE[level][version];
    const blocks = [], ecBlocks = [];
    let pos = 0;
    for (let i = 0; i < b1; i++) { blocks.push(codewords.slice(pos, pos + d1)); pos += d1; }
    for (let i = 0; i < b2; i++) { blocks.push(codewords.slice(pos, pos + d2)); pos += d2; }
    blocks.forEach(b => ecBlocks.push(rsEncode(b, ecLen)));

    const out = [];
    const maxData = Math.max(d1, d2);
    for (let i = 0; i < maxData; i++)
      for (const b of blocks) if (i < b.length) out.push(b[i]);
    for (let i = 0; i < ecLen; i++)
      for (const b of ecBlocks) out.push(b[i]);
    return out;
  }

  /* -- Lay out the picture ------------------------------------------------ */
  function makeMatrix(version) {
    const size = version * 4 + 17;
    const m = [], reserved = [];
    for (let i = 0; i < size; i++) {
      m.push(new Array(size).fill(0));
      reserved.push(new Array(size).fill(false));
    }

    const finder = (r, c) => {
      for (let i = -1; i <= 7; i++) for (let j = -1; j <= 7; j++) {
        const rr = r + i, cc = c + j;
        if (rr < 0 || rr >= size || cc < 0 || cc >= size) continue;
        const on = (i >= 0 && i <= 6 && (j === 0 || j === 6)) ||
                   (j >= 0 && j <= 6 && (i === 0 || i === 6)) ||
                   (i >= 2 && i <= 4 && j >= 2 && j <= 4);
        m[rr][cc] = on ? 1 : 0;
        reserved[rr][cc] = true;
      }
    };
    finder(0, 0); finder(0, size - 7); finder(size - 7, 0);

    // timing lines
    for (let i = 8; i < size - 8; i++) {
      m[6][i] = i % 2 === 0 ? 1 : 0; reserved[6][i] = true;
      m[i][6] = i % 2 === 0 ? 1 : 0; reserved[i][6] = true;
    }

    // alignment squares
    const centers = ALIGN[version];
    for (const r of centers) for (const c of centers) {
      if ((r <= 8 && c <= 8) || (r <= 8 && c >= size - 9) || (r >= size - 9 && c <= 8)) continue;
      for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) {
        m[r + i][c + j] = (Math.abs(i) === 2 || Math.abs(j) === 2 || (i === 0 && j === 0)) ? 1 : 0;
        reserved[r + i][c + j] = true;
      }
    }

    // the one module that is always dark
    m[size - 8][8] = 1; reserved[size - 8][8] = true;

    // space kept clear for the format information
    for (let i = 0; i < 9; i++) {
      if (!reserved[8][i]) reserved[8][i] = true;
      if (!reserved[i][8]) reserved[i][8] = true;
    }
    for (let i = 0; i < 8; i++) {
      reserved[8][size - 1 - i] = true;
      reserved[size - 1 - i][8] = true;
    }

    // space for version information on bigger codes
    if (version >= 7) {
      for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) {
        reserved[size - 11 + j][i] = true;
        reserved[i][size - 11 + j] = true;
      }
    }
    return { m, reserved, size };
  }

  function placeBits(mat, codewords) {
    const { m, reserved, size } = mat;
    const bits = [];
    codewords.forEach(cw => { for (let i = 7; i >= 0; i--) bits.push((cw >> i) & 1); });

    let idx = 0, up = true;
    for (let col = size - 1; col > 0; col -= 2) {
      if (col === 6) col--;                       // the timing column is skipped
      for (let i = 0; i < size; i++) {
        const row = up ? size - 1 - i : i;
        for (let c = 0; c < 2; c++) {
          const cc = col - c;
          if (reserved[row][cc]) continue;
          m[row][cc] = idx < bits.length ? bits[idx] : 0;
          idx++;
        }
      }
      up = !up;
    }
  }

  const MASKS = [
    (r, c) => (r + c) % 2 === 0,
    (r, c) => r % 2 === 0,
    (r, c) => c % 3 === 0,
    (r, c) => (r + c) % 3 === 0,
    (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
    (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
    (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
    (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0
  ];

  /* Scanners cope badly with big blank areas or accidental look-alikes of the
     corner squares. We try all eight scramble patterns and keep the tidiest. */
  function penalty(m, size) {
    let score = 0;

    for (let r = 0; r < size; r++) {
      let run = 1;
      for (let c = 1; c < size; c++) {
        if (m[r][c] === m[r][c - 1]) { run++; }
        else { if (run >= 5) score += 3 + (run - 5); run = 1; }
      }
      if (run >= 5) score += 3 + (run - 5);
    }
    for (let c = 0; c < size; c++) {
      let run = 1;
      for (let r = 1; r < size; r++) {
        if (m[r][c] === m[r - 1][c]) { run++; }
        else { if (run >= 5) score += 3 + (run - 5); run = 1; }
      }
      if (run >= 5) score += 3 + (run - 5);
    }

    for (let r = 0; r < size - 1; r++)
      for (let c = 0; c < size - 1; c++)
        if (m[r][c] === m[r][c+1] && m[r][c] === m[r+1][c] && m[r][c] === m[r+1][c+1])
          score += 3;

    const pat1 = [1,0,1,1,1,0,1,0,0,0,0];
    const pat2 = [0,0,0,0,1,0,1,1,1,0,1];
    const match = (arr, s) => { for (let i = 0; i < 11; i++) if (arr[i] !== s[i]) return false; return true; };
    for (let r = 0; r < size; r++)
      for (let c = 0; c <= size - 11; c++) {
        const s = m[r].slice(c, c + 11);
        if (match(s, pat1) || match(s, pat2)) score += 40;
      }
    for (let c = 0; c < size; c++)
      for (let r = 0; r <= size - 11; r++) {
        const s = []; for (let i = 0; i < 11; i++) s.push(m[r + i][c]);
        if (match(s, pat1) || match(s, pat2)) score += 40;
      }

    let dark = 0;
    for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) dark += m[r][c];
    const pct = (dark * 100) / (size * size);
    score += Math.floor(Math.abs(pct - 50) / 5) * 10;

    return score;
  }

  function formatBits(level, mask) {
    let data = (EC_BITS[level] << 3) | mask;
    let rem = data;
    for (let i = 0; i < 10; i++) rem = ((rem << 1) ^ (((rem >> 9) & 1) * 0x537));
    return (((data << 10) | (rem & 0x3FF)) ^ 0x5412);
  }

  function versionBits(version) {
    let rem = version;
    for (let i = 0; i < 12; i++) rem = ((rem << 1) ^ (((rem >> 11) & 1) * 0x1F25));
    return (version << 12) | (rem & 0xFFF);
  }

  /* The format information says which error-correction level and which
     scramble pattern were used. It is written twice, in two different corners,
     so a scanner can still read it if one corner is damaged.

     Note the bit order: the standard writes the MOST significant bit first.
     Getting this backwards produces a QR code that looks perfectly convincing
     to a human and cannot be read by any phone. */
  function applyFormat(m, size, level, mask) {
    const bits = formatBits(level, mask);
    const bit = i => (bits >> i) & 1;

    // Copy 1 — wrapped around the top-left corner square, in standard order
    const copy1 = [[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,7],[8,8],
                   [7,8],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8]];
    copy1.forEach((rc, idx) => { m[rc[0]][rc[1]] = bit(14 - idx); });

    // Copy 2 — up the left edge, then along the top
    for (let i = 0; i < 7; i++) m[size - 1 - i][8] = bit(14 - i);
    for (let i = 0; i < 8; i++) m[8][size - 8 + i] = bit(7 - i);

    // the module that is always dark, whatever the data says
    m[size - 8][8] = 1;
  }

  function applyVersion(m, size, version) {
    if (version < 7) return;
    const bits = versionBits(version);
    for (let i = 0; i < 18; i++) {
      const bit = (bits >> i) & 1;
      const r = Math.floor(i / 3), c = i % 3;
      m[size - 11 + c][r] = bit;
      m[r][size - 11 + c] = bit;
    }
  }

  /* -- The one function the rest of the app calls ------------------------- */
  function generate(text, opts) {
    opts = opts || {};
    const level = opts.level || "M";
    const bytes = toBytes(text);
    const version = opts.version || pickVersion(bytes.length, level);
    if (!version) throw new Error(
      "That web address is too long for a QR code (" + bytes.length + " characters). " +
      "Try a shorter link.");

    const codewords = interleave(buildData(bytes, version, level), version, level);

    let best = null;
    for (let mask = 0; mask < 8; mask++) {
      const mat = makeMatrix(version);
      placeBits(mat, codewords);
      for (let r = 0; r < mat.size; r++)
        for (let c = 0; c < mat.size; c++)
          if (!mat.reserved[r][c] && MASKS[mask](r, c)) mat.m[r][c] ^= 1;
      applyFormat(mat.m, mat.size, level, mask);
      applyVersion(mat.m, mat.size, version);
      const s = penalty(mat.m, mat.size);
      if (!best || s < best.score) best = { score: s, matrix: mat.m, size: mat.size, mask, version };
    }
    return best;
  }

  /* Draw it as crisp vector graphics so it stays sharp on a big projector. */
  function toSVG(text, opts) {
    opts = opts || {};
    const qr = generate(text, opts);
    const quiet = opts.quietZone === undefined ? 4 : opts.quietZone;
    const total = qr.size + quiet * 2;
    const dark = opts.dark || "#000000";
    const light = opts.light || "#ffffff";

    let path = "";
    for (let r = 0; r < qr.size; r++)
      for (let c = 0; c < qr.size; c++)
        if (qr.matrix[r][c]) path += `M${c + quiet} ${r + quiet}h1v1h-1z`;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" `
         + `shape-rendering="crispEdges" role="img" aria-label="QR code to join the workshop">`
         + `<rect width="${total}" height="${total}" fill="${light}"/>`
         + `<path d="${path}" fill="${dark}"/></svg>`;
  }

  window.QRCode = { generate, toSVG };
  if (typeof module !== "undefined" && module.exports) module.exports = { generate, toSVG };
})();
