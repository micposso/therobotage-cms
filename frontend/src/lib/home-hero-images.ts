import fs from 'node:fs'
import path from 'node:path'
import { imageUrl } from './image-assets'

export function getHomeHeroImages(): string[] {
  const dir = path.join(process.cwd(), 'public', 'images')
  return fs.readdirSync(dir)
    .filter(file => /\.(png|jpe?g|webp)$/i.test(file))
    .map(file => imageUrl(`/images/${file}`))
}
