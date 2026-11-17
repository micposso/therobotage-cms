import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import PageHero from '@/components/PageHero/PageHero'
import MetroRoboticsExplorer from '@/components/MetroRoboticsMap/MetroRoboticsExplorer'
import { imageUrl } from '@/lib/image-assets'

const title = 'NYC Metro Robotics Map'
const description = 'Explore robotics companies across New York City, Long Island, Connecticut, and New Jersey. Search by category, company, or location.'

export const metadata = {
  title,
  description,
  alternates: { canonical: '/metronyc-robotics-map' },
  openGraph: { title, description, url: '/metronyc-robotics-map', images: [{ url: imageUrl('/images/robot.png'), alt: 'The Robot Age' }] },
}

export default function MetroRoboticsMapPage() {
  return <>
    <Nav pinned />
    <main>
      <PageHero
        eyebrow="Regional robotics directory"
        title="NYC Metro Robotics Map"
        subtitle="Meet the companies building the region’s robotics future. Explore New York City, Long Island, Connecticut, and New Jersey."
        imageSrc="/images/robot.png"
      />
      <MetroRoboticsExplorer />
    </main>
    <Footer />
  </>
}
