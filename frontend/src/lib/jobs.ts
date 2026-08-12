import { EMPLOYMENT_TYPE_SCHEMA, SENIORITY_ORDER } from './jobsTaxonomy'

// Types, formatters and pure derivations for the job board.
//
// This module must stay free of any server-only import. JobCard renders inside the
// client component JobBoardExplorer, so everything reachable from here is bundled to the
// browser. All Supabase access lives in lib/jobsQueries.ts instead.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://therobotage.com'

export const JOBS_CACHE_TAG = 'jobs'
export const JOBS_REVALIDATE_SECONDS = 900

export type JobDetail = {
  id: string
  slug: string
  title: string
  summary: string
  descriptionHtml: string

  roleFamily: string
  roleFamilyLabel: string
  seniority: string
  employmentType: string
  remoteType: string

  stateCode: string | null
  stateName: string | null
  stateSlug: string | null
  city: string | null

  salaryMin: number | null
  salaryMax: number | null
  salaryCurrency: string
  salaryPeriod: 'year' | 'hour'
  salaryDisclosed: boolean

  applyUrl: string | null
  applyEmail: string | null
  tags: string[]

  postedAt: string
  expiresAt: string

  companySlug: string
  companyName: string
  companyWebsite: string | null
  companyLogoUrl: string | null
  companyBlurb: string | null
}

// The list payload shipped to the client. Deliberately excludes descriptionHtml — at
// roughly 400 bytes per card, 300 jobs is about 25 KB gzipped; including descriptions
// would multiply that by an order of magnitude.
export type JobCard = Omit<JobDetail, 'descriptionHtml' | 'companyBlurb' | 'applyEmail'>

export type JobFacets = {
  companies: { slug: string; name: string }[]
  roleFamilies: string[]
  seniorities: string[]
  states: { code: string; name: string }[]
  remoteTypes: string[]
  employmentTypes: string[]
}

export type PublicJobRow = {
  id: string
  slug: string
  title: string
  summary: string
  description_html: string
  role_family: string
  role_family_label: string
  seniority: string
  employment_type: string
  remote_type: string
  state_code: string | null
  state_name: string | null
  state_slug: string | null
  city: string | null
  salary_min: number | null
  salary_max: number | null
  salary_currency: string
  salary_period: 'year' | 'hour'
  salary_disclosed: boolean
  apply_url: string | null
  apply_email: string | null
  tags: string[] | null
  posted_at: string
  expires_at: string
  company_slug: string
  company_name: string
  company_website: string | null
  company_logo_url: string | null
  company_blurb: string | null
}

export function mapPublicJobRow(row: PublicJobRow): JobDetail {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    descriptionHtml: row.description_html,
    roleFamily: row.role_family,
    roleFamilyLabel: row.role_family_label,
    seniority: row.seniority,
    employmentType: row.employment_type,
    remoteType: row.remote_type,
    stateCode: row.state_code,
    stateName: row.state_name,
    stateSlug: row.state_slug,
    city: row.city,
    salaryMin: row.salary_min,
    salaryMax: row.salary_max,
    salaryCurrency: row.salary_currency,
    salaryPeriod: row.salary_period,
    salaryDisclosed: row.salary_disclosed,
    applyUrl: row.apply_url,
    applyEmail: row.apply_email,
    tags: row.tags ?? [],
    postedAt: row.posted_at,
    expiresAt: row.expires_at,
    companySlug: row.company_slug,
    companyName: row.company_name,
    companyWebsite: row.company_website,
    companyLogoUrl: row.company_logo_url,
    companyBlurb: row.company_blurb,
  }
}

export function toJobCard(job: JobDetail): JobCard {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { descriptionHtml, companyBlurb, applyEmail, ...card } = job
  /* eslint-enable @typescript-eslint/no-unused-vars */
  return card
}

// Facets are derived from the visible set, not from the taxonomy, so the UI never
// offers a filter that would return zero results.
export function getJobFacets(jobs: JobCard[]): JobFacets {
  const companies = new Map<string, string>()
  const states = new Map<string, string>()
  const roleFamilies = new Set<string>()
  const seniorities = new Set<string>()
  const remoteTypes = new Set<string>()
  const employmentTypes = new Set<string>()

  for (const job of jobs) {
    companies.set(job.companySlug, job.companyName)
    if (job.stateCode && job.stateName) states.set(job.stateCode, job.stateName)
    roleFamilies.add(job.roleFamily)
    seniorities.add(job.seniority)
    remoteTypes.add(job.remoteType)
    employmentTypes.add(job.employmentType)
  }

  return {
    companies: [...companies.entries()]
      .map(([slug, name]) => ({ slug, name }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    states: [...states.entries()]
      .map(([code, name]) => ({ code, name }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    roleFamilies: [...roleFamilies],
    seniorities: [...seniorities],
    remoteTypes: [...remoteTypes],
    employmentTypes: [...employmentTypes],
  }
}

// Related roles.
//
// Relatedness requires sharing the discipline or the employer. Location, work mode and
// seniority only rank candidates that already qualify — on their own they would surface,
// say, a mechanical engineering job on a perception listing purely because both are
// onsite in California, which is not a relation a job seeker cares about.
//
// Showing nothing is a valid outcome and better than three padded results.
//
// There is no score threshold: the qualifying filter decides what counts as related, and
// the score only orders the results. A threshold on top of it would silently drop
// same-employer matches, which are a normal and useful thing to show.
const RELATED_LIMIT = 3

export function getRelatedJobs(job: JobDetail, all: JobDetail[]): JobCard[] {
  const levelIndex = SENIORITY_ORDER.indexOf(job.seniority)

  return all
    .filter((other) => other.slug !== job.slug)
    .filter(
      (other) => other.roleFamily === job.roleFamily || other.companySlug === job.companySlug
    )
    .map((other) => {
      let score = 0
      if (other.roleFamily === job.roleFamily) score += 5
      if (other.companySlug === job.companySlug) score += 3

      const otherLevel = SENIORITY_ORDER.indexOf(other.seniority)
      if (levelIndex >= 0 && otherLevel >= 0 && Math.abs(levelIndex - otherLevel) <= 1) score += 2

      if (other.stateCode && other.stateCode === job.stateCode) score += 2
      if (other.remoteType === job.remoteType) score += 1
      if (other.tags.some((tag) => job.tags.includes(tag))) score += 1

      return { job: other, score }
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        new Date(b.job.postedAt).getTime() - new Date(a.job.postedAt).getTime()
    )
    .slice(0, RELATED_LIMIT)
    .map((entry) => toJobCard(entry.job))
}

// ── Formatting ───────────────────────────────────────────────────────────────

export function formatLocation(job: Pick<JobCard, 'remoteType' | 'city' | 'stateCode'>): string {
  if (job.remoteType === 'remote-us') return 'Remote (US)'
  const place = [job.city, job.stateCode].filter(Boolean).join(', ')
  return job.remoteType === 'hybrid' ? `${place} (Hybrid)` : place
}

function compactAmount(value: number, period: 'year' | 'hour'): string {
  if (period === 'hour') return `$${value}`
  if (value % 1000 === 0) return `$${value / 1000}k`
  return `$${Math.round(value / 1000)}k`
}

export function formatSalary(
  job: Pick<JobCard, 'salaryMin' | 'salaryMax' | 'salaryPeriod'>
): string | null {
  if (job.salaryMin === null || job.salaryMax === null) return null

  const suffix = job.salaryPeriod === 'hour' ? '/hr' : ''
  const min = compactAmount(job.salaryMin, job.salaryPeriod)
  const max = compactAmount(job.salaryMax, job.salaryPeriod)

  return min === max ? `${min}${suffix}` : `${min} - ${max}${suffix}`
}

export function formatPostedDate(postedAt: string): string {
  return new Date(postedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

// ── Structured data ──────────────────────────────────────────────────────────

// JobPosting markup is what makes a listing eligible for the Google Jobs box, which is
// the largest organic channel available to a small board. Four rules decide whether it
// actually indexes, and all four are enforced here:
//   1. `title` is the bare job title, never "Title at Company - The Robot Age".
//   2. `directApply` is false: we link out rather than hosting the apply flow.
//   3. Hybrid roles carry both jobLocation and jobLocationType.
//   4. List pages emit ItemList instead; JobPosting on a list page is a violation.
export function buildJobPostingJsonLd(job: JobDetail): Record<string, unknown> {
  const isRemote = job.remoteType === 'remote-us'

  const location = isRemote
    ? {
        jobLocationType: 'TELECOMMUTE',
        applicantLocationRequirements: { '@type': 'Country', name: 'USA' },
      }
    : {
        jobLocation: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: job.city,
            addressRegion: job.stateCode,
            addressCountry: 'US',
          },
        },
        ...(job.remoteType === 'hybrid' && { jobLocationType: 'TELECOMMUTE' }),
      }

  const salary =
    job.salaryMin !== null && job.salaryMax !== null
      ? {
          baseSalary: {
            '@type': 'MonetaryAmount',
            currency: job.salaryCurrency,
            value: {
              '@type': 'QuantitativeValue',
              minValue: job.salaryMin,
              maxValue: job.salaryMax,
              unitText: job.salaryPeriod === 'year' ? 'YEAR' : 'HOUR',
            },
          },
        }
      : {}

  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.descriptionHtml,
    identifier: {
      '@type': 'PropertyValue',
      name: job.companyName,
      value: job.slug,
    },
    datePosted: job.postedAt,
    validThrough: job.expiresAt,
    employmentType: EMPLOYMENT_TYPE_SCHEMA[job.employmentType] ?? 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: job.companyName,
      ...(job.companyWebsite && { sameAs: job.companyWebsite }),
      ...(job.companyLogoUrl && {
        logo: job.companyLogoUrl.startsWith('http')
          ? job.companyLogoUrl
          : `${SITE_URL}${job.companyLogoUrl}`,
      }),
    },
    directApply: false,
    ...location,
    ...salary,
  }
}

export function buildJobListJsonLd(jobs: JobCard[], listUrl: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    url: listUrl,
    numberOfItems: jobs.length,
    itemListElement: jobs.map((job, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/jobs/${job.slug}`,
      name: `${job.title} - ${job.companyName}`,
    })),
  }
}
