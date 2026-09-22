# The Missing Piece — run of show

A one-page script for the day. Times assume a 90-minute session with 150 people;
squeeze or stretch the brainstorm rounds, not the AI pause.

---

## Before anyone arrives

- [ ] Open `health.html`, press **Run the checks**, everything green
- [ ] Open `control.html`, unlock, **Clear this room**
- [ ] Open `present.html` on the projector, press **f** for full screen
- [ ] Scan the QR yourself with your own phone. Do not skip this.
- [ ] Have `node server/server.js` ready to run in a Terminal window, just in case
- [ ] Check the room code on screen is readable from the back row

---

## 0:00 — Title slide (5 min)

The QR and room code are up. People join as they settle.

Say: *"Two teams, one patient. By the end of this session we'll have found the
gaps between us — in your words, not mine."*

Watch the counter climb. Do not move on until it stops climbing.

---

## 0:05 — Who's in the room (3 min)

The split between nephrology and palliative care, and the roles within each.

Say: *"Look at that split. Every one of those people has seen the same patient
from a different side."*

---

## 0:08 — Question 1 (12 min)

**"Where do patients fall through the cracks?"**

Board opens automatically. Notes appear live.

- Give them 2 minutes of silence before anyone types. The first answer sets the
  tone for the rest — if it's bland, everything after it is bland.
- Read two or three aloud as they land. Especially an uncomfortable one.
- Press **w** to switch to the word cloud once you have 40+ notes.

Close the board (toggle on the control panel) before you start talking again,
or half the room keeps typing.

---

## 0:20 — Question 2 (12 min)

**"What do you wish the other team understood?"**

This is the one that usually produces the sharpest material. Let it run.

Say: *"Not a complaint. The thing you've explained a hundred times that still
doesn't land."*

---

## 0:32 — Question 3 (10 min)

**"What stops you from asking for help?"**

Remind them, explicitly: *"Nothing here has your name on it. Nobody can tell
who wrote what — not me, not the system."* Say it out loud. It changes what
you get.

---

## 0:42 — What you've told us (2 min)

The totals slide. Let it land: how many concerns, how split across the two
teams.

---

## 0:44 — THE AI PAUSE (8 min)

This is the only part where the room waits on you. Have something for them to
do — a coffee break, or a table discussion on "what do you think the biggest
gap will turn out to be?"

1. **Download .txt** on the control panel
2. **Copy the prompt**, paste into your AI, attach the .txt
3. Paste the reply into the import box, **Check and import**

If it refuses because the AI invented a label, say so out loud — it is a good
moment to show the room that nothing here is being made up on their behalf.
Ask the AI to redo it using only the labels in the file.

**If the AI is slow or the wifi dies:** have a pre-written set of 5 problem
statements ready in a text file you can paste instead. The workshop does not
stop for a chatbot.

---

## 0:52 — The gaps, in your words (6 min)

The problem statements, each showing how many concerns it came from and the
split between the two teams.

Say: *"Every one of these came from what you wrote. None of it is mine."*

Point at a group raised by **both** disciplines. That is the whole argument of
the session in one card.

---

## 0:58 — Closing the gaps (22 min)

Open board. People pick a gap on their phone and add ideas.

- Start open — let people go where their energy is.
- After about 8 minutes, look at the idea counts. If one problem has nothing,
  **Spotlight** it and pull everyone there for 5 minutes.
- Spotlight is also the move if the room goes quiet. A single shared problem is
  easier to answer than five.

Watch the pieces interlock on screen — nephrology ideas and palliative ideas
plugging into the same problem. Name it when you see it.

---

## 1:20 — Closing slide (5 min)

*"Neither of us had the whole picture."*

The totals: concerns, shared problems, ideas.

Say what happens next, concretely. Who takes the spreadsheet, and when they
report back. A workshop with no follow-up is a workshop people stop coming to.

---

## Immediately afterwards — do not skip

- [ ] **Download .xlsx**
- [ ] **Download .json** (the full backup)
- [ ] **Download solutions .txt**
- [ ] Email all three to yourself before you close the laptop

---

## If something breaks

| What you see | What to do |
|---|---|
| Nobody can join | Check the board is open. Check the room code on screen matches `config.js`. |
| "Can't reach the workshop" on phones | Supabase may be paused. Switch to the laptop server: `node server/server.js`, put the printed address on screen. |
| Projector stuck on one slide | Refresh it. It picks up whatever slide the control panel is on. |
| A note appears twice | It won't — retries are de-duplicated. If you genuinely see it twice, two people wrote the same thing. |
| Import refused | The AI invented a label. Ask it again, insisting it use only labels from the file. |
| Someone's phone shows "saved on your phone" | Their signal dropped. It sends itself when it returns. Nothing is lost. |
