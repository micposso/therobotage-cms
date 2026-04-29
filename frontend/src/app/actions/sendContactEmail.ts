'use server'

import { Resend } from 'resend'
import { emailHtml, escapeHtml } from '@/lib/emailTemplate'

const FROM_ADDRESS = process.env.EMAIL_FROM_HELLO ?? 'onboarding@resend.dev'
const ADMIN_ADDRESS = 'micposso@gmail.com'

export async function sendContactEmail(
  prevState: { success: boolean; error?: string } | null,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const name    = (formData.get('name')    as string | null)?.trim()
  const email   = (formData.get('email')   as string | null)?.trim()
  const message = (formData.get('message') as string | null)?.trim()

  if (!name)    return { success: false, error: 'Please enter your name.' }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                return { success: false, error: 'Please enter a valid email address.' }
  if (!message) return { success: false, error: 'Please enter a message.' }

  const safeName    = escapeHtml(name)
  const safeEmail   = escapeHtml(email)
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />')

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const [{ error: confirmError }, { error: adminError }] = await Promise.all([

      // Confirmation to sender
      resend.emails.send({
        from: FROM_ADDRESS,
        to: email,
        bcc: ADMIN_ADDRESS,
        subject: 'We received your message — The Robot Age',
        html: emailHtml(`
          <h1 style="font-family:Arial,sans-serif;font-weight:400;font-size:24px;letter-spacing:-0.02em;line-height:1.15;color:#0D0D0D;margin:0 0 20px;">
            We received your message.
          </h1>

          <p style="font-family:Georgia,serif;font-size:15px;line-height:1.75;color:#2A2A28;margin:0 0 16px;">
            Thanks for reaching out, ${safeName}. We'll get back to you within a few business days.
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
      }),

      // Admin notification
      resend.emails.send({
        from: FROM_ADDRESS,
        to: ADMIN_ADDRESS,
        subject: `New message from ${safeName}`,
        html: emailHtml(`
          <p style="font-family:Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#9b5152;margin:0 0 20px;">
            Contact form submission
          </p>
          <p style="font-family:Georgia,serif;font-size:15px;line-height:1.6;color:#2A2A28;margin:0 0 8px;">
            <strong>Name:</strong> ${safeName}
          </p>
          <p style="font-family:Georgia,serif;font-size:15px;line-height:1.6;color:#2A2A28;margin:0 0 24px;">
            <strong>Email:</strong> <a href="mailto:${safeEmail}" style="color:#9b5152;">${safeEmail}</a>
          </p>
          <p style="font-family:Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:#aaa;margin:0 0 10px;">Message</p>
          <p style="font-family:Georgia,serif;font-size:15px;line-height:1.75;color:#2A2A28;margin:0;padding:16px;background:#f5f5f5;">
            ${safeMessage}
          </p>
        `),
      }),

    ])

    if (confirmError || adminError) {
      console.error('sendContactEmail error:', confirmError ?? adminError)
      return { success: false, error: 'Something went wrong. Please try again.' }
    }

    return { success: true }
  } catch (err) {
    console.error('sendContactEmail exception:', err)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}
