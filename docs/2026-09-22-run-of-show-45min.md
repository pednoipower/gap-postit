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
- [ ] `control.html` → unlock → **Load the expected gaps**. Check the
      projector's gaps slide shows all four with their numbers.
- [ ] Dry run with two phones (one per team). Then **Clear this room** and
      **Load the expected gaps** again.
- [ ] `health.html` → **Run the checks**, all green.
- [ ] Scan the QR from the back of the room.

## 0:00 — Join (4 min)

Slide 1 (QR) then slide 2 (who's in the room). Phones ask team, role, and
where they mainly work. Say out loud: *nothing is linked to your name.*

## 0:04 — The four gaps from the pre-survey (2 min)

Slide 3. Four pieces, each with its survey number in red. *These are what
16 hospitals told us. They have numbers. None of them is about any one
person — and the survey can't tell us why. You can.* Phones show the same
list.

## 0:06 — Four gaps, 7 minutes each (28 min)

For each gap, two slides.

**WHY (3 min).** The phone shows the gap and its number and first asks
*at your hospital: still the case / not the case — it works here*. Then a
fill-in-the-blank, all four required:

> **[gap] เนื่องจาก ในสถานการณ์**… · **ใคร** (tap) **มักจะ**… · **เพราะ**…

— in what situation, who, does or doesn't do what, because of what reason or
missing resource. The sentence assembles itself on the phone as they type.
*Situation* is deliberately wide — time, place, workload, policy or KPIs,
information, the relationship between the teams, the patient's path — not
only the patient's clinical stage; the phone says so under the blank.
People from hospitals where it already works fill the mirror image
(*[gap] ไม่เกิดที่ รพ. ของเรา เนื่องจาก ในสถานการณ์… ใคร จะ… เพราะ…*).

Examples:
- G1, workload: *…เนื่องจาก ในสถานการณ์คลินิกไตวันพุธคนล้น 80 ราย แพทย์โรคไต
  มักจะไม่ได้ประเมินว่าเหมาะกับ CKM หรือไม่ เพราะไม่มีเกณฑ์ และไม่มีช่องใน HIS*
- G3, place and relationship: *…เนื่องจาก ในสถานการณ์ทีม PC อยู่คนละตึก
  และไม่มีวันราวด์ร่วม ทีมประคับประคองมักจะเห็นผู้ป่วยต่อเมื่อถูกปรึกษา เพราะ
  ไม่มีเวทีทบทวนผู้ป่วยร่วมกัน*
- G4, incentive: *…เนื่องจาก ในสถานการณ์ตัวชี้วัดของหน่วยนับจำนวนผู้ป่วยที่ได้เริ่ม
  ฟอก แพทย์โรคไตมักจะไม่เปิดเรื่อง ACP ก่อนเริ่ม HD เพราะเกรงว่าครอบครัวจะเข้าใจ
  ว่า "ไม่รักษา"* Say out loud:
*one sentence that pins down where it breaks — talk about the system, not
people.*

The projector is blind: a count and the split by team. At 2:30, **Reveal**:
each note reads as its sentence — causes on one side, *where it works, and
why* on the other. Read out one cause from each colour, then one "works
here" if there is one: that is the room's proof it can be done. Do not
discuss.

**HOW (4 min).** The phone shows the program's proposal as a seed (*build
on it, or propose something else*), then asks people to pick **something
that already exists here — use it more** or **something new**, and to give
*what* and *why it would work here*. Both boxes required. The projector
keeps the causes on screen and shows a count for the answers. At 3:30,
**Reveal**: causes and solutions side by side; "already exists" notes are
marked ✓. Read one existing and one new. Move on.

Slides 4–11: G1 why, G1 how, G2 why, G2 how, G3 why, G3 how, G4 why, G4 how.

## 0:34 — Overall (5 min)

Slide 12. Same *how* format, for something the two teams should do that is
not about any one gap. No seed. Reveal at 4:30.

## 0:39 — Close (5 min)

Slide 13. *Neither of us had the whole picture*, with tonight's counts and
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
| Gaps slide says "waiting for the gaps" | You didn't press **Load the expected gaps**. Do it now; nothing is lost. |
| Projector stuck | Refresh it. It follows the control panel. |
| No internet | `node server/server.js`, put the printed address on screen. |
