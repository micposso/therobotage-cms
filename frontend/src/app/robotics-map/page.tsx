import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import RoboticsMapExplorer from '@/components/RoboticsMap/RoboticsMapExplorer'
import { roboticsMapCompanies, roboticsMapFacets } from '@/lib/robotics-map'
import styles from './page.module.css'

export const metadata = {
  title: 'Robotics Map — The Robot Age',
  description: 'An interactive map of robotics companies, sectors, robot types, funding signals, and deployment focus around the world.',
  openGraph: {
    title: 'Robotics Map — The Robot Age',
    description: 'Explore robotics companies by geography, sector, robot type, founding year, and business signal.',
    images: [{ url: '/images/robot.png', alt: 'The Robot Age' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/robot.png'],
  },
}

export default function RoboticsMapPage() {
  return (
    <>
      <Nav pinned />
      <main className={styles.page}>
        <div className="container-fluid">
          <header className={styles.header}>
            <p className={styles.eyebrow}>Robotics company atlas</p>
            <h1 className={styles.title}>Where the robot economy is taking shape.</h1>
            <p className={styles.subtitle}>
              Filter robotics companies by geography, product category, customer sector, maturity, commercial proof, and ecosystem role. The same market-intelligence model powers the public API at <code>/api/robotics-map</code>.
            </p>
          </header>
          <RoboticsMapExplorer companies={roboticsMapCompanies} facets={roboticsMapFacets} />
        </div>
      </main>
      <Footer />
    </>
  )
}
