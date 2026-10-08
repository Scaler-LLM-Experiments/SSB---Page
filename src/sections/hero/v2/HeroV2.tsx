import { Container } from '@kishanscaler/ssx-ui';
import { CREDITS_SIZING, SCHOOLS_SIZING, resolveLogos } from '@/lib/logos';
import { FoldCopy, FoldFacts } from '../shared/FoldCopy';
import { Splash } from '../shared/Splash';
import type { HeroContent } from '../types';
import { VideoOrPlaceholder } from '../shared/VideoOrPlaceholder';
import { FilmPlayer } from './FilmPlayer';
import { HeroV2Motion } from './HeroV2Motion';
import { PHONE_TRACK, TRACK_HEIGHT } from './moment';
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
 * title, line, actions, and under them the facts as tags. At the right, no
 * box (`FoldFacts`): "100+ industry-leading faculty from" over the faculty's
 * logos running past, a divider, then "Built by alumni from" and the schools'
 * logos. (V5 of the lab's first-fold variants, 2026-10-08; the others are kept
 * off main.)
 *
 * Below desktop: the same poster, stacked. The video runs edge to edge under the nav, its foot
 * feathered into the black; the copy rises over that foot, full-width actions, the tags, then
 * the faculty and schools. Scrolling, the video moves down the hero: the copy rises to the top
 * and the poster slides down under it into the film's own 16:9 frame, with its play button,
 * the faculty and schools under it (HeroV2Motion, `phoneMoment`).
 *
 * The hero is its own dark island, so the page around it stays light. Render
 * the site navbar with `heroNav` above it at page level (`HomeNav`); the motion
 * turns the nav light once the page is white.
 */
export async function HeroV2(hero: HeroContent) {
  const { media } = hero;
  const [leaders, schools] = await Promise.all([
    hero.leaders?.length ? resolveLogos(hero.leaders, CREDITS_SIZING) : [],
    hero.alumniFrom?.length ? resolveLogos(hero.alumniFrom, SCHOOLS_SIZING) : [],
  ]);

  return (
    <HeroV2Motion>
      {/* Pulled up under the site navbar (--sn-h, its height), so the film runs behind its frosted glass. */}
      <div data-brand="ssb" data-theme="dark" className="-mt-(--sn-h) bg-page text-content">
        <Splash />

        {/* The scroll track for the video moment: tall, with the hero stuck under the nav
            while it scrolls past (CSS sticky, so nothing is re-parented, nothing is fixed,
            and it follows window resizes). Its height comes from the moment's length
            (moment.ts): on desktop the track's own; below it the hero runs past a screen, so
            a spacer after it adds the moment's length (sticky holds the hero for exactly that). */}
        <div
          data-hero-pin
          className="motion-safe:md:h-(--hero-track)"
          style={{ '--hero-track': TRACK_HEIGHT } as React.CSSProperties}
        >
          {/* One screen, from the top of the window: the nav floats over its top (--sn-h). */}
          <section
            data-hero
            aria-labelledby="hero-title"
            data-layout="v5"
            className="hero-v2 relative flex min-h-[100svh] flex-col motion-safe:sticky motion-safe:top-0 overflow-hidden bg-page"
          >
            {/* The light page, faded in behind the video once it has opened (desktop scroll only). */}
            <div
              data-hero-light
              data-brand="ssb"
              data-theme="light"
              aria-hidden="true"
              className="pointer-events-none invisible absolute inset-0 bg-page opacity-0"
            />

            {/* The copy laid out as on the split first fold, as a poster: the video fills the
                top, from the nav's foot down. One column: below md the copy starts over the
                video's feathered foot (--hero-media-h less --hero-overlap, hero-v2.css), then the
                credits; md: both at the bottom, over the black, the credits along the foot.
                Static, so the video slot positions against the section. */}
            <Container
              data-hero-body
              className="static flex flex-1 flex-col gap-10 pb-12 pt-[calc(var(--sn-h,0px)+var(--hero-media-h)-var(--hero-overlap))] md:justify-end md:gap-8 md:pb-10 md:pt-16"
            >
              {/* The copy and, beside it (after it on a phone), the facts' box, its foot level
                  with the actions'. Static, so the blocks measure against the section. */}
              <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between md:gap-16">
                <FoldCopy
                  data-hero-fade
                  data-hero-copy
                  hero={hero}
                  titleId="hero-title"
                  tags
                  className="hero-v2-copy relative z-lift"
                />
                <FoldFacts
                  data-hero-fade
                  data-hero-facts
                  hero={hero}
                  schools={schools}
                  schoolsOnly
                  // the faculty's ticker at the right: the wordmark logos, full width (the team's call
                  // over icon plus name; `marks: hero.leaderMarks` brings that version back)
                  faculty={{ line: hero.leadersLine, logos: leaders }}
                  className="relative z-lift"
                />
              </div>

              <div
                data-video-slot
                className="absolute left-0 top-[var(--sn-h,0px)] h-(--hero-media-h) w-full"
              >
                <div
                  data-video-card
                  className="hero-v2-video absolute left-0 top-0 h-full w-full overflow-hidden"
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
          {/* Below desktop: the moment's length, scrolled past while the hero holds (`phoneMoment`). */}
          <div
            data-hero-phone-track
            aria-hidden="true"
            className="hidden h-(--hero-phone-track) motion-safe:block motion-safe:md:hidden"
            style={{ '--hero-phone-track': PHONE_TRACK } as React.CSSProperties}
          />
        </div>
      </div>
    </HeroV2Motion>
  );
}
