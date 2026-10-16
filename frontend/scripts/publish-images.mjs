import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
try { process.loadEnvFile(path.join(root, '.env.local')) } catch (error) {
  if (error.code !== 'ENOENT') throw error
}
const publish = process.argv.includes('--publish')
const types = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' }
const publicRoot = path.join(root, 'public')
async function discover(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = await Promise.all(entries.map(entry => entry.isDirectory()
    ? discover(path.join(directory, entry.name))
    : types[path.extname(entry.name).toLowerCase()] ? [path.join(directory, entry.name)] : []))
  return files.flat().sort()
}

async function main() {
  const required = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET', 'R2_PUBLIC_BASE_URL']
  if (publish) {
    const missing = required.filter(key => !process.env[key])
    if (missing.length) throw new Error(`Configure ${missing.join(', ')} in frontend/.env.local. No files uploaded.`)
  }
  const base = process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, '')
  if (base && new URL(base).protocol !== 'https:') throw new Error('R2_PUBLIC_BASE_URL must use HTTPS')
  const client = publish ? new S3Client({ region: 'auto', endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`, credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY } }) : null
  const manifest = {}
  let bytes = 0
  for (const file of await discover(publicRoot)) {
    const body = await fs.readFile(file)
    const relative = path.relative(publicRoot, file).split(path.sep).join('/')
    const hash = createHash('sha256').update(body).digest('hex')
    const ext = path.extname(relative)
    const key = `website/${relative.slice(0, -ext.length)}.${hash.slice(0, 16)}${ext}`
    const url = base ? `${base}/${key.split('/').map(encodeURIComponent).join('/')}` : null
    bytes += body.length
    if (client) {
      let exists = false
      try {
        const head = await client.send(new HeadObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key }))
        exists = head.Metadata?.sha256 === hash && head.ContentLength === body.length
      } catch (error) { if (error.$metadata?.httpStatusCode !== 404) throw error }
      if (!exists) await client.send(new PutObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key, Body: body, ContentType: types[ext.toLowerCase()], CacheControl: 'public, max-age=31536000, immutable', Metadata: { sha256: hash } }))
      const response = await fetch(url, { signal: AbortSignal.timeout(30000) })
      if (!response.ok) throw new Error(`Public image verification failed: ${relative} (HTTP ${response.status})`)
      const received = Buffer.from(await response.arrayBuffer())
      if (createHash('sha256').update(received).digest('hex') !== hash) throw new Error(`Public image content mismatch: ${relative}`)
      console.log(`${exists ? 'Verified' : 'Uploaded and verified'} ${relative}`)
    }
    manifest[`/${relative}`] = { url, key, bytes: body.length, sha256: hash }
  }
  const report = path.resolve(root, '../output/r2-image-inventory.json')
  await fs.mkdir(path.dirname(report), { recursive: true })
  await fs.writeFile(report, JSON.stringify({ published: publish, count: Object.keys(manifest).length, bytes, assets: manifest }, null, 2) + '\n')
  // Only write the application mapping after every public object is verified.
  if (publish) {
    const mapping = Object.fromEntries(Object.entries(manifest).map(([source, value]) => [source, value.url]))
    const aliasesPath = path.join(root, 'src/lib/image-source-aliases.json')
    try {
      const aliases = JSON.parse(await fs.readFile(aliasesPath, 'utf8'))
      for (const [source, local] of Object.entries(aliases)) {
        if (!mapping[local]) throw new Error(`Image alias target not published: ${local}`)
        mapping[source] = mapping[local]
      }
    } catch (error) { if (error.code !== 'ENOENT') throw error }
    await fs.writeFile(path.join(root, 'src/lib/image-assets.json'), JSON.stringify(mapping, null, 2) + '\n')
  }
  console.log(`${publish ? 'Published' : 'Dry run'}: ${Object.keys(manifest).length} images, ${(bytes / 1024 / 1024).toFixed(1)} MiB. Report: ${report}`)
}
main().catch(error => { console.error(error.message); process.exitCode = 1 })
