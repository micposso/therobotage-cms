'use client'

import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
import Image from '@/components/MediaImage'
import { companies, categories, regions, locations, evidenceLabels, filterCompanies, type MetroCompany } from '@/lib/metro-robotics'
import styles from './MetroRoboticsMap.module.css'
import useMapPreferences from './useMapPreferences'

const MetroMap = dynamic(() => import('./MetroMap'), {
  ssr: false,
  loading: () => <div className={styles.mapLoading}>Loading the regional map…</div>,
})

function Logo({ company }: { company: MetroCompany }) {
  return <Image src={`/logos/${company.id}.png`} alt="" width={50} height={50} sizes="50px" className={styles.logo} />
}

export default function MetroRoboticsExplorer() {
  const [{ category, location, search, selectedId }, update] = useMapPreferences()
  const setCategory = (category: string) => update({ category })
  const setLocation = (location: string) => update({ location })
  const setSearch = (search: string) => update({ search })
  const setSelectedId = (selectedId: string | null) => update({ selectedId })
  const [group, setGroup] = useState<string[]>([])
  const [focusRequest, setFocusRequest] = useState(0)
  const [resetRequest, setResetRequest] = useState(0)
  const filtered = useMemo(() => filterCompanies(category, location, search), [category, location, search])
  const selected = filtered.find(c => c.id === selectedId)
  const grouped = filtered.filter(c => group.includes(c.id))

  function select(company: MetroCompany, scroll = false) {
    setSelectedId(company.id)
    setGroup([])
    setFocusRequest(n => n + 1)
    if (scroll) document.getElementById('metro-map')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
  }
  function reset() { update({ category: '', location: '', search: '', selectedId: null }); setGroup([]); setResetRequest(n => n + 1) }
  function filtersChanged() { setSelectedId(null); setGroup([]) }

  return <section className={styles.section} aria-labelledby="explore-heading">
    <div className="container-fluid">
      <div className={styles.sectionHeading}>
        <div><span className={styles.eyebrow}>The regional landscape</span><h2 id="explore-heading">Explore the map</h2></div>
        <span className={styles.scope}>{companies.length} entries · {categories.length} categories · 4 regions</span>
      </div>

      <div className={styles.filters} role="search" aria-label="Filter robotics companies">
        <label>Company<input type="search" value={search} placeholder="Search companies or specialties" onChange={e => { setSearch(e.target.value); filtersChanged() }} /></label>
        <label>Category<input type="search" list="metro-categories" value={category} placeholder="All categories" onChange={e => { setCategory(e.target.value); filtersChanged() }} /></label>
        <datalist id="metro-categories">{categories.map(c => <option key={c} value={c} />)}</datalist>
        <label>Location<input type="search" list="metro-locations" value={location} placeholder="Region, city, borough, or ZIP" onChange={e => { setLocation(e.target.value); filtersChanged() }} /></label>
        <datalist id="metro-locations">{locations.map(l => <option key={l} value={l} />)}</datalist>
        <button className={styles.reset} onClick={reset} disabled={!category && !location && !search && !selectedId}>Clear filters <span aria-hidden="true">↗</span></button>
      </div>

      <div className={styles.resultBar}>
        <span role="status" aria-live="polite"><strong>{filtered.length}</strong> {filtered.length === 1 ? 'entry' : 'entries'} shown</span>
        <div className={styles.regions} aria-label="Quick region filters">
          {regions.map(region => <button key={region} aria-pressed={location === region} onClick={() => { setLocation(location === region ? '' : region); filtersChanged() }}>{region}</button>)}
        </div>
      </div>

      <div className={styles.workspace} id="metro-map">
        <div className={styles.mapColumn}>
          <MetroMap companies={filtered} selected={selected} focusRequest={focusRequest} resetRequest={resetRequest} onSelect={select} onGroup={ids => { setGroup(ids); setSelectedId(null) }} />
          <div className={styles.legend} aria-label="Map marker key">
            <span><i className={styles.officeDot} />Office / facility</span>
            <span><i className={styles.publishedDot} />Contact / reported</span>
            <span><i className={styles.areaDot} />Approximate area</span>
            <span className={styles.legendNote}>Numbered markers group nearby entries</span>
          </div>
        </div>
        <aside className={styles.inspector} aria-label="Company details" aria-live="polite">
          {selected ? <>
            <div className={styles.detailTop}><Logo company={selected} /><button className={styles.close} onClick={() => setSelectedId(null)} aria-label="Close company details">×</button></div>
            <span className={styles.eyebrow}>{selected.category}</span>
            <h3>{selected.name}</h3>
            <p className={styles.specialty}>{selected.specialty}</p>
            <span className={styles.evidence}>{evidenceLabels[selected.status]}</span>
            <address>{selected.address}</address>
            {selected.note && <p className={styles.note}>{selected.note}</p>}
            <div className={styles.detailLinks}>
              <a href={selected.website} target="_blank" rel="noreferrer">Company website <span aria-hidden="true">↗</span></a>
              {selected.id !== 'robotage' && <a href={selected.source} target="_blank" rel="noreferrer">Address source <span aria-hidden="true">↗</span></a>}
            </div>
          </> : grouped.length > 1 ? <>
            <span className={styles.eyebrow}>Around this location</span>
            <h3>{grouped.length} entries</h3>
            <p>Select a company to see its address and sources.</p>
            <div className={styles.groupList}>{grouped.map(company => <button key={company.id} onClick={() => select(company)}><Logo company={company} /><span>{company.name}<small>{company.locality}</small></span><span aria-hidden="true">↗</span></button>)}</div>
          </> : <>
            <span className={styles.eyebrow}>A growing ecosystem</span>
            <h3>Find your next connection.</h3>
            <p>From humanoids and construction to education and industrial automation. Select a marker or company to explore its work and location.</p>
            <div className={styles.regionStats}>{regions.map(region => <button key={region} onClick={() => { setLocation(region); filtersChanged() }}><span>{region}</span><strong>{companies.filter(c => c.region === region).length}</strong></button>)}</div>
            <span className={styles.inspectorNote}>Locations researched November 16, 2026. Confirm an address before visiting.</span>
          </>}
        </aside>
      </div>

      <div className={styles.directoryHeading}><h2>Company directory</h2><span>{filtered.length} {filtered.length === 1 ? 'result' : 'results'}</span></div>
      {filtered.length ? <ul className={styles.directory}>{filtered.map(company => <li key={company.id}>
        <button className={`${styles.companyRow} ${selectedId === company.id ? styles.selectedRow : ''}`} onClick={() => select(company, true)} aria-label={`Show ${company.name} on map`}>
          <Logo company={company} />
          <span className={styles.companyCopy}><strong>{company.name}</strong><span>{company.category}</span><small>{company.locality} · {company.region}</small></span>
          <span className={styles.rowArrow} aria-hidden="true">↗</span>
        </button>
      </li>)}</ul> : <div className={styles.empty}><h3>No companies match these filters.</h3><p>Try a broader category or location.</p><button onClick={reset}>Clear all filters</button></div>}

      <details className={styles.sources}>
        <summary>About the directory & map sources</summary>
        <p>This researched directory covers New York City, Nassau and Suffolk counties, Connecticut, and New Jersey. It includes companies, regional facilities, and organizations supporting robotics; it is not an exhaustive census.</p>
        <p>Filled circles indicate public office or facility addresses. Diamonds mark contact or reported addresses that may not be working offices. Hollow circles mark approximate areas. The Robot Age is intentionally placed in Elmhurst, Queens, without an exact office address. Street positions are approximate, not surveyed building coordinates.</p>
        <div className={styles.sourceLinks}>
          <a href="https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json" target="_blank" rel="noreferrer">Counties & states: U.S. Census / us-atlas ↗</a>
          <a href="https://data.cityofnewyork.us/City-Government/2020-Neighborhood-Tabulation-Areas-NTAs-/9nt8-h7nd" target="_blank" rel="noreferrer">Neighborhoods: NYC City Planning ↗</a>
          <a href="https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Transportation/MapServer" target="_blank" rel="noreferrer">Roads: Census TIGERweb ↗</a>
          <a href="/logos/sources.json" target="_blank" rel="noreferrer">Company logo sources ↗</a>
        </div>
      </details>
    </div>
  </section>
}
