'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './ResearchLicense.module.css'

// Placeholder — replace with Strapi fetch when available
const LICENSE = {
  eyebrow: 'Open Framework',
  statement:
    'HREF is free to use.',
  body:
    'The Human-Robot Experience Framework (HREF) is published under Creative Commons Attribution–NonCommercial 4.0 International (CC BY-NC 4.0). You may use, adapt, and build on it for non-commercial research, design, and deployment work — with attribution to Posso, M. / The Robot Age. If you are using HREF in a deployment, we would like to hear about it.',
  license: 'CC BY-NC 4.0',
  contactUrl: '/connect',
}

export default function ResearchLicense() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className="container-fluid">
        <motion.div
          className={styles.inner}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.content}>
            <p className={styles.eyebrow}>{LICENSE.eyebrow}</p>
            <h2 className={styles.statement}>{LICENSE.statement}</h2>
            <p className={styles.body}>{LICENSE.body}</p>
          </div>
          <div className={styles.badge} aria-label={`Licensed under ${LICENSE.license}`}>
            <LicenseBadge label={LICENSE.license} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── CC badge ─────────────────────────────────────────────────────────────

function LicenseBadge({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 120 64" className={styles.licenseSvg} aria-hidden="true">
      <rect x="0.5" y="0.5" width="119" height="63" className={styles.licenseBorder} />
      <text x="60" y="22" textAnchor="middle" className={styles.licenseBy}>
        BY  NC
      </text>
      <line x1="16" y1="32" x2="104" y2="32" className={styles.licenseRule} />
      <text x="60" y="50" textAnchor="middle" className={styles.licenseLabel}>
        {label}
      </text>
    </svg>
  )
}
