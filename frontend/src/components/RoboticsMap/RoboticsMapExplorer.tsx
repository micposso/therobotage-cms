'use client'

import { useMemo, useState } from 'react'
import type { RoboticsCompany } from '@/lib/robotics-map'
import styles from './RoboticsMapExplorer.module.css'

type Facets = {
  regions: string[]
  countries: string[]
  companyTypes: string[]
  sectors: string[]
  robotTypes: string[]
}

type Props = {
  companies: RoboticsCompany[]
  facets: Facets
}

type FilterKey = 'query' | 'region' | 'country' | 'companyType' | 'sector' | 'robotType' | 'founded'

type Filters = Record<FilterKey, string>

const initialFilters: Filters = {
  query: '',
  region: 'all',
  country: 'all',
  companyType: 'all',
  sector: 'all',
  robotType: 'all',
  founded: 'all',
}

const foundedRanges = [
  { label: 'Any year', value: 'all' },
  { label: 'Before 2010', value: 'before-2010' },
  { label: '2010-2018', value: '2010-2018' },
  { label: '2019+', value: '2019-plus' },
]

function projectX(longitude: number) {
  return ((longitude + 180) / 360) * 100
}

function projectY(latitude: number) {
  return ((90 - latitude) / 180) * 100
}

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
        ...company.sector,
        ...company.robotTypes,
        ...company.robots,
      ].join(' ').toLowerCase()

      return (
        (!query || haystack.includes(query)) &&
        (filters.region === 'all' || company.region === filters.region) &&
        (filters.country === 'all' || company.country === filters.country) &&
        (filters.companyType === 'all' || company.companyType === filters.companyType) &&
        (filters.sector === 'all' || company.sector.includes(filters.sector)) &&
        (filters.robotType === 'all' || company.robotTypes.includes(filters.robotType)) &&
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
        ...company.sector,
        ...company.robotTypes,
        ...company.robots,
      ].join(' ').toLowerCase()

      return (
        (!nextQuery || haystack.includes(nextQuery)) &&
        (nextFilters.region === 'all' || company.region === nextFilters.region) &&
        (nextFilters.country === 'all' || company.country === nextFilters.country) &&
        (nextFilters.companyType === 'all' || company.companyType === nextFilters.companyType) &&
        (nextFilters.sector === 'all' || company.sector.includes(nextFilters.sector)) &&
        (nextFilters.robotType === 'all' || company.robotTypes.includes(nextFilters.robotType)) &&
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
          <div className={styles.worldMap} aria-label="World map with robotics company locations">
            <div className={`${styles.landMass} ${styles.northAmerica}`} />
            <div className={`${styles.landMass} ${styles.southAmerica}`} />
            <div className={`${styles.landMass} ${styles.europe}`} />
            <div className={`${styles.landMass} ${styles.africa}`} />
            <div className={`${styles.landMass} ${styles.asia}`} />
            <div className={`${styles.landMass} ${styles.australia}`} />

            {filteredCompanies.map((company) => (
              <button
                key={company.id}
                type="button"
                className={`${styles.pin} ${selectedCompany?.id === company.id ? styles.pinActive : ''}`}
                style={{
                  left: `${projectX(company.longitude)}%`,
                  top: `${projectY(company.latitude)}%`,
                }}
                onClick={() => setSelectedId(company.id)}
                aria-label={`Select ${company.name} in ${company.city}`}
              >
                <span className={styles.pinDot} />
                <span className={styles.pinLabel}>{company.name}</span>
              </button>
            ))}

            {filteredCompanies.length === 0 && (
              <div className={styles.emptyMap}>
                No companies match those filters.
              </div>
            )}
          </div>
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
              </dl>

              <div className={styles.tagGroup}>
                {selectedCompany.sector.map((sector) => <span key={sector}>{sector}</span>)}
                {selectedCompany.robotTypes.map((type) => <span key={type}>{type}</span>)}
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
