/// <reference types="webmcp-types" />

'use client'
import { sendWorkshopEmail } from '@/app/actions/sendWorkshopEmail'
import { getEventByIdOrSlug, siteEvents, WORKSHOP_HEARD_OPTIONS, WORKSHOP_PROFESSIONS } from '@/lib/events'
import { siteOverview } from '@/lib/site'
import { beginWebMcpActivity, updateWebMcpActivity } from './activity'

export const WEBMCP_TOOL_NAMES = [
  'get_site_overview',
  'list_events',
  'get_event_details',
  'register_for_event',
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
      options.signal.throwIfAborted()
      await Promise.resolve()
      updateWebMcpActivity(activityId, 'executing')
      const result = await execute(input, options)
      options.signal.throwIfAborted()
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
]

export async function registerTheRobotAgeTools(modelContext: WebMCP.ModelContext, signal: AbortSignal) {
  await Promise.all(tools.map((tool) => modelContext.registerTool(tool, { signal })))
  return tools.length
}
