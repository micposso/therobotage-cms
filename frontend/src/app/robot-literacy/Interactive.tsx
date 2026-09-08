'use client'

import { useId, useRef, useState, type KeyboardEvent } from 'react'
import VerticalStackedCards from '@/components/VerticalStackedCards/VerticalStackedCards'
import { audiences, useCases } from './content'
import styles from '@/app/live-robot-lab/live-robot-lab.module.css'
import local from './robot-literacy.module.css'

export function RobotLiteracyAudienceSelector() {
  const [active, setActive] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const id = useId()
  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number
    switch (event.key) {
      case 'ArrowRight': next = (index + 1) % audiences.length; break
      case 'ArrowLeft': next = (index - 1 + audiences.length) % audiences.length; break
      case 'Home': next = 0; break
      case 'End': next = audiences.length - 1; break
      default: return
    }
    event.preventDefault()
    setActive(next)
    tabs.current[next]?.focus()
  }
  return <>
    <div role="tablist" aria-label="Your Robot Literacy pathway" className={local.controls}>
      {audiences.map((audience, index) => <button key={audience.label} ref={(element) => { tabs.current[index] = element }}
        type="button" role="tab" id={`${id}-tab-${index}`} aria-controls={`${id}-panel-${index}`} aria-selected={active === index}
        tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={(event) => navigate(event, index)}
        className={`${styles.button} ${active === index ? local.selected : ''}`}>
        {active === index && <span aria-hidden="true">✓</span>}{audience.label}
      </button>)}
    </div>
    {audiences.map((audience, index) => <div key={audience.label} role="tabpanel" id={`${id}-panel-${index}`}
      aria-labelledby={`${id}-tab-${index}`} hidden={active !== index} tabIndex={0}>
      <h3>{audience.title}</h3>
      <p className={styles.intro}>{audience.description}</p>
      <div className={styles.twoGrid}>
        <div><h4 className={styles.subheading}>Key outcomes</h4><ul className={styles.list}>{audience.outcomes.map((item) => <li key={item}>{item}</li>)}</ul></div>
        <div><h4 className={styles.subheading}>Recommended formats</h4><ul className={styles.list}>{audience.formats.map((item) => <li key={item}>{item}</li>)}</ul></div>
      </div>
    </div>)}
  </>
}

export function RobotUseCaseExplorer() {
  const [filter, setFilter] = useState('All')
  const shown = useCases.filter((item) => filter === 'All' || item.industry === filter)
  return <>
    <div role="group" aria-label="Filter use cases by industry" className={local.controls}>
      {['All', ...useCases.map((item) => item.industry)].map((industry) => <button type="button" key={industry}
        aria-pressed={filter === industry} onClick={() => setFilter(industry)}
        className={`${styles.button} ${filter === industry ? local.selected : ''}`}>
        {filter === industry && <span aria-hidden="true">✓</span>}{industry}
      </button>)}
    </div>
    <p role="status" className={styles.meta}>{shown.length} {shown.length === 1 ? 'scenario' : 'scenarios'} · {filter}</p>
    <VerticalStackedCards cards={shown.map((item) => ({ title: item.scenario, eyebrow: item.industry,
      content: <dl className={local.details}>
        <div><dt>Robot role</dt><dd>{item.robot}</dd></div>
        <div><dt>Human role</dt><dd>{item.human}</dd></div>
        <div><dt>Literacy question</dt><dd>{item.question}</dd></div>
      </dl>,
    }))} />
  </>
}

export function PartnershipLink({ children }: { children: React.ReactNode }) {
  return <a className={styles.textLink} href="#inquiry" onClick={() => window.dispatchEvent(new Event('robot-literacy-partnership'))}>{children}</a>
}
