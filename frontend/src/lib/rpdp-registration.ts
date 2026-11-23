export const rpdpProgram = { program: 'RPDP', version: '1.0', cohort: '2027-02' } as const
export const rpdpCampaign = {
  startsAt: '2026-11-23T00:00:00-05:00',
  endsBefore: '2026-12-01T00:00:00-05:00',
  timeZone: 'America/New_York',
  discount: 20,
} as const

export const rpdpPrices = { professional: 299, student: 149 } as const
export const rpdpAudiences = ['professional', 'student'] as const
export const rpdpInterests = ['design', 'product', 'research', 'other'] as const
export const rpdpSources = ['/learn/rpdp', '/es/learn/rpdp'] as const
export const utmFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_id', 'utm_term', 'utm_content'] as const
export type RpdpQuery = Partial<Record<typeof utmFields[number], string | string[]>>

export function isRpdpPromotionActive(timestamp = Date.now()) {
  return timestamp >= Date.parse(rpdpCampaign.startsAt) && timestamp < Date.parse(rpdpCampaign.endsBefore)
}

export function foundingPrice(plannedPrice: number) {
  return Math.round(plannedPrice * (100 - rpdpCampaign.discount)) / 100
}
