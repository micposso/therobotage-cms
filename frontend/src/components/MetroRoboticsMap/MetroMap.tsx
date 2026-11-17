'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { geoMercator, geoPath, select, zoom, zoomIdentity, type GeoPermissibleObjects, type ZoomBehavior, type ZoomTransform } from 'd3'
import geography from '@/data/metro-geometry.json'
import { companies as allCompanies, type MetroCompany } from '@/lib/metro-robotics'
import styles from './MetroRoboticsMap.module.css'

type Props = {
  companies: MetroCompany[]
  selected?: MetroCompany
  focusRequest: number
  resetRequest: number
  onSelect: (company: MetroCompany) => void
  onGroup: (ids: string[]) => void
}
type Cluster = { x: number; y: number; companies: MetroCompany[] }
const regionLabels: [string, number, number][] = [
  ['NEW JERSEY', -74.52, 40.6], ['CONNECTICUT', -72.85, 41.65],
  ['LONG ISLAND', -72.98, 40.86], ['NEW YORK', -74.03, 41.53],
]
const cityLabels: [string, number, number][] = [
  ['Manhattan', -73.985, 40.78], ['Brooklyn', -73.965, 40.65], ['Queens', -73.81, 40.72],
  ['The Bronx', -73.88, 40.87], ['Staten Island', -74.16, 40.59],
  ['Newark', -74.172, 40.735], ['Stamford', -73.54, 41.05], ['New Haven', -72.93, 41.31],
  ['Hartford', -72.68, 41.765], ['Groton', -72.08, 41.35],
  ['Hauppauge', -73.2, 40.82], ['Hicksville', -73.52, 40.77],
]
const collection = (features: unknown[]) => ({ type: 'FeatureCollection', features }) as GeoPermissibleObjects

export default function MetroMap({ companies, selected, focusRequest, resetRequest, onSelect, onGroup }: Props) {
  const wrapper = useRef<HTMLDivElement>(null)
  const svg = useRef<SVGSVGElement>(null)
  const behavior = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null)
  const [size, setSize] = useState({ width: 900, height: 610 })
  const [transform, setTransform] = useState<ZoomTransform>(zoomIdentity)
  const reducedMotion = useRef(false)

  useEffect(() => {
    const element = wrapper.current
    if (!element) return
    reducedMotion.current = matchMedia('(prefers-reduced-motion: reduce)').matches
    const observer = new ResizeObserver(([entry]) => {
      setSize({ width: Math.round(entry.contentRect.width), height: Math.round(entry.contentRect.height) })
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const projection = useMemo(() => geoMercator().fitExtent([[55, 65], [Math.max(100, size.width - 55), size.height - 65]], {
    type: 'MultiPoint', coordinates: allCompanies.map(c => [c.lon, c.lat]),
  }), [size])
  const paths = useMemo(() => {
    const path = geoPath(projection)
    return {
      land: path(collection(geography.counties)) ?? '',
      states: path(collection(geography.states)) ?? '',
      neighborhoods: path(collection(geography.neighborhoods)) ?? '',
      roads: path(collection(geography.roads)) ?? '',
      scope: path(collection(geography.counties.filter(c => ['09', '34'].includes(c.properties.id.slice(0, 2)) || ['36005', '36047', '36061', '36081', '36085', '36059', '36103'].includes(c.properties.id)))) ?? '',
    }
  }, [projection])

  useEffect(() => {
    const element = svg.current
    if (!element) return
    const interaction = zoom<SVGSVGElement, unknown>()
      .extent([[0, 0], [size.width, size.height]])
      .scaleExtent([1, 64])
      .translateExtent([[-size.width * 2, -size.height * 2], [size.width * 3, size.height * 3]])
      // Scrolling the page should not unexpectedly zoom the map.
      .filter(event => event.type !== 'wheel' && !event.button)
      .on('zoom', event => setTransform(event.transform))
    behavior.current = interaction
    select(element).call(interaction)
    return () => { select(element).interrupt().on('.zoom', null) }
  }, [size])

  const moveTo = useCallback((next: ZoomTransform) => {
    if (!svg.current || !behavior.current) return
    const target = select(svg.current)
    target.interrupt()
    if (reducedMotion.current) target.call(behavior.current.transform, next)
    else target.transition().duration(420).call(behavior.current.transform, next)
  }, [])

  const fit = useCallback((items: MetroCompany[], maximum = 15) => {
    if (!items.length) { moveTo(zoomIdentity); return }
    const points = items.map(c => projection([c.lon, c.lat])!)
    const xs = points.map(p => p[0]), ys = points.map(p => p[1])
    const left = Math.min(...xs), right = Math.max(...xs), top = Math.min(...ys), bottom = Math.max(...ys)
    const scale = Math.max(1, Math.min(maximum, (size.width - 100) / Math.max(right - left, 1), (size.height - 100) / Math.max(bottom - top, 1)))
    moveTo(zoomIdentity.translate(size.width / 2, size.height / 2).scale(scale).translate(-(left + right) / 2, -(top + bottom) / 2))
  }, [projection, size, moveTo])

  useEffect(() => { fit(companies) }, [companies, fit, resetRequest])
  useEffect(() => {
    if (selected) fit([selected], selected.status === 'area' ? 9 : 22)
  }, [selected, focusRequest, fit])

  const clusters = useMemo(() => {
    const groups: Cluster[] = []
    for (const company of companies) {
      const [x, y] = transform.apply(projection([company.lon, company.lat])!)
      if (x < -30 || x > size.width + 30 || y < -30 || y > size.height + 30) continue
      const nearby = groups.find(group => Math.hypot(group.x - x, group.y - y) < (size.width < 600 ? 38 : 31))
      if (nearby) {
        const count = nearby.companies.length
        nearby.x = (nearby.x * count + x) / (count + 1)
        nearby.y = (nearby.y * count + y) / (count + 1)
        nearby.companies.push(company)
      } else groups.push({ x, y, companies: [company] })
    }
    return groups
  }, [companies, projection, transform, size])

  function activate(cluster: Cluster) {
    if (cluster.companies.length === 1) onSelect(cluster.companies[0])
    else {
      onGroup(cluster.companies.map(c => c.id))
      fit(cluster.companies, Math.min(64, Math.max(8, transform.k * 2)))
    }
  }
  function scaleBy(factor: number) {
    if (!svg.current || !behavior.current) return
    const target = select(svg.current)
    target.interrupt()
    if (reducedMotion.current) target.call(behavior.current.scaleBy, factor)
    else target.transition().duration(220).call(behavior.current.scaleBy, factor)
  }
  const labels = transform.k > 2 ? cityLabels : regionLabels

  return <div ref={wrapper} className={styles.mapSurface}>
    <svg ref={svg} className={styles.mapSvg} viewBox={`0 0 ${size.width} ${size.height}`} aria-label="Interactive map of robotics companies in New York City, Long Island, Connecticut, and New Jersey">
      <title>NYC Metro Robotics Map</title>
      <desc>Drag to pan, use the zoom buttons, or select a marker. The company directory below provides an accessible alternative.</desc>
      <g transform={transform.toString()} aria-hidden="true">
        <path d={paths.land} className={styles.land} />
        <path d={paths.scope} className={styles.inScope} />
        <path d={paths.states} className={styles.stateLines} />
        {transform.k > 2 && <path d={paths.neighborhoods} className={styles.neighborhoods} />}
        <path d={paths.roads} className={styles.roads} style={{ opacity: transform.k > 3 ? 0.5 : 0.23 }} />
      </g>
      <g className={styles.mapLabels} aria-hidden="true">{labels.map(([label, lon, lat]) => {
        const [x, y] = transform.apply(projection([lon, lat])!)
        if (x < 20 || x > size.width - 20 || y < 25 || y > size.height - 25) return null
        return <text key={label} x={x} y={y} textAnchor="middle">{label}</text>
      })}</g>
      <g>{clusters.map(cluster => {
        const grouped = cluster.companies.length > 1
        const company = cluster.companies[0]
        const active = cluster.companies.some(c => c.id === selected?.id)
        const label = grouped ? `${cluster.companies.length} companies near ${company.locality}` : `${company.name}, ${company.locality}`
        return <g key={cluster.companies.map(c => c.id).join('-')} transform={`translate(${cluster.x},${cluster.y})`} className={`${styles.marker} ${active ? styles.activeMarker : ''}`} role="button" tabIndex={0} aria-label={label} aria-pressed={active} onClick={() => activate(cluster)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(cluster) } }}>
          <title>{label}</title>
          <circle r={22} className={styles.markerHit} />
          {active && <circle r={grouped ? 24 : 18} className={styles.selectionRing} />}
          {grouped ? <><circle r={18} className={styles.clusterCircle} /><text textAnchor="middle" dy=".35em">{cluster.companies.length}</text></>
            : company.status === 'published' ? <path d="M0,-10 L10,0 L0,10 L-10,0 Z" className={styles.contactMarker} />
            : <circle r={company.status === 'area' ? 9 : 8} className={company.status === 'area' ? styles.areaMarker : styles.officeMarker} />}
        </g>
      })}</g>
    </svg>
    <div className={styles.mapToolbar} aria-label="Map controls">
      <button onClick={() => scaleBy(1.8)} aria-label="Zoom in">+</button>
      <button onClick={() => scaleBy(1 / 1.8)} aria-label="Zoom out">−</button>
      <button className={styles.fitButton} onClick={() => fit(companies)} aria-label="Fit all matching companies">Fit results</button>
    </div>
    <span className={styles.panHint}>Drag to explore · + / − to zoom</span>
    {!companies.length && <div className={styles.mapEmpty}>No matching locations</div>}
  </div>
}
