'use client'
import { useState } from 'react'
import { useCopy } from '@/lib/i18n/useCopy'
import Image from '@/components/MediaImage'
import Link from 'next/link'
import styles from './RobotGrid.module.css'
import { availabilityLabels, deploymentLabels, methodLabels } from '@/lib/rxd/registry'
import { availabilityStatuses, deploymentStatuses } from '@/lib/rxd/schema'
import type { Robot } from '@/lib/rxd/schema'

export interface RobotCardData {
 slug: string; title: string; manufacturer: string; thumbnailImage: string; excerpt: string
 score: { compositeScore: number; tier: string } | null
 commercial: Robot; method: keyof typeof methodLabels; evaluationDate: string | null; completeScore: number | null
}
export default function RobotGrid({ robots }: { robots: RobotCardData[] }) {
 const { t, href } = useCopy()
 const [filters, setFilters] = useState<Record<string, string>>({})
 const [sort, setSort] = useState('name')
 const options = [
  ['category', 'Robot category', [...new Set(robots.map(r => r.commercial.category))]],
  ['manufacturer', 'Manufacturer', [...new Set(robots.map(r => r.manufacturer))]],
  ['application', 'Application', [...new Set(robots.flatMap(r => r.commercial.applications))]],
  ['method', 'Assessment level', Object.keys(methodLabels)],
  ['availability', 'Purchase status', [...availabilityStatuses]],
  ['deployment', 'Deployment readiness', [...deploymentStatuses]],
 ] as [string, string, string[]][]
 const labels: Record<string, string> = { ...methodLabels, ...availabilityLabels, ...deploymentLabels }
 const filtered = robots.filter(r => options.every(([key]) => !filters[key] || (key === 'application' ? r.commercial.applications.includes(filters[key]) :
  (key === 'manufacturer' ? r.manufacturer : key === 'method' ? r.method : r.commercial[key as 'category' | 'availability' | 'deployment']) === filters[key])))
 filtered.sort((a, b) => {
  if (sort === 'score') {
   if (a.completeScore === null && b.completeScore !== null) return 1
   if (b.completeScore === null && a.completeScore !== null) return -1
   if (a.completeScore !== null && b.completeScore !== null) return b.completeScore - a.completeScore || a.title.localeCompare(b.title)
  }
  if (sort === 'latest') {
   if (!a.evaluationDate && b.evaluationDate) return 1
   if (!b.evaluationDate && a.evaluationDate) return -1
   if (a.evaluationDate && b.evaluationDate) return b.evaluationDate.localeCompare(a.evaluationDate) || a.title.localeCompare(b.title)
  }
  return a.title.localeCompare(b.title)
 })
 return <>
  <p>{t('Purchase availability, deployment readiness and assessment method describe different things. Historical reviews remain available without being reclassified as new evaluations.')}</p>
  <Link href={href('/rxd#how-we-evaluate')}>{t('Read the RXD evaluation methodology')} →</Link>
  <div className={styles.filters}>
   {options.map(([key, label, choices]) => <label key={key}>{t(label)}<select aria-label={t(label)} value={filters[key] || ''} onChange={e => setFilters({ ...filters, [key]: e.target.value })}><option value="">{t('All')}</option>{choices.map(value => <option key={value} value={value}>{t(labels[value] || value)}</option>)}</select></label>)}
   <label>{t('Sort by')}<select aria-label={t('Sort by')} value={sort} onChange={e => setSort(e.target.value)}><option value="name">{t('Name')}</option><option value="latest">{t('Latest evaluation')}</option><option value="score" disabled={!robots.some(r => r.completeScore !== null)}>{t('Complete RXD score')}</option></select></label>
   <button type="button" onClick={() => { setFilters({}); setSort('name') }}>{t('Reset filters')}</button>
  </div>
  <p role="status">{filtered.length} / {robots.length} {t('robots shown')}. {t('Historical scores are excluded from complete-score sorting. Unknown evaluation dates are listed last.')}</p>
  {!filtered.length && <p>{t('No robots match these filters.')}</p>}
  <div className={styles.grid}>{filtered.map(robot => <Link key={robot.slug} href={href('/robots/' + robot.slug)} className={styles.card}>
   <div className={styles.image}><Image src={robot.thumbnailImage} alt={robot.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" style={{ objectFit: 'cover' }} /></div>
   <div className={styles.body}><p className={styles.manufacturer}>{t(methodLabels[robot.method])}</p><h2 className={styles.title}>{robot.title}</h2><p>{robot.manufacturer}</p>
    <p>{t(availabilityLabels[robot.commercial.availability])}<br />{t(deploymentLabels[robot.commercial.deployment])}<br />{t('Availability checked')}: {robot.commercial.acquisition.verifiedAt}</p>
    {robot.score && <div className={styles.scoreRow}><span>{t('Historical RXD score')}</span><span className={styles.scoreValue}>{robot.score.compositeScore.toFixed(2)} / 5</span></div>}
    <p className={styles.excerpt}>{robot.excerpt}</p><span className={styles.cta}>{t('View RXD profile →')}</span>
   </div>
  </Link>)}</div>
 </>
}
