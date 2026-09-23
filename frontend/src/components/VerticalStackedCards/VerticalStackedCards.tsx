import { uiText } from '@/lib/i18n/messages'
import type { Locale } from '@/lib/i18n/routing'
import type { ReactNode } from 'react'
import styles from '@/app/(english)/live-robot-lab/live-robot-lab.module.css'

export interface StackedCard {
  title: string
  eyebrow?: string
  description?: string
  items?: readonly string[]
  content?: ReactNode
  media?: ReactNode
  cta?: ReactNode
}

/** Composes the existing Lab card and responsive two-column layout. */
export default function VerticalStackedCards({ cards, locale = 'en' }: { cards: readonly StackedCard[]; locale?: Locale }) {
  const t = (text: string) => uiText(text, locale)
  return (
    <div>
      {cards.map((card) => (
        <article key={card.title} className={`${styles.card} ${styles.twoGrid}`}>
          <div>
            {card.eyebrow && <p className={styles.eyebrow}>{t(card.eyebrow)}</p>}
            <h3>{t(card.title)}</h3>
            {card.media}
          </div>
          <div>
            {card.description && <p>{t(card.description)}</p>}
            {card.items && <ul className={styles.list}>{card.items.map((item) => <li key={item}>{t(item)}</li>)}</ul>}
            {card.content}
            {card.cta && <div className={styles.actions}>{card.cta}</div>}
          </div>
        </article>
      ))}
    </div>
  )
}
