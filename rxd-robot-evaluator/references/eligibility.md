# Commercial eligibility

An eligible new entry is a released, physical robot offered for outright purchase, with a manufacturer, exact model/variant, meaningful interaction with people and a defined physical function. Confirm both acquisition and actual commercial fulfillment. A preorder button or announcement is insufficient. A released product accepting backorders may qualify when prior fulfillment is documented; record lead times without implying immediate stock.

Accepted `acquisition.channel` values are `manufacturer`, `retailer`, `distributor`, `enterprise-quotation`, and `integrator`. Verify authorization for intermediary sellers through manufacturer listings or direct documentary confirmation. Do not buy anything to verify eligibility.

Exclude prototypes, staged technology concepts, research machines not sold, fleet-only service offerings, simulations, unreleased announcements and preorders without confirmed fulfillment. Discontinued models lacking current acquisition are not new eligible entries. Existing discontinued profiles may remain archived for historical continuity.

## Website taxonomies

| Stored availability | Public label |
| --- | --- |
| purchase | Available for purchase |
| quotation | Available by enterprise quotation |
| temporary | Temporarily unavailable |
| unverified | Availability unverified |
| archived | Discontinued / archived |

| Stored deployment | Public label |
| --- | --- |
| consumer | Consumer ready |
| commercial | Commercial deployment ready |
| integration | Integration required |
| developer | Developer/research platform |

Turnkey operation must be documented for the specified application. Programming, system integration, operator training or supervision belong in prerequisites. A purchasable developer platform is eligible without being a turnkey deployment. Neither purchase nor deployment category proves safety certification, autonomy or suitability for a site.

Record manufacturer, model, variant, product-page evidence, purchase channel/URL, region/restrictions, access/verification date, stock caveats and fulfillment references. The schema stores these in `robot`, `robot.acquisition`, package `evidence`, and `research.fulfillmentEvidenceIds`. Specifications may be null or omitted; never invent placeholder values. `research.fulfillmentConfirmed` is a claim requiring human citation verification, not proof by itself.

If unconfirmed, use `unverified` and produce a pending-verification report with null/empty acquisition fields. Draft website validation can represent this state, but the skill's submission validator correctly rejects it for index ingestion. Never weaken the claim to make an ineligible entry pass.
