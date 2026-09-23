import { uiText } from '@/lib/i18n/messages'
import { contentHref } from '@/lib/i18n/localize'
import type { Locale } from '@/lib/i18n/routing'
import Link from 'next/link'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import { runSearch } from '@/lib/searchIndex'
import styles from './page.module.css'
import { translationAlternates } from '@/lib/i18n/content'

export function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  return searchParams.then(({ q }) => ({
    title: q ? `"${q}" — Search` : 'Search',
    description: 'Search articles, research, certifications, and pages on The Robot Age.',
    robots: { index: false, follow: true },
    alternates: { canonical: '/search', languages: translationAlternates('/search') },
  }))
}

export default async function SearchPage({
  searchParams, params,
}: {
  searchParams: Promise<{ q?: string }>
  params: Promise<{ locale?: Locale }>
}) {
  const { locale = 'en' } = await params
  const t = (text: string) => uiText(text, locale)
  const { q } = await searchParams
  const query = q?.trim() ?? ''
  const results = await runSearch(query, locale)

  return (
    <>
      <Nav pinned />

      <main className={styles.page}>
        <div className="container-fluid">

          {/* ── Header ── */}
          <header className={styles.header}>
            <p className={styles.eyebrow}>{t("Search")}</p>
            {query ? (
              <h1 className={styles.title}>
                {results.length > 0
                  ? <>{t("Results for ")}<em className={styles.queryEmphasis}>{query}</em></>
                  : <>{t("No results for ")}<em className={styles.queryEmphasis}>{query}</em></>
                }
              </h1>
            ) : (
              <h1 className={styles.title}>{t("What are you looking for?")}</h1>
            )}
            {query && results.length > 0 && (
              <p className={styles.count}>{results.length}{t(" result")}{results.length !== 1 ? 's' : ''}</p>
            )}
          </header>

          {/* ── Search form (re-search) ── */}
          <form action={contentHref("/search", locale)} method="get" className={styles.form}>
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder={t("Search articles, research, certifications…")}
              autoFocus={!query}
              className={styles.input}
              aria-label={t("Search query")}
            />
            <button type="submit" className={styles.submitBtn} aria-label={t("Search")}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 12l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </form>

          {/* ── Results ── */}
          {query && results.length === 0 && (
            <section className={styles.emptyState}>
              <p className={styles.emptyBody}>{t("Nothing matched that search. Try a different keyword — or browse")}<Link href="/research" className={styles.emptyLink}>{t("Research")}</Link>, <Link href="/learn" className={styles.emptyLink}>{t("Learn")}</Link>{t(", or ")}<Link href="/rxd" className={styles.emptyLink}>{t("RXD")}</Link>.
              </p>
            </section>
          )}

          {results.length > 0 && (
            <section className={styles.results}>
              {results.map((result, i) => (
                <a key={i} href={contentHref(result.url, locale)} className={styles.result}>
                  <div className={styles.resultMeta}>
                    <span className={styles.resultType}>{result.type}</span>
                    {result.tag && <span className={styles.resultTag}>{result.tag}</span>}
                  </div>
                  <h2 className={styles.resultTitle}>{result.title}</h2>
                  <p className={styles.resultExcerpt}>{result.excerpt}</p>
                </a>
              ))}
            </section>
          )}

        </div>
      </main>

      <Footer />
    </>
  )
}
