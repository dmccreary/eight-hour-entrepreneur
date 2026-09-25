# Learning Graph Generator — Session Log

- **Skill version:** 1.07
- **Date:** 2026-09-25
- **Book:** The Eight-Hour Entrepreneur

## Steps Executed

| Step | Action | Result |
|---|---|---|
| 0 | Setup — copied Python tools into `docs/learning-graph/` | add-taxonomy.py, analyze-graph.py, csv-to-json.py, taxonomy-distribution.py, validate-learning-graph.py/.sh, learning-graph-schema.json |
| 1 | Course description quality check | Skipped — `docs/course-description.md` frontmatter already had `quality_score: 99` (set by `course-description-analyzer` earlier in this session) |
| 2 | Generate concept labels | 300 concepts written to `concept-list.md`; user confirmed proceeding without edits |
| 3 | Generate dependency graph | 300-row CSV built via a category-ordered DAG construction (hand-authored cross-category bridge dependencies + branching intra-category deps); written to `learning-graph.csv` |
| 4 | Quality validation | `python3 analyze-graph.py learning-graph.csv quality-metrics.md` → valid DAG, 0 cycles, 0 orphaned nodes, 1 connected component, 4 foundational concepts, 39 terminal nodes (13.0%), avg 2.07 deps/concept, max chain length 25. Assessed quality ≈ 94/100 |
| 5 | Concept taxonomy | 14 categories (5.3%–9.3% each) written to `concept-taxonomy.md` |
| 5b | Taxonomy names JSON | `taxonomy-names.json` — 14 TaxonomyID → human-readable name mappings |
| 6 | Add taxonomy to CSV | `python3 add-taxonomy.py learning-graph.csv learning-graph.csv taxonomy-config.json` → TaxonomyID column added, distribution matches Step 5 exactly |
| 7 | Metadata JSON | `metadata.json` — title/description pulled from course-description.md, creator Dan McCreary, CC BY-NC-SA 4.0 DEED |
| 8 | Groups / color config | `color-config.json` — 14 categories assigned distinct named CSS colors from the skill's 24-color default palette, in palette order |
| 9 | Generate learning-graph.json | `python3 csv-to-json.py learning-graph.csv learning-graph.json color-config.json metadata.json taxonomy-names.json` (**csv-to-json.py v1.05**) → 300 nodes, 613 edges, 14 groups, 4 foundational concepts. Top CIS concepts (Business Idea, Early-Stage Venture, Validation, Idea Trap, Lean Startup Philosophy, Entrepreneurship, CO.STARTERS Canvas) sanity-checked as genuinely foundational — no inverted-edge signal. Schema validation via `validate-learning-graph.sh` passed with 0 orphaned nodes. |
| 10 | Taxonomy distribution report | `python3 taxonomy-distribution.py learning-graph.csv taxonomy-distribution.md` |
| 11 | index.md | Generated from `index-template.md` with `TEXTBOOK_NAME` → "The Eight-Hour Entrepreneur"; foundational-concept count corrected to 4 (actual) instead of the template's placeholder 10; template file deleted after use |
| 12 | Session log | This file |

## mkdocs.yml Changes

Uncommented the five generated-file nav entries under `Learning Graph:` (Concept Enumeration, Concept Taxonomy, Graph Quality Analysis, Taxonomy Distribution), alongside the pre-existing Introduction and Course Description Assessment entries.

## Build Verification

`mkdocs build --strict` passed with zero warnings after the nav update and removal of the used `index-template.md`.

## Files Created

- `concept-list.md` — 300 concepts
- `learning-graph.csv` — full dependency graph with taxonomy
- `taxonomy-names.json`
- `metadata.json`
- `color-config.json`
- `learning-graph.json` — 300 nodes, 613 edges, 14 groups
- `concept-taxonomy.md`
- `quality-metrics.md`
- `taxonomy-distribution.md`
- `index.md`
- `taxonomy-config.json` (input to `add-taxonomy.py`, kept for reproducibility)
