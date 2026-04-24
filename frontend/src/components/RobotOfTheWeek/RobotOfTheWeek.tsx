'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import styles from './RobotOfTheWeek.module.css'

// Placeholder — replace with Strapi fetch when available
const SECTION = {
  eyebrow: 'Robot of the Week',
  title: 'Field observations.',
  archiveUrl: '/research/robots',
}

const ROBOTS = [
  {
    slug: 'boston-dynamics-spot-oil-gas',
    name: 'Boston Dynamics Spot',
    context: 'Industrial inspection — oil & gas platform',
    week: '2026 W15',
    image: '/images/robots/rotw-august29.jpg',
    resProfile: [72, 68, 55, 44, 61],
    composite: 60.0,
  },
  {
    slug: 'locus-robotics-origin',
    name: 'Locus Robotics Origin',
    context: 'Order fulfillment — e-commerce distribution',
    week: '2026 W14',
    resProfile: [88, 91, 64, 77, 70],
    composite: 78.0,
  },
  {
    slug: 'bear-medical-robot',
    name: 'Ethicon BEAR Robot',
    context: 'Patient transport — acute care hospital',
    week: '2026 W13',
    resProfile: [61, 58, 83, 52, 74],
    composite: 65.6,
  },
  {
    slug: 'aethon-tugs',
    name: 'Aethon TUGs',
    context: 'Materials delivery — suburban hospital campus',
    week: '2026 W12',
    resProfile: [74, 80, 71, 66, 55],
    composite: 69.2,
  },
  {
    slug: 'ottonomy-sidewalk',
    name: 'Ottonomy.io Ottie',
    context: 'Last-mile delivery — dense urban environment',
    week: '2026 W11',
    resProfile: [52, 45, 38, 60, 42],
    composite: 47.4,
  },
  {
    slug: 'richtech-adam-coffee',
    name: 'Richtech ADAM',
    context: 'Beverage service — high-traffic hospitality venue',
    week: '2026 W10',
    resProfile: [81, 76, 60, 89, 72],
    composite: 75.6,
  },
]

const DIMENSIONS = ['SC', 'SL', 'FT', 'IF', 'RD']

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const cardVariants = {
  hidden:  { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
}

export default function RobotOfTheWeek() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className="container-fluid">

        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>{SECTION.eyebrow}</p>
            <h2 className={styles.title}>{SECTION.title}</h2>
          </div>
          <Link href={SECTION.archiveUrl} className={styles.archiveCta}>
            View full archive
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <motion.div
          className="row g-0"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {ROBOTS.map((robot) => (
            <motion.div
              key={robot.slug}
              className="col-lg-4 col-md-6"
              variants={cardVariants}
            >
              <Link href={`/research/robots/${robot.slug}`} className={styles.card}>
                {robot.image && (
                  <div className={styles.cardImage}>
                    <Image
                      src={robot.image}
                      alt={robot.name}
                      fill
                      sizes="(max-width: 767px) 100vw, (max-width: 991px) 50vw, 33vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}
                <div className={styles.cardMeta}>
                  <span className={styles.cardWeek}>{robot.week}</span>
                </div>
                <h3 className={styles.cardName}>{robot.name}</h3>
                <p className={styles.cardContext}>{robot.context}</p>
                <MiniProfile scores={robot.resProfile} composite={robot.composite} />
              </Link>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}

// ─── Mini RES profile ──────────────────────────────────────────────────────

function MiniProfile({ scores, composite }: { scores: number[]; composite: number }) {
  return (
    <div className={styles.miniProfile} aria-label="RES dimensional profile">
      <div className={styles.miniDims}>
        {scores.map((score, i) => (
          <div key={i} className={styles.miniDim}>
            <div className={styles.miniTrack}>
              <div
                className={styles.miniFill}
                style={{ height: `${score}%` }}
                title={`${DIMENSIONS[i]}: ${score}`}
              />
            </div>
            <span className={styles.miniLabel}>{DIMENSIONS[i]}</span>
          </div>
        ))}
      </div>
      <span className={styles.miniComposite}>
        {composite.toFixed(1)}
      </span>
    </div>
  )
}
