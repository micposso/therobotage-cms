'use client'

import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { JobCard as JobCardData, JobFacets } from '@/lib/jobs'
import {
  type JobFilters,
  activeFilterCount,
  emptyFilters,
  filtersFromParams,
  filtersToQueryString,
  matchesFilters,
  PAY_OPTIONS,
  POSTED_OPTIONS,
} from '@/lib/jobFilters'
import {
  EMPLOYMENT_TYPE_LABELS,
  EMPLOYMENT_TYPE_SLUGS,
  REMOTE_TYPE_LABELS,
  REMOTE_TYPE_SLUGS,
  ROLE_FAMILY_LABELS,
  ROLE_FAMILY_SLUGS,
  SENIORITY_LABELS,
  SENIORITY_SLUGS,
  STATE_CODES,
} from '@/lib/jobsTaxonomy'
import JobList from './JobList'
import styles from './JobBoardExplorer.module.css'

type Props = {
  jobs: JobCardData[]
  facets: JobFacets
  basePath?: string
  // Locked facets come from an SEO landing route (/jobs/roles/perception-ml). They are
  // applied to the data but not shown as adjustable controls.
  lockedRole?: string
  lockedState?: string
}

const ALLOWED = {
  role: ROLE_FAMILY_SLUGS,
  level: SENIORITY_SLUGS,
  state: STATE_CODES,
  remote: REMOTE_TYPE_SLUGS,
  type: EMPLOYMENT_TYPE_SLUGS,
}

type Option = { value: string; label: string }

const JOBS_PER_PAGE = 6

// Single-select controls, matching the filter bar on /robotics-map. The URL format and
// matcher both accept comma-separated lists so that a link generated elsewhere (an alert
// preference link, say) still filters correctly on first render; the controls themselves
// set at most one value per facet.
function FilterSelect({
  label,
  value,
  options,
  allLabel,
  onChange,
}: {
  label: string
  value: string
  options: Option[]
  allLabel: string
  onChange: (value: string) => void
}) {
  return (
    <label className={styles.selectLabel}>
      <span>{label}</span>
      <select
        className={styles.select}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="all">{allLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function toOptions(values: string[], labels: Record<string, string>): Option[] {
  return values
    .map((value) => ({ value, label: labels[value] ?? value }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

function pageFromParams(params: URLSearchParams): number {
  const page = Number(params.get('page'))
  return Number.isInteger(page) && page > 1 ? page : 1
}

export default function JobBoardExplorer({
  jobs,
  facets,
  basePath = '/jobs',
  lockedRole,
  lockedState,
}: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [filters, setFilters] = useState<JobFilters>(() =>
    filtersFromParams(searchParams, ALLOWED)
  )
  const [page, setPage] = useState(() => pageFromParams(searchParams))

  function replaceUrl(next: JobFilters, nextPage: number) {
    const query = filtersToQueryString(next)
    const params = new URLSearchParams(query)
    if (nextPage > 1) params.set('page', String(nextPage))
    const queryString = params.toString()
    // replace, not push: ten filter clicks should not mean ten back-button presses.
    router.replace(queryString ? `${basePath}?${queryString}` : basePath, { scroll: false })
  }

  function applyFilters(next: JobFilters) {
    setFilters(next)
    setPage(1)
    replaceUrl(next, 1)
  }

  function applyPage(nextPage: number) {
    setPage(nextPage)
    replaceUrl(filters, nextPage)
  }

  function updateMulti(key: 'role' | 'level' | 'state' | 'remote' | 'type', value: string) {
    applyFilters({ ...filters, [key]: value === 'all' ? [] : [value] })
  }

  function updateSingle(key: 'q' | 'pay' | 'posted' | 'company', value: string) {
    applyFilters({ ...filters, [key]: value })
  }

  const visibleJobs = useMemo(
    () => jobs.filter((job) => matchesFilters(job, filters)),
    [jobs, filters]
  )
  const pageCount = Math.max(1, Math.ceil(visibleJobs.length / JOBS_PER_PAGE))
  const currentPage = Math.min(page, pageCount)
  const pageStart = (currentPage - 1) * JOBS_PER_PAGE
  const pageEnd = pageStart + JOBS_PER_PAGE
  const paginatedJobs = visibleJobs.slice(pageStart, pageEnd)
  const shownStart = visibleJobs.length === 0 ? 0 : pageStart + 1
  const shownEnd = Math.min(pageEnd, visibleJobs.length)

  const activeCount = activeFilterCount(filters)

  const roleOptions = toOptions(facets.roleFamilies, ROLE_FAMILY_LABELS)
  const levelOptions = SENIORITY_SLUGS.filter((slug) => facets.seniorities.includes(slug)).map(
    (slug) => ({ value: slug, label: SENIORITY_LABELS[slug] })
  )
  const stateOptions = facets.states.map((state) => ({ value: state.code, label: state.name }))
  const remoteOptions = toOptions(facets.remoteTypes, REMOTE_TYPE_LABELS)
  const typeOptions = toOptions(facets.employmentTypes, EMPLOYMENT_TYPE_LABELS)
  const companyOptions = facets.companies.map((c) => ({ value: c.slug, label: c.name }))

  return (
    <div className={styles.explorer}>
      <div className={styles.toolbar}>
        <label className={styles.searchLabel}>
          <span>Search</span>
          <input
            type="search"
            className={styles.searchInput}
            value={filters.q}
            onChange={(event) => updateSingle('q', event.target.value)}
            placeholder="Perception, ROS 2, Boston..."
          />
        </label>

        {!lockedRole && (
          <FilterSelect
            label="Role"
            allLabel="All roles"
            value={filters.role[0] ?? 'all'}
            options={roleOptions}
            onChange={(value) => updateMulti('role', value)}
          />
        )}

        <FilterSelect
          label="Level"
          allLabel="All levels"
          value={filters.level[0] ?? 'all'}
          options={levelOptions}
          onChange={(value) => updateMulti('level', value)}
        />

        {!lockedState && (
          <FilterSelect
            label="State"
            allLabel="All states"
            value={filters.state[0] ?? 'all'}
            options={stateOptions}
            onChange={(value) => updateMulti('state', value)}
          />
        )}

        <FilterSelect
          label="Work mode"
          allLabel="Any mode"
          value={filters.remote[0] ?? 'all'}
          options={remoteOptions}
          onChange={(value) => updateMulti('remote', value)}
        />

        <FilterSelect
          label="Type"
          allLabel="Any type"
          value={filters.type[0] ?? 'all'}
          options={typeOptions}
          onChange={(value) => updateMulti('type', value)}
        />

        <FilterSelect
          label="Company"
          allLabel="All companies"
          value={filters.company}
          options={companyOptions}
          onChange={(value) => updateSingle('company', value)}
        />

        <label className={styles.selectLabel}>
          <span>Pay</span>
          <select
            className={styles.select}
            value={filters.pay}
            onChange={(event) => updateSingle('pay', event.target.value)}
          >
            {PAY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.selectLabel}>
          <span>Posted</span>
          <select
            className={styles.select}
            value={filters.posted}
            onChange={(event) => updateSingle('posted', event.target.value)}
          >
            {POSTED_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          className={styles.resetButton}
          onClick={() => applyFilters(emptyFilters)}
          disabled={activeCount === 0}
        >
          Reset
        </button>
      </div>

      <div className={styles.summaryBar} aria-live="polite">
        <span>
          {visibleJobs.length} of {jobs.length} open {jobs.length === 1 ? 'role' : 'roles'}
        </span>
        {visibleJobs.length > 0 && (
          <span>
            Showing {shownStart}-{shownEnd}
          </span>
        )}
        {activeCount > 0 && (
          <span>
            {activeCount} {activeCount === 1 ? 'filter' : 'filters'} applied
          </span>
        )}
      </div>

      <JobList jobs={paginatedJobs} />

      {visibleJobs.length > 0 && (
        <nav className={styles.pagination} aria-label="Job board pagination">
          <button
            type="button"
            className={styles.pageButton}
            onClick={() => applyPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <div className={styles.pageNumbers}>
            {Array.from({ length: pageCount }, (_, index) => {
              const pageNumber = index + 1
              return (
                <button
                  type="button"
                  key={pageNumber}
                  className={styles.pageNumber}
                  aria-current={currentPage === pageNumber ? 'page' : undefined}
                  onClick={() => applyPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              )
            })}
          </div>

          <button
            type="button"
            className={styles.pageButton}
            onClick={() => applyPage(currentPage + 1)}
            disabled={currentPage === pageCount}
          >
            Next
          </button>
        </nav>
      )}
    </div>
  )
}
