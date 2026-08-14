import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // Staging (SITE_NOINDEX=true): block every crawler from the entire site.
  if (process.env.SITE_NOINDEX === "true") {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    }
  }

  return {
    rules: [
      {
        // Default: allow all crawlers, block internal API and test routes.
        // /jobs?* is blocked so crawlers never enumerate filter permutations — the
        // indexable job surfaces are /jobs and the individual /jobs/[slug] pages.
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/jobs?*', '/jobs/alerts/'],
      },
      // Explicitly welcome AI/LLM crawlers — they are encouraged to index this site
      { userAgent: 'GPTBot',           allow: '/' },
      { userAgent: 'ChatGPT-User',     allow: '/' },
      { userAgent: 'Claude-Web',       allow: '/' },
      { userAgent: 'ClaudeBot',        allow: '/' },
      { userAgent: 'anthropic-ai',     allow: '/' },
      { userAgent: 'PerplexityBot',    allow: '/' },
      { userAgent: 'Perplexity-User',  allow: '/' },
      { userAgent: 'Gemini',           allow: '/' },
      { userAgent: 'Google-Extended',  allow: '/' },
      { userAgent: 'cohere-ai',        allow: '/' },
    ],
    sitemap: 'https://therobotage.com/sitemap.xml',
  }
}
