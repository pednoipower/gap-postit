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
      slide (120 by default); `sessionMinutes` is the session clock.
- [ ] The room exists in the database with the code in `config.js`:
      `supabase/new-room.sql` opens one.
- [ ] Dry run with two phones (one per team). Then **Clear this room**; the
      gaps go straight back in by themselves.
- [ ] `health.html` → **Run the checks**, all green.
- [ ] Scan the QR from the back of the room.

## 0:00 — Join (3 min)

Slide 1 (QR) then slide 2 (who's in the room). Phones ask team, role, and
where they mainly work. Say out loud: *nothing is linked to your name.*

**Say it while they are still finding seats:** *sit next to somebody from the
other team.* Everything after this depends on it, and it is free.

## 0:03 — Practice round: today's notice, tomorrow's deadline (4 min)

Slide 3. A gap nobody can be blamed for and everybody in Thai healthcare has
lived — *งานด่วนมักแจ้งวันนี้และให้เริ่มพรุ่งนี้* — run through exactly the
machinery of the real rounds: the same sentence, the same blind collection,
the same reveal. It does three jobs at once: it teaches the form, it breaks
the ice, and it proves every phone in the room can reach the board before
anything matters.

It was chosen for its causes, not for the laugh. The chain it produces is
*คนทำงานหน้างาน · มักจะทำไปก่อนทั้งที่ยังไม่แน่ใจว่าต้องทำอย่างไร · ตอนมี
ข้อความส่งต่อกันหลายทอดตอนเย็น และให้เริ่มใช้เช้าวันถัดไป · เพราะไม่มีคนสรุปว่า
งานเปลี่ยนตรงไหน ใครต้องทำ และถ้าสงสัยให้ถามใคร* — instructions travelling
down a chain with nobody named to turn them into tasks, which is the same
shape as the reasons behind the four real gaps. Same shape as the reasons behind the four real gaps,
which is the whole point of rehearsing on it.

- 90 seconds to write. The projector shows only a count.
- **Reveal.** Read two out loud, one of each colour. Note the meta-joke:
  we will find out in 40 minutes whether we are any better.
- Then name the machine, pointing at the screen: *ในสถานการณ์ไหน · ใคร ·
  มักจะทำอะไร · เนื่องจากอะไร. Nobody wrote a person's name; you all wrote
  the system.*
- The one thing worth saying about the form, if a chain on screen repeats
  itself: *สามช่องควรบอกคนละเรื่อง — ช่องแรกคือสถานการณ์ที่อาจจะเป็นอย่างอื่นก็ได้
  (กี่โมง งานล้นแค่ไหน ใครอยู่ตรงนั้น กติกาอะไรใช้อยู่) ช่องสุดท้ายคือเหตุผล.* Do not
  police which category a phrase belongs to — an absent rule is a legitimate
  condition. Redundancy is the only failure that costs you data.

Its notes are stored (so you can see them arrive) but never exported, never
counted on the closing slide, and never sent to the AI. To skip the round,
set `practice: null` in `config.js`.

## 0:07 — The four gaps from the pre-survey (2 min)

Slide 3. Four cards, each with its survey number in colour. *These are what
16 hospitals told us. They have numbers. None of them is about any one
person — and the survey can't tell us why. You can.* Phones show the same
list.

## 0:09 — Four gaps, 7½ minutes each (30 min)

For each gap, three slides: **why**, two minutes of **turn and talk**, then
**how**. Each slide carries its own clock on the control panel, and the
projector shows the same seconds; **Pause** (or <kbd>P</kbd>) stops both at
once, **Reset** puts the round back to 0:00.

**WHY (2½ min).** The phone shows the gap and its number and first asks,
about their own week rather than about the hospital's paperwork: *ยังเจอแบบนี้
อยู่* or *ไม่ค่อยเจอ — ที่นี่มีวิธีรับมืออยู่แล้ว*. Then a
fill-in-the-blank, all four required:

> **[gap] — ยังเจอในงานของเรา:** **ใคร** (tap) **มักจะ** [ทำอะไร] **ตอน** [สถานการณ์] **เพราะ** [เหตุผล]

— who, does or doesn't do what, in what situation, because of what reason or
missing resource. The actor is a tap and comes first, so the sentence starts
without anyone typing; the situation is then a question about something they
have already written down — *เป็นแบบนั้นตอนไหน* — rather than an invitation to
describe conditions in the abstract. The sentence assembles itself on the
phone as they type, and a finished example in the same grammar sits above the
blanks. *Situation / condition* is free text with four cues — time or step · task or activity ·
resources (staff, time, budget, information, equipment) · people and rules
(who is there, what indicator is in force) — so people describe rather than
classify. The last cue is the one that reaches the POLICY/KPI and TEAM
RELATIONSHIP rows of the codebook; without it people mostly write about how
busy they were. Context is decided at coding, not on the phone: what the
blank has to produce is a circumstance that could have been otherwise, so
that sites where the response differs can be compared. Context is coded afterwards with
`docs/2026-09-22-context-codebook.md`.
People whose own week rarely shows the gap fill the mirror image
(*[gap] — ไม่ค่อยเจอในงานของเรา: ใคร มักจะ… ตอน… เพราะ…*).

Examples:
- G1, workload: *แพทย์โรคไตมักจะไม่ได้ประเมินว่าใครเหมาะกับ CKM ตอนคลินิกไต
  วันพุธมีผู้ป่วย 80 ราย และมีแพทย์คนเดียว เพราะไม่มีเกณฑ์ที่ตกลงกันไว้ และ
  ไม่มีช่องบันทึกใน HIS*
- G3, place and relationship: *ทีมประคับประคองมักจะเห็นผู้ป่วยต่อเมื่อถูกปรึกษา
  ตอนทีม PC อยู่คนละตึกและไม่มีวันราวด์ร่วม เพราะไม่มีเวทีทบทวนผู้ป่วยร่วมกัน*
- G4, incentive: *แพทย์โรคไตมักจะไม่เปิดเรื่อง ACP ก่อนเริ่ม HD ตอนตัวชี้วัดของ
  หน่วยนับจำนวนผู้ป่วยที่ได้เริ่มฟอก เพราะเกรงว่าครอบครัวจะเข้าใจว่า "ไม่รักษา"*
  Say out loud:
*one sentence that pins down where it breaks — talk about the system, not
people.*

The projector is blind: a count and the split by team. At 2:00, **Reveal**:
each note reads as its sentence — causes on one side, *where it works, and
why* on the other. Read out one cause from each colour, then one "works
here" if there is one: that is the room's proof it can be done. Do not
discuss.

**TURN AND TALK (2 min).** The why round is already closed, so nothing said
here can shape what was written — these are the two minutes the room is meant
to be loud. The gap stays on screen as the slide's title; under it a running
countdown and two questions: *ที่ของ
คุณเป็นแบบเดียวกันไหม* and *อีกทีมเห็นอะไรที่เราไม่เห็น*. Phones say, in so many
words, put me down and turn around. Do not fill the silence; let it get
noisy and then move.

**HOW (3 min).** The phone asks people to pick **something that already
exists here — use it more** or **something new**, and to give *what* and
*why it would work here*. The program's own proposal is shown nowhere —
not on the screen, not on the phone — so that what comes back is the room's
and not an echo. It sits in `config.js` and in the export, beside what
people actually wrote. Both boxes required. The projector
keeps the causes on screen and shows a count for the answers. At 2:15,
**Reveal**: causes and solutions side by side; "already exists" notes are
marked ✓. Read one existing and one new. Move on.

Slides 5–16: for each gap, why → turn and talk → how.

## 0:39 — Overall (3 min)

Slide 17. Same *how* format, for something the two teams should do that is
not about any one gap. No seed. Reveal at 2:15.

## 0:42 — Close (3 min)

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
