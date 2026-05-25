import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import styles from './page.module.css'

export const metadata: Metadata = { title: 'Credentials — Admin' }

export default async function AdminCredentialsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'instructor'].includes(profile.role)) redirect('/dashboard')

  const { data: credentials } = await supabase
    .from('credentials')
    .select('*, profiles(full_name, email)')
    .order('issued_at', { ascending: false })

  return (
    <div>
      <h1 className={styles.heading}>Credentials issued</h1>
      <div className={styles.list}>
        {!credentials || credentials.length === 0 ? (
          <p className={styles.empty}>No credentials issued yet.</p>
        ) : (
          credentials.map((c) => {
            const recipient = c.profiles as { full_name: string; email: string } | null
            return (
              <div key={c.id} className={styles.row}>
                <div>
                  <p className={styles.name}>{recipient?.full_name ?? '—'}</p>
                  <p className={styles.email}>{recipient?.email}</p>
                </div>
                <div className={styles.right}>
                  <span className={styles.course}>{c.course_slug.toUpperCase()}</span>
                  {c.is_founding && <span className={styles.founding}>Founding</span>}
                  <span className={styles.date}>
                    {new Date(c.issued_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  {c.credential_net_public_url && (
                    <a href={c.credential_net_public_url} target="_blank" rel="noopener noreferrer" className={styles.link}>View</a>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
