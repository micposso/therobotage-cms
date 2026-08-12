import 'server-only'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

// Anon read client for the job board. RLS restricts it to live listings and public
// reference data, and it can read nothing from the alert tables at all.
//
// The key deliberately has no NEXT_PUBLIC_ prefix: every read on this site happens in a
// Server Component, so the browser never needs it and it should not ship in the bundle.
export function getSupabaseRead(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_PUBLISHABLE_KEY

    if (!url || !key) {
      throw new Error(
        'Supabase read client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY.'
      )
    }

    _client = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }

  return _client
}
