import type { Redirect } from 'next/dist/lib/load-custom-routes'

/**
 * App-level permanent redirects.
 *
 * Add entries here to manage all URL changes and legacy aliases in one place.
 * Each redirect is a 308 permanent redirect unless you set `permanent: false`.
 *
 * Format:
 *   { source: '/old-path', destination: '/new-path', permanent: true }
 *
 * For external destinations use a full URL as the destination.
 */
const redirects: Redirect[] = [
  // ── RXD framework page ───────────────────────────────────────────────────
  // Old short URL shared in early LinkedIn outreach
  { source: '/href', destination: '/rxd', permanent: true },
  // Alternate short URL used in some early cold DM campaigns
  { source: '/hrx', destination: '/rxd', permanent: true },

  // ── RXD white paper PDF ──────────────────────────────────────────────────
  // Old PDF filename — redirect anyone who bookmarked the original link
  { source: '/pdf/href-therobotage-v2.pdf', destination: '/pdf/rxd-therobotage-v2.pdf', permanent: true },
]

export default redirects
