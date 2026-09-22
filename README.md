# The Missing Piece

A live workshop tool for 150 people. Participants voice concerns from their
phones, the room watches them appear on the projector, an AI groups them into
shared problems, and the room then brainstorms how to close each gap.

While people are writing, every note is a plain post-it on a wall. The
jigsaw only appears once the AI has grouped them: each shared problem becomes
a **piece with notches** — something missing — and the ideas for closing it
gather round it. Colour is discipline: nephrology against palliative care.

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

### The AI step

1. On the control panel, **Copy prompt + concerns**. The prompt already has
   every concern in the room appended to it, so there is nothing to attach.
2. Paste it into Claude or ChatGPT.
3. Paste what comes back into the import box and press **Check and import**.

(If you would rather send a file, **Download .txt** and **Prompt only** are
still there.)

You can paste the AI's reply exactly as it arrives — ```json fences and a
chatty sentence either side are stripped for you.

**Before anything is saved, every note the AI refers to is checked against what
was actually said in this room.** If it invents a `C-999` that nobody wrote,
the import is refused, nothing is written, and you are told which label was
wrong. Ask it to try again. This is the guard that keeps the problem statements
honest — every one stays traceable to the words that produced it.

### Spotlight

Once the problems are in, the brainstorm is an open board: anyone can add an
idea to any gap. If people spread too thin, or you want to work through the
problems one at a time, **Spotlight** pulls all 150 phones onto the same
problem. Turn it off to let people roam again.

---

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
