import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import UnsubscribeConfirm from './UnsubscribeConfirm'
import styles from './unsubscribe.module.css'

// This route reads searchParams and mutates nothing. The unsubscribe itself happens in a
// Server Action posted from the confirmation form, because corporate mail scanners and
// Gmail's link prefetcher issue GET requests against every URL in an email.
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Job alerts — The Robot Age',
  description: 'Manage your robotics job alert subscription.',
  robots: { index: false, follow: false },
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!domain) return 'your address'
  const head = local.slice(0, 2)
  return `${head}${'*'.repeat(Math.max(local.length - 2, 1))}@${domain}`
}

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  let maskedEmail: string | null = null

  if (token && UUID_RE.test(token)) {
    try {
      const { data } = await getSupabaseAdmin()
        .from('job_alert_subscribers')
        .select('email')
        .eq('unsubscribe_token', token)
        .maybeSingle()

      if (data?.email) maskedEmail = maskEmail(data.email)
    } catch (error) {
      console.error('Failed to resolve unsubscribe token', error)
    }
  }

  return (
    <>
      <Nav pinned />
      <section className={styles.section}>
        <div className="container-fluid">
          <div className={styles.panel}>
            <p className={styles.eyebrow}>Job alerts</p>
            {token && maskedEmail ? (
              <UnsubscribeConfirm token={token} maskedEmail={maskedEmail} />
            ) : (
              // Never confirm whether an address is on the list.
              <>
                <h1 className={styles.headline}>This link has expired.</h1>
                <p className={styles.body}>
                  The unsubscribe link is no longer valid. If you are still receiving
                  emails, reply to any of them and we will remove you by hand.
                </p>
              </>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
