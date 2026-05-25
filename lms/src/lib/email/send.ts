import { resend, FROM_ADDRESS, BASE_URL } from '@/lib/resend'

export async function sendWelcome({
  to,
  name,
  courseSlug,
}: {
  to: string
  name: string
  courseSlug: string
}) {
  return resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: `Welcome to The Robot Age.`,
    html: `
      <p>Hi ${name},</p>
      <p>You're enrolled. Your first week will unlock on your cohort start date.</p>
      <p><a href="${BASE_URL}/dashboard">Go to your dashboard →</a></p>
    `,
  })
}

export async function sendWeekUnlocked({
  to,
  name,
  weekNumber,
  dueDate,
}: {
  to: string
  name: string
  weekNumber: number
  dueDate: string | null
}) {
  return resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: `Week ${weekNumber} is now open.`,
    html: `
      <p>Hi ${name},</p>
      <p>Week ${weekNumber} of your course is now available.</p>
      ${dueDate ? `<p>Deliverable due: <strong>${dueDate}</strong></p>` : ''}
      <p><a href="${BASE_URL}/dashboard">Go to your dashboard →</a></p>
    `,
  })
}

export async function sendWeekSummary({
  to,
  name,
  weekNumber,
  state,
  cohortName,
}: {
  to: string
  name: string
  weekNumber: number
  state: string
  cohortName: string
}) {
  const statusLine =
    state === 'submitted' ? 'Your deliverable is submitted and awaiting feedback.'
    : state === 'complete' ? 'Week complete — great work!'
    : state === 'revision_requested' ? 'Your deliverable was returned for revision.'
    : 'Week still in progress.'

  return resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: `${cohortName} — Week ${weekNumber} summary`,
    html: `
      <p>Hi ${name},</p>
      <p><strong>Week ${weekNumber} wrap-up:</strong> ${statusLine}</p>
      <p><a href="${BASE_URL}/dashboard">Go to your dashboard →</a></p>
    `,
  })
}

export async function sendDeadlineReminder({
  to,
  name,
  weekNumber,
  dueDate,
  hoursRemaining,
}: {
  to: string
  name: string
  weekNumber: number
  dueDate: string
  hoursRemaining: number
}) {
  const urgency = hoursRemaining <= 6 ? 'tonight' : hoursRemaining <= 24 ? 'tomorrow' : 'in 2 days'
  return resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: `Week ${weekNumber} deliverable due ${urgency}.`,
    html: `
      <p>Hi ${name},</p>
      <p>Your Week ${weekNumber} deliverable is due <strong>${dueDate}</strong> (${hoursRemaining}h remaining).</p>
      <p><a href="${BASE_URL}/dashboard">Submit your deliverable →</a></p>
    `,
  })
}

export async function sendSubmissionReceived({
  to,
  name,
  weekNumber,
}: {
  to: string
  name: string
  weekNumber: number
}) {
  return resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: `Week ${weekNumber} deliverable received.`,
    html: `
      <p>Hi ${name},</p>
      <p>Your Week ${weekNumber} deliverable has been submitted. You'll receive feedback within 5 business days.</p>
      <p><a href="${BASE_URL}/dashboard">View your dashboard →</a></p>
    `,
  })
}

export async function sendFeedbackReceived({
  to,
  name,
  weekNumber,
  decision,
  comment,
  instructorName,
}: {
  to: string
  name: string
  weekNumber: number
  decision: 'approved' | 'revision_requested'
  comment: string
  instructorName: string
}) {
  const outcome = decision === 'approved'
    ? `Week ${weekNumber} approved`
    : `Week ${weekNumber} returned for revision`

  return resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: `${outcome}.`,
    html: `
      <p>Hi ${name},</p>
      <p><strong>${outcome}.</strong></p>
      <p>${comment}</p>
      <p>— ${instructorName}</p>
      <p><a href="${BASE_URL}/dashboard">View feedback →</a></p>
    `,
  })
}

export async function sendFootageReady({
  to,
  name,
  weekNumber,
}: {
  to: string
  name: string
  weekNumber: number
}) {
  return resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: 'Your robot footage is ready.',
    html: `
      <p>Hi ${name},</p>
      <p>Your Reachy Mini session footage from Week ${weekNumber} is now available.</p>
      <p><a href="${BASE_URL}/footage">View your footage →</a></p>
    `,
  })
}

export async function sendPeerReviewAssigned({
  to,
  name,
}: {
  to: string
  name: string
}) {
  return resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: 'Peer review assigned.',
    html: `
      <p>Hi ${name},</p>
      <p>A Robot Readiness Audit has been assigned to you for peer review.</p>
      <p><a href="${BASE_URL}/peer-review">Begin peer review →</a></p>
    `,
  })
}

export async function sendCredentialIssued({
  to,
  name,
  courseSlug,
  badgeUrl,
  publicUrl,
  isFounding,
}: {
  to: string
  name: string
  courseSlug: string
  badgeUrl: string | null
  publicUrl: string | null
  isFounding: boolean
}) {
  const foundingLine = isFounding
    ? '<p>As a founding cohort member, your credential carries a special founding distinction.</p>'
    : ''

  return resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: 'Your Robot Experience Professional credential has been issued.',
    html: `
      <p>Hi ${name},</p>
      <p>Congratulations — your REP credential for <strong>${courseSlug}</strong> has been issued.</p>
      ${foundingLine}
      ${publicUrl ? `<p><a href="${publicUrl}">View your credential →</a></p>` : ''}
      ${badgeUrl ? `<p><a href="${badgeUrl}">View your digital badge →</a></p>` : ''}
      <p><a href="${BASE_URL}/profile/credentials">See all credentials →</a></p>
    `,
  })
}
