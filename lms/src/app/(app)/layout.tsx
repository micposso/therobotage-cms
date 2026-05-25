import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LMSNav from '@/components/LMSNav/LMSNav'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/signin')

  const name = user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email ?? ''

  return (
    <>
      <LMSNav userName={name} />
      <main style={{ paddingTop: 'var(--nav-height)' }}>{children}</main>
    </>
  )
}
