# RXD platform and evaluator skill — implementation report

## Result

An additive evidence model, draft protocol library, updated Robot Index/profile methodology sections, evidence scorecard and reusable `rxd-robot-evaluator` skill. Existing six dimensions and web equal-weight 1–5 scoring remain unchanged. No new robot or real numerical evaluation has been published; no deployment or commit was performed.

## Files and components

| Area | Maintained files |
| --- | --- |
| Contract | `frontend/src/lib/rxd/schema.ts` — Zod entities, semantic validation, research envelope and guarded aggregate |
| Content registry | `frontend/src/lib/rxd/registry.ts`; `frontend/src/content/rxd/protocols.json`; `frontend/src/content/rxd/robots/{reachy-mini,unitree-go2-pro}.json` |
| Robot Index | `/robots/page.tsx`; `RobotGrid.tsx` and CSS — six filters, name/date/valid-score sort, historical labels |
| Robot profiles | `/robots/[slug]/page.tsx`, `RxdScoreModule.tsx`, `RXDEvaluation/ProfileResearch.tsx` — acquisition evidence, review status, missing scores and history |
| Methodology | `/rxd/page.tsx`, `RxdDimensionsGrid.tsx`, `RXDEvaluation/Methodology.tsx` — existing framework preserved, NIST attribution and draft protocol disclosures |
| Scorecard | `/rxd-scorecard/page.tsx`, `Scorecard.tsx`, `RXDEvaluation/EvidenceWorkspace.tsx` — evidence/trial forms and draft JSON export; existing practice export retained and labeled unreviewed |
| Shared presentation | `RXDEvaluation/RXDEvaluation.module.css` |
| Localization | `lib/i18n/rxd-es.json`, `messages.ts`, `content.ts`, Spanish catchall route; new methodology and workspace Spanish routes |
| Build correction | English layout now wraps `SiteDocument` with valid Next layout props instead of re-exporting an extra `locale` prop |
| Tooling | `frontend/scripts/rxd-runtime.mjs`, package scripts/dependencies; skill scripts generate schemas/references, validate drafts/submissions and prepare imports |
| Documentation | `docs/rxd/methodology-v1.md`, this report, skill references |

Other existing workspace changes, including the image migration and prior page designs, predate this task and were preserved.

## Model and JSON contract

`Robot`, `RXDEvaluation`, `RXDDimensionAssessment`, `RXDProtocol`, `RXDEvidence`, `RXDTrial` and `RXDRevision` are inferred from Zod. `PackageSchema` contains `schemaVersion`, `robot`, `evaluation`, `evidence`, `revisions`. `ResearchPackageSchema` adds a reproducibility envelope: research question/date, source decisions, fulfillment evidence, gaps, disagreements, editorial notes, documented/scored coverage and null draft overall score. Evidence and robot metadata extensions are additive.

Generated JSON Schema 2020-12 files live in `rxd-robot-evaluator/schemas/`. They enforce structural constraints and selected conditionals; the shared programmatic validator additionally checks references, protocol approvals, classification, score eligibility and review gates. The schema generator and Ajv tests prevent a separate contract from drifting.

`evaluation.json` is the entire research envelope; `robot.json` equals its `robot` property. `prepare-import.mjs` validates both plus companion reports, removes only `research`, and writes a new `website-package.json` with exclusive creation. Preserve the original research package/reports alongside it for editorial review. It does not insert records into the content registry or generate profile markdown. Publishing requires a separate authorized editorial change. Model IDs, dimension IDs and enums remain stable across locales.

## Six proposed protocols

| ID | Scenario | Key evidence condition |
| --- | --- | --- |
| RXD-SC-001 | Operating State Communication | State transitions and participant interpretation |
| RXD-SL-001 | Predictability of Movement | Continuous path changes and observer expectations |
| RXD-PP-001 | Human Perception of Presence | Participant accounts; no sentiment inferred from appearance |
| RXD-FT-001 | Failure Communication | Actual failure sequence and interpretation |
| RXD-IF-001 | Task Interaction Suitability | Contextual user/task evidence and accessibility limits |
| RXD-RD-001 | Recovery from Interrupted Tasks | Breakdown plus recovery attempt, including failures |

All are version `1.0-draft`, pending editorial approval and piloting. Complete field definitions and documentary/remote/firsthand boundaries are in the generated `references/protocols.md`. These are not NIST/ASTM tests or scientifically validated standards.

## Migration report

| Profile | Retained score | Preserved dimensions | Classification decision |
| --- | --- | --- | --- |
| Reachy Mini | 3.0 / 5 | 3, 4, 3, 2, 4, 2 | Historical, method not sufficiently documented |
| Unitree Go2 Pro | 2.33 / 5 | 2, 2, 3, 2, 3, 2 | Historical hands-on use reported; controlled procedures/trials absent, so no Level 3 assignment |

Original `robots-profiles/*.md`, `src/content/scores/*.md`, translated historical markdown, images, profile URLs and metadata remain unchanged. New sidecar records contain no new scores or trial data. Original evaluation dates, firmware and relationship disclosures remain unknown. Availability snapshots dated 2026-10-15 link current manufacturer product/store pages; ordering and backorder/lead-time caveats are explicit. Product ownership is separate from readiness for an application. These checks are not new performance evaluations.

## Validation results

- 25 automated tests pass: prototypes/acquisition/fulfillment gates, score range, missing and invalid references, partial aggregates, insufficient evidence, hands-on requirements, protocol/version integrity, manufacturer-only scores, synthetic exclusion, draft versus submission, coverage, JSON Schema compilation, complete synthetic test case, import/report checking and overwrite refusal.
- Both synthetic examples pass schema validation and isolated fixture semantic validation. The scored fixture uses `FIXTURE-` protocol IDs; normal ingestion intentionally rejects synthetic examples.
- Skill creator validation passes.
- TypeScript check passes.
- Production build with Webpack passes, generating 559 pages. The Turbopack attempt failed in its pre-existing Google Fonts loader; default build configuration was not changed.
- Nine English/Spanish routes checked at 1440 px and 390 px: HTTP 200, expected headings, no horizontal overflow. Manufacturer filtering and reset, multi-trial creation, evidence creation and error feedback exercised in browser. A synthetic form draft downloaded successfully; Enter opened a focused dimension disclosure; the final workspace interaction check produced no console errors.
- Original score/profile markdown has no diff. No new publication or deployment.

These are targeted checks, not a claim of full WCAG conformance or scientific validation. The original English practice canvas/PDF remains an explicitly labeled legacy tool, with its English source-language output preserved.

## Open methodology decisions

The current PDF v2.0 uses four levels while the website uses five points. No canonical five-point intermediate anchors or approved protocol evidence thresholds exist. This is an explicit stop condition for real numerical scoring. Scope differences between the PDF's consumer focus and professional robots, trial/sample plans, inter-rater calibration, and commercial re-verification cadence require editorial decisions. See `methodology-v1.md` for the full decision log. Historical evidence still needs provenance recovery.

## First live use

Invoke the skill for a narrow, exact variant and application as a Research Profile. Verify current purchase and confirmed fulfillment first, then collect independent continuous behavior evidence. Keep scores null until protocol/rubric approval. A first editorial pilot on an existing profile is useful for calibrating source traceability before adding a new robot; this implementation does not perform that evaluation.
