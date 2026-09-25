# Quiz Generation Quality Report

Generated: 2026-09-25
Execution Mode: Parallel (5 agents, one per chapter batch, by explicit user request)
Wall-clock Time: ~19 minutes 27 seconds

## Scope Note

This run deviated from the quiz-generator skill's default of ~10 questions per
chapter. The author asked for **one question per concept**, so every question
count below equals that chapter's concept count from its "Concepts Covered"
table rather than a fixed target. Concept coverage is therefore 100% for
every chapter, not the skill's usual 75%+ target.

## Overall Statistics

- **Total Chapters:** 17
- **Total Questions:** 300 (one per concept in the 300-concept learning graph — full-book concept coverage)
- **Avg Questions per Chapter:** 17.6
- **Concept Coverage:** 100% (300/300 concepts tested exactly once, verified programmatically against each chapter's "Concepts Covered" table)
- **Format Integrity:** 100% (every question's `#### N.` header, `<div class="upper-alpha">` open/close, and `??? question "Show Answer"` admonition counts match the question count in all 17 files — verified programmatically)
- **Overall Quality Score:** 93/100

## Per-Chapter Summary

| Chapter | Questions | Concept Coverage | Bloom's Type | Answer Letters (A/B/C/D) |
|---|---|---|---|---|
| 1. Entrepreneurship, Lean Thinking & the Idea Trap | 13 | 100% | Introductory | 3/3/3/4 |
| 2. Founder Mindset & the Cohort Learning Experience | 13 | 100% | Introductory | 4/3/3/3 |
| 3. The CO.STARTERS Canvas Framework | 16 | 100% | Introductory | 4/4/4/4 |
| 4. Customer Discovery & Segmentation | 24 | 100% | Intermediate | 6/6/6/6 |
| 5. Defining the Real Problem | 20 | 100% | Intermediate | 5/5/5/5 |
| 6. Designing the Solution & Initial Offer | 20 | 100% | Intermediate | 5/5/5/5 |
| 7. Alternatives & the Competitive Landscape | 18 | 100% | Intermediate | 5/4/5/4 |
| 8. Value Proposition: Benefit & Advantage | 22 | 100% | Intermediate | 5/6/5/6 |
| 9. Discovery Interviews & the Reality Check | 24 | 100% | Intermediate | 6/6/6/6 |
| 10. Lean Testing Fundamentals | 13 | 100% | Intermediate | 3/3/4/3 |
| 11. Interpreting Validation Evidence | 13 | 100% | Intermediate | 4/3/3/3 |
| 12. Messaging & the Value Proposition Statement | 20 | 100% | Intermediate | 5/5/5/5 |
| 13. Distribution & Go-to-Market Channels | 17 | 100% | Intermediate | 4/4/5/4 |
| 14. Revenue Models & Pricing | 20 | 100% | Advanced | 5/5/5/5 |
| 15. Startup Needs & Cost Planning | 19 | 100% | Advanced | 5/5/5/4 |
| 16. Building the 30-Day Launch Plan | 13 | 100% | Advanced | 4/3/3/3 |
| 17. Pitching, Accountability & What Comes Next | 15 | 100% | Advanced | 4/4/3/4 |

## Bloom's Taxonomy Distribution (Overall)

Blended target reflects the book's mix of 3 introductory chapters (42 questions),
10 intermediate chapters (191 questions), and 4 advanced chapters (67 questions).

| Level | Actual | Target (blended) | Deviation |
|-------|--------|-------------------|-----------|
| Remember | 73 (24.3%) | 24.9% | -0.6pp ✓ |
| Understand | 88 (29.3%) | 29.2% | +0.1pp ✓ |
| Apply | 80 (26.7%) | 26.8% | -0.1pp ✓ |
| Analyze | 49 (16.3%) | 15.8% | +0.5pp ✓ |
| Evaluate | 6 (2.0%) | 2.2% | -0.2pp ✓ |
| Create | 4 (1.3%) | 1.1% | +0.2pp ✓ |

**Bloom's Distribution Score:** 25/25 (excellent — every level within 1 percentage point of target)

## Answer Balance (Overall)

- A: 77 (25.7%)
- B: 74 (24.7%)
- C: 75 (25.0%)
- D: 74 (24.7%)

**Answer Balance Score:** 15/15 (near-perfect distribution; no chapter has a run longer than 2 of the same letter or a simple repeating pattern)

## Concept Coverage

- **Score:** 25/25 — 300/300 concepts tested, one question each, zero duplicates, zero omissions (verified by diffing each chapter's `**Concept Tested:**` lines against its learning-graph concept list)

## Known Issue Found and Corrected During Generation

The chapter-11 concept list handed to the generating agent initially omitted
**Concept Validation** (13 concepts in the chapter's actual "Concepts Covered"
table, 12 in the list supplied) because of a shell-extraction bug in the
orchestration step (a filter meant to strip the table's header row also
matched the row starting with "Concept "). The generating agent flagged the
discrepancy in its own report rather than silently under-covering the
chapter. The missing question was written and inserted in the correct
position, and the chapter was renumbered and re-verified — final count 13/13,
matching the source table exactly.

## Links

Every question's "See:" link points to the whole glossary page
(`../../glossary.md`) rather than a specific anchor, since MkDocs Material's
heading-slug algorithm is not reliably hand-computable for terms containing
punctuation (e.g. "CO.STARTERS Canvas"). This guarantees no broken links at
the cost of not deep-linking to the exact glossary entry.

## Recommendations

- Consider a follow-up pass that computes and verifies exact glossary anchor
  slugs (via `mkdocs build` output or a small script) so "See:" links can
  point to the specific glossary entry rather than the whole page.
- The one-question-per-concept format produces long per-chapter quizzes
  (up to 24 questions in Chapters 4 and 9). If learner feedback suggests this
  is too long for a single sitting, consider splitting the longest quizzes
  into two parts, or offering a shuffled random-subset mode using the
  existing question bank.
