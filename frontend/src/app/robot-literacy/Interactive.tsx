'use client'

import { useId, useState } from 'react'
import VerticalStackedCards from '@/components/VerticalStackedCards/VerticalStackedCards'
import { exercise, useCases } from './framework-content'
import styles from '@/app/live-robot-lab/live-robot-lab.module.css'
import local from './robot-literacy.module.css'

/** Reusable observation exercise; explanations reveal independently and remain revisitable. */
export function ReadTheRobotExercise({ scenario = 'A delivery robot approaches you on a sidewalk.', questions = exercise }: {
  scenario?: string; questions?: readonly (readonly [string, string])[]
}) {
  const [reviewed, setReviewed] = useState<number[]>([])
  return <div className={styles.twoGrid}>
    <div>
      <p className={styles.eyebrow}>An everyday encounter</p>
      <p className={local.scenarioStatement}>{scenario}</p>
      <p>Before revealing each explanation, pause and consider what you can observe—and what you would need to ask the operator.</p>
      <p className={styles.meta} role="status">{reviewed.length} of {questions.length} questions explored</p>
      {reviewed.length === questions.length && <p className={styles.notice}>The key insight: you cannot read everything from appearances. Knowing what you don’t know is part of Robot Literacy.</p>}
    </div>
    <div className={styles.faq}>{questions.map(([question, answer], index) => <details key={question}
      onToggle={(event) => { if (event.currentTarget.open) setReviewed((current) => current.includes(index) ? current : [...current, index]) }}>
      <summary>{question}</summary><p>{answer}</p>
    </details>)}</div>
  </div>
}

export function RobotUseCaseExplorer() {
  const [filter, setFilter] = useState('Education')
  const id = useId()
  const shown = useCases.filter((item) => filter === 'All' || item.industry === filter)
  return <>
    <div role="group" aria-label="Filter scenarios by setting" className={local.controls}>
      {[...useCases.map((item) => item.industry), 'All'].map((industry) => <button type="button" key={industry}
        aria-pressed={filter === industry} aria-controls={id} onClick={() => setFilter(industry)}
        className={`${styles.button} ${local.filter} ${filter === industry ? local.selected : ''}`}>
        {industry}
      </button>)}
    </div>
    <p role="status" className={styles.meta}>{shown.length} {shown.length === 1 ? 'scenario' : 'scenarios'} · {filter}</p>
    <div id={id}><VerticalStackedCards cards={shown.map((item) => ({ title: item.scenario, eyebrow: item.industry,
      media: <dl className={local.details}><div><dt>Robot role</dt><dd>{item.robot}</dd></div><div><dt>Human role</dt><dd>{item.human}</dd></div></dl>,
      content: <dl className={local.scenarioQuestions}>
        <div><dt>READ</dt><dd>{item.read}</dd></div>
        <div><dt>RELATE</dt><dd>{item.relate}</dd></div>
        <div><dt>COEXIST</dt><dd>{item.coexist}</dd></div>
      </dl>,
    }))} /></div>
  </>
}

export function PartnershipLink({ children }: { children: React.ReactNode }) {
  return <a className={styles.textLink} href="#inquiry" onClick={() => window.dispatchEvent(new Event('robot-literacy-partnership'))}>{children}</a>
}

export function LiteracySignup() {
  // TODO: Connect to a Robot Literacy newsletter audience with consent, validation,
  // delivery errors and unsubscribe support. Job alerts are a different subscription.
  // Until then, do not collect addresses or display a false success state.
  return <div className={styles.form}>
    <p className={styles.intro}>Get new Robot Literacy resources, research, lessons and framework updates.</p>
    <div className={local.signup}>
      <div className={styles.field}><label htmlFor="literacy-follow-email">Email</label>
        <input id="literacy-follow-email" className={styles.input} type="email" autoComplete="email" disabled aria-describedby="literacy-signup-note" />
      </div>
      <button className={`${styles.button} ${local.unavailable}`} type="button" disabled aria-describedby="literacy-signup-note">Follow the Project</button>
    </div>
    <p id="literacy-signup-note" className={styles.meta}>Email signup is not available yet. In the meantime, <a className={styles.textLink} href="/robotics-literacy">explore the free Robot Literacy Series</a>.</p>
  </div>
}
