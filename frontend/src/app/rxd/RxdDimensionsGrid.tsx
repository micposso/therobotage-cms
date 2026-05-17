'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import styles from './RxdDimensionsGrid.module.css'

interface Dimension {
  number: string
  title: string
  description: string
  body: string
  image: string
}

const DIMENSIONS: Dimension[] = [
  {
    number: '01',
    title: 'Signal Clarity',
    description: 'Can the user understand what the robot is communicating?',
    body: "Robots communicate intent, state, and action through sound, light, movement, and display. When signals are ambiguous or absent, users default to guessing — and guessing wrong leads to unsafe or unproductive interactions. Signal clarity evaluates how legible a robot's communication channels are to the people sharing its space.",
    image: '/images/signal-icon.png',
  },
  {
    number: '02',
    title: 'Spatial Legibility',
    description: 'Can the user predict where the robot will move?',
    body: 'A robot that moves without telegraphing its trajectory creates avoidance behaviors, physical collisions, and eroded trust. Spatial legibility measures whether the people around a robot can predict where it will go next without special training. It is one of the most reliable early indicators of whether a deployment will require ongoing human supervision.',
    image: '/images/legibility-icon.png',
  },
  {
    number: '03',
    title: 'Perceived Presence',
    description: "Does the robot's voice, form, and aesthetic produce a coherent identity?",
    body: "The coherence of a robot's identity — across its voice, form, movement, and aesthetic — determines whether users experience it as a legible entity or an unpredictable object. Mismatches between channels produce uncanny responses that undermine sustained engagement. Perceived presence evaluates whether a robot produces a stable, coherent identity in the minds of its users.",
    image: '/images/heart.png',
  },
  {
    number: '04',
    title: 'Failure Transparency',
    description: 'When something goes wrong, does the robot make the problem legible?',
    body: "When something goes wrong, the question is not whether the robot can recover — it is whether the people around it understand what happened and what to do next. Opaque failure modes are the primary driver of support escalations and trust collapse in deployed systems. Failure transparency evaluates how clearly a robot communicates problems, their cause, and the path forward.",
    image: '/images/failure-icon.png',
  },
  {
    number: '05',
    title: 'Interaction Fit',
    description: "Does the interaction model match the context and the user's expectations?",
    body: "A robot designed for one environment or user population will often fail when deployed into a different one — not because it malfunctions, but because the interaction model doesn't match. Interaction fit evaluates the alignment between how a robot expects to be used and how its actual users, in their actual context, expect to use it.",
    image: '/images/hand.png',
  },
  {
    number: '06',
    title: 'Recovery Design',
    description: 'Can the user (or the robot) get back on track after a breakdown?',
    body: "Recovery is where most deployed systems reveal their weakest design. After a breakdown, confusion, or error, there must be a clear path back to normal operation — for both the user and the robot. Recovery design evaluates the quality of those pathways: how many steps they require, how much they rely on technical knowledge, and whether they return the interaction to a state both parties can work from.",
    image: '/images/recovery-icon.png',
  },
]

export default function RxdDimensionsGrid() {
  const [active, setActive] = useState<Dimension | null>(null)

  const close = useCallback(() => setActive(null), [])

  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [active, close])

  return (
    <>
      <div className={styles.dimensionsGrid}>
        {DIMENSIONS.map((dim) => (
          <button
            key={dim.number}
            className={styles.dimensionCard}
            onClick={() => setActive(dim)}
            aria-label={`Learn more about ${dim.title}`}
          >
            <div className={styles.dimensionCardText}>
              <span className={styles.dimensionNumber}>{dim.number}</span>
              <h2 className={styles.dimensionTitle}>{dim.title}</h2>
              <p className={styles.dimensionDescription}>{dim.description}</p>
            </div>
            <div className={styles.dimensionCardImageWrap}>
              <Image
                src={dim.image}
                alt={dim.title}
                fill
                className={styles.dimensionCardImage}
                sizes="160px"
              />
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div
          className={styles.overlay}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={close} aria-label="Close">
              &#215;
            </button>
            <div className={styles.modalImageWrap}>
              <Image
                src={active.image}
                alt={active.title}
                fill
                className={styles.modalImage}
                sizes="(max-width: 640px) 100vw, 640px"
              />
            </div>
            <div className={styles.modalContent}>
              <span className={styles.modalNumber}>{active.number}</span>
              <h3 className={styles.modalTitle}>{active.title}</h3>
              <p className={styles.modalBody}>{active.body}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
