import 'server-only'
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { marked } from 'marked'
import yaml from 'js-yaml'
import type { JobDetail, PublicJobRow } from './jobs'
import { mapPublicJobRowWithLogo } from './companyLogos'
import { roleFamilyLabel, stateByCode } from './jobsTaxonomy'

// Markdown fallback.
//
// The job board reads Supabase first. Before the project is provisioned (or on a
// machine without credentials) that leaves /jobs empty and untestable, so this reads
// the same markdown files the publish script reads and produces the same JobDetail
// shape.
//
// In production it is also a resilience fallback, but only for real listings. Sample
// files are local UI fixtures and must never be shown to job seekers.

const JOBS_DIR = path.join(process.cwd(), 'jobs')
const COMPANIES_PATH = path.join(JOBS_DIR, '_companies.yml')
const DEFAULT_EXPIRY_DAYS = 60

type CompanyRecord = {
  name: string
  website?: string
  logo_url?: string
  blurb?: string
  hq_city?: string
  hq_state?: string
}

function loadCompanies(): Record<string, CompanyRecord> {
  if (!fs.existsSync(COMPANIES_PATH)) return {}
  return (yaml.load(fs.readFileSync(COMPANIES_PATH, 'utf8')) ?? {}) as Record<string, CompanyRecord>
}

function toIso(value: unknown, fallback: Date): string {
  if (value instanceof Date) return value.toISOString()
  if (typeof value === 'string') {
    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString()
  }
  return fallback.toISOString()
}

export function getLocalJobs(options: { includeSamples?: boolean } = {}): JobDetail[] {
  if (!fs.existsSync(JOBS_DIR)) return []

  const companies = loadCompanies()
  const now = new Date()
  const includeSamples = options.includeSamples ?? process.env.NODE_ENV !== 'production'

  const files = fs
    .readdirSync(JOBS_DIR)
    .filter((file) => file.endsWith('.md') && !file.startsWith('_'))
    .filter((file) => includeSamples || !file.startsWith('sample-'))

  const jobs: JobDetail[] = []

  for (const file of files) {
    const { data, content } = matter(fs.readFileSync(path.join(JOBS_DIR, file), 'utf8'))
    const fm = data as Record<string, unknown>

    if (fm.status && fm.status !== 'published') continue

    const companyKey = String(fm.company ?? '')
    const company = companies[companyKey]
    if (!company) continue

    const postedAt = toIso(fm.posted_at, now)
    const expiresAt = toIso(
      fm.expires_at,
      new Date(new Date(postedAt).getTime() + DEFAULT_EXPIRY_DAYS * 24 * 60 * 60 * 1000)
    )

    // Skip anything already expired, mirroring the public_jobs view predicate.
    if (new Date(expiresAt) <= now) continue

    const stateCode = (fm.state as string | undefined) ?? null
    const state = stateCode ? stateByCode(stateCode) : undefined
    const salaryMin = (fm.salary_min as number | undefined) ?? null

    const row: PublicJobRow = {
      id: String(fm.slug),
      slug: String(fm.slug),
      title: String(fm.title ?? ''),
      summary: String(fm.summary ?? ''),
      description_html: marked.parse(content) as string,
      role_family: String(fm.role_family ?? ''),
      role_family_label: roleFamilyLabel(String(fm.role_family ?? '')),
      seniority: String(fm.seniority ?? ''),
      employment_type: String(fm.employment_type ?? ''),
      remote_type: String(fm.remote_type ?? ''),
      state_code: stateCode,
      state_name: state?.name ?? null,
      state_slug: state?.slug ?? null,
      city: (fm.city as string | undefined) ?? null,
      salary_min: salaryMin,
      salary_max: (fm.salary_max as number | undefined) ?? null,
      salary_currency: 'USD',
      salary_period: (fm.salary_period as 'year' | 'hour' | undefined) ?? 'year',
      salary_disclosed: salaryMin !== null,
      apply_url: (fm.apply_url as string | undefined) ?? null,
      apply_email: (fm.apply_email as string | undefined) ?? null,
      tags: (fm.tags as string[] | undefined) ?? [],
      posted_at: postedAt,
      expires_at: expiresAt,
      company_slug: companyKey,
      company_name: company.name,
      company_website: company.website ?? null,
      company_logo_url: company.logo_url ?? null,
      company_blurb: company.blurb ?? null,
    }

    jobs.push(mapPublicJobRowWithLogo(row))
  }

  return jobs.sort(
    (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
  )
}
