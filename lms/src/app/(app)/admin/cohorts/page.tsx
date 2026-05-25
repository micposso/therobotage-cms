import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import styles from './page.module.css'

export const metadata: Metadata = { title: 'Cohorts — Admin' }

export default async function AdminCohortsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'instructor'].includes(profile.role)) redirect('/dashboard')

  const { data: cohorts } = await supabase
    .from('cohorts')
    .select('*, courses(title)')
    .order('start_date', { ascending: false })

  return (
    <div>
      <h1 className={styles.heading}>Cohorts</h1>
      <div className={styles.list}>
        {(cohorts ?? []).map((c) => (
          <div key={c.id} className={styles.row}>
            <div>
              <p className={styles.name}>{c.name}</p>
              <p className={styles.course}>{(c.courses as { title: string } | null)?.title}</p>
            </div>
            <div className={styles.meta}>
              <span className={styles.status}>{c.status}</span>
              <span className={styles.date}>
                {new Date(c.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
