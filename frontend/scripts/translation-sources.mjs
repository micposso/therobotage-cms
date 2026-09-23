import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

export function readSources(root) {
  const sources = []
  // Literal directory scopes keep Next's file tracer out of the repository root.
  const directories = [
    ['news', path.join(root, 'news')],
    ['robots-profiles', path.join(root, 'robots-profiles')],
    ['robots', path.join(root, 'robots')],
    ['jobs', path.join(root, 'jobs')],
    ['src/content/scores', path.join(root, 'src/content/scores')],
    ['translations/sources/research', path.join(root, 'translations/sources/research')],
    ['translations/sources/field-signals', path.join(root, 'translations/sources/field-signals')],
    ['translations/sources/pages', path.join(root, 'translations/sources/pages')],
    ['translations/sources/ui', path.join(root, 'translations/sources/ui')],
  ]
  for (const [collection, directory] of directories) {
    if (!fs.existsSync(/* turbopackIgnore: true */ directory)) continue
    for (const file of fs.readdirSync(/* turbopackIgnore: true */ directory).sort()) {
      if (!file.endsWith('.md') || file.startsWith('_') || file.startsWith('sample-')) continue
      const raw = fs.readFileSync(/* turbopackIgnore: true */ path.join(directory, file), 'utf8')
      const { data } = matter(raw)
      const slug = data.slug || file.slice(0, -3)
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Unsafe slug in ${collection}/${file}`)
      if (collection === 'jobs' && ((data.status && data.status !== 'published') || new Date(data.expires_at) <= new Date())) continue
      const group = collection.split('/').at(-1)
      const route = group === 'news' ? `/news/${slug}`
        : group === 'robots-profiles' ? `/robots/${slug}`
        : group === 'jobs' ? `/jobs/${slug}`
        : group === 'research' ? `/research/${slug}`
        : group === 'field-signals' ? `/research/field-signals/${slug}`
        : group === 'pages' ? String(data.route || '') : ''
      sources.push({ id: `${group}/${file}`, file: `${collection}/${file}`, raw, data, route })
    }
  }
  return sources
}
