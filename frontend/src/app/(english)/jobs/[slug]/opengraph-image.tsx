import { ImageResponse } from 'next/og'
import { formatLocation, formatSalary } from '@/lib/jobs'
import { getExpiredJobBySlug, getLiveJobs } from '@/lib/jobsQueries'
import { SENIORITY_LABELS } from '@/lib/jobsTaxonomy'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Mirrors src/app/robots/[slug]/opengraph-image.tsx. Hex values and pixel sizes here are
// drawing-buffer values for the rasterizer, not CSS, so the design-token rules do not
// apply — but the palette is kept identical to globals.css by hand.
const BG = '#0D0D0D'
const ACCENT = '#e85d24'
const TEXT = '#E8E4DC'
const MUTED = 'rgba(232,228,220,0.38)'
const FAINT = 'rgba(232,228,220,0.22)'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let job
  try {
    job = (await getLiveJobs()).find((entry) => entry.slug === slug)
    if (!job) job = await getExpiredJobBySlug(slug)
  } catch {
    job = undefined
  }

  const title = job?.title ?? 'Robotics Role'
  const titleSize = title.length > 34 ? 50 : title.length > 22 ? 60 : 72
  const salary = job ? formatSalary(job) : null

  return new ImageResponse(
    (
      <div
        style={{
          background: BG,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontFamily: 'system-ui, sans-serif',
          padding: '64px 72px',
          position: 'relative',
        }}
      >
        {/* Eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 6, height: 6, background: ACCENT, borderRadius: '50%' }} />
          <span
            style={{
              color: ACCENT,
              fontSize: 12,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
            }}
          >
            {job?.roleFamilyLabel ?? 'Robotics Jobs'}
          </span>
        </div>

        {/* Title + company */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              color: TEXT,
              fontSize: titleSize,
              fontWeight: 400,
              lineHeight: 0.98,
              letterSpacing: '-0.025em',
            }}
          >
            {title}
          </div>
          {job && (
            <div style={{ color: MUTED, fontSize: 20, letterSpacing: '0.06em' }}>
              {job.companyName} · {formatLocation(job)}
            </div>
          )}
        </div>

        {/* Salary is the single biggest driver of click-through on a shared job card. */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
          {salary ? (
            <span
              style={{
                color: ACCENT,
                fontSize: 46,
                fontWeight: 300,
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              {salary}
            </span>
          ) : (
            <span style={{ color: 'rgba(232,228,220,0.2)', fontSize: 20 }}>
              Compensation not disclosed
            </span>
          )}
          {job && (
            <span
              style={{
                color: MUTED,
                fontSize: 13,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
              }}
            >
              {SENIORITY_LABELS[job.seniority] ?? job.seniority}
            </span>
          )}
        </div>

        {/* Site label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span
            style={{
              color: FAINT,
              fontSize: 12,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            The Robot Age
          </span>
          <span style={{ color: 'rgba(232,228,220,0.12)', fontSize: 12 }}>
            therobotage.com/jobs
          </span>
        </div>

        {/* Right edge accent */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: 4,
            height: '100%',
            background: ACCENT,
          }}
        />
      </div>
    ),
    { ...size }
  )
}
