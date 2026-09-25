---
title: "Leading vs Open-Ended Question Sorter"
description: "Given sample interview questions, learners classify each as open-ended or leading, applying the chapter's unbiased interview design principles."
status: scaffold
library: p5.js
bloom_level: Apply (L3)
---

# Leading vs Open-Ended Question Sorter



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 9: Discovery Interviews & the Reality Check](../../chapters/09-discovery-interviews-reality-check/index.md).

```text
Type: microsim
**sim-id:** leading-vs-open-ended-sorter<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Apply (L3)
Bloom Verb: classify

Learning objective: Given sample interview questions, learners classify each as open-ended or leading, applying the chapter's unbiased interview design principles.

Canvas layout:

- Left side (70%): a stack of 6 statement cards, one at a time, each with two buttons below it: "Open-Ended" and "Leading"
- Right side (30%): a running tally showing "Correct: N / 6" and a small feedback area

Statement cards (in order):

1. "Tell me about the last time getting your dog groomed was a hassle." (Correct answer: Open-Ended — invites a story in the customer's own words)
2. "Wouldn't you love it if grooming just came to your house?" (Correct answer: Leading — suggests the desired answer)
3. "Walk me through what you currently do when your dog needs a bath." (Correct answer: Open-Ended — asks for their actual process)
4. "Don't you think $40 is a fair price for a driveway grooming session?" (Correct answer: Leading — asks for agreement with a pre-set conclusion)
5. "What's the most frustrating part of your current routine, if anything?" (Correct answer: Open-Ended — genuinely open to a "nothing" answer)
6. "This would save you so much time, right?" (Correct answer: Leading — assumes the benefit before the customer has confirmed it)

Interactive controls:

- Click "Open-Ended" or "Leading" under the current card
- Immediate feedback: correct answers flash green with a one-sentence explanation; incorrect answers flash amber with the correct classification and explanation
- "Next Card" button advances; after card 6, show final tally and a "Try Again" button that reshuffles card order

Default parameters: Card order as listed above on first load; shuffled on retry.

Behavior: No time pressure. Score persists only for the current session (no data saved). Progress bar across the top shows card 1 of 6 through 6 of 6.

Implementation notes: Use p5.js. Store the six statements as an array of objects `{text, correctAnswer, explanation}`. Must remain fully readable and clickable on narrow (mobile) viewports — stack the tally below the card stack rather than beside it below 600px width.
```

## Related Resources

- [Chapter 9: Discovery Interviews & the Reality Check](../../chapters/09-discovery-interviews-reality-check/index.md)
