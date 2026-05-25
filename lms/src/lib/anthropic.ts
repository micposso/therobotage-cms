import Anthropic from '@anthropic-ai/sdk'

export const COACH_MODEL = 'claude-sonnet-4-6'
export const COACH_MAX_TOKENS = 1024
export const COACH_HISTORY_LIMIT = 20
export const COACH_DAILY_LIMIT = 30

let _anthropic: Anthropic | null = null

export function getAnthropic(): Anthropic {
  if (!_anthropic) _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  return _anthropic
}

// Backwards-compatible named export
export const anthropic = new Proxy({} as Anthropic, {
  get(_target, prop) {
    return (getAnthropic() as unknown as Record<string | symbol, unknown>)[prop]
  },
})
