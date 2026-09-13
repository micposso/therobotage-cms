'use server'

import { Resend } from 'resend'
import { emailHtml, escapeHtml } from '@/lib/emailTemplate'
import {
  contributionOptions,
  partnerFields,
  validateRobotLiteracyPartnerRequest,
  type PartnerResult,
} from '@/lib/robotLiteracyPartners'

export async function sendRobotLiteracyPartnerRequest(data: FormData): Promise<PartnerResult> {
  const errors = validateRobotLiteracyPartnerRequest(data)
  if (Object.keys(errors).length) return { success: false, errors }
  const failure = { success: false, error: 'Your request could not be sent. Please try again or email hello@therobotage.com.' }
  if (!process.env.RESEND_API_KEY) return failure

  try {
    const fieldContent = partnerFields
      .map(({ name, label }) => {
        const value = String(data.get(name) ?? '').trim()
        return `<p><strong>${escapeHtml(label)}:</strong><br />${escapeHtml(value || 'Not provided').replace(/\n/g, '<br />')}</p>`
      })
      .join('')
    const contributions = data.getAll('contributions').map(String).filter((value) => (contributionOptions as readonly string[]).includes(value))
    const contributionContent = `<p><strong>How could your organization contribute?</strong><br />${escapeHtml(contributions.join(', ') || 'Not provided')}</p>`

    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: process.env.EMAIL_FROM_HELLO ?? 'onboarding@resend.dev',
      to: 'micposso@gmail.com',
      replyTo: String(data.get('email')).trim(),
      subject: 'New Robot Literacy partner inquiry - The Robot Age',
      html: emailHtml(`<h1>Robot Literacy partner inquiry</h1>${fieldContent}${contributionContent}<p>Consent: I agree to be contacted by The Robot Age regarding Robot Literacy partnerships.</p>`),
    })
    return error ? failure : { success: true }
  } catch {
    return failure
  }
}
