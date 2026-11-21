export const policyJurisdictions = {
  NY: 'New York',
  NJ: 'New Jersey',
  CT: 'Connecticut',
  FEDERAL: 'Federal',
} as const

export const policyStatuses = {
  proposed: 'Proposed',
  in_committee: 'In Committee',
  passed_legislature: 'Passed Legislature',
  enacted: 'Signed/Enacted',
  effective: 'Effective',
  repealed: 'Repealed',
  guidance: 'Guidance',
} as const

export const policyCategories = [
  'Delivery Robots',
  'Cleaning Robots',
  'Security Robots',
  'Building Operations',
  'Parking & Mobility',
  'Workplace Safety',
  'Privacy & Surveillance',
] as const

export type PolicyJurisdiction = keyof typeof policyJurisdictions
export type PolicyStatus = keyof typeof policyStatuses
export type PolicyCategory = (typeof policyCategories)[number]

export interface RobotPolicy {
  id: string
  slug: string
  title: string
  identifier?: string
  jurisdiction: PolicyJurisdiction
  locality?: string
  status: PolicyStatus
  category: PolicyCategory
  summary: string
  publishedAt?: string
  updatedAt?: string
  effectiveAt?: string
  lastVerifiedAt: string
  sourceName: string
  sourceUrl: string
  policyType: 'legislation' | 'regulation' | 'guidance' | 'standard'
}

export type PolicyFilters = {
  query: string
  jurisdiction: PolicyJurisdiction | ''
  status: PolicyStatus | ''
  category: PolicyCategory | ''
}

export const emptyPolicyFilters: PolicyFilters = {
  query: '',
  jurisdiction: '',
  status: '',
  category: '',
}

const searchWords = (value: string) => value.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []

export function filterRobotPolicies(policies: readonly RobotPolicy[], filters: PolicyFilters) {
  const words = searchWords(filters.query)
  return policies.filter((policy) => {
    if (filters.jurisdiction && policy.jurisdiction !== filters.jurisdiction) return false
    if (filters.status && policy.status !== filters.status) return false
    if (filters.category && policy.category !== filters.category) return false
    if (!words.length) return true

    const searchable = searchWords([
      policy.title,
      policy.identifier,
      policy.summary,
      policy.jurisdiction,
      policyJurisdictions[policy.jurisdiction],
      policy.locality,
      policy.category,
    ].join(' '))

    return words.every((word) => searchable.some((term) => term.startsWith(word)))
  })
}
