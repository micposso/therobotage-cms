import { ImageResponse } from 'next/og'
import { getQuizRobot, statBars } from '@/lib/quizRobots'
import { imageUrl } from '@/lib/image-assets'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'What Robot Are You? — robot match card'

const SAND = '#F5F0E8'
const INK = '#0D0D0D'
const MUTED = '#2A2A28'
const BG = SAND
const ORANGE = '#9b5152'

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const robot = getQuizRobot(slug)

  if (!robot) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: SAND,
            color: INK,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'system-ui, sans-serif',
            fontSize: 48,
          }}
        >
          What Robot Are You?
        </div>
      ),
      { ...size }
    )
  }

  const bars = statBars(robot.traitVector)

  // Try to embed the robot photo (falls back to a branded tile if missing).
  let imageCss: string | undefined
  try {
    const response = await fetch(imageUrl(robot.photo), { signal: AbortSignal.timeout(5000) })
    if (!response.ok) throw new Error('Robot image unavailable')
    const buf = Buffer.from(await response.arrayBuffer())
    const ext = robot.photo.split('.').pop()?.toLowerCase() ?? 'jpg'
    const mime = ext === 'png' ? 'image/png' : 'image/jpeg'
    imageCss = `url(data:${mime};base64,${buf.toString('base64')})`
  } catch {
    // no image yet — fall through to placeholder
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: SAND,
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
            padding: '48px 58px',
          }}
        >
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 6, height: 6, background: ORANGE, borderRadius: '50%' }} />
            <span
              style={{
                color: ORANGE,
                fontSize: 13,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
              }}
            >
              What Robot Are You?
            </span>
          </div>

          {/* Name + archetype */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div
              style={{
                color: ORANGE,
                fontSize: 15,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}
            >
              {robot.archetype}
            </div>
            <div
              style={{
                color: INK,
                fontSize: robot.name.length > 16 ? 60 : 72,
                fontWeight: 600,
                lineHeight: 0.95,
                letterSpacing: '-0.025em',
              }}
            >
              {robot.name}
            </div>
            <div style={{ color: MUTED, opacity: 0.7, fontSize: 22, letterSpacing: '0.04em' }}>
              {robot.maker}
            </div>
          </div>

          {/* Stat bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 470 }}>
            <span style={{ color: MUTED, fontSize: 13, letterSpacing: '0.08em' }}>PERSONALITY MIX · JUST FOR FUN</span>
            {bars.map((bar) => (
              <div key={bar.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span
                  style={{
                    color: MUTED,
                    opacity: 0.78,
                    fontSize: 15,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    width: 175,
                  }}
                >
                  {bar.label}
                </span>
                <div style={{ display: 'flex', flex: 1, height: 12, background: 'rgba(13,13,13,0.10)' }}>
                  <div style={{ width: `${Math.max(2, Math.round(bar.value * 100))}%`, background: ORANGE }} />
                </div>
              </div>
            ))}
          </div>

          {/* Footer: wordmark */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: 560 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <span style={{ color: INK, fontSize: 24, fontWeight: 600, letterSpacing: '-0.01em' }}>
                TheRobotAge
              </span>
              <span style={{ color: MUTED, opacity: 0.62, fontSize: 17 }}>
                Take the 2-minute quiz →
              </span>
            </div>
          </div>
        </div>

        {/* Right: photo / placeholder */}
        <div
          style={{
            display: 'flex',
            width: 470,
            flexShrink: 0,
            alignItems: 'center',
            justifyContent: 'center',
            padding: '34px 46px 34px 0',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              backgroundColor: BG,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              border: `3px solid ${ORANGE}`,
              ...(imageCss ? { backgroundImage: imageCss } : {}),
            }}
          >
            {!imageCss && (
              <span
                style={{
                  color: MUTED,
                  opacity: 0.55,
                  fontSize: 18,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                }}
              >
                {robot.name}
              </span>
            )}
          </div>
        </div>

        {/* Right edge accent */}
        <span style={{ position: 'absolute', right: 70, bottom: 44, color: MUTED, fontSize: 12 }}>QUIZ ARTWORK</span>
        <div
          style={{ position: 'absolute', right: 0, top: 0, width: 4, height: '100%', background: ORANGE }}
        />
      </div>
    ),
    { ...size }
  )
}
