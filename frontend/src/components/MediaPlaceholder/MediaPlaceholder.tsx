import styles from '@/app/live-robot-lab/live-robot-lab.module.css'

export default function MediaPlaceholder({ label, video = false }: { label: string; video?: boolean }) {
  return (
    <figure className={styles.video}>
      <figcaption>
        <p className={styles.eyebrow}>{label}</p>
        <p>{video ? 'Video coming soon' : 'Image coming soon'}</p>
      </figcaption>
    </figure>
  )
}
