# Run of show — 45 minutes

Two goals, in this order of priority on the day:

1. **The room feels that the two teams can fix this together.** People voice a
   real problem, see at once that the other colour is describing the same
   failures, then spend most of the time building rather than complaining.
2. **Data for initial programme theories**: for each gap the evidence points
   to, what people here say would *help* (and how) and what would *get in the
   way* (and why), plus their own if/then/because ideas — every note tagged by
   team, role and setting.

Nothing is analysed in the room. Grouping and coding happen afterwards.

---

## The day before

- [ ] `config.js`: the gaps in `seedThemes` are real, in the order you want,
      each with its one-sentence `proposal`. The phone shows exactly this text.
- [ ] `control.html` → unlock → **Load the expected gaps**. Check the
      projector's gaps slide shows them.
- [ ] Dry run with two phones (one per team). Then **Clear this room**
      (loads nothing away — the gaps stay).
- [ ] `health.html` → **Run the checks**, all green.
- [ ] Scan the QR from the back of the room.

## 0:00 — Join (4 min)

Slide 1 (QR) then slide 2 (who's in the room). Phones ask team, role, and
where they mainly work. Say out loud: *nothing is linked to your name.*

## 0:04 — One question (9–10 min)

Slide 3. Board opens automatically. *Think of a real patient — where did they
fall through the gap between our two teams?* Optional tap: when it happens.

The wall is live, in both colours. When the two colours are visibly saying the
same things, point at it. That is the moment the room decides this is a shared
problem, not one side's fault. Close with the arrow key or Next.

## 0:14 — The gaps from the evidence (2 min)

Slide 4. Three pieces: the gap, and what the program proposes for it.
*These are known. They have names. That is why we're here.* No phones.

## 0:16 — Three gap slides, 5 min each (15 min)

Slides 5–7. For each: the phone shows the proposal and asks people to pick
**something here that would help** or **something that would get in the
way**, then two boxes — *what*, and *how / why*. Both are required; the send
button says so.

The projector is **blind**: only a count and the split by team. Say so.
At about 4:30, press **Reveal** on the control panel. The board for that gap
closes, and the projector shows what-would-help and what-we'd-need side by
side, in both colours, each note with its how/why.

Read out one *helps* from each colour, then one *needs*. Move on. Do not
discuss — 5 minutes is the whole budget.

## 0:31 — Their own ideas (9 min)

Slide 8. Board opens. They pick a gap — or **ภาพรวม** for an idea that is
about the two teams in general — then three boxes: *If we… / then… /
because people would…* All three required. Point at the example on screen.
The wall is live; ideas carry the gap they answer.

Throughout, the phone shows a three-step strip (story · gaps n/3 · ideas)
so people know where they are; during the gaps slide and each reveal it
also lists the gaps, for anyone who cannot read the projector.

## 0:40 — Close (4 min)

Slide 9. *Neither of us had the whole picture*, with tonight's counts and how
many gaps both teams answered. If `signupUrl` is set, the QR for people
willing to be interviewed appears here — separate from everything they wrote.

---

## Afterwards

**Download .xlsx** on the control panel. Six sheets: concerns, help-and-need
(what + how/why), own ideas, a crosstab by gap × team × role, the gaps, and
who was there. Every row carries team, role, setting and the anonymous phone
id, so within-person chains can be reassembled without identity.

The AI prompt on the control panel groups the *concerns* against the loaded
gaps; the manual board (`group.html`) does the same by hand.

## If something breaks

| What you see | What to do |
|---|---|
| Phones say "wait" on a gap slide | The board is closed: check the toggle, or you pressed Reveal. **Collect again (blind)** reopens it. |
| Gaps slide says "waiting for the gaps" | You didn't press **Load the expected gaps**. Do it now; nothing is lost. |
| Projector stuck | Refresh it. It follows the control panel. |
| No internet | `node server/server.js`, put the printed address on screen. |
