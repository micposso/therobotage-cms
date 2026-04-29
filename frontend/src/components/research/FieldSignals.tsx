'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import styles from './FieldSignals.module.css'

// ─── Placeholder data ────────────────────────────────────────────────────────

const ESSAYS = [
  {
    number: '01',
    slug: '/research/field-signals/failure-transparency-costs',
    title: 'Failure transparency is not a UX nice-to-have. It is a deployment cost.',
    teaser: 'When a robot cannot communicate why it has stopped, the burden of interpretation falls on the nearest human. That human is almost never trained for it. What that costs, and how to design around it.',
    date: 'Apr 10, 2026',
  },
  {
    number: '02',
    slug: '/research/field-signals/spatial-legibility-hospitals',
    title: 'Spatial legibility in clinical environments: what robots announce and what they conceal.',
    teaser: 'A robot that occupies space communicates something about that space — whether its designers intended it to or not. Three patterns from healthcare deployments where the signal was wrong.',
    date: 'Mar 27, 2026',
  },
  {
    number: '03',
    slug: '/research/field-signals/recovery-design-gap',
    title: 'The recovery design gap.',
    teaser: 'Most HRI design stops at the moment of success. Recovery Design asks what the robot does — and communicates — when the intended interaction fails. Most deployed robots have no answer.',
    date: 'Mar 13, 2026',
  },
  {
    number: '04',
    slug: '/research/field-signals/interaction-fit-mismatch',
    title: 'Interaction Fit: when the behavioral model does not match the environment.',
    teaser: 'A robot designed for warehouse aisles behaves differently in a clinical hallway. Interaction Fit measures the gap between where a robot was designed to operate and where it actually does.',
    date: 'Feb 28, 2026',
  },
]

const itemVariants = {
  hidden:  { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function FieldSignals() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className={styles.section} ref={ref}>
      <div className="container-fluid">

        <div className={styles.sectionHeader}>
          <motion.p
            className={styles.sectionLabel}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            03 — Field Signals
          </motion.p>
          <motion.h2
            className={styles.headline}
            initial={{ y: 40, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            Editorial essays from the human side of robotics.
          </motion.h2>
          <motion.p
            className={styles.body}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            Where the framework ends and the analysis begins. Field Signals examines deployment patterns, design decisions, and the operational consequences that follow.
          </motion.p>
        </div>

        <motion.div
          className={styles.list}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {ESSAYS.map((essay) => (
            <motion.div key={essay.number} variants={itemVariants}>
              <Link href={essay.slug} className={styles.item}>
                <span className={styles.number}>{essay.number}</span>
                <div className={styles.itemBody}>
                  <span className={styles.itemDate}>{essay.date}</span>
                  <p className={styles.itemTitle}>{essay.title}</p>
                  <p className={styles.itemTeaser}>{essay.teaser}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className={styles.archiveRow}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            <Link href="/research/field-signals" className={styles.archiveCta}>
              View full index
              <span className={styles.ctaArrow} aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </motion.div>
        </div>

      </div>
    </section>
  )
}
