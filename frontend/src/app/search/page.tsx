import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import { runSearch } from '@/lib/searchIndex'
import styles from './page.module.css'

export function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  return searchParams.then(({ q }) => ({
    title: q ? `"${q}" — Search` : 'Search',
    description: 'Search articles, research, certifications, and pages on The Robot Age.',
    robots: { index: false, follow: true },
  }))
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''
  const results = await runSearch(query)

  return (
    <>
      <Nav pinned />

      <main className={styles.page}>
        <div className="container-fluid">

          {/* ── Header ── */}
          <header className={styles.header}>
            <p className={styles.eyebrow}>Search</p>
            {query ? (
              <h1 className={styles.title}>
                {results.length > 0
                  ? <>Results for <em className={styles.queryEmphasis}>{query}</em></>
                  : <>No results for <em className={styles.queryEmphasis}>{query}</em></>
                }
              </h1>
            ) : (
              <h1 className={styles.title}>What are you looking for?</h1>
            )}
            {query && results.length > 0 && (
              <p className={styles.count}>{results.length} result{results.length !== 1 ? 's' : ''}</p>
            )}
          </header>

          {/* ── Search form (re-search) ── */}
          <form action="/search" method="get" className={styles.form}>
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search articles, research, certifications…"
              autoFocus={!query}
              className={styles.input}
              aria-label="Search query"
            />
            <button type="submit" className={styles.submitBtn} aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 12l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </form>

          {/* ── Results ── */}
          {query && results.length === 0 && (
            <section className={styles.emptyState}>
              <p className={styles.emptyBody}>
                Nothing matched that search. Try a different keyword — or browse <a href="/research" className={styles.emptyLink}>Research</a>, <a href="/learn" className={styles.emptyLink}>Learn</a>, or <a href="/rxd" className={styles.emptyLink}>RXD</a>.
              </p>
            </section>
          )}

          {results.length > 0 && (
            <section className={styles.results}>
              {results.map((result, i) => (
                <a key={i} href={result.url} className={styles.result}>
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
