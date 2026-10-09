import type { ReactElement } from 'react';
import { Button, Container, Heading, Section, cn } from '@kishanscaler/ssx-ui';
import { GlobeHemisphereWest, RocketLaunch, Sparkle } from '@phosphor-icons/react/ssr';

import { resolveLogos, type LogoSizing, type ResolvedLogo } from '@/lib/logos';
import { CtaIcon } from '@/sections/hero/CtaIcon';
import { Drift, LogoImage, LogoTile, PlacementsHeader, RoleTile, TILE_SIZING } from './shared';
import { ShowcaseMotion } from './ShowcaseMotion';
import { PlacementsVariant } from './PlacementsVariant';
import type { PlacementRole, PlacementShowcase, PlacementsContent, ShowcaseIcon } from './types';
import './placements.css';

/** The floating logos, large: one visual weight (equal ink), at most 160 × 48. */
const FLOAT_SIZING: LogoSizing = { height: 34, maxWidth: 160, maxHeight: 48 };

/** The recruiters' cells: twelve logos at a time (6 × 2 on desktop, 4 × 3 on a tablet, 3 × 4 on a phone). */

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
  cohorts,
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

          {/* Variant B (2026-10-09, the team's ask; ?placements=static, PlacementsVariant): one static card,
              the three figures side by side, the recruiters' logos as a horizontal strip across its top;
              no carousel and no chips. Both are rendered; the variant shows one. */}
          <PlacementsVariant />
          <article className="pl-static" aria-label="Placement highlights">
            <div className="pl-static-media" aria-hidden>
              {/* eslint-disable-next-line @next/next/no-img-element -- fills its box */}
              <img src={showcases[0].imageUrl} srcSet={showcases[0].imageSrcSet} sizes="(min-width: 1280px) 1232px, 100vw" alt="" loading="lazy" decoding="async" style={showcases[0].imagePosition ? { objectPosition: showcases[0].imagePosition } : undefined} />
            </div>
            {/* the figures above (2026-10-09), then the logos in two rows drifting opposite ways below */}
            <dl className="pl-static-stats">
              {showcases.map((sc) => (
                <div key={sc.label}>
                  <dd>{sc.statValue}</dd>
                  <dt>{sc.title.replace(/\.$/, '')}</dt>
                </div>
              ))}
            </dl>
            <div className="pl-static-rows" aria-hidden>
              {[0, 1].map((r) => (
                <div key={r} className="pl-static-strip" data-dir={r ? 'back' : undefined}>
                  {[0, 1].map((copy) => (
                    <div key={copy} className="pl-static-set">
                      {resolved.filter((_, k) => k % 2 === r).slice(0, 14).map((logo) => (
                        <span key={logo.name} className="pl-static-logo">
                          <LogoImage logo={logo} />
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </article>

          {/* Variant C (2026-10-09, ?placements=v3): the carousel's card, held still: the photo, the
              logos drifting in two columns at its right, a line naming them where the chips were,
              and all three figures at its foot. */}
          <div className="pl-v3">
            <article className="pl-story pl-app" aria-label="Placement highlights">
              <div className="pl-app-inner">
                <div className="pl-app-media" aria-hidden>
                  {PHOTO_LAYERS.map((layer) => (
                    // eslint-disable-next-line @next/next/no-img-element -- fills its box
                    <img
                      key={layer}
                      src={showcases[0].imageUrl}
                      srcSet={showcases[0].imageSrcSet}
                      sizes="(min-width: 1280px) 1232px, 100vw"
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className={cn('pl-app-photo', layer && `pl-app-blur pl-app-blur-${layer}`)}
                      style={showcases[0].imagePosition ? { objectPosition: showcases[0].imagePosition } : undefined}
                    />
                  ))}
                  <span className="pl-app-frost" />
                </div>
                <p className="pl-v3-title">Companies that have visited Scaler School of Business</p>
                <div className="pl-app-visual">
                  <Drift className="pl-app-drift" tiles={resolved.map((logo) => <LogoTile key={logo.name} logo={logo} large />)} />
                </div>
                <div className="pl-app-copy">
                  <dl className="pl-v3-stats">
                    {showcases.map((sc) => (
                      <div key={sc.label}>
                        <dd>{sc.statValue}</dd>
                        <dt>{sc.title.replace(/\.$/, '')}</dt>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </article>
            {/* the report, a strip under the card (2026-10-09) */}
            <div className="pl-v3-report">
              <p>
                <strong>Placement report</strong>
                <span>Every figure above, cohort by cohort, audited.</span>
              </p>
              <Button asChild size="md" variant="secondary">
                <a href={reportHref}>
                  {reportLabel}
                  <CtaIcon icon="download" />
                </a>
              </Button>
            </div>
          </div>

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

          {/* The highlights, cohort by cohort (feedback, 2026-10-06): one box each. */}
          {cohorts?.length ? (
            <ul className="pl-cohorts">
              {cohorts.map((c) => (
                <li key={c.cohort} className="pl-figure-box">
                  <Heading as="p" size="eyebrow" className="text-content-brand">
                    {c.cohort}
                  </Heading>
                  <p className="type-h1 mt-2 text-content">{c.value}</p>
                  <p className="mt-1 text-content-secondary">{c.label}</p>
                </li>
              ))}
            </ul>
          ) : null}

          {/* The companies under the cards, as one list (no "more hiring partners" split): two rows
              of logos running past in opposite directions, by themselves (CSS; they hold on hover and
              under reduced motion). Screen readers get the deck's full list instead. */}
          <div data-strip className="mt-12 sm:mt-16">
            <Heading as="h3" size="3" className="pl-recruiters-title mb-5">
              {recruitersTitle}
            </Heading>
            <ul className="sr-only">
              {recruiters.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
            <div aria-hidden className="pl-rows">
              {[0, 1].map((r) => {
                const mine = row.filter((_, j) => j % 2 === r);
                return (
                  <div key={r} className="pl-row" data-dir={r ? 'back' : undefined}>
                    {[0, 1].map((copy) => (
                      <div key={copy} className="pl-row-set">
                        {mine.map((logo) => (
                          <span key={logo.name} className="pl-row-logo">
                            <LogoImage logo={logo} />
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
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
