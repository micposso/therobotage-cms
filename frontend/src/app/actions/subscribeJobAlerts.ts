'use server'

import crypto from 'node:crypto'
import { headers } from 'next/headers'
import { Resend } from 'resend'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { jobAlertWelcomeHtml } from '@/lib/jobAlertEmail'
import {
  ROLE_FAMILY_LABELS,
  ROLE_FAMILY_SLUGS,
  SENIORITY_LABELS,
  SENIORITY_SLUGS,
  STATE_CODES,
  STATE_NAMES,
} from '@/lib/jobsTaxonomy'

const FROM_ADDRESS = process.env.EMAIL_FROM_JOBS ?? 'onboarding@resend.dev'
const ADMIN_ADDRESS = process.env.JOB_ALERT_ADMIN_EMAIL
const FALLBACK_SIGNUP_RECIPIENT =
  process.env.JOB_ALERT_ADMIN_EMAIL ?? process.env.EMAIL_FROM_HELLO ?? 'hello@therobotage.com'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://therobotage.com'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_FILL_MS = 2000
const RATE_LIMIT_PER_HOUR = 3

type State = { success: boolean; error?: string; title?: string; body?: string }

function pickAllowed(formData: FormData, field: string, allowed: readonly string[]): string[] {
  return formData
    .getAll(field)
    .map((value) => String(value))
    .filter((value) => value && allowed.includes(value))
}

function describeFilters(roles: string[], levels: string[], states: string[], remoteOnly: boolean): string {
  const parts: string[] = []

  parts.push(roles.length ? roles.map((r) => ROLE_FAMILY_LABELS[r] ?? r).join(', ') : 'All disciplines')
  if (levels.length) parts.push(levels.map((l) => SENIORITY_LABELS[l] ?? l).join(', '))
  if (states.length) parts.push(states.map((s) => STATE_NAMES[s] ?? s).join(', '))
  if (remoteOnly) parts.push('Remote roles only')

  return parts.join(' · ')
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function manualSignupHtml({
  email,
  filterSummary,
  source,
}: {
  email: string
  filterSummary: string
  source: string | null
}) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
      <h1 style="font-size: 20px;">Job alert signup fallback</h1>
      <p>The Supabase signup path failed, so this lead was captured by email.</p>
      <ul>
        <li><strong>Email:</strong> ${escapeHtml(email)}</li>
        <li><strong>Filters:</strong> ${escapeHtml(filterSummary)}</li>
        <li><strong>Source:</strong> ${escapeHtml(source ?? 'unknown')}</li>
      </ul>
    </div>
  `
}

function fallbackConfirmationHtml() {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
      <h1 style="font-size: 20px;">We received your robotics job alert signup.</h1>
      <p>Thanks for signing up. The Robot Age is finishing the job alert system, and we will add you to the weekly robotics jobs list once it is connected.</p>
      <p>In the meantime, you can browse current roles at <a href="${escapeHtml(SITE_URL)}/jobs">${escapeHtml(SITE_URL)}/jobs</a>.</p>
    </div>
  `
}

async function captureManualSignup({
  email,
  filterSummary,
  source,
}: {
  email: string
  filterSummary: string
  source: string | null
}): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) return false

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error: adminError } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: FALLBACK_SIGNUP_RECIPIENT,
    subject: 'Manual robotics job alert signup',
    html: manualSignupHtml({ email, filterSummary, source }),
  })

  if (adminError) {
    console.error('Job alert fallback capture error:', adminError)
    return false
  }

  const { error: confirmError } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: 'We received your robotics job alert signup',
    html: fallbackConfirmationHtml(),
  })

  if (confirmError) {
    console.error('Job alert fallback confirmation error:', confirmError)
  }

  return true
}

async function fallbackSuccess(
  email: string,
  filterSummary: string,
  source: string | null
): Promise<State | null> {
  const captured = await captureManualSignup({ email, filterSummary, source })
  if (!captured) return null

  return {
    success: true,
    title: 'We received it.',
    body:
      'Your signup was captured. We are finishing the alert system and will add you to the weekly robotics jobs list once it is connected.',
  }
}

export async function subscribeJobAlerts(
  prevState: State | null,
  formData: FormData
): Promise<State> {
  // Honeypot. Bots fill every field they find; a filled value gets a success response so
  // the trap is never revealed.
  if ((formData.get('company_website') as string | null)?.trim()) {
    return { success: true }
  }

  // Time trap. A human takes longer than two seconds to read the form and type.
  const startedAt = Number(formData.get('startedAt'))
  if (Number.isFinite(startedAt) && Date.now() - startedAt < MIN_FILL_MS) {
    return { success: true }
  }

  const email = (formData.get('email') as string | null)?.trim().toLowerCase()
  if (!email || !EMAIL_RE.test(email)) {
    return { success: false, error: 'Please enter a valid email address.' }
  }

  const roleFamilies = pickAllowed(formData, 'role_families', ROLE_FAMILY_SLUGS)
  const seniorities = pickAllowed(formData, 'seniorities', SENIORITY_SLUGS)
  const states = pickAllowed(formData, 'states', STATE_CODES)
  const remoteOnly = formData.get('remote_only') === 'on'
  const source = (formData.get('source') as string | null)?.slice(0, 80) ?? null
  const filterSummary = describeFilters(roleFamilies, seniorities, states, remoteOnly)

  try {
    const db = getSupabaseAdmin()
    const headerList = await headers()

    // Rate limit keyed on a hashed IP. DB-backed rather than an in-memory Map so it
    // survives deploys and works across multiple Railway replicas, with no new dependency.
    const salt = process.env.JOB_ALERT_IP_SALT ?? ''
    const forwardedFor = headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? ''
    const ipHash = forwardedFor
      ? crypto.createHash('sha256').update(`${forwardedFor}${salt}`).digest('hex')
      : null

    if (ipHash) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
      const { count } = await db
        .from('job_alert_subscribers')
        .select('id', { count: 'exact', head: true })
        .eq('signup_ip_hash', ipHash)
        .gte('created_at', oneHourAgo)

      if ((count ?? 0) >= RATE_LIMIT_PER_HOUR) {
        return { success: false, error: 'Too many signups from this connection. Try again later.' }
      }
    }

    // A returning subscriber who previously opted out must be reactivated rather than
    // silently swallowed by the unique email constraint.
    const { data: subscriber, error } = await db
      .from('job_alert_subscribers')
      .upsert(
        {
          email,
          role_families: roleFamilies,
          states,
          seniorities,
          remote_only: remoteOnly,
          status: 'active',
          unsubscribed_at: null,
          source,
          signup_ip_hash: ipHash,
          user_agent: headerList.get('user-agent')?.slice(0, 255) ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'email' }
      )
      .select('unsubscribe_token')
      .single()

    if (error || !subscriber) {
      console.error('subscribeJobAlerts upsert error:', error)
      const fallback = await fallbackSuccess(email, filterSummary, source)
      if (fallback) return fallback

      return { success: false, error: 'Something went wrong. Please try again.' }
    }

    const params = new URLSearchParams()
    if (roleFamilies.length) params.set('role', roleFamilies.join(','))
    if (seniorities.length) params.set('level', seniorities.join(','))
    if (states.length) params.set('state', states.join(','))
    if (remoteOnly) params.set('remote', 'remote-us')
    const browseUrl = `${SITE_URL}/jobs${params.toString() ? `?${params}` : ''}`

    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error: sendError } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      ...(ADMIN_ADDRESS && { bcc: ADMIN_ADDRESS }),
      subject: 'Your robotics job alerts are on',
      html: jobAlertWelcomeHtml({
        filterSummary,
        browseUrl,
        unsubscribeToken: subscriber.unsubscribe_token,
      }),
    })

    if (sendError) {
      // The subscription itself succeeded, so do not fail the user-facing flow.
      console.error('Job alert welcome email error:', sendError)
    }

    return { success: true }
  } catch (err) {
    console.error('subscribeJobAlerts error:', err)
    const fallback = await fallbackSuccess(email, filterSummary, source)
    if (fallback) return fallback

    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}
