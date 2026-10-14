'use client'

import { useRef, useState } from 'react'
import { useLanguage } from '@/components/LanguageSwitcher/LanguageProvider'
import { useCopy } from '@/lib/i18n/useCopy'
import 'media-chrome/dist/lang/es.js'
import {
  MediaControlBar,
  MediaController,
  MediaFullscreenButton,
  MediaMuteButton,
  MediaPlayButton,
  MediaTimeDisplay,
  MediaTimeRange,
  MediaVolumeRange,
} from 'media-chrome/react'
import local from './robot-literacy.module.css'

const videoSrc = 'https://pub-93a78e4e984347e295330026d04baaaa.r2.dev/videos/robot-literacy/robot-literacy-v1.mp4'
const posterSrc = '/videos/robot-literacy-poster.png'

export default function RobotLiteracyVideo({
  src = videoSrc,
  poster = posterSrc,
  label = 'Robot Literacy framework video',
  playLabel = 'Play Robot Literacy framework video',
}: {
  src?: string
  poster?: string
  label?: string
  playLabel?: string
} = {}) {
  const { locale } = useLanguage()
  const { t } = useCopy()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const playVideo = () => {
    void videoRef.current?.play()
  }

  return (
    <div className={local.literacyVideoShell}>
      <MediaController lang={locale} className={local.literacyVideoPlayer}>
        <video
          ref={videoRef}
          slot="media"
          className={local.literacyVideoMedia}
          src={src}
          poster={poster || undefined}
          preload={poster ? 'none' : 'metadata'}
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          suppressHydrationWarning
          aria-label={t(label)}
        />
        {!isPlaying && (
          <button
            type="button"
            className={local.literacyVideoPlayOverlay}
            onClick={playVideo}
            aria-label={t(playLabel)}
          >
            <span aria-hidden="true" />
          </button>
        )}
        <MediaControlBar className={local.literacyVideoControls}>
          <MediaPlayButton />
          <MediaTimeRange />
          <MediaTimeDisplay showDuration />
          <MediaMuteButton />
          <MediaVolumeRange />
          <MediaFullscreenButton />
        </MediaControlBar>
      </MediaController>
      {locale === 'es' && <p>{t('Video in English.')}</p>}
    </div>
  )
}
