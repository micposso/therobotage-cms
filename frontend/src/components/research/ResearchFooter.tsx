'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import styles from './ResearchFooter.module.css'

export default function ResearchFooter() {
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
          Open research
        </motion.p>

        <motion.h2
          className={styles.headline}
          initial={{ y: 40, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          HREF is free to use. We built it to be adopted, not protected.
        </motion.h2>

        <motion.p
          className={styles.body}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
        >
          HREF and RES are published under CC BY-NC 4.0. Any researcher, practitioner, or organization can use them, adapt them, and apply them to real deployments — as long as the use is non-commercial and the source is credited.
        </motion.p>

        <motion.p
          className={styles.body}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        >
          If you are using HREF in the field, we want to hear about it.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href="/connect" className={styles.cta}>
            Get in touch
            <span className={styles.ctaArrow} aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        </motion.div>

        <motion.p
          className={styles.license}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Licensed under{' '}
          <a
            href="https://creativecommons.org/licenses/by-nc/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.licenseLink}
          >
            Creative Commons BY-NC 4.0
          </a>
          . Non-commercial use and adaptation permitted with attribution.
        </motion.p>
      </div>
    </section>
  )
}
