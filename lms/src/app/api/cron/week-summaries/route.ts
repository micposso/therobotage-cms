import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { sendWeekSummary } from '@/lib/email/send'

export async function GET(request: Request) {
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Run on Mondays at midnight UTC — check if today is Monday
  const now = new Date()
  if (now.getUTCDay() !== 1) {
    return NextResponse.json({ ok: true, skipped: 'not Monday' })
  }

  // Get all active cohorts
  const { data: cohorts, error } = await supabaseAdmin
    .from('cohorts')
    .select('id, week_start_dates, name')
    .eq('status', 'active')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  let sent = 0

  for (const cohort of cohorts ?? []) {
    const weekStartDates: string[] = cohort.week_start_dates ?? []
    const today = now.toISOString().slice(0, 10)

    // Find which week just ended (started last week)
    const justEndedWeek = weekStartDates.findIndex((date, i) => {
      if (i === 0) return false
      const nextWeekDate = weekStartDates[i]
      return nextWeekDate === today
    })

    if (justEndedWeek < 0) continue
    const weekNumber = justEndedWeek // week that just ended

    // Get enrollments with progress for this week
    const { data: enrollments } = await supabaseAdmin
      .from('enrollments')
      .select(`
        id,
        profiles(email, full_name),
        week_progress!inner(state)
      `)
      .eq('cohort_id', cohort.id)
      .eq('status', 'active')
      .eq('week_progress.week_number', weekNumber)

    for (const enrollment of enrollments ?? []) {
      try {
        const profile = enrollment.profiles as unknown as { email: string; full_name: string } | null
        const progress = (enrollment.week_progress as { state: string }[] | null)?.[0]
        if (!profile || !progress) continue

        await sendWeekSummary({
          to: profile.email,
          name: profile.full_name,
          weekNumber,
          state: progress.state,
          cohortName: cohort.name,
        })
        sent++
      } catch {
        // Non-fatal
      }
    }
  }

  return NextResponse.json({ ok: true, sent })
}
