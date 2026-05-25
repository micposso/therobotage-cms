import styles from './ProgressBar.module.css'

interface ProgressBarProps {
  value: number
  max: number
  label?: string
}

export function ProgressBar({ value, max, label }: ProgressBarProps) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className={styles.wrapper}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.track} role="progressbar" aria-valuenow={value} aria-valuemax={max}>
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.count}>{value}/{max}</span>
    </div>
  )
}
