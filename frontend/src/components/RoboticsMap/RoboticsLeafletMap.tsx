'use client'

import { useEffect } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import type { RoboticsCompany } from '@/lib/robotics-map'
import styles from './RoboticsMapExplorer.module.css'

type Props = {
  companies: RoboticsCompany[]
  selectedId: string
  onSelect: (id: string) => void
}

const bounds: L.LatLngBoundsExpression = [
  [-55, -170],
  [72, 170],
]

const proofClassByStage: Record<RoboticsCompany['intelligence']['commercialProof'], string> = {
  Concept: styles.pinConcept,
  Demo: styles.pinDemo,
  Pilot: styles.pinPilot,
  'Paid deployment': styles.pinPaid,
  'Scaled deployment': styles.pinScaled,
  'Public market': styles.pinPublic,
}

function createMarkerIcon(company: RoboticsCompany, isActive: boolean) {
  const score = company.intelligence.robotAgeSignal.overall
  const scoreClass = score && score >= 80 ? styles.pinScoreHigh : score && score >= 65 ? styles.pinScoreMedium : styles.pinScoreLow
  const classes = [
    styles.leafletPin,
    proofClassByStage[company.intelligence.commercialProof],
    scoreClass,
    isActive ? styles.leafletPinActive : '',
  ].filter(Boolean).join(' ')

  return L.divIcon({
    className: '',
    html: `<span class="${classes}"><span>${score ?? ''}</span></span>`,
    iconSize: isActive ? [34, 34] : [28, 28],
    iconAnchor: isActive ? [17, 17] : [14, 14],
    popupAnchor: [0, -12],
  })
}

function MapSelection({ company }: { company?: RoboticsCompany }) {
  const map = useMap()

  useEffect(() => {
    if (!company) return
    map.flyTo([company.latitude, company.longitude], Math.max(map.getZoom(), 4), {
      duration: 0.6,
    })
  }, [company, map])

  return null
}

export default function RoboticsLeafletMap({ companies, selectedId, onSelect }: Props) {
  const selectedCompany = companies.find((company) => company.id === selectedId)

  return (
    <MapContainer
      className={styles.leafletMap}
      center={[25, 5]}
      zoom={2}
      minZoom={2}
      maxZoom={8}
      maxBounds={bounds}
      scrollWheelZoom
      worldCopyJump
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <MapSelection company={selectedCompany} />
      {companies.map((company) => (
        <Marker
          key={company.id}
          position={[company.latitude, company.longitude]}
          icon={createMarkerIcon(company, company.id === selectedId)}
          eventHandlers={{
            click: () => onSelect(company.id),
          }}
        >
          <Popup>
            <div className={styles.popup}>
              <strong>{company.name}</strong>
              <span>{company.city}, {company.country}</span>
              <span>{company.robots.join(', ')}</span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
