import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://therobotage.com'
  const lastModified = new Date()

  return [
    { url: base,                             lastModified, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/robotics-literacy`,      lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/learn`,                  lastModified, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/research`,               lastModified, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/summit`,                 lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/enterprise`,             lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/connect`,                lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/access`,                 lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/privacy`,                lastModified, changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${base}/terms`,                  lastModified, changeFrequency: 'yearly',  priority: 0.2 },
  ]
}
