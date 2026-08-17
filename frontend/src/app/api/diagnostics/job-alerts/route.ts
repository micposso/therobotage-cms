import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const auth = request.headers.get('authorization')
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const checks = {
    supabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    supabaseServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    resendApiKey: Boolean(process.env.RESEND_API_KEY),
    emailFromJobs: Boolean(process.env.EMAIL_FROM_JOBS),
    jobAlertAdminEmail: Boolean(process.env.JOB_ALERT_ADMIN_EMAIL),
    jobAlertIpSalt: Boolean(process.env.JOB_ALERT_IP_SALT),
  }

  let database:
    | { ok: true; subscribersReachable: boolean; subscriberCount: number | null }
    | { ok: false; error: string }

  try {
    const { count, error } = await getSupabaseAdmin()
      .from('job_alert_subscribers')
      .select('id', { count: 'exact', head: true })

    if (error) {
      database = { ok: false, error: error.message }
    } else {
      database = {
        ok: true,
        subscribersReachable: true,
        subscriberCount: count ?? null,
      }
    }
  } catch (error) {
    database = {
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown database diagnostic error',
    }
  }

  return NextResponse.json({
    ok:
      checks.supabaseUrl &&
      checks.supabaseServiceRole &&
      checks.resendApiKey &&
      database.ok,
    checks,
    database,
  })
}
