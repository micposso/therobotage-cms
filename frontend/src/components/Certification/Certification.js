'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { certifications as tracks } from '@/lib/certifications'
import styles from './Certification.module.css'

const stats = [
  {
    value: '$205B',
    label: 'Global robotics market by 2030',
    source: 'GlobalData, 2024',
  },
  {
    value: '36.8M',
    label: 'Robots already operating worldwide',
    source: 'IFR, 2024',
  },
  {
    value: '78M',
    label: 'Net new jobs created by automation by 2030',
    source: 'World Economic Forum, 2025',
  },
  {
    value: '2.1M',
    label: 'Skilled roles that will go unfilled without a prepared workforce',
    source: 'Deloitte / NAM, 2024',
  },
]

// ─── Count-up ─────────────────────────────────────────────────────────────────

function CountUp({ target, suffix, isActive }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isActive) return
    let current = 0
    const duration = 1200
    const interval = 16
    const increment = target / (duration / interval)

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, interval)

    return () => clearInterval(timer)
  }, [isActive, target])

  return <>{count}{suffix}</>
}

// ─── Stat card variants ───────────────────────────────────────────────────────

const statContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const statVariants = {
  hidden:  { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Certification() {
  const sectionRef  = useRef(null)
  const specsRef    = useRef(null)
  const inView      = useInView(sectionRef, { once: true, margin: '-80px' })
  const specsInView = useInView(specsRef,   { once: true, margin: '-80px' })

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className="container-fluid">

        {/* ── Row 1: Header ─────────────────────────────────────────────────── */}
        <div className={`row align-items-end ${styles.headerRow}`}>
          <div className="col-lg-6">
            <motion.p
              className={styles.eyebrow}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
            >
              Flagship Certification
            </motion.p>
            <motion.h2
              className={styles.headline}
              initial={{ y: 40, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              Become a Robotics Experience Practitioner
            </motion.h2>
          </div>
          <div className="col-lg-5 offset-lg-1">
            <motion.p
              className={styles.subhead}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              The REP credential is built for product designers, UX strategists, and business leaders who shape the spaces, systems, and decisions where humans and robots meet. No engineering background required.
            </motion.p>
          </div>
        </div>

        {/* ── Row 2: Main content ───────────────────────────────────────────── */}
        <div className="row g-4 align-items-stretch">

          {/* Featured card */}
          <div className="col-lg-7">
            <motion.div
              className={styles.featuredCard}
              initial={{ x: -40, opacity: 0 }}
              animate={inView ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Top */}
              <div>
                <span className={styles.badge}>REP — Robotics Experience Practitioner</span>
                <h3 className={styles.cardName}>Practitioner Track</h3>
                <p className={styles.cardDescription}>
                  A four-week hybrid program covering the human side of robotics — how robots perceive and act, where human-robot interaction breaks down, how to design around failure, and how to evaluate a real deployment with confidence. Culminates in a Robot Readiness Audit and your REP credential.
                </p>
              </div>

              {/* Specs */}
              <div className={styles.specsGrid} ref={specsRef}>
                <div className={styles.specItem}>
                  <span className={styles.specValue}>
                    <CountUp target={4} suffix=" Weeks" isActive={specsInView} />
                  </span>
                  <span className={styles.specLabel}>Duration</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specValue}>
                    <CountUp target={12} suffix=" Hours" isActive={specsInView} />
                  </span>
                  <span className={styles.specLabel}>Total learning</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specValue}>
                    <CountUp target={2} suffix=" Live" isActive={specsInView} />
                  </span>
                  <span className={styles.specLabel}>Group sessions</span>
                </div>
              </div>

              {/* Bottom */}
              <div className={styles.cardBottom}>
                <a href="/learn" className={styles.cta}>
                  Explore the Full Curriculum
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </div>

          {/* Stat cards */}
          <div className="col-lg-5">
            <motion.div
              className={styles.statList}
              variants={statContainerVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
            >
              {stats.map((stat) => (
                <motion.div key={stat.value} className={styles.statCard} variants={statVariants}>
                  <p className={styles.statValue}>{stat.value}</p>
                  <p className={styles.statLabel}>{stat.label}</p>
                  <p className={styles.statSource}>{stat.source}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>

        {/* ── Credential tracks ─────────────────────────────────────────────── */}
        <motion.div
          className={styles.tracksSection}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className={styles.tracksHeader}>
            <p className={styles.tracksLabel}>Credential Family</p>
            <a href="/notify" className={styles.teaseLink}>
              Join the list to be notified when new tracks open
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
          <div className={styles.tracksGrid}>
            {tracks.map((track) => (
              <Link key={track.abbr} href={`/learn/${track.slug}`} className={`${styles.trackCard} ${track.status === 'Live' ? styles.trackLive : styles.trackSoon}`}>
                <div className={styles.trackTop}>
                  <span className={styles.trackAbbr}>{track.abbr}</span>
                  <span className={`${styles.statusPill} ${track.status === 'Live' ? styles.statusLive : styles.statusSoon}`}>
                    {track.status}
                  </span>
                </div>
                <p className={styles.trackName}>{track.name}</p>
                <p className={styles.trackDescription}>{track.description}</p>
              </Link>
            ))}
          </div>
        </motion.div>


      </div>
    </section>
  )
}
