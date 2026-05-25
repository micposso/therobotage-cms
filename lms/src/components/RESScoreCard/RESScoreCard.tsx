import type { RRASubmission } from '@/types'
import styles from './RESScoreCard.module.css'

const DIMENSIONS = [
  { key: 'signal_clarity', label: 'Signal Clarity' },
  { key: 'spatial_legibility', label: 'Spatial Legibility' },
  { key: 'perceived_presence', label: 'Perceived Presence' },
  { key: 'failure_transparency', label: 'Failure Transparency' },
  { key: 'interaction_fit', label: 'Interaction Fit' },
  { key: 'recovery_design', label: 'Recovery Design' },
] as const

function scoreClass(score: number | null): string {
  if (!score) return ''
  if (score <= 2) return styles.scoreLow
  if (score === 3) return styles.scoreMid
  return styles.scoreHigh
}

interface RESScoreCardProps {
  rra: RRASubmission
}

export function RESScoreCard({ rra }: RESScoreCardProps) {
  return (
    <div className={styles.card}>
      {rra.total_res !== null && (
        <div className={styles.total}>
          <span className={styles.totalLabel}>RES Total</span>
          <span className={styles.totalScore}>{rra.total_res}/30</span>
        </div>
      )}
      <div className={styles.grid}>
        {DIMENSIONS.map(({ key, label }) => {
          const score = rra[`${key}_score` as keyof RRASubmission] as number | null
          const rationale = rra[`${key}_rationale` as keyof RRASubmission] as string | null
          return (
            <div key={key} className={styles.dimension}>
              <div className={styles.dimensionHeader}>
                <span className={styles.dimensionLabel}>{label}</span>
                {score !== null && (
                  <span className={`${styles.score} ${scoreClass(score)}`}>{score}/5</span>
                )}
              </div>
              {rationale && <p className={styles.rationale}>{rationale}</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
