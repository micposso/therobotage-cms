import JobDetail from '@/app/(english)/jobs/[slug]/page'
import RobotDetail from '@/app/(english)/robots/[slug]/page'
import SignalDetail from '@/app/(english)/research/field-signals/[slug]/page'
import ResearchDetail from '@/app/(english)/research/[slug]/page'
import NewsDetail from '@/app/(english)/news/[slug]/page'
import Search from '@/app/(english)/search/page'
import Jobs from '@/app/(english)/jobs/page'
import Robots from '@/app/(english)/robots/page'
import Research from '@/app/(english)/research/page'
import Home from '@/app/(english)/page'
import RobotLiteracy, { generateMetadata as literacyMetadata } from '@/app/(english)/robot-literacy/page'
import Learn, { generateMetadata as learnMetadata } from '@/app/(english)/learn/page'
import Credential, { generateMetadata as credentialMetadata } from '@/app/(english)/learn/[credential]/page'
import Curriculum, { generateMetadata as curriculumMetadata } from '@/app/(english)/learn/[credential]/curriculum/page'
import LiveRobotLab, { generateMetadata as labMetadata } from '@/app/(english)/live-robot-lab/page'
import LiteracyPartners, { generateMetadata as partnersMetadata } from '@/app/(english)/robot-literacy/partners/page'
import Access, { generateMetadata as accessMetadata } from '@/app/(english)/access/page'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getAvailableTranslations, getTranslation, translationAlternates } from '@/lib/i18n/content'

type Props = { params: Promise<{ locale: string; path?: string[] }>; searchParams: Promise<{ q?: string }> }
export const revalidate = 900
const fallbackRoutes = new Set(['/learn', '/rxd', '/robot-literacy/partners', '/live-robot-lab', '/enterprise', '/summit', '/connect', '/access', '/privacy', '/terms', '/ai-statement', '/press', '/rxd-scorecard', '/what-robot-are-you', '/rxd-free-workshop', '/href'])
const indexTitles: Record<string, string> = { '/': 'El mundo de los robots, en español', '/research': 'Investigación y noticias', '/robots': 'Robots', '/jobs': 'Empleos en robótica', '/search': 'Buscar contenido' }

export function generateStaticParams() {
  return getAvailableTranslations().map((route) => ({ locale: 'es', path: route === '/' ? [] : route.slice(1).split('/') }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path: segments = [] } = await params
  const route = '/' + segments.join('/')
  if (route === '/robot-literacy') return literacyMetadata({ params: Promise.resolve({ locale: 'es' }) })
  const pageParams = Promise.resolve({ locale: 'es' as const })
  if (route === '/learn') return learnMetadata({ params: pageParams })
  if (route === '/live-robot-lab') return labMetadata({ params: pageParams })
  if (route === '/robot-literacy/partners') return partnersMetadata({ params: pageParams })
  if (route === '/access') return accessMetadata({ params: pageParams })
  if (segments[0] === 'learn' && getAvailableTranslations().includes(route)) {
    const params = Promise.resolve({ locale: 'es' as const, credential: segments[1] })
    return segments[2] === 'curriculum' ? curriculumMetadata({ params }) : credentialMetadata({ params })
  }
  const article = getTranslation(route)
  const title = article?.data.title || article?.data.headline || indexTitles[route]
  if (!title) return { robots: { index: false, follow: true } }
  const description = article?.data.excerpt || article?.data.description || article?.data.summary || 'Investigación, noticias y perspectivas sobre cómo convivimos y trabajamos con robots.'
  const url = `https://therobotage.com/es${route === '/' ? '' : route}`
  const image = article?.data.headerImage || article?.data.image
  return { title, description, alternates: { canonical: url, languages: translationAlternates(route) },
    ...(route === '/search' ? { robots: { index: false, follow: true } } : {}),
    openGraph: { title, description, url, locale: 'es_ES', type: article ? 'article' : 'website', ...(image ? { images: [{ url: image, alt: title }] } : {}) },
    twitter: { card: 'summary_large_image', title, description, ...(image ? { images: [image] } : {}) },
  }
}

// Locale routing selects data, while every view is the original page component.
export default async function TranslatedPage({ params, searchParams }: Props) {
  const { locale, path: segments = [] } = await params
  if (locale !== 'es') notFound()
  const route = '/' + segments.join('/')
  const pageParams = Promise.resolve({ locale: 'es' as const })
  if (route === '/robot-literacy') return <RobotLiteracy params={pageParams} />
  if (route === '/learn') return <Learn params={pageParams} />
  if (route === '/live-robot-lab') return <LiveRobotLab params={pageParams} />
  if (route === '/robot-literacy/partners') return <LiteracyPartners params={pageParams} />
  if (route === '/access') return <Access params={pageParams} />
  if (segments[0] === 'learn' && getAvailableTranslations().includes(route)) {
    const params = Promise.resolve({ locale: 'es' as const, credential: segments[1] })
    return segments[2] === 'curriculum' ? <Curriculum params={params} /> : <Credential params={params} />
  }
  if (route === '/') return <Home params={pageParams} />
  if (route === '/research') return <Research params={pageParams} />
  if (route === '/robots') return <Robots params={pageParams} />
  if (route === '/jobs') return <Jobs params={pageParams} />
  if (route === '/search') return <Search params={pageParams} searchParams={searchParams} />
  if (!getTranslation(route)) {
    if (fallbackRoutes.has(route)) redirect(`${route}?lang=es`)
    notFound()
  }
  const detailParams = Promise.resolve({ locale: 'es' as const, slug: segments.at(-1)! })
  if (segments.length === 2) {
    if (segments[0] === 'news') return <NewsDetail params={detailParams} />
    if (segments[0] === 'robots') return <RobotDetail params={detailParams} />
    if (segments[0] === 'jobs') return <JobDetail params={detailParams} />
    if (segments[0] === 'research') return <ResearchDetail params={detailParams} />
  }
  if (segments.length === 3 && segments[0] === 'research' && segments[1] === 'field-signals') return <SignalDetail params={detailParams} />
  notFound()
}
