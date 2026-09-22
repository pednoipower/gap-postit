# The AI grouping prompt

This is the same text the control panel gives you with **Copy the prompt**. It
is reproduced here so you can adjust it before the day if you want to.

---

You are helping run a clinical workshop called "The Missing Piece", bringing
together a nephrology team and a palliative care team.

Below is a list of concerns written anonymously by workshop participants.
Each line looks like:

```
C-001 | discipline | role | what they wrote
```

## Your task

Group these concerns into a small number of shared underlying problems, and
write a problem statement for each.

**Rules — these matter more than elegance:**

1. Use ONLY the labels (C-001 etc.) exactly as they appear. Never invent,
   renumber or alter a label. Every label you output must appear in the input.
2. Every concern must appear in exactly one group. Do not silently drop any.
   If something genuinely fits nowhere, put it in a group called "Other".
3. Aim for 4–8 groups. Fewer than 4 hides real differences; more than 8 is
   unusable in a room.
4. A problem statement is ONE sentence, in the participants' own vocabulary,
   naming what is missing between the two teams. Not a solution. Not a slogan.
5. Where a group contains concerns from BOTH disciplines, say so in the
   rationale — those are the most valuable groups in this workshop.
6. Do not soften or sanitise. If people wrote that something is broken, the
   problem statement should say it is broken.

## Output

Return ONLY a JSON array, no commentary before or after:

```json
[
  {
    "id": "G1",
    "label": "Short name, 2-4 words",
    "problem_statement": "One sentence naming what is missing.",
    "rationale": "Why these belong together, and whether both disciplines raised it.",
    "source_ids": ["C-001", "C-014", "C-022"]
  }
]
```

---

## Why rule 1 is enforced by the app, not trusted to the AI

Before anything is written to your workshop, every label the AI has used is
checked against the notes that actually exist in your room. If it refers to one
that was never written, the entire import is refused and nothing is saved.

This is deliberate. The whole credibility of the session rests on being able to
say "every one of these problem statements came from what you wrote" — and then
being able to prove it by clicking through to the original words. An AI that
quietly merges or invents a concern would break that, and you would have no way
of knowing.

## If the import is refused

The message names the labels it did not recognise. Go back to the AI and say:

> Some of those labels don't exist in the file. Redo the grouping using only
> the C-numbers that appear in the attached text, and make sure every concern
> in the file appears in exactly one group.

## Adjusting the grouping

You do not have to accept the first answer. Things worth asking for:

- *"Give me 6 groups instead of 4 — the second one is doing too much work."*
- *"Rewrite G3's problem statement in the participants' own words; it reads like
  management language."*
- *"Which groups had concerns from both disciplines? Put those first."*

Re-import as many times as you like. Each import replaces the previous grouping
completely, and the original concerns are never altered.
