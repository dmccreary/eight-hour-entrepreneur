---
title: Interpreting Validation Evidence
description: How to read lean-test results and decide whether to kill, pivot, or persevere with a concept, based on real evidence of demand and customer payment signals.
generated_by: claude skill chapter-content-generator
date: 2026-09-25 06:47:45
version: 1.10
---

# Interpreting Validation Evidence

## Summary

Covers how to read lean-test results and decide whether to kill, pivot, or persevere with a concept, based on real evidence of demand and customer payment signals.

## Concepts Covered

This chapter covers the following 13 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| Pivot Decision | 5 |
| Persevere Decision | 4 |
| Concept Validation | 4 |
| Evidence Of Demand | 4 |
| Customer Payment Signal | 3 |
| Build-Measure-Learn | 3 |
| Smallest Testable Version | 3 |
| Validated Concept | 2 |
| Invalid Concept | 2 |
| Low-Capital Testing | 2 |
| Rapid Experimentation | 1 |
| Test Hypothesis | 1 |
| Validation Milestone | 1 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 10: Lean Testing Fundamentals](../10-lean-testing-fundamentals/index.md)

---

## Reading the Result Honestly

Chapter 10 taught you how to design and run a lean test. This short chapter teaches you how to read what it actually told you — a skill that turns out to be harder than running the test itself, because it's tempting to read a result the way you hoped it would turn out rather than the way it actually did.

!!! mascot-welcome "Reading Evidence Without Fooling Yourself"
    ![Scout waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    A test result doesn't interpret itself — you do. This chapter gives you a clear-headed way to read your own evidence, so hope doesn't quietly rewrite what the data actually said. Let's find out for real!

## The Build-Measure-Learn Loop

The habit this whole course has been building has a name in the wider lean startup world: **build-measure-learn**. It's the repeating cycle of building the smallest possible test, measuring what real customers actually do in response, and learning something that shapes the next build — the same loop underneath every Field Discovery Window since Chapter 2. Running that loop well depends on two related habits. **Rapid experimentation** means running that cycle quickly, in days rather than months, so a wrong direction gets corrected cheaply. **Low-capital testing** means running it with as little money as possible — Jordan's $40 driveway sessions cost almost nothing to run, which is exactly what let three of them happen inside a single Field Discovery Window.

Every trip through the loop starts from a **test hypothesis**: the specific, falsifiable prediction a lean test is designed to check — "at least 2 of 5 neighbors will pay a $40 deposit for a driveway session" is a test hypothesis; "people will probably like this" is not, because it can't be proven wrong.

## What Counts as Real Evidence

Not all evidence carries equal weight. **Evidence of demand** is any signal that real customers actually want a solution — interest, engagement, or requests for more information. A **customer payment signal** is a stronger, more specific form of that evidence: an actual transfer of money, even a small deposit, which is far harder to fake or misread than a verbal "I'd probably buy that." Chapter 10's pre-sale offers and manual service deliveries exist specifically to generate payment signals rather than settling for interest alone.

!!! mascot-thinking "Interest Is Cheap. Money Is Expensive."
    ![Scout thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Notice why this distinction matters so much: a stranger can say "sounds great!" without spending anything, so it costs them nothing to be polite. The moment real money changes hands, the signal gets dramatically more honest — nobody hands over a deposit just to be nice.

## From Hypothesis to Verdict

A test's smallest fair unit of measurement is its **smallest testable version**: the minimum evidence needed to judge a single hypothesis, sized so the result is neither too small to mean anything nor so large it stops being a lean test. Judging that evidence against the hypothesis is **concept validation**: the overall process of determining whether a business concept is supported by real-world evidence, culminating in a specific status. A **validated concept** is one where accumulated evidence — especially customer payment signals — consistently supports the original hypothesis. An **invalid concept** is one where the evidence consistently contradicts it, regardless of how appealing the idea still feels to its founder.

Reaching either status is a **validation milestone**: a specific, predefined point at which enough evidence has accumulated to make a confident call, rather than continuing to test indefinitely out of hesitation.

## Persevere or Pivot?

Chapter 10 already covered the kill decision — abandoning an idea entirely. Two more outcomes remain. A **persevere decision** is the choice to continue with the current concept largely as designed, because validation evidence consistently supports it. A **pivot decision** is the choice to change a specific, significant element of the concept — the customer, the problem framing, the solution, or the pricing — while keeping the parts evidence has actually supported, rather than restarting from nothing.

Priya's own evidence illustrates the difference: her core problem (unpredictable-schedule dinner stress) was strongly validated, but her original solution (a weekly subscription requiring advance planning) collected weak payment signals. That combination pointed to a pivot — keep the validated problem, change the solution to something that didn't require planning ahead — rather than a persevere or a full kill.

#### Diagram: Persevere vs Pivot Signal Checker

<iframe src="../../sims/persevere-vs-pivot-signal-checker/main.html" width="100%" height="602px" scrolling="no"></iframe>

<details markdown="1">
<summary>Persevere vs Pivot Signal Checker</summary>
Type: microsim
**sim-id:** persevere-vs-pivot-signal-checker<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Evaluate (L5)
Bloom Verb: justify

Learning objective: Given a set of validation evidence signals for a venture scenario, learners evaluate the pattern and justify whether it supports a persevere decision, a pivot decision, or a kill decision (from Chapter 10).

Canvas layout:

- Three toggle switches, each labeled with a signal: "Problem Validated?", "Solution Got Payment Signals?", "Customer Definition Confirmed?"
- A result panel below that updates live as toggles change

Behavior (decision logic driving the result panel):

  All three toggles ON: "Persevere — evidence supports the concept largely as designed."
  Problem ON, Solution OFF, Customer ON: "Pivot the Solution — keep the validated problem and customer, redesign the offer." (Priya's actual scenario)
  Problem OFF, others any state: "Pivot the Problem — the customer may be real, but this isn't their priority pain. Revisit Chapter 5."
  All three toggles OFF: "Kill Decision — see Chapter 10. No part of the current concept has evidence behind it yet."
  Problem ON, Solution ON, Customer OFF: "Pivot the Customer — the offer works for somebody, but maybe not this target customer. Revisit Chapter 4."

Interactive controls:

- Click each toggle to switch it on/off independently
- Result panel text and color update immediately (green for persevere, fox-orange for pivot, gray for kill)
- "Load Priya's Evidence" button sets toggles to her actual scenario as a worked example

Default parameters: All toggles off on load, prompting "Set your evidence signals above."

Implementation notes: Use p5.js. Store the decision logic as a lookup based on the 3 boolean toggle states. Must remain fully readable and usable on narrow (mobile) viewports — stack toggles vertically above the result panel.
</details>

## Key Takeaways

Before Chapter 12 turns a validated concept into a message, hold onto how to read your own evidence:

- **Build-measure-learn**, powered by **rapid experimentation** and **low-capital testing**, is the loop this whole course runs on — always starting from a clear **test hypothesis**.
- **Evidence of demand** is real; a **customer payment signal** is stronger and harder to fake.
- A **smallest testable version** of evidence drives **concept validation** toward a **validated concept** or an **invalid concept**, marked by a **validation milestone**.
- A **persevere decision** or a **pivot decision** — changing one specific element while keeping what's validated — are the two outcomes besides the kill decision from Chapter 10.

!!! mascot-celebration "You Just Learned to Trust the Evidence Over the Hope"
    ![Scout celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You now know how to read a test result honestly — even when the honest reading isn't the one you were hoping for. That discipline is what makes every canvas block from here forward trustworthy. Let's find out for real, starting with your message in Chapter 12.

[See Annotated References](./references.md)
