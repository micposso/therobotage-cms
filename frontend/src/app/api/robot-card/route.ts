import { Resend } from 'resend'
import { NextResponse, type NextRequest } from 'next/server'
import { emailHtml, escapeHtml } from '@/lib/emailTemplate'
import { getQuizRobot } from '@/lib/quizRobots'

const FROM_ADDRESS = process.env.EMAIL_FROM_RESEARCH ?? 'onboarding@resend.dev'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://therobotage.com'

/**
 * POST /api/robot-card
 * Body: { email: string, robotSlug: string, consent: boolean }
 *
 * Sends the branded robot card by email (links to the shareable result page,
 * which unfurls the full card). This is a SOFT gate — the result is always shown
 * on the page first; this endpoint only mails a copy. If `consent` is true, the
 * address should also be added to the newsletter audience (see TODO below).
 */
export async function POST(req: NextRequest) {
  let body: { email?: unknown; robotSlug?: unknown; consent?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const robotSlug = typeof body.robotSlug === 'string' ? body.robotSlug : ''
  const consent = body.consent === true

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  const robot = getQuizRobot(robotSlug)
  if (!robot) {
    return NextResponse.json({ error: 'Unknown robot.' }, { status: 400 })
  }

  const resultUrl = `${SITE_URL}/what-robot-are-you/${robot.slug}`
  const name = escapeHtml(robot.name)
  const archetype = escapeHtml(robot.archetype)
  const blurb = escapeHtml(robot.learning.use)

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error: sendError } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      bcc: 'mike@therobotage.com',
      subject: `Your robot match: ${robot.name} — ${robot.archetype}`,
      html: emailHtml(`
        <p style="font-family:Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;color:#e85d24;margin:0 0 12px;">
          ${archetype}
        </p>
        <h1 style="font-family:Arial,sans-serif;font-weight:400;font-size:26px;letter-spacing:-0.02em;line-height:1.1;color:#0D0D0D;margin:0 0 20px;">
          You matched with the ${name}
        </h1>

        <p style="font-family:Georgia,serif;font-size:15px;line-height:1.75;color:#2A2A28;margin:0 0 20px;">
          ${blurb}
        </p>

        <table cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
          <tr>
            <td style="background:#0D0D0D;">
              <a href="${resultUrl}"
                 style="display:inline-block;padding:14px 28px;font-family:Arial,sans-serif;font-size:12px;font-weight:500;letter-spacing:0.08em;color:#F5F0E8;text-decoration:none;">
                View &amp; share your card &rarr;
              </a>
            </td>
          </tr>
        </table>

        <h2 style="font-family:Arial,sans-serif;font-size:18px;color:#0D0D0D;margin:0 0 12px;">What to notice</h2>
        <p style="font-family:Georgia,serif;font-size:15px;line-height:1.75;color:#2A2A28;margin:0 0 16px;">
          ${escapeHtml(robot.learning.takeaway)}
        </p>
        <p style="font-family:Arial,sans-serif;font-size:13px;line-height:1.6;margin:0 0 24px;">
          <a href="${escapeHtml(robot.learning.source.url)}" style="color:#9b5152;">${escapeHtml(robot.learning.source.label)}</a>
        </p>

        <p style="font-family:Georgia,serif;font-size:15px;line-height:1.75;color:#2A2A28;margin:0 0 8px;">
          Curious about the world behind the quiz? Learn to read robot demos, understand autonomy, and ask better questions about robots with Robot Literacy.
        </p>
        <p style="font-family:Georgia,serif;font-size:15px;line-height:1.75;color:#2A2A28;margin:0;">
          <a href="${SITE_URL}/robot-literacy" style="color:#9b5152;text-decoration:none;">Explore Robot Literacy &rarr;</a>
        </p>
      `),
    })

    if (sendError) {
      console.error('robot-card send error:', sendError)
      return NextResponse.json({ error: 'Something went wrong sending your card.' }, { status: 502 })
    }

    // TODO: if `consent` is true, add `email` to the newsletter audience / CRM.
    // e.g. await resend.contacts.create({ audienceId: process.env.RESEND_AUDIENCE_ID!, email })
    // Left as a placeholder so the flow works with only RESEND_API_KEY configured.
    if (consent) {
      console.info(`[robot-card] newsletter consent given by ${email} — wire to audience/CRM here.`)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('robot-card exception:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
