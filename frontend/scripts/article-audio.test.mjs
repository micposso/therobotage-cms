import assert from 'node:assert/strict'
import test from 'node:test'
import { AUDIO_INSTRUCTIONS, narrationInstructions, translatedNarration, narrationBlocks, narrationChunks, sourceHash } from './article-audio-core.mjs'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import ts from 'typescript'

test('narration keeps spoken text but omits URLs, images, and HTML', () => {
  const blocks = narrationBlocks('A title', '## The section\n\nA [linked phrase](https://example.com) and **emphasis**.\n\n![A picture](/a.jpg)\n\n<div>Embed</div>\n\n*Header and card images: Credit.*')
  assert.deepEqual(blocks, ['A title', 'The section', 'A linked phrase and emphasis.'])
})

test('long articles split into safe speech requests', () => {
  const chunks = narrationChunks(['A title', 'A sentence. '.repeat(1000)], 100)
  assert.ok(chunks.length > 1)
  assert.ok(chunks.every((chunk) => chunk.length <= 100))
  assert.equal((chunks.join(' ').match(/A sentence\./g) ?? []).length, 1000)
})

test('source hash changes when article text changes', () => {
  assert.notEqual(sourceHash('before'), sourceHash('after'))
})

test('source hash is stable across Windows and Linux checkouts', () => {
  assert.equal(sourceHash('Title\r\n\r\nArticle text\r\n'), sourceHash('Title\n\nArticle text\n'))
})

test('Spanish narration uses the current translated text and neutral Latin American instructions', () => {
  const source = '---\nslug: example\n---\nEnglish copy'
  const translated = `---\nslug: example\ntranslation:\n  locale: es\n  sourceHash: ${sourceHash(source)}\n---\nSimulaci\u00f3n rob\u00f3tica`
  assert.equal(translatedNarration(source, translated).content.trim(), 'Simulaci\u00f3n rob\u00f3tica')
  assert.throws(() => translatedNarration(source + ' changed', translated), /stale/)
  assert.throws(() => translatedNarration(source, translated.replace('slug: example', 'slug: other')), /slug/)
  assert.equal(narrationInstructions('en'), AUDIO_INSTRUCTIONS)
  assert.match(narrationInstructions('es'), /neutral South American \/ Latin American accent/)
  assert.match(narrationInstructions('es'), /seseo/)
  assert.throws(() => narrationInstructions('fr'), /Supported/)
})

test('audio lookup isolates locales, hides stale audio and keeps the production gate', async () => {
  const originalCwd = process.cwd()
  const originalGate = process.env.SITE_NOINDEX
  const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'audio-lookup-'))
  try {
    const filename = new URL('../src/lib/news.ts', import.meta.url)
    const source = fs.readFileSync(filename, 'utf8').replace(/import \{ imageUrl, imageHtml \} from '\.\/image-assets'/, 'const imageUrl = (s: string) => s; const imageHtml = (s: string) => s;')
    let js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
    for (const name of ['gray-matter', 'marked']) js = js.replace(`from '${name}'`, `from '${import.meta.resolve(name)}'`)
    fs.mkdirSync(path.join(temp, 'news'))
    process.chdir(temp)
    process.env.SITE_NOINDEX = 'true'
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    const { getAudioUrl } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`)
    const manifest = { example: { path: 'news/example/abc-123.mp3', sourceHash: sourceHash('English') }, 'es/example': { path: 'news/es/example/def-456.mp3', sourceHash: sourceHash('Spanish') } }
    const save = () => fs.writeFileSync(path.join(temp, 'news/audio-manifest.json'), JSON.stringify(manifest))
    save()
    assert.match(getAudioUrl('example', 'English'), /news\/example\/abc-123.mp3$/)
    assert.match(getAudioUrl('example', 'Spanish', 'es'), /news\/es\/example\/def-456.mp3$/)
    assert.equal(getAudioUrl('example', 'changed Spanish', 'es'), undefined)
    manifest['es/example'].path = manifest.example.path
    save()
    assert.equal(getAudioUrl('example', 'Spanish', 'es'), undefined)
    delete manifest['es/example']
    save()
    assert.equal(getAudioUrl('example', 'English', 'es'), undefined)
    process.env.SITE_NOINDEX = 'false'
    assert.equal(getAudioUrl('example', 'English'), undefined)
  } finally {
    process.chdir(originalCwd)
    if (originalGate === undefined) delete process.env.SITE_NOINDEX; else process.env.SITE_NOINDEX = originalGate
    if (originalUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL; else process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl
    fs.rmSync(temp, { recursive: true, force: true })
  }
})
