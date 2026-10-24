import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { hasWhitepaperAccess } from '@/lib/whitepaper-access'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function download(request: Request, head = false) {
  if (!hasWhitepaperAccess(new URL(request.url).searchParams.get('token'))) {
    const response = NextResponse.redirect(new URL('/rxd#whitepaper', request.url), 307)
    response.headers.set('Cache-Control', 'private, no-store')
    return response
  }
  const pdf = head ? null : new Uint8Array(await readFile(path.join(process.cwd(), 'private', 'rxd-therobotage-v2.pdf')))
  return new Response(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="rxd-therobotage-v2.pdf"',
      'Cache-Control': 'private, no-store',
      'Referrer-Policy': 'no-referrer',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}

export async function GET(request: Request) { return download(request) }
export async function HEAD(request: Request) { return download(request, true) }
