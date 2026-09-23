#!/usr/bin/env python3
"""
Load check for workshop day: 150 phones, one room, one backend.

    python3 tools/load-test.py join  150      # everyone joins at once
    python3 tools/load-test.py burst 150      # everyone presses Send at once
    python3 tools/load-test.py poll  150 40   # 150 phones polling for 40s
    python3 tools/load-test.py mixed 150      # a Send burst while they all poll

It writes into the SANDBOX room (PZKT), never the room in config.js, and the
room must have its gaps loaded and its board open first. Clear it afterwards:

    curl -s -X POST "$URL/rest/v1/rpc/reset_room" -H "apikey: $KEY" \
      -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
      -d '{"p_room":"PZKT","p_token":"ckm"}'

The room read here uses the same explicit column list as the client. Asking
for select=* on rooms returns 401 by design: control_token is not readable by
anyone, which is worth knowing if you ever see a wall of 401s in a test.
"""
import json, time, uuid, statistics, threading, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor

URL = "https://duoolujtrbrfegpmeeat.supabase.co"
KEY = "sb_publishable_E_zhmdDIV288ngVJYIVRqg_D5bZpPak"
ROOM, TOKEN = "PZKT", "ckm"
H = {"apikey": KEY, "Authorization": "Bearer " + KEY, "Content-Type": "application/json"}

def req(method, path, body=None, extra=None):
    h = dict(H); h.update(extra or {})
    data = json.dumps(body).encode() if body is not None else None
    r = urllib.request.Request(URL + path, data=data, headers=h, method=method)
    t0 = time.perf_counter()
    try:
        with urllib.request.urlopen(r, timeout=30) as resp:
            payload = resp.read()
            return resp.status, (time.perf_counter()-t0)*1000, payload
    except urllib.error.HTTPError as e:
        return e.code, (time.perf_counter()-t0)*1000, e.read()
    except Exception as e:
        return 0, (time.perf_counter()-t0)*1000, str(e).encode()

def pct(xs, p):
    xs = sorted(xs)
    return xs[min(len(xs)-1, int(len(xs)*p/100))]

def report(name, results):
    codes = {}
    for c, ms, _ in results: codes[c] = codes.get(c, 0) + 1
    lat = [ms for _, ms, _ in results]
    ok = sum(v for k, v in codes.items() if 200 <= k < 300)
    print(f"{name:<34} n={len(results):<5} ok={ok:<5} "
          f"p50={pct(lat,50):6.0f}ms p95={pct(lat,95):6.0f}ms max={max(lat):6.0f}ms  codes={codes}")
    return codes

def control(**kw):
    body = {"p_room": ROOM, "p_token": TOKEN, "p_phase": kw.get("phase"), "p_slide": kw.get("slide"),
            "p_open": kw.get("open"), "p_prompt": "__null__", "p_spot": kw.get("spot")}
    return req("POST", "/rest/v1/rpc/room_control", body)

def join(i):
    return req("POST", "/rest/v1/participants",
               {"id": str(uuid.uuid4()), "room_code": ROOM,
                "role": ["doctor","nurse","allied","other"][i % 4],
                "discipline": "nephro" if i % 2 else "palliative",
                "setting": ["dialysis","ward","opd","community","other"][i % 5]},
               {"Prefer": "return=minimal"})

def note(i, gid="G1"):
    return req("POST", "/rest/v1/solutions",
               {"id": str(uuid.uuid4()), "room_code": ROOM, "group_id": gid, "kind": "cause",
                "actor": "nephro_doc", "context": f"โหลดเทสต์ {i} คลินิกวันพุธคนล้น",
                "body": f"ไม่ได้ประเมิน CKM ({i})", "reason": "ไม่มีเกณฑ์ที่ตกลงกันไว้",
                "role": "nurse", "discipline": "nephro" if i % 2 else "palliative",
                "participant_id": str(uuid.uuid4())},
               {"Prefer": "return=minimal"})

def phone_poll(_):
    a = req("GET", f"/rest/v1/rooms?select=code,title,phase,current_slide,board_open,active_prompt_id,spotlight_group&code=eq.{ROOM}")
    b = req("GET", f"/rest/v1/groups?select=*&room_code=eq.{ROOM}&order=sort_order")
    return [a, b]

if __name__ == "__main__":
    import sys
    phase = sys.argv[1]
    N = int(sys.argv[2]) if len(sys.argv) > 2 else 150

    if phase == "join":
        with ThreadPoolExecutor(max_workers=64) as ex:
            t0 = time.time(); res = list(ex.map(join, range(N))); el = time.time()-t0
        report("150 joins at once", res); print(f"   wall {el:.1f}s → {N/el:.0f} joins/s")

    elif phase == "burst":
        with ThreadPoolExecutor(max_workers=64) as ex:
            t0 = time.time(); res = list(ex.map(note, range(N))); el = time.time()-t0
        report("150 notes sent at once", res); print(f"   wall {el:.1f}s → {N/el:.0f} notes/s")

    elif phase == "poll":
        secs = int(sys.argv[3]) if len(sys.argv) > 3 else 30
        stop = time.time() + secs
        results, lock = [], threading.Lock()
        def phone(pid):
            out = []
            while time.time() < stop:
                out.extend(phone_poll(pid))
                time.sleep(4)
            with lock: results.extend(out)
        with ThreadPoolExecutor(max_workers=N) as ex:
            t0 = time.time(); list(ex.map(phone, range(N))); el = time.time()-t0
        report(f"{N} phones polling for {secs}s", results)
        print(f"   {len(results)/el:.0f} requests/s sustained")

    elif phase == "mixed":
        secs = 20
        stop = time.time() + secs
        results, lock = [], threading.Lock()
        def phone(pid):
            out = []
            while time.time() < stop:
                out.extend(phone_poll(pid)); time.sleep(4)
            with lock: results.extend(out)
        writes = []
        def burst():
            time.sleep(6)
            with ThreadPoolExecutor(max_workers=64) as ex:
                writes.extend(ex.map(note, range(N)))
        tb = threading.Thread(target=burst); tb.start()
        with ThreadPoolExecutor(max_workers=N) as ex:
            list(ex.map(phone, range(N)))
        tb.join()
        report("reads during the burst", results)
        report("the 150-note burst itself", writes)
