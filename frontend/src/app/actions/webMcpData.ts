'use server'

import { formatLocation, formatSalary } from '@/lib/jobs'
import { getJobBySlug, getJobCards } from '@/lib/jobsQueries'
import { getAllRobotProfiles, getRobotProfile } from '@/lib/robot-profiles'
import { runSearch } from '@/lib/searchIndex'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://therobotage.com'

function absoluteUrl(url: string): string {
  return new URL(url, SITE_URL).toString()
}

function normalizedLimit(value: unknown, fallback = 10, maximum = 25): number {
  return typeof value === 'number' && Number.isInteger(value)
    ? Math.min(Math.max(value, 1), maximum)
    : fallback
}

export async function searchSiteForWebMcp(query: string, limit?: number) {
  const normalizedQuery = query.trim()
  if (!normalizedQuery) return []

  return (await runSearch(normalizedQuery))
    .slice(0, normalizedLimit(limit))
    .map((result) => ({ ...result, url: absoluteUrl(result.url) }))
}

export async function listRobotProfilesForWebMcp(limit?: number) {
  return getAllRobotProfiles()
    .slice(0, normalizedLimit(limit, 10))
    .map((robot) => ({
      slug: robot.slug,
      title: robot.title,
      manufacturer: robot.manufacturer,
      category: robot.category,
      type: robot.type,
      country: robot.country,
      industry: robot.industry,
      yearIntroduced: robot.yearIntroduced,
      description: robot.description,
      url: absoluteUrl(`/robots/${robot.slug}`),
    }))
}

export async function getRobotProfileForWebMcp(slug: string) {
  const robot = getRobotProfile(slug.trim())
  if (!robot) return null

  return {
    slug: robot.slug,
    title: robot.title,
    manufacturer: robot.manufacturer,
    category: robot.category,
    type: robot.type,
    country: robot.country,
    priceRange: robot.priceRange,
    yearIntroduced: robot.yearIntroduced,
    autonomy: robot.autonomy,
    industry: robot.industry,
    description: robot.description,
    overview: robot.overview,
    deploymentConsiderations: robot.deploymentBoxes,
    url: absoluteUrl(`/robots/${robot.slug}`),
  }
}

export type WebMcpJobFilters = {
  query?: string
  company?: string
  roleFamily?: string
  remoteType?: string
  state?: string
  limit?: number
}

export async function listJobsForWebMcp(filters: WebMcpJobFilters = {}) {
  const query = filters.query?.trim().toLowerCase()
  const company = filters.company?.trim().toLowerCase()
  const roleFamily = filters.roleFamily?.trim().toLowerCase()
  const remoteType = filters.remoteType?.trim().toLowerCase()
  const state = filters.state?.trim().toLowerCase()

  return (await getJobCards())
    .filter((job) => {
      if (company && ![job.companySlug, job.companyName].some((value) => value.toLowerCase() === company)) return false
      if (roleFamily && ![job.roleFamily, job.roleFamilyLabel].some((value) => value.toLowerCase() === roleFamily)) return false
      if (remoteType && job.remoteType.toLowerCase() !== remoteType) return false
      if (state && ![job.stateCode, job.stateName, job.stateSlug].some((value) => value?.toLowerCase() === state)) return false
      if (query) {
        const haystack = [job.title, job.companyName, job.summary, job.roleFamilyLabel, ...job.tags]
          .join(' ')
          .toLowerCase()
        if (!query.split(/\s+/).every((term) => haystack.includes(term))) return false
      }
      return true
    })
    .slice(0, normalizedLimit(filters.limit))
    .map((job) => ({
      slug: job.slug,
      title: job.title,
      company: job.companyName,
      summary: job.summary,
      roleFamily: job.roleFamilyLabel,
      seniority: job.seniority,
      employmentType: job.employmentType,
      remoteType: job.remoteType,
      location: formatLocation(job),
      salary: formatSalary(job),
      tags: job.tags,
      postedAt: job.postedAt,
      expiresAt: job.expiresAt,
      url: absoluteUrl(`/jobs/${job.slug}`),
    }))
}

export async function getJobDetailsForWebMcp(slug: string) {
  const job = await getJobBySlug(slug.trim())
  if (!job) return null

  return {
    slug: job.slug,
    title: job.title,
    company: job.companyName,
    companyWebsite: job.companyWebsite,
    summary: job.summary,
    descriptionHtml: job.descriptionHtml,
    roleFamily: job.roleFamilyLabel,
    seniority: job.seniority,
    employmentType: job.employmentType,
    remoteType: job.remoteType,
    location: formatLocation(job),
    salary: formatSalary(job),
    tags: job.tags,
    postedAt: job.postedAt,
    expiresAt: job.expiresAt,
    applyUrl: job.applyUrl,
    url: absoluteUrl(`/jobs/${job.slug}`),
  }
}
