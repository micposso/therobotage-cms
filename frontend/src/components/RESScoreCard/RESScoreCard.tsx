'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './RESScoreCard.module.css'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DimensionScore {
  score: number
  summary: string
}

export interface ScoreData {
  robotName: string
  compositeScore: number
  tier: string
  dimensions: DimensionScore[] // 6 entries, in RXD order
}

interface Props {
  score: ScoreData
}

// ─── Radar geometry ───────────────────────────────────────────────────────────

const CX = 250
const CY = 185
const MAX_R = 118
const LABEL_R = 152

const ANGLES = Array.from({ length: 6 }, (_, i) => (i * 2 * Math.PI) / 6 - Math.PI / 2)

function pt(angle: number, r: number): [number, number] {
  return [CX + r * Math.cos(angle), CY + r * Math.sin(angle)]
}

function hexPath(r: number): string {
  return ANGLES.map((a) => pt(a, r).join(',')).join(' ')
}

// ─── Axis labels ──────────────────────────────────────────────────────────────

const AXIS_LABELS: [string, string][] = [
  ['Signal',      'Clarity'],
  ['Spatial',     'Legibility'],
  ['Perceived',   'Presence'],
  ['Failure',     'Transparency'],
  ['Interaction', 'Fit'],
  ['Recovery',    'Design'],
]

const DIMENSION_NAMES = [
  'Signal Clarity',
  'Spatial Legibility',
  'Perceived Presence',
  'Failure Transparency',
  'Interaction Fit',
  'Recovery Design',
]

const DIMENSION_ICONS = [
  '/images/signal-icon.png',
  '/images/legibility-icon.png',
  '/images/robot.png',
  '/images/failure-icon.png',
  '/images/hand.png',
  '/images/recovery-icon.png',
]

function anchor(i: number): 'middle' | 'start' | 'end' {
  if (i === 0 || i === 3) return 'middle'
  if (i === 1 || i === 2) return 'start'
  return 'end'
}

// ─── Bar fill ─────────────────────────────────────────────────────────────────

function barColor(score: number): string {
  if (score < 2.5) return 'var(--res-bar-3)'      // low — gray
  if (score < 4) return 'var(--res-orange)'        // medium — orange
  return 'var(--color-tertiary)'                   // mostly positive — green
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RESScoreCard({ score }: Props) {
  const barsRef = useRef<HTMLDivElement>(null)
  const [animated, setAnimated] = useState(false)
  const [displayScores, setDisplayScores] = useState(score.dimensions.map(() => 0))
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    const el = barsRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect()
          setAnimated(true)

          const targets = score.dimensions.map((d) => d.score)
          const duration = 800
          const start = performance.now()

          function tick(now: number) {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplayScores(targets.map((t) => Math.round(eased * t * 10) / 10))
            if (progress < 1) requestAnimationFrame(tick)
          }

          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.2 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [score.dimensions])

  const radarPoints = score.dimensions
    .map((d, i) => pt(ANGLES[i], (d.score / 5) * MAX_R).join(','))
    .join(' ')

  return (
    <div className={styles.card}>

      {/* ── Left: radar ── */}
      <div className={styles.radarWrap}>
        <h2 className={styles.robotName}>{score.robotName}</h2>

        <svg
          viewBox="0 0 500 385"
          className={styles.radar}
          role="img"
          aria-label={`RXD radar profile for ${score.robotName}`}
        >
          {[1, 2, 3, 4, 5].map((level) => (
            <polygon key={level} points={hexPath((level / 5) * MAX_R)} className={styles.gridHex} />
          ))}

          {ANGLES.map((a, i) => {
            const [x2, y2] = pt(a, MAX_R)
            return <line key={i} x1={CX} y1={CY} x2={x2} y2={y2} className={styles.axisSpoke} />
          })}

          <polygon points={radarPoints} className={styles.radarFill} />
          <polygon points={radarPoints} className={styles.radarStroke} />

          {score.dimensions.map((d, i) => {
            const [x, y] = pt(ANGLES[i], (d.score / 5) * MAX_R)
            return <circle key={i} cx={x} cy={y} r="3.5" className={styles.radarDot} />
          })}

          {AXIS_LABELS.map(([line1, line2], i) => {
            const [lx, ly] = pt(ANGLES[i], LABEL_R)
            return (
              <text
                key={i}
                x={lx}
                y={ly}
                textAnchor={anchor(i)}
                dominantBaseline="middle"
                className={styles.axisLabel}
                style={{
                  fill: hoveredIndex === i ? 'var(--color-red)' : undefined,
                  cursor: 'pointer',
                  transition: 'fill 0.15s ease',
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <tspan x={lx} dy="-0.65em">{line1}</tspan>
                <tspan x={lx} dy="1.3em">{line2}</tspan>
              </text>
            )
          })}
        </svg>

        <p className={styles.compositeLabel}>
          <span className={styles.compositeScore}>{score.compositeScore.toFixed(2)}&thinsp;/&thinsp;5.0</span>
          <span className={styles.compositeSep}> — </span>
          <span className={styles.compositeTier}>{score.tier}</span>
        </p>
      </div>

      {/* ── Right: bars ── */}
      <div className={styles.bars} ref={barsRef}>
        {score.dimensions.map((dim, i) => (
          <div
            key={i}
            className={styles.barRow}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className={styles.barHeader}>
              <span
                className={styles.barName}
                style={{
                  color: hoveredIndex === i ? 'var(--color-red)' : undefined,
                  transition: 'color 0.15s ease',
                }}
              >{DIMENSION_NAMES[i]}</span>
              <span className={styles.barScore}>{displayScores[i].toFixed(1)}&thinsp;/&thinsp;5</span>
            </div>
            <div className={styles.barBody}>
              <Image
                src={DIMENSION_ICONS[i]}
                alt=""
                width={24}
                height={24}
                className={styles.barIcon}
              />
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{
                    width: animated ? `${(dim.score / 5) * 100}%` : '0%',
                    background: barColor(dim.score),
                    transition: `width 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 90}ms`,
                  }}
                />
              </div>
            </div>
            <p className={styles.barSummary}>{dim.summary}</p>
          </div>
        ))}
      </div>

    </div>
  )
}
