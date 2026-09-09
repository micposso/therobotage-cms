import { FC } from 'react'

declare const LearnMenu: FC<{
  baseUrl?: string
  inline?: boolean
  triggerClassName?: string
  onNavigate?: () => void
}>
export default LearnMenu
