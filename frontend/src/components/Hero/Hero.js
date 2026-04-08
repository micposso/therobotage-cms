'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import styles from './Hero.module.css'

// ─── Content ──────────────────────────────────────────────────────────────────
const eyebrow = 'The Robot Age  ·  Robotic Literacy for All'

const headlineWords = ['Robots', 'are', 'entering', 'every', 'field.']

const subtext =
  'Design, strategy, healthcare, operations — the robot age is already reshaping how we work. The Robot Age builds the literacy to navigate it, for everyone.'

const ctaPrimary = { label: 'Join the Waitlist', href: '/waitlist' }
const ctaGhost   = { label: 'Explore the platform', href: '/learn' }

const TICKER_ITEMS = [
  'Product Design', 'Healthcare', 'UX Strategy', 'Manufacturing',
  'Business Operations', 'Construction', 'Logistics', 'Education',
  'Architecture', 'Finance', 'Retail', 'Agriculture',
]
// Duplicate for seamless infinite scroll
const tickerTrack = [...TICKER_ITEMS, ...TICKER_ITEMS]

// ─── Component ────────────────────────────────────────────────────────────────
export default function Hero() {
  return (
    <section className={styles.section}>
      {/* Background decorations */}
      <div className={styles.gridTexture} aria-hidden="true" />
      <div className={styles.radialGlow}  aria-hidden="true" />

      <div className={`container-fluid ${styles.content}`}>
        <div className="row">
          <div className="col-12">

            {/* Eyebrow */}
            <motion.p
              className={styles.eyebrow}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {eyebrow}
            </motion.p>

            {/* Headline */}
            <h1 className={styles.headline} aria-label={headlineWords.join(' ')}>
              {headlineWords.map((word, i) => (
                <span key={word + i} className={styles.word}>
                  <motion.span
                    className={word === 'field.' ? styles.wordAccent : undefined}
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.75,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.25 + i * 0.13,
                    }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h1>

            {/* Subtext */}
            <motion.p
              className={styles.subtext}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.0 }}
            >
              {subtext}
            </motion.p>

            {/* CTA row */}
            <motion.div
              className={styles.ctaRow}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.15 }}
            >
              <Link href={ctaPrimary.href} className={styles.ctaPrimary}>
                {ctaPrimary.label}
              </Link>
              <Link href={ctaGhost.href} className={styles.ctaGhost}>
                {ctaGhost.label}
                <span className={styles.arrow} aria-hidden="true">→</span>
              </Link>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Ticker */}
      <motion.div
        className={styles.ticker}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.4 }}
        aria-hidden="true"
      >
        <div className={styles.tickerTrack}>
          {tickerTrack.map((item, i) => (
            <span key={i} className={styles.tickerItem}>
              {item}
              <span className={styles.tickerDot} />
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
