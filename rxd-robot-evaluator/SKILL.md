---
name: rxd-robot-evaluator
description: Research commercial robot eligibility and prepare evidence-based RXD profiles, comparisons, or reassessment drafts for The Robot Age. Use for Robot Index research and evaluation requests; never publishes automatically.
---

# RXD Robot Evaluator v1.0

Produce a traceable, editor-readable research package using the website's contract. Do not imply physical access or invent observations. This skill prepares drafts; it does not publish, deploy, purchase a robot, or overwrite an existing evaluation.

## Start from the project

Locate `frontend/src/lib/rxd/schema.ts`, `frontend/src/content/rxd/protocols.json`, `docs/rxd/methodology-v1.md`, and the existing profile/score markdown. These are authoritative; generated schemas in this skill are export artifacts, not another methodology. Run commands below from the repository root after `npm ci`, with Node 22.12 or newer (the TypeScript tests use Node's type-stripping flag). If used outside the repository, obtain that versioned checkout; do not substitute guessed types. See [methodology](references/methodology.md) for known conflicts.

## Workflow

1. **Identify:** establish manufacturer, exact model/variant and intended application. Use a stable lowercase hyphenated ID. Distinguish Pro/EDU, hardware generations, software and region. Inspect an existing record before reevaluation.
2. **Verify eligibility:** read [eligibility](references/eligibility.md). Check current purchase and confirmed fulfillment evidence. Keep acquisition and deployment readiness separate. If unverified, save findings and gaps; do not submit an eligible profile.
3. **Research:** collect technical documentation, original demonstrations, independent deployment evidence, interviews and relevant studies. Record what was actually accessible. Follow [evidence](references/evidence.md), including source inclusion/exclusion decisions and duplicate-origin checks.
4. **Classify evidence:** distinguish claims, observations, testimonials and measurements, with exact source locators. Attribute manufacturer-controlled material. Never invent video timestamps or represent a transcript as visual inspection.
5. **Choose method:** Research Profile for sourced information without performance scores; Observational Evaluation for contextual behavioral evidence; Hands-on Evaluation only for genuine documented firsthand testing. Method is not robot quality. Preserve unclassified legacy evaluations.
6. **Apply protocols:** read [protocols](references/protocols.md) for relevant dimensions and evidence mode. Use repository protocol IDs and versions. Record findings, limitations, evidence quality and gaps for all six dimensions.
7. **Gate scoring:** use only approved protocols and existing anchors. All current protocols are drafts; real numerical scoring is therefore blocked. Leave scores null, even when qualitative observations are useful. Do not promote a protocol or borrow synthetic fixture approvals to bypass this gap. Coverage and quality are separate from score.
8. **Produce:** save `output/<canonical-id>/v<version>/robot.json`, `evaluation.json`, `evidence.md`, `editorial-review.md`, and `research-summary.md`. The root may contain a non-overwriting pointer to the latest version. `evaluation.json` is the complete research package, including robot and evidence; `robot.json` is its identical `robot` object. Follow the generated [robot schema](schemas/robot.schema.json) and [package schema](schemas/evaluation.schema.json). Include plain-language eligibility findings, assessment limitations, gaps and review checklist. Use `research.synthetic: false`, review states `pending`, null reviewer/date and null overall score. Disclose AI assistance.
9. **Validate:** run `node rxd-robot-evaluator/scripts/validate.mjs output/<id>/v<version>/evaluation.json --draft` for incomplete research. When acquisition and fulfillment are verified, run again without `--draft` for submission validation. Only then use `scripts/prepare-import.mjs <directory>` to validate the companion robot/reports and create a new, non-publishing website package. Keep the complete evaluation and reports with it; they retain research gaps and source decisions. Fix structural/reference errors; never change evidence merely to satisfy validation. Validation checks consistency, not source truth.
10. **Request editorial review:** report evidence gaps and unresolved disagreements; ask a human editor to inspect citations, variant matching, findings, disclosures and scoring eligibility. Record reviewer identity, decision and material changes in a new revision. Keep outputs pending until explicitly approved. Approval does not authorize automatic publication.

## Reproducibility and tooling

Use the same question, scenario, configuration and evidence criteria when comparing models; document differences instead of ranking incomparable records. Repeated trials require actual records of every attempt, environment and intervention. Do not average unsupported disagreements. Follow the review procedure in [evidence](references/evidence.md).

Commands:

```sh
npm run rxd:test --workspace frontend
node rxd-robot-evaluator/scripts/generate-schemas.mjs
node rxd-robot-evaluator/scripts/validate.mjs <evaluation.json>
node rxd-robot-evaluator/scripts/prepare-import.mjs <draft-directory>
```

The two [examples](examples/) are explicitly synthetic. The observational fixture uses `FIXTURE-` protocol IDs solely to test scoring guards. `--fixtures` is restricted to bundled examples; it is never an ingestion flag. Normal validation rejects synthetic data. When retrieval or video tools are unavailable, state the limitation and leave the affected assessment unscored. Store any new website imagery in R2 according to the project's image policy; generated illustrations are never evidence of robot behavior.
