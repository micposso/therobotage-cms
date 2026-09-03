/// <reference types="webmcp-types" />

'use client'
import { sendWorkshopEmail } from '@/app/actions/sendWorkshopEmail'
import {
  getJobDetailsForWebMcp,
  getRobotProfileForWebMcp,
  listJobsForWebMcp,
  listRobotProfilesForWebMcp,
  searchSiteForWebMcp,
} from '@/app/actions/webMcpData'
import { getEventByIdOrSlug, siteEvents, WORKSHOP_HEARD_OPTIONS, WORKSHOP_PROFESSIONS } from '@/lib/events'
import { siteOverview } from '@/lib/site'
import { beginWebMcpActivity, updateWebMcpActivity } from './activity'

export const WEBMCP_TOOL_NAMES = [
  'get_site_overview',
  'list_events',
  'get_event_details',
  'register_for_event',
  'search_site',
  'list_robot_profiles',
  'get_robot_profile',
  'list_jobs',
  'get_job_details',
] as const

function requiredString(input: Record<string, unknown>, key: string): string | null {
  const value = input[key]
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function publicEvent(event: (typeof siteEvents)[number]) {
  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    dates: event.dates,
    location: event.location,
    summary: event.summary,
    url: event.url,
    status: event.status,
    registrationAvailability: event.registration.availability,
  }
}

function trackedExecute(execute: WebMCP.ToolExecuteCallback): WebMCP.ToolExecuteCallback {
  return async (input, options) => {
    const activityId = beginWebMcpActivity(
      (execute as WebMCP.ToolExecuteCallback & { toolName?: string }).toolName ?? 'unknown_tool',
    )

    try {
      options?.signal.throwIfAborted()
      await Promise.resolve()
      updateWebMcpActivity(activityId, 'executing')
      const result = await execute(input, options)
      options?.signal.throwIfAborted()
      updateWebMcpActivity(activityId, 'completed')
      return result
    } catch (error) {
      updateWebMcpActivity(activityId, 'failed')
      throw error
    }
  }
}

function toolExecute(
  toolName: string,
  execute: WebMCP.ToolExecuteCallback,
): WebMCP.ToolExecuteCallback {
  const namedExecute = execute as WebMCP.ToolExecuteCallback & { toolName?: string }
  namedExecute.toolName = toolName
  return trackedExecute(namedExecute)
}

const tools: WebMCP.ModelContextTool[] = [
  {
    name: 'get_site_overview',
    title: 'Get The Robot Age overview',
    description: 'Returns a concise overview of The Robot Age and links to its primary content areas.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true },
    execute: toolExecute('get_site_overview', async () => ({ ok: true, site: siteOverview })),
  },
  {
    name: 'list_events',
    title: 'List The Robot Age events',
    description: 'Lists the current events and announced upcoming events published by The Robot Age.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true },
    execute: toolExecute('list_events', async () => ({
      ok: true,
      count: siteEvents.length,
      events: siteEvents.map(publicEvent),
    })),
  },
  {
    name: 'get_event_details',
    title: 'Get event details',
    description: 'Returns all published details for a The Robot Age event identified by its stable ID or slug.',
    inputSchema: {
      type: 'object',
      properties: {
        eventId: {
          type: 'string',
          minLength: 1,
          description: 'Stable event ID or URL slug returned by list_events.',
        },
      },
      required: ['eventId'],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true },
    execute: toolExecute('get_event_details', async (input) => {
      const eventId = requiredString(input, 'eventId')
      const event = eventId ? getEventByIdOrSlug(eventId) : undefined

      if (!event) {
        return {
          ok: false,
          error: {
            code: 'EVENT_NOT_FOUND',
            message: eventId
              ? `No The Robot Age event was found for "${eventId}".`
              : 'A non-empty eventId is required.',
          },
        }
      }

      return { ok: true, event }
    }),
  },
  {
    name: 'register_for_event',
    title: 'Register for a The Robot Age event',
    description: 'Submits the existing validated registration flow for an event when registration is connected.',
    inputSchema: {
      type: 'object',
      properties: {
        eventId: { type: 'string', minLength: 1, description: 'Stable event ID or slug returned by list_events.' },
        firstName: { type: 'string', minLength: 1 },
        lastName: { type: 'string', minLength: 1 },
        email: { type: 'string', format: 'email' },
        profession: { type: 'string', enum: WORKSHOP_PROFESSIONS },
        heard: { type: 'string', enum: WORKSHOP_HEARD_OPTIONS, description: 'How the attendee heard about the event.' },
      },
      required: ['eventId', 'firstName', 'lastName', 'email', 'profession', 'heard'],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: false },
    execute: toolExecute('register_for_event', async (input) => {
      const eventId = requiredString(input, 'eventId')
      const event = eventId ? getEventByIdOrSlug(eventId) : undefined

      if (!event) {
        return {
          ok: false,
          error: { code: 'EVENT_NOT_FOUND', message: 'The requested event does not exist.' },
        }
      }

      if (event.registration.adapter !== 'workshop-email') {
        return {
          ok: false,
          eventId: event.id,
          error: {
            code: 'REGISTRATION_UNAVAILABLE',
            message: event.registration.note,
          },
        }
      }

      const formData = new FormData()
      for (const key of ['firstName', 'lastName', 'email', 'profession', 'heard'] as const) {
        formData.set(key, requiredString(input, key) ?? '')
      }

      const result = await sendWorkshopEmail(null, formData)
      if (!result.success) {
        return {
          ok: false,
          eventId: event.id,
          error: {
            code: 'REGISTRATION_FAILED',
            message: result.error ?? 'Registration could not be completed.',
          },
        }
      }

      return {
        ok: true,
        eventId: event.id,
        status: result.waitlisted ? 'waitlisted' : 'registered',
        message: result.waitlisted
          ? 'The event is full and the attendee was added to the waitlist.'
          : 'Registration completed using the existing workshop confirmation flow.',
      }
    }),
  },
  {
    name: 'search_site',
    title: 'Search The Robot Age',
    description: 'Searches The Robot Age news, research, field signals, credentials, jobs, and primary pages.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', minLength: 1, description: 'Words or phrase to search for.' },
        limit: { type: 'integer', minimum: 1, maximum: 25, default: 10 },
      },
      required: ['query'],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true },
    execute: toolExecute('search_site', async (input) => {
      const query = requiredString(input, 'query')
      if (!query) {
        return { ok: false, error: { code: 'INVALID_QUERY', message: 'A non-empty query is required.' } }
      }
      const results = await searchSiteForWebMcp(query, input.limit as number | undefined)
      return { ok: true, query, count: results.length, results }
    }),
  },
  {
    name: 'list_robot_profiles',
    title: 'List robot profiles',
    description: 'Lists robots in The Robot Age index with their public classification and profile URL.',
    inputSchema: {
      type: 'object',
      properties: { limit: { type: 'integer', minimum: 1, maximum: 25, default: 10 } },
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true },
    execute: toolExecute('list_robot_profiles', async (input) => {
      const robots = await listRobotProfilesForWebMcp(input.limit as number | undefined)
      return { ok: true, count: robots.length, robots }
    }),
  },
  {
    name: 'get_robot_profile',
    title: 'Get a robot profile',
    description: 'Returns The Robot Age profile and deployment considerations for a robot slug from list_robot_profiles.',
    inputSchema: {
      type: 'object',
      properties: { slug: { type: 'string', minLength: 1, description: 'Robot slug returned by list_robot_profiles.' } },
      required: ['slug'],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true },
    execute: toolExecute('get_robot_profile', async (input) => {
      const slug = requiredString(input, 'slug')
      const robot = slug ? await getRobotProfileForWebMcp(slug) : null
      return robot
        ? { ok: true, robot }
        : { ok: false, error: { code: 'ROBOT_NOT_FOUND', message: 'The requested robot profile does not exist.' } }
    }),
  },
  {
    name: 'list_jobs',
    title: 'List robotics product and design jobs',
    description: 'Lists current curated robotics jobs, optionally filtered by text, company, role family, work mode, or state.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', minLength: 1 },
        company: { type: 'string', minLength: 1, description: 'Exact company name or slug.' },
        roleFamily: { type: 'string', minLength: 1, description: 'Exact role-family name or slug.' },
        remoteType: { type: 'string', minLength: 1, description: 'Exact work-mode value, such as remote-us, hybrid, or onsite.' },
        state: { type: 'string', minLength: 1, description: 'Exact US state code, name, or slug.' },
        limit: { type: 'integer', minimum: 1, maximum: 25, default: 10 },
      },
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true },
    execute: toolExecute('list_jobs', async (input) => {
      const jobs = await listJobsForWebMcp({
        query: requiredString(input, 'query') ?? undefined,
        company: requiredString(input, 'company') ?? undefined,
        roleFamily: requiredString(input, 'roleFamily') ?? undefined,
        remoteType: requiredString(input, 'remoteType') ?? undefined,
        state: requiredString(input, 'state') ?? undefined,
        limit: input.limit as number | undefined,
      })
      return { ok: true, count: jobs.length, jobs }
    }),
  },
  {
    name: 'get_job_details',
    title: 'Get robotics job details',
    description: 'Returns the full public details and application link for a current job slug from list_jobs.',
    inputSchema: {
      type: 'object',
      properties: { slug: { type: 'string', minLength: 1, description: 'Job slug returned by list_jobs.' } },
      required: ['slug'],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true },
    execute: toolExecute('get_job_details', async (input) => {
      const slug = requiredString(input, 'slug')
      const job = slug ? await getJobDetailsForWebMcp(slug) : null
      return job
        ? { ok: true, job }
        : { ok: false, error: { code: 'JOB_NOT_FOUND', message: 'The requested current job does not exist.' } }
    }),
  },
]

export async function registerTheRobotAgeTools(modelContext: WebMCP.ModelContext, signal: AbortSignal) {
  await Promise.all(tools.map((tool) => modelContext.registerTool(tool, { signal })))
  return tools.length
}
