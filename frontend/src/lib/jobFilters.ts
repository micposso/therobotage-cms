import type { JobCard } from './jobs'

// One module owns URL <-> state <-> predicate for the job board, so the client
// explorer, the SEO landing routes and the alert-preference form cannot drift apart.
//
// Multi-select facets encode as comma-separated values (?role=perception-ml,controls-motion)
// rather than repeated params: shorter, pasteable, and trivially split.

export type JobFilters = {
  q: string
  role: string[]
  level: string[]
  state: string[]
  remote: string[]
  type: string[]
  pay: string
  posted: string
  company: string
}

export const emptyFilters: JobFilters = {
  q: '',
  role: [],
  level: [],
  state: [],
  remote: [],
  type: [],
  pay: 'any',
  posted: 'any',
  company: 'all',
}

export const MULTI_KEYS = ['role', 'level', 'state', 'remote', 'type'] as const

// Guards a pasted URL from turning into an unbounded IN clause or an unreadable UI.
const MAX_VALUES_PER_KEY = 8

export const PAY_OPTIONS = [
  { value: 'any', label: 'Any pay' },
  { value: 'disclosed', label: 'Salary disclosed' },
  { value: '100k', label: '$100k+' },
  { value: '150k', label: '$150k+' },
  { value: '200k', label: '$200k+' },
  { value: '250k', label: '$250k+' },
]

export const POSTED_OPTIONS = [
  { value: 'any', label: 'Any time' },
  { value: '3d', label: 'Last 3 days' },
  { value: '7d', label: 'Last 7 days' },
  { value: '14d', label: 'Last 14 days' },
  { value: '30d', label: 'Last 30 days' },
]

const POSTED_DAYS: Record<string, number> = { '3d': 3, '7d': 7, '14d': 14, '30d': 30 }
const PAY_FLOORS: Record<string, number> = {
  '100k': 100000,
  '150k': 150000,
  '200k': 200000,
  '250k': 250000,
}

type ParamSource = URLSearchParams | Record<string, string | string[] | undefined>

function readParam(source: ParamSource, key: string): string {
  if (source instanceof URLSearchParams) return source.get(key) ?? ''
  const value = source[key]
  if (Array.isArray(value)) return value[0] ?? ''
  return value ?? ''
}

function splitValues(raw: string, allowed: readonly string[]): string[] {
  if (!raw) return []
  const seen = new Set<string>()
  for (const part of raw.split(',')) {
    const value = part.trim()
    // Unknown values are dropped rather than 404ing, so a stale shared link still
    // renders something useful.
    if (value && allowed.includes(value) && !seen.has(value)) seen.add(value)
    if (seen.size >= MAX_VALUES_PER_KEY) break
  }
  return [...seen]
}

export function filtersFromParams(
  source: ParamSource,
  allowed: {
    role: readonly string[]
    level: readonly string[]
    state: readonly string[]
    remote: readonly string[]
    type: readonly string[]
  }
): JobFilters {
  const pay = readParam(source, 'pay')
  const posted = readParam(source, 'posted')

  return {
    q: readParam(source, 'q').slice(0, 100),
    role: splitValues(readParam(source, 'role'), allowed.role),
    level: splitValues(readParam(source, 'level'), allowed.level),
    state: splitValues(readParam(source, 'state'), allowed.state),
    remote: splitValues(readParam(source, 'remote'), allowed.remote),
    type: splitValues(readParam(source, 'type'), allowed.type),
    pay: PAY_OPTIONS.some((o) => o.value === pay) ? pay : 'any',
    posted: POSTED_OPTIONS.some((o) => o.value === posted) ? posted : 'any',
    company: readParam(source, 'company') || 'all',
  }
}

// Defaults are omitted so a lightly-filtered view still has a short, shareable URL.
export function filtersToQueryString(filters: JobFilters): string {
  const params = new URLSearchParams()

  if (filters.q.trim()) params.set('q', filters.q.trim())
  for (const key of MULTI_KEYS) {
    if (filters[key].length) params.set(key, filters[key].join(','))
  }
  if (filters.pay !== 'any') params.set('pay', filters.pay)
  if (filters.posted !== 'any') params.set('posted', filters.posted)
  if (filters.company !== 'all') params.set('company', filters.company)

  return params.toString()
}

export function activeFilterCount(filters: JobFilters): number {
  let count = 0
  if (filters.q.trim()) count += 1
  for (const key of MULTI_KEYS) count += filters[key].length
  if (filters.pay !== 'any') count += 1
  if (filters.posted !== 'any') count += 1
  if (filters.company !== 'all') count += 1
  return count
}

export function buildHaystack(job: JobCard): string {
  return [
    job.title,
    job.companyName,
    job.summary,
    job.city,
    job.stateName,
    job.roleFamilyLabel,
    ...job.tags,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

function matchesPostedWithin(postedAt: string, bucket: string): boolean {
  if (bucket === 'any') return true
  const days = POSTED_DAYS[bucket]
  if (!days) return true
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000
  return new Date(postedAt).getTime() >= cutoff
}

// Hourly roles must not silently vanish from a pay filter, so they are annualized at
// 2080 hours before comparison.
function matchesPayFloor(job: JobCard, bucket: string): boolean {
  if (bucket === 'any') return true
  if (job.salaryMin === null) return false
  if (bucket === 'disclosed') return true

  const floor = PAY_FLOORS[bucket]
  if (!floor) return true

  const annualized = job.salaryPeriod === 'hour' ? job.salaryMin * 2080 : job.salaryMin
  return annualized >= floor
}

function matchesAny(value: string | null, selected: string[]): boolean {
  if (!selected.length) return true
  return value !== null && selected.includes(value)
}

// A fully remote US role can be done from any state, so it matches every state filter.
// Someone filtering for Wyoming wants the roles they could actually take from Wyoming,
// which includes the remote ones. Work mode is the filter for "onsite only".
//
// This matches the subscriber matching in /api/cron/job-alerts, so the board and the
// weekly digest cannot disagree about what a state preference means.
function matchesState(job: JobCard, selected: string[]): boolean {
  if (!selected.length) return true
  if (job.remoteType === 'remote-us') return true
  return job.stateCode !== null && selected.includes(job.stateCode)
}

export function matchesFilters(job: JobCard, filters: JobFilters): boolean {
  const query = filters.q.trim().toLowerCase()

  return (
    (!query || buildHaystack(job).includes(query)) &&
    matchesAny(job.roleFamily, filters.role) &&
    matchesAny(job.seniority, filters.level) &&
    matchesState(job, filters.state) &&
    matchesAny(job.remoteType, filters.remote) &&
    matchesAny(job.employmentType, filters.type) &&
    (filters.company === 'all' || job.companySlug === filters.company) &&
    matchesPayFloor(job, filters.pay) &&
    matchesPostedWithin(job.postedAt, filters.posted)
  )
}
