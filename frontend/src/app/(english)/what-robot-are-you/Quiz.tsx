'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from '@/components/MediaImage'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { QUESTIONS, matchRobot, type Answers } from '@/lib/matching'
import { QUIZ_ROBOTS, type QuizRobot } from '@/lib/quizRobots'
import ResultView from './ResultView'
import styles from './what-robot-are-you.module.css'

export default function Quiz() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const reduce = useReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)
  const questionRef = useRef<HTMLHeadingElement>(null)
  const focusQuestion = useRef(false)

  const total = QUESTIONS.length
  const isResult = step >= total
  const current = QUESTIONS[Math.min(step, total - 1)]

  const result = useMemo(() => (isResult ? matchRobot(answers) : null), [isResult, answers])

  const choose = (questionId: string, optionId: string) => {
    setAnswers((previous) => ({ ...previous, [questionId]: optionId }))
  }

  const goTo = (next: number) => {
    focusQuestion.current = true
    setStep(next)
  }

  useEffect(() => {
    if (!focusQuestion.current || isResult) return
    questionRef.current?.focus({ preventScroll: true })
    stageRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    focusQuestion.current = false
  }, [step, isResult, reduce])

  const retake = () => {
    setAnswers({})
    goTo(0)
  }

  if (isResult && result) {
    return (
      <>
        <ResultView
          key={result.robot.slug}
          robot={result.robot}
          reason={result.reason}
          traitWord={result.traitWord}
          highlights={result.highlights}
          onRetake={retake}
        />
        <AllRobots />
      </>
    )
  }

  const progress = (step / total) * 100
  const transition = reduce ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] as const }

  return (
    <>
      <header className={styles.intro}>
        <div className={styles.introInner}>
          <div>
            <span className={styles.introEyebrow}>A little human. A little robot.</span>
            <h1 className={styles.introTitle}>What robot are you?</h1>
            <p className={styles.introCopy}>Find your robot counterpart. Discover what it does in the real world.</p>
            <span className={styles.introMeta}>6 questions · 9 real robots · About 2 minutes · No login</span>
          </div>
          <Image src="/images/human.png" alt="" width={192} height={192}
            sizes="192px" loading="eager" className={styles.introImage} />
        </div>
      </header>
      <section className={styles.quizSection} ref={stageRef} aria-label="Find your robot match">
        <div className="container-fluid">
          <div className={styles.quizStage}>
            {/* Progress */}
            <div className={styles.progressRow}>
              <div className={styles.progressBar} role="progressbar" aria-label="Quiz progress"
                aria-valuemin={0} aria-valuemax={total} aria-valuenow={step}
                aria-valuetext={`${step} of ${total} questions completed`}>
                <span className={styles.progressFill} style={{ width: `${progress}%` }} />
              </div>
              <span className={styles.progressLabel} aria-live="polite">Question {step + 1} of {total}</span>
            </div>

            {/* Question stage — fixed min-height to avoid layout shift */}
            <form onSubmit={(event) => {
              event.preventDefault()
              if (answers[current.id]) goTo(step + 1)
            }}>
            <div className={styles.questionWrap}>
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={current.id}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, pointerEvents: 'none' }}
                  transition={transition}
                >
                  <h2 ref={questionRef} id={`question-${current.id}`} tabIndex={-1}
                    className={styles.question}>{current.prompt}</h2>
                  <span className={styles.questionHint}>Pick the one that feels most like you.</span>
                  <fieldset
                    className={styles.options}
                    aria-labelledby={`question-${current.id}`}
                  >
                    {current.options.map((opt, index) => {
                      const selected = answers[current.id] === opt.id
                      return (
                        <label
                          key={opt.id}
                          className={`${styles.option} ${selected ? styles.optionActive : ''}`}
                        >
                          <input type="radio" name={current.id} value={opt.id}
                            checked={selected} onChange={() => choose(current.id, opt.id)} />
                          <span className={styles.optionLetter} aria-hidden="true">{String.fromCharCode(65 + index)}</span>
                          <span>{opt.label}</span>
                          <span className={styles.optionCheck} aria-hidden="true">{selected ? '✓' : ''}</span>
                        </label>
                      )
                    })}
                  </fieldset>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className={styles.quizControls}>
              {step > 0 ? (
                <button type="button" className={styles.backBtn} onClick={() => goTo(step - 1)}>
                  ← Back
                </button>
              ) : (
                <span />
              )}
              <button type="submit" className={styles.nextBtn} disabled={!answers[current.id]}>
                {step === total - 1 ? 'Meet my robot' : 'Next question'} <span aria-hidden="true">→</span>
              </button>
            </div>
            </form>
            <div className={styles.quizFootnote}>
              <span>A personality match, just for fun.</span>
              <Link href="#all-robots" className={styles.skipLink}>Meet all {QUIZ_ROBOTS.length} robots ↓</Link>
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
          Different shapes. Different jobs. Explore the illustrated lineup, then meet the real robots.
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
              <span className={styles.galleryCategory}>{r.learning.category}</span>
              <span className={styles.galleryBlurb}>{r.learning.use}</span>
              <span className={styles.galleryLink}>
                Meet the robot
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
        <div className={styles.learningCta}>
          <div><h3>Curious about the world behind the quiz?</h3>
          <p>Learn to spot the difference between a robot demo, a real deployment, and a promise.</p></div>
          <Link href="/robot-literacy" className={styles.textBtn}>Explore Robot Literacy →</Link>
        </div>
      </div>
    </section>
  )
}

/* Existing photos resolve to verified R2 assets through MediaImage. */
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
          sizes="(max-width: 599px) 85vw, (max-width: 991px) 40vw, 28vw"
          className={styles.galleryThumbImg}
          onError={() => setFailed(true)}
        />
      )}
    </span>
  )
}
