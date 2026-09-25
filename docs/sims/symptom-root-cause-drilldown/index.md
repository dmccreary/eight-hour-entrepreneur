---
title: "Symptom vs Root Cause Drill-Down"
description: "Learners apply the repeated why technique to Priya's first interview complaint, choosing the answer that explains each layer until they reach the root cause, with feedback on every dead end."
image: /sims/symptom-root-cause-drilldown/symptom-root-cause-drilldown.png
og:image: /sims/symptom-root-cause-drilldown/symptom-root-cause-drilldown.png
twitter:image: /sims/symptom-root-cause-drilldown/symptom-root-cause-drilldown.png
social:
   cards: false
status: built
---

# Symptom vs Root Cause Drill-Down

<iframe src="main.html" height="500px" width="100%" scrolling="no"></iframe>

[Run the Symptom vs Root Cause Drill-Down MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

The first complaint a customer voices is usually a symptom. Priya's interviewees almost
always opened with "I don't have time to cook." A meal-prep service built for that
sentence would try to save time. The root cause is several layers down, and it points to
a different product.

This MicroSim runs the repeated "why" technique (often called the Five Whys) on that
complaint. At each layer Priya asks why, and you choose between two candidate answers:

- **The answer that explains the layer** moves one layer deeper and is added to the why
  trail on the left.
- **A dead end** loops back to the same layer. It turns amber, adds a dead-end badge to
  that layer in the trail, and explains why it failed.

The three dead ends are three different mistakes:

1. **Restating the symptom.** "There aren't enough hours in the day" repeats the complaint
   in different words.
2. **Inventing a cause.** "I don't like cooking" may sound plausible, but it is not what
   Priya heard in her interviews.
3. **Jumping to a solution.** "Busy parents just need a better app" names a fix before the
   cause is clear.

Three whys down, the answer stops changing. The root cause, "Rotating shifts make any
pre-planned dinner routine unreliable," is stamped **Root Cause Found** beneath the
original symptom card, so the two can be compared directly. The problem was never time
scarcity. It was schedule unpredictability.

On a phone-width screen the trail becomes a compact staircase of rows above the card
instead of a column beside it.

## How to Use

1. Read the complaint on the card and the question Priya asks beneath it.
2. Click the answer below the drawing area that explains the complaint instead of
   repeating it.
3. If you hit a dead end, read the amber feedback, then choose again.
4. Keep asking why until the card reads **Root Cause Found**.
5. Click any earlier layer in the trail to jump back to it. The layers below it are
   cleared and you drill down again from there.
6. Click **Restart** to return to the original symptom and reset the dead-end count.

The status line next to **Restart** shows which why you are on and how many dead ends you
have hit since the last restart.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/eight-hour-entrepreneur/sims/symptom-root-cause-drilldown/main.html"
        height="500px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Adult early-stage entrepreneurs and aspiring founders in a live virtual cohort.

### Learning Objective

Given a customer's first-stated complaint, learners apply a repeated "why" technique,
choosing at each step which underlying cause to pursue, to trace the symptom down to its
root cause.

**Bloom Level:** Apply (L3). **Bloom Verb:** apply.

### Duration

10 minutes

### Prerequisites

- Chapter 4 reading on Priya's target customer: dual-income parents on rotating or
  unpredictable shift schedules
- Chapter 5 reading through "Finding the Root Cause"

### Activities

1. **Solo drill-down (3 min):** Each participant drills from "I don't have time to cook"
   to the root cause and notes their dead-end count.
2. **Name the dead ends (3 min):** As a group, match each dead end to its mistake:
   restating the symptom, a cause the interviews didn't support, or jumping to a solution.
   Discuss why "There aren't enough hours in the day" is a dead end even though it is true.
3. **Drill Jordan's complaint (4 min):** In breakout pairs, start from "Grooming is a
   hassle" and write three layers of why, ending at the in-person drop-off and pickup that
   costs Jordan's customers a half-day. Partners swap chains and mark any layer that only
   restates the one above it.

### Assessment

- Can the participant explain why a restated symptom is a dead end, using "There aren't
  enough hours in the day" as the example?
- Given a new first complaint, can the participant write a three-layer why chain in which
  each layer explains the layer above it?
- Can the participant explain why a meal kit that requires advance planning would solve
  the symptom but miss Priya's root cause?

## References

1. [Five whys](https://en.wikipedia.org/wiki/Five_whys) - Wikipedia - The iterative
   questioning technique this MicroSim practices, including its known limits, such as
   stopping at symptoms or inventing causes.
2. [Root cause analysis](https://en.wikipedia.org/wiki/Root_cause_analysis) - Wikipedia -
   The broader family of methods for finding the underlying condition behind a visible
   problem.
3. [Toyota Production System](https://en.wikipedia.org/wiki/Toyota_Production_System) -
   Wikipedia - The manufacturing system where Taiichi Ohno popularized asking why five
   times.
4. [Customer development](https://en.wikipedia.org/wiki/Customer_development) - Wikipedia -
   Steve Blank's method of testing problem hypotheses through customer interviews before
   building a solution.
5. *The Mom Test* by Rob Fitzpatrick (2013) - A short guide to customer interviews that
   draw out real past behavior instead of polite opinions, the kind of evidence each layer
   of a why chain should rest on.
