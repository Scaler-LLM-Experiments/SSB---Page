import type { HeroMedia } from '../types';

/** A muted looping video, or a moving, unlabelled placeholder until there is footage. */
export function VideoOrPlaceholder({ media }: { media?: HeroMedia }) {
  if (media?.videoSrc) {
    return (
      <video
        className="h-full w-full object-cover"
        src={media.videoSrc}
        poster={media.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
    );
  }
  return <div className="hero-video-placeholder h-full w-full" />;
}
