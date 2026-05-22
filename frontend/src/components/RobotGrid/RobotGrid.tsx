'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import styles from './RobotGrid.module.css'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RobotCardData {
  slug: string
  title: string
  manufacturer: string
  thumbnailImage: string
  excerpt: string
  score: { compositeScore: number; tier: string } | null
}

interface Props {
  robots: RobotCardData[]
}

// ─── Animation ────────────────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const cardVariants = {
  hidden:  { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RobotGrid({ robots }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  if (robots.length === 0) {
    return <p className={styles.empty}>The first scored robot profile is coming soon.</p>
  }

  return (
    <motion.div
      ref={ref}
      className={styles.grid}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      {robots.map((robot) => (
        <motion.div key={robot.slug} variants={cardVariants}>
          <Link href={`/robots/${robot.slug}`} className={styles.card}>
            {robot.thumbnailImage && (
              <div className={styles.image}>
                <Image
                  src={robot.thumbnailImage}
                  alt={robot.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            )}
            <div className={styles.body}>
              <h2 className={styles.title}>{robot.title}</h2>
              {robot.manufacturer && (
                <p className={styles.manufacturer}>{robot.manufacturer}</p>
              )}
              {robot.score ? (
                <div className={styles.scoreRow}>
                  <span className={styles.scoreValue}>
                    {robot.score.compositeScore.toFixed(1)}
                    <span className={styles.scoreMax}>&thinsp;/&thinsp;5</span>
                  </span>
                  <span className={styles.scoreTier}>{robot.score.tier}</span>
                </div>
              ) : (
                <div className={styles.scoreRow}>
                  <span className={styles.scoreUnscored}>Score pending</span>
                </div>
              )}
              <p className={styles.excerpt}>{robot.excerpt}</p>
              <span className={styles.cta}>View RXD profile →</span>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
