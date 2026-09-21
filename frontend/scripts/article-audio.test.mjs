import assert from 'node:assert/strict'
import test from 'node:test'
import { narrationBlocks, narrationChunks, sourceHash } from './article-audio-core.mjs'

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
