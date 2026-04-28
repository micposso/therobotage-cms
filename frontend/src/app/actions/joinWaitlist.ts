'use server'

import { Resend } from 'resend'
import { waitlistConfirmationHtml } from '@/lib/emailTemplate'

const FROM_ADDRESS = process.env.EMAIL_FROM_RESEARCH ?? 'onboarding@resend.dev'
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
    const resend = new Resend(process.env.RESEND_API_KEY)

    const { error: confirmError } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      bcc: ADMIN_ADDRESS,
      subject: "You're first in line — HREF Certification",
      html: waitlistConfirmationHtml(),
    })

    if (confirmError) {
      console.error('Waitlist confirmation email error:', confirmError)
      return { success: false, error: 'Something went wrong. Please try again.' }
    }

    return { success: true }
  } catch (err) {
    console.error('joinWaitlist error:', err)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}
