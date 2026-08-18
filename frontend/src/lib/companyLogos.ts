import 'server-only'
import fs from 'node:fs'
import path from 'node:path'
import { mapPublicJobRow, type JobDetail, type PublicJobRow } from './jobs'

// Company logos live in public/logos/ (Next only serves static files from public/,
// never from jobs/) and are named "<slug-prefix>-logo.<ext>" -- e.g. "agility-logo.png"
// matches the "agility" company slug, "amazon-logo.png" matches "amazon-robotics". A
// file dropped in here is picked up on the next server start with no _companies.yml
// edit needed. An explicit logo_url already set on the company (in _companies.yml or
// the companies table) always wins over this lookup.
const LOGO_DIR = path.join(process.cwd(), 'public', 'logos')
const LOGO_SUFFIX = '-logo'

let manifest: [prefix: string, url: string][] | null = null

function loadManifest(): [string, string][] {
  if (manifest) return manifest

  let files: string[] = []
  try {
    files = fs.readdirSync(LOGO_DIR)
  } catch {
    manifest = []
    return manifest
  }

  manifest = files.flatMap((file) => {
    const base = path.basename(file, path.extname(file))
    if (!base.endsWith(LOGO_SUFFIX) || file === 'placeholder.jpg') return []
    return [[base.slice(0, -LOGO_SUFFIX.length), `/logos/${file}`]]
  })

  return manifest
}

// Longest matching prefix wins, so a more specific logo added later (e.g. a second
// "amazon-*" company) takes priority over a shorter, more generic one.
export function resolveCompanyLogoUrl(companySlug: string): string | null {
  let best: string | null = null
  let bestLength = -1

  for (const [prefix, url] of loadManifest()) {
    const matches = companySlug === prefix || companySlug.startsWith(`${prefix}-`)
    if (matches && prefix.length > bestLength) {
      best = url
      bestLength = prefix.length
    }
  }

  return best
}

export function mapPublicJobRowWithLogo(row: PublicJobRow): JobDetail {
  const job = mapPublicJobRow(row)
  if (job.companyLogoUrl) return job
  return { ...job, companyLogoUrl: resolveCompanyLogoUrl(job.companySlug) }
}
