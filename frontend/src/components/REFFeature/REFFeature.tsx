'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import styles from './REFFeature.module.css'

// Placeholder — replace with Strapi fetch when available
const REF = {
  eyebrow: 'The Framework',
  title: 'Robot Experience Framework',
  acronym: 'REF',
  version: 'v1.0',
  abstract:
    'A structured vocabulary for evaluating how robotic systems communicate, fail, and recover in mixed human-robot environments. REF defines five dimensions for assessing the experiential quality of a deployment — developed through fieldwork across logistics, healthcare, and public-facing service contexts.',
  dimensions: [
    { id: 'signal-clarity',       label: 'Signal Clarity' },
    { id: 'spatial-legibility',   label: 'Spatial Legibility' },
    { id: 'failure-transparency', label: 'Failure Transparency' },
    { id: 'interaction-fit',      label: 'Interaction Fit' },
    { id: 'recovery-design',      label: 'Recovery Design' },
  ],
  readUrl: '/research/ref',
  downloadUrl: '/downloads/ref-v1.pdf',
  citation:
    'The Robot Age Research Group. Robot Experience Framework, v1.0. therobotage.com/research/ref. CC BY-NC 4.0.',
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden:  { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
}

export default function REFFeature() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className="container-fluid">
        <div className="row g-0">

          {/* Content */}
          <div className="col-lg-7">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className={styles.content}
            >
              <motion.p variants={itemVariants} className={styles.eyebrow}>
                {REF.eyebrow}
              </motion.p>

              <motion.div variants={itemVariants} className={styles.titleRow}>
                <h2 className={styles.title}>{REF.title}</h2>
                <span className={styles.versionTag}>{REF.acronym} {REF.version}</span>
              </motion.div>

              <motion.p variants={itemVariants} className={styles.abstract}>
                {REF.abstract}
              </motion.p>

              <motion.ul variants={itemVariants} className={styles.dimensions} aria-label="Framework dimensions">
                {REF.dimensions.map((d) => (
                  <li key={d.id} className={styles.chip}>{d.label}</li>
                ))}
              </motion.ul>

              <motion.div variants={itemVariants} className={styles.actions}>
                <Link href={REF.readUrl} className={styles.ctaRead}>
                  Read the framework
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <a href={REF.downloadUrl} className={styles.ctaDownload} download>
                  Download PDF
                </a>
              </motion.div>

              <motion.p variants={itemVariants} className={styles.citation}>
                {REF.citation}
              </motion.p>
            </motion.div>
          </div>

          {/* Schematic */}
          <div className="col-lg-5">
            <motion.div
              className={styles.visualWrap}
              initial={{ opacity: 0, x: 24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
              aria-hidden="true"
            >
              <REFSchematic dimensions={REF.dimensions} />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── Schematic ────────────────────────────────────────────────────────────────

interface Dimension { id: string; label: string }

function REFSchematic({ dimensions }: { dimensions: Dimension[] }) {
  const rowH = 40
  const totalH = dimensions.length * rowH + 56
  const trackX = 188
  const trackW = 88

  return (
    <svg
      viewBox={`0 0 290 ${totalH}`}
      className={styles.schematic}
      role="img"
      aria-label="REF evaluation dimensions schematic"
    >
      {/* Header */}
      <text x="0" y="14" className={styles.schematicHeader}>
        Evaluation Dimensions
      </text>
      <line x1="0" y1="22" x2="290" y2="22" className={styles.schematicRule} />

      {/* Dimension rows */}
      {dimensions.map((d, i) => {
        const rowY = 22 + i * rowH
        return (
          <g key={d.id}>
            <text x="0" y={rowY + rowH / 2 + 4} className={styles.schematicDim}>
              {d.label}
            </text>
            <rect
              x={trackX}
              y={rowY + 11}
              width={trackW}
              height={rowH - 22}
              className={styles.schematicTrack}
            />
            <circle
              cx={trackX}
              cy={rowY + rowH / 2}
              r="3"
              className={styles.schematicDot}
            />
            <line x1="0" y1={rowY + rowH} x2="290" y2={rowY + rowH} className={styles.schematicRule} />
          </g>
        )
      })}

      {/* Footer */}
      <text x="0" y={22 + dimensions.length * rowH + 22} className={styles.schematicFooter}>
        REF v1.0
      </text>
      <text
        x="290"
        y={22 + dimensions.length * rowH + 22}
        textAnchor="end"
        className={styles.schematicFooter}
      >
        therobotage.com/research/ref
      </text>
    </svg>
  )
}
