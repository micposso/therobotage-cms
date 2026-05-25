import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { sendDeadlineReminder } from '@/lib/email/send'
import { hoursUntil, formatDueDate } from '@/lib/deadlines'

const REMINDER_WINDOWS_HOURS = [48, 24, 6]

export async function GET(request: Request) {
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Find submissions that are in draft state with an upcoming due_date
  const { data: submissions, error } = await supabaseAdmin
    .from('submissions')
    .select(`
      id,
      week_number,
      due_date,
      enrollment_id,
      enrollments!inner(
        profiles(email, full_name)
      )
    `)
    .eq('status', 'draft')
    .not('due_date', 'is', null)
    .gt('due_date', new Date().toISOString())

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  let sent = 0

  for (const submission of submissions ?? []) {
    if (!submission.due_date) continue
    const hours = hoursUntil(submission.due_date)

    const shouldRemind = REMINDER_WINDOWS_HOURS.some(
      (window) => hours <= window && hours > window - 6
    )

    if (!shouldRemind) continue

    try {
      const enrollment = submission.enrollments as unknown as { profiles: { email: string; full_name: string } | null }
      const profile = enrollment?.profiles
      if (profile) {
        await sendDeadlineReminder({
          to: profile.email,
          name: profile.full_name,
          weekNumber: submission.week_number,
          dueDate: formatDueDate(submission.due_date),
          hoursRemaining: Math.round(hours),
        })
        sent++
      }
    } catch {
      // Non-fatal
    }
  }

  return NextResponse.json({ ok: true, sent })
}
