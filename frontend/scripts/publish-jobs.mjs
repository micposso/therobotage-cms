#!/usr/bin/env node
//
// Publish job listings from frontend/jobs/*.md into Supabase.
//
//   npm run jobs:check         validate only, exit 1 on any error
//   npm run jobs:publish:dry   validate and print the change plan, write nothing
//   npm run jobs:publish       validate and write
//   npm run jobs:publish -- --skip-samples   publish real listings only
//   npm run jobs:publish -- --prune   additionally hard-delete draft rows
//
// The markdown files are the source of truth. Supabase is a serving replica: every row
// is reproducible from git, which is why "never hand-edit rows in the dashboard" is a
// rule this script can actually enforce.
//
// The public board is intentionally curated: a publish run de-dupes listings and keeps
// at most 30 live postings visible, archiving the older overflow rows in Supabase.
//
// Nothing is written unless every file passes validation. A partial publish would make
// git and the database disagree, which is the one failure this design exists to avoid.

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import { marked } from 'marked'
import yaml from 'js-yaml'
import { createClient } from '@supabase/supabase-js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const JOBS_DIR = path.join(ROOT, 'jobs')
const TAXONOMY_PATH = path.join(JOBS_DIR, 'taxonomy.json')
const COMPANIES_PATH = path.join(JOBS_DIR, '_companies.yml')

const DEFAULT_EXPIRY_DAYS = 60
const MAX_EXPIRY_DAYS = 180
const MAX_LIVE_JOBS = 30
const MAX_LIVE_JOBS_PER_COMPANY = 4
const SIZE_BUCKETS = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']

const args = process.argv.slice(2)
const CHECK_ONLY = args.includes('--check')
const DRY_RUN = args.includes('--dry-run')
const PRUNE = args.includes('--prune')
const ALLOW_SAMPLES = args.includes('--allow-samples')
const SKIP_SAMPLES = args.includes('--skip-samples')

// sample-*.md files are placeholder listings for invented companies, used to develop the
// UI locally. Publishing them would put fabricated jobs in front of real job seekers and
// into Google Jobs, so the publish path refuses them by default. Validation and dry runs
// still process them.
const SAMPLE_PREFIX = 'sample-'

// ── Output helpers ───────────────────────────────────────────────────────────

const errors = []
const warnings = []

function fail(file, field, message) {
  errors.push(`${file}${field ? `:${field}` : ''} - ${message}`)
}

function warn(file, field, message) {
  warnings.push(`${file}${field ? `:${field}` : ''} - ${message}`)
}

// ── Environment ──────────────────────────────────────────────────────────────

function loadDotEnvFile(filename) {
  const envPath = path.join(ROOT, filename)
  if (!fs.existsSync(envPath)) return

  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    if (process.env[key] !== undefined) continue
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    process.env[key] = value
  }
}

function loadDotEnvLocal() {
  loadDotEnvFile('.env')
  loadDotEnvFile('.env.local')
}

// ── Validation primitives ────────────────────────────────────────────────────

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Curly quotes break the Turbopack parser elsewhere in this repo, and they read as
// pasted employer boilerplate. Reject them at the door.
const CURLY_QUOTES_RE = /[‘’“”]/

function isPlainDate(value) {
  if (value instanceof Date) return !Number.isNaN(value.getTime())
  if (typeof value !== 'string') return false
  return !Number.isNaN(new Date(value).getTime())
}

function toDate(value) {
  return value instanceof Date ? value : new Date(value)
}

function addDays(date, days) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000)
}

function canonicalJson(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`
  const keys = Object.keys(value).sort()
  return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalJson(value[k])}`).join(',')}}`
}

function normalizeText(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

function normalizeApplyUrl(value) {
  if (!value) return ''

  try {
    const url = new URL(value)
    const params = [...url.searchParams.entries()]
      .filter(([key]) => !key.toLowerCase().startsWith('utm_'))
      .filter(([key]) => !['gh_src', 'source', 'ref', 'referrer'].includes(key.toLowerCase()))
      .sort(([a], [b]) => a.localeCompare(b))

    url.search = ''
    for (const [key, val] of params) url.searchParams.append(key, val)
    url.hash = ''
    return `${url.origin}${url.pathname.replace(/\/+$/, '')}${url.search}`.toLowerCase()
  } catch {
    return normalizeText(value)
  }
}

function dedupeKeyForJob(fm) {
  const applyUrl = normalizeApplyUrl(fm.apply_url)
  if (applyUrl) return `url:${applyUrl}`

  return titleCompanyLocationKey(fm)
}

function titleCompanyLocationKey(fm) {
  return [
    'title-company-location',
    normalizeText(fm.company),
    normalizeText(fm.title),
    normalizeText(fm.city),
    normalizeText(fm.state),
  ].join(':')
}

function publishRank(a, b) {
  const postedDelta = toDate(b.fm.posted_at).getTime() - toDate(a.fm.posted_at).getTime()
  if (postedDelta) return postedDelta
  return a.file.localeCompare(b.file)
}

function chooseUnique(jobs, keyForJob) {
  const groups = new Map()
  for (const job of jobs) {
    const key = keyForJob(job)
    const group = groups.get(key) ?? []
    group.push(job)
    groups.set(key, group)
  }

  const duplicateGroups = [...groups.values()].filter((group) => group.length > 1)
  const winners = [...groups.values()]
    .map((group) => [...group].sort(publishRank)[0])
    .sort(publishRank)
  const dropped = duplicateGroups.flatMap((group) => [...group].sort(publishRank).slice(1))

  return { winners, duplicateGroups, dropped }
}

function planLiveJobs(parsed) {
  const now = new Date()
  const candidates = []

  for (const job of parsed) {
    if (job.file.startsWith(SAMPLE_PREFIX)) continue
    const status = job.fm.status ?? 'published'
    if (status !== 'published') continue

    const postedAt = toDate(job.fm.posted_at)
    const expiresAt = job.fm.expires_at ? toDate(job.fm.expires_at) : addDays(postedAt, DEFAULT_EXPIRY_DAYS)
    if (expiresAt <= now) continue

    candidates.push(job)
  }

  const urlDeduped = chooseUnique(candidates, (job) => dedupeKeyForJob(job.fm))
  const titleDeduped = chooseUnique(urlDeduped.winners, (job) => titleCompanyLocationKey(job.fm))
  const deduped = titleDeduped.winners
  const duplicateSlugs = new Set([
    ...urlDeduped.dropped.map((job) => job.fm.slug),
    ...titleDeduped.dropped.map((job) => job.fm.slug),
  ])
  const duplicateGroupCount = urlDeduped.duplicateGroups.length + titleDeduped.duplicateGroups.length

  const companyCounts = new Map()
  const selected = []
  const overflow = []

  for (const job of deduped) {
    const count = companyCounts.get(job.fm.company) ?? 0
    if (selected.length < MAX_LIVE_JOBS && count < MAX_LIVE_JOBS_PER_COMPANY) {
      selected.push(job)
      companyCounts.set(job.fm.company, count + 1)
    } else {
      overflow.push(job)
    }
  }

  return {
    selectedSlugs: new Set(selected.map((job) => job.fm.slug)),
    duplicateSlugs,
    overflowSlugs: new Set(overflow.map((job) => job.fm.slug)),
    selectedCount: selected.length,
    duplicateGroupCount,
    duplicateDropCount: duplicateSlugs.size,
    overflowCount: overflow.length,
  }
}

// ── Load taxonomy and companies ──────────────────────────────────────────────

function loadTaxonomy() {
  const raw = JSON.parse(fs.readFileSync(TAXONOMY_PATH, 'utf8'))
  return {
    roleFamilies: raw.roleFamilies.map((r) => r.slug),
    seniorities: raw.seniorities.map((s) => s.slug),
    employmentTypes: raw.employmentTypes.map((e) => e.slug),
    remoteTypes: raw.remoteTypes.map((r) => r.slug),
    stateCodes: raw.states.map((s) => s.code),
  }
}

function loadCompanies() {
  const raw = yaml.load(fs.readFileSync(COMPANIES_PATH, 'utf8')) ?? {}
  const companies = new Map()

  for (const [slug, value] of Object.entries(raw)) {
    const file = '_companies.yml'

    if (!SLUG_RE.test(slug)) {
      fail(file, slug, 'company key must be lowercase-hyphenated')
      continue
    }
    if (!value || typeof value !== 'object') {
      fail(file, slug, 'company entry must be a mapping')
      continue
    }
    if (!value.name) {
      fail(file, slug, 'name is required')
      continue
    }
    if (value.size_bucket && !SIZE_BUCKETS.includes(value.size_bucket)) {
      fail(file, slug, `size_bucket must be one of ${SIZE_BUCKETS.join(', ')}`)
    }
    if (value.website && !/^https:\/\//.test(value.website)) {
      fail(file, slug, 'website must be an https URL')
    }

    companies.set(slug, {
      slug,
      name: value.name,
      website: value.website ?? null,
      logo_url: value.logo_url ?? null,
      blurb: value.blurb ?? null,
      hq_city: value.hq_city ?? null,
      hq_state: value.hq_state ?? null,
      size_bucket: value.size_bucket ?? null,
    })
  }

  return companies
}

function isSampleCompany(company) {
  return typeof company.blurb === 'string' && company.blurb.startsWith('Sample data.')
}

// ── Validate one job file ────────────────────────────────────────────────────

function validateJob(file, data, body, taxonomy, companies, seenSlugs) {
  const fm = data
  const expectedSlug = path.basename(file, '.md')

  if (!fm.slug) {
    fail(file, 'slug', 'is required')
  } else if (!SLUG_RE.test(fm.slug)) {
    fail(file, 'slug', 'must be lowercase-hyphenated')
  } else if (fm.slug !== expectedSlug) {
    fail(file, 'slug', `must match the filename (expected "${expectedSlug}")`)
  } else if (seenSlugs.has(fm.slug)) {
    fail(file, 'slug', 'is used by another job file')
  } else {
    seenSlugs.add(fm.slug)
  }

  if (!fm.title) {
    fail(file, 'title', 'is required')
  } else {
    if (fm.title.length < 3 || fm.title.length > 120) {
      fail(file, 'title', 'must be between 3 and 120 characters')
    }
    // JobPosting structured data requires the bare job title. "Engineer at Figure"
    // is a Google Jobs policy violation, so catch it here rather than in Search Console.
    const company = companies.get(fm.company)
    if (company && fm.title.toLowerCase().includes(company.name.toLowerCase())) {
      fail(file, 'title', 'must not contain the company name (JobPosting requires the bare title)')
    }
    if (/\bat\s+\w/i.test(fm.title) && /\bat\s/i.test(fm.title)) {
      warn(file, 'title', 'contains " at " - check this is the bare job title')
    }
  }

  if (!fm.company) {
    fail(file, 'company', 'is required')
  } else if (!companies.has(fm.company)) {
    fail(file, 'company', `"${fm.company}" is not defined in _companies.yml`)
  }

  const enums = [
    ['role_family', taxonomy.roleFamilies],
    ['seniority', taxonomy.seniorities],
    ['employment_type', taxonomy.employmentTypes],
    ['remote_type', taxonomy.remoteTypes],
  ]
  for (const [field, allowed] of enums) {
    if (!fm[field]) {
      fail(file, field, 'is required')
    } else if (!allowed.includes(fm[field])) {
      fail(file, field, `"${fm[field]}" is not valid. Allowed: ${allowed.join(', ')}`)
    }
  }

  // US-only enforcement lives here and in the jobs.state_code foreign key.
  const isRemote = fm.remote_type === 'remote-us'
  if (fm.state !== undefined && fm.state !== null) {
    if (!taxonomy.stateCodes.includes(fm.state)) {
      fail(file, 'state', `"${fm.state}" is not a US state code. The board is US-only (50 states plus DC).`)
    }
  } else if (!isRemote) {
    fail(file, 'state', 'is required unless remote_type is remote-us')
  }
  if (!fm.city && !isRemote) {
    fail(file, 'city', 'is required unless remote_type is remote-us')
  }

  if (!fm.summary) {
    fail(file, 'summary', 'is required')
  } else {
    if (fm.summary.length > 180) {
      fail(file, 'summary', `must be 180 characters or fewer (currently ${fm.summary.length})`)
    }
    if (CURLY_QUOTES_RE.test(fm.summary)) {
      fail(file, 'summary', 'contains curly quotes - use straight quotes')
    }
  }

  const hasUrl = Boolean(fm.apply_url)
  const hasEmail = Boolean(fm.apply_email)
  if (!hasUrl && !hasEmail) {
    fail(file, 'apply_url', 'either apply_url or apply_email is required')
  }
  if (hasUrl && !/^https:\/\//.test(fm.apply_url)) {
    fail(file, 'apply_url', 'must be an https URL')
  }
  if (hasEmail && !EMAIL_RE.test(fm.apply_email)) {
    fail(file, 'apply_email', 'is not a valid email address')
  }

  const period = fm.salary_period ?? 'year'
  if (!['year', 'hour'].includes(period)) {
    fail(file, 'salary_period', 'must be "year" or "hour"')
  }
  const hasMin = fm.salary_min !== undefined && fm.salary_min !== null
  const hasMax = fm.salary_max !== undefined && fm.salary_max !== null
  if (hasMin !== hasMax) {
    fail(file, 'salary_min', 'salary_min and salary_max must both be present or both omitted')
  }
  if (hasMin && hasMax) {
    if (fm.salary_max < fm.salary_min) {
      fail(file, 'salary_max', 'must be greater than or equal to salary_min')
    }
    if (period === 'year' && (fm.salary_min < 20000 || fm.salary_max > 2000000)) {
      fail(file, 'salary_min', 'annual salary is outside the plausible range (20000 to 2000000)')
    }
    if (period === 'hour' && (fm.salary_min < 7 || fm.salary_max > 500)) {
      fail(file, 'salary_min', 'hourly rate is outside the plausible range (7 to 500)')
    }
    // Almost always a typo'd zero. Warn rather than fail, since wide bands do exist.
    if (fm.salary_min > 0 && fm.salary_max / fm.salary_min > 3) {
      warn(file, 'salary_max', 'range is more than 3x the minimum - check for a typo')
    }
  }

  if (!fm.posted_at) {
    fail(file, 'posted_at', 'is required')
  } else if (!isPlainDate(fm.posted_at)) {
    fail(file, 'posted_at', 'is not a parseable date')
  } else if (toDate(fm.posted_at).getTime() > Date.now() + 24 * 60 * 60 * 1000) {
    fail(file, 'posted_at', 'is more than a day in the future')
  }

  if (fm.expires_at !== undefined) {
    if (!isPlainDate(fm.expires_at)) {
      fail(file, 'expires_at', 'is not a parseable date')
    } else if (isPlainDate(fm.posted_at)) {
      const posted = toDate(fm.posted_at)
      const expires = toDate(fm.expires_at)
      if (expires <= posted) {
        fail(file, 'expires_at', 'must be after posted_at')
      } else if (expires > addDays(posted, MAX_EXPIRY_DAYS)) {
        fail(file, 'expires_at', `must be within ${MAX_EXPIRY_DAYS} days of posted_at`)
      }
    }
  }

  if (fm.tags !== undefined) {
    if (!Array.isArray(fm.tags)) {
      fail(file, 'tags', 'must be a list')
    } else {
      if (fm.tags.length > 10) fail(file, 'tags', 'must have 10 or fewer entries')
      for (const tag of fm.tags) {
        if (typeof tag !== 'string' || tag.length > 30) {
          fail(file, 'tags', `"${tag}" must be a string of 30 characters or fewer`)
        }
      }
    }
  }

  if (fm.status !== undefined && !['published', 'draft', 'closed'].includes(fm.status)) {
    fail(file, 'status', 'must be published, draft or closed')
  }

  if (body.trim().length < 200) {
    fail(file, 'body', 'must be at least 200 characters')
  }
  if (CURLY_QUOTES_RE.test(body)) {
    warn(file, 'body', 'contains curly quotes - straight quotes are the house style')
  }
}

// ── Build the DB row ─────────────────────────────────────────────────────────

function buildJobRow(fm, body, companyId, companyName) {
  const postedAt = toDate(fm.posted_at)
  const expiresAt = fm.expires_at ? toDate(fm.expires_at) : addDays(postedAt, DEFAULT_EXPIRY_DAYS)
  const isRemote = fm.remote_type === 'remote-us'

  const contentHash = crypto
    .createHash('sha256')
    .update(canonicalJson({ ...fm, posted_at: postedAt.toISOString() }))
    .update(body)
    .digest('hex')

  return {
    slug: fm.slug,
    company_id: companyId,
    company_name: companyName,
    title: fm.title,
    summary: fm.summary,
    description_md: body,
    description_html: marked.parse(body),
    role_family: fm.role_family,
    seniority: fm.seniority,
    employment_type: fm.employment_type,
    remote_type: fm.remote_type,
    state_code: isRemote ? (fm.state ?? null) : fm.state,
    city: isRemote ? (fm.city ?? null) : fm.city,
    salary_min: fm.salary_min ?? null,
    salary_max: fm.salary_max ?? null,
    salary_currency: 'USD',
    salary_period: fm.salary_period ?? 'year',
    apply_url: fm.apply_url ?? null,
    apply_email: fm.apply_email ?? null,
    tags: fm.tags ?? [],
    posted_at: postedAt.toISOString(),
    expires_at: expiresAt.toISOString(),
    status: fm.status ?? 'published',
    source_url: fm.source_url ?? null,
    content_hash: contentHash,
    updated_at: new Date().toISOString(),
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  loadDotEnvLocal()

  const taxonomy = loadTaxonomy()
  const loadedCompanies = loadCompanies()
  const companies = SKIP_SAMPLES
    ? new Map([...loadedCompanies.entries()].filter(([, company]) => !isSampleCompany(company)))
    : loadedCompanies

  if (!fs.existsSync(JOBS_DIR)) {
    console.error(`No jobs directory at ${JOBS_DIR}`)
    process.exit(1)
  }

  // Underscore-prefixed files are authoring scaffolding, matching the convention in
  // src/lib/news.ts.
  const files = fs
    .readdirSync(JOBS_DIR)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .filter((f) => !SKIP_SAMPLES || !f.startsWith(SAMPLE_PREFIX))
    .sort()

  const seenSlugs = new Set()
  const parsed = []

  for (const file of files) {
    const raw = fs.readFileSync(path.join(JOBS_DIR, file), 'utf8')
    const { data, content } = matter(raw)
    validateJob(file, data, content, taxonomy, companies, seenSlugs)
    parsed.push({ file, fm: data, body: content })
  }

  for (const line of warnings) console.warn(`  warn  ${line}`)

  if (errors.length) {
    console.error(`\n${errors.length} validation error${errors.length === 1 ? '' : 's'}:\n`)
    for (const line of errors) console.error(`  error ${line}`)
    console.error('\nNothing was written.')
    process.exit(1)
  }

  const livePlan = planLiveJobs(parsed)

  console.log(
    `Validated ${parsed.length} job${parsed.length === 1 ? '' : 's'} and ${companies.size} compan${companies.size === 1 ? 'y' : 'ies'}` +
      (warnings.length ? ` (${warnings.length} warning${warnings.length === 1 ? '' : 's'})` : '')
  )
  console.log(
    `Live board plan: publish ${livePlan.selectedCount}/${MAX_LIVE_JOBS} · de-dupe ${livePlan.duplicateDropCount}` +
      ` from ${livePlan.duplicateGroupCount} group${livePlan.duplicateGroupCount === 1 ? '' : 's'} · archive overflow ${livePlan.overflowCount}`
  )

  if (CHECK_ONLY) return

  const samples = parsed.filter((p) => p.file.startsWith(SAMPLE_PREFIX))
  if (samples.length && !ALLOW_SAMPLES && !SKIP_SAMPLES && !DRY_RUN) {
    console.error(
      `\nRefusing to publish ${samples.length} sample listing${samples.length === 1 ? '' : 's'}:\n`
    )
    for (const { file } of samples) console.error(`  ${file}`)
    console.error(
      '\nThese are placeholder jobs for invented companies, meant for local UI development.\n' +
        'Publishing them would put fabricated listings in front of real job seekers.\n\n' +
        'Delete them (rm jobs/sample-*.md) before publishing real listings,\n' +
        'or pass --allow-samples if you genuinely intend to push them.'
    )
    process.exit(1)
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.error(
      '\nMissing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n' +
        'Set them in frontend/.env.local or the environment. See frontend/.env.example.'
    )
    process.exit(1)
  }

  const db = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Companies first: jobs carry a foreign key to them.
  const companyRows = [...companies.values()].map((c) => ({ ...c, updated_at: new Date().toISOString() }))
  if (!DRY_RUN && companyRows.length) {
    const { error } = await db.from('companies').upsert(companyRows, { onConflict: 'slug' })
    if (error) {
      console.error(`Failed to upsert companies: ${error.message}`)
      process.exit(1)
    }
  }

  const { data: companyIdRows, error: companyIdError } = await db
    .from('companies')
    .select('id, slug, name')
  if (companyIdError) {
    console.error(`Failed to read companies: ${companyIdError.message}`)
    process.exit(1)
  }
  const companyIds = new Map((companyIdRows ?? []).map((c) => [c.slug, c]))

  if (DRY_RUN && companyIds.size === 0) {
    console.log('Dry run: companies table is empty, so job diffs cannot be computed yet.')
  }

  const { data: existingRows, error: existingError } = await db
    .from('jobs')
    .select('slug, content_hash, status')
  if (existingError) {
    console.error(`Failed to read existing jobs: ${existingError.message}`)
    process.exit(1)
  }
  const existing = new Map((existingRows ?? []).map((r) => [r.slug, r]))

  const toWrite = []
  let unchanged = 0

  for (const { file, fm, body } of parsed) {
    const company = companyIds.get(fm.company)
    if (!company) {
      if (DRY_RUN) continue
      console.error(`${file}: company "${fm.company}" was not found after upsert`)
      process.exit(1)
    }

    const row = buildJobRow(fm, body, company.id, company.name)
    if ((fm.status ?? 'published') === 'published' && !livePlan.selectedSlugs.has(row.slug)) {
      row.status = 'archived'
      row.expires_at = new Date().toISOString()
    }
    const prior = existing.get(row.slug)

    // content_hash lets an unchanged job be skipped entirely, so a routine publish run
    // does not rewrite every row and bump every updated_at.
    if (prior && prior.content_hash === row.content_hash && prior.status === row.status) {
      unchanged += 1
      continue
    }

    toWrite.push({ row, isNew: !prior })
  }

  const fileSlugs = new Set(parsed.map((p) => p.fm.slug))
  const toArchive = [...existing.entries()]
    .filter(([slug, row]) => !fileSlugs.has(slug) && row.status !== 'archived')
    .map(([slug]) => slug)

  const created = toWrite.filter((w) => w.isNew).length
  const updated = toWrite.length - created

  if (DRY_RUN) {
    console.log('\nDry run - no writes performed.\n')
    for (const { row, isNew } of toWrite) {
      const reason = livePlan.duplicateSlugs.has(row.slug)
        ? ' duplicate'
        : livePlan.overflowSlugs.has(row.slug)
          ? ' overflow'
          : ''
      console.log(`  ${isNew ? 'create' : 'update'}  ${row.slug}${row.status === 'archived' ? ` -> archive${reason}` : ''}`)
    }
    for (const slug of toArchive) console.log(`  archive ${slug}`)
    console.log(
      `\ncreated ${created} · updated ${updated} · unchanged ${unchanged} · archived ${toArchive.length}`
    )
    return
  }

  if (toWrite.length) {
    const { error } = await db
      .from('jobs')
      .upsert(toWrite.map((w) => w.row), { onConflict: 'slug' })
    if (error) {
      console.error(`Failed to upsert jobs: ${error.message}`)
      process.exit(1)
    }
  }

  // Never hard-delete. Archiving preserves the job_alert_sends audit trail and keeps
  // inbound links resolving to a "role has closed" page instead of a 404.
  if (toArchive.length) {
    const { error } = await db
      .from('jobs')
      .update({ status: 'archived', expires_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .in('slug', toArchive)
    if (error) {
      console.error(`Failed to archive jobs: ${error.message}`)
      process.exit(1)
    }
  }

  let pruned = 0
  if (PRUNE) {
    const { data, error } = await db.from('jobs').delete().eq('status', 'draft').select('slug')
    if (error) {
      console.error(`Failed to prune drafts: ${error.message}`)
      process.exit(1)
    }
    pruned = data?.length ?? 0
  }

  console.log(
    `created ${created} · updated ${updated} · unchanged ${unchanged} · archived ${toArchive.length}` +
      (PRUNE ? ` · pruned ${pruned}` : '') +
      (warnings.length ? ` · warnings ${warnings.length}` : '')
  )

  await revalidateSite(created + updated + toArchive.length > 0)
}

async function revalidateSite(hasChanges) {
  if (!hasChanges) return

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://therobotage.com'
  const secret = process.env.CRON_SECRET
  if (!secret) {
    console.warn('CRON_SECRET is not set - skipping cache revalidation. The site will catch up within 15 minutes.')
    return
  }

  try {
    const response = await fetch(`${siteUrl}/api/revalidate-jobs`, {
      method: 'POST',
      headers: { authorization: `Bearer ${secret}` },
    })
    if (response.ok) {
      console.log(`Revalidated ${siteUrl}/jobs`)
    } else {
      console.warn(`Revalidation returned ${response.status} - the site will catch up within 15 minutes.`)
    }
  } catch (error) {
    // Non-fatal: the 15-minute revalidate window is the backstop.
    console.warn(`Revalidation request failed (${error.message}) - the site will catch up within 15 minutes.`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
