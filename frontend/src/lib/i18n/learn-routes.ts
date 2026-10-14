import { getAllCertificationSlugs, legacyCredentialSlugs } from '@/lib/certifications'

export const learnRoutes = [
  '/learn', '/robot-literacy', '/robot-literacy/partners', '/live-robot-lab', '/access',
  ...legacyCredentialSlugs.flatMap(slug => [`/learn/${slug}`, `/learn/${slug}/curriculum`]),
  ...getAllCertificationSlugs().flatMap(slug => [`/learn/${slug}`, `/learn/${slug}/curriculum`]),
]
