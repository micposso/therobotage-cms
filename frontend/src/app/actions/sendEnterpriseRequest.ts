'use server'

import { Resend } from 'resend'
import { emailHtml, escapeHtml } from '@/lib/emailTemplate'

type State = { success: boolean; error?: string }

export async function sendEnterpriseRequest(_previous: State, data: FormData): Promise<State> {
  const fields = ['name', 'email', 'organization', 'role', 'deployment'] as const
  const values = Object.fromEntries(fields.map((field) => {
    const value = data.get(field)
    return [field, typeof value === 'string' ? value.trim() : '']
  }))
  if (fields.some((field) => values[field].length > (field === 'deployment' ? 3000 : 254)))
    return { success: false, error: 'Please shorten your response.' }
  if (!values.name || !values.organization || !values.role)
    return { success: false, error: 'Please enter your name, organization, and role.' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    return { success: false, error: 'Please enter a valid email address.' }
  try {
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: process.env.EMAIL_FROM_HELLO ?? 'onboarding@resend.dev',
      to: 'mike@therobotage.com',
      replyTo: values.email,
      subject: 'New enterprise briefing request — The Robot Age',
      html: emailHtml(fields.map((field) => `<p><strong>${field}:</strong><br />${escapeHtml(values[field] || 'Not provided').replace(/\n/g, '<br />')}</p>`).join('')),
    })
    if (!error) return { success: true }
    console.error('Enterprise request delivery failed:', error)
  } catch (error) {
    console.error('Enterprise request delivery failed:', error)
  }
  return { success: false, error: 'Your request could not be sent. Please try again.' }
}
