'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import styles from './RESInstrument.module.css'

// Placeholder — replace with Strapi fetch when available
const RES = {
  eyebrow: 'The Instrument',
  title: 'Robot Experience Score',
  acronym: 'RES',
  description:
    'The Robot Experience Score (RES) translates HREF into a repeatable assessment instrument. Each of the six framework dimensions is rated on a 0–100 scale from observed deployment behaviour. The composite score surfaces where a system performs and where it fails the humans around it.',
  rubricUrl: '/research/res-rubric',
  sampleProfile: {
    label: 'Sample profile',
    context: 'Logistics AMR — mid-sized distribution facility',
    scores: [
      { dimension: 'Signal Clarity',       score: 76 },
      { dimension: 'Spatial Legibility',   score: 91 },
      { dimension: 'Perceived Presence',   score: 58 },
      { dimension: 'Failure Transparency', score: 47 },
      { dimension: 'Interaction Fit',      score: 62 },
      { dimension: 'Recovery Design',      score: 38 },
    ],
    composite: 62.8,
  },
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden:  { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
}

export default function RESInstrument() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className="container-fluid">
        <div className="row g-0">

          {/* Description */}
          <div className="col-lg-5">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className={styles.content}
            >
              <motion.p variants={itemVariants} className={styles.eyebrow}>
                {RES.eyebrow}
              </motion.p>
              <motion.div variants={itemVariants} className={styles.titleRow}>
                <h2 className={styles.title}>{RES.title}</h2>
                <span className={styles.acronymTag}>{RES.acronym}</span>
              </motion.div>
              <motion.p variants={itemVariants} className={styles.description}>
                {RES.description}
              </motion.p>
              <motion.div variants={itemVariants}>
                <Link href={RES.rubricUrl} className={styles.cta}>
                  View the full rubric
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Sample profile */}
          <div className="col-lg-7">
            <motion.div
              className={styles.profileWrap}
              initial={{ opacity: 0, x: 24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              <DimensionalProfile profile={RES.sampleProfile} inView={inView} />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── Dimensional profile chart ─────────────────────────────────────────────

interface Score { dimension: string; score: number }
interface Profile { label: string; context: string; scores: Score[]; composite: number }

function DimensionalProfile({ profile, inView }: { profile: Profile; inView: boolean }) {
  return (
    <div className={styles.profile}>
      <div className={styles.profileHeader}>
        <p className={styles.profileLabel}>{profile.label}</p>
        <p className={styles.profileContext}>{profile.context}</p>
      </div>

      <div className={styles.bars}>
        {profile.scores.map((s, i) => (
          <div key={s.dimension} className={styles.barRow}>
            <span className={styles.barDim}>{s.dimension}</span>
            <div className={styles.barTrack} aria-label={`${s.dimension}: ${s.score} out of 100`}>
              <motion.div
                className={styles.barFill}
                initial={{ width: 0 }}
                animate={inView ? { width: `${s.score}%` } : {}}
                transition={{
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.35 + i * 0.08,
                }}
              />
            </div>
            <span className={styles.barScore}>{s.score}</span>
          </div>
        ))}
      </div>

      <div className={styles.composite}>
        <span className={styles.compositeLabel}>RES Composite</span>
        <span className={styles.compositeScore}>{profile.composite.toFixed(1)}</span>
        <span className={styles.compositeScale}>/100</span>
      </div>
    </div>
  )
}
