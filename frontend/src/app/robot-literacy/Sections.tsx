import VerticalStackedCards from '@/components/VerticalStackedCards/VerticalStackedCards'
import { journey, modules } from './content'
import styles from '@/app/live-robot-lab/live-robot-lab.module.css'
import local from './robot-literacy.module.css'

export function RobotLiteracyModuleAccordion() {
  return <div className={styles.faq}>
    {modules.map((module, index) => <details key={module.title}>
      <summary>Module {index + 1} — {module.title}</summary>
      <div className={local.moduleContent}>
        <dl className={local.details}>
          <div><dt>Learning objective</dt><dd>{module.objective}</dd></div>
          <div><dt>Questions learners should be able to answer</dt><dd><ul className={styles.list}>{module.questions.map((question) => <li key={question}>{question}</li>)}</ul></dd></div>
          <div><dt>Hands-on activity</dt><dd>{module.activity}</dd></div>
          <div><dt>Deliverable</dt><dd>{module.deliverable}</dd></div>
        </dl>
      </div>
    </details>)}
  </div>
}

export function RobotLiteracyJourney() {
  // The Lab's vertical timeline already supplies the responsive progression.
  return <ol className={styles.timeline}>
    {journey.map(([title, description], index) => <li key={title}>
      <span className={styles.time}>0{index + 1} / {title}</span>
      <div><h3>{title}</h3><p>{description}</p></div>
    </li>)}
  </ol>
}

export function RobotLiteracyFramework({ dimensions }: { dimensions: { title: string; description: string; items: string[] }[] }) {
  return <VerticalStackedCards cards={dimensions.map((dimension, index) => ({ ...dimension, eyebrow: `0${index + 1} — Dimension` }))} />
}
