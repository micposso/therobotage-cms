import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getRobotProfile } from '@/lib/robot-profiles'
import { getScoreBySlug } from '@/lib/scores'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const robot = getRobotProfile(slug)
  const score = robot ? getScoreBySlug(slug) : null

  let imageCss: string | undefined
  if (robot?.image) {
    try {
      const abs = join(process.cwd(), 'public', robot.image)
      const buf = await readFile(abs)
      const ext = robot.image.split('.').pop()?.toLowerCase() ?? 'png'
      const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png'
      imageCss = `url(data:${mime};base64,${buf.toString('base64')})`
    } catch {
      // no image — fall through
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0D0D0D',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Left content column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            padding: '64px 72px',
          }}
        >
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 6,
                height: 6,
                background: '#e85d24',
                borderRadius: '50%',
              }}
            />
            <span
              style={{
                color: '#e85d24',
                fontSize: 12,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
              }}
            >
              Robot Experience Design
            </span>
          </div>

          {/* Robot name + manufacturer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div
              style={{
                color: '#E8E4DC',
                fontSize: robot?.title && robot.title.length > 16 ? 58 : 72,
                fontWeight: 400,
                lineHeight: 0.92,
                letterSpacing: '-0.025em',
              }}
            >
              {robot?.title ?? 'Robot Profile'}
            </div>
            {robot?.manufacturer && (
              <div
                style={{
                  color: 'rgba(232,228,220,0.38)',
                  fontSize: 17,
                  letterSpacing: '0.06em',
                }}
              >
                {robot.manufacturer}
              </div>
            )}
          </div>

          {/* RXD Score block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div
              style={{
                color: 'rgba(232,228,220,0.3)',
                fontSize: 11,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
              }}
            >
              RXD Score
            </div>
            {score ? (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span
                  style={{
                    color: '#e85d24',
                    fontSize: 56,
                    fontWeight: 300,
                    letterSpacing: '-0.025em',
                    lineHeight: 1,
                  }}
                >
                  {score.compositeScore.toFixed(2)}
                </span>
                <span
                  style={{
                    color: 'rgba(232,228,220,0.3)',
                    fontSize: 22,
                    fontWeight: 300,
                  }}
                >
                  / 5.0
                </span>
                <span
                  style={{
                    color: 'rgba(232,228,220,0.3)',
                    fontSize: 12,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    marginLeft: 14,
                  }}
                >
                  {score.tier}
                </span>
              </div>
            ) : (
              <div style={{ color: 'rgba(232,228,220,0.2)', fontSize: 18 }}>
                Score pending
              </div>
            )}
          </div>

          {/* Site label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <span
              style={{
                color: 'rgba(232,228,220,0.22)',
                fontSize: 12,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}
            >
              The Robot Age
            </span>
            <span style={{ color: 'rgba(232,228,220,0.12)', fontSize: 12 }}>
              therobotage.com
            </span>
          </div>
        </div>

        {/* Right: robot image (circular) */}
        {imageCss && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 360,
              flexShrink: 0,
              padding: '60px 60px 60px 0',
            }}
          >
            <div
              style={{
                width: 300,
                height: 300,
                borderRadius: '50%',
                backgroundImage: imageCss,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '2px solid rgba(232,93,36,0.3)',
              }}
            />
          </div>
        )}

        {/* Right edge accent */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: 4,
            height: '100%',
            background: '#e85d24',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
