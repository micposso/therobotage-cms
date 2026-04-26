'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_ADDRESS = 'research@therobotage.com'
const WHITEPAPER_URL = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://therobotage.com'}/pdf/href-therobotage-v2.pdf`

export async function sendWhitepaperEmail(
  prevState: { success: boolean; error?: string } | null,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const email = (formData.get('email') as string | null)?.trim()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'Please enter a valid email address.' }
  }

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: 'Human-Robot Experience Framework — your copy',
      html: `
        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #0D0D0D;">
          <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; color: #e85d24; margin-bottom: 24px;">
            The Robot Age
          </p>
          <h1 style="font-family: 'IBM Plex Sans', Arial, sans-serif; font-size: 24px; font-weight: 400; letter-spacing: -0.02em; margin-bottom: 16px;">
            Human-Robot Experience Framework, v2.0
          </h1>
          <p style="font-size: 15px; line-height: 1.75; color: #2A2A28; margin-bottom: 32px;">
            Here is your copy of the HREF white paper. The framework is published under CC BY-NC 4.0 — you are free to use, adapt, and apply it to real deployments with attribution.
          </p>
          <a href="${WHITEPAPER_URL}"
             style="display: inline-block; padding: 12px 24px; background: #e85d24; color: #E8E4DC; font-family: Georgia, serif; font-size: 12px; font-weight: 500; letter-spacing: 0.06em; text-decoration: none;">
            Download the white paper
          </a>
          <p style="font-size: 12px; color: #2A2A28; opacity: 0.6; margin-top: 32px; line-height: 1.65;">
            therobotage.com/research/href — CC BY-NC 4.0
          </p>
        </div>
      `,
    })
    return { success: true }
  } catch {
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}
