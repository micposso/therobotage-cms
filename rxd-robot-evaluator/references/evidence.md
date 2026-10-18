# Evidence and editorial review

Every included source has a unique ID, title, publisher/originator, URL, publication date (null if unknown), actual access date, provenance, independence, robot ID, relevant dimensions, context/configuration, locator, claim/observation and limitations. Evidence observations must distinguish what the source says from what the evaluator actually sees. `claimType` distinguishes `claim`, `observation`, `measurement`, and `testimonial`. The website's canonical fields are authoritative.

| Source category | Contract provenance | Use and limits |
| --- | --- | --- |
| Manufacturer documentation | manufacturer-documentation | Specifications, acquisition, intended operation; not independently observed performance. |
| Manufacturer demonstration | manufacturer-demonstration | Attributed shown behavior; selection/editing and hidden operator interventions may limit conclusions. |
| Independent reporting/research | third-party-research | Identify reporting versus study in context; inspect the underlying study and methods before treating reporting as measured evidence. |
| Independent continuous footage | independent-video | Record exact model, continuity, origin, environment, operator, edits and event locators. |
| Operator interview | operator-interview | Subjective experiences; disclose relationship, selection, recall limits and interview context. |
| Firsthand test record | firsthand-testing | Genuine recorded trials with setup, operator actions, failures and conditions. |
| Legacy editorial summary | historical-editorial | Historical context only; not substitute evidence for a new performance score. |

`independence` is `manufacturer-controlled`, `independent`, or `undisclosed`. An official manual can be reliable for a specification without being independent performance evidence. Five articles copying one release are one underlying claim, not five observations. Record shared origins in limitations and source inclusion/exclusion decisions.

## Quality

- **Low:** sparse, edited, unclear provenance/context, incomplete observations or narrow relevance.
- **Moderate:** traceable and relevant observations with useful context, but material coverage or replication limits.
- **High:** directly relevant, well-documented observations with clear provenance/conditions and reproducibility appropriate to the claim.

These are qualitative judgments, not scientific confidence values. Explain the rationale in dimension notes and limitations. Source count alone does not establish quality. Manufacturer control, participant evidence and repetition are separate considerations. Never infer negative performance from missing footage.

## Research procedure

Record the question, date, exact variant, evaluator, intended population/application and search scope. Prefer primary technical and current commercial sources; seek independent behavior evidence. Inspect original footage where possible. Never invent timestamps, quotes, test outcomes, firmware or specifications. If retrieval/video inspection is unavailable, state exactly what was and was not examined. Separate observed behavior from inference; keep contradictory claims with their provenance. A success-only demonstration cannot establish failure transparency or recovery. Participant sentiment and comprehension require real participant responses or credible research, not appearance-based guesses.

## Reproducibility and review record

Save source inclusion/exclusion decisions with reasons; freeze the applied protocol versions, conditions and analysis criteria. Where licensing permits, retain links to source captures with capture dates/hashes; do not republish copyrighted footage automatically. Keep research gaps and disagreements explicit. Never average unsupported evaluator ratings. Revisions record previous version, date, reviewer, material change and reason.

`editorial-review.md` must include:

- Robot and package IDs/version; research question/date; evaluator and AI assistance.
- Eligibility and confirmed fulfillment evidence; variant and geographic restrictions.
- Source list and inclusion/exclusion decisions; underlying duplicated sources.
- Applied protocol versions and their actual review states.
- Per-dimension findings, score/null, justification, evidence quality and gaps.
- Conflicting findings and material reviewer disagreements, unresolved rather than averaged.
- Payments, supplied hardware, relationships and manufacturer participation. Unknown is not “none.”
- Reviewer identity/date (pending until supplied), citation checks, final editorial decision and requested revisions.

Human review verifies sources exist, refer to the correct product, support the claims and have been interpreted fairly. Schema validation does not detect fabricated URLs that happen to resolve. Human approval of data is distinct from approval of protocol definitions and from permission to publish. Manufacturer participation never determines the score.

## Export and ingestion

`evaluation.json` is the full `ResearchPackageSchema` envelope. `robot.json` must match its robot exactly. The prepare-import script validates both, checks references and writes `website-package.json` exclusively (fails if it already exists). Conversion removes only `research`; robot/evaluation/evidence/revisions are unchanged and conform to `PackageSchema`. No file is moved into the published content registry. Ineligible research remains a report/draft, not an accepted index submission.

The optional robot fields are additive compatibility fields, not replacements for published profile markdown. Imagery must carry provenance; generated illustrations cannot be behavioral evidence. Localized UI labels do not change stable dimension IDs or taxonomy values. Write human summaries in the editor's language and preserve source-language evidence/quotes.
