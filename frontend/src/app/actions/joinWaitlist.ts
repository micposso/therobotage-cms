'use server'
import { Resend } from 'resend'
import { waitlistConfirmationHtml } from '@/lib/emailTemplate'
import { academyInterests, parseAcademyInterest, type AcademyInterest, type WaitlistState } from '@/lib/academyInterest'
import { registerRpdp } from '@/lib/supabase/academy-interest'
import type { RpdpQuote } from '@/lib/rpdp-registration'
const FROM_ADDRESS = process.env.EMAIL_FROM_RESEARCH ?? 'onboarding@resend.dev'
const ADMIN_ADDRESS = 'mike@therobotage.com'

async function sendConfirmation(interest: AcademyInterest, locale: 'en' | 'es', name: string, email: string, quote?: RpdpQuote) {
  if (!process.env.RESEND_API_KEY) throw new Error('Academy confirmation email is not configured')
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: FROM_ADDRESS, to: email, bcc: ADMIN_ADDRESS,
    subject: `${locale === 'es' ? 'Estás en la lista' : "You're on the list"} — ${academyInterests[interest][locale]}`,
    html: waitlistConfirmationHtml(interest, locale, name, quote),
  })
  if (error) throw new Error(`Academy confirmation email failed (${error.name})`)
}

export async function joinWaitlist(_prevState: WaitlistState | null, formData: FormData): Promise<WaitlistState> {
  const rawName = formData.get('name')
  const name = typeof rawName === 'string' ? rawName.trim().slice(0, 254) : ''
  const rawEmail = formData.get('email')
  const email = typeof rawEmail === 'string' ? rawEmail.trim() : ''
  const interest = parseAcademyInterest(formData.get('interest'))
  const locale = formData.get('locale') === 'es' ? 'es' : 'en'
  if (!interest) return { success: false, error: 'Please select a valid program interest.' }
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { success: false, error: 'Please enter a valid email address.' }
  try {
    if (interest === 'rpdp') {
      const result = await registerRpdp(formData, email)
      if (result.error) return { success: false, error: result.error }
      if (result.firstRegistration) {
        await sendConfirmation(interest, locale, name, email, result.quote).catch((error: Error) => console.error(error.message))
      }
      return { success: true, quote: result.quote }
    }
    await sendConfirmation(interest, locale, name, email)
    return { success: true }
  } catch (error) {
    console.error('Academy interest error:', error instanceof Error ? error.message : 'unknown error')
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}
