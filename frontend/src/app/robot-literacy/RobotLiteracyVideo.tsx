'use client'

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

const videoSrc = '/videos/robot-literacy.mp4'
const posterSrc = '/images/society-family-sm.png'

export default function RobotLiteracyVideo() {
  return (
    <div className={local.literacyVideoShell}>
      <MediaController className={local.literacyVideoPlayer}>
        <video
          slot="media"
          className={local.literacyVideoMedia}
          src={videoSrc}
          poster={posterSrc}
          preload="none"
          playsInline
          suppressHydrationWarning
          aria-label="Robot Literacy framework video"
        />
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
