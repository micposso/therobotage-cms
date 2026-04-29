'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import WhitepaperModal from '@/components/WhitepaperModal/WhitepaperModal'
import styles from './FrameworkFeature.module.css'

// ─── Placeholder data ────────────────────────────────────────────────────────

const DIMENSIONS = [
  { name: 'Signal Clarity',       fill: 82, description: 'Whether the robot\'s intent and state are readable to the humans nearby.' },
  { name: 'Spatial Legibility',   fill: 74, description: 'What the robot communicates about the space it occupies, and whether that signal matches the environment.' },
  { name: 'Perceived Presence',   fill: 70, description: 'How the robot\'s voice, form, aesthetic, and emotional register are read by the people around it.' },
  { name: 'Failure Transparency', fill: 68, description: 'Whether the robot can communicate why it has stopped, and to whom.' },
  { name: 'Interaction Fit',      fill: 79, description: 'The gap between where the robot was designed to operate and where it actually does.' },
  { name: 'Recovery Design',      fill: 61, description: 'What the robot does, and what it communicates, when the intended interaction fails.' },
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
              className={styles.sectionLabel}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
            >
              01 — Framework
            </motion.p>

            <motion.p
              className={styles.eyebrow}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              HREF — Human-Robot Experience Framework
            </motion.p>

            <motion.div
              className={styles.abstract}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            >
              <p>HREF defines six observable dimensions for evaluating the human side of consumer robotics. It was developed by synthesizing existing human-robot interaction research with structured analysis of consumer robotics deployed in logistics, healthcare, and hospitality contexts — environments where robots increasingly operate alongside non-engineering staff without dedicated HRI support.</p>
              <p>It distills a literature base that has, until now, lacked a unified framework accessible to practitioners outside engineering. HREF is not a rating scale. It is a structured lens for identifying where interaction design is succeeding, where it is failing, and what those failure modes are costing the deployment.</p>
            </motion.div>

            <motion.p
              className={styles.dimensionLabel}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              The six dimensions
            </motion.p>

            <div className={styles.dimensionsList}>
              {DIMENSIONS.map(({ name, description }, i) => (
                <motion.div
                  key={name}
                  className={styles.dimensionItem}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.35 + i * 0.07 }}
                >
                  <p className={styles.dimensionIndex}>{String(i + 1).padStart(2, '0')}</p>
                  <p className={styles.dimensionName}>{name}</p>
                  <p className={styles.dimensionDesc}>{description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              <button
                className={styles.ctaFilled}
                onClick={() => setModalOpen(true)}
              >
                Download white paper v2.0
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
