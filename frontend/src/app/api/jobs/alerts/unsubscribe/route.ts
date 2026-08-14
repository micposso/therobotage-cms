import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

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

  // Always 200: a mail provider retrying a failed one-click unsubscribe is worse than
  // silently ignoring a malformed token, and the response must never reveal whether an
  // address is on the list.
  if (!token || !UUID_RE.test(token)) {
    return new NextResponse(null, { status: 200 })
  }

  try {
    await getSupabaseAdmin()
      .from('job_alert_subscribers')
      .update({
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('unsubscribe_token', token)
  } catch (error) {
    console.error('one-click unsubscribe error:', error)
  }

  return new NextResponse(null, { status: 200 })
}
