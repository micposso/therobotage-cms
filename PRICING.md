# Robot Deployment Academy pricing history

This is the decision and experiment log for The Robot Age's Academy-as-a-Service pricing. Keep previous entries intact and append each adjustment, including changes to allowances, contract terms, positioning, or build fees. Record corrections explicitly rather than rewriting the historical rationale.

Last updated: **2026-10-19**. Current model: **ACADEMY-002**.

Status: **publication verified on 2026-10-19** on the live English and Spanish `/enterprise` pages. Published prices, allowances, and terms match ACADEMY-002 and the local implementation. The original deployment date, deployment commit, customer exposure counts, and commercial results remain unverified. No A/B test has run or established a winning price.

## Current model — ACADEMY-002

All amounts are USD. Basic and Growth have a 12-month subscription after launch, billed monthly, plus a one-time build fee. First-year totals mean twelve subscription months plus the build, before taxes, travel, and extras. Paid pilots are separately scoped and priced.

| Plan | Monthly subscription | One-time build | First-year total |
| --- | ---: | ---: | ---: |
| Basic | $1,490 | $7,500 | $25,380 |
| Growth | $3,490 | $15,000 | $56,880 |
| Enterprise | Custom quote | Custom quote | Custom annual agreement |

### Included scope at this version

| Allowance | Basic | Growth |
| --- | --- | --- |
| Robot products / customer sites | 1 / 3 | 2 / 15 |
| Monthly active learners | 100 | 500 |
| Delivery platform | Branded hosted portal | Branded portal or one compatible LMS content-delivery route |
| Initial learning content | 2 modules, up to 30 minutes total | 6 modules, up to 90 minutes total |
| Finished video | Up to 12 minutes, within learning allowance | Up to 30 minutes, within learning allowance |
| Languages | English or Spanish | English and Spanish for included content |
| Learning pathways and assessment | Operator/supervisor pathways, knowledge checks, practical observation checklist | Role/site pathways, practical assessments, supervisor reporting |
| Monthly service allocation | 4 hours; quarterly results review | 10 hours; monthly operating review |

Service hours cover delivery, support, reviews, and updates combined. Initial builds include two review rounds and require customer-approved procedures, subject-matter access, and usable footage. Monthly active learners are unique learners accessing training during the month; archived learners do not count.

Mobile web access is included. Bespoke LMS development, custom native apps, on-location filming, animation, new modules, major revisions, additional capacity, and specialist safety/privacy review are separately scoped. Customer LMS licenses remain the customer's responsibility. SSO, APIs, CRM exchange, and automated enrollment are not standard integrations included in Growth. Platform capacity and compatibility must be confirmed before contracting.

Enterprise scopes robot/site/learner allowances, multiple portals or customer LMS delivery, personalized onboarding, content and localization roadmaps, integrations, service allocation, and governance individually. No unvalidated starting price is advertised.

## Adjustment history

### ACADEMY-001 — Initial published-page model — 2026-10-18

Status: initial local implementation; not a measured market baseline. Implementation commit: `13ccd95`.

| Plan | Monthly subscription | One-time build | First-year total |
| --- | ---: | ---: | ---: |
| Basic | $1,990 | $7,500 | $31,380 |
| Growth | $4,990 | $20,000 | $79,880 |
| Enterprise | Custom quote | Custom quote | Custom annual agreement |

Rationale: separate the initial robot-specific content and portal build from ongoing managed learning delivery. Offer a smaller launch package, a multi-site bilingual package, and a custom enterprise program. Make scope, service-hour limits, and exclusions visible rather than promising unlimited work.

Evidence limits: these were proposed commercial rates, not validated willingness-to-pay, measured delivery costs, or customer outcome data. No experiment results or production exposure are recorded.

### ACADEMY-002 — Competitive entry-point adjustment — 2026-10-18

Trigger: request to research the rates and make the offer more competitive.

| Change | Basic | Growth |
| --- | ---: | ---: |
| Monthly subscription | $1,990 → $1,490 | $4,990 → $3,490 |
| Build fee | $7,500 → $7,500 | $20,000 → $15,000 |
| First-year total | $31,380 → $25,380 | $79,880 → $56,880 |
| First-year reduction | $6,000 / 19.1% | $23,000 / 28.8% |

Enterprise remains custom. Included scope and twelve-month terms were retained. Page copy now emphasizes robot-specific training, a branded learning portal, managed onboarding support, and reuse across customer deployments.

Rationale: software alone is inexpensive relative to a managed service. The offer must earn its premium through content creation and ongoing workforce support. Lower recurring fees reduce the entry barrier, while retaining a separate build budget avoids concealing substantial initial production work. Growth's lower build fee reduces its larger initial commitment without removing bilingual content.

Hypothesis, not a result: a lower first-year commitment and clearer managed-service value will improve qualified sales conversion while maintaining viable delivery economics. Because both prices and copy changed, this revision is not a controlled price-only A/B test.

Validation: targeted lint, TypeScript, and five enterprise tests passed; English desktop/mobile browser checks confirmed updated prices and no horizontal overflow. This validates implementation, not commercial performance. Production deployment, exposure counts, conversion, sales, and actual margins remain unrecorded.

### ACADEMY-002 — Published-page reconciliation — 2026-10-19

This is a publication-status correction, not a new commercial offer or experiment. The previous entries retain their status as known on 2026-10-18. ACADEMY-001's heading “Initial published-page model” describes the initial page implementation; it does not prove those earlier rates were ever live.

Sources checked directly: [English Enterprise page](https://therobotage.com/enterprise) and [Spanish Enterprise page](https://therobotage.com/es/enterprise). Both returned HTTP 200 on 2026-10-19. Directly retrieved page content was used because the search service returned an older cached English page without Academy pricing. Local comparison: English `content.ts`, Spanish `enterprise-es.json`, and the ACADEMY-002 implementation in commit `cd898b9`; this is a source reference, not a verified production deployment SHA.

| Plan | Previous local offer (ACADEMY-001) | Published offer, EN and ES | First-year change | Match to ACADEMY-002 |
| --- | --- | --- | --- | --- |
| Basic | $1,990/month + $7,500 build; $31,380 first year | $1,490/month + $7,500 build; $25,380 first year | $6,000 lower (19.1%) | Matches |
| Growth | $4,990/month + $20,000 build; $79,880 first year | $3,490/month + $15,000 build; $56,880 first year | $23,000 lower (28.8%) | Matches |
| Enterprise | Custom build and service quote; custom annual agreement | Custom build and service quote; custom annual agreement | Unchanged; no numeric starting price | Matches |

Published scope also matches the current model above: Basic includes 1 robot product, 3 sites, 100 monthly active learners, 2 modules/30 learning minutes, 12 video minutes, one of English or Spanish, and 4 service hours/month. Growth includes 2 products, 15 sites, 500 learners, 6 modules/90 learning minutes, 30 video minutes, English and Spanish, and 10 service hours/month. Portal/LMS options, assessment/reporting, review cadence, two initial review rounds, and separately scoped integrations remain consistent. Both languages retain the 12-month subscription after launch, monthly billing, separate build fee, exclusions, and separately priced paid pilot.

Pricing logic carried into the published offer:

- **Basic lowers the recurring entry barrier:** $500/month less (25.1%), with the $7,500 build unchanged to fund the initial robot-specific content and launch work. Calculation: $1,490 × 12 + $7,500 = $25,380.
- **Growth lowers both recurring and upfront commitment:** $1,500/month less (30.1%) and $5,000 less for the build (25.0%). Calculation: $3,490 × 12 + $15,000 = $56,880. The $23,000 first-year reduction combines $18,000 in subscription savings and $5,000 in build savings, while preserving bilingual delivery and existing allowances.
- **The premium pays for a bounded managed service:** robot-specific content, onboarding, and ongoing support accompany the platform. The dated adjacent-provider research below supports that positioning; it does not validate demand or profitability. Lower prices make actual delivery-cost tracking more important because scope was retained.
- **Enterprise remains scoped:** portfolios, integrations, localization, governance, and delivery requirements vary too much to support an unvalidated public starting price.

Decision: retain ACADEMY-002; no pricing or website code change is needed to reconcile the published offer. Correct the documentation's publication status and preserve the earlier rationale. Publication confirms availability of the offer, not customer exposure, conversion gains, viable margins, or a winning experiment. The older implementation memo's “not deployed” statement is historical and is superseded by this dated production check.

## Research behind ACADEMY-002

Vendor pages reviewed on **2026-10-18**. These are adjacent benchmarks, not identical robotics offerings or a representative market average. Recheck before using them in a future decision; do not overwrite this dated snapshot.

| Source | Public price at review | Relevance and limits |
| --- | --- | --- |
| [LearnWorlds](https://www.learnworlds.com/pricing/) | Learning Center: $299/month monthly or $249/month billed annually | Software, including white-label functionality, 2,000 active learners, up to 10 client groups, and two hours setup help. Does not establish the cost of managed robotics training. Ten client groups do not establish compatibility with Growth's fifteen customer sites. |
| [FSW Learn](https://learn.firstsourceworld.com/pricing/) | Digitization from $2,500/course; standard from $5,000/course; premium from $10,000/course; content retainer from $2,500/month | Content production anchor; course complexity differs and platform fees are separate. Its retainer wording does not establish a monthly labor-hour allowance. |
| [Pivto](https://www.pivto.com/learningservice) | LaaS One: $11,000/month | Healthcare instructional-design service with one active request, unlimited queue/revisions, and no video. Broader production scope than our capped monthly hours. |

Original research memo: [docs/enterprise-pricing-research.md](docs/enterprise-pricing-research.md).

### Economic assumptions to validate

At an illustrative 50% gross-margin target, recurring direct-cost ceilings are $745/month for Basic and $1,745/month for Growth. Initial build ceilings are $3,750 and $7,500. This is a planning scenario, not an approved margin target or measured profitability.

Include platform licensing, delivery labor, localization, support, and attributable production costs. Track sales/acquisition expenses separately when evaluating contribution and payback. Confirm tenant isolation, external-customer licensing, reporting, and actual service capacity. If delivery cannot fit the budget, revise the offer explicitly or scope Enterprise; do not silently remove promised services.

## Future A/B tests and adjustment records

Use a new model ID for every changed commercial offer and a separate experiment ID for each test. An unlaunched proposal is not a treatment exposure. Preserve both variants and their exact copy, prices, scope, terms, and deployment versions.

For a valid comparison, assign variants consistently at the company/account level where feasible, so colleagues do not receive conflicting offers. Record assignment and exposure rules before launch. If randomized testing is impractical at low sales volume, label sequential pricing trials as observational; traffic mix, seasonality, and sales follow-up can explain differences.

Choose one primary outcome and a fixed measurement window before launch. Prefer signed paid agreements per eligible exposed account, with a window appropriate to the sales cycle. Briefing requests and qualified opportunities are useful earlier signals, but are not revenue. Monitor first-year contracted revenue per exposed account, estimated contribution, discounting, sales-cycle length, and delivery effort so a conversion increase does not conceal worse economics.

Set sample-size and decision rules from actual baseline data before starting. Do not invent a sample target or declare a winner from a few leads. Where volume is insufficient, document uncertainty and qualitative objections instead of claiming significance. Keep individual lead/customer data in the existing business systems; record aggregates here.

Copy this template for each experiment or subsequent adjustment:

```markdown
### ACADEMY-00X / EXP-00X — Descriptive title

- Recorded date:
- Owner:
- Status: proposed / running / stopped / inconclusive / adopted / rejected
- Prior model and new model:
- Hypothesis and reason for change:
- Evidence/source URLs and access dates:
- Control: exact prices, build fees, scope, terms, copy, commit
- Treatment: exact prices, build fees, scope, terms, copy, commit
- Production start/end dates and deployment references:
- Audience, geography, currency, exclusions, and traffic sources:
- Assignment unit, allocation, persistence, and exposure definition:
- Primary metric, denominator, and conversion window:
- Secondary metrics and economic guardrails:
- Baseline, sample-size rationale, minimum run period, and stopping rule:
- Other simultaneous changes or confounders:
- Exposed accounts / qualified opportunities / signed customers by variant:
- Contracted revenue, discounts, delivery cost estimates, and observation maturity:
- Results and uncertainty:
- Decision and rationale:
- Follow-up date and next question:
```

## Implementation references

- English pricing and allowances: `frontend/src/app/(english)/enterprise/content.ts`
- Spanish translations: `frontend/src/lib/i18n/enterprise-es.json`
- Rendering and plan CTAs: `frontend/src/app/(english)/enterprise/page.tsx`
- Implementation notes: `docs/enterprise-implementation.md`

When prices change, update both languages, recompute first-year totals, record any scope/term changes here, and distinguish code completion from production launch. This log does not itself implement variant assignment or analytics.
