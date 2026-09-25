---
title: Alternatives & the Competitive Landscape
description: Mapping how customers currently solve the problem today, from direct competitors to do-nothing alternatives, to reveal genuine gaps in the market.
generated_by: claude skill chapter-content-generator
date: 2026-09-25 06:32:15
version: 1.10
---

# Alternatives & the Competitive Landscape

## Summary

Maps how customers currently solve the problem today, from direct competitors to do-nothing alternatives, to reveal genuine gaps in the market.

## Concepts Covered

This chapter covers the following 18 concepts from the learning graph:

| Concept | Concept Impact Score |
|---------|-----------------------|
| Alternative Solution | 657 |
| Competitor | 11 |
| Competitive Landscape | 6 |
| Current Workaround | 5 |
| Substitute Solution | 5 |
| Direct Competitor | 5 |
| Indirect Competitor | 4 |
| Do-Nothing Alternative | 4 |
| Competitive Analysis | 4 |
| Market Gap | 3 |
| Competitive Positioning | 3 |
| Differentiation | 3 |
| Competitive Research | 2 |
| Existing Solution | 2 |
| Status Quo | 2 |
| Competitive Landscape Mapping | 1 |
| Alternative Assessment | 1 |
| Competitive Intelligence | 1 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 3: The CO.STARTERS Canvas Framework](../03-costarters-canvas-framework/index.md)
- [Chapter 6: Designing the Solution & Initial Offer](../06-designing-solution-offer/index.md)

---

## The Fourth Block: What Are They Doing Instead of You?

Chapter 6 gave you an initial offer. Before assuming a customer will choose it, this chapter asks an uncomfortable but necessary question: what are they doing right now, without you? Nobody encounters a validated problem and simply waits, undecided, until your venture launches. They're already coping somehow — and understanding exactly how is what the Alternatives block is for.

!!! mascot-welcome "Meet the Competition You Didn't Know You Had"
    ![Scout waving welcome](../../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Most first-time founders think "I don't really have competitors" — and they're almost always wrong, just not in the way they expect. By the end of this chapter you'll know exactly who and what you're actually up against. Let's find out for real!

## What Counts as an Alternative

An **alternative solution** is anything a target customer currently uses, does, or chooses instead of your proposed offer to address their problem — a category far broader than "other companies selling something similar." This is the fourth canvas block, and it's frequently the one founders fill in too narrowly, because the word "competitor" makes people think only of rival businesses.

Two ideas widen that view. An **existing solution** is any product, service, or method — commercial or not — currently available to a customer for addressing their problem. The **status quo** is simply how the customer currently lives with the problem overall, encompassing every existing solution they use, ignore, or tolerate. For Jordan's target customer, the status quo isn't one groomer — it's some combination of a booked-solid salon, a bottle of dry shampoo, and quietly accepting a slightly smelly dog between visits.

## The Do-Nothing Alternative and the Current Workaround

The single most overlooked alternative in this entire chapter is the simplest one. The **do-nothing alternative** is the option of a customer simply continuing to tolerate the problem, unsolved, rather than adopting any solution at all — and it is, for most problems, the actual default competitor a venture has to beat. A **current workaround** is any informal, imperfect method a customer has assembled on their own to partially address the problem without a dedicated solution — Priya's interviewees' current workaround for dinner wasn't a competing meal-kit company; it was a rotating mix of takeout, cereal for dinner, and a freezer full of half-used ingredients.

!!! mascot-thinking "Your Real Competitor Is Usually 'Nothing,' Not a Rival"
    ![Scout thinking](../../img/mascot/thinking.png){ class="mascot-admonition-img" }
    Notice the shift this creates: the question isn't "how do I beat the other dog groomer" — it's "how do I beat forty minutes of driving and quietly not getting the dog groomed." The do-nothing alternative is almost always the toughest competitor in the room, because it costs the customer nothing to keep choosing it.

## Direct, Indirect, and Substitute Competitors

Once the full status quo is in view, it helps to sort the alternatives inside it. A **competitor** is any existing solution — business, product, or workaround — that a target customer might choose over your offer. A **direct competitor** solves the same problem for the same target customer using essentially the same approach — another mobile dog groomer, for Jordan. An **indirect competitor** solves the same underlying problem but through a meaningfully different approach — a traditional storefront groomer that requires drop-off, for instance. A **substitute solution** doesn't solve the exact same problem at all, but satisfies enough of the same underlying need that a customer might choose it anyway — a dog-washing self-service station at the local pet store, which doesn't groom the dog but does address the "my dog needs attention" feeling behind the request.

Before exploring the full spectrum interactively, notice that these four categories — do-nothing, current workaround, indirect/substitute, and direct — form a rough line from "costs the customer nothing to keep choosing" to "looks almost exactly like your own offer." The map below lets you place Jordan's actual alternatives along that line.

#### Diagram: Competitive Landscape Map

<iframe src="../../sims/competitive-landscape-map/main.html" width="100%" height="500px" scrolling="no"></iframe>

<details markdown="1">
<summary>Competitive Landscape Map</summary>
Type: diagram
**sim-id:** competitive-landscape-map<br/>
**Library:** p5.js<br/>
**Status:** Specified

Bloom Level: Analyze (L4)
Bloom Verb: differentiate

Learning objective: Learners differentiate existing alternatives to a venture as the do-nothing alternative, a current workaround, an indirect competitor or substitute, or a direct competitor, by their directness in solving the same problem.

Canvas layout:

- A horizontal spectrum line labeled "How directly does this solve the same problem?" running from "Costs nothing to keep choosing" (left) to "Looks just like your offer" (right)
- 5 nodes placed along the line, left to right: "Do-Nothing Alternative," "Current Workaround," "Substitute Solution," "Indirect Competitor," "Direct Competitor"
- A detail panel below showing the selected node's definition and Jordan's real example

Data Visibility Requirements:

  Do-Nothing Alternative selected: "Tolerating the problem unsolved. Jordan's example: the dog just doesn't get groomed this month."
  Current Workaround selected: "An informal, imperfect fix. Jordan's example: dry shampoo and at-home brushing."
  Substitute Solution selected: "Solves the underlying need differently. Jordan's example: a self-service dog wash station at the pet store."
  Indirect Competitor selected: "Solves the same problem, different approach. Jordan's example: a traditional storefront groomer requiring drop-off."
  Direct Competitor selected: "Same problem, same approach. Jordan's example: another mobile dog-grooming service in the area."

Interactive controls:

- Click any node to select it and update the detail panel (default: no node selected, prompt reads "Click a node to explore Jordan's competitive landscape")
- Selected node highlighted in fox-orange (#E8791A); others in indigo (#3F51B5)

Visual style: Simple horizontal spectrum line with 5 evenly spaced circular nodes; labels above each node, connecting line beneath.

Default parameters: No node selected on load.

Implementation notes: Use p5.js. Store the 5 nodes as an array of objects `{label, definition, example}` with fixed x-positions along the spectrum. Must reflow to a vertical spectrum (top to bottom) on narrow (mobile) viewports.
</details>

## Researching the Landscape

Filling in the map above requires actual work, and the course uses several related terms for that work. **Competitive research** is the general activity of gathering information about existing alternatives available to your target customer. **Competitive intelligence** refers more specifically to the ongoing, ordered collection and interpretation of that information — not a one-time search, but a ledger a founder keeps updating. **Competitive analysis** is the step of interpreting gathered research to draw conclusions about strengths, weaknesses, and openings. The **competitive landscape** is the resulting full picture — every alternative a target customer has available, organized and understood together — and **competitive landscape mapping** is the specific act of laying that picture out visually, such as the spectrum diagram above.

!!! mascot-tip "Ask What They'd Do If You Didn't Exist"
    ![Scout giving a tip](../../img/mascot/tip.png){ class="mascot-admonition-img" }
    Here's a shortcut for competitive research: during a discovery interview, ask directly, "What would you do about this if my business didn't exist?" The answer names your real competitive landscape faster than any amount of online searching — straight from the customer who has to live with the choice.

## Finding the Gap

The entire point of mapping alternatives is spotting where they fall short. A **market gap** is a genuine, customer-confirmed shortfall shared by every current alternative — something the status quo consistently fails to deliver that a target customer actually wants. **Alternative assessment** is the deliberate evaluation of each mapped alternative against the validated problem from Chapter 5, checking specifically where it satisfies the customer and where it leaves them still wanting something more.

!!! mascot-warning "No Visible Competitors Is a Warning Sign, Not Good News"
    ![Scout warning](../../img/mascot/warning.png){ class="mascot-admonition-img" }
    A common trap here is celebrating an empty competitive landscape as proof of a great opportunity. Usually it means one of two things: either the problem isn't real enough for anyone to have built a solution, or the research simply wasn't thorough. The fix: if your map looks empty, assume you're missing alternatives — especially the do-nothing kind — before assuming you've found a gap no one else has noticed.

## Differentiation and Positioning

With a real market gap identified, two final ideas point forward to Chapter 8. **Differentiation** is what makes your offer meaningfully different from every mapped alternative, grounded in the specific gap you found rather than a vague claim of being "better." **Competitive positioning** is the deliberate choice of where your offer sits relative to the full competitive landscape in a customer's mind — faster, cheaper, more personal, more convenient — set up here and built out fully into a complete value proposition in the next chapter.

## Key Takeaways

Before Chapter 8 turns this landscape into a value proposition, hold onto how the competitive picture comes together:

- An **alternative solution** includes every **existing solution** that makes up the customer's **status quo** — starting with the often-overlooked **do-nothing alternative** and **current workaround**.
- A true **competitor** can be **direct**, **indirect**, or a **substitute solution** — three different distances from your own offer along the same spectrum.
- **Competitive research**, **competitive intelligence**, and **competitive analysis** build the full **competitive landscape**, laid out visually through **competitive landscape mapping**.
- A genuine **market gap**, confirmed through honest **alternative assessment**, is what earns real **differentiation** and a clear **competitive positioning** — never assumed from an empty-looking map.

!!! mascot-celebration "You Just Mapped the Real Competition"
    ![Scout celebrating](../../img/mascot/celebration.png){ class="mascot-admonition-img" }
    You now know exactly what your offer is up against — including the "nothing" that so many founders miss. That's the honest foundation Chapter 8 needs to build a value proposition on. Let's find out for real, starting with benefit and advantage in Chapter 8.

[See Annotated References](./references.md)
