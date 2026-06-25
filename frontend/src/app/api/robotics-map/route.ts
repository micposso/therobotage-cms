import { roboticsMapCompanies, roboticsMapFacets } from '@/lib/robotics-map'

export const dynamic = 'force-static'

export async function GET() {
  return Response.json({
    schemaVersion: '2026-06-25.robotics-market-intelligence.v1',
    updatedAt: '2026-06-25',
    count: roboticsMapCompanies.length,
    facets: roboticsMapFacets,
    companies: roboticsMapCompanies,
  })
}
