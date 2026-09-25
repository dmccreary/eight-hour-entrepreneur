# Session Log: Book Initialization

**Book:** The Eight-Hour Entrepreneur
**Date:** 2026-09-25
**Repo:** https://github.com/dmccreary/eight-hour-entrepreneur

This log records the full sequence of skills run in this session, in order, from an empty git repository through the generated Chapter 1 content. Each section gives the user's prompt verbatim (or as close to verbatim as available), the skill/workflow it triggered, and what was produced.

---

## 1. Scaffold the textbook

**Prompt:**
> init textbook with a title of "The Eight-Hour Entrepreneur" and a description you can get from the github repo

**Skill:** `book-installer` → `init-textbook.md` (feature 0)

**What happened:**
- Confirmed the project directory was empty (only `.git`, no commits yet) and already on branch `main`
- Pulled the book's description from the GitHub repo via `gh repo view`: *"An interactive intelligent textbook for an intensive, virtual 'learning lab' designed to take early-stage entrepreneurs from an unrefined concept to a validated, launch-ready venture in 8 total hours (four 2-hour virtual sessions)."*
- Confirmed the full substitution table with the user (SITE_NAME, SITE_DESCRIPTION, SITE_AUTHOR = Dan McCreary, GITHUB_USERNAME = dmccreary, REPO_NAME = eight-hour-entrepreneur, PRIMARY_COLOR = indigo, ACCENT_COLOR = orange, YEAR = 2026) before writing any files
- Copied the canonical scaffold from `assets/init-textbook/` and substituted all placeholders
- Verified: no leftover `{{PLACEHOLDER}}` tokens, no stray `.template` files, `CLAUDE.md` is the one-line `@AGENTS.md` pointer, `mkdocs build --strict` passes, `og:image`/`twitter:image` resolve to `img/cover.png`
- GitHub default-branch check skipped (no commits pushed yet) — flagged to re-check before the first `gh-deploy`

**Files created:** `mkdocs.yml`, `AGENTS.md`, `CLAUDE.md`, `CONTENT-GENERATION-GUIDE.md`, `.gitignore`, `eight-hour-entrepreneur.code-workspace`, `plugins/social_override.py`, `docs/index.md`, `docs/about.md`, `docs/course-description.md` (seed), `docs/contact.md`, `docs/license.md`, `docs/chapters/index.md`, `docs/learning-graph/index.md`, `docs/sims/index.md`, `docs/css/extra.css`, `docs/img/cover.png`, `docs/img/license.png`

---

## 2. Convert source PDFs into the course description

**Prompt:**
> Please convert the files in @input-from-val into a course-description.md file

**Input:** `input-from-val/Course Overview_ The Eight-Hour Entrepreneur.pdf` and `input-from-val/Fillable Canvas (1).pdf` (the CO.STARTERS Canvas)

**What happened:**
- Read both PDFs in full (4-week syllabus with per-session agenda breakdowns, and the 11-block CO.STARTERS Canvas form)
- Wrote `docs/course-description.md` following the `course-description-analyzer` template structure: Title, Target Audience, Prerequisites, Course Overview, Main Topics Covered (16), Topics Not Covered (8), and Learning Outcomes across all six Bloom's Taxonomy levels (4 outcomes each)
- Verified `mkdocs build --strict` still passed

---

## 3. Validate the course description

**Prompt:**
> run the course-description-analyzer

**Skill:** `course-description-analyzer` v0.04

**What happened:**
- Re-read the current `docs/course-description.md` (it had changed slightly on disk since the previous write — took the on-disk version as current per session convention)
- Scored it against the 100-point rubric: **99/100** ("Excellent — Ready for learning graph generation"), docking 1 point from Descriptive Context for a repeated grammar slip ("operationalize" → should be "operationalizes")
- Wrote the full assessment to `docs/learning-graph/course-description-assessment.md`
- Added YAML frontmatter to `docs/course-description.md` (`title`, `description`, `quality_score: 99`) per the skill's Step 2.6
- Uncommented the "Course Description Assessment" nav entry in `mkdocs.yml`
- Verified clean `mkdocs build --strict`

---

## 4. Generate the learning graph

**Prompt:**
> run the learning-graph-generator

**Skill:** `learning-graph-generator` v1.07

**What happened:**
- Skipped Step 1 (course description quality re-assessment) since `quality_score: 99` was already ≥ 85
- Copied the skill's Python tools into `docs/learning-graph/`
- **Step 2:** Generated **300 concept labels** across 14 natural categories (Title Case, ≤32 chars) → `concept-list.md`; user approved proceeding without manual edits
- **Step 3:** Built the dependency-graph CSV programmatically — category ID ranges kept contiguous and monotonically increasing so every dependency points backward by construction, plus hand-authored cross-category "bridge" dependencies reflecting the real course flow (Canvas → Customer → Problem → Solution → Alternatives → Value → Interviews → Validation → Messaging/Distribution/Revenue/Costs → Launch) → `learning-graph.csv`
- **Step 4:** `analyze-graph.py` → valid DAG, 0 cycles, 0 orphaned nodes, 1 connected component, 4 foundational concepts, 39 terminal nodes (13.0%), avg 2.07 deps/concept, max chain length 25 → `quality-metrics.md`; assessed quality ≈ 94/100
- **Step 5/5b:** 14-category taxonomy (5.3%–9.3% each, none over 30%) → `concept-taxonomy.md`, `taxonomy-names.json`
- **Step 6:** Added `TaxonomyID` column via `add-taxonomy.py` with an exact-range `taxonomy-config.json`
- **Step 7/8:** `metadata.json` (title/description/creator/license) and `color-config.json` (14 distinct named CSS colors from the skill's default palette)
- **Step 9:** `csv-to-json.py` (v1.05) → `learning-graph.json`: 300 nodes, 613 edges, 14 groups, 4 foundational concepts. Top-CIS sanity check passed (Business Idea, Early-Stage Venture, Validation, Idea Trap, Lean Startup Philosophy, Entrepreneurship, CO.STARTERS Canvas — genuinely foundational, no inverted-edge signal). Schema validated via `validate-learning-graph.sh`
- **Step 10:** `taxonomy-distribution.py` → `taxonomy-distribution.md`
- **Step 11:** `index.md` generated from the template, `TEXTBOOK_NAME` substituted, foundational-concept count corrected to the actual 4
- **Step 12:** Session log written to `docs/learning-graph/logs/learning-graph-generator-1.07-2026-09-25.md`
- Uncommented the remaining Learning Graph nav entries in `mkdocs.yml`
- Verified clean `mkdocs build --strict`

**Files created:** `concept-list.md`, `learning-graph.csv`, `taxonomy-names.json`, `metadata.json`, `color-config.json`, `learning-graph.json`, `concept-taxonomy.md`, `quality-metrics.md`, `taxonomy-distribution.md`, `index.md` (rewritten), plus the copied Python tools, all under `docs/learning-graph/`

---

## 5. Design the chapter structure

**Prompt:**
> run the book-chapter-generator

**Skill:** `book-chapter-generator` v1.1.2

**What happened:**
- Read `learning-graph.json`, validated edge direction (4 simple foundational concepts, confirmed correct) and read each concept's pre-computed CIS
- Designed a **17-chapter structure** covering all 300 concepts, using contiguous ID ranges so dependency safety is guaranteed by construction; split the three oversized taxonomy categories (FOUND 26, VALID 26, LAUNCH 28 — all over the 25-concept chapter ceiling) into two chapters each at natural conceptual seams
- Presented the full design (titles, one-sentence summaries, concept counts, design challenges/solutions, statistics) to the user for approval — **approved**
- Generated all 17 chapter directories and `index.md` files programmatically from the graph data (Summary, "Concepts Covered" table with CIS scores in pedagogical order, "Prerequisites" section listing only the specific earlier chapters actually referenced by cross-chapter dependencies)
- Rebuilt `docs/chapters/index.md` with the full chapter overview
- Updated `mkdocs.yml`'s `Chapters:` nav block with all 17 numbered entries (one title needed YAML-quoting because of an embedded colon: `"8. Value Proposition: Benefit & Advantage"`)
- Verified clean `mkdocs build --strict`; confirmed the nav YAML parsed correctly via `python3 -c "import yaml..."`
- Ended with the standing recommendation to design a learning mascot before running `chapter-content-generator`

**Final structure:** 17 chapters, 300 concepts, average 17.6 concepts/chapter, range 13–24, zero dependency violations (verified programmatically)

---

## 6. Design the learning mascot

**Prompt:**
> add a learning mascot

**Skill:** `book-installer` → `learning-mascot.md`

**What happened:**
- Gathered course context (subject, audience, tone, indigo/orange palette) and asked the user 4 design questions in one batch (species, name, personality, art style) — all **recommended defaults accepted**: **Fox**, named **Scout**, **scrappy & encouraging**, **modern flat vector**
- Filled in the remaining design details (catchphrase "Let's find out for real!", colors tied to the book's indigo/orange palette, indigo field-notebook satchel, voice traits) and wrote:
  - `docs/img/mascot/character-sheet.md` (canonical identity document)
  - `docs/img/mascot/image-prompts.md` (7 self-contained pose prompts)
  - `docs/css/mascot.css` (7 pose-specific admonition styles using Scout's colors)
- Ran `render-mascot-guide.py` to splice the canonical mascot placement rules into `CONTENT-GENERATION-GUIDE.md` between sentinel comments, then inserted the book-specific subsections (Mascot File Index, Character Overview, Voice Characteristics) between the heading and the sentinel block; verified with `render-mascot-guide.py --check`
- Ran `render-mascot-test.sh Scout` to generate `docs/learning-graph/mascot-test.md` (transparency/trim test grid + all 7 admonition previews)
- Updated `mkdocs.yml` (`css/mascot.css` added to `extra_css`, mascot test page added to the Learning Graph nav)
- Added the mascot-reading directive to `AGENTS.md` (not `CLAUDE.md`, per this project's established one-line-pointer convention)
- `mkdocs build --strict` correctly reported 7 WARNING-level "target not found" messages for the not-yet-generated pose PNGs — expected until the user supplied the images

**Files created:** `docs/img/mascot/character-sheet.md`, `docs/img/mascot/image-prompts.md`, `docs/css/mascot.css`, `docs/learning-graph/mascot-test.md`; `CONTENT-GENERATION-GUIDE.md` and `AGENTS.md` updated

---

## 7. Generate the cover image prompt

**Prompt:**
> generate the cover image prompt

**Skill:** `book-installer` → `cover-image-generator.md`

**What happened:**
- Verified prerequisites (`mkdocs.yml`, `docs/course-description.md`); mascot `welcome.png` and MicroSim screenshots not yet present at this point, so the mascot was described textually from the character sheet instead
- Selected **8 montage concepts** from the 300-concept learning graph (CO.STARTERS Canvas, Discovery Interview, Reality Check Pressure Test, Pre-Sale Offer, One-Sentence Value Proposition, Distribution Channel, Revenue Model, Thirty-Day Launch Plan), each with a concrete one-line visual description
- Wrote the full prompt to `docs/img/cover-image-prompt.md` (subject/tone, title treatment, montage, mascot placement, style/palette tied to the book's indigo/fox-orange theme, and an explicit "avoid" list)
- Per the skill's design, did **not** auto-generate the image — recommended the manual paste-into-a-text-to-image-tool review loop instead
- Confirmed the file's absence from `exclude_docs` (pattern matches `cover-prompt.md`, not `cover-image-prompt.md`) only produces a harmless INFO-level "not in nav" notice, not a strict-mode failure

---

## 8. Generate the favicon from the mascot

**Prompts:**
> generate the favicon from the mascot
> generate favicon with more padding

**Skill:** `book-installer` → `favicon-generator.md`

**What happened:**
- Confirmed `docs/img/mascot/neutral.png` now existed (1254×1254 RGBA) and Pillow was installed in the `mkdocs` conda env
- Ran `generate-favicon.py` (defaults: 8% padding, transparent background) → `docs/img/favicon.ico` (6 sizes: 16/32/48/64/128/256 px)
- Uncommented and set `theme.favicon: img/favicon.ico` in `mkdocs.yml`
- On request, regenerated with `--padding 15` for more breathing room around Scout (canvas grew from 1392×1392 to 1560×1560; content bounding box unchanged at 747×1200)
- Verified the `.ico`'s 6 embedded sizes via Pillow after each generation

---

## 9. Generate Chapter 1 content

**Prompt:**
> Run the /chapter-content-generator skill on chapter 1 @docs/chapters/01-entrepreneurship-lean-thinking/index.md

**Skill:** `chapter-content-generator` v1.10 (sequential mode, single chapter)

**What happened:**
- **Mandatory validation (Step 1.3a/1.3b):** edge direction confirmed correct (4 simple foundational concepts); reconstructed chapter membership from all 17 on-disk chapter files and confirmed **zero dependency violations** across the full 300-concept, 17-chapter structure; computed `cis_max = 202,470` (Business Idea) once for the whole book
- **Reading level:** chose **"College/University (Undergraduate) or Professional Development"** — an exact match in the skill's own reference for the course description's "Adult professional development" audience, rather than the generic Grade-10 default
- **Elaboration Budget (Step 2.3b):** 12 of Chapter 1's 13 concepts landed in Tier A (full treatment) since this chapter sits at the root of the whole dependency graph; only "Evidence-Based Decision Making" (cis=33) was Tier B. Rather than writing 12 redundant isolated examples/diagrams, used one running worked example (founder "Jordan," a mobile dog-grooming idea) plus 3 shared interactive specifications, each covering a cluster of related Tier-A concepts
- **MicroSim reuse check:** ran 3 reuse-catalog queries (4-phase pipeline, idea-trap cycle, assumption classifier); all matches scored well below the 0.60 reuse threshold (best: 0.53, wrong-subject matches) → wrote 3 fresh specifications: **The Idea Trap Cycle** (Analyze), **The Four-Phase Founder Pipeline** (Understand, step-through not animated), **Assumption Ledger Sorter** (Apply)
- **Mascot placement:** 6 admonitions (welcome self-intro, thinking, tip, warning, encourage, celebration); `validate-chapter-mascots.py` caught 2 issues on the first pass (self-intro not formatted as the required numbered list; tip admonition ran to 5 sentences) — both fixed, re-validated clean
- **Verification:** all 13 concepts confirmed present via occurrence check; TODO placeholder removed; `mkdocs build --strict` passed with exit 0 (and the earlier mascot-PNG warnings disappeared, since the user had by then supplied all 7 pose images)
- Session logged to `logs/ch-01-content-generation.md` (raw timestamps) and `logs/chapter-content-generator-2026-09-25.md` (full report)

**Result:** ~3,660-word chapter with 1 markdown table, several markdown lists, and 3 new interactive MicroSim/diagram specifications; 13/13 concepts covered.

---

## Cumulative State at End of Session

- **mkdocs build --strict:** passing, exit 0
- **Learning graph:** 300 concepts, 613 edges, 14 taxonomy categories, valid DAG
- **Chapters:** 17 designed and scaffolded; Chapter 1 has full generated content, Chapters 2–17 still carry their `TODO: Generate Chapter Content` placeholder
- **Mascot:** Scout the Fox fully designed, all 7 pose PNGs present, favicon generated
- **Cover image:** prompt written, image not yet generated (awaiting manual text-to-image step)
- **Not yet run:** glossary, FAQ, per-chapter quizzes/references, book metrics, instructor's guide, GitHub Pages deploy
