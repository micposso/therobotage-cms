import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import styles from './page.module.css'

export const metadata: Metadata = { title: 'Profile' }

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Profile</h1>
      <div className={styles.fields}>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Name</span>
          <span className={styles.fieldValue}>{profile?.full_name ?? '—'}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Email</span>
          <span className={styles.fieldValue}>{user.email}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Role</span>
          <span className={styles.fieldValue}>{profile?.role ?? 'student'}</span>
        </div>
      </div>
      <a href="/profile/credentials" className={styles.credLink}>View credentials →</a>
    </div>
  )
}
