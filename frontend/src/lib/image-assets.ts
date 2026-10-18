import assets from './image-assets.json'
import type { StaticImageData } from 'next/image'

/** Resolve owned public assets to verified, content-versioned R2 objects. */
export function imageUrl(source: string): string {
  return (assets as Record<string, string>)[source] ?? source
}

/** Keep static dimensions/blur placeholders while loading the original from R2. */
export function imageAsset(source: string, metadata: StaticImageData): StaticImageData {
  return { ...metadata, src: imageUrl(source) }
}

/** Markdown images do not pass through next/image. Resolve them and lazy-load. */
export function imageHtml(html: string): string {
  return html.replace(/<img\b[^>]*>/gi, tag => {
    let result = tag.replace(/\bsrc=(['"])(.*?)\1/i, (_, quote, src) => `src=${quote}${imageUrl(src)}${quote}`)
    if (!/\bloading=/i.test(result)) result = result.replace('<img', '<img loading="lazy"')
    if (!/\bdecoding=/i.test(result)) result = result.replace('<img', '<img decoding="async"')
    return result
  })
}
