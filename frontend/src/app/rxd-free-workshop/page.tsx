import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import Footer from '@/components/Footer/Footer'
import WorkshopForm from './WorkshopForm'
import styles from './workshop.module.css'

export const metadata = {
  title: 'Product & UX Design for the Robot Age — Free Workshop',
  description:
    'You don’t need a $50k humanoid to start designing robot experiences. Three live Zoom sessions covering robotics basics, the RXD framework, and a scored case study on Reachy Mini.',
  openGraph: {
    title: 'Product & UX Design for the Robot Age — Free Workshop',
    description:
      'Three live Zoom sessions covering robotics basics, the RXD framework, and a scored case study on Reachy Mini.',
    images: [{ url: '/images/hand.png', alt: 'The Robot Age' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/hand.png'],
  },
}

export default function RxdFreeWorkshopPage() {
  return (
    <>
      <Nav pinned />

      <PageHero
        eyebrow="Free Workshop"
        title="Product & UX Design for the Robot Age"
        subtitle="You don’t need a $50k humanoid to start designing robot experiences. You need the right lens. Three live Zoom sessions. Robotics basics, the RXD framework in practice, and a scored case study on Reachy Mini — the expressive desktop robot that went viral after CES. Everything you need to design and evaluate human-robot experiences with confidence."
        imageSrc="/images/hand.png"
      />

      <section className={styles.datesSection}>
        <div className="container-fluid">
          <div className={styles.datesGrid}>
            <div className={styles.dateItem}>
              <span className={styles.dateSession}>Session 01</span>
              <span className={styles.dateDay}>Tuesday, June 16</span>
              <span className={styles.dateTime}>7:00 &ndash; 7:45 pm</span>
            </div>
            <span className={styles.dateSep} aria-hidden="true">&rarr;</span>
            <div className={styles.dateItem}>
              <span className={styles.dateSession}>Session 02</span>
              <span className={styles.dateDay}>Tuesday, June 23</span>
              <span className={styles.dateTime}>7:00 &ndash; 7:45 pm</span>
            </div>
            <span className={styles.dateSep} aria-hidden="true">&rarr;</span>
            <div className={styles.dateItem}>
              <span className={styles.dateSession}>Session 03</span>
              <span className={styles.dateDay}>Tuesday, June 30</span>
              <span className={styles.dateTime}>7:00 &ndash; 7:45 pm</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.bodySection}>
        <div className="container-fluid">
          <div className={styles.bodyGrid}>

            {/* Left — copy */}
            <div className={styles.copyCol}>
              <p className={styles.eyebrow}>What you&rsquo;ll learn</p>
              <h2 className={styles.heading}>
                A framework for every professional working beside robots.
              </h2>
              <p className={styles.body}>
                The RXD framework gives you a structured way to evaluate how robots are
                experienced by the people who work with and around them &mdash; not just how
                they perform technically. Across three short sessions, we walk through all
                six dimensions and show you how to apply them to any deployment.
              </p>

              <ul className={styles.bullets}>
                <li className={styles.bullet}>
                  The six dimensions of robot experience design and why each one matters
                </li>
                <li className={styles.bullet}>
                  How to apply RXD scoring to any robot you&rsquo;re evaluating or designing for
                </li>
                <li className={styles.bullet}>
                  Vocabulary to communicate robot behavior clearly to non-technical stakeholders
                </li>
                <li className={styles.bullet}>
                  A live scoring exercise on a real robot, ending in your own Robot Readiness Audit
                </li>
              </ul>

              <div className={styles.meta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Format</span>
                  <span className={styles.metaValue}>Three live sessions &middot; 45 min each &middot; online</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Cost</span>
                  <span className={styles.metaValue}>Free</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Who it&rsquo;s for</span>
                  <span className={styles.metaValue}>
                    Designers, Product Managers, UX Designers, Strategists, Project Managers
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Prerequisites</span>
                  <span className={styles.metaValue}>No technical background required</span>
                </div>
              </div>
            </div>

            {/* Right — form */}
            <div className={styles.formCol}>
              <div className={styles.formCard}>
                <p className={styles.formEyebrow}>Reserve your spot</p>
                <h3 className={styles.formHeading}>
                  This is the founding cohort &mdash; the first time I&rsquo;m running this.
                  Ten seats, direct access to me throughout.
                </h3>
                <p className={styles.formSubheading}>
                  Fill in your details and I&rsquo;ll send you a confirmation with the dates
                  and session links.
                </p>
                <WorkshopForm />
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
