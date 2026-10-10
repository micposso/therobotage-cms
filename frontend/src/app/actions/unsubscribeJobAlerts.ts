'use server'

import { Resend } from 'resend'
import { getJobAlertFromAddress } from '@/lib/jobAlertEmail'
import { getSupabaseJobsService } from '@/lib/supabase/admin'

type State = { success: boolean; error?: string }

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function unsubscribeJobAlerts(
  prevState: State | null,
  formData: FormData
): Promise<State> {
  const token = (formData.get('token') as string | null)?.trim()

  if (!token || !UUID_RE.test(token)) {
    return { success: false, error: 'This unsubscribe link is not valid.' }
  }

  try {
    const { data: subscriber, error } = await getSupabaseJobsService()
      .from('job_alert_subscribers')
      .update({
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('unsubscribe_token', token)
      .select('email')
      .maybeSingle()

    if (error) {
      console.error('unsubscribeJobAlerts error:', error)
      return { success: false, error: 'Something went wrong. Please try again.' }
    }

    if (subscriber) await notifyPreferenceChange(subscriber.email, 'unsubscribed')
    return { success: true }
  } catch (err) {
    console.error('unsubscribeJobAlerts error:', err)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}

export async function resubscribeJobAlerts(
  prevState: State | null,
  formData: FormData
): Promise<State> {
  const token = (formData.get('token') as string | null)?.trim()

  if (!token || !UUID_RE.test(token)) {
    return { success: false, error: 'This link is not valid.' }
  }

  try {
    const { data: subscriber, error } = await getSupabaseJobsService()
      .from('job_alert_subscribers')
      .update({
        status: 'active',
        unsubscribed_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('unsubscribe_token', token)
      .select('email')
      .maybeSingle()

    if (error) {
      console.error('resubscribeJobAlerts error:', error)
      return { success: false, error: 'Something went wrong. Please try again.' }
    }

    if (subscriber) await notifyPreferenceChange(subscriber.email, 'resubscribed')
    return { success: true }
  } catch (err) {
    console.error('resubscribeJobAlerts error:', err)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}

// Subscription changes remain effective even if the notification provider is down.
async function notifyPreferenceChange(email: string, change: string): Promise<void> {
  try {
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: getJobAlertFromAddress(),
      to: 'mike@therobotage.com',
      subject: `Robotics job alerts: ${change}`,
      text: `${email} ${change} to robotics job alerts.`,
    })
    if (error) console.error('Job alert preference notification failed:', error)
  } catch (error) {
    console.error('Job alert preference notification failed:', error)
  }
}
