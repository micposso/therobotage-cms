import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'

function secret() {
  const key = process.env.WHITEPAPER_DOWNLOAD_SECRET || process.env.RESEND_API_KEY
  if (!key) throw new Error('Whitepaper download signing is not configured')
  return key
}

// No email addresses in URLs. Access lasts seven days after successful signup.
export function createWhitepaperToken() {
  const payload = `${Date.now() + 7 * 24 * 60 * 60 * 1000}.${randomUUID()}`
  const signature = createHmac('sha256', secret()).update(payload).digest('hex')
  return `${payload}.${signature}`
}

export function hasWhitepaperAccess(token: string | null) {
  if (!token) return false
  const parts = token.split('.')
  if (parts.length !== 3) return false
  const [expires, nonce, signature] = parts
  if (!/^\d+$/.test(expires) || Number(expires) <= Date.now() || !/^[a-f0-9-]{36}$/.test(nonce) || !/^[a-f0-9]{64}$/.test(signature)) return false
  try {
    const expected = createHmac('sha256', secret()).update(`${expires}.${nonce}`).digest()
    return timingSafeEqual(expected, Buffer.from(signature, 'hex'))
  } catch {
    return false
  }
}
