import * as React from 'react';
import { Button, Container, Heading, IconButton, Section, Text } from '@kishanscaler/ssx-ui';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react/ssr';

import { resolveLogos, type ResolvedLogo } from '@/lib/logos';
import { CtaIcon } from '@/sections/hero/CtaIcon';
import { Drift, FigureStrip, LogoTile, PlacementsHeader, RoleTile, TILE_SIZING } from './shared';
import { StoriesMotion } from './StoriesMotion';
import type { PlacementRole, PlacementStory, PlacementsContent } from './types';
import './placements.css';

/**
 * Placements, the stories variation: instead of a wall of logos, claims about
 * who hires from SSB, wide cards in a carousel (the next one peeking in), each
 * with its proof beside it (those recruiters' logos or the alumni's roles
 * drifting past, or a photo). The cards on screen open one after another, as
 * the faculty cards do.
 * Under the cards, the outcomes as one quiet strip of figures, supporting the
 * claims rather than leading: the figures roll in once, like a counter's reels.
 *
 * The header is the faculty section's, in type and motion, with the
 * carousel's arrows at its end. The carousel is a real scroller (swipe,
 * trackpad, a mouse drag, the arrows; no indicator, the team's call) that moves on by itself
 * every few seconds while it is on screen and nobody is using it. All motion
 * is in StoriesMotion; without it the cards are a plain scroller and the
 * figures show their values.
 */
export async function PlacementsStories({
  eyebrow,
  title,
  description,
  stats,
  stories,
  roles,
  logos,
  recruiters,
}: PlacementsContent) {
  const resolved = await resolveLogos(
    logos.map(({ name, logoUrl, ink }) => ({ name, logoUrl, ink, wordmark: name })),
    TILE_SIZING,
  );
  const byName = new Map(resolved.map((logo) => [logo.name, logo]));

  return (
    <Section density="roomy" aria-labelledby="placements-stories-title" className="overflow-x-clip">
      <StoriesMotion>
        <Container>
          <PlacementsHeader
            eyebrow={eyebrow}
            title={title}
            description={description}
            titleId="placements-stories-title"
            aside={
              <div className="flex shrink-0 gap-2">
                <IconButton variant="secondary" aria-label="Previous story" data-carousel-step="-1">
                  <ArrowLeft weight="bold" />
                </IconButton>
                <IconButton variant="secondary" aria-label="Next story" data-carousel-step="1">
                  <ArrowRight weight="bold" />
                </IconButton>
              </div>
            }
          />
        </Container>

        <ul data-carousel className="pl-carousel" aria-label="Who hires from SSB">
          {stories.map((story, i) => (
            <li key={story.title} aria-label={`${i + 1} of ${stories.length}`}>
              <StoryCard
                story={story}
                logos={(story.logos ?? []).flatMap((name) => byName.get(name) ?? [])}
                // The roles whose company we have a logo for, shown by its logo (the team's call).
                roles={
                  story.roles
                    ? roles.flatMap((role) => {
                        const logo = byName.get(role.company);
                        return logo ? [{ role, logo }] : [];
                      })
                    : []
                }
              />
            </li>
          ))}
        </ul>

        <Container>
          <ul className="sr-only">
            {recruiters.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>

          <FigureStrip stats={stats} />
        </Container>
      </StoriesMotion>
    </Section>
  );
}

/**
 * One card: the claim (kicker, title, a sentence, an optional CTA) and,
 * beside it on desktop or under it on a phone, its proof. `data-story` is wiped open by the entrance; `data-part` marks
 * what fades up inside it.
 */
function StoryCard({
  story,
  logos,
  roles,
}: {
  story: PlacementStory;
  logos: ResolvedLogo[];
  roles: { role: PlacementRole; logo: ResolvedLogo }[];
}) {
  return (
    <article data-story className="pl-story grid h-full overflow-hidden bg-surface-sunken md:grid-cols-2">
      {/* The kicker at the top, the claim settled at the bottom: the card's height is its proof's. */}
      <div className="flex flex-col justify-between gap-10 p-6 sm:p-10 md:p-12">
        <p data-part="title" className="type-label text-content-secondary">
          {story.kicker}
        </p>
        <div>
          <Heading as="h3" size="1" data-part="title">
            {story.title}
          </Heading>
          <Text size="lg" tone="secondary" data-part="description" className="mt-3">
            {story.description}
          </Text>
          {story.ctaLabel && story.ctaHref ? (
            // A wrapper fades in, never the Button itself (its transition-all fights GSAP).
            <div data-part="description" className="mt-6">
              <Button asChild variant="primary">
                <a href={story.ctaHref}>
                  {story.ctaLabel}
                  <CtaIcon icon={story.ctaIcon} />
                </a>
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      {story.imageUrl ? (
        <div className="pl-story-media relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element -- fills its box, so its size can't shift layout */}
          <img
            src={story.imageUrl}
            alt={story.imageAlt ?? ''}
            loading="lazy"
            decoding="async"
            data-part="photo"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      ) : (
        <Drift
          className="pl-story-media px-6 sm:px-10 md:pr-8 md:pl-0"
          tiles={
            roles.length
              ? roles.map(({ role, logo }) => (
                  <RoleTile key={role.role + role.company} role={role} logo={logo} />
                ))
              : logos.map((logo) => <LogoTile key={logo.name} logo={logo} />)
          }
        />
      )}
    </article>
  );
}
