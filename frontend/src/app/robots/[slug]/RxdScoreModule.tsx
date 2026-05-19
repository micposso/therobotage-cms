import { getScoreBySlug } from '@/lib/scores'
import RESScoreCard from '@/components/RESScoreCard/RESScoreCard'
import styles from './page.module.css'

interface Props {
  slug: string
  robotName: string
}

export default function RxdScoreModule({ slug, robotName }: Props) {
  const scoreData = getScoreBySlug(slug)

  return (
    <section className={styles.scoreSection}>
      <div className="container-fluid">
        {scoreData ? (
          <RESScoreCard
            score={{
              robotName,
              compositeScore: scoreData.compositeScore,
              tier: scoreData.tier,
              dimensions: scoreData.dimensions,
            }}
          />
        ) : (
          <>
            <p className={styles.eyebrow}>RXD Score</p>
            <h2 className={styles.scoreHeadline}>Robot Experience Score</h2>
            <p className={styles.scoreNote}>Scoring module in development.</p>
          </>
        )}
      </div>
    </section>
  )
}
