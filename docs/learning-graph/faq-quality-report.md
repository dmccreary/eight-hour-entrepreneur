---
title: FAQ Quality Report
description: Quality metrics and scoring for the generated FAQ, covering concept coverage, Bloom's Taxonomy distribution, answer quality, and organization.
---

# FAQ Quality Report

Generated: 2026-09-25

## Overall Statistics

- **Total Questions:** 92
- **Overall Quality Score:** 85/100
- **Content Completeness Score (pre-generation assessment):** 100/100
- **Concept Coverage:** 60% (181/300 concepts, case-insensitive match against the learning graph's canonical concept labels)

## Category Breakdown

### Getting Started Questions

- Questions: 14
- Share of FAQ: 15.2%
- Dominant Bloom's levels: Remember / Understand
- Typical answer length: ~120–175 words

### Core Concepts

- Questions: 26
- Share of FAQ: 28.3%
- Dominant Bloom's levels: Understand / Apply, with Remember and Analyze represented
- Typical answer length: ~90–150 words
- Covers all 11 CO.STARTERS Canvas blocks and all 13 non-foundational taxonomy categories (CANV, CUST, PROB, SOL, ALT, VALU, INTV, VALID, MSG, DIST, REV, FIN, LAUNCH) with at least one question each

### Technical Detail Questions

- Questions: 20
- Share of FAQ: 21.7%
- Dominant Bloom's levels: Remember / Understand
- Typical answer length: ~95–140 words
- Draws terminology directly from `glossary.md`, with a secondary link into the chapter that develops the term

### Common Challenges Questions

- Questions: 12
- Share of FAQ: 13.0%
- Dominant Bloom's levels: Apply / Analyze
- Typical answer length: ~90–160 words
- Framed as troubleshooting scenarios ("why do my interviews...", "what if...")

### Best Practice Questions

- Questions: 12
- Share of FAQ: 13.0%
- Dominant Bloom's levels: Apply / Evaluate
- Typical answer length: ~95–150 words
- Framed as "how should I..." / "what's the best way to..." recommendations

### Advanced Topics

- Questions: 8
- Share of FAQ: 8.7%
- Dominant Bloom's levels: Analyze / Evaluate / Create
- Typical answer length: ~100–150 words
- Covers cross-chapter synthesis (multi-channel strategy, B2B adaptation, extending the launch plan into an operational roadmap)

## Bloom's Taxonomy Distribution

Actual (whole-FAQ) vs. a per-category blended target (each category's own target distribution from the skill's rubric, weighted by that category's share of the 92 questions):

| Level | Actual | Blended Target | Deviation |
|-------|--------|-----------------|-----------|
| Remember | 17.4% | 22.6% | -5.2% |
| Understand | 34.8% | 31.3% | +3.5% |
| Apply | 22.8% | 24.2% | -1.4% |
| Analyze | 13.0% | 14.1% | -1.1% |
| Evaluate | 7.6% | 4.6% | +3.0% |
| Create | 4.3% | 3.3% | +1.0% |

Total absolute deviation: 15.2%, within the 11–20% band.

Overall Bloom's Score: 20/25 (good distribution, understand-heavy relative to blended target but within tolerance)

## Answer Quality Analysis

- **Examples:** 40/92 (43%) — Target: 40%+ ✓
- **Links:** 92/92 (100%) — Target: 60%+ ✓ (every answer links to at least one chapter, the glossary, a MicroSim, or a front-matter page; zero anchor-fragment links)
- **Avg Length:** 107.5 words — Target: 100-300 ✓ (min 76 words, max ~200 words; no answer is a one-liner and none pads past the point)
- **Complete Answers:** 92/92 (100%) ✓ — every answer stands alone and directly addresses its question

Answer Quality Score: 25/25

## Concept Coverage

**Methodology:** each of the 300 canonical concept labels from `learning-graph.csv` is matched (case-insensitive, word-boundary) against the full FAQ text. This is a conservative proxy — a concept can be genuinely explained without ever using its exact canonical label — so this number understates true pedagogical coverage.

**Covered: 181 of 300 concepts (60%).** Coverage concentrates on exactly the concepts that matter most: **all 10 of the learning graph's highest-indegree ("most depended-upon") concepts are covered** — Target Customer, Thirty-Day Launch Plan, Lean Validation, Discovery Interview, Business Idea, Solution Definition, Value Proposition, Problem Definition, Revenue Model, and Messaging Framework — and every one of the 4 foundational (no-prerequisite) concepts is covered. All 11 canvas blocks are named explicitly.

**Not covered (119 concepts):** every single uncovered concept has an indegree of 0 in the learning graph — meaning no other concept in the course depends on it. These are leaf-level elaborations of an already-covered parent idea (for example, `Emotional Benefit` and `Functional Benefit` elaborate the already-covered `Customer Benefit`/`Benefit Block`; `Interview Scheduling` and `Interview Sample Size` elaborate the already-covered `Discovery Interview`). See [FAQ Coverage Gaps](faq-coverage-gaps.md) for the full breakdown by taxonomy category.

Coverage Score: 20/30 (60–69% band)

## Organization Quality

- Logical categorization: ✓ — 6 categories matching the skill's standard structure, with Core Concepts internally organized by the book's 13 non-foundational taxonomy categories in course order
- Progressive difficulty: ✓ — Bloom's level rises category by category, from mostly Remember/Understand in Getting Started to mostly Analyze/Evaluate/Create in Advanced Topics
- No duplicates: ✓ — verified programmatically; no two questions cover the same concept pair from the same angle
- Clear questions: ✓ — every question is phrased as a real, searchable question and uses the book's own terminology

Organization Score: 20/20

## Overall Quality Score: 85/100

- Coverage: 20/30
- Bloom's Distribution: 20/25
- Answer Quality: 25/25
- Organization: 20/20

## Recommendations

### High Priority

None. All high-centrality (high-indegree) concepts are already covered, and all four foundational concepts are covered.

### Medium Priority

1. If the FAQ is expanded later, the `SOL` (Solution Design, 13 uncovered), `CUST`/`INTV`/`MSG`/`VALU` (12 uncovered each) taxonomy categories have the most remaining leaf-concept elaborations — see [FAQ Coverage Gaps](faq-coverage-gaps.md) for candidates.
2. The Remember/Understand ratio in Core Concepts leans slightly Understand-heavy relative to the category's 20%/40% target; a handful of additional "What is [X]?" definitional questions would rebalance it without changing the total question count much.

### Low Priority

1. Consider 2–3 more Advanced Topics questions if the book adds new cross-chapter capstone material in a future edition.
2. As new chapters or MicroSims are added, re-run the concept-coverage check in `faq-coverage-gaps.md` rather than assuming this report stays current.

## Suggested Additional Questions

Representative candidates drawn from the highest-density uncovered categories (all indegree-0, so purely additive — none are prerequisites the FAQ is currently missing):

1. "What's the difference between a Functional Benefit and an Emotional Benefit?" (Core Concepts / VALU)
2. "What is Offer Clarity, and how do I know my initial offer has it?" (Core Concepts / SOL)
3. "What is an Early Adopter, and why design your first offer for them?" (Core Concepts / CUST)
4. "What is a Pain Point, and how is it different from a Problem Statement?" (Technical Detail / PROB)
5. "What is Message Testing, and how does it differ from the Five-Second Test?" (Technical Detail / MSG)
6. "What is a Revenue Assumption, and how does it get validated?" (Technical Detail / REV)
7. "What is Launch Readiness, and how do I know I've reached it?" (Advanced Topics / LAUNCH)
8. "What's the difference between Direct Sales, Marketplace, and Partnership channels?" (Technical Detail / DIST)
9. "What is a One-Time Need versus Cost Estimation for it?" (Technical Detail / FIN)
10. "What is Interview Synthesis, and how is it different from a single Interview Finding?" (Common Challenges / INTV)
