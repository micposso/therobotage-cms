import type { ReactNode } from 'react'
import styles from '@/app/live-robot-lab/live-robot-lab.module.css'

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
export default function VerticalStackedCards({ cards }: { cards: readonly StackedCard[] }) {
  return (
    <div>
      {cards.map((card) => (
        <article key={card.title} className={`${styles.card} ${styles.twoGrid}`}>
          <div>
            {card.eyebrow && <p className={styles.eyebrow}>{card.eyebrow}</p>}
            <h3>{card.title}</h3>
            {card.media}
          </div>
          <div>
            {card.description && <p>{card.description}</p>}
            {card.items && <ul className={styles.list}>{card.items.map((item) => <li key={item}>{item}</li>)}</ul>}
            {card.content}
            {card.cta && <div className={styles.actions}>{card.cta}</div>}
          </div>
        </article>
      ))}
    </div>
  )
}
