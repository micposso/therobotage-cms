import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { sendWeekUnlocked } from '@/lib/email/send'
import { computeDueDate, formatDueDate } from '@/lib/deadlines'

export async function GET(request: Request) {
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

  // Get all active cohorts
  const { data: cohorts, error } = await supabaseAdmin
    .from('cohorts')
    .select('id, week_start_dates, course_id, courses(total_weeks)')
    .eq('status', 'active')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  let unlocked = 0

  for (const cohort of cohorts ?? []) {
    const weekStartDates: string[] = cohort.week_start_dates ?? []
    const totalWeeks = (cohort.courses as unknown as { total_weeks: number } | null)?.total_weeks ?? weekStartDates.length

    // Determine which week numbers should be available today
    for (let weekNumber = 1; weekNumber <= totalWeeks; weekNumber++) {
      const weekStart = weekStartDates[weekNumber - 1]
      if (!weekStart || weekStart > now) continue

      // Get all enrollments in this cohort
      const { data: enrollments } = await supabaseAdmin
        .from('enrollments')
        .select('id, profiles(email, full_name)')
        .eq('cohort_id', cohort.id)
        .eq('status', 'active')

      for (const enrollment of enrollments ?? []) {
        // Check current state
        const { data: progress } = await supabaseAdmin
          .from('week_progress')
          .select('id, state')
          .eq('enrollment_id', enrollment.id)
          .eq('week_number', weekNumber)
          .single()

        if (!progress || progress.state !== 'locked') continue

        // Unlock the week
        const dueDate = computeDueDate(weekStartDates, weekNumber)
        const dueDateStr = dueDate ? dueDate.toISOString() : null

        await supabaseAdmin
          .from('week_progress')
          .update({ state: 'available' })
          .eq('id', progress.id)

        // Set due_date on existing submission draft if any
        if (dueDateStr) {
          await supabaseAdmin
            .from('submissions')
            .update({ due_date: dueDateStr })
            .eq('enrollment_id', enrollment.id)
            .eq('week_number', weekNumber)
            .eq('status', 'draft')
        }

        unlocked++

        // Notify student — only on the exact day it unlocks (weekStart === now)
        if (weekStart === now) {
          try {
            const profile = enrollment.profiles as unknown as { email: string; full_name: string } | null
            if (profile) {
              await sendWeekUnlocked({
                to: profile.email,
                name: profile.full_name,
                weekNumber,
                dueDate: dueDate ? formatDueDate(dueDate.toISOString()) : null,
              })
            }
          } catch {
            // Non-fatal
          }
        }
      }
    }
  }

  return NextResponse.json({ ok: true, unlocked })
}
