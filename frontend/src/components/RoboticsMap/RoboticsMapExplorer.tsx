'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import type { RoboticsCompany } from '@/lib/robotics-map'
import styles from './RoboticsMapExplorer.module.css'

type Facets = {
  regions: string[]
  countries: string[]
  companyTypes: string[]
  sectors: string[]
  robotTypes: string[]
  maturity: string[]
  commercialProof: string[]
  ecosystemRoles: string[]
  buyerSectors: string[]
}

type Props = {
  companies: RoboticsCompany[]
  facets: Facets
}

type FilterKey = 'query' | 'region' | 'country' | 'companyType' | 'sector' | 'robotType' | 'maturity' | 'commercialProof' | 'ecosystemRole' | 'buyerSector' | 'founded'

type Filters = Record<FilterKey, string>
type DetailTab = 'overview' | 'products' | 'deployments' | 'funding' | 'sources'

const initialFilters: Filters = {
  query: '',
  region: 'all',
  country: 'all',
  companyType: 'all',
  sector: 'all',
  robotType: 'all',
  maturity: 'all',
  commercialProof: 'all',
  ecosystemRole: 'all',
  buyerSector: 'all',
  founded: 'all',
}

const foundedRanges = [
  { label: 'Any year', value: 'all' },
  { label: 'Before 2010', value: 'before-2010' },
  { label: '2010-2018', value: '2010-2018' },
  { label: '2019+', value: '2019-plus' },
]

const RoboticsLeafletMap = dynamic(() => import('./RoboticsLeafletMap'), {
  ssr: false,
  loading: () => <div className={styles.mapLoading}>Loading map...</div>,
})

const detailTabs: { id: DetailTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'products', label: 'Products' },
  { id: 'deployments', label: 'Deployments' },
  { id: 'funding', label: 'Funding' },
  { id: 'sources', label: 'Sources' },
]

const proofOrder: Record<RoboticsCompany['intelligence']['commercialProof'], number> = {
  Concept: 1,
  Demo: 2,
  Pilot: 3,
  'Paid deployment': 4,
  'Scaled deployment': 5,
  'Public market': 6,
}

function matchesFoundedRange(founded: number | null, range: string) {
  if (range === 'all') return true
  if (!founded) return false
  if (range === 'before-2010') return founded < 2010
  if (range === '2010-2018') return founded >= 2010 && founded <= 2018
  return founded >= 2019
}

function buildHaystack(company: RoboticsCompany) {
  return [
    company.name,
    company.city,
    company.country,
    company.region,
    company.companyType,
    company.status,
    company.funding,
    company.businessModel,
    company.intelligence.maturity,
    company.intelligence.commercialProof,
    company.intelligence.deployments.evidence,
    company.intelligence.sourceNotes,
    ...company.sector,
    ...company.robotTypes,
    ...company.robots,
    ...company.intelligence.ecosystemRoles,
    ...company.intelligence.buyerSectors,
    ...company.intelligence.revenueModel,
    ...company.intelligence.products.flatMap((product) => [
      product.name,
      product.category,
      product.status,
      product.notes,
      ...product.targetUseCases,
      ...product.targetCustomers,
    ]),
  ].join(' ').toLowerCase()
}

function matchesFilters(company: RoboticsCompany, filters: Filters) {
  const query = filters.query.trim().toLowerCase()

  return (
    (!query || buildHaystack(company).includes(query)) &&
    (filters.region === 'all' || company.region === filters.region) &&
    (filters.country === 'all' || company.country === filters.country) &&
    (filters.companyType === 'all' || company.companyType === filters.companyType) &&
    (filters.sector === 'all' || company.sector.includes(filters.sector)) &&
    (filters.robotType === 'all' || company.robotTypes.includes(filters.robotType)) &&
    (filters.maturity === 'all' || company.intelligence.maturity === filters.maturity) &&
    (filters.commercialProof === 'all' || company.intelligence.commercialProof === filters.commercialProof) &&
    (filters.ecosystemRole === 'all' || company.intelligence.ecosystemRoles.includes(filters.ecosystemRole)) &&
    (filters.buyerSector === 'all' || company.intelligence.buyerSectors.includes(filters.buyerSector)) &&
    matchesFoundedRange(company.founded, filters.founded)
  )
}

function getSignalScore(company: RoboticsCompany) {
  return company.intelligence.robotAgeSignal.overall ?? 0
}

function sortBySignal(a: RoboticsCompany, b: RoboticsCompany) {
  return getSignalScore(b) - getSignalScore(a) || proofOrder[b.intelligence.commercialProof] - proofOrder[a.intelligence.commercialProof] || a.name.localeCompare(b.name)
}

function getRegionSummary(companies: RoboticsCompany[]) {
  return Object.entries(
    companies.reduce<Record<string, { count: number; topScore: number }>>((summary, company) => {
      const current = summary[company.region] ?? { count: 0, topScore: 0 }
      summary[company.region] = {
        count: current.count + 1,
        topScore: Math.max(current.topScore, getSignalScore(company)),
      }
      return summary
    }, {}),
  )
    .map(([region, value]) => ({ region, ...value }))
    .sort((a, b) => b.count - a.count || b.topScore - a.topScore)
}

function getProofSummary(companies: RoboticsCompany[]) {
  return companies.reduce<Record<string, number>>((summary, company) => {
    summary[company.intelligence.commercialProof] = (summary[company.intelligence.commercialProof] ?? 0) + 1
    return summary
  }, {})
}

export default function RoboticsMapExplorer({ companies, facets }: Props) {
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [selectedId, setSelectedId] = useState(companies[0]?.id ?? '')
  const [activeTab, setActiveTab] = useState<DetailTab>('overview')

  const filteredCompanies = useMemo(
    () => companies.filter((company) => matchesFilters(company, filters)),
    [companies, filters],
  )

  const selectedCompany = filteredCompanies.find((company) => company.id === selectedId) ?? filteredCompanies[0]
  const leaderboard = useMemo(() => [...filteredCompanies].sort(sortBySignal).slice(0, 6), [filteredCompanies])
  const regionSummary = useMemo(() => getRegionSummary(filteredCompanies), [filteredCompanies])
  const proofSummary = useMemo(() => getProofSummary(filteredCompanies), [filteredCompanies])
  const scaledDeployments = proofSummary['Scaled deployment'] ?? 0
  const paidDeployments = proofSummary['Paid deployment'] ?? 0
  const averageSignal = filteredCompanies.length
    ? Math.round(filteredCompanies.reduce((sum, company) => sum + getSignalScore(company), 0) / filteredCompanies.length)
    : 0

  function updateFilter(key: FilterKey, value: string) {
    const nextFilters = { ...filters, [key]: value }
    setFilters(nextFilters)

    const nextVisible = companies.find((company) => matchesFilters(company, nextFilters))
    setSelectedId(nextVisible?.id ?? '')
  }

  function resetFilters() {
    setFilters(initialFilters)
    setSelectedId(companies[0]?.id ?? '')
  }

  return (
    <section className={styles.explorer} aria-label="Robotics company map explorer">
      <div className={styles.toolbar}>
        <label className={styles.searchLabel}>
          <span>Company, robot, or market</span>
          <input
            type="search"
            value={filters.query}
            onChange={(event) => updateFilter('query', event.target.value)}
            placeholder="Search Unitree, humanoid, logistics..."
            className={styles.searchInput}
          />
        </label>

        <FilterSelect label="Region" value={filters.region} onChange={(value) => updateFilter('region', value)} options={facets.regions} />
        <FilterSelect label="Location" value={filters.country} onChange={(value) => updateFilter('country', value)} options={facets.countries} />
        <FilterSelect label="Company type" value={filters.companyType} onChange={(value) => updateFilter('companyType', value)} options={facets.companyTypes} />
        <FilterSelect label="Sector" value={filters.sector} onChange={(value) => updateFilter('sector', value)} options={facets.sectors} />
        <FilterSelect label="Robot type" value={filters.robotType} onChange={(value) => updateFilter('robotType', value)} options={facets.robotTypes} />
        <FilterSelect label="Maturity" value={filters.maturity} onChange={(value) => updateFilter('maturity', value)} options={facets.maturity} />
        <FilterSelect label="Commercial proof" value={filters.commercialProof} onChange={(value) => updateFilter('commercialProof', value)} options={facets.commercialProof} />
        <FilterSelect label="Ecosystem role" value={filters.ecosystemRole} onChange={(value) => updateFilter('ecosystemRole', value)} options={facets.ecosystemRoles} />
        <FilterSelect label="Buyer sector" value={filters.buyerSector} onChange={(value) => updateFilter('buyerSector', value)} options={facets.buyerSectors} />
        <label className={styles.selectLabel}>
          <span>Founded</span>
          <select value={filters.founded} onChange={(event) => updateFilter('founded', event.target.value)} className={styles.select}>
            {foundedRanges.map((range) => (
              <option key={range.value} value={range.value}>{range.label}</option>
            ))}
          </select>
        </label>

        <button type="button" className={styles.resetButton} onClick={resetFilters}>
          Reset
        </button>
      </div>

      <div className={styles.summaryBar}>
        <span>{filteredCompanies.length} of {companies.length} companies visible</span>
        <span>{paidDeployments + scaledDeployments} with paid or scaled proof</span>
        <span>{averageSignal || 'TBD'} average Robot Age Signal</span>
        <a href="/api/robotics-map" className={styles.apiLink}>Open JSON API</a>
      </div>

      <div className={styles.intelligenceStrip} aria-label="Robotics map intelligence summary">
        <div className={styles.regionDensity}>
          <span className={styles.sectionKicker}>Regional density</span>
          <div className={styles.regionPills}>
            {regionSummary.map((region) => (
              <button
                key={region.region}
                type="button"
                className={filters.region === region.region ? styles.regionPillActive : styles.regionPill}
                onClick={() => updateFilter('region', filters.region === region.region ? 'all' : region.region)}
              >
                <strong>{region.count}</strong>
                <span>{region.region}</span>
                <small>Top {region.topScore || 'TBD'}</small>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.leaderboard}>
          <span className={styles.sectionKicker}>Robot Age leaderboard</span>
          <ol>
            {leaderboard.map((company) => (
              <li key={company.id}>
                <button
                  type="button"
                  className={company.id === selectedCompany?.id ? styles.leaderboardButtonActive : styles.leaderboardButton}
                  onClick={() => setSelectedId(company.id)}
                >
                  <span>{company.name}</span>
                  <strong>{company.intelligence.robotAgeSignal.overall ?? 'TBD'}</strong>
                  <small>{company.intelligence.commercialProof}</small>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className={styles.mapGrid}>
        <div className={styles.mapPanel}>
          <div className={styles.mapLegend} aria-label="Map marker legend">
            <span><i className={styles.legendScaled} />Scaled/public</span>
            <span><i className={styles.legendPaid} />Paid</span>
            <span><i className={styles.legendPilot} />Pilot/demo</span>
          </div>
          {filteredCompanies.length > 0 ? (
            <RoboticsLeafletMap
              companies={filteredCompanies}
              selectedId={selectedCompany?.id ?? ''}
              onSelect={setSelectedId}
            />
          ) : (
            <div className={styles.emptyMap}>No companies match those filters.</div>
          )}
        </div>

        <aside className={styles.detailPanel} aria-live="polite">
          {selectedCompany ? (
            <>
              <div className={styles.detailHeader}>
                <p className={styles.detailEyebrow}>{selectedCompany.city}, {selectedCompany.country}</p>
                <h2 className={styles.detailTitle}>{selectedCompany.name}</h2>
                <p className={styles.detailStatus}>{selectedCompany.status}</p>
              </div>

              <div className={styles.detailTabs} role="tablist" aria-label="Company intelligence sections">
                {detailTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    className={activeTab === tab.id ? styles.detailTabActive : styles.detailTab}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <dl className={styles.metrics}>
                <div>
                  <dt>Founded</dt>
                  <dd>{selectedCompany.founded ?? 'Unknown'}</dd>
                </div>
                <div>
                  <dt>Type</dt>
                  <dd>{selectedCompany.companyType}</dd>
                </div>
                <div>
                  <dt>Robots</dt>
                  <dd>{selectedCompany.robots.join(', ')}</dd>
                </div>
                <div>
                  <dt>Maturity</dt>
                  <dd>{selectedCompany.intelligence.maturity}</dd>
                </div>
                <div>
                  <dt>Proof</dt>
                  <dd>{selectedCompany.intelligence.commercialProof}</dd>
                </div>
                <div>
                  <dt>Confidence</dt>
                  <dd>{selectedCompany.intelligence.sourceConfidence}</dd>
                </div>
              </dl>

              <div className={styles.tagGroup}>
                {selectedCompany.sector.map((sector) => <span key={sector}>{sector}</span>)}
                {selectedCompany.robotTypes.map((type) => <span key={type}>{type}</span>)}
                {selectedCompany.intelligence.ecosystemRoles.map((role) => <span key={role}>{role}</span>)}
              </div>

              <div className={styles.signalPanel}>
                <div>
                  <span className={styles.signalValue}>{selectedCompany.intelligence.robotAgeSignal.overall ?? 'TBD'}</span>
                  <span className={styles.signalLabel}>Robot Age Signal</span>
                </div>
                <p>{selectedCompany.intelligence.robotAgeSignal.notes}</p>
              </div>

              {activeTab === 'overview' && <OverviewTab company={selectedCompany} />}
              {activeTab === 'products' && <ProductsTab company={selectedCompany} />}
              {activeTab === 'deployments' && <DeploymentsTab company={selectedCompany} />}
              {activeTab === 'funding' && <FundingTab company={selectedCompany} />}
              {activeTab === 'sources' && <SourcesTab company={selectedCompany} />}

              <a href={selectedCompany.website} className={styles.companyLink} target="_blank" rel="noreferrer">
                Visit company site
              </a>
            </>
          ) : (
            <p className={styles.noSelection}>Adjust the filters to bring companies back into view.</p>
          )}
        </aside>
      </div>
    </section>
  )
}

function OverviewTab({ company }: { company: RoboticsCompany }) {
  return (
    <>
      <div className={styles.businessBlock}>
        <h3>Why it matters</h3>
        <p>{company.latestSignal}</p>
      </div>
      <div className={styles.businessBlock}>
        <h3>Business model</h3>
        <p>{company.businessModel}</p>
      </div>
      <div className={styles.businessBlock}>
        <h3>Buyer sectors</h3>
        <ul className={styles.compactList}>
          {company.intelligence.buyerSectors.map((sector) => <li key={sector}>{sector}</li>)}
        </ul>
      </div>
      <div className={styles.businessBlock}>
        <h3>Opportunities</h3>
        <ul className={styles.compactList}>
          {company.intelligence.opportunities.map((opportunity) => <li key={opportunity}>{opportunity}</li>)}
        </ul>
      </div>
    </>
  )
}

function ProductsTab({ company }: { company: RoboticsCompany }) {
  return (
    <div className={styles.businessBlock}>
      <h3>Products</h3>
      <ul className={styles.insightList}>
        {company.intelligence.products.map((product) => (
          <li key={product.name}>
            <strong>{product.name}</strong>
            <span>{product.category} · {product.status}</span>
            <p>{product.notes}</p>
            <small>{product.targetUseCases.join(', ')}</small>
          </li>
        ))}
      </ul>
    </div>
  )
}

function DeploymentsTab({ company }: { company: RoboticsCompany }) {
  return (
    <>
      <div className={styles.businessBlock}>
        <h3>Deployment evidence</h3>
        <p>{company.intelligence.deployments.evidence}</p>
      </div>
      <div className={styles.businessBlock}>
        <h3>Deployment locations</h3>
        <ul className={styles.compactList}>
          {company.intelligence.deployments.locations.map((location) => <li key={location}>{location}</li>)}
        </ul>
      </div>
      <div className={styles.businessBlock}>
        <h3>Known customers</h3>
        <ul className={styles.compactList}>
          {company.intelligence.knownCustomers.map((customer) => <li key={customer}>{customer}</li>)}
        </ul>
      </div>
      <div className={styles.businessBlock}>
        <h3>Risks</h3>
        <ul className={styles.compactList}>
          {company.intelligence.businessRisks.map((risk) => <li key={risk}>{risk}</li>)}
        </ul>
      </div>
    </>
  )
}

function FundingTab({ company }: { company: RoboticsCompany }) {
  return (
    <>
      <div className={styles.businessBlock}>
        <h3>Business signal</h3>
        <p>{company.funding}</p>
      </div>
      <div className={styles.businessBlock}>
        <h3>Funding rounds</h3>
        <ul className={styles.timelineList}>
          {company.intelligence.fundingRounds.map((round) => (
            <li key={`${round.date}-${round.round}`}>
              <span>{round.date} · {round.round}</span>
              <p>{round.amount} {round.valuation !== 'Unknown' ? `at ${round.valuation}` : ''}</p>
              <small>{round.investors.join(', ')} · {round.sourceStatus}</small>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.businessBlock}>
        <h3>Revenue model</h3>
        <ul className={styles.compactList}>
          {company.intelligence.revenueModel.map((model) => <li key={model}>{model}</li>)}
        </ul>
      </div>
    </>
  )
}

function SourcesTab({ company }: { company: RoboticsCompany }) {
  return (
    <>
      <div className={styles.businessBlock}>
        <h3>Timeline scaffold</h3>
        <ul className={styles.timelineList}>
          {company.intelligence.timeline.map((event) => (
            <li key={`${event.date}-${event.label}`}>
              <span>{event.date} · {event.category}</span>
              <p>{event.label}</p>
              <small>{event.sourceStatus}</small>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.businessBlock}>
        <h3>Source notes</h3>
        <p>{company.intelligence.sourceNotes}</p>
      </div>
      <div className={styles.businessBlock}>
        <h3>Last researched</h3>
        <p>{company.intelligence.lastResearched ?? 'Not yet researched'}</p>
      </div>
    </>
  )
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <label className={styles.selectLabel}>
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={styles.select}>
        <option value="all">All</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}
