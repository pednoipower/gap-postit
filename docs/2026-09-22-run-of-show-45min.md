# Run of show — 45 minutes

Two goals, in this order of priority on the day:

1. **The room feels that the two teams can fix this together.** The survey
   says *what* is missing; the people in the room supply *why* and *how*.
   They are the authors, not the audience.
2. **Data for initial programme theories**: for each of the four gaps, why
   it happens here (causes), and what people would do — what already exists
   and should be used more, and what is new — each with why it would work.
   Every note tagged by team, role and setting.

Nothing is analysed in the room.

---

## The day before

- [ ] `config.js` → `seedThemes`: the four gaps, their survey numbers and
      the program's proposals read correctly in Thai.
- [ ] `control.html` → unlock. The gaps are written into the room for you —
      check the projector's gaps slide shows all four with their numbers.
- [ ] `config.js` → `practice`: the warm-up gap and its own WHO list read
      well for this audience. `talkSeconds` is the countdown on the talk
      slide (60 by default).
- [ ] Dry run with two phones (one per team). Then **Clear this room**; the
      gaps go straight back in by themselves.
- [ ] `health.html` → **Run the checks**, all green.
- [ ] Scan the QR from the back of the room.

## 0:00 — Join (3 min)

Slide 1 (QR) then slide 2 (who's in the room). Phones ask team, role, and
where they mainly work. Say out loud: *nothing is linked to your name.*

**Say it while they are still finding seats:** *sit next to somebody from the
other team.* Everything after this depends on it, and it is free.

## 0:03 — Practice round: the lift (4 min)

Slide 3. A gap nobody can be blamed for — *ลิฟต์โรงพยาบาลไม่เคยมาสักที* —
run through exactly the machinery of the real rounds: the same sentence, the
same blind collection, the same reveal. It does three jobs at once: it
teaches the form, it breaks the ice, and it proves every phone in the room
can reach the board before anything matters.

- 90 seconds to write. The projector shows only a count.
- **Reveal.** Read two out loud, one of each colour. The room laughs.
- Then name the machine, pointing at the screen: *ในสถานการณ์ไหน · ใคร ·
  มักจะทำอะไร · เนื่องจากอะไร. Notice nobody wrote a person's name — you all
  wrote the system. That is exactly what we need for the next four.*

Its notes are stored (so you can see them arrive) but never exported, never
counted on the closing slide, and never sent to the AI. To skip the round,
set `practice: null` in `config.js`.

## 0:07 — The four gaps from the pre-survey (2 min)

Slide 3. Four cards, each with its survey number in colour. *These are what
16 hospitals told us. They have numbers. None of them is about any one
person — and the survey can't tell us why. You can.* Phones show the same
list.

## 0:09 — Four gaps, 6½ minutes each (26 min)

For each gap, three slides: **why**, a minute of **turn and talk**, then
**how**.

**WHY (2½ min).** The phone shows the gap and its number and first asks,
about their own week rather than about the hospital's paperwork: *ยังเจอแบบนี้
อยู่* or *ไม่ค่อยเจอ — ที่นี่มีวิธีรับมืออยู่แล้ว*. Then a
fill-in-the-blank, all four required:

> **[gap] เพราะเมื่อ** [สถานการณ์/เงื่อนไข] · **ใคร** (tap) **มักจะ** [การตอบสนอง] · **เนื่องจาก** [เหตุผล]

— in what situation, who, does or doesn't do what, because of what reason or
missing resource. The sentence assembles itself on the phone as they type.
*Situation / condition* is free text, prompted with *ลองระบุเงื่อนไขที่ทำให้
ช่องว่างนี้เกิดขึ้น* and three cues — time or step · task or activity ·
resources (staff, time, budget, information, equipment) — so people describe
rather than classify. Context is coded afterwards with
`docs/2026-09-22-context-codebook.md`.
People from hospitals where it already works fill the mirror image
(*[gap] ไม่เกิดที่ รพ. ของเรา เพราะเมื่อ… ใคร จะ… เนื่องจาก…*).

Examples:
- G1, workload: *…เพราะเมื่อคลินิกไตวันพุธคนล้น 80 ราย แพทย์โรคไตมักจะไม่ได้
  ประเมินว่าเหมาะกับ CKM หรือไม่ เนื่องจากไม่มีเกณฑ์ และไม่มีช่องใน HIS*
- G3, place and relationship: *…เพราะเมื่อทีม PC อยู่คนละตึกและไม่มีวันราวด์ร่วม
  ทีมประคับประคองมักจะเห็นผู้ป่วยต่อเมื่อถูกปรึกษา เนื่องจากไม่มีเวทีทบทวนผู้ป่วย
  ร่วมกัน*
- G4, incentive: *…เพราะเมื่อตัวชี้วัดของหน่วยนับจำนวนผู้ป่วยที่ได้เริ่มฟอก
  แพทย์โรคไตมักจะไม่เปิดเรื่อง ACP ก่อนเริ่ม HD เนื่องจากเกรงว่าครอบครัวจะเข้าใจ
  ว่า "ไม่รักษา"* Say out loud:
*one sentence that pins down where it breaks — talk about the system, not
people.*

The projector is blind: a count and the split by team. At 2:00, **Reveal**:
each note reads as its sentence — causes on one side, *where it works, and
why* on the other. Read out one cause from each colour, then one "works
here" if there is one: that is the room's proof it can be done. Do not
discuss.

**TURN AND TALK (1 min).** The why round is already closed, so nothing said
here can shape what was written — this is the one minute the room is meant
to be loud. The projector shows a running countdown and two questions: *ที่ของ
คุณเป็นแบบเดียวกันไหม* and *อีกทีมเห็นอะไรที่เราไม่เห็น*. Phones say, in so many
words, put me down and turn around. Do not fill the silence; let it get
noisy and then move.

**HOW (3 min).** The phone shows the program's proposal as a seed (*build
on it, or propose something else*), then asks people to pick **something
that already exists here — use it more** or **something new**, and to give
*what* and *why it would work here*. Both boxes required. The projector
keeps the causes on screen and shows a count for the answers. At 2:15,
**Reveal**: causes and solutions side by side; "already exists" notes are
marked ✓. Read one existing and one new. Move on.

Slides 5–16: for each gap, why → turn and talk → how.

## 0:35 — Overall (4 min)

Slide 17. Same *how* format, for something the two teams should do that is
not about any one gap. No seed. Reveal at 3:00.

## 0:39 — Close (4 min, and 2 in hand)

Slide 18. *Neither of us had the whole picture*, with tonight's counts and
how many gaps both teams answered. If `signupUrl` is set, the QR for people
willing to be interviewed appears here — separate from everything they
wrote. Tell them the summary comes back to both teams.

---

## Afterwards

**Download .xlsx** on the control panel: *Why* (type, who, when, does,
because — one row per chain, from both hospitals with the gap and without);
*What we would do* (existing or new, with why it would work); a crosstab by
gap × team × role; the gaps; who was there. Every row carries team, role, setting and the anonymous
phone id, so within-person chains can be reassembled without identity.

The AI prompt on the control panel drafts a per-gap synthesis — causes,
existing assets, new ideas, and where the two teams differ — citing note
labels. It is a draft to code from, not findings.

## If something breaks

| What you see | What to do |
|---|---|
| Phones say "wait" on a gap slide | The board is closed: check the toggle, or you pressed Reveal. **Collect again (blind)** reopens it. |
| Gaps slide says "waiting for the gaps" | Unlock `control.html` — it writes them in. If they are still missing, press **Reload the gaps from config.js**. Nothing is lost either way. |
| Projector stuck | Refresh it. It follows the control panel. |
| No internet | `node server/server.js`, put the printed address on screen. |
