import type { MetadataRoute } from 'next'
import { getAllNewsArticles } from '@/lib/news'
import { getAllRobots } from '@/lib/robots'
import { articles } from '@/lib/articles'
import { fieldSignals } from '@/lib/fieldSignals'
import { certifications } from '@/lib/certifications'

const BASE = 'https://therobotage.com'

function parseDate(dateStr: string): Date {
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? new Date() : d
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // ── Static pages ──────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                             lastModified: now,  changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/research`,               lastModified: now,  changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/learn`,                  lastModified: now,  changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/rxd`,                    lastModified: now,  changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/robotics-literacy`,      lastModified: now,  changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/summit`,                 lastModified: now,  changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/enterprise`,             lastModified: now,  changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/connect`,                lastModified: now,  changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/access`,                 lastModified: now,  changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/robots`,                 lastModified: now,  changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/privacy`,                lastModified: now,  changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${BASE}/terms`,                  lastModified: now,  changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${BASE}/ai-statement`,           lastModified: now,  changeFrequency: 'yearly',  priority: 0.2 },
  ]

  // ── Certification + curriculum pages ──────────────────────────────────────
  const certPages: MetadataRoute.Sitemap = certifications.flatMap((c) => [
    {
      url: `${BASE}/learn/${c.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE}/learn/${c.slug}/curriculum`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ])

  // ── News articles (markdown) ───────────────────────────────────────────────
  const newsArticles = getAllNewsArticles()
  const newsPages: MetadataRoute.Sitemap = newsArticles.map((a) => ({
    url: `${BASE}/news/${a.slug}`,
    lastModified: parseDate(a.date),
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }))

  // ── Research articles (static) ────────────────────────────────────────────
  const researchPages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE}/research/${a.slug}`,
    lastModified: parseDate(a.date),
    changeFrequency: 'yearly' as const,
    priority: 0.7,
  }))

  // ── Field Signals essays ──────────────────────────────────────────────────
  const fieldSignalPages: MetadataRoute.Sitemap = fieldSignals.map((f) => ({
    url: `${BASE}/research/field-signals/${f.slug}`,
    lastModified: parseDate(f.date),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }))

  // ── Robot profiles (markdown) ─────────────────────────────────────────────
  const robotProfiles = getAllRobots()
  const robotPages: MetadataRoute.Sitemap = robotProfiles.map((r) => ({
    url: `${BASE}/robots/${r.slug}`,
    lastModified: parseDate(r.date),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }))

  return [
    ...staticPages,
    ...certPages,
    ...newsPages,
    ...researchPages,
    ...fieldSignalPages,
    ...robotPages,
  ]
}
