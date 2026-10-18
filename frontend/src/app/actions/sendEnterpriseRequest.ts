'use server'

import { Resend } from 'resend'
import { emailHtml, escapeHtml } from '@/lib/emailTemplate'
import { enterpriseFields, enterpriseValues, validateEnterpriseRequest, enterpriseFailure, type EnterpriseResult } from '@/lib/enterpriseRequest'

export async function sendEnterpriseRequest(_previous: EnterpriseResult, data: FormData): Promise<EnterpriseResult> {
  if (data.get('website')) return { success: false, error: enterpriseFailure }
  const errors = validateEnterpriseRequest(data)
  if (Object.keys(errors).length) return { success: false, errors }
  if (!process.env.RESEND_API_KEY) return { success: false, error: enterpriseFailure }
  const values = enterpriseValues(data)
  try {
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: process.env.EMAIL_FROM_HELLO ?? 'onboarding@resend.dev',
      to: 'mike@therobotage.com',
      replyTo: values.email,
      subject: 'New Academy briefing request — The Robot Age',
      html: emailHtml(enterpriseFields.map(({ name, label }) =>
        `<p><strong>${escapeHtml(label)}:</strong><br />${escapeHtml(values[name] || 'Not provided').replace(/\n/g, '<br />')}</p>`).join('')),
    })
    if (!error) return { success: true }
    console.error('Enterprise request delivery failed')
  } catch {
    console.error('Enterprise request delivery failed')
  }
  return { success: false, error: enterpriseFailure }
}
