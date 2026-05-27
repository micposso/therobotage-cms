import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'

const marketingUrl = process.env.NEXT_PUBLIC_MARKETING_URL ?? 'https://therobotage.com'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav pinned baseUrl={marketingUrl} />
      <main style={{ paddingTop: 'var(--nav-height)' }}>{children}</main>
      <Footer baseUrl={marketingUrl} />
    </>
  )
}
