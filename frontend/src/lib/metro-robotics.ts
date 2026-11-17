import data from '@/data/metro-robotics.json'

export type MetroCompany = {
  id: string
  name: string
  region: string
  category: string
  specialty: string
  address: string
  status: string
  source: string
  website: string
  note?: string
  locality: string
  borough?: string
  county?: string
  lat: number
  lon: number
}

export const companies: MetroCompany[] = [...data.companies].sort((a, b) => a.name.localeCompare(b.name))
export const categories = data.categories
export const regions = data.scope
export const locations = [...new Set([...regions, ...companies.flatMap(c => [c.locality, c.borough, c.county].filter((s): s is string => Boolean(s)))])].sort()
export const evidenceLabels: Record<string, string> = {
  office: 'Office / facility',
  published: 'Contact / reported address',
  area: 'Approximate area',
}

const normalize = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
const aliases: Record<string, string> = {
  nyc: 'new york city', 'new york city': 'new york city',
  li: 'long island', 'long island': 'long island',
  ct: 'connecticut', connecticut: 'connecticut',
  nj: 'new jersey', 'new jersey': 'new jersey',
}

export function filterCompanies(category: string, location: string, search: string) {
  const cat = normalize(category)
  const loc = normalize(location)
  const query = normalize(search)
  const exactCategory = categories.find(c => normalize(c) === cat)
  return companies.filter(company => {
    const categoryMatch = !cat || (exactCategory
      ? company.category === exactCategory
      : normalize(`${company.category} ${company.specialty}`).includes(cat))
    // Exact region aliases deliberately keep Long Island City in NYC.
    const locationMatch = !loc || (aliases[loc]
      ? normalize(company.region) === aliases[loc]
      : normalize(`${company.region} ${company.locality} ${company.borough ?? ''} ${company.county ?? ''} ${company.address}`).includes(loc))
    return categoryMatch && locationMatch && (!query || normalize(`${company.name} ${company.specialty}`).includes(query))
  })
}
