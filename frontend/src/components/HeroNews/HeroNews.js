'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import FeaturedArticle from '@/components/FeaturedArticle/FeaturedArticle'
import styles from './HeroNews.module.css'

const LOCKUP_LINES = ['THE', 'ROBOT', 'AGE']


const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const lineVariants = {
  hidden:  { y: 60, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function HeroNews() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const parallaxY = useTransform(scrollYProgress, [0, 1], [-30, 30])

  return (
    <section className={styles.hero} ref={sectionRef}>
      <div className="container-fluid">
        <div className="row g-0">

          {/* Left — Display lockup */}
          <div className={`col-lg-5 ${styles.leftCol}`}>
            <div className={styles.lockupWrap}>
              <motion.div
                className={styles.lockup}
                variants={containerVariants}
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
              <p className={styles.subtitle}>robotics literacy for all</p>
            </div>
          </div>

          {/* Right — Featured article */}
          <div className={`col-lg-7 ${styles.rightCol}`}>
            <FeaturedArticle parallaxY={parallaxY} />
          </div>

        </div>
      </div>
    </section>
  )
}
