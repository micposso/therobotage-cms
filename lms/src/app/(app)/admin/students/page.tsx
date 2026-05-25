import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProgressBar } from '@/components/ProgressBar/ProgressBar'
import styles from './page.module.css'

export const metadata: Metadata = { title: 'Students — Admin' }

export default async function AdminStudentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'instructor'].includes(profile.role)) redirect('/dashboard')

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select(`
      *,
      profiles(full_name, email),
      cohorts(name),
      week_progress(week_number, state)
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className={styles.heading}>Students</h1>
      <div className={styles.list}>
        {(enrollments ?? []).map((e) => {
          const prog = (e.week_progress ?? []) as { state: string }[]
          const completed = prog.filter((p) => p.state === 'complete').length
          const student = e.profiles as { full_name: string; email: string } | null
          const cohort = e.cohorts as { name: string } | null
          return (
            <div key={e.id} className={styles.row}>
              <div className={styles.studentInfo}>
                <p className={styles.name}>{student?.full_name ?? '—'}</p>
                <p className={styles.email}>{student?.email}</p>
              </div>
              <div className={styles.meta}>
                <span className={styles.cohort}>{cohort?.name}</span>
                <ProgressBar value={completed} max={prog.length} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
