import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import styles from './page.module.css'

export const metadata: Metadata = { title: 'Footage — Admin' }

export default async function AdminFootagePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'instructor'].includes(profile.role)) redirect('/dashboard')

  const { data: footages } = await supabase
    .from('robot_footage')
    .select(`
      *,
      enrollments!inner(
        profiles(full_name, email),
        cohorts(name)
      )
    `)
    .order('uploaded_at', { ascending: false })

  return (
    <div>
      <h1 className={styles.heading}>Robot Footage</h1>
      <div className={styles.list}>
        {!footages || footages.length === 0 ? (
          <p className={styles.empty}>No footage uploaded.</p>
        ) : (
          footages.map((f) => {
            const enrollment = f.enrollments as { profiles: { full_name: string; email: string } | null; cohorts: { name: string } | null }
            return (
              <div key={f.id} className={styles.row}>
                <div>
                  <p className={styles.name}>{enrollment.profiles?.full_name ?? '—'}</p>
                  <p className={styles.meta}>{enrollment.cohorts?.name} · Week {f.week_number}</p>
                </div>
                <div className={styles.right}>
                  <span className={styles.status}>{f.viewed_at ? 'Viewed' : 'Not viewed'}</span>
                  <span className={styles.date}>
                    {new Date(f.uploaded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
