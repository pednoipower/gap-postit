#!/usr/bin/env python3
"""
WCAG contrast check for every colour pair this workshop actually puts on a
screen — the projector's dark theme, the phone's light one, the notes' ink on
tinted paper, and the control panel. Run it after touching a colour:

    python3 tools/contrast-check.py

Large text (>=24px, or >=18.66px bold) needs 3:1; everything else 4.5:1.
The pairs are listed by hand because the colours come from three places —
theme.css tokens, config.js and inline styles — and a scraper would miss the
ones composed at runtime (a note's ink on paper tinted 68% toward white).
"""


def lin(c):
    c = c/255
    return c/12.92 if c <= 0.03928 else ((c+0.055)/1.055) ** 2.4
def lum(hexs):
    h = hexs.lstrip('#')
    if len(h) == 3: h = ''.join(c*2 for c in h)
    r,g,b = (int(h[i:i+2],16) for i in (0,2,4))
    return 0.2126*lin(r) + 0.7152*lin(g) + 0.0722*lin(b)
def ratio(a,b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la,lb), min(la,lb)
    return (hi+0.05)/(lo+0.05)
def tint(hexs, amount):           # same maths as assets/paper.js
    h = hexs.lstrip('#')
    r,g,b = (int(h[i:i+2],16) for i in (0,2,4))
    m = lambda v: round(v + (255-v)*amount)
    return '#%02x%02x%02x' % (m(r), m(g), m(b))

INK   = "#0f2a23"   # projector ground
CARD  = "#15352c"   # projector surface
MIST  = "#f5f7f5"   # phone / control ground
WHITE = "#ffffff"

pairs = [
 # --- projector, dark ---
 ("PROJECTOR", "slide headline  #f5f7f5", "#f5f7f5", INK, 24),
 ("PROJECTOR", "slide subtitle  green-200", "#a9cdb9", INK, 20),
 ("PROJECTOR", "key row         green-200", "#a9cdb9", INK, 13),
 ("PROJECTOR", "column head     gold-300", "#e6cb74", INK, 22),
 ("PROJECTOR", "column head     pink-300", "#ec88ac", INK, 22),
 ("PROJECTOR", "count label     green-200", "#a9cdb9", INK, 18),
 ("PROJECTOR", "corner chip     green-200", "#a9cdb9", INK, 13),
 ("PROJECTOR", "empty-column note green-200", "#a9cdb9", INK, 16),
 ("PROJECTOR", "gap card text   #ffffff", "#ffffff", CARD, 26),
 ("PROJECTOR", "gap tag G1      #a9cdb9", "#a9cdb9", CARD, 14),
 ("PROJECTOR", "highlight G1    #a9cdb9", "#a9cdb9", CARD, 26),
 ("PROJECTOR", "highlight G2    #e6cb74", "#e6cb74", CARD, 26),
 ("PROJECTOR", "highlight G3    #76ad90", "#76ad90", CARD, 26),
 ("PROJECTOR", "highlight G4    #f4b6cd", "#f4b6cd", CARD, 26),
 ("PROJECTOR", "highlight in headline G3", "#76ad90", INK, 40),
 ("PROJECTOR", "talk countdown  #f5f7f5", "#f5f7f5", INK, 60),
 # --- notes: ink on tinted paper ---
 ("NOTE", "cause  ink on gold paper",    "#3a2f06", tint("#c9a227",.68), 15),
 ("NOTE", "works  ink on pink paper",    "#4a132b", tint("#d6457f",.68), 15),
 ("NOTE", "asset  ink on green paper",   "#0f2a23", tint("#2e6e52",.68), 15),
 ("NOTE", "stop   ink on red paper",     "#3d1310", tint("#c0392b",.68), 15),
 ("NOTE", "practice ink on grey paper",  "#141a18", tint("#8c9792",.68), 15),
 # --- phone, light ---
 ("PHONE", "body text        #141a18 / Mist", "#141a18", MIST, 16),
 ("PHONE", "body text        #141a18 / white", "#141a18", WHITE, 16),
 ("PHONE", "secondary        #505a56 / white", "#505a56", WHITE, 14),
 ("PHONE", "heading          #173f35 / white", "#173f35", WHITE, 22),
 ("PHONE", "placeholder      #6a7570 / white", "#6a7570", WHITE, 17),
 ("PHONE", "send button      #fff on pink-600", "#ffffff", "#b8316a", 17),
 ("PHONE", "disabled button  #505a56 on #e9edea", "#505a56", "#e9edea", 17),
 ("PHONE", "worked example   gold-700 on #fdf8ec", "#8a6d12", "#fdf8ec", 14),
 ("PHONE", "nudge            gold-700 on #fdf8ec", "#8a6d12", "#fdf8ec", 14),
 ("PHONE", "step chip done   green-600 on green-50", "#225a43", "#eef5f1", 12.5),
 ("PHONE", "step chip idle   #505a56 on #e9edea", "#505a56", "#e9edea", 12.5),
 ("PHONE", "step chip active #fff on green-800", "#ffffff", "#173f35", 12.5),
 ("PHONE", "highlight G1     #225a43 on white", "#225a43", WHITE, 22),
 ("PHONE", "highlight G2     #8a6d12 on white", "#8a6d12", WHITE, 22),
 ("PHONE", "highlight G4     #6f1c40 on white", "#6f1c40", WHITE, 22),
 ("PHONE", "practice note    #505a56 on white", "#505a56", WHITE, 14),
 # --- control panel ---
 ("CONTROL", "meter value     #173f35 on green-50", "#173f35", "#eef5f1", 30),
 ("CONTROL", "meter label     #505a56 on green-50", "#505a56", "#eef5f1", 11.5),
 ("CONTROL", "phase chip collect gold-700 on #fdf8ec", "#8a6d12", "#fdf8ec", 12.5),
 ("CONTROL", "phase chip talk  #2f6690 on #e8eff5", "#2f6690", "#e8eff5", 12.5),
 ("CONTROL", "board closed     #c0392b on #fbeceb", "#c0392b", "#fbeceb", 15),
 ("CONTROL", "next line        #505a56 on white", "#505a56", WHITE, 13),
 ("CONTROL", "clock note       #8a6d12 on white", "#8a6d12", WHITE, 12.5),
 ("CONTROL", "reveal button    #fff on green-600", "#ffffff", "#225a43", 17),
 ("CONTROL", "primary button   #fff on pink-600", "#ffffff", "#b8316a", 17),
]

def need(size, bold=True):
    # WCAG large text = 18.66px bold or 24px regular
    return 3.0 if (size >= 24 or (bold and size >= 18.66)) else 4.5

print(f"{'where':<10} {'what':<42} {'ratio':>6}  need  verdict")
print("-"*82)
fails = []
for where, what, fg, bg, size in pairs:
    r = ratio(fg,bg); n = need(size)
    ok = r >= n
    if not ok: fails.append((where,what,round(r,2),n))
    print(f"{where:<10} {what:<42} {r:>6.2f}  {n:>4.1f}  {'ok' if ok else 'FAIL'}")
print()
print("FAILURES:", len(fails))
for f in fails: print("  ", f)
