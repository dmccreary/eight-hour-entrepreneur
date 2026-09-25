---
title: "Two-Minute Pitch Structure and Timer"
description: "Learners study the four timed sections of Jordan's two-minute pitch (Problem, Solution, Evidence, Ask), then rehearse their own pitch against a 120-second countdown that highlights each section on time."
image: /sims/two-minute-pitch-structure-timer/two-minute-pitch-structure-timer.png
og:image: /sims/two-minute-pitch-structure-timer/two-minute-pitch-structure-timer.png
twitter:image: /sims/two-minute-pitch-structure-timer/two-minute-pitch-structure-timer.png
social:
   cards: false
status: built
---

# Two-Minute Pitch Structure and Timer

<iframe src="main.html" height="500px" width="100%" scrolling="no"></iframe>

[Run the Two-Minute Pitch Structure and Timer MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

The two-minute pitch in Session 4 asks a founder to fit a validated concept, a canvas,
and a 30-day launch plan into 120 seconds. That only works if each part of the pitch has
a fixed, small time budget. This MicroSim splits the pitch into four sections and puts
them on a time bar:

| Section | Budget | Clock | Word budget | Jordan's version |
|---|---|---|---|---|
| Problem | 30 seconds | 0:00-0:30 | about 75 words | Busy dog owners within 5 miles lose a half-day of income or personal time every grooming trip. |
| Solution | 30 seconds | 0:30-1:00 | about 75 words | Grooming that comes to their driveway. |
| Evidence | 40 seconds | 1:00-1:40 | about 100 words | 3 of 5 driveway sessions converted to paying customers; $40 price point validated in price testing. |
| Ask | 20 seconds | 1:40-2:00 | about 50 words | Looking for 2 more referrals this month, and feedback on expanding to weekend availability. |

Word budgets assume a relaxed speaking pace of 150 words per minute.

Each section has two parts in the detail panel. **What belongs here** is the general
job of the section, which you apply to your own pitch. **Jordan's pitch** is the worked
example, drawn from the validated problem (Chapter 5), the minimum viable offer
(Chapter 6), and the price testing (Chapter 14).

The countdown runs on the browser's clock, not the frame rate, so it stays accurate even
if the page is busy. When the clock reaches 0:30, 1:00 and 1:40, the next section block
glows briefly and turns orange, and the panel switches to it. The timer card shows the
time left in the whole pitch and in the current section. The countdown turns dark orange
in the last 10 seconds, and it stops at 2:00.

On screens narrower than 600 pixels the four blocks form a 2x2 grid, a thin time bar sits
below them, and the timer shrinks to a single strip above the panel.

## How to Use

1. Press **Next** (or the right arrow key) to step through the four sections without
   starting the clock. Read the prompt and Jordan's version for each one.
2. Click any section block to jump straight to it. **Previous** steps back.
3. Press **Start Pitch Timer** and say Jordan's pitch, or your own, out loud. Watch for
   each block to turn orange as its section begins.
4. Press **Pause** to stop the clock and **Resume** to continue from the same time.
5. While the clock runs or is paused, clicking another block previews it. The live
   section keeps an amber outline, and the panel returns to it at the next boundary or
   when you press **Resume**.
6. Press **Reset** to return to 0:00 with no section selected.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/eight-hour-entrepreneur/sims/two-minute-pitch-structure-timer/main.html"
        height="500px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Adult early-stage entrepreneurs and aspiring founders in a live virtual cohort.

### Learning Objective

Participants will apply a four-part structure (Problem, Solution, Evidence, Ask) to
organize and time a two-minute founder pitch, using Jordan's example to decide what
content belongs in each section.

**Bloom Level:** Apply (L3). **Bloom Verb:** apply.

### Duration

20 minutes

### Prerequisites

- Chapter 16: Building the 30-Day Launch Plan
- Chapter 17 reading through "The Mini Pitch: Your Two Minutes"
- A written problem statement, minimum viable offer, and at least one lean test result
  for the participant's own idea

### Activities

1. **Study the structure (4 min):** The facilitator shares the screen and steps through
   the four sections with **Next**. For each one, participants type in the chat which
   words in Jordan's version do the job named in "What belongs here."
2. **Draft four lines (5 min):** Each participant writes one line per section for their
   own venture, staying inside the word budgets. Evidence must cite something customers
   did, with a number.
3. **Timed rehearsal (8 min):** In breakout pairs, one partner runs the timer on their
   screen while the other delivers the pitch out loud. The timekeeper notes where the
   speaker was each time a block turned orange: on time, ahead, or behind. Partners then
   switch roles.
4. **Peer feedback (3 min):** Each timekeeper gives one concrete suggestion on the
   speaker's Evidence or Ask, following the peer feedback norms from Chapter 17.

### Assessment

- Can the participant name the four sections in order with their budgets and the clock
  times where each one starts (0:00, 0:30, 1:00, 1:40)?
- Given a sentence such as "We need two more referrals this month," can the participant
  place it in the correct section and explain why?
- Did the participant's timed rehearsal reach the Ask by about 1:40 and finish before
  2:00?
- Does the participant's Evidence section report observed customer behavior with numbers
  rather than opinions or predictions?

## References

1. [Elevator pitch](https://en.wikipedia.org/wiki/Elevator_pitch) - Wikipedia - The
   short, time-boxed summary of an idea or venture that the two-minute pitch is a
   structured version of.
2. [Public speaking](https://en.wikipedia.org/wiki/Public_speaking) - Wikipedia -
   Preparation and delivery practices for speaking to a group, including rehearsal and
   timing.
3. [Words per minute](https://en.wikipedia.org/wiki/Words_per_minute) - Wikipedia -
   Typical speaking rates, the basis for converting each section's seconds into a word
   budget.
4. [PechaKucha](https://en.wikipedia.org/wiki/PechaKucha) - Wikipedia - A presentation
   format with a fixed time per slide, another example of strict time budgets forcing a
   speaker to simplify.
5. *Made to Stick* by Chip Heath and Dan Heath (2007) - Why simple, concrete messages
   are remembered, the same discipline a two-minute pitch applies out loud.
