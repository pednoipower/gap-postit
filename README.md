# The Missing Piece · ชิ้นส่วนที่หายไป

A 45-minute live workshop tool for 150 people, built for one session: a
nephrology team and a palliative care team in the same room. A pre-survey of
16 hospitals says *what* is missing — four gaps, each with a number. The
room supplies *why* it happens and *how* to fix it. Participants use their
phones (in Thai); the room watches the projector; you drive it from a laptop.

For each gap: **why is this happening here?** (blind, then revealed in both
team colours), then **how would we fix it?** — something that already exists
here, or something new, each with *why it would work*. Every note is tagged
by team, role and setting, ready for barrier–facilitator or realist-style
analysis.

Everything on screen is paper: the gaps are cards, the notes are post-its,
with the causes and the solutions gathering round each gap. Nothing
interlocks. Colour is discipline — Canopy Green for nephrology, Blossom Pink
for palliative care — and a small mark in the corner is role.

The visual design follows **Chula Nuvo**, an unofficial concept brand for
Chulalongkorn work; the mapping and the two places this tool departs from it
are in `docs/2026-09-23-chula-nuvo-mapping.md`. The typefaces are served from
`assets/fonts/`, because nothing here may depend on the venue's wifi.

See `docs/2026-09-22-run-of-show-45min.md` for the minute-by-minute script.

---

## The five files you will use

| File | Who opens it |
|---|---|
| `index.html` | participants, by scanning the QR |
| `board.html` | participants, automatically after joining |
| `present.html` | the projector |
| `control.html` | you, on a laptop or phone |
| `health.html` | you, the day before |

Plus one file you edit: **`assets/config.js`**. Everything else can be left alone.

---

## Setting it up

### 1. Make the database

1. Create a Supabase project. **Free plans allow two active projects per
   organisation** — if you are already at two, either pause one, or create a
   second free organisation, which gets its own two slots.
2. In your project: **SQL Editor → New query**, paste the whole of
   `supabase/schema.sql`, press **Run**.
3. Scroll to the bottom of that file before running it and change the last line:
   pick your room code and a **control password**. The password is what unlocks
   `control.html`. Do not put it in `config.js`; you type it on the day.

### 2. Fill in `assets/config.js`

You need four things:

- `supabaseUrl` — Project Settings → Data API → Project URL
- `supabaseAnonKey` — Project Settings → API Keys → `anon` / public key
- `joinUrl` — where you will host these files. Keep it short; people read it
  off a screen from the back of a room.
- `roomCode` — must match what you put in `schema.sql`

The anon key is *designed* to be public. The rules in `schema.sql` are what
actually protect your data. In plain terms, someone holding that key can join
and add notes while you have the board open, and can do nothing else — not
edit, not delete, not change your slides.

Then set your questions, roles, disciplines and colours. It is all plain
English with comments.

### 3. Put the files online

Any static host works — Netlify, Vercel, GitHub Pages, Cloudflare Pages. Drag
the folder in. There is no build step, no npm install, nothing to compile.

Set `joinUrl` to the address you end up with, and redeploy.

**Before every deploy, run `node tools/stamp.js`.** It stamps a build id onto
every script and stylesheet URL so that phones and laptops which had the site
open before the deploy fetch fresh copies instead of running old code against
the new pages. The build id shows at the bottom of the phone page and next to
"connected to Supabase" on the control panel — if two devices show different
builds, one of them needs a refresh.

---

## Running the workshop

### The day before

Open `health.html` and press **Run the checks**. It wakes a sleeping Supabase
project and tells you whether a participant can actually submit. Then open
`control.html` and **Clear this room** so you start clean.

> **Free Supabase projects go to sleep after about a week of no activity.**
> A sleeping project will not serve your workshop. Waking one takes a few
> minutes, so do it the day before, not five minutes before.

### On the day

1. Open `present.html` on the projector. Press **f** for full screen.
2. Open `control.html` on your own laptop or phone and enter your control
   password.
3. Work down the slide list. Picking a slide moves the projector, sets the
   question on everyone's phone, and opens or closes the board automatically.

Arrow keys also work on the projector if you would rather use a clicker.
They move the whole room — control panel, phones and board — not just the
projector, so the first press asks for the control password (or reuses the one
the control panel remembered, if both are open in the same browser).

### After the day

**Download .xlsx** for the dataset. The prompt on the control panel asks an
AI for a first-draft synthesis per gap, citing note labels — a draft to code
from, not findings.

## If the internet fails

There is a complete fallback that needs no internet at all.

1. Open Terminal.
2. Type `cd ` (with a space), drag this folder onto the window, press Enter.
3. Type `node server/server.js`

It prints a web address. Put that on the projector instead. Everyone joins over
the venue wifi. It needs nothing but Node — no installs.

With `backend: "auto"` in the config (the default), the pages try Supabase
first and fall back to the laptop server by themselves.

Everything is saved continuously to `server/workshop-data.json`, so a closed
lid or an accidental Ctrl-C loses nothing.

---

## What you get out

| Download | For |
|---|---|
| `.txt` | feeding to the AI — labels and words, nothing else |
| `.xlsx` | you and your colleagues. Four sheets, colour-coded by problem group and by discipline |
| `.json` | a complete backup, and the format for re-importing |
| Solutions `.txt` | every idea, grouped under the problem it answers |

Files are named `YYYY-MM-DD-...` so they sort properly.

---

## Things worth knowing

**No names anywhere.** Only role and discipline are ever recorded. Somebody can
write "I don't know who to call after 5pm" without it being traceable to them.

**Phones only send.** They do not hold a live connection. This is deliberate:
Supabase's free plan allows 200 live connections and 150 people would sit right
on that ceiling, and a dropped connection on hospital wifi is far more fragile
than a retried send. Participants watch the projector, which is how these
sessions work anyway.

**Notes written offline are not lost.** If someone taps Send with no signal,
their note is kept on their phone and sent by itself when the connection
returns — even if they pocketed the phone in between. If a send is retried you
still get one post-it, not two.

**The word cloud and Thai.** Thai, Lao, Khmer, Chinese and Japanese do not put
spaces between words, so they cannot be split into words reliably. Those
answers are kept whole and appear in full on the post-it wall and in every
export, but are left out of the word cloud rather than shown as fragments.

**Nothing loads from the internet at runtime.** No fonts, no libraries, no CDN.
The QR code generator and the Excel writer are both written out in full here.
The whole thing runs from a USB stick if it has to.
