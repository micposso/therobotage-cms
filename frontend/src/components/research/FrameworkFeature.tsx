'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import WhitepaperModal from '@/components/WhitepaperModal/WhitepaperModal'
import styles from './FrameworkFeature.module.css'

// ─── Placeholder data ────────────────────────────────────────────────────────

const DIMENSIONS = [
  { name: 'Signal Clarity',         fill: 82 },
  { name: 'Spatial Legibility',     fill: 74 },
  { name: 'Perceived Presence',     fill: 70 },
  { name: 'Failure Transparency',   fill: 68 },
  { name: 'Interaction Fit',        fill: 79 },
  { name: 'Recovery Design',        fill: 61 },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function FrameworkFeature() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <section className={styles.section} ref={ref} id="ref">
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
              HREF — Human-Robot Experience Framework
            </motion.p>

            <motion.h2
              className={styles.headline}
              initial={{ y: 40, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              A framework for evaluating human-robot interaction in deployment conditions.
            </motion.h2>

            <motion.p
              className={styles.abstract}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              The Human-Robot Experience Framework defines six observable dimensions for evaluating the human side of consumer robotics. It was developed through field observation across logistics, healthcare, and hospitality environments — settings where robots operate alongside non-engineering staff without dedicated HRI support. HREF is not a rating scale. It is a structured lens for identifying where interaction design is succeeding, where it is failing, and what failure modes are costing the deployment.
            </motion.p>

            <motion.p
              className={styles.dimensionLabel}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Six dimensions
            </motion.p>

            <motion.div
              className={styles.chips}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            >
              {DIMENSIONS.map(({ name }) => (
                <span key={name} className={styles.chip}>{name}</span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              <button
                className={styles.ctaFilled}
                onClick={() => setModalOpen(true)}
              >
                Download white paper
              </button>
            </motion.div>

            <WhitepaperModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

            <motion.p
              className={styles.citation}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.55 }}
            >
              Cite as: Posso, M. (2026). <em>The Human-Robot Experience Framework (HREF): A framework for evaluating the human side of consumer robotics</em> (White Paper v2.0). The Robot Age. therobotage.com/research/href. CC BY-NC 4.0.
            </motion.p>
          </div>

          {/* ── Right: schematic visual placeholder ─────────────────── */}
          <motion.div
            className={styles.visual}
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            aria-hidden="true"
          >
            <p className={styles.schematicLabel}>HREF Dimensional Schema</p>
            <div className={styles.schematicGrid}>
              {DIMENSIONS.map(({ name, fill }) => (
                <div key={name} className={styles.schematicRow}>
                  <span className={styles.schematicDimName}>{name}</span>
                  <div className={styles.schematicBar}>
                    <div
                      className={styles.schematicFill}
                      style={{ width: `${fill}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
