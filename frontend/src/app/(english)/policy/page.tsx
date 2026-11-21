import type { Metadata } from 'next'
import Link from 'next/link'
import Footer from '@/components/Footer/Footer'
import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import { imageUrl } from '@/lib/image-assets'
import { robotPolicies } from '@/lib/robotPolicyRecords'
import PolicyDirectory from './PolicyDirectory'
import styles from './policy.module.css'

const title = 'Robot Policy Watch | Robotics Laws & Regulations | TheRobotAge'
const description = 'Track robotics legislation, regulations, and safety standards across New York, New Jersey, and Connecticut. Explore policy developments affecting commercial robots.'
const shareTitle = 'Robot Policy Watch | The Robot Age'
const shareDescription = 'Track robotics laws, regulations, and safety standards in New York, New Jersey, and Connecticut, plus relevant federal policies.'
const shareImage = {
  url: imageUrl('/images/robot-policy-watch-social.jpg'),
  width: 1200,
  height: 630,
  type: 'image/jpeg',
  alt: 'Robot Policy Watch by The Robot Age, with an illustration of a face split between a person and a robot.',
}

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: '/policy' },
  openGraph: {
    title: shareTitle,
    description: shareDescription,
    url: '/policy',
    type: 'website',
    siteName: 'The Robot Age',
    images: [shareImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: shareTitle,
    description: shareDescription,
    images: [{ url: shareImage.url, alt: shareImage.alt }],
  },
}

export default function PolicyPage() {
  return (
    <>
      <a className={styles.skip} href="#policy-main">Skip to content</a>
      <Nav pinned />
      <main id="policy-main" tabIndex={-1} className={styles.page}>
        <PageHero
          compact
          eyebrow="RESEARCH / ROBOT POLICY WATCH"
          title="Robot Policy Watch"
          subtitle="Track legislation, regulations, and safety standards affecting commercial robotics deployment across New York, New Jersey, and Connecticut."
        >
          <p className={styles.heroSupport}>
            Understand what&apos;s changing, who is affected, and what it means for robots operating in buildings, workplaces, and public spaces.
          </p>
        </PageHero>
        <PolicyDirectory policies={robotPolicies} />
        <section aria-labelledby="policy-alerts-heading" className={styles.alerts}>
          <div className={`container-fluid ${styles.alertsInner}`}>
            <div>
              <h2 id="policy-alerts-heading" className={styles.sectionTitle}>Stay informed about robotics policy.</h2>
              <p>Get updates about legislation, regulations, and safety standards affecting commercial robots across the NY–NJ–CT region.</p>
              <p id="policy-alerts-note" className={styles.alertsNote}>Policy alerts are coming soon. Contact us to express interest.</p>
            </div>
            <Link className={styles.alertLink} href="/connect" aria-describedby="policy-alerts-note">Get Policy Alerts <span aria-hidden="true">→</span></Link>
          </div>
        </section>
        <section aria-labelledby="policy-about-heading" className={`container-fluid ${styles.about}`}>
          <h2 id="policy-about-heading" className={styles.sectionTitle}>About Robot Policy Watch</h2>
          <p>Robot Policy Watch is a research initiative from TheRobotAge that helps organizations and communities follow robotics-related policies and understand their implications for adoption and deployment.</p>
          <p>Robot Policy Watch provides general information and research. It does not constitute legal advice. Always consult official sources and qualified professionals when evaluating regulatory obligations.</p>
          <Link className={styles.textLink} href="/enterprise">Explore TheRobotAge enterprise services <span aria-hidden="true">→</span></Link>
        </section>
      </main>
      <Footer />
    </>
  )
}
