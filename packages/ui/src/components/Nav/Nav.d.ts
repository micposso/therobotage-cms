import { FC } from 'react'

export interface NavCta {
  label: string
  href: string
}

export interface NavProps {
  pinned?: boolean
  baseUrl?: string
  cta?: NavCta | null
}

declare const Nav: FC<NavProps>
export default Nav
