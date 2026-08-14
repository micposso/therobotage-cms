import taxonomy from '../../jobs/taxonomy.json'

// The JSON file is the single source of truth, shared with scripts/publish-jobs.mjs so
// the validator and the UI cannot drift. Everything below is typing and lookup sugar.

export type RoleFamily = { slug: string; label: string; blurb: string }
export type Seniority = { slug: string; label: string }
export type EmploymentType = { slug: string; label: string; schema: string }
export type RemoteType = { slug: string; label: string }
export type UsState = { code: string; name: string; slug: string }

export const ROLE_FAMILIES: RoleFamily[] = taxonomy.roleFamilies
export const SENIORITIES: Seniority[] = taxonomy.seniorities
export const EMPLOYMENT_TYPES: EmploymentType[] = taxonomy.employmentTypes
export const REMOTE_TYPES: RemoteType[] = taxonomy.remoteTypes
export const US_STATES: UsState[] = taxonomy.states

function toLabelMap<T extends { label: string }>(
  items: T[],
  key: (item: T) => string
): Record<string, string> {
  return Object.fromEntries(items.map((item) => [key(item), item.label]))
}

export const ROLE_FAMILY_LABELS = toLabelMap(ROLE_FAMILIES, (r) => r.slug)
export const SENIORITY_LABELS = toLabelMap(SENIORITIES, (s) => s.slug)
export const EMPLOYMENT_TYPE_LABELS = toLabelMap(EMPLOYMENT_TYPES, (e) => e.slug)
export const REMOTE_TYPE_LABELS = toLabelMap(REMOTE_TYPES, (r) => r.slug)
export const STATE_NAMES = toLabelMap(
  US_STATES.map((s) => ({ ...s, label: s.name })),
  (s) => s.code
)

// schema.org employmentType values, for the JobPosting JSON-LD.
export const EMPLOYMENT_TYPE_SCHEMA: Record<string, string> = Object.fromEntries(
  EMPLOYMENT_TYPES.map((e) => [e.slug, e.schema])
)

export const ROLE_FAMILY_SLUGS = ROLE_FAMILIES.map((r) => r.slug)
export const SENIORITY_SLUGS = SENIORITIES.map((s) => s.slug)
export const EMPLOYMENT_TYPE_SLUGS = EMPLOYMENT_TYPES.map((e) => e.slug)
export const REMOTE_TYPE_SLUGS = REMOTE_TYPES.map((r) => r.slug)
export const STATE_CODES = US_STATES.map((s) => s.code)

// Ordered ladder, used by the related-roles adjacency score.
export const SENIORITY_ORDER = SENIORITY_SLUGS

export function roleFamilyLabel(slug: string): string {
  return ROLE_FAMILY_LABELS[slug] ?? slug
}

export function roleFamilyBySlug(slug: string): RoleFamily | undefined {
  return ROLE_FAMILIES.find((r) => r.slug === slug)
}

export function stateBySlug(slug: string): UsState | undefined {
  return US_STATES.find((s) => s.slug === slug)
}

export function stateByCode(code: string): UsState | undefined {
  return US_STATES.find((s) => s.code === code)
}
