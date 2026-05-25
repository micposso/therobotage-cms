import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CredentialCard } from '@/components/CredentialCard/CredentialCard'
import type { Credential } from '@/types'
import styles from './page.module.css'

export const metadata: Metadata = { title: 'Credentials' }

export default async function CredentialsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: credentials } = await supabase
    .from('credentials')
    .select('*')
    .eq('user_id', user.id)
    .order('issued_at', { ascending: false })

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Credentials</h1>
      {!credentials || credentials.length === 0 ? (
        <p className={styles.empty}>No credentials issued yet.</p>
      ) : (
        <div className={styles.grid}>
          {credentials.map((cred) => (
            <CredentialCard key={cred.id} credential={cred as Credential} />
          ))}
        </div>
      )}
    </div>
  )
}
