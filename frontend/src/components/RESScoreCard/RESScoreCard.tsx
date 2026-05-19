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

function anchor(i: number): 'middle' | 'start' | 'end' {
  if (i === 0 || i === 3) return 'middle'
  if (i === 1 || i === 2) return 'start'
  return 'end'
}

// ─── Bar fill ─────────────────────────────────────────────────────────────────

function barColor(score: number): string {
  const s = Math.max(1, Math.min(5, Math.round(score)))
  return `var(--res-bar-${s})`
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RESScoreCard({ score }: Props) {
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
      <div className={styles.bars}>
        {score.dimensions.map((dim, i) => (
          <div key={i} className={styles.barRow}>
            <div className={styles.barHeader}>
              <span className={styles.barName}>{DIMENSION_NAMES[i]}</span>
              <span className={styles.barScore}>{dim.score}&thinsp;/&thinsp;5</span>
            </div>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{ width: `${(dim.score / 5) * 100}%`, background: barColor(dim.score) }}
              />
            </div>
            <p className={styles.barSummary}>{dim.summary}</p>
          </div>
        ))}
      </div>

    </div>
  )
}
