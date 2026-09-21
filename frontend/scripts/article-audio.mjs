#!/usr/bin/env node
// Generate, upload, and register narration for one news article.
// Dry-run is safe without credentials: npm run audio:dry -- --latest
// Publishing requires --project-ref so a production project is never selected by accident.

import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import { createClient } from '@supabase/supabase-js'
import { AUDIO_INSTRUCTIONS, AUDIO_MODEL, AUDIO_VOICE, narrationBlocks, narrationChunks, sourceHash } from './article-audio-core.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const newsDir = path.join(root, 'news')
const manifestPath = path.join(newsDir, 'audio-manifest.json')
const bucket = 'article-audio'
const args = process.argv.slice(2)

function value(flag) {
  const i = args.indexOf(flag)
  return i < 0 ? undefined : args[i + 1]
}

async function loadEnv() {
  const envFiles = [
    path.join(root, '.env.local'),
    path.join(root, '.env'),
    path.join(root, '..', '.env.local'),
    path.join(root, '..', '.env'),
  ]
  for (const envFile of envFiles) {
    let raw
    try { raw = await fs.readFile(envFile, 'utf8') } catch { continue }
    for (const line of raw.split('\n')) {
      const match = line.match(/^\s*([A-Z][A-Z0-9_]*)=(.*)$/)
      if (!match || process.env[match[1]] !== undefined) continue
      let entry = match[2].trim()
      if ((entry.startsWith('"') && entry.endsWith('"')) || (entry.startsWith("'") && entry.endsWith("'"))) entry = entry.slice(1, -1)
      process.env[match[1]] = entry
    }
  }
}

async function articles() {
  const files = (await fs.readdir(newsDir)).filter((name) => name.endsWith('.md') && !name.startsWith('_'))
  return Promise.all(files.map(async (name) => {
    const raw = await fs.readFile(path.join(newsDir, name), 'utf8')
    const { data, content } = matter(raw)
    return { name, raw, data, content }
  }))
}

async function loadManifest() {
  try { return JSON.parse(await fs.readFile(manifestPath, 'utf8')) } catch (error) {
    if (error.code === 'ENOENT') return {}
    throw error
  }
}

async function generatePcm(chunks, key) {
  const pcm = []
  for (let index = 0; index < chunks.length; index++) {
    console.log(`Generating segment ${index + 1}/${chunks.length}`)
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: AUDIO_MODEL, voice: AUDIO_VOICE, instructions: AUDIO_INSTRUCTIONS, input: chunks[index], response_format: 'pcm' }),
    })
    if (!response.ok) throw new Error(`OpenAI speech request failed (${response.status}): ${await response.text()}`)
    const bytes = Buffer.from(await response.arrayBuffer())
    if (!bytes.length) throw new Error(`OpenAI returned empty audio for segment ${index + 1}`)
    pcm.push(bytes)
  }
  return Buffer.concat(pcm)
}

async function encodeMp3(pcm) {
  const { default: ffmpegInstaller } = await import('@ffmpeg-installer/ffmpeg')
  const ffmpeg = ffmpegInstaller.path
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'article-audio-'))
  const input = path.join(temp, 'speech.pcm')
  const output = path.join(temp, 'speech.mp3')
  try {
    await fs.writeFile(input, pcm)
    const result = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-f', 's16le', '-ar', '24000', '-ac', '1', '-i', input, '-codec:a', 'libmp3lame', '-b:a', '64k', output], { encoding: 'utf8' })
    if (result.error || result.status !== 0) throw new Error(`MP3 encoding failed: ${result.error?.message ?? result.stderr}`)
    const mp3 = await fs.readFile(output)
    if (!mp3.length) throw new Error('MP3 encoder returned an empty file')
    return mp3
  } finally {
    await fs.rm(temp, { recursive: true, force: true })
  }
}

async function main() {
  await loadEnv()
  const dryRun = args.includes('--dry-run')
  const slug = value('--slug')
  if (!slug && !args.includes('--latest')) throw new Error('Specify --slug <slug> or --latest')
  if (slug && args.includes('--latest')) throw new Error('Choose --slug or --latest, not both')
  const all = await articles()
  const article = slug
    ? all.find((entry) => entry.data.slug === slug)
    : all.sort((a, b) => new Date(b.data.date) - new Date(a.data.date))[0]
  if (!article) throw new Error('Article not found')
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.data.slug)) throw new Error('Article slug is unsafe for a storage path')

  const blocks = narrationBlocks(article.data.title, article.content)
  const chunks = narrationChunks(blocks)
  const hash = sourceHash(article.raw)
  const settingsHash = sourceHash(`${AUDIO_MODEL}\n${AUDIO_VOICE}\n${AUDIO_INSTRUCTIONS}`).slice(0, 12)
  const objectPath = `news/${article.data.slug}/${hash.slice(0, 16)}-${settingsHash}.mp3`
  const manifest = await loadManifest()
  console.log(JSON.stringify({ slug: article.data.slug, title: article.data.title, characters: blocks.join('\n\n').length, segments: chunks.length, sourceHash: hash, objectPath, current: manifest[article.data.slug]?.path === objectPath }, null, 2))
  if (args.includes('--show-text')) console.log(`\n${blocks.join('\n\n')}\n`)
  if (dryRun) return

  const expectedRef = value('--project-ref')
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const actualRef = supabaseUrl && new URL(supabaseUrl).hostname.match(/^([a-z0-9]+)\.supabase\.co$/)?.[1]
  if (!expectedRef || !actualRef || expectedRef !== actualRef) throw new Error('Pass --project-ref matching NEXT_PUBLIC_SUPABASE_URL for the intended staging project')
  if (!process.env.OPENAI_API_KEY || !process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('OPENAI_API_KEY and SUPABASE_SERVICE_ROLE_KEY are required in the local/CI environment')

  const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })
  const { data: existingBucket, error: bucketError } = await supabase.storage.getBucket(bucket)
  if (bucketError && String(bucketError.statusCode) !== '404') throw bucketError
  if (!existingBucket) {
    const { error } = await supabase.storage.createBucket(bucket, { public: true, allowedMimeTypes: ['audio/mpeg'] })
    if (error) throw error
  } else if (!existingBucket.public) {
    throw new Error(`${bucket} exists but is private; refusing to change its permissions`)
  }

  const publicUrl = supabase.storage.from(bucket).getPublicUrl(objectPath).data.publicUrl
  let verified = false
  if (manifest[article.data.slug]?.path === objectPath) {
    const response = await fetch(publicUrl, { method: 'HEAD' })
    verified = response.ok && response.headers.get('content-type')?.includes('audio/')
  }
  if (!verified) {
    const pcm = await generatePcm(chunks, process.env.OPENAI_API_KEY)
    const mp3 = await encodeMp3(pcm)
    const { error } = await supabase.storage.from(bucket).upload(objectPath, mp3, { contentType: 'audio/mpeg', cacheControl: '31536000', upsert: false })
    if (error && error.statusCode !== '409') throw error
    console.log(`Uploaded ${mp3.length} bytes`)
  }
  const check = await fetch(publicUrl, { headers: { Range: 'bytes=0-1023' } })
  if (check.status !== 206 || !check.headers.get('content-type')?.includes('audio/')) throw new Error(`Uploaded audio did not pass the public playback/range check (${check.status})`)
  await check.arrayBuffer()

  manifest[article.data.slug] = { path: objectPath, sourceHash: hash, model: AUDIO_MODEL, voice: AUDIO_VOICE }
  const tempManifest = `${manifestPath}.tmp`
  await fs.writeFile(tempManifest, `${JSON.stringify(manifest, null, 2)}\n`)
  await fs.rename(tempManifest, manifestPath)
  console.log(`Published ${publicUrl}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
