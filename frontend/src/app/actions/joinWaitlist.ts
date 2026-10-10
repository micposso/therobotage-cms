'use server'

import { Resend } from 'resend'
import { waitlistConfirmationHtml, escapeHtml, emailHtml } from '@/lib/emailTemplate'

const FROM_ADDRESS = process.env.EMAIL_FROM_RESEARCH ?? 'onboarding@resend.dev'
const ADMIN_ADDRESS = 'mike@therobotage.com'

export async function joinWaitlist(
  prevState: { success: boolean; error?: string } | null,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const rawName = formData.get('name')
  const name = typeof rawName === 'string' ? rawName.trim().slice(0, 254) : ''
  const email = (formData.get('email') as string | null)?.trim()
  const interest = formData.get('interest')
  const academyInterest = interest === 'rpdp' || interest === 'academy'
  const interestLabel = interest === 'rpdp' ? 'Product Design for Robots founding cohort list' : 'The Robot Age Academy updates'

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'Please enter a valid email address.' }
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)

    const { error: confirmError } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      bcc: ADMIN_ADDRESS,
      subject: academyInterest ? `You're on the list — ${interestLabel}` : "You're first in line — RXD Certification",
      html: academyInterest
        ? emailHtml(`<h1>Thanks for your interest in The Robot Age Academy</h1><p>You've joined ${interestLabel}.</p><p>We'll notify you when enrollment opens. Joining this list does not reserve a seat.</p>${name ? `<p>Name: ${escapeHtml(name)}</p>` : ''}`)
        : waitlistConfirmationHtml().replace('</body>', `${name ? `<p>Name: ${escapeHtml(name)}</p>` : ''}</body>`),
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
