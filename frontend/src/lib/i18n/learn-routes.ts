import { getAllCertificationSlugs } from '@/lib/certifications'

export const learnRoutes = [
  '/learn', '/robot-literacy', '/robot-literacy/partners', '/live-robot-lab', '/access',
  ...getAllCertificationSlugs().flatMap(slug => [`/learn/${slug}`, `/learn/${slug}/curriculum`]),
]
