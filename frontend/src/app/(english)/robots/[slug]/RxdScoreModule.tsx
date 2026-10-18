import type { Locale } from '@/lib/i18n/routing'
import { getTranslatedContent } from '@/lib/i18n/content'
import { getScoreBySlug } from '@/lib/scores'
import RESScoreCard from '@/components/RESScoreCard/RESScoreCard'
import styles from './page.module.css'
import { uiText } from '@/lib/i18n/messages'

interface Props {
  locale?: Locale
  slug: string
  robotName: string
}

export default function RxdScoreModule({ slug, robotName, locale = 'en' }: Props) {
  const scoreData = getScoreBySlug(slug)

  const translated = locale === 'es' ? getTranslatedContent().find(item => item.id === `scores/${slug}.md`) : undefined

  return (
    <section id="rxd-evaluation" className={styles.scoreSection}>
      <div className="container-fluid">
        <h2>{uiText('RXD evaluation', locale)}</h2>
        <p>{uiText('Original scores and observations retained. Not reassessed under methodology 1.0.', locale)}</p>
        {scoreData ? (
          <RESScoreCard
            score={{
              robotName,
              compositeScore: scoreData.compositeScore,
              tier: translated?.data.tier ?? scoreData.tier,
              dimensions: translated?.data.dimensions ?? scoreData.dimensions,
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
