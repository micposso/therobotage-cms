import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const directory = path.join(root, 'public/logos')
const records = JSON.parse(await readFile(path.join(directory, 'sources.json'), 'utf8'))
const cells = []
for (const [index, record] of records.entries()) {
  if (!record.original) continue
  const original = path.join(root, 'public', record.rasterOriginal || record.original)
  const content = await sharp(original, { density: 180 }).resize(42, 42, { fit: 'inside' }).png().toBuffer()
  const stats = await sharp(content).stats()
  const dark = !stats.isOpaque && stats.channels.slice(0, 3).every(channel => channel.mean > 205)
  const png = await sharp({ create: { width: 50, height: 50, channels: 4, background: dark ? '#232522' : '#ffffff' } })
    .composite([{ input: content, gravity: 'centre' }]).png().toBuffer()
  await writeFile(path.join(directory, `${record.id}.png`), png)
  record.logo = `/logos/${record.id}.png`
  record.width = 50
  record.height = 50
  delete record.candidates
  const x = (index % 8) * 130
  const y = Math.floor(index / 8) * 110
  cells.push({ input: png, left: x + 40, top: y + 10 })
  const label = Buffer.from(`<svg width="130" height="30"><text x="65" y="20" text-anchor="middle" font-family="Arial" font-size="12">${record.id}</text></svg>`)
  cells.push({ input: label, left: x, top: y + 65 })
}
await writeFile(path.join(directory, 'sources.json'), JSON.stringify(records, null, 2) + '\n')
await mkdir(path.join(root, '../output/metro-logo-research'), { recursive: true })
await sharp({ create: { width: 1040, height: 660, channels: 4, background: '#eaeaea' } }).composite(cells).png().toFile(path.join(root, '../output/metro-logo-research/contact-sheet.png'))
console.log(`Prepared ${cells.length / 2} logos at 50 × 50 pixels.`)
