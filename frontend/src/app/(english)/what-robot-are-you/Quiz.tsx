'use client'

import { useState, useMemo, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { QUESTIONS, matchRobot, type Answers } from '@/lib/matching'
import { QUIZ_ROBOTS, type QuizRobot } from '@/lib/quizRobots'
import ResultView from './ResultView'
import styles from './what-robot-are-you.module.css'

export default function Quiz() {
  const [step, setStep] = useState(0) // 0..5 questions, 6 = result
  const [answers, setAnswers] = useState<Answers>({})
  const reduce = useReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)

  const total = QUESTIONS.length
  const isResult = step >= total
  const current = QUESTIONS[Math.min(step, total - 1)]

  const result = useMemo(() => (isResult ? matchRobot(answers) : null), [isResult, answers])

  const choose = (questionId: string, optionId: string) => {
    const next = { ...answers, [questionId]: optionId }
    setAnswers(next)
    // Advance after a short beat so the selection reads before the transition.
    window.setTimeout(() => {
      setStep((s) => s + 1)
      if (stageRef.current) {
        stageRef.current.scrollIntoView({
          behavior: reduce ? 'auto' : 'smooth',
          block: 'start',
        })
      }
    }, 180)
  }

  const back = () => setStep((s) => Math.max(0, s - 1))

  const retake = () => {
    setAnswers({})
    setStep(0)
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }

  if (isResult && result) {
    return (
      <>
        <ResultView
          robot={result.robot}
          reason={result.reason}
          traitWord={result.traitWord}
          onRetake={retake}
        />
        <AllRobots />
      </>
    )
  }

  const progress = ((step + 1) / total) * 100
  const transition = reduce ? { duration: 0 } : { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }

  return (
    <>
      <section className={styles.quizSection} ref={stageRef}>
        <div className="container-fluid">
          <div className={styles.quizStage}>
            {/* Progress */}
            <div className={styles.progressRow}>
              <div className={styles.progressBar} aria-hidden="true">
                <span className={styles.progressFill} style={{ width: `${progress}%` }} />
              </div>
              <p className={styles.progressLabel} aria-live="polite">
                Question {step + 1} of {total}
              </p>
            </div>

            {/* Question stage — fixed min-height to avoid layout shift */}
            <div className={styles.questionWrap}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 1 } : { opacity: 0, y: -12 }}
                  transition={transition}
                >
                  <h2 className={styles.question}>{current.prompt}</h2>
                  <div
                    className={styles.options}
                    role="radiogroup"
                    aria-label={current.prompt}
                  >
                    {current.options.map((opt) => {
                      const selected = answers[current.id] === opt.id
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          className={`${styles.option} ${selected ? styles.optionActive : ''}`}
                          onClick={() => choose(current.id, opt.id)}
                        >
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className={styles.quizControls}>
              {step > 0 ? (
                <button type="button" className={styles.backBtn} onClick={back}>
                  ← Back
                </button>
              ) : (
                <span />
              )}
              <Link href="#all-robots" className={styles.skipLink}>
                Just show me all 9 robots
              </Link>
            </div>
          </div>
        </div>
      </section>
      <AllRobots />
    </>
  )
}

/* ─── All-robots gallery (also the anchor for "See all 9 robots") ──────────── */
function AllRobots() {
  return (
    <section id="all-robots" className={styles.gallerySection}>
      <div className="container-fluid">
        <p className={styles.galleryEyebrow}>The lineup</p>
        <h2 className={styles.galleryTitle}>The nine robots</h2>
        <p className={styles.gallerySub}>
          Every match is a real robot with verified specs. Here is the full roster.
        </p>
        <div className={styles.galleryGrid}>
          {QUIZ_ROBOTS.map((r) => (
            <Link
              key={r.slug}
              href={`/what-robot-are-you/${r.slug}`}
              className={styles.galleryCard}
            >
              <span className={styles.galleryHead}>
                <GalleryThumb robot={r} />
                <span className={styles.galleryHeadText}>
                  <span className={styles.galleryArchetype}>{r.archetype}</span>
                  <span className={styles.galleryName}>{r.name}</span>
                  <span className={styles.galleryMaker}>{r.maker}</span>
                </span>
              </span>
              <span className={styles.galleryBlurb}>{r.blurb}</span>
              <span className={styles.galleryLink}>
                See card
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* Round robot thumbnail. Shows /robots/<slug>.jpg when present; until the real
 * photos are dropped in, falls back to a branded monogram so nothing looks broken. */
function GalleryThumb({ robot }: { robot: QuizRobot }) {
  const [failed, setFailed] = useState(false)
  const initials = robot.name
    .replace(/[^A-Za-z0-9 ]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <span className={styles.galleryThumb} aria-hidden="true">
      {failed ? (
        <span className={styles.galleryThumbFallback}>{initials}</span>
      ) : (
        <Image
          src={robot.photo}
          alt=""
          fill
          sizes="64px"
          className={styles.galleryThumbImg}
          onError={() => setFailed(true)}
        />
      )}
    </span>
  )
}
