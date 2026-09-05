'use server'

import { Resend } from 'resend'
import { emailHtml, escapeHtml } from '@/lib/emailTemplate'
import {
  labFields,
  validateLabRequest,
  type LabResult,
} from '@/lib/liveRobotLab'

export async function sendLiveRobotLabRequest(
  data: FormData,
): Promise<LabResult> {
  const errors = validateLabRequest(data)
  if (Object.keys(errors).length) return { success: false, errors }
  const failure = {
    success: false,
    error:
      'Your request could not be sent. Please try again or email hello@therobotage.com.',
  }
  // Reuse the contact form's Resend sender and destination. No success is returned
  // until the provider accepts the organizer notification.
  if (!process.env.RESEND_API_KEY) return failure
  try {
    const content = labFields
      .map(({ name, label }) => {
        const value = String(data.get(name) ?? '').trim()
        return `<p><strong>${escapeHtml(label)}:</strong><br />${escapeHtml(value || 'Not provided').replace(/\n/g, '<br />')}</p>`
      })
      .join('')
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: process.env.EMAIL_FROM_HELLO ?? 'onboarding@resend.dev',
      to: 'micposso@gmail.com',
      replyTo: String(data.get('email')).trim(),
      subject: 'New Live Robot Lab request — The Robot Age',
      html: emailHtml(
        `<h1>Live Robot Lab request</h1>${content}<p>Submitted with consent to be contacted about Live Robot Lab.</p>`,
      ),
    })
    return error ? failure : { success: true }
  } catch {
    return failure
  }
}
