# Verification

These are the tests used while building this. You do not need them to run the
workshop, but they are kept so the claims made about this app can be checked
rather than taken on trust.

| File | What it proves |
|---|---|
| `security_test.sql` | A participant can join and post while the board is open, and can do nothing else — not edit, not delete, not drive your slides, not read internal tables. Run it against the schema in Postgres. |
| `qr_test.js` | Generates QR codes across every size and error-correction level. Render them and decode with any scanner; they must all come back byte-identical. |
| `../tools/contrast-check.py` | Every colour pair the app puts on a screen, with its WCAG ratio and the threshold it has to meet. Run it after changing a colour; it prints a table and a failure count. |
| `preview_paper.html` | Open in a browser to see what the projector draws, on its own: a gap card and the post-its, with colour for discipline and a corner mark for role. |

## What was verified before shipping

- Schema run against a real PostgreSQL 16, then against a real PostgREST with
  a real anonymous JWT — the same shape as Supabase — with row-level security
  enforced.
- 150 simultaneous submissions produce 150 unique labels, no gaps, no
  duplicates.
- 450 submissions from 150 concurrent participants against the fallback server:
  0.27s, worst response 73ms.
- Every generated QR code decoded correctly by an independent scanner, and
  survives blur, low contrast, camera noise, small size and 12° rotation.
- The .xlsx opens in LibreOffice with no repair prompt, colour-coding intact.
- A note written with the phone offline is kept and delivered when the
  connection returns; a retried send produces one post-it, not two.
- The projector was checked at 16:9, 4:3, 16:10, 4K and small-meeting-room
  sizes: nothing drawn off-screen, no broken words.
- An AI grouping citing a fabricated note label is refused, with nothing
  written, on both backends.
