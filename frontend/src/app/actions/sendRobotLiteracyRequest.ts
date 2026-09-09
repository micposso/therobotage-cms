'use server'

import { Resend } from 'resend'
import { emailHtml, escapeHtml } from '@/lib/emailTemplate'
import { literacyFields, validateLiteracyRequest, type LiteracyResult } from '@/lib/robotLiteracy'

// Uses the same delivery infrastructure and recipient as Live Robot Lab.
export async function sendRobotLiteracyRequest(data: FormData): Promise<LiteracyResult> {
  const errors = validateLiteracyRequest(data)
  if (Object.keys(errors).length) return { success: false, errors }
  const failure = { success: false, error: 'Your request could not be sent. Please try again or email hello@therobotage.com.' }
  if (!process.env.RESEND_API_KEY) return failure
  try {
    const content = [...literacyFields, { name: 'interests', label: 'Interested in' }]
      .map(({ name, label }) => {
        const value = data.getAll(name).map(String).join(', ').trim()
        return `<p><strong>${escapeHtml(label)}:</strong><br />${escapeHtml(value || 'Not provided').replace(/\n/g, '<br />')}</p>`
      }).join('')
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: process.env.EMAIL_FROM_HELLO ?? 'onboarding@resend.dev',
      to: 'micposso@gmail.com',
      replyTo: String(data.get('email')).trim(),
      subject: 'New Robot Literacy inquiry — The Robot Age',
      html: emailHtml(`<h1>Robot Literacy inquiry</h1>${content}<p>Consent: I agree to be contacted by The Robot Age regarding Robot Literacy programs and partnerships.</p>`),
    })
    return error ? failure : { success: true }
  } catch {
    return failure
  }
}
