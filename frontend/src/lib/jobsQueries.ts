import { unstable_cache } from 'next/cache'
import { getSupabaseRead } from './supabase/read'
import { getSupabaseJobsService } from './supabase/admin'
import { mapPublicJobRowWithLogo } from './companyLogos'
import {
  JOBS_CACHE_TAG,
  JOBS_REVALIDATE_SECONDS,
  toJobCard,
  type JobCard,
  type JobDetail,
  type PublicJobRow,
} from './jobs'

// Server-only data access for the job board.
//
// This is deliberately separate from lib/jobs.ts. JobCard renders inside the client
// component JobBoardExplorer, so anything lib/jobs.ts imports ends up in the browser
// bundle. Keeping every Supabase import here means the client bundle gets the types and
// formatters only, and the 'server-only' guards on the Supabase clients enforce it at
// build time rather than by convention.
//
// Everything reads the public_jobs view, never the jobs table: the view carries the
// company/state/role-family joins and applies the live-listing predicate, and it is
// declared security_invoker so RLS still applies.
//
// unstable_cache rather than `use cache` because this project does not set
// cacheComponents in next.config.ts.

// True only when Supabase has not been configured. In production that is an error; in
// development it is the normal state before the project is provisioned.
function supabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY)
}

async function getMarkdownJobs(includeSamples = false): Promise<JobDetail[]> {
  const { getLocalJobs } = await import('./jobsLocal')
  return getLocalJobs({ includeSamples })
}

export const getLiveJobs = unstable_cache(
  async (): Promise<JobDetail[]> => {
    if (!supabaseConfigured()) {
      const local = await getMarkdownJobs(process.env.NODE_ENV !== 'production')
      if (local.length > 0) {
        console.warn(
          `[jobs] Supabase not configured - serving ${local.length} listing(s) from jobs/*.md.`
        )
        return local
      }

      if (process.env.NODE_ENV === 'production') {
        throw new Error(
          'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY.'
        )
      }

      console.warn(
        `[jobs] Supabase not configured - serving ${local.length} listing(s) from jobs/*.md.`
      )
      return local
    }

    const { data, error } = await getSupabaseRead()
      .from('public_jobs')
      .select('*')
      .order('posted_at', { ascending: false })

    if (error) {
      const local = await getMarkdownJobs(false)
      if (local.length > 0) {
        console.error(`Failed to load jobs from Supabase; serving markdown fallback`, error)
        return local
      }

      throw new Error(`Failed to load jobs: ${error.message}`)
    }

    return (data as PublicJobRow[]).map(mapPublicJobRowWithLogo)
  },
  ['live-jobs'],
  { tags: [JOBS_CACHE_TAG], revalidate: JOBS_REVALIDATE_SECONDS }
)

export async function getJobCards(): Promise<JobCard[]> {
  return (await getLiveJobs()).map(toJobCard)
}

export async function getJobBySlug(slug: string): Promise<JobDetail | undefined> {
  return (await getLiveJobs()).find((job) => job.slug === slug)
}

export async function getJobSlugs(): Promise<string[]> {
  return (await getLiveJobs()).map((job) => job.slug)
}

// A job page can outlive its expires_at under ISR, and public_jobs excludes it. Hard
// 404ing would throw away inbound links and every LinkedIn share, so the detail page
// falls back to this and renders a "role has closed" state instead.
type ExpiredJobRow = Omit<
  PublicJobRow,
  | 'role_family_label'
  | 'state_name'
  | 'state_slug'
  | 'company_slug'
  | 'company_name'
  | 'company_website'
  | 'company_logo_url'
  | 'company_blurb'
> & {
  companies: {
    slug: string
    name: string
    website: string | null
    logo_url: string | null
    blurb: string | null
  }
  job_role_families: { label: string }
  us_states: { name: string; slug: string } | null
}

export async function getExpiredJobBySlug(slug: string): Promise<JobDetail | undefined> {
  const { data, error } = await getSupabaseJobsService()
    .from('jobs')
    .select(
      `id, slug, title, summary, description_html, role_family, seniority,
       employment_type, remote_type, state_code, city, salary_min, salary_max,
       salary_currency, salary_period, salary_disclosed, apply_url, apply_email,
       tags, posted_at, expires_at,
       companies!inner (slug, name, website, logo_url, blurb),
       job_role_families!inner (label),
       us_states (name, slug)`
    )
    .eq('slug', slug)
    .maybeSingle()

  if (error || !data) return undefined

  const row = data as unknown as ExpiredJobRow

  return mapPublicJobRowWithLogo({
    ...row,
    role_family_label: row.job_role_families.label,
    state_name: row.us_states?.name ?? null,
    state_slug: row.us_states?.slug ?? null,
    company_slug: row.companies.slug,
    company_name: row.companies.name,
    company_website: row.companies.website,
    company_logo_url: row.companies.logo_url,
    company_blurb: row.companies.blurb,
  })
}
