'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_ADDRESS = 'research@therobotage.com'
const ADMIN_ADDRESS = 'micposso@gmail.com'

export async function joinWaitlist(
  prevState: { success: boolean; error?: string } | null,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const email = (formData.get('email') as string | null)?.trim()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'Please enter a valid email address.' }
  }

  try {
    await Promise.all([
      // Confirmation to the subscriber
      resend.emails.send({
        from: FROM_ADDRESS,
        to: email,
        subject: "You're on the REP list.",
        html: `
          <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #0D0D0D;">
            <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; color: #e85d24; margin-bottom: 24px;">
              The Robot Age
            </p>
            <h1 style="font-family: 'IBM Plex Sans', Arial, sans-serif; font-size: 24px; font-weight: 400; letter-spacing: -0.02em; margin-bottom: 16px; line-height: 1.1;">
              You're on the list.
            </h1>
            <p style="font-size: 15px; line-height: 1.75; color: #2A2A28; margin-bottom: 16px;">
              The first REP cohort dates are being confirmed now. We'll reach you before the public announcement — with the schedule, founding-member pricing, and direct access to the instructor.
            </p>
            <p style="font-size: 15px; line-height: 1.75; color: #2A2A28; margin-bottom: 32px;">
              No noise in the meantime. Just the details when they're ready.
            </p>
            <p style="font-size: 12px; color: #2A2A28; opacity: 0.6; line-height: 1.65;">
              therobotage.com — Robotics Experience Practitioner
            </p>
          </div>
        `,
      }),

      // Admin notification
      resend.emails.send({
        from: FROM_ADDRESS,
        to: ADMIN_ADDRESS,
        subject: 'New REP waitlist signup',
        html: `<p style="font-family: sans-serif;">New signup: <strong>${email}</strong></p>`,
      }),
    ])

    return { success: true }
  } catch {
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}
