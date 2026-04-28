import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { emailHtml } from '@/lib/emailTemplate'

export async function GET() {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const WHITEPAPER_URL = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/pdf/href-therobotage-v2.pdf`
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production.' }, { status: 403 })
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'micposso@gmail.com',
      subject: '[Test] Human-Robot Experience Framework, v2.0 — your copy',
      html: emailHtml(`
        <h1 style="font-family:Arial,sans-serif;font-weight:400;font-size:24px;letter-spacing:-0.02em;line-height:1.15;color:#0D0D0D;margin:0 0 20px;">
          Human-Robot Experience<br/>Framework, v2.0
        </h1>

        <p style="font-family:Georgia,serif;font-size:15px;line-height:1.75;color:#2A2A28;margin:0 0 16px;">
          Your copy is ready. Save it somewhere you'll actually find it.
        </p>
        <p style="font-family:Georgia,serif;font-size:15px;line-height:1.75;color:#2A2A28;margin:0 0 32px;">
          The framework maps the key decision points where non-engineering teams shape deployment outcomes — and where most of those decisions go wrong. Version 2.0 adds a readiness assessment tool for mixed human-robot environments.
        </p>

        <table cellpadding="0" cellspacing="0" style="margin:0 0 40px;">
          <tr>
            <td style="background:#9b5152;">
              <a href="${WHITEPAPER_URL}"
                 style="display:inline-block;padding:14px 28px;font-family:Arial,sans-serif;font-size:12px;font-weight:500;letter-spacing:0.08em;color:#ffffff;text-decoration:none;">
                Download the white paper →
              </a>
            </td>
          </tr>
        </table>

        <hr style="border:none;border-top:1px solid #e0e0e0;margin:0 0 32px;" />

        <p style="font-family:Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#9b5152;margin:0 0 14px;">
          About The Robot Age
        </p>
        <p style="font-family:Georgia,serif;font-size:15px;line-height:1.75;color:#2A2A28;margin:0 0 16px;">
          The Robot Age is a robotic literacy platform for designers, product managers, marketers, and operations leads who work in environments where robots are already deployed. The premise is straightforward: you don't need to understand how robots are built to make better decisions about how they're used, designed around, and introduced to the people who work beside them.
        </p>
        <p style="font-family:Georgia,serif;font-size:15px;line-height:1.75;color:#2A2A28;margin:0 0 32px;">
          The credentials, frameworks, and research we publish are built for non-engineers — to give you the vocabulary and mental models to do your job well in a workplace that has changed.
        </p>
        <p style="font-family:Georgia,serif;font-size:15px;line-height:1.75;color:#2A2A28;margin:0;">
          If you want to go further, the REP credential is the structured path — four tracks, no engineering prerequisites. Explore the research at
          <a href="https://therobotage.com" style="color:#9b5152;text-decoration:none;">therobotage.com</a>,
          or reply to this email with any questions.
        </p>
      `),
    })

    if (error) return NextResponse.json({ ok: false, error }, { status: 500 })
    return NextResponse.json({ ok: true, id: data?.id })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
