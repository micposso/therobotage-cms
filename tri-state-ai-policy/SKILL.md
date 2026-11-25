---
name: tri-state-ai-policy
description: Research New York, Connecticut, and New Jersey state or local AI policy and add or refresh verified cards on The Robot Age's /policy page. Use for a named measure, a regional policy search, or a status update to an existing card.
---

# Tri-state AI policy

Work in the `therobotage-cms` checkout. For a named measure, follow it from the official record through to its card on `/policy`. For an open-ended request, search across the requested jurisdictions and favor measures with a concrete effect on how AI or robots are developed, purchased, or used. Honor requests for research only.

## Find and verify the measure

Start with the issuing authority. Search by bill number and session when known. For discovery, also use the terms lawmakers use, such as "automated decision system," "biometric identification," or "autonomous vehicle."

| Jurisdiction | Starting point |
| --- | --- |
| New York | [Senate bills and laws](https://www.nysenate.gov/legislation) |
| Connecticut | [General Assembly bill information search](https://www.cga.ct.gov/asp/CGABillInfo/CGABillInfoRequest.asp) |
| New Jersey | [Legislature bill search](https://www.njleg.state.nj.us/bill-search) |
| Local measures | Use the issuing city or county's legislative record, adopted code, or agency rules. For NYC, start with [City Council legislation](https://legistar.council.nyc.gov/Legislation.aspx). |

Open the measure itself. Read the operative section in the latest applicable version and check the official action history. For adopted measures, follow the law, rule, or ordinance through subsequent amendments and effective-date clauses. For agency guidance, read the issuing agency's document. News and trackers can supply leads.

Establish the session and identifier, geographic reach, covered actors and uses, material exceptions, and what the measure would change or already requires. Distinguish a single chamber's vote from final passage, enactment from the date a provision takes effect, and agency advice from a binding rule. For phased laws, describe the provision and date relevant to the card. If sources conflict, resolve the discrepancy against the controlling text and latest official action. If status or scope remains uncertain, report the specific gap and hold that card.

## Add or refresh the card

1. Read `frontend/src/lib/robotPolicy.ts` for the current `RobotPolicy` contract, then inspect `frontend/src/lib/robotPolicyRecords.ts`. Search existing entries by jurisdiction, locality, session, title, bill number, companion bill, and enacted citation. Update an existing record for the same measure in place, preserving its `id` and `slug`. Give a distinct measure its own stable, unique values. Bill numbers can recur across sessions.
2. Add or edit the typed entry in `robotPolicyRecords.ts`. The English policy route already passes this collection to the directory and overview. For a municipal measure, use its state as `jurisdiction` and name the municipality in `locality`.
3. Write a short title and a plain-language summary of who is covered, what conduct is affected, and any condition that materially narrows coverage. Use "would" for a proposal. Use the status, category, policy type, and robot types supported by the record. Show a robotics connection only when the covered activity supports it. For a requested general AI measure, inspect the filter and card consumers if the taxonomy lacks a truthful fit. Make the smallest necessary addition so readers can find the card and its labels accurately describe it.
4. Set `sourceName` and `sourceUrl` to the issuing authority and its direct measure-specific page or document. Use ISO calendar dates (`YYYY-MM-DD`). Set `lastVerifiedAt` on the individual record to the day you checked the sources. Changing the shared `verifiedOn` value would redate other entries. Include optional action and effective dates only when the official record supports them.

## Verify the page

Run `npm run typecheck` from `frontend`. Open the local `/policy` page, search by the identifier or title, and apply the jurisdiction and status filters. Confirm the intended card appears once, the status and dates match the research, and "View Official Source" opens the supporting measure. Report the card added or refreshed, its verified status and as-of date, and the official link. Describe local edits as local until a deployment has been requested and verified.
