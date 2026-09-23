import type { Locale } from '@/lib/i18n/routing'
import { uiText } from '@/lib/i18n/messages'
import { RobotProfile } from '@/lib/robot-profiles'
import styles from './RobotSpecStrip.module.css'

interface Props {
  locale?: Locale
  robot: RobotProfile
}

export default function RobotSpecStrip({ robot, locale = 'en' }: Props) {
  const items = [
    { label: 'Manufacturer', value: robot.manufacturer },
    { label: 'Type', value: robot.type },
    { label: 'Country', value: robot.country },
    { label: 'Price Range', value: robot.priceRange },
    { label: 'Year Introduced', value: String(robot.yearIntroduced) },
    { label: 'Autonomy', value: robot.autonomy },
    { label: 'Industry', value: robot.industry },
  ]

  return (
    <div className={styles.strip}>
      <div className="container-fluid">
        <div className={styles.inner}>
          {items.map((item) => (
            <div key={item.label} className={styles.item}>
              <span className={styles.label}>{uiText(item.label, locale)}</span>
              <span className={styles.value}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
