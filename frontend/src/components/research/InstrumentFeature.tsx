'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import styles from './InstrumentFeature.module.css'

// ─── Placeholder data ────────────────────────────────────────────────────────

const SAMPLE_PROFILE = {
  robotName: 'Bear Robotics — Servi',
  context: 'Hospitality / table service',
  dimensions: [
    { name: 'Signal Clarity',       score: 74 },
    { name: 'Spatial Legibility',   score: 81 },
    { name: 'Perceived Presence',   score: 65 },
    { name: 'Failure Transparency', score: 52 },
    { name: 'Interaction Fit',      score: 69 },
    { name: 'Recovery Design',      score: 47 },
  ],
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function InstrumentFeature() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className={styles.section} ref={ref}>
      <div className="container-fluid">
        <div className={styles.layout}>

          {/* ── Left: copy ─────────────────────────────────────────── */}
          <div>
            <motion.p
              className={styles.eyebrow}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
            >
              RES — Robot Experience Score
            </motion.p>

            <motion.h2
              className={styles.headline}
              initial={{ y: 40, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              HREF applied. A scoring instrument built for field use.
            </motion.h2>

            <motion.p
              className={styles.body}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              The Robot Experience Score (RES) translates the six HREF dimensions into an observable, repeatable rubric. A trained evaluator can produce a dimensional profile for any deployed robot in a single session — no sensor data, no proprietary access, no engineering background required. The score surfaces where interaction design is functioning and where it is creating friction for the humans who work alongside the machine.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <Link href="/research/ref#rubric" className={styles.cta}>
                View the full rubric
                <span className={styles.ctaArrow} aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            </motion.div>
          </div>

          {/* ── Right: dimensional profile visual ───────────────────── */}
          <motion.div
            className={styles.profileVisual}
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            aria-hidden="true"
          >
            <p className={styles.profileLabel}>Sample RES dimensional profile</p>
            <p className={styles.profileTitle}>{SAMPLE_PROFILE.robotName}</p>
            <p className={styles.profileMeta}>{SAMPLE_PROFILE.context}</p>

            <div className={styles.dimensionList}>
              {SAMPLE_PROFILE.dimensions.map(({ name, score }) => (
                <div key={name} className={styles.dimensionRow}>
                  <div className={styles.dimensionMeta}>
                    <span className={styles.dimensionName}>{name}</span>
                    <span className={styles.dimensionScore}>{score}</span>
                  </div>
                  <div className={styles.bar}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className={styles.profileNote}>
              Placeholder data. Scores are illustrative only and do not represent an assessed deployment.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
