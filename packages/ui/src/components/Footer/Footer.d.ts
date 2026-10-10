import { FC } from 'react'

export interface FooterProps {
  baseUrl?: string
  programs?: import('../../lib/certifications').Certification[]
  translate?: (text: string) => string
  resolveHref?: (href: string) => string
}

declare const Footer: FC<FooterProps>
export default Footer
