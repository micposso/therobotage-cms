import { NextResponse } from 'next/server'
import { getSupabaseJobsService } from '@/lib/supabase/admin'

// RFC 8058 one-click unsubscribe endpoint, referenced by the List-Unsubscribe-Post
// header on every digest. Gmail and Yahoo require this for bulk senders.
//
// POST only, and deliberately so: mail scanners and Gmail's link prefetcher issue GET
// requests against every URL in an email, so a mutating GET would silently unsubscribe
// people who never clicked. The human-facing GET lives at /jobs/alerts/unsubscribe and
// renders a confirmation page instead.

export const dynamic = 'force-dynamic'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function POST(request: Request) {
  const token = new URL(request.url).searchParams.get('token')

  let body: FormData
  try {
    body = await request.formData()
  } catch {
    return new NextResponse(null, { status: 400 })
  }
  if (body.get('List-Unsubscribe') !== 'One-Click') return new NextResponse(null, { status: 400 })

  // Return the same response for an unknown token and a successful opt-out.
  if (!token || !UUID_RE.test(token)) return new NextResponse(null, { status: 200 })

  try {
    const now = new Date().toISOString()
    const { error } = await getSupabaseJobsService()
      .from('job_alert_subscribers')
      .update({
        status: 'unsubscribed',
        unsubscribed_at: now,
        updated_at: now,
      })
      .eq('unsubscribe_token', token)
      .neq('status', 'unsubscribed')
    if (error) throw error
  } catch (error) {
    console.error('one-click unsubscribe error:', error)
    return new NextResponse(null, { status: 503 })
  }

  return new NextResponse(null, { status: 200 })
}
