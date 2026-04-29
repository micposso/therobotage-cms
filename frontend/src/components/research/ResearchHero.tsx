'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './ResearchHero.module.css'

export default function ResearchHero() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className={styles.section} ref={ref}>
      <div className="container-fluid">
        <motion.p
          className={styles.eyebrow}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          Research pillar
        </motion.p>
        <div className={styles.layout}>
          <motion.h2
            className={styles.headline}
            initial={{ y: 40, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            The machine deploys. The question is whether the people around it were ready.
          </motion.h2>
          <motion.div
            className={styles.body}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          >
            <p>Most robotics research describes what robots do. Ours describes what happens to the humans around them — the signals they miss, the failures they absorb, the interactions they were never designed for.</p>
            <p>The Research pillar runs as a system: a framework, an instrument, and the editorial interpretation that connects both to practice. Each layer feeds the next.</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
