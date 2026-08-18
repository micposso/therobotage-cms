import { NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { Resend } from 'resend'
import { getSupabaseJobsService } from '@/lib/supabase/admin'
import { mapPublicJobRow, toJobCard, type JobCard, type PublicJobRow } from '@/lib/jobs'
import {
  jobAlertDigestHtml,
  jobAlertDigestSubject,
  oneClickUnsubscribeUrl,
  unsubscribeUrl,
} from '@/lib/jobAlertEmail'

// Weekly job-alert digest.
//
//   curl -H "Authorization: Bearer $CRON_SECRET" https://therobotage.com/api/cron/job-alerts
//
// Triggered externally (GitHub Actions schedule / Railway cron), because frontend/
// deploys to Railway and Vercel Cron is not available. Guard and shape copied from
// lms/src/app/api/cron/*.
//
// Safe to run daily or to re-run after a failure: the send-day guard skips the wrong
// days, and job_alert_sends has a unique (subscriber_id, job_id) constraint, so no
// subscriber can ever receive the same job twice.

export const dynamic = 'force-dynamic'

// Window is wider than the weekly cadence so a skipped run still gets covered.
const LOOKBACK_DAYS = 10
const MAX_JOBS_PER_DIGEST = 12
const SUBSCRIBER_PAGE_SIZE = 500
const RESEND_BATCH_SIZE = 100

const FROM_ADDRESS = process.env.EMAIL_FROM_JOBS ?? 'onboarding@resend.dev'

type Subscriber = {
  id: string
  email: string
  role_families: string[]
  states: string[]
  seniorities: string[]
  remote_only: boolean
  unsubscribe_token: string
  send_count: number
}

// An empty preference array means "everything", so a bare email signup still matches.
function matchesSubscriber(job: JobCard, subscriber: Subscriber): boolean {
  if (subscriber.remote_only && job.remoteType !== 'remote-us') return false
  if (subscriber.role_families.length && !subscriber.role_families.includes(job.roleFamily)) return false
  if (subscriber.seniorities.length && !subscriber.seniorities.includes(job.seniority)) return false
  if (subscriber.states.length) {
    // A fully remote role is open to every state, so it matches any state preference.
    if (job.remoteType !== 'remote-us' && (!job.stateCode || !subscriber.states.includes(job.stateCode))) {
      return false
    }
  }
  return true
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size))
  return out
}

export async function GET(request: Request) {
  const auth = request.headers.get('authorization')
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const force = url.searchParams.get('force') === '1'
  const dryRun = url.searchParams.get('dryRun') === '1'

  // Day guard. Makes a daily or hourly trigger harmless and a missed week recoverable,
  // rather than depending on the external scheduler firing exactly once.
  const sendDay = Number(process.env.JOB_ALERT_SEND_DAY ?? 2)
  if (!force && new Date().getUTCDay() !== sendDay) {
    return NextResponse.json({ ok: true, skipped: 'not send day', sendDay })
  }

  const db = getSupabaseJobsService()
  const digestId = crypto.randomUUID()
  const since = new Date(Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000).toISOString()

  const { data: jobRows, error: jobsError } = await db
    .from('public_jobs')
    .select('*')
    .gte('posted_at', since)
    .order('posted_at', { ascending: false })

  if (jobsError) {
    console.error('job-alerts: failed to load jobs', jobsError)
    return NextResponse.json({ error: 'Failed to load jobs' }, { status: 500 })
  }

  const candidates: JobCard[] = (jobRows as PublicJobRow[] | null ?? []).map((row) =>
    toJobCard(mapPublicJobRow(row))
  )

  if (!candidates.length) {
    return NextResponse.json({ ok: true, digestId, jobsInWindow: 0, digestsSent: 0 })
  }

  const jobIds = candidates.map((job) => job.id)
  const resend = new Resend(process.env.RESEND_API_KEY)

  let subscribersSeen = 0
  let skippedEmpty = 0
  let digestsSent = 0
  const failures: string[] = []
  const plan: { email: string; jobs: string[] }[] = []

  for (let page = 0; ; page += 1) {
    const from = page * SUBSCRIBER_PAGE_SIZE
    const { data: subscriberRows, error: subscribersError } = await db
      .from('job_alert_subscribers')
      .select('id, email, role_families, states, seniorities, remote_only, unsubscribe_token, send_count')
      .eq('status', 'active')
      .range(from, from + SUBSCRIBER_PAGE_SIZE - 1)

    if (subscribersError) {
      console.error('job-alerts: failed to load subscribers', subscribersError)
      return NextResponse.json({ error: 'Failed to load subscribers' }, { status: 500 })
    }

    const subscribers = (subscriberRows ?? []) as Subscriber[]
    if (!subscribers.length) break
    subscribersSeen += subscribers.length

    // One dedupe query per page, never one per subscriber.
    const { data: sentRows } = await db
      .from('job_alert_sends')
      .select('subscriber_id, job_id')
      .in('subscriber_id', subscribers.map((s) => s.id))
      .in('job_id', jobIds)

    const alreadySent = new Set((sentRows ?? []).map((r) => `${r.subscriber_id}:${r.job_id}`))

    const digests = subscribers
      .map((subscriber) => {
        const matches = candidates
          .filter((job) => matchesSubscriber(job, subscriber))
          .filter((job) => !alreadySent.has(`${subscriber.id}:${job.id}`))
          .slice(0, MAX_JOBS_PER_DIGEST)
        return { subscriber, matches }
      })
      .filter(({ matches }) => {
        // An empty digest is the fastest route to an unsubscribe.
        if (!matches.length) {
          skippedEmpty += 1
          return false
        }
        return true
      })

    if (dryRun) {
      for (const { subscriber, matches } of digests) {
        plan.push({ email: subscriber.email, jobs: matches.map((j) => j.slug) })
      }
      if (subscribers.length < SUBSCRIBER_PAGE_SIZE) break
      continue
    }

    for (const batch of chunk(digests, RESEND_BATCH_SIZE)) {
      // Claim first. A crash between claim and send costs one missed job; claiming after
      // sending would risk duplicate emails, which is far worse.
      const claims = batch.flatMap(({ subscriber, matches }) =>
        matches.map((job) => ({
          subscriber_id: subscriber.id,
          job_id: job.id,
          digest_id: digestId,
        }))
      )

      const { error: claimError } = await db
        .from('job_alert_sends')
        .upsert(claims, { onConflict: 'subscriber_id,job_id', ignoreDuplicates: true })

      if (claimError) {
        console.error('job-alerts: failed to claim sends', claimError)
        failures.push(`claim: ${claimError.message}`)
        continue
      }

      const { error: sendError } = await resend.batch.send(
        batch.map(({ subscriber, matches }) => ({
          from: FROM_ADDRESS,
          to: subscriber.email,
          subject: jobAlertDigestSubject(matches),
          html: jobAlertDigestHtml({
            jobs: matches,
            unsubscribeToken: subscriber.unsubscribe_token,
            campaign: 'job-alerts-weekly',
          }),
          // Required by Gmail and Yahoo for bulk senders (RFC 8058). Without these,
          // deliverability degrades regardless of content quality.
          headers: {
            'List-Unsubscribe': `<${oneClickUnsubscribeUrl(subscriber.unsubscribe_token)}>, <${unsubscribeUrl(subscriber.unsubscribe_token)}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          },
        }))
      )

      if (sendError) {
        console.error('job-alerts: batch send failed', sendError)
        failures.push(`send: ${sendError.message}`)
        // Release the claims so the next run retries this batch.
        await db.from('job_alert_sends').delete().eq('digest_id', digestId).in(
          'subscriber_id',
          batch.map(({ subscriber }) => subscriber.id)
        )
        continue
      }

      digestsSent += batch.length

      await Promise.all(
        batch.map(({ subscriber }) =>
          db
            .from('job_alert_subscribers')
            .update({
              last_sent_at: new Date().toISOString(),
              send_count: subscriber.send_count + 1,
              updated_at: new Date().toISOString(),
            })
            .eq('id', subscriber.id)
        )
      )
    }

    if (subscribers.length < SUBSCRIBER_PAGE_SIZE) break
  }

  return NextResponse.json({
    ok: true,
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
