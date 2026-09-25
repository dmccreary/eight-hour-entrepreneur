---
title: FAQ Coverage Gaps
description: The learning-graph concepts not explicitly named in the FAQ, ranked by indegree (how many other concepts depend on them) and grouped by taxonomy category.
---

# FAQ Coverage Gaps

Concepts from the [Learning Graph](index.md) (300 total) not explicitly matched, by exact label, in [docs/faq.md](../faq.md). See the methodology note in the [FAQ Quality Report](faq-quality-report.md) — this is a conservative proxy for coverage, not a claim that the underlying idea is unexplained anywhere in the FAQ.

## Critical Gaps (High Priority)

High-indegree concepts (many other concepts depend on them) without exact-label FAQ coverage:

**None.** Every concept with an indegree of 1 or more — including all 10 of the learning graph's highest-indegree concepts (Target Customer, Thirty-Day Launch Plan, Lean Validation, Discovery Interview, Business Idea, Solution Definition, Value Proposition, Problem Definition, Revenue Model, Messaging Framework) and all 4 foundational, no-prerequisite concepts (Entrepreneurship, Early-Stage Venture, Unrefined Concept, Business Idea) — is covered. See [Graph Quality Analysis](quality-metrics.md) for the full indegree table.

## Medium Priority Gaps

Moderate-indegree concepts without FAQ coverage: **none.** Every uncovered concept in this FAQ has an indegree of exactly 0 — nothing else in the 300-concept graph depends on it. Coverage gaps below are therefore all leaf-level elaborations of an idea whose parent concept the FAQ already covers, not missing prerequisites.

## Low Priority Gaps

119 terminal or single-use elaboration concepts, grouped by taxonomy category (largest first). Each of these already has a parent concept covered somewhere in the FAQ or a chapter.

### Solution Design & Offer Development (SOL) — 13 uncovered

Feature Vs Benefit, Offer Clarity, Offer Design, Solution Assumption, Solution Fit, Solution Iteration, Solution Pivot, Solution Refinement, Solution Scope, Solution Simplicity, Solution Testing, Value Delivery, What You Offer

*Parent concept already covered:* Solution Definition, Minimum Viable Offer.

### Value Proposition: Benefit & Advantage (VALU) — 12 uncovered

Advantage Articulation, Benefit Articulation, Best Person To Solve It, Emotional Benefit, Functional Benefit, Unique Selling Point, Unique Value, Value Clarity, Value Differentiation, Value Proposition Refinement, Why Customer Wants It, Why You Solve The Problem

*Parent concept already covered:* Value Proposition, Benefit Block, Advantage Block, Competitive Advantage, Unfair Advantage.

### Discovery Interviews & Research Methods (INTV) — 12 uncovered

Assumption Testing, Customer Conversation, Customer Interview, Field Research, Interview Finding, Interview Sample Size, Interview Scheduling, Interview Surprise, Interview Synthesis, Pattern Recognition, Pressure Test, Qualitative Research

*Parent concept already covered:* Discovery Interview, Reality Check Exercise, Interview Bias, Open-Ended Question, Leading Question.

### Customer Discovery & Segmentation (CUST) — 12 uncovered

Customer Assumption, Customer Behavior, Customer Fit, Customer Journey, Customer Motivation, Customer Needs, Customer Prioritization, Early Adopter, Mainstream Customer, Serviceable Market, Target Market Definition, Who You Serve

*Parent concept already covered:* Target Customer, Customer Block, Broad Market, Niche Market, Ideal Customer Profile, Customer Persona, Customer Avatar, B2B Customer, B2C Customer.

### Messaging & Communication (MSG) — 12 uncovered

Customer-Facing Message, Headline Writing, High-Conversion Copy, Message Clarity, Message Simplicity, Message Testing, Messaging Iteration, Messaging Workshop, Outsider Comprehension Test, Persuasive Writing, Social Media Copy, Story-Based Messaging

*Parent concept already covered:* Messaging Framework, One-Sentence Value Proposition, Five-Second Test, Elevator Pitch, Message Block.

### Lean Validation & Testing (VALID) — 11 uncovered

Concept Validation, Low-Capital Testing, Manual Service Delivery, Rapid Experimentation, Smallest Testable Version, Test Hypothesis, Test Result, Test Result Debrief, Validated Concept, Validation Milestone, Validation Test Design

*Parent concept already covered:* Lean Validation, Minimum Testable Iteration, Pre-Sale Offer, Kill Decision, Pivot Decision, Persevere Decision, Build-Measure-Learn.

### Problem Definition & Pain Points (PROB) — 11 uncovered

Customer Pain, Essential Bills Priority, Pain Point, Problem Discovery, Problem Frequency, Problem Prioritization, Problem Urgency, Problem Validation, Problem-Solution Fit, Unmet Need, Willingness To Solve

*Parent concept already covered:* Problem Definition, Real Problem, Perceived Problem, Symptom Vs Root Cause.

### Startup Needs & Cost Planning (FIN) — 9 uncovered

Activity Resource Needs, Cash Flow Awareness, Cost Estimation, Minimal Viable Budget, Needs Vs Wants Assessment, One-Time Needs, People Resource Needs, Startup Budget, Startup Capital

*Parent concept already covered:* Startup Needs, Ongoing Costs, Fixed Costs, Variable Costs, Bootstrapped Funding, Financial Baseline, Technology Resource Needs.

### Launch Planning, Pitching & Accountability (LAUNCH) — 7 uncovered

Continuing Platform Ecosystem, Launch Confidence, Launch Readiness, Milestone-Driven Plan, Momentum Building, Peer Feedback, Time-Saving Pivot

*Parent concept already covered:* Thirty-Day Launch Plan, Weekly Milestone, Setback Normalization, Two-Minute Pitch, Mini Pitch, Accountability Network, Post-Course Support.

### Distribution & Go-to-Market (DIST) — 7 uncovered

Customer Acquisition Path, Direct Sales Channel, Go-To-Market Approach, Marketplace Channel, Partnership Channel, Referral Channel, Social Media Channel

*Parent concept already covered:* Distribution Channel, Channel Fit, Channel Cost, Channel Selection, Channel Testing, Multi-Channel Strategy, Word Of Mouth.

### Revenue Models & Pricing (REV) — 6 uncovered

Pricing Communication, Pricing Validation, Revenue Assumption, Revenue Projection, Revenue Stream, Willingness To Pay

*Parent concept already covered:* Revenue Model, Pricing Strategy, Pricing Model, Cost-Plus Pricing, Value-Based Pricing, Subscription Pricing, Tiered Pricing, Freemium Model, Recurring Revenue, Transaction Revenue, Break-Even Thinking.

### Alternatives & Competitive Analysis (ALT) — 5 uncovered

Alternative Assessment, Competitive Positioning, Existing Solution, Status Quo, Substitute Solution

*Parent concept already covered:* Alternative Solution, Do-Nothing Alternative, Direct Competitor, Indirect Competitor, Competitive Landscape Mapping, Competitive Analysis, Competitive Research, Competitive Intelligence, Differentiation.

### Entrepreneurship Foundations & Philosophy (FOUND) — 2 uncovered

Evidence-Based Decision Making, Unrefined Concept

*Parent concept already covered:* Entrepreneurship, Early-Stage Venture, Idea Trap, Clarity, Validation, Action, Launch, Lean Startup Philosophy, Assumption, Validated Learning, Founder Mindset, Growth Mindset, Psychological Safety.

## Recommendations

1. No action needed for high or medium priority gaps — there are none. The FAQ's 92 questions already reach every prerequisite-bearing concept in the 300-node graph.
2. If a future revision expands the FAQ, draw new questions from the 10 candidates in the [FAQ Quality Report](faq-quality-report.md#suggested-additional-questions) rather than working through this list mechanically — each of the categories above already has 5–9 questions, and every remaining concept here is a terminal elaboration rather than a genuinely new idea.
3. Re-run this check after any future `learning-graph-generator` re-run that changes concept IDs or adds concepts, since the indegree numbers this report relies on will shift.
