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
        <motion.h2
          className={styles.headline}
          initial={{ y: 40, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          The machine deploys. The question is whether the people around it were ready.
        </motion.h2>
        <motion.p
          className={styles.body}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
        >
          Most research on robotics describes what robots do. This research describes what happens to the humans around them — the signals they miss, the failures they absorb, the interactions they were never designed for. The Research pillar exists to make those dynamics legible, measurable, and improvable.
        </motion.p>
      </div>
    </section>
  )
}
