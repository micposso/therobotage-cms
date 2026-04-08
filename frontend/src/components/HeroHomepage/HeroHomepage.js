'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './HeroHomepage.module.css'

// ─── Content ──────────────────────────────────────────────────────────────────

const LOCKUP_LINES = ['THE', 'ROBOT', 'AGE']

const NAV_LINKS = [
  { label: 'Research', href: '/research', desc: 'Peer-reviewed robotics insights and industry reports.' },
  { label: 'Learn',    href: '/learn',    desc: 'Courses and curricula built for non-engineers.' },
  { label: 'Access',   href: '/access',   desc: 'Tools, datasets, and hands-on sandboxes.' },
  { label: 'Connect',  href: '/connect',  desc: 'A community of robotics-curious professionals.' },
  { label: 'Summit',   href: '/summit',   desc: 'Annual gathering of robotics leaders and practitioners.' },
]

const eyebrowText = 'For design, product, and marketing professionals.'

const headline = 'Robotics for All. Not just engineers.'

const subtext =
  'Robotic literacy isn\u2019t about code. It\u2019s about knowing enough to ask the right questions, make better decisions, and design for a world where robots are already here.'

const tagline = 'Robotic literacy isn\u2019t about code. It\u2019s about knowing enough to ask the right questions, make better decisions, and design for a world where robots are already here.'

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80',
  'https://images.unsplash.com/photo-1561144257-e32e8506b5d7?w=600&q=80',
  'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=600&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
]

const TICKER_ITEMS = [
  'Industrial', 'Surgical', 'Collaborative',
  'Autonomous', 'Social', 'Exoskeletal',
  'Agricultural', 'Service',
]

const tickerTrack = [...TICKER_ITEMS, ...TICKER_ITEMS]

// ─── Framer variants ──────────────────────────────────────────────────────────

const lockupVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const lineVariants = {
  hidden:  { y: 60, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
}

const imageVariants = {
  enter:  { x: '100%', opacity: 0 },
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    x: '-30%',
    opacity: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
}

// ─── Image carousel ───────────────────────────────────────────────────────────

function HeroImageCarousel() {
  const [index, setIndex] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % HERO_IMAGES.length)
    }, 3500)
    return () => clearInterval(timerRef.current)
  }, [])

  return (
    <div className={styles.imageCarousel}>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={index}
          className={styles.imageSlide}
          variants={imageVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          <Image
            src={HERO_IMAGES[index]}
            alt=""
            fill
            sizes="25vw"
            style={{ objectFit: 'cover' }}
            priority={index === 0}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ─── Nav item with hover panel ────────────────────────────────────────────────

function HeroNavItem({ label, href, desc }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={styles.heroNavItem}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link href={href} className={styles.heroNavLink}>{label}</Link>
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.heroNavPanel}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className={styles.heroNavDesc}>{desc}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HeroHomepage() {
  return (
    <section className={styles.hero}>
      <div className="container-fluid">
        <div className="row g-0">

          {/* ── Left col — brand + ticker ─────────────────────────────────── */}
          <div className={`col-lg-5 ${styles.leftCol}`}>
            <div className={styles.leftWrap}>

              <motion.div
                className={styles.lockup}
                variants={lockupVariants}
                initial="hidden"
                animate="visible"
              >
                {LOCKUP_LINES.map((line) => (
                  <motion.span
                    key={line}
                    className={styles.lockupLine}
                    variants={lineVariants}
                  >
                    {line === 'ROBOT'
                      ? <span className={styles.robotPulse}>{line}</span>
                      : line}
                  </motion.span>
                ))}
              </motion.div>

              {/* Nav links — stacked vertically */}
              <motion.nav
                className={styles.heroNav}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {NAV_LINKS.map(({ label, href, desc }) => (
                  <HeroNavItem key={label} label={label} href={href} desc={desc} />
                ))}
              </motion.nav>

            </div>
          </div>

          {/* ── Right col ─────────────────────────────────────────────────── */}
          <div className={`col-lg-7 ${styles.rightCol}`}>

            {/* Two-column: headline left, image right */}
            <div className={styles.headlineRow}>

              {/* Left — eyebrow + headline */}
              <div className={styles.headlineCol}>
                <motion.p
                  className={styles.eyebrow}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {eyebrowText}
                </motion.p>
                <h1 className={styles.headline}>{headline}</h1>
              </div>

              {/* Right — rounded image carousel */}
              <motion.div
                className={styles.imageCol}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              >
                <HeroImageCarousel />
              </motion.div>

            </div>

            {/* Subtext */}
            <motion.p
              className={styles.subtext}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 1.1 }}
            >
              {subtext}
            </motion.p>

            {/* Tagline + CTAs */}
            <motion.div
              className={styles.ctaBlock}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
            >
              <div className={styles.ctaRow}>
                <Link href="/learn" className={styles.ctaPrimary}>
                  What is Robotic Literacy?
                  <span className={styles.arrow} aria-hidden="true">→</span>
                </Link>
                <Link href="/research" className={styles.ctaGhost}>
                  Explore the Research
                </Link>
              </div>
            </motion.div>

          </div>

        </div>

        {/* ── Ticker — full-width bottom ────────────────────────────────── */}
        <motion.div
          className={styles.ticker}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          aria-hidden="true"
        >
          <div className={styles.tickerTrack}>
            {tickerTrack.map((item, i) => (
              <span key={i} className={styles.tickerItem}>
                {item}
                <span className={styles.tickerSep}>·</span>
              </span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
