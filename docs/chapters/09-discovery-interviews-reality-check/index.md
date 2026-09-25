---
title: Discovery Interviews & the Reality Check
description: How to design and run unbiased customer discovery interviews, culminating in the Reality Check pressure test that surfaces real pain versus assumed pain.
generated_by: claude skill chapter-content-generator
date: 2026-09-25 06:34:32
version: 1.10
---

# Discovery Interviews & the Reality Check

## Summary

Teaches how to design and run unbiased customer discovery interviews, culminating in the Reality Check pressure test that surfaces real pain versus assumed pain.

## Concepts Covered

This chapter covers the following 24 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| Discovery Interview | 699 |
| Customer Interview | 19 |
| Interview Question | 8 |
| Open-Ended Question | 7 |
| Leading Question | 11 |
| Interview Bias | 7 |
| Asking Not Selling | 6 |
| Interview Script | 10 |
| Interview Debrief | 6 |
| Interview Finding | 5 |
| Interview Surprise | 9 |
| Interview Scheduling | 5 |
| Interview Recruitment | 4 |
| Reality Check Exercise | 8 |
| Pressure Test | 4 |
| Assumption Testing | 3 |
| Customer Conversation | 3 |
| Field Research | 3 |
| Qualitative Research | 2 |
| Pattern Recognition | 2 |
| Interview Synthesis | 2 |
| Assumption Dismantling | 1 |
| Weak Assumption | 1 |
| Interview Sample Size | 1 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 2: Founder Mindset & the Cohort Learning Experience](../02-founder-mindset-cohort/index.md)
- [Chapter 4: Customer Discovery & Segmentation](../04-customer-discovery-segmentation/index.md)
- [Chapter 5: Defining the Real Problem](../05-defining-the-real-problem/index.md)

---

## Time to Talk to Real People

Every block filled in so far — Customer, Problem, Solution, Alternatives, Benefit, Advantage — is still, technically, a set of assumptions. This chapter is where that changes. The next Field Discovery Window from Chapter 2 sends you out to talk to real people, and this chapter teaches you how to do that well enough that what comes back is trustworthy evidence, not just polite agreement.

!!! mascot-welcome "Time to Leave the Cohort and Talk to Real People"
    ![Scout waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Everything on your canvas so far has been an educated guess. This chapter teaches you how to ask questions that actually test those guesses, instead of accidentally asking questions that just confirm what you already believe. Let's find out for real!

## What Is a Discovery Interview

A **discovery interview** is a structured conversation with a real prospective customer, designed specifically to learn about their problem, current behavior, and unmet needs — not to pitch, describe, or sell them anything. This is the central tool of real-world customer friction from Chapter 2, and it belongs to a broader category: a **customer interview** is any one-on-one conversation with a customer or prospective customer conducted for research purposes, of which the discovery interview is the specific early-stage version focused on problem understanding rather than product feedback.

More broadly still, a discovery interview is one form of **customer conversation**: any dialogue with a customer that produces information useful to the venture, whether structured or casual. Collected systematically across many customers, these conversations become **field research**: evidence gathered directly from real people in their own context, as opposed to research conducted at a desk. The specific kind of evidence they produce is **qualitative research**: information about opinions, motivations, and experiences captured in people's own words, as distinct from **quantitative research** measuring how many or how much — a discovery interview tells you *why* a customer feels frustrated, where a survey might only tell you *how many* customers checked a box.

!!! mascot-thinking "The Goal Is to Get Proven Wrong, Not Right"
    ![Scout thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Notice the mental flip this requires: walking into a discovery interview hoping to hear "yes, exactly!" defeats the purpose. The interview's actual job is to find the specific ways your canvas is wrong, as fast and cheaply as possible — before you've built anything expensive around a mistaken belief.

## Recruiting and Scheduling: Getting People to Talk to You

Before any question gets asked, someone has to agree to answer it. **Interview recruitment** is the process of finding and inviting real prospective customers to participate in a discovery interview — through personal networks, neighborhood apps, online communities, or direct outreach. **Interview scheduling** is the logistical work of actually setting a time that happens, which sounds trivial but is where many founders' good intentions quietly die.

**Interview sample size** is how many people you actually need to talk to before treating a pattern as meaningful rather than coincidence — for the kind of early qualitative research this course teaches, three to five conversations is often enough to spot a real pattern, which is why the course's own learning outcomes call for at least three.

!!! mascot-tip "Ask for 15 Minutes, Not 'Interest in My Business'"
    ![Scout giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Here's a shortcut for recruitment: never ask "would you be interested in hearing about my business idea?" Ask instead, "Can I get your opinion on something for 15 minutes? I'm not selling anything." The second version gets a dramatically higher yes rate, because it promises exactly what it delivers.

## Asking, Not Selling: Writing Unbiased Questions

How a question is worded can quietly wreck an otherwise well-recruited interview. **Asking not selling** is the core discipline of a discovery interview: the founder's job is to ask and listen, not to describe, defend, or pitch their solution — the moment a founder starts explaining their idea, the interview stops producing trustworthy data. An **interview script** is the prepared, written set of questions a founder plans to ask, kept short enough to leave room for follow-up rather than filling the entire time slot with a rigid checklist.

Each individual **interview question** — any single question a founder asks during a discovery interview — falls into one of two very different categories. An **open-ended question** invites the customer to answer in their own words and can't be answered with a simple yes or no — "Tell me about the last time this was a problem for you." A **leading question** is worded in a way that suggests the "correct" or desired answer, nudging the customer toward agreement rather than honesty — "Wouldn't it be great if grooming came to your house?" practically demands a yes. Falling into leading questions, even unintentionally, produces **interview bias**: systematic distortion of what a customer actually believes, caused by how a question was asked rather than what the customer genuinely thinks.

Before practicing the distinction yourself, notice the pattern: an open-ended question asks the customer to supply the content; a leading question already supplies the content and just asks for agreement.

#### Diagram: Leading vs Open-Ended Question Sorter

<iframe src="../../sims/leading-vs-open-ended-sorter/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Leading vs Open-Ended Question Sorter</summary>
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
</details>

!!! mascot-warning "A Leading Question Feels Like Progress — It Isn't"
    ![Scout warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    A common trap here is walking away from an interview full of leading questions feeling great, because every answer sounded like agreement. The fix: before asking any question, silently check whether a stranger could answer "no" to it without feeling awkward. If not, rewrite it open-ended.

## After the Interview: Debrief, Findings, and Surprises

The interview itself is only half the work. An **interview debrief** is the short reflection a founder does immediately after each conversation — ideally within minutes, while memory is fresh — capturing what was actually said before it blurs with what was expected. That reflection produces **interview findings**: the specific, factual takeaways from a single conversation, kept separate from the founder's own interpretation of them.

The most valuable findings are usually **interview surprises**: anything a customer said or did that contradicted what the founder expected going in — Priya's discovery that taste wasn't the barrier, timing was, is a textbook interview surprise. After several interviews accumulate, **pattern recognition** is the act of noticing which findings repeat across multiple, independent conversations rather than appearing in just one. **Interview synthesis** is pulling all of that together into a short written summary of what the full round of interviews showed, ready to update the canvas.

## The Reality Check Pressure Test

All of this groundwork exists to support the course's signature exercise. A **reality check exercise** is a structured pressure test, typically done with cohort peers, in which a founder's canvas assumptions get challenged directly against the actual interview evidence gathered — not against opinion, but against what real people said and did. A **pressure test** is the general practice of deliberately trying to break an idea by exposing it to hard questions before the market does it for you, for free but without mercy.

The specific target of that pressure test is **assumption testing**: checking each individual claim on the canvas against the field evidence collected so far, one assumption at a time. Some assumptions survive; a **weak assumption** is one that interview evidence only partially supports, or supports inconsistently across different customers — not disproven outright, but not solid either. **Assumption dismantling** is the deliberate, structured process of identifying exactly which part of a weak or false assumption was wrong, so the canvas can be corrected precisely rather than abandoned wholesale.

!!! mascot-encourage "Having an Assumption Dismantled Is Progress, Not Failure"
    ![Scout encouraging](../../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    If watching your own canvas get pressure-tested in front of peers feels uncomfortable, that's completely normal — most founders find the Reality Check the hardest moment in the whole course. You already have what you need for it: the psychological safety Chapter 2 built, and a cohort that's doing this exact same thing right alongside you.

## Key Takeaways

Before Chapter 10 turns validated findings into a formal lean test, hold onto how real evidence gets gathered:

- A **discovery interview** is one form of **customer interview** and **customer conversation**, producing **field research** and **qualitative research** rather than assumptions.
- **Interview recruitment**, **scheduling**, and a sensible **interview sample size** get real conversations on the calendar.
- **Asking not selling**, guided by a short **interview script**, means favoring **open-ended questions** over **leading questions** to avoid **interview bias**.
- An **interview debrief** captures **interview findings** and **interview surprises**; **pattern recognition** across several interviews feeds **interview synthesis**.
- The **reality check exercise** is a **pressure test** built on **assumption testing** — surfacing any **weak assumption** for honest **assumption dismantling**.

!!! mascot-celebration "You Just Ran Your First Reality Check"
    ![Scout celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You now know how to gather evidence that's actually trustworthy — and how to let that evidence change your mind. That's the discipline the rest of this course runs on. Let's find out for real, starting with lean testing in Chapter 10.
