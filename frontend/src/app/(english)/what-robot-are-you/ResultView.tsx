'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { getImageProps } from 'next/image'
import { statBars, type QuizRobot, type StatBar } from '@/lib/quizRobots'
import { imageUrl } from '@/lib/image-assets'
import type { MatchHighlight } from '@/lib/matching'
import styles from './what-robot-are-you.module.css'

/* ─── Shared result view ──────────────────────────────────────────────────────
 * Rendered both by the quiz (with a personalized "why you matched" reason) and by
 * the shareable /what-robot-are-you/[slug] page (with a generic reason). Owns the
 * canvas card, the PNG/clipboard export, the LinkedIn share flow, and the email
 * capture form. The card is drawn directly to <canvas> (no DOM-to-image dep) so
 * the on-screen card, the download, and the clipboard copy are pixel-identical —
 * the same approach the RXD Scorecard uses.
 */

interface ResultViewProps {
  robot: QuizRobot
  /** Line under the headline and on the card. Personalized from the quiz; the robot blurb on the [slug] page. */
  reason: string
  /** Single trait adjective for the share caption (e.g. "expressive"). */
  traitWord?: string
  highlights?: MatchHighlight[]
  /** When provided, Retake resets the quiz in place; otherwise it links to the quiz. */
  onRetake?: () => void
  /** Small eyebrow above the headline. */
  eyebrow?: string
  /** Headline above the card. */
  headline?: string
  /** Label for the reason block on the card. */
  cardReasonLabel?: string
}

/* ─── Canvas card renderer ────────────────────────────────────────────────── */
const CARD_W = 1200
const PAD = 78
const PHOTO_H = 500

function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

interface CardData {
  name: string
  maker: string
  archetype: string
  reason: string
  reasonLabel: string
  bars: StatBar[]
  realWorld: string
  specs: { label: string; value: string }[]
  photo: HTMLImageElement | null
}

/**
 * Draws the result card onto `canvas`. Two passes: measure (paint=false) to size
 * the canvas to its content, then paint. Portrait, trading-card layout.
 */
function renderCard(canvas: HTMLCanvasElement, data: CardData) {
  const scale = 2
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Canvas fonts cannot resolve CSS var() references. Read the resolved family.
  const display = getComputedStyle(document.querySelector('h1, h2') ?? document.body).fontFamily
  const body = getComputedStyle(document.body).fontFamily
  const C = {
    bg: '#F5F0E8',
    ink: '#0D0D0D',
    inkBody: '#2A2A28',
    accent: '#9b5152',
    line: cssVar('--color-border') || 'rgba(13,13,13,0.12)',
    photoBg: '#F5F0E8',
    track: 'rgba(13,13,13,0.10)',
  }

  const setFont = (weight: number, size: number, fam: 'd' | 'b') =>
    (ctx.font = `${weight} ${size}px ${fam === 'd' ? display : body}`)

  const letter = (v: string) => {
    try {
      ;(ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = v
    } catch {
      /* unsupported — ignore */
    }
  }

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
    return lines.length ? lines : ['']
  }

  const innerW = CARD_W - PAD * 2

  const pass = (paint: boolean): number => {
    let y = PAD

    // Eyebrow row: archetype (left) + brand (right)
    setFont(400, 26, 'b')
    if (paint) {
      letter('0.16em')
      ctx.fillStyle = C.accent
      ctx.textAlign = 'left'
      ctx.fillText(data.archetype.toUpperCase(), PAD, y + 20)
      ctx.fillStyle = C.inkBody
      ctx.globalAlpha = 0.58
      ctx.textAlign = 'right'
      letter('0.12em')
      ctx.fillText('THE ROBOT AGE', CARD_W - PAD, y + 20)
      ctx.globalAlpha = 1
      letter('0px')
      ctx.textAlign = 'left'
    }
    y += 64

    // Robot name
    setFont(500, 82, 'd')
    letter('-0.02em')
    const nameLines = wrap(data.name, innerW, 2)
    for (const ln of nameLines) {
      y += 84
      if (paint) {
        ctx.fillStyle = C.ink
        ctx.fillText(ln, PAD, y)
      }
    }
    letter('0px')

    // Maker
    setFont(400, 30, 'b')
    y += 48
    if (paint) {
      ctx.fillStyle = C.inkBody
      ctx.globalAlpha = 0.68
      ctx.fillText(data.maker, PAD, y)
      ctx.globalAlpha = 1
    }

    // Photo tile
    y += 28
    if (paint) {
      ctx.fillStyle = C.photoBg
      ctx.fillRect(PAD, y, innerW, PHOTO_H)
      if (data.photo) {
        // contain-fit the image into the tile so tall robots are fully visible
        const iw = data.photo.naturalWidth
        const ih = data.photo.naturalHeight
        const scaleContain = Math.min(innerW / iw, PHOTO_H / ih)
        const dw = iw * scaleContain
        const dh = ih * scaleContain
        const dx = PAD + (innerW - dw) / 2
        const dy = y + (PHOTO_H - dh) / 2
        ctx.save()
        ctx.beginPath()
        ctx.rect(PAD, y, innerW, PHOTO_H)
        ctx.clip()
        ctx.drawImage(data.photo, dx, dy, dw, dh)
        ctx.restore()
      } else {
        // Branded placeholder
        setFont(400, 22, 'b')
        letter('0.14em')
        ctx.fillStyle = C.inkBody
        ctx.globalAlpha = 0.4
        ctx.textAlign = 'center'
        ctx.fillText(data.name.toUpperCase(), CARD_W / 2, y + PHOTO_H / 2 + 8)
        ctx.globalAlpha = 1
        ctx.textAlign = 'left'
        letter('0px')
      }
      ctx.strokeStyle = C.accent
      ctx.lineWidth = 3
      ctx.strokeRect(PAD + 1, y + 1, innerW - 2, PHOTO_H - 2)
    }
    y += PHOTO_H + 56

    setFont(400, 20, 'b')
    if (paint) {
      ctx.fillStyle = C.inkBody
      ctx.textAlign = 'right'
      ctx.fillText('QUIZ ARTWORK', CARD_W - PAD, y - 28)
      ctx.textAlign = 'left'
    }

    // Playful tendencies, explicitly separated from the factual specs below.
    setFont(400, 24, 'b')
    if (paint) {
      ctx.fillStyle = C.inkBody
      ctx.fillText('PERSONALITY MIX · JUST FOR FUN', PAD, y)
    }
    y += 48
    data.bars.forEach((bar) => {
      setFont(400, 30, 'b')
      if (paint) {
        letter('0.08em')
        ctx.fillStyle = C.inkBody
        ctx.globalAlpha = 0.85
        ctx.textAlign = 'left'
        ctx.fillText(bar.label.toUpperCase(), PAD, y)
        ctx.globalAlpha = 1
        letter('0px')
      }
      y += 22
      const barH = 18
      if (paint) {
        ctx.fillStyle = C.track
        ctx.fillRect(PAD, y, innerW, barH)
        ctx.fillStyle = C.accent
        ctx.fillRect(PAD, y, innerW * Math.max(0.02, bar.value), barH)
      }
      y += barH + 34
    })

    // Divider
    y += 4
    if (paint) {
      ctx.strokeStyle = C.line
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(PAD, y)
      ctx.lineTo(CARD_W - PAD, y)
      ctx.stroke()
    }
    y += 48

    // Why you matched
    setFont(400, 28, 'b')
    if (paint) {
      letter('0.16em')
      ctx.fillStyle = C.accent
      ctx.fillText(data.reasonLabel.toUpperCase(), PAD, y)
      letter('0px')
    }
    y += 16
    setFont(400, 44, 'd')
    letter('-0.01em')
    const reasonLines = wrap(data.reason, innerW)
    for (const ln of reasonLines) {
      y += 54
      if (paint) {
        ctx.fillStyle = C.ink
        ctx.fillText(ln, PAD, y)
      }
    }
    letter('0px')

    // Divider
    y += 48
    if (paint) {
      ctx.strokeStyle = C.line
      ctx.beginPath()
      ctx.moveTo(PAD, y)
      ctx.lineTo(CARD_W - PAD, y)
      ctx.stroke()
    }
    y += 44

    setFont(400, 24, 'b')
    if (paint) { ctx.fillStyle = C.accent; ctx.fillText('IN THE REAL WORLD', PAD, y) }
    y += 18
    setFont(400, 30, 'b')
    for (const line of wrap(data.realWorld, innerW)) {
      y += 40
      if (paint) { ctx.fillStyle = C.inkBody; ctx.fillText(line, PAD, y) }
    }
    y += 50

    // Robot identity (two columns). Volatile specs stay on manufacturer pages.
    const colW = innerW / 2
    for (let i = 0; i < data.specs.length; i += 2) {
      const rowSpecs = [data.specs[i], data.specs[i + 1]].filter(Boolean)
      let rowH = 0
      rowSpecs.forEach((spec, col) => {
        const x = PAD + col * colW
        setFont(400, 22, 'b')
        if (paint) {
          letter('0.12em')
          ctx.fillStyle = C.inkBody
          ctx.globalAlpha = 0.45
          ctx.fillText(spec.label.toUpperCase(), x, y)
          ctx.globalAlpha = 1
          letter('0px')
        }
        setFont(400, 32, 'd')
        const valLines = wrap(spec.value, colW - 24)
        let vy = y
        for (const ln of valLines) {
          vy += 40
          if (paint) {
            ctx.fillStyle = C.ink
            ctx.fillText(ln, x, vy)
          }
        }
        rowH = Math.max(rowH, vy - y)
      })
      y += rowH + 26
    }

    // Footer divider + wordmark + RXD tie-in
    y += 16
    if (paint) {
      ctx.strokeStyle = C.line
      ctx.beginPath()
      ctx.moveTo(PAD, y)
      ctx.lineTo(CARD_W - PAD, y)
      ctx.stroke()
    }
    y += 48
    setFont(600, 36, 'd')
    if (paint) {
      letter('-0.01em')
      ctx.fillStyle = C.ink
      ctx.textAlign = 'left'
      ctx.fillText('TheRobotAge', PAD, y)
      letter('0px')
    }
    setFont(400, 24, 'b')
    if (paint) {
      ctx.fillStyle = C.accent
      ctx.textAlign = 'right'
      ctx.fillText('therobotage.com/what-robot-are-you', CARD_W - PAD, y)
      ctx.textAlign = 'left'
    }
    y += 14

    return y
  }

  ctx.textBaseline = 'alphabetic'
  const contentBottom = pass(false)
  const CARD_H = Math.ceil(contentBottom + PAD - 14)

  canvas.width = CARD_W * scale
  canvas.height = CARD_H * scale
  canvas.style.aspectRatio = `${CARD_W} / ${CARD_H}`
  ctx.setTransform(scale, 0, 0, scale, 0, 0)
  ctx.fillStyle = C.bg
  ctx.fillRect(0, 0, CARD_W, CARD_H)
  ctx.textBaseline = 'alphabetic'
  pass(true)
}

/* ─── Component ────────────────────────────────────────────────────────────── */
export default function ResultView({
  robot,
  reason,
  traitWord,
  highlights,
  onRetake,
  eyebrow = 'Your match',
  headline,
  cardReasonLabel = 'Why you matched',
}: ResultViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null)
  const [photoReady, setPhotoReady] = useState(false)
  const [cardReady, setCardReady] = useState(false)
  const [shareFallback, setShareFallback] = useState('')
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle')
  const [toast, setToast] = useState<string | null>(null)

  // Email capture state
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [emailError, setEmailError] = useState<string | null>(null)

  const bars = useMemo(() => statBars(robot.traitVector), [robot.traitVector])

  useEffect(() => {
    if (!onRetake) return
    headingRef.current?.focus({ preventScroll: true })
    headingRef.current?.scrollIntoView({ block: 'center' })
  }, [onRetake])

  const buildCardData = useCallback(
    (): CardData => ({
      name: robot.name,
      maker: robot.maker,
      archetype: robot.archetype,
      reason,
      reasonLabel: cardReasonLabel,
      bars,
      realWorld: robot.learning.use,
      specs: [
        { label: 'Robot type', value: robot.learning.category.split(' · ')[0] },
        { label: 'Made by', value: robot.maker },
      ],
      photo,
    }),
    [robot, reason, cardReasonLabel, bars, photo]
  )

  // Preload the robot photo (falls back to a branded placeholder if missing).
  useEffect(() => {
    let cancelled = false
    const img = new window.Image()
    // The same-origin Next optimizer reads the verified R2 original. R2 does
    // not expose CORS headers, so drawing its URL directly taints the canvas.
    img.onload = () => {
      if (!cancelled) { setPhoto(img); setPhotoReady(true) }
    }
    img.onerror = () => {
      if (!cancelled) { setPhoto(null); setPhotoReady(true) }
    }
    img.src = getImageProps({ src: imageUrl(robot.photo), alt: '', width: 600, height: 600 }).props.src
    return () => {
      cancelled = true
    }
  }, [robot.photo])

  // Draw whenever inputs change.
  useEffect(() => {
    if (!canvasRef.current || !photoReady) return
    let cancelled = false
    const draw = () => {
      if (cancelled || !canvasRef.current) return
      renderCard(canvasRef.current, buildCardData())
      setCardReady(true)
    }
    if (document.fonts && document.fonts.status !== 'loaded') {
      document.fonts.ready.then(draw)
    } else {
      draw()
    }
    return () => {
      cancelled = true
    }
  }, [buildCardData, photoReady])

  const shareUrl = () =>
    typeof window !== 'undefined'
      ? `${window.location.origin}/what-robot-are-you/${robot.slug}`
      : `https://therobotage.com/what-robot-are-you/${robot.slug}`

  const caption = () =>
    `I got matched with the ${robot.name} — ${robot.archetype}. Turns out I'm more ${
      traitWord ?? 'robot'
    } than I thought. What robot are you? Take the 2-min quiz 👇`

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 4000)
  }

  const handleShare = async () => {
    const url = shareUrl()
    // Open synchronously inside the click so clipboard awaits cannot trigger
    // a popup blocker. This anchor also keeps the destination isolated.
    const link = document.createElement('a')
    link.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${url}?utm_source=linkedin&utm_medium=quiz&utm_campaign=what-robot`)}`
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.click()
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(caption())
        showToast('Caption copied — paste it into your post.')
      } else {
        showToast('Opening LinkedIn — add your own caption.')
      }
    } catch {
      showToast('Opening LinkedIn — add your own caption.')
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl())
      showToast('Result link copied. Send it to someone who gets you.')
    } catch {
      setShareFallback(shareUrl())
      showToast('Select and copy the result link below.')
    }
  }

  const fileName = () => `what-robot-are-you-${robot.slug}.png`

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas || !cardReady) return
    try { canvas.toBlob((blob) => {
      if (!blob) { showToast('Your card could not be exported. Please try again.'); return }
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName()
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    }, 'image/png') } catch {
      showToast('Your card could not be exported. You can still copy your result link.')
    }
  }

  const handleCopyImage = async () => {
    const canvas = canvasRef.current
    if (!canvas || !cardReady) return
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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailStatus('error')
      setEmailError('Please enter a valid email address.')
      return
    }
    setEmailStatus('sending')
    setEmailError(null)
    try {
      const res = await fetch('/api/robot-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), robotSlug: robot.slug, consent }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Something went wrong.')
      }
      setEmailStatus('sent')
    } catch (err) {
      setEmailStatus('error')
      setEmailError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <section className={styles.resultSection}>
      <div className="container-fluid">
        <div className={styles.resultLayout}>
          {/* Card */}
          <div className={styles.resultSummary}>
            <p className={styles.resultEyebrow}>{eyebrow}</p>
            <h1 ref={headingRef} tabIndex={-1} className={styles.resultHeadline}>
              {headline ?? `You’re ${robot.name}.`}
            </h1>
            <p className={styles.resultReason}>{reason}</p>
            {highlights && highlights.length > 0 && (
              <ul className={styles.matchDetails} aria-label="Why you matched">
                {highlights.map((item) => <li key={item.axis}>
                  <strong>{item.title[0].toUpperCase() + item.title.slice(1)}</strong>
                  <span>{item.detail}</span>
                </li>)}
              </ul>
            )}
          </div>
          <section className={styles.learningPanel} aria-labelledby="real-robot-heading">
            <span className={styles.galleryCategory}>{robot.learning.category}</span>
            <h2 id="real-robot-heading">Meet the real robot</h2>
            <p>{robot.learning.use}</p>
            <h3>What to notice</h3>
            <p>{robot.learning.takeaway}</p>
            <a href={robot.learning.source.url} target="_blank" rel="noopener noreferrer"
              className={styles.sourceLink}>{robot.learning.source.label} <span aria-hidden="true">↗</span></a>
            <span className={styles.sourceDate}>Manufacturer source · Reviewed November 12, 2026</span>
          </section>
          <div className={styles.cardColumn}>
            <canvas
              ref={canvasRef}
              className={styles.cardCanvas}
              role="img"
              aria-label={cardAltText(robot, reason, bars)}
              aria-busy={!cardReady}
            />
            <span className={styles.personalityNote}>Quiz artwork. See the manufacturer for current hardware. The personality mix is just for fun, not a capability rating or RXD score.</span>
          </div>

          {/* Actions + capture */}
          <div className={styles.actionsColumn}>
            <div className={styles.actionStack}>
              <button type="button" className={styles.primaryBtn} onClick={handleCopyLink}>
                Copy my result link
              </button>
              {shareFallback && <label className={styles.shareFallback}>Your result link
                <input readOnly value={shareFallback} onFocus={(event) => event.currentTarget.select()} />
              </label>}
              <button type="button" className={styles.secondaryBtn} onClick={handleShare}>
                Share on LinkedIn
              </button>
              <button type="button" className={styles.secondaryBtn} onClick={handleDownload} disabled={!cardReady}>
                {cardReady ? 'Download my card' : 'Preparing your card…'}
              </button>
              <button type="button" className={styles.secondaryBtn} onClick={handleCopyImage} disabled={!cardReady}>
                {copied === 'ok'
                  ? 'Copied to clipboard'
                  : copied === 'fail'
                    ? 'Copy not supported — use download'
                    : 'Copy image'}
              </button>
              {onRetake ? (
                <button type="button" className={styles.textBtn} onClick={onRetake}>
                  Retake the quiz
                </button>
              ) : (
                <Link href="/what-robot-are-you" className={styles.textBtn}>
                  Take the quiz
                </Link>
              )}
              <Link href="/what-robot-are-you#all-robots" className={styles.textBtn}>
                See all 9 robots
              </Link>
            </div>

            {/* Email capture — soft gate, never blocks the result */}
            <details className={styles.leadCard}>
              <summary>Email me a link to this robot</summary>
              {emailStatus === 'sent' ? (
                <div className={styles.leadSuccess}>
                  <p className={styles.formEyebrow}>On its way</p>
                  <p className={styles.leadSuccessText}>
                    Check your inbox for a link to your robot. Look in spam if it is not there in a few minutes.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleEmailSubmit} className={styles.leadForm} noValidate>
                  <p className={styles.leadSub}>
                    Save the robot overview and card link for later.
                  </p>
                  <input
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@work.com"
                    aria-label="Email address"
                    className={styles.leadInput}
                    autoComplete="email"
                  />
                  <label className={styles.consentRow}>
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className={styles.consentBox}
                    />
                    <span className={styles.consentText}>
                      Send me occasional emails from The Robot Age about robot literacy. You can
                      unsubscribe anytime. (Optional — your card is sent either way.)
                    </span>
                  </label>
                  <button
                    type="submit"
                    className={styles.leadSubmit}
                    disabled={emailStatus === 'sending'}
                  >
                    {emailStatus === 'sending' ? 'Sending…' : 'Email me my card'}
                  </button>
                  {emailStatus === 'error' && emailError && (
                    <p className={styles.errorMsg} role="alert">
                      {emailError}
                    </p>
                  )}
                </form>
              )}
            </details>

            <Link href="/robot-literacy" className={styles.rxdCta}>
              Keep learning with Robot Literacy
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {toast && (
        <div className={styles.toast} role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </section>
  )
}

/* Descriptive alt text so the canvas card is meaningful to screen readers. */
function cardAltText(robot: QuizRobot, reason: string, bars: StatBar[]): string {
  const statText = bars
    .map((b) => `${b.label} ${Math.round(b.value * 100)} percent`)
    .join(', ')
  return `Robot match card for ${robot.name} by ${robot.maker}, ${robot.archetype}. ${reason} Playful personality mix, not capability ratings: ${statText}. In the real world: ${robot.learning.use}`
}
