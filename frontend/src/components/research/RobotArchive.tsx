'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import styles from './RobotArchive.module.css'

// ─── Placeholder data ────────────────────────────────────────────────────────

const DIMENSIONS = ['Signal Clarity', 'Spatial Legibility', 'Failure Transparency', 'Interaction Fit', 'Recovery Design']

const ROBOTS = [
  {
    name: 'Aethon TUG',
    context: 'Healthcare / medication delivery',
    date: 'Apr 14, 2026',
    scores: [78, 65, 82, 71, 55],
  },
  {
    name: 'Boston Dynamics Spot',
    context: 'Inspection / industrial sites',
    date: 'Apr 7, 2026',
    scores: [84, 88, 59, 62, 73],
  },
  {
    name: 'Savioke Relay',
    context: 'Hospitality / in-room delivery',
    date: 'Mar 31, 2026',
    scores: [91, 77, 70, 85, 66],
  },
  {
    name: 'Locus Robotics Origin',
    context: 'Logistics / warehouse pick-assist',
    date: 'Mar 24, 2026',
    scores: [75, 80, 68, 74, 60],
  },
  {
    name: 'Moxi — Diligent Robotics',
    context: 'Healthcare / nurse-assist',
    date: 'Mar 17, 2026',
    scores: [69, 72, 55, 80, 48],
  },
  {
    name: 'Bear Robotics Servi',
    context: 'Hospitality / table service',
    date: 'Mar 10, 2026',
    scores: [74, 81, 52, 69, 47],
  },
]

const cardVariants = {
  hidden:  { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function RobotArchive() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className={styles.section} ref={ref}>
      <div className="container-fluid">

        <div className={styles.sectionHeader}>
          <div>
            <motion.p
              className={styles.eyebrow}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
            >
              Robot of the week
            </motion.p>
            <motion.h2
              className={styles.headline}
              initial={{ y: 40, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              Scored. Observed. Documented.
            </motion.h2>
          </div>
        </div>

        <motion.div
          className={styles.grid}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {ROBOTS.map((robot) => (
            <motion.div key={robot.name} className={styles.card} variants={cardVariants}>
              <p className={styles.cardDate}>{robot.date}</p>
              <p className={styles.cardName}>{robot.name}</p>
              <p className={styles.cardContext}>{robot.context}</p>
              <div className={styles.miniProfile} aria-label={`RES profile for ${robot.name}`}>
                {DIMENSIONS.map((dim, i) => (
                  <div key={dim} className={styles.miniRow}>
                    <span className={styles.miniLabel}>{dim}</span>
                    <div className={styles.miniBar}>
                      <div
                        className={styles.miniBarFill}
                        style={{ width: `${robot.scores[i]}%` }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className={styles.archiveRow}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link href="/research/robots" className={styles.archiveCta}>
              View full archive
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
