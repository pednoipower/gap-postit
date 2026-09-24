#!/usr/bin/env python3
"""
What nothing uses any more, and what the code uses that is not there.

    python3 tools/dead-code.py

Counts bare references, not just calls, so a function passed to a map or an
event listener does not look dead. Knows that some strings are only ever
reached by building their key ("ov_" + stance, hint(k) + "_p"), so they are
reported separately rather than deleted by mistake. Treats an @import in a
stylesheet as loading the file.
""" 
import re, io, glob, os

HTML = ["index.html","board.html","present.html","control.html","health.html"]
JS   = sorted(glob.glob("assets/*.js"))
def read(p): return io.open(p, encoding="utf-8").read()
def scripts(p):
    s = read(p)
    return "\n".join(re.findall(r"<script>(.*?)</script>", s, re.S)) if p.endswith(".html") else s

ALL_CODE = "\n".join(scripts(p) for p in HTML + JS)
ALL_HTML = "\n".join(read(p) for p in HTML)
ALL_FILES = ALL_HTML + "\n".join(read(p) for p in glob.glob("assets/*.css"))

print("=== functions nobody calls ===")
for p in HTML + JS:
    body = scripts(p)
    for m in re.finditer(r"^\s*(?:async\s+)?function\s+([A-Za-z_]\w*)\s*\(", body, re.M):
        name = m.group(1)
        uses = len(re.findall(r"\b" + re.escape(name) + r"\b", body))
        exported = re.search(r"window\.\w+\s*=\s*\{[^}]*\b" + re.escape(name) + r"\b", body, re.S)
        if uses <= 1 and not exported and name not in ("t","t2"):
            print(f"  {p:<14} {name}()")

print("\n=== $(\"id\") the page does not have ===")
ids = set(re.findall(r'id="([^"]+)"', ALL_HTML))
for p in HTML:
    body = scripts(p)
    page_ids = set(re.findall(r'id="([^"]+)"', read(p)))
    for m in set(re.findall(r'\$\("([^"]+)"\)', body)):
        if m not in page_ids:
            print(f"  {p:<14} $(\"{m}\")  ← not in this page")

print("\n=== strings ===")
st = read("assets/strings.js")
keys = re.findall(r"^\s{4}([a-z_0-9]+):\s*\{\s*th:", st, re.M)
dynamic = set()
for suffix in re.findall(r'k\s*\+\s*"(_\w+)"', ALL_CODE):
    dynamic |= {k for k in keys if k.endswith(suffix)}
for pre in re.findall(r'"(\w+_)"\s*\+', ALL_CODE):
    dynamic |= {k for k in keys if k.startswith(pre)}
dead = [k for k in keys
        if not re.findall(r'["\']' + re.escape(k) + r'["\']', ALL_CODE) and k not in dynamic]
print("  never used :", ", ".join(dead) if dead else "none")
print("  built by key:", ", ".join(sorted(dynamic)) or "none")

print("\n=== config keys nothing reads ===")
cfg = read("assets/config.js")
for m in re.finditer(r"^\s{2}([a-zA-Z_]\w*):", cfg, re.M):
    k = m.group(1)
    if len(re.findall(r"cfg\." + re.escape(k) + r"\b|CONFIG\." + re.escape(k) + r"\b", ALL_CODE)) == 0:
        print(f"  {k}")

print("\n=== files nothing loads ===")
for f in JS + sorted(glob.glob("assets/*.css")):
    base = os.path.basename(f)
    if base == "version.js": continue
    if len(re.findall(re.escape(base), ALL_FILES + ALL_CODE)) == 0:
        print(f"  {f}")
