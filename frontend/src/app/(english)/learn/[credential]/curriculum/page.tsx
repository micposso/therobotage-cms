import { notFound, permanentRedirect } from 'next/navigation'
import { contentHref } from '@/lib/i18n/localize'
import type { Locale } from '@/lib/i18n/routing'
import { getCertificationBySlug, getAllCertificationSlugs, legacyCredentialSlugs, isLegacyCredential } from '@/lib/certifications'
export { generateMetadata } from '../page'

export async function generateStaticParams() {
  return [...getAllCertificationSlugs(), ...legacyCredentialSlugs].map((credential) => ({ credential }))
}

export default async function CurriculumPage({ params }: { params: Promise<{ credential: string; locale?: Locale }> }) {
  const { credential, locale = 'en' } = await params
  if (isLegacyCredential(credential)) permanentRedirect(contentHref(`/learn/${credential}`, locale))
  if (!getCertificationBySlug(credential)) notFound()
  return permanentRedirect(contentHref(`/learn/${credential}#curriculum`, locale))
}
