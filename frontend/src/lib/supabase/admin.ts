import 'server-only'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

// Scoped service client for the job board's write paths. Prefer authenticating as
// the jobs_alert_service Postgres role (see lms/supabase/migrations/00022), not this
// project's service_role: that role bypasses RLS on every table in the database,
// including the LMS's enrollments and credentials. A service-role fallback keeps older
// deployments alive until the scoped key is configured. Callers:
//   1. src/app/actions/subscribeJobAlerts.ts        (writes job_alert_subscribers)
//   2. src/app/actions/unsubscribeJobAlerts.ts       (updates job_alert_subscribers)
//   3. src/app/api/jobs/alerts/unsubscribe/route.ts  (updates job_alert_subscribers)
//   4. src/app/api/cron/job-alerts/route.ts          (reads subscribers, writes sends)
//   5. src/lib/jobsQueries.ts getExpiredJobBySlug     (reads an expired job row)
//
// Everything that renders a live listing uses getSupabaseRead() instead. The
// 'server-only' import above makes an accidental client-component import a build error
// rather than a leaked key.
export function getSupabaseJobsService(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_JOBS_SERVICE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) {
      throw new Error(
        'Supabase jobs-service client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_JOBS_SERVICE_KEY.'
      )
    }

    if (!process.env.SUPABASE_JOBS_SERVICE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn(
        'Supabase jobs-service client is using SUPABASE_SERVICE_ROLE_KEY fallback. Set SUPABASE_JOBS_SERVICE_KEY to restore least-privilege access.'
      )
    }

    _client = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }

  return _client
}
