'use client'

import { useRef, useState } from 'react'
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
const posterSrc = '/images/robot-literacy-poster.png'

export default function RobotLiteracyVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const playVideo = () => {
    void videoRef.current?.play()
  }

  return (
    <div className={local.literacyVideoShell}>
      <MediaController className={local.literacyVideoPlayer}>
        <video
          ref={videoRef}
          slot="media"
          className={local.literacyVideoMedia}
          src={videoSrc}
          poster={posterSrc}
          preload="none"
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          suppressHydrationWarning
          aria-label="Robot Literacy framework video"
        />
        {!isPlaying && (
          <button
            type="button"
            className={local.literacyVideoPlayOverlay}
            onClick={playVideo}
            aria-label="Play Robot Literacy framework video"
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
    </div>
  )
}
