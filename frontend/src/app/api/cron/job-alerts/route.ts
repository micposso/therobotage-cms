import { NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { Resend } from 'resend'
import { emptyFilters, matchesFilters } from '@/lib/jobFilters'
import { getSupabaseJobsService } from '@/lib/supabase/admin'
import { mapPublicJobRow, toJobCard, type JobCard, type PublicJobRow } from '@/lib/jobs'
import {
  getJobAlertAdminAddress,
  getJobAlertFromAddress,
  jobAlertDigestHtml,
  jobAlertDigestSubject,
  jobAlertUnsubscribeHeaders,
} from '@/lib/jobAlertEmail'

// Weekly job-alert digest.
//
//   curl -H "Authorization: Bearer $CRON_SECRET" https://therobotage.com/api/cron/job-alerts
//
// Triggered externally (GitHub Actions schedule / Railway cron), because frontend/
// deploys to Railway and Vercel Cron is not available. Guard and shape copied from
// lms/src/app/api/cron/*.
export const dynamic = 'force-dynamic'

// Allow some overlap between weekly runs so scheduler delays do not leave gaps.
const LOOKBACK_DAYS = 10
const DAY_MS = 24 * 60 * 60 * 1000
const MAX_JOBS_PER_DIGEST = 12
const ROW_PAGE_SIZE = 500
// Keep both the PostgREST URL and the claim response small enough for one request.
const SUBSCRIBER_PAGE_SIZE = 40

const FROM_ADDRESS = getJobAlertFromAddress()

type Subscriber = {
  id: string
  email: string
  role_families: string[]
  states: string[]
  seniorities: string[]
  remote_only: boolean
  unsubscribe_token: string
  send_count: number
  last_sent_at: string | null
}

type SendKey = { subscriber_id: string; job_id: string }
const sendKey = ({ subscriber_id, job_id }: SendKey) => `${subscriber_id}:${job_id}`

type JobsDb = ReturnType<typeof getSupabaseJobsService>

async function loadCandidates(db: JobsDb, since: string): Promise<JobCard[]> {
  const candidates: JobCard[] = []
  for (let from = 0; ; from += ROW_PAGE_SIZE) {
    const { data, error } = await db
      .from('public_jobs')
      .select('*')
      .gte('posted_at', since)
      .order('posted_at', { ascending: false })
      .order('id')
      .range(from, from + ROW_PAGE_SIZE - 1)
    if (error) throw error
    const rows = (data ?? []) as PublicJobRow[]
    candidates.push(...rows.map((row) => toJobCard(mapPublicJobRow(row))))
    if (rows.length < ROW_PAGE_SIZE) return candidates
  }
}

async function loadSendHistory(db: JobsDb, subscriberIds: string[], since: string): Promise<Set<string>> {
  const sent = new Set<string>()
  for (let from = 0; ; from += ROW_PAGE_SIZE) {
    const { data, error } = await db
      .from('job_alert_sends')
      .select('subscriber_id, job_id, jobs!inner()')
      .in('subscriber_id', subscriberIds)
      .gte('jobs.posted_at', since)
      .order('id')
      .range(from, from + ROW_PAGE_SIZE - 1)
    if (error) throw error
    const rows = (data ?? []) as SendKey[]
    for (const row of rows) sent.add(sendKey(row))
    if (rows.length < ROW_PAGE_SIZE) return sent
  }
}

export async function GET(request: Request) {
  const auth = request.headers.get('authorization')
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const force = url.searchParams.get('force') === '1'
  const dryRun = url.searchParams.get('dryRun') === '1'

  const configuredDay = process.env.JOB_ALERT_SEND_DAY?.trim() || '2'
  if (!/^[0-6]$/.test(configuredDay)) {
    return NextResponse.json({ error: 'JOB_ALERT_SEND_DAY must be a UTC weekday (0 to 6)' }, { status: 500 })
  }
  const sendDay = Number(configuredDay)
  const now = new Date()
  const daysSinceSendDay = (now.getUTCDay() - sendDay + 7) % 7
  if (!force && !dryRun && daysSinceSendDay !== 0) {
    return NextResponse.json({ ok: true, skipped: 'not send day', sendDay, failures: [] })
  }

  const weekStart = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysSinceSendDay)

  const digestId = crypto.randomUUID()
  const since = new Date(now.getTime() - LOOKBACK_DAYS * DAY_MS).toISOString()

  let db: JobsDb
  let candidates: JobCard[]
  try {
    db = getSupabaseJobsService()
    candidates = await loadCandidates(db, since)
  } catch (error) {
    console.error('job-alerts: failed to load jobs', error)
    return NextResponse.json({ error: 'Failed to load jobs' }, { status: 500 })
  }

  if (!candidates.length) {
    return NextResponse.json({
      ok: true, digestId, dryRun, jobsInWindow: 0, subscribers: 0, digestsSent: 0,
      skippedEmpty: 0, failures: [], ...(dryRun && { plan: [] }),
    })
  }

  if (!dryRun && !process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Resend is not configured' }, { status: 500 })
  }
  const resend = dryRun ? null : new Resend(process.env.RESEND_API_KEY)

  let subscribersSeen = 0
  let skippedEmpty = 0
  let digestsSent = 0
  const failures: string[] = []
  const plan: { email: string; jobs: string[] }[] = []

  let lastSubscriberId: string | undefined
  while (true) {
    const query = db
      .from('job_alert_subscribers')
      .select('id, email, role_families, states, seniorities, remote_only, unsubscribe_token, send_count, last_sent_at')
      .eq('status', 'active')
      .order('id')
      .limit(SUBSCRIBER_PAGE_SIZE)
    if (lastSubscriberId) query.gt('id', lastSubscriberId)
    const { data: subscriberRows, error: subscribersError } = await query

    if (subscribersError) {
      console.error('job-alerts: failed to load subscribers', subscribersError)
      return NextResponse.json({ error: 'Failed to load subscribers' }, { status: 500 })
    }

    const subscribers = (subscriberRows ?? []) as Subscriber[]
    if (!subscribers.length) break
    lastSubscriberId = subscribers[subscribers.length - 1].id
    subscribersSeen += subscribers.length

    const eligible = subscribers.filter((subscriber) =>
      !subscriber.last_sent_at || Date.parse(subscriber.last_sent_at) < weekStart
    )
    if (!eligible.length) continue

    let alreadySent: Set<string>
    try {
      alreadySent = await loadSendHistory(db, eligible.map((subscriber) => subscriber.id), since)
    } catch (error) {
      console.error('job-alerts: failed to load send history', error)
      failures.push('Failed to load send history')
      continue
    }

    const digests = []
    for (const subscriber of eligible) {
      const filters = {
        ...emptyFilters,
        role: subscriber.role_families,
        level: subscriber.seniorities,
        state: subscriber.states,
        remote: subscriber.remote_only ? ['remote-us'] : [],
      }
      const matches = candidates.filter((job) =>
        matchesFilters(job, filters) && !alreadySent.has(`${subscriber.id}:${job.id}`)
      ).slice(0, MAX_JOBS_PER_DIGEST)
      if (matches.length) digests.push({ subscriber, matches })
      else skippedEmpty += 1
    }

    if (!digests.length) continue
    if (!resend) {
      for (const { subscriber, matches } of digests) {
        plan.push({ email: subscriber.email, jobs: matches.map((job) => job.slug) })
      }
      continue
    }

    // A successful upsert can include conflicts from an overlapping invocation.
    // Only its returned rows belong to this run.
    const claims = digests.flatMap(({ subscriber, matches }) =>
      matches.map((job) => ({ subscriber_id: subscriber.id, job_id: job.id, digest_id: digestId }))
    )
    const { data: claimedRows, error: claimError } = await db
      .from('job_alert_sends')
      .upsert(claims, { onConflict: 'subscriber_id,job_id', ignoreDuplicates: true })
      .select('subscriber_id, job_id')

    if (claimError) {
      console.error('job-alerts: failed to claim sends', claimError)
      failures.push('Failed to claim sends')
      continue
    }

    const claimed = new Set(((claimedRows ?? []) as SendKey[]).map(sendKey))
    const batch = digests.map(({ subscriber, matches }) => ({
      subscriber,
      matches: matches.filter((job) => claimed.has(`${subscriber.id}:${job.id}`)),
    })).filter(({ matches }) => matches.length > 0)
    if (!batch.length) continue

    const emails = batch.map(({ subscriber, matches }) => ({
      from: FROM_ADDRESS,
      to: subscriber.email,
      replyTo: getJobAlertAdminAddress(),
      subject: jobAlertDigestSubject(matches),
      html: jobAlertDigestHtml({
        jobs: matches,
        unsubscribeToken: subscriber.unsubscribe_token,
        campaign: 'job-alerts-weekly',
      }),
      headers: jobAlertUnsubscribeHeaders(subscriber.unsubscribe_token),
    }))
    const options = { idempotencyKey: `job-alerts/${digestId}/${lastSubscriberId}` }
    let result = await resend.batch.send(emails, options)
    const firstError = result.error
    const acceptanceUnknown = firstError && (
      firstError.statusCode == null || firstError.statusCode === 408 || firstError.statusCode >= 500
    )
    // Resend can accept a request before the connection fails. Retry the exact
    // batch with the same key so that acceptance can be recovered without a second send.
    if (acceptanceUnknown) result = await resend.batch.send(emails, options)
    const { data, error: sendError } = result

    if (sendError) {
      console.error('job-alerts: batch send failed', sendError)
      failures.push('Batch send failed')
      // A timeout or server failure can occur after acceptance. Release claims only
      // when Resend explicitly rejected the batch so a rerun cannot resend it.
      if (acceptanceUnknown || sendError.statusCode === 409) continue
      const { error: releaseError } = await db.from('job_alert_sends')
        .delete()
        .eq('digest_id', digestId)
        .in('subscriber_id', batch.map(({ subscriber }) => subscriber.id))
      if (releaseError) {
        console.error('job-alerts: failed to release send claims', releaseError)
        failures.push('Failed to release send claims')
      }
      continue
    }

    if (data?.data?.length !== batch.length) {
      console.error('job-alerts: batch response did not confirm every email')
      failures.push('Batch acceptance could not be verified')
      continue
    }

    digestsSent += batch.length

    const sentAt = new Date().toISOString()
    const updates = await Promise.all(
      batch.map(({ subscriber }) =>
        db
          .from('job_alert_subscribers')
          .update({
            last_sent_at: sentAt,
            send_count: subscriber.send_count + 1,
            updated_at: sentAt,
          })
          .eq('id', subscriber.id)
      )
    )
    for (const { error } of updates) {
      if (!error) continue
      console.error('job-alerts: failed to update send statistics', error)
      failures.push('Failed to update send statistics')
    }
  }

  return NextResponse.json({
    ok: failures.length === 0,
    digestId,
    dryRun,
    jobsInWindow: candidates.length,
    subscribers: subscribersSeen,
    digestsSent,
    skippedEmpty,
    failures,
    ...(dryRun && { plan }),
  })
}
