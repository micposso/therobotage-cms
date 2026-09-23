import test from 'node:test'
import assert from 'node:assert/strict'

// Run against a production server with TRANSLATION_TEST_URL=http://localhost:3000.
const base = process.env.TRANSLATION_TEST_URL
const routes = ['/learn', '/live-robot-lab', '/robot-literacy/partners', '/access', ...['rep', 'rpdp', 'rsp', 'rxr'].flatMap(slug => [`/learn/${slug}`, `/learn/${slug}/curriculum`]), '/', '/robot-literacy', '/research', '/robots', '/robots/reachy-mini', '/jobs', '/jobs/product-design-engineer-all-levels-skydio', '/research/the-familiar-hri-design-brief', '/research/field-signals/recovery-design-gap']
function structure(html) {
  return [...html.matchAll(/<(section|article|aside)\b[^>]*class="([^"]*)"/g)]
    .filter(([, , classes]) => !classes.includes('audioPlayer'))
    .map(([, tag, classes]) => [tag, classes])
}
for (const route of routes) {
  test(`Spanish preserves the rendered page structure: ${route}`, { skip: !base }, async () => {
    const english = await fetch(`${base}${route}?lang=en`)
    const spanish = await fetch(`${base}/es${route === '/' ? '' : route}`)
    assert.equal(english.status, 200)
    assert.equal(spanish.status, 200)
    const en = await english.text()
    const es = await spanish.text()
    assert.match(es, /<html[^>]*lang="es"/)
    assert.deepEqual(structure(es), structure(en))
    assert.ok(structure(es).length > 0)
    if (route === '/') {
      assert.match(es, /Robots para todos\./)
      assert.match(es, /HeroHomepage/)
      assert.match(es, /Certification/)
      assert.match(es, /Summit/)
    }
    if (route === '/robot-literacy') {
      assert.ok(es.includes('Alfabetización robótica'), 'Spanish page title is present')
      for (const anchor of ['framework', 'read', 'relate', 'coexist', 'inquiry']) {
        assert.ok(es.includes(`id="${anchor}"`), `Preserves the ${anchor} anchor`)
      }
      assert.ok(es.includes('href="https://therobotage.com/es/robot-literacy"'), 'Spanish canonical URL is present')
      assert.ok(es.includes('hrefLang="en"'), 'English alternate is present')
    }
    // The job filter subtree uses useSearchParams and hydrates inside Suspense;
    // filter behavior and localized card links are checked in the browser.
  })
}
