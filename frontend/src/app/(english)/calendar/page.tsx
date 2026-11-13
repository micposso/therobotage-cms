import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import FieldSignals from '@/components/FieldSignals/FieldSignals'
import Footer from '@/components/Footer/Footer'
import { robotWeek, robotWeekEvents } from '@/lib/events'
import { imageUrl } from '@/lib/image-assets'
import styles from '@/components/FieldSignals/FieldSignals.module.css'

const description = 'Robotics events from November 2026 through January 2027. Explore the Robot Week NYC program, dates, attendance requirements and registration links.'

export const metadata = {
  title: 'Events Calendar',
  description,
  alternates: { canonical: '/calendar' },
  openGraph: {
    title: 'Events Calendar — The Robot Age', description, url: '/calendar',
    images: [{ url: imageUrl('/images/live-robot-lab/group-session.webp'), alt: 'People exploring human–robot interaction' }],
  },
  twitter: { card: 'summary_large_image', images: [imageUrl('/images/live-robot-lab/group-session.webp')] },
}

const months = [
  { id: 'november', title: 'November', year: '2026', prefix: '2026-11' },
  { id: 'december', title: 'December', year: '2026', prefix: '2026-12' },
  { id: 'january', title: 'January', year: '2027', prefix: '2027-01' },
]

export default function CalendarPage() {
  return <>
    <Nav pinned />
    <main>
      <PageHero compact eyebrow="November 2026 — January 2027" title="Events calendar" subtitle="Meet the people and robots shaping what comes next. Find conversations, hands-on experiences and opportunities to build.">
        <div className="row g-4 mt-2" aria-label="Jump to month">
          {months.map((month) => <div className="col-auto" key={month.id}><a href={`#${month.id}`} className={styles.indexCta}>{month.title} {month.year} <span aria-hidden="true">↓</span></a></div>)}
        </div>
      </PageHero>
      {months.map((month) => <FieldSignals
        key={month.id} id={month.id} calendar eyebrow={month.year} title={month.title}
        indexUrl={month.id === 'november' ? robotWeek.url : null} indexLabel="Robot Week NYC"
        description={month.id === 'november' ? `${robotWeek.name} · ${robotWeek.dates}. ${robotWeek.summary}` : undefined}
        emptyMessage={`No events announced for ${month.title} ${month.year} yet.`}
        items={robotWeekEvents.filter((event) => event.dates[0].isoDate?.startsWith(month.prefix)).map((event) => ({
          slug: event.slug,
          number: event.dates.map((date) => date.isoDate?.slice(-2)).join('–'),
          title: event.title,
          category: event.location.format === 'online' ? 'Virtual · Online' : 'In person · New York City',
          date: `${event.dates.length > 1 ? 'Saturday–Sunday' : event.dates[0].label} · ${event.dates[0].time ?? 'Time to be announced'}`,
          excerpt: `${event.description}${event.featuredRobots ? ` Featured robots: ${event.featuredRobots.join(' and ')}.` : ''}`,
          href: event.sourceUrl,
          access: event.access,
          action: { label: event.registration.label!, url: event.registration.url! },
          note: event.registration.availability === 'interest-only' ? robotWeek.interestNote : undefined,
        }))}
      />)}
    </main>
    <Footer />
  </>
}
