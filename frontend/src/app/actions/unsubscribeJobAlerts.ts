'use server'

import { getSupabaseAdmin } from '@/lib/supabase/admin'

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
    const { error } = await getSupabaseAdmin()
      .from('job_alert_subscribers')
      .update({
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('unsubscribe_token', token)

    if (error) {
      console.error('unsubscribeJobAlerts error:', error)
      return { success: false, error: 'Something went wrong. Please try again.' }
    }

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
    const { error } = await getSupabaseAdmin()
      .from('job_alert_subscribers')
      .update({
        status: 'active',
        unsubscribed_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('unsubscribe_token', token)

    if (error) {
      console.error('resubscribeJobAlerts error:', error)
      return { success: false, error: 'Something went wrong. Please try again.' }
    }

    return { success: true }
  } catch (err) {
    console.error('resubscribeJobAlerts error:', err)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}
