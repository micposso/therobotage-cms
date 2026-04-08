'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './FeaturedArticle.module.css'

const articles = [
  {
    date: 'APR, 2026',
    headline: 'Designing for embodied AI: what UX practitioners need to unlearn',
    excerpt:
      'When a robot enters physical space, the rules of interface design change fundamentally. Proximity, gaze, and gesture replace clicks and taps — and most designers are unprepared for the shift.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
  },
  {
    date: 'MAR, 2026',
    headline: 'The Human Readiness Framework: a scoring rubric for real-world robot deployment',
    excerpt:
      'Before any robot enters a workplace, a school, or a public space, someone has to evaluate readiness — not just of the machine, but of the people and environment around it.',
    image: 'https://images.unsplash.com/photo-1561144257-e32e8506b5d7?w=800&q=80',
  },
  {
    date: 'FEB, 2026',
    headline: 'RLP Module 1.1 is live: foundations of robotic literacy for practitioners',
    excerpt:
      'The first module of the Robotic Literacy Practitioner program is now open. Covering perception systems, decision logic, and human-robot dynamics — built for non-engineers.',
    image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&q=80',
  },
]

const INTERVAL = 5000

const slideVariants = {
  enter: (dir) => ({ x: dir * 48, opacity: 0 }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
  exit: (dir) => ({
    x: dir * -48,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function FeaturedArticle({ parallaxY }) {
  const [index, setIndex]       = useState(0)
  const [direction, setDirection] = useState(1)
  const timerRef = useRef(null)

  const startTimer = () => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setDirection(1)
      setIndex((i) => (i + 1) % articles.length)
    }, INTERVAL)
  }

  useEffect(() => {
    startTimer()
    return () => clearInterval(timerRef.current)
  }, [])

  const goTo = (next) => {
    if (next === index) return
    setDirection(next > index ? 1 : -1)
    setIndex(next)
    startTimer()
  }

  const article = articles[index]

  return (
    <div className={styles.carousel}>

      {/* Slide area */}
      <div className={styles.track}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            className={`row g-4 ${styles.slide}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {/* Image */}
            <div className={`col-md-5 ${styles.imageCol}`}>
              <motion.div className={styles.imageWrap} style={{ y: parallaxY }}>
                <Image
                  src={article.image}
                  alt={article.headline}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </motion.div>
            </div>

            {/* Content */}
            <div className={`col-md-7 ${styles.contentCol}`}>
              <time className={styles.date}>{article.date}</time>

              <h2 className={styles.headline}>{article.headline}</h2>

              <button className={styles.cta}>
                Read article
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <p className={styles.excerpt}>{article.excerpt}</p>

              <div className={styles.divider} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Square nav */}
      <div className={styles.nav}>
        {articles.map((_, i) => (
          <button
            key={i}
            className={`${styles.navDot} ${i === index ? styles.navDotActive : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Article ${i + 1}`}
          />
        ))}
      </div>

    </div>
  )
}
