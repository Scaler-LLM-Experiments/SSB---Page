import type { ReactElement } from 'react';
import { Button, Container, Heading, Section, cn } from '@kishanscaler/ssx-ui';
import { GlobeHemisphereWest, RocketLaunch, Sparkle } from '@phosphor-icons/react/ssr';

import { resolveLogos, type LogoSizing, type ResolvedLogo } from '@/lib/logos';
import { CtaIcon } from '@/sections/hero/CtaIcon';
import { Drift, LogoImage, LogoTile, PlacementsHeader, RoleTile, TILE_SIZING } from './shared';
import { ShowcaseMotion } from './ShowcaseMotion';
import type { PlacementRole, PlacementShowcase, PlacementsContent, ShowcaseIcon } from './types';
import './placements.css';

/** The floating logos, large: one visual weight (equal ink), at most 160 × 48. */
const FLOAT_SIZING: LogoSizing = { height: 34, maxWidth: 160, maxHeight: 48 };

/** The recruiters' cells: twelve logos at a time (6 × 2 on desktop, 4 × 3 on a tablet, 3 × 4 on a phone). */
const BOXES = 12;

/** The sharp photo, then its blurred copies (`pl-app-blur-*`): behind the logos, then soft and deep toward the copy. */
const PHOTO_LAYERS = ['', 'side', 'soft', 'deep'] as const;

const ICONS: Record<ShowcaseIcon, ReactElement> = {
  rocket: <RocketLaunch />,
  globe: <GlobeHemisphereWest />,
  sparkle: <Sparkle />,
};

/**
 * Placements, the showcase variation: reads top to bottom like a product page
 * (the team's reference: Apple's "Power on full display"): the header with a
 * longer lead and the audited report at its right, level with the title (the
 * team's call); a carousel of claims, after the App Store's Today cards: a
 * photo of the place (Bengaluru's Vidhana Soudha, San Francisco's Golden Gate)
 * framed in the card's grey, a column of the recruiters' logos (or the
 * alumni's roles) floating the card's full height over the photo, and the
 * figure over the claim in white, the photo darkened and blurred at its foot;
 * a row of chips naming the cards at their top left (the team's slideshow
 * card), the chip on show brighter, a line along its foot filling as the
 * card's time runs. The cards crossfade (the team's call), each figure sliding
 * up into its line. Then the recruiters, twelve logos at a time in one box of
 * hairline cells, fading to the next twelve every few seconds.
 *
 * All motion is in ShowcaseMotion; without it only the first card shows and
 * the cells hold their first twelve logos.
 */
export async function PlacementsShowcase({
  eyebrow,
  title,
  lead,
  reportLabel,
  reportHref,
  showcases,
  recruitersTitle,
  roles,
  logos,
  recruiters,
}: PlacementsContent) {
  const resolved = await resolveLogos(
    logos.map(({ name, logoUrl, ink }) => ({ name, logoUrl, ink, wordmark: name })),
    FLOAT_SIZING,
  );
  const byName = new Map(resolved.map((logo) => [logo.name, logo]));
  // The recruiters' cells: every logo we have, smaller, at one visual weight, dealt into sets of
  // twelve; each cell holds its logo from every set, and the cells move on to the next set together.
  const row = await resolveLogos(
    logos.map(({ name, logoUrl, ink }) => ({ name, logoUrl, ink, wordmark: name })),
    TILE_SIZING,
  );

  return (
    <Section density="roomy" aria-labelledby="placements-showcase-title" className="overflow-x-clip">
      <ShowcaseMotion>
        <Container>
          <PlacementsHeader
            eyebrow={eyebrow}
            title={title}
            description={lead}
            titleId="placements-showcase-title"
            asideAt="title"
            aside={
              // The hero's secondary CTA, as it is: large, its download icon after the label; the
              // full width on a phone, as the hero's CTAs are.
              <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                <a href={reportHref}>
                  {reportLabel}
                  <CtaIcon icon="download" />
                </a>
              </Button>
            }
          />

          {/* The cards, with the chips that name them laid over the cards' top left (after the team's
              slideshow card): they stay put as the cards change under them. */}
          <div data-deck className="pl-deck">
            <ul data-carousel className="pl-fade" aria-label="Who hires from SSB">
              {showcases.map((showcase, i) => (
                <li key={showcase.label} aria-label={`${i + 1} of ${showcases.length}`}>
                  <ShowcaseCard
                    showcase={showcase}
                    logos={(showcase.logos ?? []).flatMap((name) => byName.get(name) ?? [])}
                    // Every role, by name: no logos here, so the tiles match the other cards' (the team's call).
                    roles={showcase.roles ? roles : []}
                  />
                </li>
              ))}
            </ul>
            <div data-switch className="pl-chips" role="group" aria-label="Stories">
              <div data-chip-row className="pl-chips-row">
                {showcases.map((showcase, i) => (
                  <button
                    key={showcase.label}
                    type="button"
                    data-carousel-go={i}
                    className="pl-chip type-label"
                  >
                    <span className="pl-chip-icon">{ICONS[showcase.icon]}</span>
                    {showcase.label}
                    {/* The card's time, a line along the chip's foot (carousel.ts fills it). */}
                    <span data-carousel-fill aria-hidden className="pl-chip-fill" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* The recruiters under the cards (the team's call, in place of the four figures' boxes):
              one box of twelve cells, moving on to the next twelve logos together (ShowcaseMotion).
              Screen readers get the deck's full list instead. */}
          <div data-strip className="mt-12 sm:mt-16">
            <Heading as="h3" size="3" className="pl-recruiters-title mb-5">
              {recruitersTitle}
            </Heading>
            <ul className="sr-only">
              {recruiters.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
            <ul data-logo-boxes aria-hidden className="pl-boxes">
              {Array.from({ length: BOXES }, (_, i) => (
                <li key={i} data-logo-box className="pl-box">
                  {row
                    .filter((_, j) => j % BOXES === i)
                    .map((logo) => (
                      <span key={logo.name} data-logo className="pl-box-logo">
                        <LogoImage logo={logo} />
                      </span>
                    ))}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </ShowcaseMotion>
    </Section>
  );
}

/**
 * One card. The frame (`pl-app`, grey) holds the photo, blurred and darkened
 * toward its foot, with the logos (or roles) floating over its right side; at
 * its foot the figure and the claim, in white. `data-story` is wiped open by the entrance; `data-part`
 * marks what rises in, `data-slide` the figure that slides up.
 */
function ShowcaseCard({
  showcase,
  logos,
  roles,
}: {
  showcase: PlacementShowcase;
  logos: ResolvedLogo[];
  roles: PlacementRole[];
}) {
  return (
    <article data-story className="pl-story pl-app">
      <div className="pl-app-inner">
        {/* The photo, behind everything, and three blurred copies of it, each revealed by its own
            gradient, so the photo blurs progressively behind the logos and into the copy. */}
        <div data-part="photo" className="pl-app-media">
          {PHOTO_LAYERS.map((layer) => (
            // eslint-disable-next-line @next/next/no-img-element -- fills its box, so its size can't shift layout
            <img
              key={layer}
              src={showcase.imageUrl}
              srcSet={showcase.imageSrcSet}
              // The card spans the page's content box: 1232px at most.
              sizes="(min-width: 1280px) 1232px, 100vw"
              alt={layer ? '' : showcase.imageAlt}
              aria-hidden={layer ? true : undefined}
              loading="lazy"
              decoding="async"
              className={cn('pl-app-photo', layer && `pl-app-blur pl-app-blur-${layer}`)}
              style={showcase.imagePosition ? { objectPosition: showcase.imagePosition } : undefined}
            />
          ))}
          <span aria-hidden className="pl-app-frost" />
        </div>

        <div className="pl-app-visual">
          <Drift
            className="pl-app-drift"
            tiles={
              roles.length
                ? roles.map((role) => <RoleTile key={role.role + role.company} role={role} large />)
                : logos.map((logo) => <LogoTile key={logo.name} logo={logo} large />)
            }
          />
        </div>

        {/* The figure, and the claim reading on from it as one statement (the team's call). */}
        <div className="pl-app-copy">
          {/* The figure and the claim, one statement, nothing under it (the team's call). */}
          <div className="max-w-(--size-panel-xl)">
            {/* The figure slides up into its line as the card comes round (ShowcaseMotion). */}
            <p className="pl-app-ink pl-slide type-billboard-md">
              <span data-slide>{showcase.statValue}</span>
            </p>
            <Heading data-part="title" as="h3" size="1" className="pl-app-ink pl-app-title mt-1">
              {showcase.title}
            </Heading>
          </div>
        </div>
      </div>
    </article>
  );
}
