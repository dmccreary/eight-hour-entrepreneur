---
title: "Cohort Safety Signal Sorter"
description: 'Given short statements describing things said or done during a cohort session, learners classify each one as "Safety-Building" or "Safety-Eroding," applying the chapter''s definition of psychological safety to concrete cohort moments.'
status: scaffold
library: p5.js
bloom_level: Apply (L3)
---

# Cohort Safety Signal Sorter



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 2: Founder Mindset & the Cohort Learning Experience](../../chapters/02-founder-mindset-cohort/index.md).

```text
Type: microsim
**sim-id:** cohort-safety-signal-sorter<br/>
**Library:** p5.js<br/>
**Status:** Specified
**Template:** https://github.com/dmccreary/health-education/tree/main/docs/sims/unsafe-situation-signal-explorer<br/>

Bloom Level: Apply (L3)
Bloom Verb: classify

Learning objective: Given short statements describing things said or done during a cohort session, learners classify each one as "Safety-Building" or "Safety-Eroding," applying the chapter's definition of psychological safety to concrete cohort moments.

Canvas layout:

- Left side (70%): a stack of 6 statement cards, one at a time, each with two buttons below it: "Safety-Building" and "Safety-Eroding"
- Right side (30%): a running tally showing "Correct: N / 6" and a small feedback area

Statement cards (in order):

1. "When Priya admitted her field test only got 1 yes out of 10, the facilitator asked: 'What did the other nine actually tell you?'" (Correct answer: Safety-Building — treats a weak result as useful data, not a verdict)
2. "A cohort member visibly rolls their eyes when someone shares an unfinished idea in a breakout room." (Correct answer: Safety-Eroding — signals judgment, discourages future disclosure)
3. "Before the first breakout room, the facilitator says: 'Half-formed ideas are exactly what belongs in this room — that's the assignment.'" (Correct answer: Safety-Building — explicitly sets the norm before anyone is exposed)
4. "A participant stays quiet for the rest of the session after a peer mocked their pricing idea earlier." (Correct answer: Safety-Eroding — visible consequence of an earlier unsafe moment)
5. "A peer responds to a rough pitch with a clarifying question instead of unsolicited advice." (Correct answer: Safety-Building — invites more detail without imposing judgment)
6. "A founder quietly rewrites their canvas overnight so it looks 'more finished,' afraid of what the group will think of the messy version." (Correct answer: Safety-Eroding — the fear of judgment is already shaping behavior, even without anyone saying anything)

Interactive controls:

- Click "Safety-Building" or "Safety-Eroding" under the current card
- Immediate feedback: correct answers flash green with a one-sentence explanation; incorrect answers flash amber with the correct classification and a one-sentence explanation
- "Next Card" button advances; after card 6, show final tally and a "Try Again" button that reshuffles card order

Default parameters: Card order as listed above on first load; shuffled on retry.

Behavior: No time pressure. Score persists only for the current session (no data saved). Progress bar across the top shows card 1 of 6 through 6 of 6.

Implementation notes: Use p5.js. Store the six statements as an array of objects `{text, correctAnswer, explanation}`. Must remain fully readable and clickable on narrow (mobile) viewports — stack the tally below the card stack rather than beside it below 600px width. Reference the linked template repository for the card-sorter interaction pattern, but replace all health-education content with the cohort statements listed above.
```

## Related Resources

- [Chapter 2: Founder Mindset & the Cohort Learning Experience](../../chapters/02-founder-mindset-cohort/index.md)
