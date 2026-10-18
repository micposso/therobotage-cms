import { imageUrl } from '@/lib/image-assets'
import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import Footer from '@/components/Footer/Footer'
import Link from 'next/link'
import styles from './workshop.module.css'
import { Fragment } from 'react'
import { workshopEvent } from '@/lib/events'

export const metadata = {
  title: "Product & UX Design for a World With Robots — Free Workshop",
  description:
    "You don’t need a $50k humanoid to start designing robot experiences. Three live Zoom sessions covering robotics basics, the RXD framework, and a scored case study on Reachy Mini.",
  openGraph: {
    title: "Product & UX Design for a World With Robots — Free Workshop",
    description:
      "Three live Zoom sessions covering robotics basics, the RXD framework, and a scored case study on Reachy Mini.",
    images: [{ url: imageUrl("/images/hand.png"), alt: "The Robot Age" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [imageUrl("/images/hand.png")],
  },
}

export default function RxdFreeWorkshopPage() {
  return (
    <>
      <Nav pinned />

      <PageHero
        eyebrow="Past Workshop · June 2026"
        title={workshopEvent.title}
        subtitle={workshopEvent.description}
        imageSrc="/images/hand.png"
      />

      <section className={styles.datesSection}>
        <div className="container-fluid">
          <div className={styles.datesGrid}>
            {workshopEvent.dates.map((session, index) => (
              <Fragment key={session.label}>
                {index > 0 && <span className={styles.dateSep} aria-hidden="true">&rarr;</span>}
                <div className={styles.dateItem}>
                  <span className={styles.dateSession}>{session.label}</span>
                  <span className={styles.dateDay}>{session.date}</span>
                  {session.time && <span className={styles.dateTime}>{session.time}</span>}
                </div>
              </Fragment>
            ))}
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
                {workshopEvent.learningOutcomes?.map((outcome) => (
                  <li key={outcome} className={styles.bullet}>{outcome}</li>
                ))}
              </ul>

              <div className={styles.meta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Format</span>
                  <span className={styles.metaValue}>{workshopEvent.format}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Cost</span>
                  <span className={styles.metaValue}>{workshopEvent.cost}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Who it&rsquo;s for</span>
                  <span className={styles.metaValue}>
                    {workshopEvent.audience.join(', ')}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Prerequisites</span>
                  <span className={styles.metaValue}>{workshopEvent.prerequisites}</span>
                </div>
              </div>
            </div>

            {/* Right — form */}
            <div className={styles.formCol}>
              <div className={styles.formCard}>
                <p className={styles.formEyebrow}>Registration closed</p>
                <h3 className={styles.formHeading}>This page describes the June 2026 workshop.</h3>
                <p className={styles.formSubheading}>Explore the Academy for current RPDP and RDP program information, or request a Live Robot Lab for your group.</p>
                <p><Link href="/learn#programs">Explore Professional Programs →</Link></p>
                <p><Link href="/live-robot-lab">Explore Live Robot Lab →</Link></p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
