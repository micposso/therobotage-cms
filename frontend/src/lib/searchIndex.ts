import { articles } from './articles'
import { fieldSignals } from './fieldSignals'
import { certifications } from './certifications'
import { getAllNewsArticles } from './news'

export interface SearchResult {
  type: 'News' | 'Field Signal' | 'Certification' | 'Research' | 'Page'
  title: string
  excerpt: string
  url: string
  tag?: string
}

const STATIC_PAGES: SearchResult[] = [
  {
    type: 'Page',
    title: 'Research',
    excerpt: 'Original research, frameworks, and critical perspectives on the human side of robotics — published for the people designing what comes next.',
    url: '/research',
  },
  {
    type: 'Page',
    title: 'Robot Experience Design (RXD)',
    excerpt: 'A six-dimension model for evaluating robot interactions the way users actually experience them — built for practitioners, not engineers.',
    url: '/rxd',
  },
  {
    type: 'Page',
    title: 'Learn',
    excerpt: 'Credentials and curricula built for non-engineers who work in, around, or alongside robotic systems.',
    url: '/learn',
  },
  {
    type: 'Page',
    title: 'Robotic Literacy',
    excerpt: 'What robotic literacy means, why it matters, and how The Robot Age approaches it.',
    url: '/robotics-literacy',
  },
  {
    type: 'Page',
    title: 'Summit',
    excerpt: 'A gathering for designers, strategists, and leaders shaping human-robot experience. Coming to New York City.',
    url: '/summit',
  },
  {
    type: 'Page',
    title: 'Enterprise',
    excerpt: 'Deployment readiness education for organizations introducing robots to their workforce.',
    url: '/enterprise',
  },
  {
    type: 'Page',
    title: 'Connect',
    excerpt: 'Get in touch with The Robot Age for research, press, speaking, or general enquiries.',
    url: '/connect',
  },
]

function score(query: string, fields: string[]): number {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  const haystack = fields.join(' ').toLowerCase()
  return terms.reduce((acc, term) => {
    const re = new RegExp(term, 'g')
    return acc + (haystack.match(re) ?? []).length
  }, 0)
}

function titleScore(query: string, title: string): number {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  return terms.reduce((acc, term) => {
    const re = new RegExp(term, 'g')
    return acc + (title.toLowerCase().match(re) ?? []).length * 3
  }, 0)
}

export async function runSearch(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return []

  const newsArticles = getAllNewsArticles()

  const candidates: Array<SearchResult & { _score: number }> = []

  // News markdown articles
  for (const n of newsArticles) {
    const s = titleScore(query, n.title) + score(query, [n.excerpt, n.category])
    if (s > 0) candidates.push({ type: 'News', title: n.title, excerpt: n.excerpt, url: `/news/${n.slug}`, tag: n.category, _score: s })
  }

  // Static articles (research page)
  for (const a of articles) {
    const s = titleScore(query, a.headline) + score(query, [a.body[0], a.category])
    if (s > 0) candidates.push({ type: 'Research', title: a.headline, excerpt: a.body[0], url: `/research/${a.slug}`, tag: a.category, _score: s })
  }

  // Field Signals
  for (const f of fieldSignals) {
    const s = titleScore(query, f.headline) + score(query, [f.body[0], f.refDimension])
    if (s > 0) candidates.push({ type: 'Field Signal', title: f.headline, excerpt: f.body[0], url: `/research/field-signals/${f.slug}`, tag: f.refDimension, _score: s })
  }

  // Certifications
  for (const c of certifications) {
    const moduleText = c.modules.map((m) => `${m.title} ${m.description}`).join(' ')
    const s = titleScore(query, c.name) + score(query, [c.description, c.overview, moduleText])
    if (s > 0) candidates.push({ type: 'Certification', title: c.name, excerpt: c.description, url: `/learn/${c.slug}`, tag: c.abbr, _score: s })
  }

  // Static pages
  for (const p of STATIC_PAGES) {
    const s = titleScore(query, p.title) + score(query, [p.excerpt])
    if (s > 0) candidates.push({ ...p, _score: s })
  }

  return candidates
    .sort((a, b) => b._score - a._score)
    .map(({ _score: _, ...r }) => r)
}
