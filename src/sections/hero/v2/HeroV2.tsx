import { Button, ButtonIcon, Container, GlassButton, Heading, Text } from '@kishanscaler/ssx-ui';
import { ArrowUpRight, DownloadSimple, Play } from '@phosphor-icons/react/ssr';
import { resolveLogos } from '@/lib/logos';
import { HeroTitle } from '../HeroTitle';
import { FactsStrip } from '../shared/FactsStrip';
import { LogoTicker } from '../shared/LogoTicker';
import { Splash } from '../shared/Splash';
import type { HeroContent } from '../types';
import { VideoOrPlaceholder } from '../shared/VideoOrPlaceholder';
import { HeroV2Motion } from './HeroV2Motion';
import '../shared/hero.css';
import './hero-v2.css';

/**
 * V2 (cinematic, black into white): the hero is black.
 *
 * Desktop: the video has no frame. It bleeds off the right edge and fades into
 * the black under the copy. Scrolling pulls it to the centre, inside the page
 * margins, and hardens its edges into a 16:9 frame; then the black gives way to
 * the white of the light page below.
 *
 * Phone: the copy first, full-width actions, then the video, then the facts
 * under it.
 *
 * The hero is its own dark island, so the page around it stays light. Render
 * `HeroNav theme="dark"` above it at page level; the motion turns the nav light
 * once the page is white.
 */
export async function HeroV2({
  eyebrow,
  title,
  titleHighlight,
  description,
  primaryCta,
  secondaryCta,
  facts,
  logos,
  media,
}: HeroContent) {
  const resolvedLogos = logos?.length ? await resolveLogos(logos) : [];

  return (
    <HeroV2Motion>
      <div data-brand="ssb" data-theme="dark" className="bg-page text-content">
        <Splash />

        {/* The scroll track for the desktop video moment: tall, with the hero stuck
            under the nav while it scrolls past (CSS sticky, so nothing is re-parented,
            nothing is fixed, and it follows window resizes). */}
        <div data-hero-pin className="motion-safe:md:h-[240svh]">
          {/* One screen under the sticky nav (HeroNav is h-16). */}
          <section
            data-hero
            className="relative flex min-h-[calc(100svh-var(--space-16))] flex-col motion-safe:md:sticky motion-safe:md:top-16 overflow-hidden bg-page"
          >
            {/* The light page, faded in behind the video once it has opened (desktop scroll only). */}
            <div
              data-hero-light
              data-brand="ssb"
              data-theme="light"
              aria-hidden="true"
              className="pointer-events-none invisible absolute inset-0 bg-page opacity-0"
            />

            {/* Phone: one column, in reading order (title, description, actions, video, facts).
                md: a poster. The video fills the top; the copy sits at the bottom in two
                columns, both bottom- and left-aligned, so neither side is heavy. Left: the title
                and its ticker (no wider than the title), then the actions. Right, flush with the
                right page margin: the description, then the facts, level with the actions. The
                facts strip sets that column's width and the description wraps to it, so their
                left edges line up too. Static, so the video slot positions against the section. */}
            <Container
              data-hero-body
              className="relative flex flex-1 flex-col gap-8 pb-12 pt-12 md:static md:grid md:grid-cols-[minmax(0,1fr)_auto] md:content-end md:gap-x-16 md:gap-y-10 md:pb-40 md:pt-16"
            >
              <div
                data-hero-copy
                data-hero-fade
                className="relative flex w-full flex-col gap-5 md:z-lift md:col-start-1 md:row-start-1 md:max-w-panel-xl md:self-end"
              >
                <Heading as="p" size="eyebrow" data-hero-eyebrow className="text-content-secondary">
                  {eyebrow}
                </Heading>
                <Heading as="h1" data-hero-title className="type-billboard-sm">
                  <HeroTitle title={title} highlight={titleHighlight} />
                </Heading>
                {resolvedLogos.length ? (
                  <LogoTicker
                    data-hero-ticker
                    logos={resolvedLogos}
                    label="Organisations our industry leaders come from"
                  />
                ) : null}
              </div>

              <Text
                data-hero-description
                data-hero-fade
                tone="secondary"
                className="relative max-w-measure md:z-lift md:col-start-2 md:row-start-1 md:w-0 md:min-w-full md:max-w-none md:self-end"
              >
                {description}
              </Text>

              <div
                data-hero-actions
                data-hero-fade
                className="relative flex w-full flex-col gap-3 md:z-lift md:col-start-1 md:row-start-2 md:w-auto md:flex-row md:gap-4"
              >
                <Button asChild size="lg" className="w-full md:w-auto">
                  <a href={primaryCta.href}>
                    {primaryCta.label}
                    <ButtonIcon>
                      <ArrowUpRight />
                    </ButtonIcon>
                  </a>
                </Button>
                {secondaryCta ? (
                  <Button asChild size="lg" variant="secondary" className="w-full md:w-auto">
                    <a href={secondaryCta.href}>
                      {secondaryCta.label}
                      <ButtonIcon>
                        <DownloadSimple />
                      </ButtonIcon>
                    </a>
                  </Button>
                ) : null}
              </div>

              <div
                data-video-slot
                className="relative mt-4 aspect-[4/5] w-full md:absolute md:left-0 md:top-0 md:mt-0 md:aspect-auto md:h-[68%] md:w-full"
              >
                <div
                  data-video-card
                  className="hero-v2-video absolute left-0 top-0 h-full w-full overflow-hidden rounded-2xl md:rounded-none"
                >
                  <div data-video-frame className="h-full w-full">
                    <VideoOrPlaceholder media={media} />
                  </div>
                  {media?.caption ? (
                    <div
                      data-video-caption
                      data-surface-ink="on-image"
                      className="invisible absolute inset-x-0 top-0 bg-linear-to-b from-surface-image-scrim to-transparent p-8 pb-16 opacity-0"
                    >
                      <p className="type-h2 max-w-measure text-on-image-ink">{media.caption}</p>
                    </div>
                  ) : null}
                  {/* The play button, faded in as the video opens into its frame on scroll
                      (HeroV2Motion plays the film on click). The wrapper fades, not the
                      button: Button's own transition fights a tween on the button itself. */}
                  <div
                    data-video-play
                    data-surface-ink="on-image"
                    className="pointer-events-none invisible absolute inset-0 grid place-items-center opacity-0"
                  >
                    <GlassButton
                      size="icon-lg"
                      aria-label="Play the campus film"
                      className="pointer-events-auto"
                    >
                      <Play weight="fill" />
                    </GlassButton>
                  </div>
                </div>
              </div>

              {/* Under the video on a phone; under the description on desktop, level with the
                  actions (the video is out of flow there). */}
              {facts?.length ? (
                <FactsStrip
                  facts={facts}
                  className="relative -mt-2 md:z-lift md:col-start-2 md:row-start-2 md:mt-0 md:self-center"
                />
              ) : null}
            </Container>
          </section>
        </div>
      </div>
    </HeroV2Motion>
  );
}
