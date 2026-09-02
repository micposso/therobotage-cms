import { bulkEmailHtml, escapeHtml } from './emailTemplate'
import { formatLocation, formatSalary, type JobCard } from './jobs'
import { REMOTE_TYPE_LABELS, SENIORITY_LABELS } from './jobsTaxonomy'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://therobotage.com'
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

export function jobUrl(slug: string, campaign: string): string {
  return `${SITE_URL}/jobs/${slug}?utm_source=digest&utm_medium=email&utm_campaign=${campaign}`
}

export function unsubscribeUrl(token: string): string {
  return `${SITE_URL}/jobs/alerts/unsubscribe?token=${token}`
}

export function oneClickUnsubscribeUrl(token: string): string {
  return `${SITE_URL}/api/jobs/alerts/unsubscribe?token=${token}`
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
      Everything below was posted in the last week and matches the filters you signed up
      with. Applications go directly to the employer.
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

export function jobAlertWelcomeHtml(options: {
  filterSummary: string
  browseUrl: string
  unsubscribeToken: string
}): string {
  const content = `
    <h1 style="${HEADING}">Job alerts are on.</h1>

    <p style="${BODY}margin:0 0 16px;">
      Every Tuesday you will get one email with the robotics roles posted that week that
      match what you asked for. If nothing matches, we send nothing.
    </p>

    <p style="${EYEBROW}margin:0 0 10px;">What you asked for</p>
    <p style="${BODY}margin:0 0 28px;">${escapeHtml(options.filterSummary)}</p>

    <table cellpadding="0" cellspacing="0" style="margin:0 0 8px;">
      <tr>
        <td style="background:#9b5152;">
          <a href="${options.browseUrl}"
             style="display:inline-block;padding:14px 28px;font-family:Arial,sans-serif;font-size:12px;font-weight:500;letter-spacing:0.08em;color:#ffffff;text-decoration:none;">
            Browse those roles now &rarr;
          </a>
        </td>
      </tr>
    </table>
  `

  return bulkEmailHtml(content, {
    unsubscribeUrl: unsubscribeUrl(options.unsubscribeToken),
    reason: 'You are receiving this because you just subscribed to robotics job alerts at therobotage.com.',
  })
}
