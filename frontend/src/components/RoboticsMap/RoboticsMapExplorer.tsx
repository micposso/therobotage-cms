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

type FilterKey = 'query' | 'region' | 'country' | 'companyType' | 'sector' | 'robotType' | 'maturity' | 'commercialProof' | 'ecosystemRole' | 'founded'

type Filters = Record<FilterKey, string>

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

function matchesFoundedRange(founded: number | null, range: string) {
  if (range === 'all') return true
  if (!founded) return false
  if (range === 'before-2010') return founded < 2010
  if (range === '2010-2018') return founded >= 2010 && founded <= 2018
  return founded >= 2019
}

export default function RoboticsMapExplorer({ companies, facets }: Props) {
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [selectedId, setSelectedId] = useState(companies[0]?.id ?? '')

  const filteredCompanies = useMemo(() => {
    const query = filters.query.trim().toLowerCase()

    return companies.filter((company) => {
      const haystack = [
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

      return (
        (!query || haystack.includes(query)) &&
        (filters.region === 'all' || company.region === filters.region) &&
        (filters.country === 'all' || company.country === filters.country) &&
        (filters.companyType === 'all' || company.companyType === filters.companyType) &&
        (filters.sector === 'all' || company.sector.includes(filters.sector)) &&
        (filters.robotType === 'all' || company.robotTypes.includes(filters.robotType)) &&
        (filters.maturity === 'all' || company.intelligence.maturity === filters.maturity) &&
        (filters.commercialProof === 'all' || company.intelligence.commercialProof === filters.commercialProof) &&
        (filters.ecosystemRole === 'all' || company.intelligence.ecosystemRoles.includes(filters.ecosystemRole)) &&
        matchesFoundedRange(company.founded, filters.founded)
      )
    })
  }, [companies, filters])

  const selectedCompany = filteredCompanies.find((company) => company.id === selectedId) ?? filteredCompanies[0]

  function updateFilter(key: FilterKey, value: string) {
    const nextFilters = { ...filters, [key]: value }
    setFilters(nextFilters)

    const nextQuery = nextFilters.query.trim().toLowerCase()
    const nextVisible = companies.find((company) => {
      const haystack = [
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
        ...company.sector,
        ...company.robotTypes,
        ...company.robots,
        ...company.intelligence.ecosystemRoles,
        ...company.intelligence.buyerSectors,
      ].join(' ').toLowerCase()

      return (
        (!nextQuery || haystack.includes(nextQuery)) &&
        (nextFilters.region === 'all' || company.region === nextFilters.region) &&
        (nextFilters.country === 'all' || company.country === nextFilters.country) &&
        (nextFilters.companyType === 'all' || company.companyType === nextFilters.companyType) &&
        (nextFilters.sector === 'all' || company.sector.includes(nextFilters.sector)) &&
        (nextFilters.robotType === 'all' || company.robotTypes.includes(nextFilters.robotType)) &&
        (nextFilters.maturity === 'all' || company.intelligence.maturity === nextFilters.maturity) &&
        (nextFilters.commercialProof === 'all' || company.intelligence.commercialProof === nextFilters.commercialProof) &&
        (nextFilters.ecosystemRole === 'all' || company.intelligence.ecosystemRoles.includes(nextFilters.ecosystemRole)) &&
        matchesFoundedRange(company.founded, nextFilters.founded)
      )
    })

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
        <a href="/api/robotics-map" className={styles.apiLink}>Open JSON API</a>
      </div>

      <div className={styles.mapGrid}>
        <div className={styles.mapPanel}>
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

              <div className={styles.businessBlock}>
                <h3>Products</h3>
                <ul className={styles.insightList}>
                  {selectedCompany.intelligence.products.map((product) => (
                    <li key={product.name}>
                      <strong>{product.name}</strong>
                      <span>{product.category} · {product.status}</span>
                      <p>{product.notes}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.businessBlock}>
                <h3>Business signal</h3>
                <p>{selectedCompany.funding}</p>
              </div>
              <div className={styles.businessBlock}>
                <h3>Why it matters</h3>
                <p>{selectedCompany.latestSignal}</p>
              </div>
              <div className={styles.businessBlock}>
                <h3>Model</h3>
                <p>{selectedCompany.businessModel}</p>
              </div>
              <div className={styles.businessBlock}>
                <h3>Deployment evidence</h3>
                <p>{selectedCompany.intelligence.deployments.evidence}</p>
              </div>
              <div className={styles.businessBlock}>
                <h3>Revenue model</h3>
                <ul className={styles.compactList}>
                  {selectedCompany.intelligence.revenueModel.map((model) => <li key={model}>{model}</li>)}
                </ul>
              </div>
              <div className={styles.businessBlock}>
                <h3>Timeline scaffold</h3>
                <ul className={styles.timelineList}>
                  {selectedCompany.intelligence.timeline.map((event) => (
                    <li key={`${event.date}-${event.label}`}>
                      <span>{event.date}</span>
                      <p>{event.label}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.businessBlock}>
                <h3>Source notes</h3>
                <p>{selectedCompany.intelligence.sourceNotes}</p>
              </div>

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
