import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import { getSupabaseJobsService } from '@/lib/supabase/admin'
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
  searchParams: Promise<{ token?: string | string[] }>
}) {
  const { token } = await searchParams

  let maskedEmail: string | null = null
  let unsubscribed = false
  let lookupFailed = false

  if (typeof token === 'string' && UUID_RE.test(token)) {
    try {
      const { data, error } = await getSupabaseJobsService()
        .from('job_alert_subscribers')
        .select('email, status')
        .eq('unsubscribe_token', token)
        .maybeSingle()

      if (error) throw error
      if (data?.email) {
        maskedEmail = maskEmail(data.email)
        unsubscribed = data.status === 'unsubscribed'
      }
    } catch (error) {
      console.error('Failed to resolve unsubscribe token', error)
      lookupFailed = true
    }
  }

  return (
    <>
      <Nav pinned />
      <section className={styles.section}>
        <div className="container-fluid">
          <div className={styles.panel}>
            <p className={styles.eyebrow}>Job alerts</p>
            {typeof token === 'string' && maskedEmail ? (
              <UnsubscribeConfirm token={token} maskedEmail={maskedEmail} unsubscribed={unsubscribed} />
            ) : (
              <>
                <h1 className={styles.headline}>
                  {lookupFailed ? 'Job alert settings are temporarily unavailable.' : 'This link has expired.'}
                </h1>
                <p className={styles.body}>
                  {lookupFailed
                    ? 'Please try again in a few minutes.'
                    : 'If you are still receiving alerts, reply to one of the emails to ask us to remove your address.'}
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
