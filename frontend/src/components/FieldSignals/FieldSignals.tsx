'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import styles from './FieldSignals.module.css'

// Placeholder — replace with Strapi fetch when available
const SECTION = {
  eyebrow: 'Field Signals',
  title: 'Editorial perspectives.',
  indexUrl: '/research/field-signals',
}

const ESSAYS = [
  {
    slug: 'failure-transparency-gap',
    number: '01',
    title: 'The failure transparency gap: why robots stop without saying why.',
    category: 'Failure Mode Analysis',
    date: 'April 12, 2026',
    excerpt:
      'Across three logistics deployments, the same breakdown appeared: the robot halted, displayed no state information, and left operational staff to guess. Failure transparency is not an edge case — it is the norm.',
  },
  {
    slug: 'spatial-legibility-hospitality',
    number: '02',
    title: "Spatial legibility in hospitality: what the robot's path communicates before it arrives.",
    category: 'HRI Observation',
    date: 'March 29, 2026',
    excerpt:
      'Service robots in hotel corridors broadcast intent through trajectory. When that trajectory is ambiguous, guests stop, step aside incorrectly, or freeze. The failure is legibility, not technology.',
  },
  {
    slug: 'recovery-design-healthcare',
    number: '03',
    title: 'Recovery design in healthcare: what happens after the robot error.',
    category: 'Deployment Case',
    date: 'March 8, 2026',
    excerpt:
      'A hospital materials-delivery robot with high Signal Clarity and Spatial Legibility scores returned a composite RES of 52 — because its recovery design scored 21. A single dimension can invalidate a deployment.',
  },
  {
    slug: 'interaction-fit-manufacturing',
    number: '04',
    title: 'Interaction fit on the manufacturing floor: cobot adjacency and the unspoken rules.',
    category: 'Field Observation',
    date: 'February 18, 2026',
    excerpt:
      'Assembly workers develop informal proxemics around cobots within weeks of deployment. None of it is documented. None of it is designed. Interaction fit is the dimension most likely to be invented by workers rather than specified by deployers.',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
}

const itemVariants = {
  hidden:  { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
}

type ListItem = (typeof ESSAYS)[number] & {
  href?: string
  access?: string
  action?: { label: string; url: string }
  note?: string
}

type Props = {
  id?: string
  eyebrow?: string
  title?: string
  indexUrl?: string | null
  indexLabel?: string
  items?: ListItem[]
  description?: string
  emptyMessage?: string
  calendar?: boolean
}

export default function FieldSignals({
  id, eyebrow = SECTION.eyebrow, title = SECTION.title,
  indexUrl = SECTION.indexUrl, indexLabel = 'View full index',
  items = ESSAYS, description, emptyMessage = 'More to come.', calendar = false,
}: Props = {}) {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })
  const reducedMotion = useReducedMotion()

  return (
    <section id={id} ref={sectionRef} className={`${styles.section}${calendar ? ` ${styles.calendar}` : ''}`} aria-label={title}>
      <div className="container-fluid">

        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>{eyebrow}</p>
            <h2 className={styles.title}>{title}</h2>
          </div>
          {indexUrl && <Link href={indexUrl} className={styles.indexCta}>
            {indexLabel}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>}
        </div>
        {description && <p className={styles.description}>{description}</p>}

        {items.length ? <motion.ol
          className={styles.list}
          variants={containerVariants}
          initial={reducedMotion || calendar ? false : 'hidden'}
          animate={reducedMotion || calendar || inView ? 'visible' : 'hidden'}
          aria-label={calendar ? `${title} ${eyebrow} events` : 'Field Signals essays'}
        >
          {items.map((essay) => {
            const content = <>
                <span className={styles.itemNumber} aria-hidden={!calendar}>{essay.number}</span>
                <div className={styles.itemBody}>
                  <div className={styles.itemMeta}>
                    <span className={styles.itemCategory}>{essay.category}</span>
                    <span className={styles.itemDate}>{essay.date}</span>
                  </div>
                  <h3 className={styles.itemTitle}>{essay.action ? <Link href={essay.href!}>{essay.title}</Link> : essay.title}</h3>
                  {essay.access && <p className={styles.access}>{essay.access}</p>}
                  <p className={styles.itemExcerpt}>{essay.excerpt}</p>
                  {essay.action && <a className={styles.indexCta} href={essay.action.url} aria-label={`${essay.action.label}: ${essay.title}`}>{essay.action.label} <span aria-hidden="true">↗</span></a>}
                  {essay.note && <p className={styles.note}>{essay.note}</p>}
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className={styles.itemArrow}
                >
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            return <motion.li id={calendar ? essay.slug : undefined} key={essay.slug} variants={reducedMotion || calendar ? undefined : itemVariants} className={styles.item}>
              {essay.action ? <div className={styles.itemLink}>{content}</div> : <Link href={essay.href ?? `/research/field-signals/${essay.slug}`} className={styles.itemLink}>{content}</Link>}
            </motion.li>
          })}
        </motion.ol> : <p className={styles.itemExcerpt}>{emptyMessage}</p>}

      </div>
    </section>
  )
}
