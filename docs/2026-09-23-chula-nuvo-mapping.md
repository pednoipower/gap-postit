# Chula Nuvo, as applied to The Missing Piece

The platform now runs on the Chula Nuvo tokens (Blossom Pink, Canopy Green,
Royal Gold, Mist, Ink), taken from that system's `tokens.json`. Nuvo is an
unofficial concept rebrand for Chulalongkorn work; it is not endorsed by the
university and uses no university emblem, and neither does this tool.

## What maps where

| Nuvo | Here |
|---|---|
| Mist `neutral-50` ground, white surfaces, Ink text | the phone and the control panel |
| Dark theme — canopy `green-900` ground, `#15352c` surfaces, Mist text | the projector |
| `heading` Canopy Green | every heading, on both sides |
| `primary` `pink-600` | the one thing to press: Send on the phone, the primary action in the console |
| `accent` Royal Gold | the survey numbers under each gap, and the practice round's notes |
| `radius-pill` | buttons, and only buttons |
| `radius-md` | cards, inputs, the gap cards on screen |
| `radius-leaf` (24px on two opposite corners) | the signature shape: step chips, stat tiles, console meters, the worked example, a participant's own notes |
| Bai Jamjuree 600 / Anuphan 400–700 | headings / everything else, Thai line-height 1.7 |
| `shadow-lift` | nothing yet. Borders separate; nothing here lifts |

## Two deliberate departures

**1. Pink is a team colour, not the single focus.** Nuvo says pink marks the
one thing that matters, at most 15% of a layout. This board's core signal is
which of two disciplines wrote a note, and that needs two colours of equal
weight. Nephrology carries Canopy Green, palliative care Blossom Pink. They
differ in lightness as well as hue, so the pair survives colour-blindness and
a weak projector bulb, and every note also carries a role mark. Royal Gold
stays the accent it is meant to be.

**2. The faces are served from `assets/fonts/`, not from Google.** Nuvo asks
for the Google Fonts link. Nothing in this workshop may depend on the venue's
wifi — the fallback server runs with no internet at all — and a projector that
drops to a system font mid-session re-wraps every line on screen. Anuphan
(400/600/700) and Bai Jamjuree (600/700) are stored here as woff2, Latin,
Latin-Extended and Thai subsets only: 312 KB in total, cached after the first
load. Every stack still ends in Sarabun, as Nuvo asks.

## Not taken

- The leaf corner is used on chips and panels, not on every card: at phone
  size, a 24px corner on a full-width card reads as a mistake rather than a
  signature.
- Font Awesome icons: the tool has no icon set and does not need one. The
  role marks on notes stay as drawn shapes.
- The Office/Sarabun guidance applies to decks, not to this web app.
