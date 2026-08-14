import 'server-only'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

// Service-role client — bypasses RLS. Only three callers are allowed:
//   1. src/app/actions/subscribeJobAlerts.ts   (writes job_alert_subscribers)
//   2. src/app/actions/unsubscribeJobAlerts.ts (updates job_alert_subscribers)
//   3. src/app/api/cron/job-alerts/route.ts    (reads subscribers, writes sends)
//
// Everything that renders a page uses getSupabaseRead() instead. The 'server-only'
// import above makes an accidental client-component import a build error rather than a
// leaked key.
export function getSupabaseAdmin(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) {
      throw new Error(
        'Supabase admin client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
      )
    }

    _client = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }

  return _client
}
