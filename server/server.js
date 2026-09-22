#!/usr/bin/env node
/* ============================================================================
   THE MISSING PIECE — fallback server
   ----------------------------------------------------------------------------
   Run this on your laptop when there is no internet, or when the hospital
   network will not let you reach Supabase.

   HOW TO RUN IT
     1. Open Terminal
     2. Type:  cd    (with a space after it)
     3. Drag the gap-postit folder onto the Terminal window, press Enter
     4. Type:  node server/server.js
     5. It will print a web address and a QR code. Put that on the projector.

   Everyone must be on the same wifi as your laptop. No internet needed.

   This uses nothing but Node itself — no npm install, nothing to download.
   ========================================================================== */

'use strict';

const http = require('http');
const fs   = require('fs');
const path = require('path');
const os   = require('os');
const url  = require('url');

const ROOT    = path.resolve(__dirname, '..');
const DATAFILE= path.join(__dirname, 'workshop-data.json');
const PORT    = parseInt(process.env.PORT || '8080', 10);

/* ----------------------------------------------------------------------------
   THE DATA
   Everything lives in memory for speed, and is written to a file after every
   change so that a closed laptop lid or an accidental Ctrl-C does not lose a
   room full of people's contributions.
   -------------------------------------------------------------------------- */
let DB = {
  rooms: {},          // code -> room
  participants: [],
  concerns: [],
  solutions: [],
  groups: [],
  counters: {}        // "CODE:concern" -> n
};

function load() {
  try {
    if (fs.existsSync(DATAFILE)) {
      DB = JSON.parse(fs.readFileSync(DATAFILE, 'utf8'));
      console.log('  Reloaded previous session: ' +
        DB.concerns.length + ' concerns, ' + DB.solutions.length + ' solutions');
    }
  } catch (e) { console.error('  Could not read previous data:', e.message); }
}

let saveTimer = null, saving = false;
function save() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    if (saving) return;
    saving = true;
    const tmp = DATAFILE + '.tmp';
    try {
      // write to a temp file then rename, so a crash mid-write cannot corrupt
      // the real file and lose the workshop
      fs.writeFileSync(tmp, JSON.stringify(DB));
      fs.renameSync(tmp, DATAFILE);
    } catch (e) { console.error('  Save failed:', e.message); }
    saving = false;
  }, 250);
}

function nextRef(code, kind, prefix) {
  const key = code + ':' + kind;
  DB.counters[key] = (DB.counters[key] || 0) + 1;
  return prefix + '-' + String(DB.counters[key]).padStart(3, '0');
}

function ensureRoom(code, token) {
  if (!DB.rooms[code]) {
    DB.rooms[code] = {
      code, title: 'The Missing Piece', phase: 'lobby', current_slide: 0,
      board_open: false, active_prompt_id: null, spotlight_group: null,
      control_token: token || 'ckm', created_at: new Date().toISOString()
    };
    save();
  }
  return DB.rooms[code];
}

/* ----------------------------------------------------------------------------
   HTTP plumbing
   -------------------------------------------------------------------------- */
function send(res, code, body, type) {
  const data = typeof body === 'string' || Buffer.isBuffer(body)
    ? body : JSON.stringify(body);
  res.writeHead(code, {
    'Content-Type': type || 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Cache-Control': 'no-store'
  });
  res.end(data);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let b = '';
    let tooBig = false;
    req.on('data', c => {
      b += c;
      if (b.length > 1e6) { tooBig = true; req.destroy(); }   // basic flood guard
    });
    req.on('end', () => tooBig ? reject(new Error('too large'))
                               : resolve(b ? JSON.parse(b) : {}));
    req.on('error', reject);
  });
}

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.md': 'text/plain; charset=utf-8'
};

function serveStatic(req, res, pathname) {
  let rel = decodeURIComponent(pathname);
  if (rel === '/' || rel === '') rel = '/index.html';
  const file = path.join(ROOT, rel);
  // never serve anything outside the project folder
  if (!file.startsWith(ROOT)) return send(res, 403, { error: 'forbidden' });
  fs.readFile(file, (err, buf) => {
    if (err) return send(res, 404, 'Not found', 'text/plain');
    send(res, 200, buf, MIME[path.extname(file)] || 'application/octet-stream');
  });
}

/* ----------------------------------------------------------------------------
   THE API — mirrors exactly what the Supabase version does
   -------------------------------------------------------------------------- */
async function api(req, res, pathname, query) {
  const code = query.code;

  if (pathname === '/api/ping')  return send(res, 200, { ok: true, backend: 'local' });

  if (pathname === '/api/room')  return send(res, 200, DB.rooms[code] ? strip(DB.rooms[code]) : null);

  if (pathname === '/api/groups')
    return send(res, 200, DB.groups.filter(g => g.room_code === code)
      .sort((a, b) => a.sort_order - b.sort_order));

  if (pathname === '/api/participants')
    return send(res, 200, DB.participants.filter(p => p.room_code === code));

  if (pathname === '/api/concerns' || pathname === '/api/solutions') {
    const list = pathname.endsWith('concerns') ? DB.concerns : DB.solutions;
    let rows = list.filter(r => r.room_code === code);
    if (query.since) rows = rows.filter(r => r.created_at >= query.since);
    return send(res, 200, rows);
  }

  if (req.method !== 'POST') return send(res, 405, { error: 'method not allowed' });
  const body = await readBody(req);

  if (pathname === '/api/join') {
    ensureRoom(body.code);
    if (!DB.participants.some(p => p.id === body.id)) {
      DB.participants.push({
        id: body.id, room_code: body.code, role: body.role,
        discipline: body.discipline, setting: body.setting || null,
        joined_at: new Date().toISOString()
      });
      save();
    }
    return send(res, 200, { ok: true });
  }

  if (pathname === '/api/insert') {
    const { table, payload } = body;
    if (table !== 'concerns' && table !== 'solutions')
      return send(res, 400, { error: 'unknown table' });

    const room = DB.rooms[payload.room_code];
    if (!room)            return send(res, 400, { error: 'no such room' });
    if (!room.board_open) return send(res, 400, { error: 'the board is closed' });
    if (!payload.body || payload.body.length > 400)
      return send(res, 400, { error: 'note is empty or too long' });
    if ((payload.reason || '').length > 400 || (payload.outcome || '').length > 400)
      return send(res, 400, { error: 'note is too long' });
    if (table === 'solutions' && !['idea', 'facilitator', 'barrier'].includes(payload.kind || 'idea'))
      return send(res, 400, { error: 'unknown kind' });

    const list = DB[table];
    // same id arriving twice means a phone retried after losing signal
    if (list.some(r => r.id === payload.id)) return send(res, 200, { duplicate: true });

    if (table === 'solutions' &&
        !DB.groups.some(g => g.room_code === payload.room_code && g.id === payload.group_id))
      return send(res, 400, { error: 'no such problem group' });

    const row = Object.assign({}, payload, {
      ref: nextRef(payload.room_code, table === 'concerns' ? 'concern' : 'solution',
                   table === 'concerns' ? 'C' : 'S'),
      group_id: payload.group_id || null,
      kind: table === 'solutions' ? (payload.kind || 'idea') : undefined,
      created_at: new Date().toISOString()
    });
    list.push(row);
    save();
    return send(res, 200, { ok: true, ref: row.ref });
  }

  if (pathname === '/api/control') {
    const room = ensureRoom(body.code, body.token);
    if (room.control_token !== body.token) return send(res, 403, { error: 'Wrong control token' });
    const c = body.changes || {};
    if (c.phase     !== undefined) room.phase = c.phase;
    if (c.slide     !== undefined) room.current_slide = c.slide;
    if (c.open      !== undefined) room.board_open = !!c.open;
    if (c.prompt    !== undefined) room.active_prompt_id = c.prompt;
    if (c.spotlight !== undefined) room.spotlight_group = c.spotlight;
    room.updated_at = new Date().toISOString();
    save();
    return send(res, 200, strip(room));
  }

  if (pathname === '/api/import') {
    const room = DB.rooms[body.code];
    if (!room) return send(res, 400, { error: 'no such room' });
    if (room.control_token !== body.token) return send(res, 403, { error: 'Wrong control token' });

    const known = new Set(DB.concerns.filter(c => c.room_code === body.code).map(c => c.ref));
    const unknown = [];
    for (const g of body.groups) for (const r of (g.source_ids || []))
      if (!known.has(r) && !unknown.includes(r)) unknown.push(r);

    if (unknown.length) return send(res, 200, {
      ok: false, error: 'unknown_refs', unknown,
      message: 'The AI referred to notes that do not exist in this room. Nothing was imported.'
    });

    DB.groups = DB.groups.filter(g => g.room_code !== body.code);
    DB.concerns.forEach(c => { if (c.room_code === body.code) c.group_id = null; });

    let linked = 0;
    body.groups.forEach((g, i) => {
      DB.groups.push({
        id: g.id, room_code: body.code, label: g.label || g.id,
        problem_statement: g.problem_statement || '', rationale: g.rationale || null,
        proposal: g.proposal || null,
        color_index: i, sort_order: i, created_at: new Date().toISOString()
      });
      for (const r of (g.source_ids || [])) {
        const c = DB.concerns.find(c => c.room_code === body.code && c.ref === r);
        if (c) { c.group_id = g.id; linked++; }
      }
    });
    save();
    return send(res, 200, {
      ok: true, groups: body.groups.length, linked,
      ungrouped: DB.concerns.filter(c => c.room_code === body.code && !c.group_id).length
    });
  }

  if (pathname === '/api/reset') {
    const room = DB.rooms[body.code];
    if (!room) return send(res, 400, { error: 'no such room' });
    if (room.control_token !== body.token) return send(res, 403, { error: 'Wrong control token' });
    // keep a dated backup before wiping, just in case
    try {
      fs.writeFileSync(path.join(__dirname,
        'backup-' + new Date().toISOString().slice(0,10) + '-' + Date.now() + '.json'),
        JSON.stringify(DB));
    } catch (e) {}
    DB.concerns    = DB.concerns.filter(c => c.room_code !== body.code);
    DB.solutions   = DB.solutions.filter(s => s.room_code !== body.code);
    DB.groups      = DB.groups.filter(g => g.room_code !== body.code);
    DB.participants= DB.participants.filter(p => p.room_code !== body.code);
    Object.keys(DB.counters).forEach(k => { if (k.startsWith(body.code + ':')) delete DB.counters[k]; });
    Object.assign(room, { phase: 'lobby', current_slide: 0, board_open: false,
                          active_prompt_id: null, spotlight_group: null });
    save();
    return send(res, 200, { ok: true });
  }

  return send(res, 404, { error: 'unknown endpoint' });
}

// never send the control token to a browser
function strip(room) { const r = Object.assign({}, room); delete r.control_token; return r; }

/* ----------------------------------------------------------------------------
   Start up
   -------------------------------------------------------------------------- */
function lanAddresses() {
  const out = [];
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces))
    for (const i of ifaces[name])
      if (i.family === 'IPv4' && !i.internal) out.push(i.address);
  return out;
}

load();

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, '');
  const parsed = url.parse(req.url, true);
  try {
    if (parsed.pathname.startsWith('/api/'))
      return await api(req, res, parsed.pathname, parsed.query);
    return serveStatic(req, res, parsed.pathname);
  } catch (e) {
    console.error(e);
    send(res, 500, { error: String(e.message || e) });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  const addrs = lanAddresses();
  console.log('');
  console.log('  ┌────────────────────────────────────────────────┐');
  console.log('  │  THE MISSING PIECE — running on your laptop    │');
  console.log('  └────────────────────────────────────────────────┘');
  console.log('');
  console.log('  Participants join at:');
  addrs.forEach(a => console.log('      http://' + a + ':' + PORT));
  if (!addrs.length) console.log('      (no wifi detected — connect to the venue wifi first)');
  console.log('');
  console.log('  You open:');
  addrs.slice(0,1).forEach(a => {
    console.log('      projector screen   http://' + a + ':' + PORT + '/present.html');
    console.log('      your control panel http://' + a + ':' + PORT + '/control.html');
  });
  console.log('');
  console.log('  Everyone must be on the same wifi as this laptop.');
  console.log('  Data is saved continuously to server/workshop-data.json');
  console.log('  Press Ctrl-C to stop.');
  console.log('');
});

process.on('SIGINT', () => {
  console.log('\n  Saving and shutting down...');
  if (saveTimer) clearTimeout(saveTimer);
  try { fs.writeFileSync(DATAFILE, JSON.stringify(DB)); } catch (e) {}
  console.log('  Saved. ' + DB.concerns.length + ' concerns, ' + DB.solutions.length + ' solutions kept.');
  process.exit(0);
});
