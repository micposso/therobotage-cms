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
  const blurb = escapeHtml(robot.blurb)

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error: sendError } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      bcc: 'micposso@gmail.com',
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

        <table cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 32px;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;border-top:1px solid #e0e0e0;font-family:Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#9b5152;width:120px;">Height</td>
            <td style="padding:8px 0;border-top:1px solid #e0e0e0;font-family:Georgia,serif;font-size:14px;color:#2A2A28;">${escapeHtml(robot.specs.height)}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;border-top:1px solid #e0e0e0;font-family:Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#9b5152;">Weight</td>
            <td style="padding:8px 0;border-top:1px solid #e0e0e0;font-family:Georgia,serif;font-size:14px;color:#2A2A28;">${escapeHtml(robot.specs.weight)}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;border-top:1px solid #e0e0e0;font-family:Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#9b5152;">Notable</td>
            <td style="padding:8px 0;border-top:1px solid #e0e0e0;font-family:Georgia,serif;font-size:14px;color:#2A2A28;">${escapeHtml(robot.specs.notable)}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;border-top:1px solid #e0e0e0;font-family:Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#9b5152;">Price</td>
            <td style="padding:8px 0;border-top:1px solid #e0e0e0;border-bottom:1px solid #e0e0e0;font-family:Georgia,serif;font-size:14px;color:#2A2A28;">${escapeHtml(robot.specs.price)}</td>
          </tr>
        </table>

        <p style="font-family:Georgia,serif;font-size:15px;line-height:1.75;color:#2A2A28;margin:0 0 8px;">
          Want to evaluate robots like this for real? The RXD Scorecard scores any robot interaction across six dimensions of Robot Experience Design.
        </p>
        <p style="font-family:Georgia,serif;font-size:15px;line-height:1.75;color:#2A2A28;margin:0;">
          <a href="${SITE_URL}/rxd-scorecard" style="color:#9b5152;text-decoration:none;">Try the RXD Scorecard &rarr;</a>
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
