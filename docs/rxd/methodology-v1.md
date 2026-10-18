# RXD evaluation methodology 1.0 — editorial specification

## Audit and compatibility

The live index reads `robots-profiles/*.md`; legacy ratings come from `src/content/scores/*.md`. `lib/robots.ts` is a separate news collection and is not the commercial index. English and Spanish profiles share route components; Spanish content uses the translation catalog. Existing profile files, rating files, image URLs, metadata and PDF remain intact.

The live scorecard uses integer scores 1–5, equal weights, and the arithmetic mean of six dimensions. Its only general endpoint anchors are “1 — absent or unclear” and “5 — exemplary, no instruction needed.” The downloadable RXD v2.0 PDF instead specifies four levels (section 5.2), a weighted aggregate without explicit weights, direct observation, and consumer scope. Appendix A supplies behavioral criteria and evidence prompts, not an approved conversion to five levels. These conflicting artifacts MUST NOT be silently reconciled. Keep the web scale/weights and original PDF; protocol scoring remains draft pending editorial review. Methodology 1.0 is a separate evaluation record version, not a replacement for framework v2.0.

## Eligibility

Only released physical products with an identifiable manufacturer, a defined function involving people, and verified outright acquisition qualify. Direct purchase, authorized retail/distribution, formal enterprise quotations and authorized integrators qualify. Exclude concepts, prototypes, unshipped crowdfunding, announcements alone, simulations and fleet-only services. Verify the exact variant against current purchase evidence, record source/access date, region and prerequisites. A purchasable development kit can qualify without being deployment ready. Previously eligible products may remain explicitly archived or temporarily unavailable; never advertise them as currently purchasable. Unverified new entries remain outside the index.

## Evidence and methods

Research Profile (Level 1): sourced product description; no performance scores. Observational Evaluation (Level 2): contextual evidence of behavior; physical access not implied. Hands-on Evaluation (Level 3): documented firsthand tasks, configuration, firmware, participants, environment, date, successes, failures, interventions and trial records. Levels describe evidence collection, not quality. Legacy assessments with missing provenance are unclassified historical records, not automatically Level 1, 2 or 3.

Each dimension needs traceable references, observed findings, limitations, evidence quality and method. Separate manufacturer claims from independent observations. Promotional footage alone is not an independent score. Record continuity/timestamps, editing, configuration, operator role and environment. Failure/recovery need actual breakdown evidence. Presence and comprehension claims need participant evidence; appearance alone cannot establish them. Missing evidence is not poor performance. Low/moderate/high quality is a qualitative evidence assessment, never an invented confidence percentage.

## NIST-informed procedure design

NIST's methods motivate defined apparatus/setup, task instructions, observable metrics and explicit faults. RXD adapts these procedural ideas to human interpretation and interaction. Document environment, control variables and disclose changes before comparing models. Separate operator skill/intervention from robot behavior. Predefine outcomes and repeat actual trials when studying reliability; report every attempted trial, including aborted attempts. Do not infer recognition times, rates or reliability from marketing or one success. Sample sizes and statistical claims need a study-specific justified analysis plan; no universal NIST sample size is adopted here.

References, accessed 2026-10-15:
- https://www.nist.gov/el/intelligent-systems-division-73500/standard-test-methods-response-robots — capability measurement and common test procedures.
- https://www.nist.gov/el/intelligent-systems-division-73500/standard-test-methods-response-robots/ground-robot-tests — apparatus, procedure, metric, fault conditions; repeatability across settings.
- https://www.nist.gov/programs-projects/performance-emergency-response-robots — controlled variables, repeated testing and separate operator proficiency.

The Robot Age's RXD evaluation methodology incorporates principles of repeatable testing, observable performance measures, and evidence-based assessment informed by the National Institute of Standards and Technology (NIST) Standard Test Methods for Response Robots. RXD is an independently developed human-robot experience framework and is not a NIST standard, certification, or endorsement. It does not establish ASTM compliance.

## Scoring and publication

Preserve the six named dimensions and 1–5 web scores. Null means no justified score; never coerce null to zero. Overall scores require all six assessed dimensions, approved applicable protocols, adequate evidence and human approval. Partial observations and coverage are useful without a composite. No new scores are published by this migration. All protocol definitions are internal drafts. Existing scores remain historical, excluded from current-score sorting. Import validation cannot attest to truth; a named human must inspect source evidence and conflicts before publication. AI-produced packages must enter as pending review. No import automatically publishes.

## Independence and revisions

Disclose payments, supplied hardware, manufacturer relationships and participation for every new evaluation. Unknown historical relationships remain unknown. Manufacturer participation never controls the score. Preserve prior versions; record date, reviewer, reason and material change. Software changes and new evidence may warrant reassessment, not silent overwriting.

## Decisions requiring editorial review

1. Reconcile four-level PDF with five-point web scale; approve intermediate anchors per dimension without altering existing definitions or weights.
2. Approve/pilot the six draft protocols, population sampling, minimum observation breadth, repeat-trial plans and inter-rater calibration.
3. Resolve professional robot scope versus the PDF's consumer-only scope.
4. Recover original evaluation dates, firmware, evaluator identities, evidence and relationship disclosures for both historical profiles.
5. Choose a commercial re-verification cadence and regional availability policy. The migration records a dated snapshot, not perpetual stock assurance.

Visual thesis: retain the restrained Robot Age editorial typography, red accents and existing robot photography. Content plan: product-led index, filters, commercial evidence, historical evaluation, methodological detail. Interaction thesis: native filter feedback and keyboard-operable evidence disclosures, existing image hover with reduced-motion support. No new image generation is needed.
