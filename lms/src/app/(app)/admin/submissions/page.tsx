import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminSubmissionRow } from '@/components/AdminSubmissionRow/AdminSubmissionRow'
import styles from './page.module.css'

export const metadata: Metadata = { title: 'Submissions — Admin' }

export default async function AdminSubmissionsPage({
  searchParams,
}: {
  searchParams: { status?: string; week?: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'instructor'].includes(profile.role)) redirect('/dashboard')

  let query = supabase
    .from('submissions')
    .select(`
      *,
      enrollments!inner(
        cohort_id,
        profiles(full_name, email, avatar_url)
      )
    `)
    .order('submitted_at', { ascending: false })

  if (searchParams.status) query = query.eq('status', searchParams.status)
  if (searchParams.week) query = query.eq('week_number', Number(searchParams.week))

  const { data: submissions } = await query

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.heading}>Submissions</h1>
        <div className={styles.filters}>
          {['submitted', 'revision_requested', 'approved'].map((s) => (
            <a
              key={s}
              href={`/admin/submissions?status=${s}`}
              className={`${styles.filter} ${searchParams.status === s ? styles.filterActive : ''}`}
            >
              {s.replace('_', ' ')}
            </a>
          ))}
          {searchParams.status && (
            <a href="/admin/submissions" className={styles.filter}>All</a>
          )}
        </div>
      </div>
      <div className={styles.list}>
        {!submissions || submissions.length === 0 ? (
          <p className={styles.empty}>No submissions.</p>
        ) : (
          submissions.map((sub) => (
            <AdminSubmissionRow
              key={sub.id}
              submission={sub as Parameters<typeof AdminSubmissionRow>[0]['submission']}
            />
          ))
        )}
      </div>
    </div>
  )
}
