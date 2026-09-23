# The Missing Piece — how to run it

A 45-minute session for ~150 clinicians from 16 hospitals. Everyone answers on
their own phone; the projector shows the room what it said. You drive it all
from one page.

| | |
|---|---|
| **Participants** | `pednoipower.github.io/gap-postit/` — the QR on screen carries it |
| **Projector** | `pednoipower.github.io/gap-postit/present.html` |
| **You** | `pednoipower.github.io/gap-postit/control.html` |
| **Room** | `CANDO` · **Password** — the one in the database, not in these files |

---

## Before the day

1. **Change the password.** It is `ckm` today, which is fine for rehearsal and
   not for the day. In the Supabase SQL editor:
   `update public.rooms set control_token = '<a long phrase>' where code = 'CANDO';`
2. **Delete the old sandbox room** so a stale browser tab cannot drive a ghost
   room: `delete from public.rooms where code = 'PZKT';`
3. **Open `control.html` and unlock it.** The four gaps write themselves into
   the room; there is nothing to load by hand. Check the Slides tab shows 18.
4. **Run one round on a real phone** — scan the QR, join, answer G1, press
   send. Three minutes, and it is the only thing these instructions cannot
   prove for you.
5. **Clear the room** afterwards on the Room tab. A backup downloads first and
   the gaps go straight back in.

Bring: the laptop, the HDMI adapter, a phone that is not the laptop, and the
password written somewhere that is not the laptop.

---

## Setting up in the room (5 minutes)

- Projector window on the big screen, **full screen** (the button is top
  right, or press <kbd>F</kbd>). It shows the title and the QR.
- Control panel on the laptop screen. Unlock it.
- Both should show the same build number — control panel next to "Supabase",
  projector in the corner chip. If they differ, hard-refresh the projector
  (<kbd>⌘⇧R</kbd>).
- **Say this while people are still finding seats:** *นั่งข้างคนจากอีกทีม.*
  Everything after this depends on it and it costs nothing.

---

## Running it

The console at the top of the control panel never scrolls away. It shows where
you are, what the next slide is, how many answers are in, two clocks, and one
big button that is always the right thing to press.

| | Slide | Time | What you do |
|---|---|---|---|
| 1 | Title + QR | 3 | People join. Say *ไม่มีการบันทึกชื่อ.* |
| 2 | Who's in the room | | Let the two columns fill. |
| 3 | **Practice: งานด่วนมักแจ้งวันนี้** | 4 | 90s to write, then **Reveal**. Read two aloud. Then: *ช่องแรกคือสถานการณ์ · ใคร · มักจะ · เพราะ. ไม่มีใครเขียนชื่อคน — ทุกคนเขียนระบบ.* |
| 4 | The four gaps | 2 | *These are the four we work through today.* The numbers behind them are yours to quote, not on screen. |
| 5 | **G1 — ทำไม** | 2½ | Board opens by itself. Projector shows only a count. **Reveal** at 2:00, read one of each colour. Do not discuss. |
| 6 | **G1 — คุยกัน** | 2 | The loud two minutes. Do not fill the silence. |
| 7 | **G1 — ทำอย่างไร** | 3 | Two choices, then what and why. **Reveal**, read one of each. |
| 8–16 | G2, G3, G4 — same three | 19½ | Watch the session clock, not your instinct. |
| 17 | **ภาพรวม** | 3 | ส่งเสริม · ปรับปรุง · ยกเลิก. Say *ยกเลิกได้ด้วยนะ* before opening the board — that column stays empty unless invited, and it is usually the most useful. |
| 18 | Closing | 3 | The counts, and *ไม่มีทีมไหนเห็นภาพทั้งหมดเพียงลำพัง.* |

**The one button.** While a round is collecting it says **Reveal** (green) and
closes the round the instant the wall changes — nothing written afterwards can
have been shaped by what people saw. Everywhere else it says **Next**.
*Collect again* appears after a reveal if you opened too early.

**Two clocks.** The left one is this slide against its target; the right one is
the session against 45 minutes. **Pause** stops both screens at once (the
countdown on the wall freezes too), **Reset** puts the round back to 0:00.

**Without the mouse:** <kbd>←</kbd> <kbd>→</kbd> move · <kbd>R</kbd> reveal or
collect again · <kbd>B</kbd> open or close the board · <kbd>P</kbd> pause.

**Reading the wall.** Colour says what a note is — **gold** a gap people still
meet, **pink** somewhere it does not, **green** something already in place,
**grey** the practice round. A **folded corner** means the palliative team
wrote it. The key sits under the slide title. **Click any note to read it full
screen**; click again or press any key to close.

---

## If something goes wrong

| What you see | What to do |
|---|---|
| Phones say *รอบนี้ปิดแล้ว* when they should be writing | The board is closed. Press <kbd>B</kbd>, or **Collect again**. |
| The projector shows the title slide with a red flag | It lost the connection. It keeps retrying by itself and will jump back to the live slide. Do not refresh unless it stays there a minute. |
| Projector and control disagree | The projector is on an older copy. <kbd>⌘⇧R</kbd> on that window. |
| Gaps slide says it is waiting | Unlock the control panel; it writes them in. Or Room tab → **Reload the gaps**. |
| Someone says their note vanished | It didn't. If the signal dropped, the phone kept it and sends it when the signal returns. |
| The whole internet fails | `node server/server.js` on the laptop, put the printed address on the screen, and carry on. Nothing else changes. |
| You are behind at gap three | Cut the **ภาพรวม** round, not gap four. The four gaps are the data. |

---

## Afterwards

On the control panel, **After the day**:

- **Download .xlsx** — the dataset. Five sheets: why (who · does what · when ·
  why), what we would do (with the ภาพรวม stance), a crosstab of gap × team ×
  role, the gaps, and who was there. Every row carries team, role, setting and
  an anonymous phone id, so one person's answers can be followed without
  knowing who they are.
- **Download .json** — the whole room, for safekeeping. Do this before
  clearing anything.
- **Copy prompt + notes** — the instructions and every note in one paste, for
  a first-draft synthesis per gap. It is a draft to code from, not findings.

The practice round is in none of them.

**Promise kept in the room:** no names, no phone numbers, no accounts — only
team, role and where someone mainly works. Say it out loud at the start;
people decide how honest to be on that one line.
