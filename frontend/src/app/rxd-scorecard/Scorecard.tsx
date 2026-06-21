'use client'

import { useState, useRef, useEffect, useCallback, useActionState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { sendWhitepaperEmail } from '@/app/actions/sendWhitepaperEmail'
import styles from './rxd-scorecard.module.css'

/* ─── Framework data ──────────────────────────────────────────────────────── */
interface Dimension {
  key: string
  number: string
  title: string
  /** Plain-English, always-visible definition — the dimension's core question. */
  definition: string
  /** Dimension illustration — shared with the /rxd dimensions grid. */
  image: string
}

const DIMENSIONS: Dimension[] = [
  { key: 'signal', number: '01', title: 'Signal Clarity', definition: 'Can the user understand what the robot is communicating?', image: '/images/signal-icon.png' },
  { key: 'spatial', number: '02', title: 'Spatial Legibility', definition: 'Can the user predict where the robot will move?', image: '/images/legibility-icon.png' },
  { key: 'presence', number: '03', title: 'Perceived Presence', definition: 'Does the robot present a coherent identity across voice, form, and behavior?', image: '/images/heart.png' },
  { key: 'failure', number: '04', title: 'Failure Transparency', definition: 'When something goes wrong, does the robot make the problem legible?', image: '/images/failure-icon.png' },
  { key: 'fit', number: '05', title: 'Interaction Fit', definition: "Does the interaction model match the context and the user's expectations?", image: '/images/hand.png' },
  { key: 'recovery', number: '06', title: 'Recovery Design', definition: 'Can the user (or the robot) get back on track after a breakdown?', image: '/images/recovery-icon.png' },
]

/** Verdict bands keyed to the average. Mirrors the tier vocabulary used in robot profiles. */
function verdictFor(avg: number): { tier: string; line: string } {
  if (avg < 2) return { tier: 'Not Ready', line: 'The experience breaks down before it begins.' }
  if (avg < 3) return { tier: 'Developing', line: 'Promising in places, unreliable in practice.' }
  if (avg < 3.5) return { tier: 'Functional', line: 'It works — with real gaps left to close.' }
  if (avg < 4.5) return { tier: 'Strong', line: 'A confident, readable experience.' }
  return { tier: 'Exemplary', line: 'A benchmark other robots should study.' }
}

const initialEmailState = { success: false, error: undefined as string | undefined }

/* ─── Score selector (accessible radiogroup) ──────────────────────────────── */
function ScoreSelector({
  dimKey,
  dimTitle,
  value,
  onChange,
}: {
  dimKey: string
  dimTitle: string
  value: number | null
  onChange: (n: number) => void
}) {
  const onKeyDown = (e: React.KeyboardEvent) => {
    const keys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Home', 'End']
    if (!keys.includes(e.key)) return
    e.preventDefault()
    const cur = value ?? 0
    let next = cur
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = cur === 0 ? 1 : Math.min(5, cur + 1)
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = cur === 0 ? 1 : Math.max(1, cur - 1)
    if (e.key === 'Home') next = 1
    if (e.key === 'End') next = 5
    onChange(next)
    requestAnimationFrame(() => document.getElementById(`${dimKey}-score-${next}`)?.focus())
  }

  return (
    <div
      role="radiogroup"
      aria-label={`Score for ${dimTitle}, 1 to 5`}
      className={styles.scoreGroup}
      onKeyDown={onKeyDown}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const selected = value === n
        return (
          <button
            key={n}
            id={`${dimKey}-score-${n}`}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${n} out of 5`}
            tabIndex={selected || (value == null && n === 1) ? 0 : -1}
            className={`${styles.scoreBtn} ${selected ? styles.scoreBtnActive : ''}`}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        )
      })}
    </div>
  )
}

/* ─── Card renderer (canvas) ──────────────────────────────────────────────── */
interface CardData {
  robotName: string
  context: string
  dims: { title: string; score: number; note: string }[]
  avg: number
  total: number
  tier: string
  verdictLine: string
  date: string
}

const CARD_W = 1080
const PAD = 80

function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

/**
 * Draws the audit card onto `canvas`. Runs once to measure (paint=false) to size
 * the canvas to its content, then again to paint. The canvas IS the exported
 * artifact, so what the user sees is exactly what downloads or copies.
 */
function renderCard(canvas: HTMLCanvasElement, data: CardData) {
  const scale = 2
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const display = cssVar('--font-display') || 'sans-serif'
  const body = cssVar('--font-body') || 'serif'
  const C = {
    bg: cssVar('--color-bg-dark') || '#0D0D0D',
    ink: cssVar('--color-text-on-sand') || '#F5F0E8',
    inkBody: cssVar('--color-text-inverse') || '#E8E4DC',
    accent: cssVar('--res-orange') || '#e85d24',
    line: cssVar('--color-border-light') || 'rgba(245,240,232,0.2)',
    bars: [
      cssVar('--res-bar-1') || '#b8b4ae',
      cssVar('--res-bar-2') || '#cac6be',
      cssVar('--res-bar-3') || '#928f89',
      cssVar('--res-bar-4') || '#c8652e',
      cssVar('--res-bar-5') || '#e85d24',
    ],
  }

  const setFont = (weight: number, size: number, fam: 'd' | 'b') =>
    (ctx.font = `${weight} ${size}px ${fam === 'd' ? display : body}`)

  const wrap = (text: string, maxW: number, max = 99): string[] => {
    const words = (text || '').split(/\s+/).filter(Boolean)
    const lines: string[] = []
    let cur = ''
    for (const w of words) {
      const test = cur ? `${cur} ${w}` : w
      if (ctx.measureText(test).width > maxW && cur) {
        lines.push(cur)
        cur = w
        if (lines.length === max) break
      } else {
        cur = test
      }
    }
    if (cur && lines.length < max) lines.push(cur)
    if (lines.length === max && words.length) {
      // ellipsize the final line if content was truncated
      const joined = lines.join(' ')
      if (joined.split(/\s+/).length < words.length) {
        let last = lines[max - 1]
        while (ctx.measureText(`${last}…`).width > maxW && last.length) last = last.slice(0, -1)
        lines[max - 1] = `${last}…`
      }
    }
    return lines.length ? lines : ['']
  }

  const innerW = CARD_W - PAD * 2

  // Single pass that either measures (advancing y) or paints. Returns content bottom.
  const pass = (paint: boolean): number => {
    let y = PAD

    const letter = (v: string) => {
      try {
        ;(ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = v
      } catch {
        /* unsupported — ignore */
      }
    }

    // Eyebrow (spelled-out framework name) + date. Auto-fit the eyebrow so it
    // never collides with the right-aligned date.
    const eyebrowText = 'RXD — THE ROBOT EXPERIENCE FRAMEWORK SCORE'
    const dateText = data.date.toUpperCase()
    setFont(400, 24, 'b')
    letter('0.12em')
    const dateW = ctx.measureText(dateText).width
    let ebSize = 22
    letter('0.16em')
    setFont(400, ebSize, 'b')
    while (ctx.measureText(eyebrowText).width > innerW - dateW - 48 && ebSize > 12) {
      ebSize -= 1
      setFont(400, ebSize, 'b')
    }
    if (paint) {
      letter('0.16em')
      setFont(400, ebSize, 'b')
      ctx.fillStyle = C.accent
      ctx.textAlign = 'left'
      ctx.fillText(eyebrowText, PAD, y + 22)
      setFont(400, 24, 'b')
      ctx.fillStyle = C.inkBody
      ctx.globalAlpha = 0.55
      ctx.textAlign = 'right'
      letter('0.12em')
      ctx.fillText(dateText, CARD_W - PAD, y + 22)
      ctx.globalAlpha = 1
      ctx.textAlign = 'left'
    }
    letter('0px')
    y += 56

    // Robot name
    setFont(500, 60, 'd')
    const nameLines = wrap(data.robotName || 'Untitled robot', innerW, 2)
    letter('-0.02em')
    for (const ln of nameLines) {
      y += 64
      if (paint) {
        ctx.fillStyle = C.ink
        ctx.fillText(ln, PAD, y)
      }
    }
    letter('0px')

    // Context
    if (data.context.trim()) {
      setFont(300, 27, 'b')
      const ctxLines = wrap(data.context, innerW, 2)
      y += 14
      for (const ln of ctxLines) {
        y += 38
        if (paint) {
          ctx.fillStyle = C.inkBody
          ctx.globalAlpha = 0.7
          ctx.fillText(ln, PAD, y)
          ctx.globalAlpha = 1
        }
      }
    }

    // Divider
    y += 48
    if (paint) {
      ctx.strokeStyle = C.line
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(PAD, y)
      ctx.lineTo(CARD_W - PAD, y)
      ctx.stroke()
    }
    y += 56

    // Verdict
    setFont(400, 22, 'b')
    if (paint) {
      letter('0.2em')
      ctx.fillStyle = C.accent
      ctx.fillText(data.tier.toUpperCase(), PAD, y)
      letter('0px')
    }
    y += 18
    setFont(400, 40, 'd')
    const vLines = wrap(data.verdictLine, innerW, 2)
    letter('-0.01em')
    for (const ln of vLines) {
      y += 46
      if (paint) {
        ctx.fillStyle = C.ink
        ctx.fillText(ln, PAD, y)
      }
    }
    letter('0px')

    // Composite numbers. The average is set at 130px, whose ascent reaches well
    // above its baseline — reserve enough room so it never overlaps the verdict.
    y += 150
    if (paint) {
      // average
      setFont(400, 130, 'd')
      ctx.fillStyle = C.accent
      ctx.textBaseline = 'alphabetic'
      ctx.fillText(data.avg.toFixed(1), PAD, y)
      const avgW = ctx.measureText(data.avg.toFixed(1)).width
      setFont(400, 40, 'd')
      ctx.fillStyle = C.inkBody
      ctx.fillText('/ 5', PAD + avgW + 16, y)
      // total (right aligned)
      ctx.textAlign = 'right'
      setFont(400, 22, 'b')
      letter('0.15em')
      ctx.globalAlpha = 0.55
      ctx.fillText('TOTAL', CARD_W - PAD, y - 70)
      ctx.globalAlpha = 1
      letter('0px')
      setFont(400, 56, 'd')
      ctx.fillStyle = C.ink
      ctx.fillText(`${data.total} / 30`, CARD_W - PAD, y)
      ctx.textAlign = 'left'
    }
    y += 24

    // Divider
    y += 40
    if (paint) {
      ctx.strokeStyle = C.line
      ctx.beginPath()
      ctx.moveTo(PAD, y)
      ctx.lineTo(CARD_W - PAD, y)
      ctx.stroke()
    }
    y += 52

    // Dimension rows
    data.dims.forEach((d, i) => {
      // title + score
      setFont(400, 30, 'd')
      if (paint) {
        ctx.fillStyle = C.ink
        ctx.fillText(d.title, PAD, y)
        ctx.textAlign = 'right'
        setFont(400, 34, 'd')
        ctx.fillStyle = C.bars[d.score - 1]
        ctx.fillText(`${d.score}`, CARD_W - PAD - 44, y)
        setFont(300, 22, 'b')
        ctx.fillStyle = C.inkBody
        ctx.globalAlpha = 0.5
        ctx.fillText('/5', CARD_W - PAD, y)
        ctx.globalAlpha = 1
        ctx.textAlign = 'left'
      }
      y += 22
      // bar
      const barH = 10
      if (paint) {
        ctx.fillStyle = C.line
        ctx.fillRect(PAD, y, innerW, barH)
        ctx.fillStyle = C.bars[d.score - 1]
        ctx.fillRect(PAD, y, (innerW * d.score) / 5, barH)
      }
      y += barH + 6
      // note
      if (d.note.trim()) {
        setFont(300, 23, 'b')
        const noteLines = wrap(d.note, innerW, 3)
        for (const ln of noteLines) {
          y += 33
          if (paint) {
            ctx.fillStyle = C.inkBody
            ctx.globalAlpha = 0.72
            ctx.fillText(ln, PAD, y)
            ctx.globalAlpha = 1
          }
        }
      }
      y += i === data.dims.length - 1 ? 0 : 34
    })

    // Footer divider + brand
    y += 48
    if (paint) {
      ctx.strokeStyle = C.line
      ctx.beginPath()
      ctx.moveTo(PAD, y)
      ctx.lineTo(CARD_W - PAD, y)
      ctx.stroke()
    }
    y += 50
    setFont(300, 22, 'b')
    if (paint) {
      letter('0.12em')
      ctx.fillStyle = C.inkBody
      ctx.globalAlpha = 0.6
      ctx.fillText('ROBOT EXPERIENCE DESIGN', PAD, y)
      ctx.globalAlpha = 1
      ctx.fillStyle = C.accent
      ctx.textAlign = 'right'
      ctx.fillText('therobotage.com', CARD_W - PAD, y)
      ctx.textAlign = 'left'
      letter('0px')
    }
    y += 12

    return y
  }

  // Measure pass uses the same font metrics (canvas pixel size is irrelevant to measureText).
  ctx.textBaseline = 'alphabetic'
  const contentBottom = pass(false)
  const CARD_H = Math.ceil(contentBottom + PAD - 24)

  // Size + paint.
  canvas.width = CARD_W * scale
  canvas.height = CARD_H * scale
  canvas.style.aspectRatio = `${CARD_W} / ${CARD_H}`
  ctx.setTransform(scale, 0, 0, scale, 0, 0)
  ctx.fillStyle = C.bg
  ctx.fillRect(0, 0, CARD_W, CARD_H)
  ctx.textBaseline = 'alphabetic'
  pass(true)
}

/* ─── Main component ──────────────────────────────────────────────────────── */
export default function Scorecard() {
  const [robotName, setRobotName] = useState('')
  const [context, setContext] = useState('')
  const [scores, setScores] = useState<Record<string, number | null>>(
    Object.fromEntries(DIMENSIONS.map((d) => [d.key, null]))
  )
  const [notes, setNotes] = useState<Record<string, string>>(
    Object.fromEntries(DIMENSIONS.map((d) => [d.key, '']))
  )
  const [mode, setMode] = useState<'score' | 'audit'>('score')
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle')

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const auditRef = useRef<HTMLDivElement>(null)

  const [emailState, emailAction, emailPending] = useActionState(sendWhitepaperEmail, initialEmailState)

  const scoredKeys = DIMENSIONS.filter((d) => scores[d.key] != null)
  const scoredCount = scoredKeys.length
  const complete = scoredCount === 6
  const total = DIMENSIONS.reduce((sum, d) => sum + (scores[d.key] ?? 0), 0)
  const avg = scoredCount > 0 ? total / scoredCount : 0
  const missing = DIMENSIONS.filter((d) => scores[d.key] == null).map((d) => d.title)

  const setScore = (key: string, n: number) =>
    setScores((prev) => ({ ...prev, [key]: prev[key] === n ? null : n }))

  const buildCardData = useCallback((): CardData => {
    const finalAvg = total / 6
    const v = verdictFor(finalAvg)
    return {
      robotName: robotName.trim(),
      context: context.trim(),
      dims: DIMENSIONS.map((d) => ({ title: d.title, score: scores[d.key] as number, note: notes[d.key] })),
      avg: finalAvg,
      total,
      tier: v.tier,
      verdictLine: v.line,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    }
  }, [robotName, context, scores, notes, total])

  // Draw the card whenever the audit view is shown.
  useEffect(() => {
    if (mode !== 'audit' || !canvasRef.current) return
    let cancelled = false
    const draw = () => {
      if (cancelled || !canvasRef.current) return
      renderCard(canvasRef.current, buildCardData())
    }
    if (document.fonts && document.fonts.status !== 'loaded') {
      document.fonts.ready.then(draw)
    } else {
      draw()
    }
    return () => {
      cancelled = true
    }
  }, [mode, buildCardData])

  const handleGenerate = () => {
    if (!complete) return
    setMode('audit')
    setCopied('idle')
    requestAnimationFrame(() => auditRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const fileName = () => {
    const base = robotName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    return `rxd-scorecard-${base || 'robot'}.png`
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName()
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }

  const handleCopy = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    try {
      if (!navigator.clipboard || typeof ClipboardItem === 'undefined') throw new Error('unsupported')
      const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, 'image/png'))
      if (!blob) throw new Error('no blob')
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      setCopied('ok')
    } catch {
      setCopied('fail')
    }
    setTimeout(() => setCopied('idle'), 3000)
  }

  const handleReset = () => {
    setRobotName('')
    setContext('')
    setScores(Object.fromEntries(DIMENSIONS.map((d) => [d.key, null])))
    setNotes(Object.fromEntries(DIMENSIONS.map((d) => [d.key, ''])))
    setMode('score')
    setCopied('idle')
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
  }

  /* ── Audit view ────────────────────────────────────────────────────────── */
  if (mode === 'audit') {
    return (
      <section className={styles.section} ref={auditRef}>
        <div className="container-fluid">
          <div className={styles.auditLayout}>
            <div className={styles.cardColumn}>
              <p className={styles.eyebrow}>Your audit</p>
              <h2 className={styles.auditHeadline}>Ready to share.</h2>
              <canvas ref={canvasRef} className={styles.cardCanvas} role="img" aria-label={cardAltText(buildCardData())} />
            </div>

            <div className={styles.auditActions}>
              <button type="button" className={styles.primaryBtn} onClick={handleDownload}>
                Download PNG
              </button>
              <button type="button" className={styles.secondaryBtn} onClick={handleCopy}>
                {copied === 'ok' ? 'Copied to clipboard' : copied === 'fail' ? 'Copy not supported — use download' : 'Copy image'}
              </button>
              <button type="button" className={styles.textBtn} onClick={() => setMode('score')}>
                Edit scores
              </button>
              <button type="button" className={styles.textBtn} onClick={handleReset}>
                Score another robot
              </button>

              {/* Lead capture — post-value, never gated */}
              <div className={styles.leadCard}>
                {emailState.success ? (
                  <div className={styles.leadSuccess}>
                    <p className={styles.formEyebrow}>On its way</p>
                    <p className={styles.leadSuccessText}>
                      Check your inbox for the full RXD white paper and scoring rubric. Look in spam if it is not there in a few minutes.
                    </p>
                  </div>
                ) : (
                  <form action={emailAction} className={styles.leadForm} noValidate>
                    <p className={styles.formEyebrow}>Go deeper</p>
                    <p className={styles.leadHeading}>Want the full white paper and scoring rubric?</p>
                    <p className={styles.leadSub}>
                      The complete RXD framework: detailed 1&ndash;5 rubrics for every dimension, methodology, and a printable worksheet.
                    </p>
                    <div className={styles.leadFieldRow}>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="you@work.com"
                        aria-label="Email address"
                        className={styles.leadInput}
                      />
                      <button type="submit" className={styles.leadSubmit} disabled={emailPending}>
                        {emailPending ? 'Sending…' : 'Send it'}
                      </button>
                    </div>
                    {emailState.error && (
                      <p className={styles.errorMsg} role="alert">{emailState.error}</p>
                    )}
                  </form>
                )}
              </div>

              <Link href="/learn/rep" className={styles.repCta}>
                Get the REP credential
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  /* ── Scoring view ──────────────────────────────────────────────────────── */
  return (
    <section className={styles.section}>
      <div className="container-fluid">
        {/* Context header */}
        <div className={styles.contextHeader}>
          <div className={styles.fieldGroup}>
            <label htmlFor="robot-name" className={styles.label}>Robot name</label>
            <input
              id="robot-name"
              type="text"
              value={robotName}
              onChange={(e) => setRobotName(e.target.value)}
              placeholder="e.g. Reachy Mini"
              className={styles.input}
              autoComplete="off"
            />
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="context" className={styles.label}>What are you scoring?</label>
            <input
              id="context"
              type="text"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. Front-desk greeting in a hospital lobby"
              className={styles.input}
              autoComplete="off"
            />
          </div>
        </div>

        <div className={styles.scoreLayout}>
          {/* Dimensions */}
          <div className={styles.dimensions}>
            <p className={styles.scaleLegend}>
              <span>1 &mdash; absent or unclear</span>
              <span className={styles.scaleDot} aria-hidden="true">&middot;</span>
              <span>5 &mdash; exemplary, no instruction needed</span>
            </p>

            {DIMENSIONS.map((d) => {
              const score = scores[d.key]
              return (
                <div key={d.key} className={`${styles.dimRow} ${score != null ? styles.dimRowScored : ''}`}>
                  <div className={styles.dimHead}>
                    <span className={styles.dimNumber}>{d.number}</span>
                    <div className={styles.dimText}>
                      <h3 className={styles.dimTitle}>{d.title}</h3>
                      <p className={styles.dimDef}>{d.definition}</p>
                    </div>
                    <div className={styles.dimImageWrap}>
                      <Image
                        src={d.image}
                        alt=""
                        fill
                        className={styles.dimImage}
                        sizes="80px"
                      />
                    </div>
                  </div>

                  <ScoreSelector
                    dimKey={d.key}
                    dimTitle={d.title}
                    value={score}
                    onChange={(n) => setScore(d.key, n)}
                  />

                  <div className={styles.dimBarTrack} aria-hidden="true">
                    {score != null ? (
                      <div
                        className={styles.dimBarFill}
                        data-score={score}
                        style={{ width: `${(score / 5) * 100}%` }}
                      />
                    ) : (
                      <span className={styles.dimBarEmpty}>Pick a score above to chart this dimension</span>
                    )}
                  </div>

                  <textarea
                    value={notes[d.key]}
                    onChange={(e) => setNotes((prev) => ({ ...prev, [d.key]: e.target.value }))}
                    placeholder={`Why this score? What did you observe for ${d.title.toLowerCase()}?`}
                    className={styles.notes}
                    rows={2}
                    aria-label={`Notes for ${d.title}`}
                  />
                </div>
              )
            })}
          </div>

          {/* Live summary */}
          <aside className={styles.summary} aria-label="Live score summary">
            <div className={styles.summaryInner}>
              <p className={styles.summaryEyebrow}>Overall</p>
              <div className={styles.summaryScore}>
                <span className={styles.summaryAvg}>{avg.toFixed(1)}</span>
                <span className={styles.summaryAvgMax}>/ 5</span>
              </div>
              <p className={styles.summaryTotal}>{total} / 30 total</p>

              <div className={styles.summaryBars}>
                {DIMENSIONS.map((d) => {
                  const s = scores[d.key]
                  return (
                    <div key={d.key} className={styles.summaryBarRow}>
                      <span className={styles.summaryBarLabel}>{d.title}</span>
                      <span className={styles.summaryBarTrack}>
                        {s != null && (
                          <span className={styles.summaryBarFill} data-score={s} style={{ width: `${(s / 5) * 100}%` }} />
                        )}
                      </span>
                      <span className={styles.summaryBarVal}>{s != null ? s : '–'}</span>
                    </div>
                  )
                })}
              </div>

              <p className={styles.progress} aria-live="polite">
                {scoredCount} of 6 dimensions scored
              </p>

              <button
                type="button"
                className={styles.generateBtn}
                onClick={handleGenerate}
                disabled={!complete}
                aria-disabled={!complete}
              >
                Generate audit
              </button>

              {!complete && (
                <p className={styles.generateHint}>
                  {missing.length === 1
                    ? `One left: ${missing[0]}.`
                    : `${missing.length} left: ${missing.slice(0, 2).join(', ')}${missing.length > 2 ? '…' : ''}.`}
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

/* Descriptive alt text so the canvas card is meaningful to screen readers. */
function cardAltText(d: CardData): string {
  const dims = d.dims.map((x) => `${x.title} ${x.score} out of 5`).join(', ')
  return `RXD audit for ${d.robotName || 'a robot'}${d.context ? `, ${d.context}` : ''}. Overall ${d.avg.toFixed(1)} out of 5, ${d.total} out of 30. Verdict: ${d.tier}. ${dims}.`
}
