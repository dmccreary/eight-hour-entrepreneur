---
title: "Persevere vs Pivot Signal Checker"
description: "Learners set three validation evidence signals to see whether the pattern supports a persevere, pivot, or kill decision, then judge the evidence from four practice ventures and get feedback on each signal."
image: /sims/persevere-vs-pivot-signal-checker/persevere-vs-pivot-signal-checker.png
og:image: /sims/persevere-vs-pivot-signal-checker/persevere-vs-pivot-signal-checker.png
twitter:image: /sims/persevere-vs-pivot-signal-checker/persevere-vs-pivot-signal-checker.png
social:
   cards: false
status: built
---

# Persevere vs Pivot Signal Checker

<iframe src="main.html" height="602px" width="100%" scrolling="no"></iframe>

[Run the Persevere vs Pivot Signal Checker MicroSim Fullscreen](./main.html){ .md-button .md-button--primary }
<br/>
[Edit in the p5.js Editor](https://editor.p5js.org/)

## About This MicroSim

After a lean test, the founder has to decide what the result means. This MicroSim breaks
that call into three evidence signals, one for each of the first three canvas elements:

- **Problem Validated?** Target customers raise the pain without being prompted and rank
  it a priority.
- **Solution Got Payment Signals?** Money changed hands, even a small deposit. Likes and
  "sounds great!" don't count.
- **Customer Definition Confirmed?** The people who felt the pain or paid match the target
  customer you defined.

Check a signal only when its evidence clears the bar. The verdict panel updates the moment
a signal changes. The panel's color shows the kind of verdict: green for persevere, fox
orange for a pivot, gray for a kill. The panel also gives a one-sentence justification.
A row of chips shows what happens to each element: **Keep** the elements that have
evidence, **Change** the element the pivot names, and **Retest** anything else.

| Problem | Solution | Customer | Verdict |
|---|---|---|---|
| on | on | on | Persevere |
| on | off | on | Pivot the Solution (Priya's scenario) |
| on | on | off | Pivot the Customer (revisit Chapter 4) |
| on | off | off | Pivot the Customer (revisit Chapter 4) |
| off | any | any | Pivot the Problem (revisit Chapter 5) |
| off | off | off | Kill Decision (see Chapter 10) |

All three signals off is a kill, not a problem pivot: nothing has evidence behind it, so
there is nothing to keep. The chapter's rules don't name the problem-only pattern. Here it
counts as a customer pivot, because the founder has to confirm who feels the pain before
testing a new offer on anyone.

**Load Priya's Evidence** is a worked example. It sets Priya's signals and notes, line by
line, whether each piece of her evidence clears its bar. Her problem and customer are
validated, but only 1 of 10 families said yes to her advance-planning subscription. That
pattern points to Pivot the Solution.

**Try a Scenario** gives you four practice ventures to judge on your own. Each card lists
one line of evidence per signal. Some lines are traps: a post with 15 likes and no
deposits, or a pain that only came up after a leading question. After you click **Check My
Reading**, each signal turns green (read honestly) or amber (misread) with the reason. The
panel then shows the verdict the evidence actually supports.

## How to Use

1. Start in Explore mode: check and uncheck the three signals and watch the verdict change.
2. Click **Load Priya's Evidence** to walk through a worked example. Try unchecking a
   signal to see how the verdict would change, then click **Check My Reading** to compare
   with her honest reading.
3. Click **Try a Scenario**. Read each line of evidence against the bar printed above it.
4. Check only the signals whose evidence clears the bar. The panel shows the verdict your
   reading points to.
5. Click **Check My Reading** for feedback on each signal and the verdict the evidence
   supports. Then click **Next Scenario**.
6. After the fourth scenario, the card shows how many you read honestly on the first try.
   Click **Try Again** for the same four ventures in a new order.
7. Click **Reset** at any time to return to Explore mode with every signal off.

On wide screens the evidence card and the verdict panel sit side by side. On a phone the
panel moves below the card, and after a check the card may shorten each evidence line to
its feedback note so everything fits.

## Iframe Embed Code

You can add this MicroSim to any web page by adding this to your HTML:

```html
<iframe src="https://dmccreary.github.io/eight-hour-entrepreneur/sims/persevere-vs-pivot-signal-checker/main.html"
        height="602px"
        width="100%"
        scrolling="no"></iframe>
```

## Lesson Plan

### Audience

Adult early-stage entrepreneurs and aspiring founders in a live virtual cohort.

### Learning Objective

Given a set of validation evidence signals for a venture scenario, participants will
evaluate the pattern and justify whether it supports a persevere decision, a pivot
decision, or a kill decision (from Chapter 10).

**Bloom Level:** Evaluate (L5). **Bloom Verb:** justify.

### Duration

15 minutes

### Prerequisites

- Chapter 10 reading on the kill decision
- Chapter 11 reading on evidence of demand, customer payment signals, and the persevere
  and pivot decisions
- Chapters 4 and 5 on the target customer and the real problem

### Activities

1. **Worked example (3 min):** The facilitator loads Priya's evidence and reads each note
   aloud. Then check Solution Got Payment Signals and ask the group what evidence Priya
   would have needed for the verdict to become Persevere.
2. **Solo practice (5 min):** Each participant works through the four practice scenarios.
   Before each check, they write one sentence justifying their verdict.
3. **Debrief the traps (4 min):** In breakout rooms, discuss Ana's 15 likes and Ben's
   leading question. What would each founder have needed to see for that signal to count?
4. **Apply it to your venture (3 min):** Each participant sets the three signals for their
   own latest test and posts the verdict, with one sentence of justification, in the
   cohort channel.

### Assessment

- Did the participant read at least 3 of 4 practice scenarios honestly on the first try?
- Does the participant's written justification name the evidence behind each signal, not
  just the verdict?
- Can the participant explain why interest without money leaves the payment signal off?
- Can the participant name which element a pivot keeps and which one it changes, for
  their own venture?

## References

1. [Lean startup](https://en.wikipedia.org/wiki/Lean_startup) - Wikipedia - The
   build-measure-learn loop and the persevere-or-pivot decision that closes each cycle.
2. [Customer development](https://en.wikipedia.org/wiki/Customer_development) - Wikipedia -
   Steve Blank's method for testing customer and problem hypotheses before building.
3. [Eric Ries](https://en.wikipedia.org/wiki/Eric_Ries) - Wikipedia - Author of
   *The Lean Startup*, which popularized the pivot as a structured change of one element
   of a business.
4. [Confirmation bias](https://en.wikipedia.org/wiki/Confirmation_bias) - Wikipedia - Why
   founders tend to read test results the way they hoped, not the way they turned out.
5. [Sunk cost](https://en.wikipedia.org/wiki/Sunk_cost) - Wikipedia - Why effort already
   spent is not a reason to persevere when the evidence points to a kill.
