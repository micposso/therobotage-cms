import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { emailHtml } from '@/lib/emailTemplate'

export async function GET() {
  const resend = new Resend(process.env.RESEND_API_KEY)
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production.' }, { status: 403 })
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'micposso@gmail.com',
      subject: '[Test] We received your message — The Robot Age',
      html: emailHtml(`
        <h1 style="font-family:Arial,sans-serif;font-weight:400;font-size:24px;letter-spacing:-0.02em;line-height:1.15;color:#0D0D0D;margin:0 0 20px;">
          We received your message.
        </h1>

        <p style="font-family:Georgia,serif;font-size:15px;line-height:1.75;color:#2A2A28;margin:0 0 16px;">
          Thanks for reaching out, Test User. We'll get back to you within a few business days.
        </p>
        <p style="font-family:Georgia,serif;font-size:15px;line-height:1.75;color:#2A2A28;margin:0 0 32px;">
          In the meantime, the research section is a good place to start if you want to go deeper on any of the topics we cover.
        </p>

        <table cellpadding="0" cellspacing="0" style="margin:0 0 40px;">
          <tr>
            <td style="background:#9b5152;">
              <a href="https://therobotage.com/research"
                 style="display:inline-block;padding:14px 28px;font-family:Arial,sans-serif;font-size:12px;font-weight:500;letter-spacing:0.08em;color:#ffffff;text-decoration:none;">
                Explore the research →
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
        <p style="font-family:Georgia,serif;font-size:15px;line-height:1.75;color:#2A2A28;margin:0;">
          The credentials, frameworks, and research we publish are built for non-engineers — to give you the vocabulary and mental models to do your job well in a workplace that has changed.
        </p>
      `),
    })

    if (error) return NextResponse.json({ ok: false, error }, { status: 500 })
    return NextResponse.json({ ok: true, id: data?.id })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
