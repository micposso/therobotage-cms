import styles from './PageHero.module.css'

interface PageHeroProps {
  eyebrow: string
  title: string
  subtitle: string
}

export default function PageHero({ eyebrow, title, subtitle }: PageHeroProps) {
  return (
    <section className={styles.hero}>
      <div className="container-fluid">
        <div className={styles.inner}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
      </div>
    </section>
  )
}
