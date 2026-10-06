import { Container } from '@kishanscaler/ssx-ui';
import { FoldCopy, FoldLeaders } from '../shared/FoldCopy';
import { Splash } from '../shared/Splash';
import type { HeroContent } from '../types';
import { VideoOrPlaceholder } from '../shared/VideoOrPlaceholder';
import { FilmPlayer } from './FilmPlayer';
import { HeroV2Motion } from './HeroV2Motion';
import { TRACK_HEIGHT } from './moment';
import '../shared/hero.css';
import './hero-v2.css';

/**
 * V2 (cinematic, black into white): the hero is black.
 *
 * Desktop: the video has no frame. It starts at the nav's foot, runs edge to
 * edge and fades into the black under the copy. Scrolling pulls it to the centre, inside the page
 * margins, and hardens its edges into a 16:9 frame; then the black gives way to
 * the white of the light page below.
 *
 * The copy is laid out as on the split first fold (`FoldCopy`): the eyebrow,
 * title, line, actions and facts at the left, the leaders at the right.
 *
 * Phone: the copy first, full-width actions, then the leaders, then the video.
 *
 * The hero is its own dark island, so the page around it stays light. Render
 * the site navbar with `heroNav` above it at page level (`HomeNav`); the motion
 * turns the nav light once the page is white.
 */
export function HeroV2(hero: HeroContent) {
  const { media, leadersLine, leaders } = hero;

  return (
    <HeroV2Motion>
      {/* Pulled up under the site navbar (--sn-h, its height), so the film runs behind its frosted glass. */}
      <div data-brand="ssb" data-theme="dark" className="-mt-(--sn-h) bg-page text-content">
        <Splash />

        {/* The scroll track for the desktop video moment: tall, with the hero stuck
            under the nav while it scrolls past (CSS sticky, so nothing is re-parented,
            nothing is fixed, and it follows window resizes). Its height comes from the
            moment's length (moment.ts). */}
        <div
          data-hero-pin
          className="motion-safe:md:h-(--hero-track)"
          style={{ '--hero-track': TRACK_HEIGHT } as React.CSSProperties}
        >
          {/* One screen, from the top of the window: the nav floats over its top (--sn-h). */}
          <section
            data-hero
            aria-labelledby="hero-title"
            className="relative flex min-h-[100svh] flex-col motion-safe:md:sticky motion-safe:md:top-0 overflow-hidden bg-page"
          >
            {/* The light page, faded in behind the video once it has opened (desktop scroll only). */}
            <div
              data-hero-light
              data-brand="ssb"
              data-theme="light"
              aria-hidden="true"
              className="pointer-events-none invisible absolute inset-0 bg-page opacity-0"
            />

            {/* The copy laid out as on the split first fold. Phone: one column (the copy, the
                leaders, then the video). md: a poster. The video fills the top, from the nav's
                foot down; the copy sits at the bottom, over the black, at the left, and the
                leaders at the right, their marks' foot level with the actions'. Static, so the
                video slot positions against the section. */}
            <Container
              data-hero-body
              className="relative flex flex-1 flex-col gap-8 pb-12 pt-[calc(var(--space-12)+var(--sn-h,0px))] md:static md:flex-row md:items-end md:justify-between md:gap-16 md:pb-24 md:pt-16"
            >
              <FoldCopy
                data-hero-fade
                hero={hero}
                titleId="hero-title"
                className="hero-v2-copy relative md:z-lift"
              />
              {leaders?.length ? (
                <FoldLeaders
                  data-hero-fade
                  line={leadersLine}
                  leaders={leaders}
                  className="hero-v2-leaders relative md:z-lift"
                />
              ) : null}

              <div
                data-video-slot
                className="relative mt-4 aspect-[4/5] w-full md:absolute md:left-0 md:top-(--sn-h) md:mt-0 md:aspect-auto md:h-[68%] md:w-full"
              >
                <div
                  data-video-card
                  className="hero-v2-video absolute left-0 top-0 h-full w-full overflow-hidden rounded-2xl md:rounded-none"
                >
                  <div data-video-frame className="hero-media-cover">
                    <VideoOrPlaceholder media={media} />
                  </div>
                  {/* What sits on the film: the caption, the play button and, once
                      played, the YouTube film. Drawn 1:1 however the card is scaled
                      (frame.ts drawCard), and sized to the scroll frame on desktop. */}
                  <div data-video-overlay className="pointer-events-none absolute left-0 top-0 h-full w-full">
                    {media?.caption ? (
                      <div
                        data-video-caption
                        data-surface-ink="on-image"
                        className="invisible absolute inset-x-0 top-0 bg-linear-to-b from-surface-image-scrim to-transparent p-8 pb-16 opacity-0"
                      >
                        <p className="type-h2 max-w-measure text-on-image-ink">{media.caption}</p>
                      </div>
                    ) : null}
                    {/* The big play button, faded in as the video frames on scroll; it opens the
                        full film from YouTube, under YouTube-style controls. */}
                    {media?.youtubeId ? (
                      <FilmPlayer youtubeId={media.youtubeId} length={media.youtubeLength} />
                    ) : null}
                  </div>
                </div>
              </div>
            </Container>
          </section>
        </div>
      </div>
    </HeroV2Motion>
  );
}
