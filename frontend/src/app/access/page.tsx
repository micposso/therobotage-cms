import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import Footer from '@/components/Footer/Footer'

export const metadata = {
  title: 'Access — The Robot Age',
  description: 'Join the waitlist for the REP certification.',
}

export default function AccessPage() {
  return (
    <>
      <Nav pinned />
      <PageHero
        eyebrow="Get Access"
        title="Be first in."
        subtitle="The Robotics Experience Practitioner certification is launching soon. Join the waitlist and we'll notify you when enrollment opens — along with early access offers and pre-launch resources."
      />
      <section style={{ padding: 'var(--space-16) 0', borderTop: '1px solid var(--color-border)' }}>
        <div className="container-fluid">
          <div style={{ maxWidth: 560 }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', lineHeight: 1.8, marginBottom: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
              We&apos;re keeping the first cohort small. Leave your name and email and we&apos;ll be in touch before the public announcement.
            </p>
            <form style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: 400 }}>
              <input
                type="text"
                placeholder="Your name"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  background: 'none',
                  border: 'none',
                  borderBottom: '1.5px solid var(--color-border-strong)',
                  padding: 'var(--space-3) 0',
                  color: 'var(--color-text)',
                  outline: 'none',
                  width: '100%',
                }}
              />
              <input
                type="email"
                placeholder="Your email"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  background: 'none',
                  border: 'none',
                  borderBottom: '1.5px solid var(--color-border-strong)',
                  padding: 'var(--space-3) 0',
                  color: 'var(--color-text)',
                  outline: 'none',
                  width: '100%',
                }}
              />
              <div style={{ marginTop: 'var(--space-4)' }}>
                <button
                  type="submit"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 500,
                    letterSpacing: '0.06em',
                    color: 'var(--color-text)',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    paddingBottom: 2,
                    borderBottom: '2.5px solid var(--color-text)',
                    cursor: 'pointer',
                  }}
                >
                  Join the Waitlist
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
