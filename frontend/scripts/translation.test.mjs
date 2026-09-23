import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
import matter from 'gray-matter'
import { sourceHash, translationInput, validateTranslation, translatedMarkdown, parseResponse } from './translation-core.mjs'
import { readSources } from './translation-sources.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const code = fs.readFileSync(path.join(root, 'src/lib/i18n/routing.ts'), 'utf8')
const js = ts.transpileModule(code, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
const { localizedHref, englishPath, isLocale } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`)

test('language routes retain queries/fragments and never rewrite external or asset links', () => {
  assert.equal(localizedHref('/news/example?q=a%20b#section', 'es'), '/es/news/example?q=a%20b#section')
  assert.equal(localizedHref('/es/news/example?q=x#section', 'en'), '/news/example?q=x#section')
  assert.equal(localizedHref('/', 'es'), '/es')
  assert.equal(localizedHref('/es', 'en'), '/')
  for (const href of ['https://example.com', '//example.com', '/images/robot.jpg', '/api/jobs', '#section']) assert.equal(localizedHref(href, 'es'), href)
  assert.equal(englishPath('/research'), '/research')
  assert.equal(englishPath('/essential'), '/essential')
  assert.equal(isLocale('__proto__'), false)
})

const raw = '---\nslug: example\ntitle: Hello\ndate: June 1, 2026\nimage: /image.png\ncompositeScore: 4.5\ngallery:\n  - src: /robot.png\n    alt: A robot\n---\n## Heading\n\n[Source](https://example.com)\n\n`const a = 1`\n'
const result = { fields: { title: 'Hola', 'gallery.0.alt': 'Un robot' }, body: '## Título\n\n[Fuente](https://example.com)\n\n`const a = 1`\n' }

test('translates allowed fields while preserving IDs, numeric data and paths', () => {
  const output = matter(translatedMarkdown(raw, result))
  assert.equal(output.data.slug, 'example')
  assert.equal(output.data.title, 'Hola')
  assert.equal(output.data.compositeScore, 4.5)
  assert.equal(output.data.gallery[0].src, '/robot.png')
  assert.equal(output.data.gallery[0].alt, 'Un robot')
  assert.equal(output.data.translation.sourceHash, sourceHash(raw))
  assert.equal(sourceHash(raw), sourceHash(raw.replace(/\n/g, '\r\n')))
})

test('rejects broken links, changed code, missing fields and blank output', () => {
  assert.throws(() => validateTranslation(raw, { ...result, body: result.body.replace('https://example.com', 'https://evil.example') }))
  assert.throws(() => validateTranslation(raw, { ...result, body: result.body.replace('a = 1', 'a = 2') }))
  assert.throws(() => validateTranslation(raw, { ...result, fields: {} }))
  assert.throws(() => validateTranslation(raw, { ...result, body: '' }))
})

test('HTML translations may translate prose/alt text, but cannot inject scripts or alter attributes', () => {
  const source = '<aside class="spec"><img src="/robot.jpg" alt="Robot" /><p>Hello</p></aside>'
  assert.doesNotThrow(() => validateTranslation(source, { fields: {}, body: '<aside class="spec"><img src="/robot.jpg" alt="Robot español" /><p>Hola</p></aside>' }))
  assert.throws(() => validateTranslation(source, { fields: {}, body: '<script>alert(1)</script>' }))
  assert.throws(() => validateTranslation(source, { fields: {}, body: source.replace('/robot.jpg', '/other.jpg') }))
})

test('refusals and truncated API responses cannot become published content', () => {
  assert.throws(() => parseResponse({ status: 'incomplete', output: [] }))
  assert.throws(() => parseResponse({ status: 'completed', output: [{ content: [{ type: 'refusal' }] }] }))
})

test('every saved translation still matches the source and preserves protected content', () => {
  for (const source of readSources(root)) {
    const filename = path.join(root, 'translations/es', source.id)
    if (!fs.existsSync(filename)) continue
    const translated = fs.readFileSync(filename, 'utf8')
    const parsed = matter(translated)
    assert.equal(parsed.data.translation.sourceHash, sourceHash(source.raw), source.id)
    assert.doesNotThrow(() => validateTranslation(source.raw, translationInput(translated)), source.id)
  }
})

test('the build catalog exactly matches current source IDs, routes and hashes', () => {
  const catalog = JSON.parse(fs.readFileSync(path.join(root, 'translations/catalog.json'), 'utf8'))
  const sources = readSources(root)
  assert.deepEqual(catalog.map((entry) => entry.id), sources.map((source) => source.id))
  for (const source of sources) {
    const entry = catalog.find((item) => item.id === source.id)
    assert.equal(entry.sourceHash, sourceHash(source.raw), source.id)
    assert.equal(entry.route, source.route, source.id)
  }
})

test('Robot Literacy framework and application copy have saved Spanish translations', async () => {
  const source = fs.readFileSync(path.join(root, 'src/app/(english)/robot-literacy/framework-content.ts'), 'utf8')
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
  const { framework, applications, definition } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)
  const saved = JSON.parse(fs.readFileSync(path.join(root, 'src/lib/i18n/ui-es.json'), 'utf8'))
  const strings = [definition]
  for (const area of framework) strings.push(area.title, area.scale, area.description, ...area.headerQuestions, ...area.topics)
  for (const item of applications) strings.push(item.audience, item.title, item.description, item.cta, ...item.questions)
  for (const text of strings) assert.ok(saved[text]?.trim(), `Missing Spanish copy: ${text}`)
})

test('Learn course content, form options and required-field errors have Spanish copy', async () => {
  const saved = JSON.parse(fs.readFileSync(path.join(root, 'src/lib/i18n/ui-es.json'), 'utf8'))
  const load = async file => {
    const source = fs.readFileSync(file, 'utf8')
    const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
    return import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)
  }
  const { certifications } = await load(path.join(root, '../packages/ui/src/lib/certifications.ts'))
  function check(value, key) {
    if (['slug', 'abbr', 'number'].includes(key)) return
    if (typeof value === 'string' && /[a-zA-Z]/.test(value)) assert.ok(saved[value.trim()]?.trim(), `Missing Spanish copy: ${value}`)
    else if (Array.isArray(value)) value.forEach(item => check(item))
    else if (value && typeof value === 'object') Object.entries(value).forEach(([key, item]) => check(item, key))
  }
  check(certifications)
  for (const [file, fields, validate] of [
    ['liveRobotLab', 'labFields', 'validateLabRequest'],
    ['robotLiteracyPartners', 'partnerFields', 'validateRobotLiteracyPartnerRequest'],
  ]) {
    const module = await load(path.join(root, `src/lib/${file}.ts`))
    for (const field of module[fields]) { check(field.label); check(field.options) }
    check(Object.values(module[validate](new FormData())))
  }
  for (const [source, translated] of Object.entries(saved)) {
    const tokens = text => (text.match(/\{[a-zA-Z]+\}/g) || []).sort()
    assert.deepEqual(tokens(translated), tokens(source), `Preserves placeholders: ${source}`)
  }
})
