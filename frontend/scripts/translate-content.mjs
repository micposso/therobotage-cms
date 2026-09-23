#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import ts from 'typescript'
import nextEnv from '@next/env'
import { readSources } from './translation-sources.mjs'
import { MODEL, VERSION, sourceHash, requestBody, parseResponse, translatedMarkdown } from './translation-core.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const value = (name) => args.includes(name) ? args[args.indexOf(name) + 1] : undefined
nextEnv.loadEnvConfig(root)
const model = value('--model') || process.env.OPENAI_TRANSLATION_MODEL || MODEL
const mode = args[0] || 'check'
const cache = path.join(root, '.cache/translations')
const target = (id) => path.join(root, 'translations/es', id)

async function snapshots() {
  for (const [file, name, group] of [['articles', 'articles', 'research'], ['fieldSignals', 'fieldSignals', 'field-signals']]) {
    const code = await fs.readFile(path.join(root, `src/lib/${file}.ts`), 'utf8')
    const js = ts.transpileModule(code, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText
    const data = (await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`))[name]
    const directory = path.join(root, `translations/sources/${group}`)
    await fs.mkdir(directory, { recursive: true })
    for (const entry of data) {
      const { body, ...meta } = entry
      await fs.writeFile(path.join(directory, `${entry.slug}.md`), matter.stringify(body.join('\n\n'), { ...meta, title: entry.headline, excerpt: body[0] }))
    }
    const currentFiles = new Set(data.map((entry) => `${entry.slug}.md`))
    for (const file of await fs.readdir(directory)) {
      if (/^[a-z0-9-]+\.md$/.test(file) && !currentFiles.has(file)) await fs.unlink(path.join(directory, file))
    }
  }
}

async function pending() {
  const results = []
  for (const source of readSources(root)) {
    if (value('--collection') && source.id.split('/')[0] !== value('--collection')) continue
    if (value('--slug') && source.data.slug !== value('--slug')) continue
    let old
    try { old = matter(await fs.readFile(target(source.id), 'utf8')).data.translation } catch (error) { if (error.code !== 'ENOENT') throw error }
    if (old?.sourceHash === sourceHash(source.raw) && old.version === VERSION) continue
    if (old?.reviewed) { console.log(`REVIEW REQUIRED (kept): ${source.id}`); continue }
    results.push(source)
  }
  const limit = Number(value('--limit') || results.length)
  if (!Number.isInteger(limit) || limit < 0) throw new Error('Invalid --limit')
  return results.slice(0, limit)
}

async function api(url, init = {}) {
  if (!process.env.OPENAI_API_KEY) throw new Error('Set OPENAI_API_KEY in frontend/.env.local')
  for (let attempt = 0; attempt < 4; attempt++) {
    const response = await fetch(`https://api.openai.com/v1${url}`, { ...init, headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, ...init.headers }, signal: AbortSignal.timeout(180000) })
    if (response.ok) return response
    if ((response.status === 429 || response.status >= 500) && attempt < 3) { await new Promise((resolve) => setTimeout(resolve, 1500 * 2 ** attempt)); continue }
    throw new Error(`OpenAI request failed (${response.status}); no translation written`)
  }
}

async function save(source, result) {
  const content = translatedMarkdown(source.raw, parseResponse(result), model)
  await fs.mkdir(path.dirname(target(source.id)), { recursive: true })
  const temporary = `${target(source.id)}.tmp`
  await fs.writeFile(temporary, content)
  await fs.rename(temporary, target(source.id))
  console.log(`SAVED ${source.id}`)
}

async function main() {
  if (!['sync', 'check', 'run', 'batch-prepare', 'batch-submit', 'batch-collect'].includes(mode)) throw new Error('Use sync, check, run, batch-prepare, batch-submit, or batch-collect')
  if (value('--locale') && value('--locale') !== 'es') throw new Error('Only Spanish (es) is configured')
  await snapshots()
  const catalog = readSources(root).map((source) => ({ id: source.id, route: source.route, sourceHash: sourceHash(source.raw), expiresAt: source.data.expires_at ? new Date(source.data.expires_at).toISOString() : null }))
  await fs.mkdir(path.join(root, 'translations'), { recursive: true })
  await fs.writeFile(path.join(root, 'translations/catalog.json'), JSON.stringify(catalog, null, 2) + '\n')
  if (mode === 'sync') { console.log('Research source snapshots updated; no API calls made.'); return }
  const sources = await pending()
  if (mode === 'check') {
    console.log(JSON.stringify({ locale: 'es', model, pending: sources.length, sourceCharacters: sources.reduce((sum, s) => sum + s.raw.length, 0), files: sources.map((s) => s.id) }, null, 2))
    return
  }
  if (mode === 'run') {
    let index = 0
    let failed = 0
    await Promise.all(Array.from({ length: Math.min(3, sources.length) }, async () => {
      while (index < sources.length) {
        const source = sources[index++]
        try { await save(source, await (await api('/responses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody(source.raw, model)) })).json()) }
        catch (error) { failed++; console.error(`FAILED ${source.id}: ${error.message}`) }
      }
    }))
    if (failed) throw new Error(`${failed} translations failed. Existing translations were preserved; rerun to retry.`)
    return
  }
  await fs.mkdir(cache, { recursive: true })
  const batchFile = path.join(cache, 'requests.jsonl')
  const manifestFile = path.join(cache, 'manifest.json')
  if (mode === 'batch-prepare') {
    await fs.writeFile(batchFile, sources.map((source, i) => JSON.stringify({ custom_id: `translation-${i}`, method: 'POST', url: '/v1/responses', body: requestBody(source.raw, model) })).join('\n'))
    await fs.writeFile(manifestFile, JSON.stringify({ model, sources: sources.map((s) => ({ id: s.id, hash: sourceHash(s.raw) })) }, null, 2))
    console.log(`Prepared ${sources.length} translations in .cache/translations/requests.jsonl; no API calls made.`)
    return
  }
  if (mode === 'batch-submit') {
    const input = await fs.readFile(batchFile)
    if (!input.length) throw new Error('Batch is empty')
    const form = new FormData()
    form.set('purpose', 'batch')
    form.set('file', new Blob([input], { type: 'application/jsonl' }), 'translations.jsonl')
    const uploaded = await (await api('/files', { method: 'POST', body: form })).json()
    const batch = await (await api('/batches', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ input_file_id: uploaded.id, endpoint: '/v1/responses', completion_window: '24h' }) })).json()
    const manifest = JSON.parse(await fs.readFile(manifestFile, 'utf8'))
    await fs.writeFile(path.join(cache, `${batch.id}.json`), JSON.stringify(manifest))
    console.log(`Submitted ${batch.id}. Collect with npm run translate -- batch-collect --batch ${batch.id}`)
    return
  }
  const id = value('--batch')
  if (!/^batch_[a-zA-Z0-9]+$/.test(id || '')) throw new Error('Provide a valid --batch ID')
  const batch = await (await api(`/batches/${id}`)).json()
  if (!['completed', 'expired', 'cancelled', 'failed'].includes(batch.status)) { console.log(`Batch ${id}: ${batch.status}; run collect again later.`); return }
  if (!batch.output_file_id) throw new Error(`Batch ${batch.status}, no results; inspect the batch in OpenAI before retrying`)
  const manifest = JSON.parse(await fs.readFile(path.join(cache, `${id}.json`), 'utf8'))
  const current = new Map(readSources(root).map((s) => [s.id, s]))
  const output = await (await api(`/files/${batch.output_file_id}/content`)).text()
  let failed = 0
  for (const line of output.trim().split('\n')) {
    try {
      const row = JSON.parse(line)
      const entry = manifest.sources[Number(row.custom_id.replace('translation-', ''))]
      const source = current.get(entry?.id)
      if (!source || sourceHash(source.raw) !== entry.hash) throw new Error('Source changed or was removed since submission')
      let existing
      try { existing = matter(await fs.readFile(target(source.id), 'utf8')).data.translation } catch (error) { if (error.code !== 'ENOENT') throw error }
      if (existing?.reviewed || existing?.sourceHash === entry.hash) continue
      if (row.response?.status_code !== 200) throw new Error(`Request failed: ${source.id}`)
      const content = translatedMarkdown(source.raw, parseResponse(row.response.body), manifest.model)
      await fs.mkdir(path.dirname(target(source.id)), { recursive: true })
      await fs.writeFile(`${target(source.id)}.tmp`, content)
      await fs.rename(`${target(source.id)}.tmp`, target(source.id))
      console.log(`SAVED ${source.id}`)
    } catch (error) { failed++; console.error(error.message) }
  }
  if (failed || batch.request_counts?.failed) throw new Error('Some batch entries failed; run check and prepare a new batch for remaining content')
}

main().catch((error) => { console.error(error.message); process.exitCode = 1 })
