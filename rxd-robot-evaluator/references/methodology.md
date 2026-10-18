# Methodology and canonical rules

Read `docs/rxd/methodology-v1.md`, `/rxd`, the six existing dimension definitions in `RxdDimensionsGrid.tsx`, the scorecard and the versioned protocol registry. Do not replace canonical definitions with summaries below.

| ID | Dimension | Canonical website question |
| --- | --- | --- |
| signal | Signal Clarity | Can the user understand what the robot is communicating? |
| spatial | Spatial Legibility | Can the user predict where the robot will move? |
| presence | Perceived Presence | Does the robot's voice, form, and aesthetic produce a coherent identity? |
| failure | Failure Transparency | When something goes wrong, does the robot make the problem legible? |
| fit | Interaction Fit | Does the interaction model match the context and the user's expectations? |
| recovery | Recovery Design | Can the user (or the robot) get back on track after a breakdown? |

## Assessment methods

- `research`: Research Profile. Verifiable specifications, acquisition and attributed claims; no dimension or overall scores. Does not imply testing.
- `observational`: Observational Evaluation. Documented remote/independent behavior with provenance, context, locators and limitations. Continuous footage may support observable actions; perception requires actual participant evidence.
- `hands-on`: Hands-on Evaluation. Actual firsthand testing with exact configuration/firmware, date, evaluator, participants, environment, tasks, outcomes, interventions and trial records. Secondary accounts of someone else's tests remain observational evidence for the AI researcher.

Levels are methods, never quality ranks. Missing evidence means `not-assessed` or `insufficient`, with `score: null`, never zero. An `assessed` dimension requires an integer 1–5, matching approved protocol/version, resolving references, findings, quality, justification and limitations. Store justification in `evaluatorNotes`. Unsupported quantitative recognition/time/reliability claims are forbidden.

## Current scoring stop condition

The site has 1–5 scoring with equal weighting. Known web endpoints are “1 — absent or unclear” and “5 — exemplary, no instruction needed.” The preserved PDF v2.0 describes four levels and a weighted aggregate; no approved five-point conversion exists. Draft intermediate anchors are proposals, not canonical rules. All six protocols are `1.0-draft` and await human review/piloting. **No real numerical scores may currently be generated.** Qualitative research/observational drafts can still be completed. Never mark draft protocols approved yourself.

An overall score requires six valid dimension scores, approved protocols, adequate evidence and approved human review. Pending exports deliberately contain `research.overallScore: null`; the website computes the equal-weight average after approval via `evaluationSummary`. Coverage reports two separate counts: `documented` counts dimensions with findings and source references (including attributed documentary claims); `assessed` counts dimensions with justified scores. Neither count expresses evidence quality or guarantees adequacy. Do not add fake Review/AggregateRating SEO markup.

## NIST-informed design

References reviewed 2026-10-15:

- [Standard Test Methods for Response Robots](https://www.nist.gov/el/intelligent-systems-division-73500/standard-test-methods-response-robots): common assessment procedures and observable capability measures.
- [Ground Robot Tests](https://www.nist.gov/el/intelligent-systems-division-73500/standard-test-methods-response-robots/ground-robot-tests): defined apparatus, instructions, metrics and fault conditions; comparable repeated observations.
- [Performance of Emergency Response Robots](https://www.nist.gov/programs-projects/performance-emergency-response-robots): operational capabilities and operator proficiency; controlling environmental variables.

RXD adapts procedural discipline to human experience: declare tasks and outcomes, document setup, record all successes/failures, separate operator contribution, repeat actual trials when assessing reliability, and compare equivalent conditions. Do not adopt an arbitrary trial count or claim statistical confidence without a justified study plan. Record aborted trials and interventions; one successful demonstration is not consistent performance.

RXD is independently developed and is not a NIST standard, certification or endorsement, nor an ASTM standard. The draft RXD identifiers are internal. Do not use NIST/ASTM branding or imply scientific validation.

## Historical continuity

Reachy Mini: published composite 3.0, dimension values 3/4/3/2/4/2. Unitree Go2 Pro: published composite 2.33, values 2/2/3/2/3/2. These remain historical, not recomputed or retrospectively NIST-informed. Go2's text mentions about one hour of hands-on use, but lacks a controlled trial record. Reachy's method is undocumented. Classification, evaluation date/firmware, relationships and evidence provenance require review. Preserve original markdown, imagery, scores, SEO and URLs when preparing a later version.
