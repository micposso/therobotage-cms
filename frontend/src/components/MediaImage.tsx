import Image, { type ImageProps } from 'next/image'
import { imageUrl } from '@/lib/image-assets'

/** Site images use R2 originals and Next.js responsive optimization. */
export default function MediaImage({ src, loading, ...props }: ImageProps) {
  const resolved = typeof src === 'string' ? imageUrl(src) : src
  return <Image {...props} src={resolved} loading={loading ?? (props.priority || props.preload ? undefined : 'lazy')} />
}
