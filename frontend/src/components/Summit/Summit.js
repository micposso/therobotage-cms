'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './Summit.module.css'

const tracks = [
  {
    number: '01',
    title: 'Product Design & HRI',
    description: 'Designing interfaces for embodied systems',
  },
  {
    number: '02',
    title: 'Ethics & Responsibility',
    description: 'Accountability frameworks for real-world deployment',
  },
  {
    number: '03',
    title: 'Access & Equity',
    description: "Who benefits from the robot age — and who doesn't",
  },
  {
    number: '04',
    title: 'Business & Strategy',
    description: 'Operationalizing robotics across industries',
  },
]

const trackContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const trackVariants = {
  hidden:  { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export default function Summit() {
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className="container-fluid">
        <div className="row g-0">

          {/* Left col */}
          <div className={`col-lg-6 ${styles.leftCol}`}>
            <motion.p
              className={styles.eyebrow}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              New York City — Fall 2026
            </motion.p>

            <motion.h2
              className={styles.headline}
              initial={{ y: 40, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              The Robot Age Summit
            </motion.h2>

            <motion.p
              className={styles.subheadline}
              initial={{ y: 40, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            >
              A one-day gathering for product designers, UX strategists, and
              business leaders navigating the age of embodied AI. Four tracks.
              Real robots. No hype.
            </motion.p>

            <motion.div
              className={styles.ctaGroup}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <button className={styles.ctaPrimary}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M7 1a4 4 0 0 1 4 4c0 2.5-4 8-4 8S3 7.5 3 5a4 4 0 0 1 4-4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                  <circle cx="7" cy="5" r="1.2" fill="currentColor"/>
                </svg>
                Get Notified
              </button>

              <button className={styles.ctaSecondary}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <rect x="4.5" y="1" width="5" height="7" rx="2.5" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M2 7.5A5 5 0 0 0 12 7.5M7 12v1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                Apply to Speak
              </button>
            </motion.div>
          </div>

          {/* Right col — tracks */}
          <div className={`col-lg-6 ${styles.rightCol}`}>
            <motion.div
              className={styles.tracks}
              variants={trackContainerVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
            >
              {tracks.map((track) => (
                <motion.div key={track.number} className={styles.track} variants={trackVariants}>
                  <span className={styles.trackNumber}>{track.number}</span>
                  <div className={styles.trackContent}>
                    <p className={styles.trackTitle}>{track.title}</p>
                    <p className={styles.trackDescription}>{track.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
