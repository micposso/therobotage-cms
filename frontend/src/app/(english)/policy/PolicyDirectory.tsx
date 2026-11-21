'use client'

import { useRef, useState } from 'react'
import {
  emptyPolicyFilters,
  filterRobotPolicies,
  policyCategories,
  policyJurisdictions,
  policyStatuses,
  type RobotPolicy,
} from '@/lib/robotPolicy'
import controls from '@/components/JobBoard/JobBoardExplorer.module.css'
import PolicyCard from './PolicyCard'
import styles from './policy.module.css'

const filterFields = [
  { key: 'jurisdiction', label: 'Jurisdiction', options: Object.entries(policyJurisdictions) },
  { key: 'status', label: 'Status', options: Object.entries(policyStatuses) },
  { key: 'category', label: 'Category', options: policyCategories.map((category) => [category, category]) },
] as const

export default function PolicyDirectory({ policies }: { policies: readonly RobotPolicy[] }) {
  const [filters, setFilters] = useState(emptyPolicyFilters)
  const searchInput = useRef<HTMLInputElement>(null)
  const visiblePolicies = filterRobotPolicies(policies, filters)

  function resetFilters() {
    setFilters(emptyPolicyFilters)
    searchInput.current?.focus()
  }

  return (
    <section aria-labelledby="policy-directory-heading" className={`container-fluid ${styles.directory}`}>
      <h2 id="policy-directory-heading" className={styles.sectionTitle}>Policy directory</h2>
      <form
        role="search"
        aria-label="Filter policies"
        className={`${controls.toolbar} ${styles.toolbar}`}
        onSubmit={(event) => event.preventDefault()}
      >
        <label className={controls.searchLabel}>
          <span>Search policies</span>
          <input
            ref={searchInput}
            type="search"
            placeholder="Search policies, legislation, or keywords..."
            className={controls.searchInput}
            value={filters.query}
            onChange={(event) => setFilters({ ...filters, query: event.target.value })}
          />
        </label>
        {filterFields.map(({ key, label, options }) => (
          <label key={key} className={controls.selectLabel}>
            <span>{label}</span>
            <select
              className={controls.select}
              value={filters[key]}
              onChange={(event) => setFilters({ ...filters, [key]: event.target.value })}
            >
              <option value="">All</option>
              {options.map(([value, name]) => <option key={value} value={value}>{name}</option>)}
            </select>
          </label>
        ))}
      </form>
      <div className={styles.resultsBar}>
        <output role="status" aria-live="polite" aria-atomic="true">
          {visiblePolicies.length} {visiblePolicies.length === 1 ? 'matching policy' : 'matching policies'}
        </output>
        <button type="button" onClick={resetFilters} className={styles.reset}>Reset Filters</button>
      </div>
      {visiblePolicies.length > 0 ? (
        <ul className={styles.cards} role="list">
          {visiblePolicies.map((policy) => <PolicyCard key={policy.id} policy={policy} />)}
        </ul>
      ) : (
        <div className={styles.empty}>
          <p>{policies.length ? 'No policies match your current filters.' : 'No verified policies are available yet.'}</p>
          {policies.length > 0 && (
            <button type="button" onClick={resetFilters} className={styles.reset}>Reset Filters</button>
          )}
        </div>
      )}
    </section>
  )
}
