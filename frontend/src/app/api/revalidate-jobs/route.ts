import { NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { JOBS_CACHE_TAG } from '@/lib/jobs'

// Called by scripts/publish-jobs.mjs after a successful publish so the site reflects new
// listings in seconds rather than waiting out the 15-minute revalidate window.

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const auth = request.headers.get('authorization')
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Next 16 requires a cache-life profile as the second argument. `{ expire: 0 }` is the
  // documented form for webhooks and external systems that need data to expire
  // immediately, which is exactly what the publish script needs.
  revalidateTag(JOBS_CACHE_TAG, { expire: 0 })
  revalidatePath('/jobs')
  revalidatePath('/sitemap.xml')

  console.log(`revalidate-jobs: purged ${JOBS_CACHE_TAG}, /jobs, /sitemap.xml`)

  return NextResponse.json({ ok: true, revalidated: [JOBS_CACHE_TAG, '/jobs', '/sitemap.xml'] })
}
