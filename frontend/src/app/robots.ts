import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Default: allow all crawlers, block internal API and test routes
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
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
