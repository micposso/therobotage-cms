'use client'

import NavBase from '@therobotage/ui/Nav'

const lmsUrl = process.env.NEXT_PUBLIC_LMS_URL ?? 'https://learn.therobotage.com'

export default function Nav(props) {
  return <NavBase {...props} cta={{ label: 'Sign in →', href: `${lmsUrl}/signin` }} />
}
