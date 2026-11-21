import { bulkEmailHtml, emailHtml, escapeHtml } from './emailTemplate'
import { formatLocation, formatSalary, type JobCard } from './jobs'
import { REMOTE_TYPE_LABELS, SENIORITY_LABELS } from './jobsTaxonomy'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://therobotage.com').replace(/\/+$/, '')
const VERIFIED_JOBS_FROM_ADDRESS = 'jobs@send.therobotage.com'

const HEADING =
  'font-family:Arial,sans-serif;font-weight:400;font-size:24px;letter-spacing:-0.02em;line-height:1.15;color:#0D0D0D;margin:0 0 20px;'
const BODY = 'font-family:Georgia,serif;font-size:15px;line-height:1.75;color:#2A2A28;'
const EYEBROW =
  'font-family:Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#9b5152;'

export function getJobAlertFromAddress(): string {
  const configured = process.env.EMAIL_FROM_JOBS?.trim()
  if (!configured || configured === 'jobs@therobotage.com') return VERIFIED_JOBS_FROM_ADDRESS
  return configured
}

export function getJobAlertAdminAddress(): string {
  return process.env.JOB_ALERT_ADMIN_EMAIL?.trim() || 'mike@therobotage.com'
}

export function jobUrl(slug: string, campaign: string): string {
  return `${SITE_URL}/jobs/${slug}?utm_source=digest&utm_medium=email&utm_campaign=${campaign}`
}

export function unsubscribeUrl(token: string): string {
  return `${SITE_URL}/jobs/alerts/unsubscribe?token=${token}`
}

export function jobAlertUnsubscribeHeaders(token: string): Record<string, string> {
  return {
    'List-Unsubscribe': `<${SITE_URL}/api/jobs/alerts/unsubscribe?token=${token}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  }
}

// A static weekly subject gets threaded and collapsed in Gmail, so the top role is
// named explicitly every time.
export function jobAlertDigestSubject(jobs: JobCard[]): string {
  if (jobs.length === 1) {
    const [job] = jobs
    return `New robotics job: ${job.title} at ${job.companyName}`
  }
  const [top] = jobs
  return `New robotics jobs: ${top.title} at ${top.companyName} + ${jobs.length - 1} more`
}

function jobRow(job: JobCard, campaign: string): string {
  const salary = formatSalary(job)
  const meta = [
    job.companyName,
    formatLocation(job),
    REMOTE_TYPE_LABELS[job.remoteType] ?? job.remoteType,
    SENIORITY_LABELS[job.seniority] ?? job.seniority,
  ]
    .filter(Boolean)
    .map(escapeHtml)
    .join(' &nbsp;·&nbsp; ')

  return `
    <div style="padding:20px 0;border-top:1px solid #e0e0e0;">
      <a href="${jobUrl(job.slug, campaign)}"
         style="font-family:Arial,sans-serif;font-size:17px;font-weight:500;color:#0D0D0D;text-decoration:none;">
        ${escapeHtml(job.title)}
      </a>
      <p style="font-family:Georgia,serif;font-size:12px;color:#666;margin:6px 0 10px;">
        ${meta}${salary ? ` &nbsp;·&nbsp; <strong style="color:#9b5152;">${escapeHtml(salary)}</strong>` : ''}
      </p>
      <p style="${BODY}font-size:14px;margin:0;">
        ${escapeHtml(job.summary)}
      </p>
    </div>
  `
}

export function jobAlertDigestHtml(options: {
  jobs: JobCard[]
  unsubscribeToken: string
  campaign: string
}): string {
  const { jobs, unsubscribeToken, campaign } = options

  const headline =
    jobs.length === 1
      ? 'One new robotics role this week.'
      : `${jobs.length} new robotics roles this week.`

  const content = `
    <h1 style="${HEADING}">${headline}</h1>

    <p style="${BODY}margin:0 0 8px;">
      These recently posted roles match your alert preferences. Applications go directly
      to the employer.
    </p>

    ${jobs.map((job) => jobRow(job, campaign)).join('')}

    <table cellpadding="0" cellspacing="0" style="margin:32px 0 0;">
      <tr>
        <td style="background:#9b5152;">
          <a href="${SITE_URL}/jobs?utm_source=digest&utm_medium=email&utm_campaign=${campaign}"
             style="display:inline-block;padding:14px 28px;font-family:Arial,sans-serif;font-size:12px;font-weight:500;letter-spacing:0.08em;color:#ffffff;text-decoration:none;">
            See all open roles &rarr;
          </a>
        </td>
      </tr>
    </table>

    <hr style="border:none;border-top:1px solid #e0e0e0;margin:36px 0 24px;" />

    <p style="${EYEBROW}margin:0 0 12px;">Worth knowing</p>
    <p style="${BODY}font-size:14px;margin:0;">
      Most robotics teams now interview for judgment about human-robot interaction, not
      just controls. The RXD framework is the vocabulary those conversations use —
      <a href="${SITE_URL}/rxd?utm_source=digest&utm_medium=email&utm_campaign=${campaign}" style="color:#9b5152;">read the framework</a>.
    </p>
  `

  return bulkEmailHtml(content, {
    unsubscribeUrl: unsubscribeUrl(unsubscribeToken),
  })
}

function jobAlertSignupContent(options: {
  heading: string
  message: string
  filterSummary: string
  browseUrl: string
  optOutUrl: string
  optOutLabel: string
  optOutNote?: string
}) {
  return `
    <p style="${EYEBROW}margin:0 0 12px;">Robotics jobs</p>
    <h1 style="${HEADING}font-size:32px;">${options.heading}</h1>
    <p style="${BODY}margin:0 0 24px;">${options.message}</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      <tr>
        <td style="background:#F6F4F2;border-left:3px solid #9b5152;padding:16px 20px;">
          <p style="${EYEBROW}margin:0 0 6px;">Your alert preferences</p>
          <p style="${BODY}margin:0;">${escapeHtml(options.filterSummary)}</p>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
      <tr>
        <td style="background:#9b5152;">
          <a href="${escapeHtml(options.browseUrl)}"
             style="display:inline-block;padding:14px 22px;font-family:Arial,sans-serif;font-size:14px;color:#ffffff;text-decoration:none;">
            Browse robotics jobs &rarr;
          </a>
        </td>
      </tr>
    </table>

    <table role="presentation" cellpadding="0" cellspacing="0">
      <tr>
        <td style="border:1px solid #9b5152;">
          <a href="${escapeHtml(options.optOutUrl)}"
             style="display:inline-block;padding:12px 20px;font-family:Arial,sans-serif;font-size:14px;color:#853F40;text-decoration:none;">
            ${options.optOutLabel}
          </a>
        </td>
      </tr>
    </table>
    ${options.optOutNote ? `<p style="${BODY}font-size:13px;margin:8px 0 0;">${options.optOutNote}</p>` : ''}
  `
}

export function jobAlertWelcomeHtml(options: {
  filterSummary: string
  browseUrl: string
  unsubscribeToken: string
}): string {
  const optOutUrl = unsubscribeUrl(options.unsubscribeToken)
  const content = jobAlertSignupContent({
    ...options,
    heading: 'Your job alerts are on.',
    message: 'We’ll email you on Tuesdays when newly posted robotics roles match your preferences.',
    optOutUrl,
    optOutLabel: 'Unsubscribe',
  })
  return bulkEmailHtml(content, {
    unsubscribeUrl: optOutUrl,
    reason: 'You are receiving this because you just subscribed to robotics job alerts at therobotage.com.',
  })
}

export function jobAlertSignupReceivedHtml(options: {
  email: string
  filterSummary: string
  browseUrl: string
}): string {
  const subject = encodeURIComponent('Cancel my robotics job alert signup')
  const body = encodeURIComponent(`Please cancel the job alert signup for ${options.email}.`)
  return emailHtml(jobAlertSignupContent({
    ...options,
    heading: 'We received your signup request.',
    message: 'Your weekly robotics job alerts are pending. We’ll email you when your subscription is active.',
    optOutUrl: `mailto:${getJobAlertAdminAddress()}?subject=${subject}&body=${body}`,
    optOutLabel: 'Cancel signup request',
    optOutNote: 'Opens an email to The Robot Age to cancel your pending request.',
  }))
}
