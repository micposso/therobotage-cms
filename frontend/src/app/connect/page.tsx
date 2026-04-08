import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import Footer from '@/components/Footer/Footer'

export const metadata = {
  title: 'Connect — The Robot Age',
  description: 'Get in touch, follow the work, or join the community.',
}

const channels = [
  {
    label: 'General Enquiries',
    value: 'hello@therobotage.com',
    href: 'mailto:hello@therobotage.com',
  },
  {
    label: 'Press & Media',
    value: 'press@therobotage.com',
    href: 'mailto:press@therobotage.com',
  },
  {
    label: 'Summit Partnerships',
    value: 'summit@therobotage.com',
    href: 'mailto:summit@therobotage.com',
  },
  {
    label: 'LinkedIn',
    value: 'The Robot Age',
    href: 'https://linkedin.com/company/therobotage',
  },
]

export default function ConnectPage() {
  return (
    <>
      <Nav pinned />
      <PageHero
        eyebrow="Connect"
        title="Let's talk."
        subtitle="Whether you're interested in the certification, the summit, a partnership, or just the work — we'd like to hear from you."
      />
      <section style={{ padding: 'var(--space-16) 0' }}>
        <div className="container-fluid">
          <div style={{ maxWidth: 640 }}>
            {channels.map((ch, i) => (
              <div
                key={ch.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  padding: 'var(--space-6) 0',
                  borderTop: i === 0 ? '1px solid var(--color-border-strong)' : '1px solid var(--color-border)',
                  borderBottom: i === channels.length - 1 ? '1px solid var(--color-border-strong)' : 'none',
                }}
              >
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-text-muted)', fontWeight: 300 }}>
                  {ch.label}
                </span>
                <a
                  href={ch.href}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-md)',
                    fontWeight: 400,
                    color: 'var(--color-text)',
                    textDecoration: 'none',
                    borderBottom: '2.5px solid var(--color-text)',
                    paddingBottom: 2,
                    transition: 'color 200ms ease, border-color 200ms ease',
                  }}
                >
                  {ch.value}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
