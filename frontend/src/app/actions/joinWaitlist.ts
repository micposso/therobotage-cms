'use server'
import { Resend } from 'resend'
import { waitlistConfirmationHtml } from '@/lib/emailTemplate'
import { academyInterests, parseAcademyInterest } from '@/lib/academyInterest'
const FROM_ADDRESS = process.env.EMAIL_FROM_RESEARCH ?? 'onboarding@resend.dev'
const ADMIN_ADDRESS = 'mike@therobotage.com'
export async function joinWaitlist(prevState: { success: boolean; error?: string } | null, formData: FormData): Promise<{ success: boolean; error?: string }> {
  const rawName = formData.get('name')
  const name = typeof rawName === 'string' ? rawName.trim().slice(0, 254) : ''
  const rawEmail = formData.get('email')
  const email = typeof rawEmail === 'string' ? rawEmail.trim() : ''
  const interest = parseAcademyInterest(formData.get('interest'))
  const locale = formData.get('locale') === 'es' ? 'es' : 'en'
  if (!interest) return { success: false, error: 'Please select a valid program interest.' }
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { success: false, error: 'Please enter a valid email address.' }
  if (!process.env.RESEND_API_KEY) return { success: false, error: 'Something went wrong. Please try again.' }
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS, to: email, bcc: ADMIN_ADDRESS,
      subject: `${locale === 'es' ? 'Estás en la lista' : "You're on the list"} — ${academyInterests[interest][locale]}`,
      html: waitlistConfirmationHtml(interest, locale, name),
    })
    if (error) { console.error('Academy confirmation email error:', error); return { success: false, error: 'Something went wrong. Please try again.' } }
    return { success: true }
  } catch (error) {
    console.error('Academy interest error:', error)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}
