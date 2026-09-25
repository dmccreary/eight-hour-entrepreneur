---
title: "One-Sentence Value Proposition Builder"
description: "Learners compose a one-sentence value proposition by selecting from component options for target customer, core benefit, founder advantage, and main alternative, and observe the assembled sentence update live."
status: scaffold
library: p5.js
bloom_level: Create (L6)
---

# One-Sentence Value Proposition Builder



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 12: "Messaging & the Value Proposition Statement"](../../chapters/12-messaging-value-proposition/index.md).

```text
Type: microsim
**sim-id:** one-sentence-value-proposition-builder<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Create (L6)
Bloom Verb: compose

Learning objective: Learners compose a one-sentence value proposition by selecting from component options for target customer, core benefit, founder advantage, and main alternative, and observe the assembled sentence update live.

Canvas layout:

- Four dropdown selectors, top to bottom, each labeled with its sentence role: "Target Customer," "Core Benefit," "Founder Advantage," "Main Alternative"
- A large live-updating sentence preview below the dropdowns, using the template: "[Target Customer] gets [Core Benefit], from [Founder Advantage], unlike [Main Alternative]."

Dropdown options (3 each, drawn from Jordan's and Priya's canvases plus one blank "Write your own" option that reveals a text input):

- Target Customer: "busy dog owners without easy groomer access" / "dual-income parents on rotating shifts" / "Write your own"
- Core Benefit: "grooming without losing an afternoon" / "a real dinner without any advance planning" / "Write your own"
- Founder Advantage: "someone they already trust in the neighborhood" / "someone who understands unpredictable schedules firsthand" / "Write your own"
- Main Alternative: "the booked-solid groomer across town" / "another night of takeout" / "Write your own"

Interactive controls:

- Selecting any dropdown option instantly updates the live sentence preview
- Selecting "Write your own" in any dropdown reveals a text input for that component, which also updates the preview live as the learner types
- "Load Jordan's Version" and "Load Priya's Version" buttons set all four dropdowns to that founder's actual value proposition at once

Default parameters: All four dropdowns unset on load; preview shows placeholder text "[Target Customer] gets [Core Benefit], from [Founder Advantage], unlike [Main Alternative]."

Implementation notes: Use p5.js with HTML `select` and `input` DOM elements positioned over the canvas, or p5.dom. Must remain fully usable on narrow (mobile) viewports — stack dropdowns vertically with the preview sentence below, using text wrapping rather than a fixed-width single line.
```

## Related Resources

- [Chapter 12: "Messaging & the Value Proposition Statement"](../../chapters/12-messaging-value-proposition/index.md)
