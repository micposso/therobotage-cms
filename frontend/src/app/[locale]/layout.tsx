import { notFound } from 'next/navigation'
import SiteDocument, { metadata as baseMetadata } from '@/components/SiteDocument'

export const metadata = { ...baseMetadata, openGraph: { ...baseMetadata.openGraph, locale: 'es_ES' } }
export const dynamicParams = false
export function generateStaticParams() { return [{ locale: 'es' }] }

export default async function Layout({ children, params }: {
  children: React.ReactNode; params: Promise<{ locale: string }>
}) {
  if ((await params).locale !== 'es') notFound()
  return <SiteDocument locale="es">{children}</SiteDocument>
}
