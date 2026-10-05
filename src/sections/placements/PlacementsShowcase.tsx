import type { ReactElement } from 'react';
import { Button, Container, Heading, Section, Text, cn } from '@kishanscaler/ssx-ui';
import { GlobeHemisphereWest, RocketLaunch, Sparkle } from '@phosphor-icons/react/ssr';

import { resolveLogos, type LogoSizing, type ResolvedLogo } from '@/lib/logos';
import { CtaIcon } from '@/sections/hero/CtaIcon';
import { Drift, FigureStrip, LogoTile, PlacementsHeader, RoleTile, RollingFigure } from './shared';
import { ShowcaseMotion } from './ShowcaseMotion';
import type { PlacementRole, PlacementShowcase, PlacementsContent, ShowcaseIcon } from './types';
import './placements.css';

/** The floating logos, large: one visual weight (equal ink), at most 160 × 48. */
const FLOAT_SIZING: LogoSizing = { height: 34, maxWidth: 160, maxHeight: 48 };

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
 * team's call); over the cards at their left, a segmented switcher naming
 * each card (Apple's pill tabs), its dark pill sliding to the card on show and
 * filling as the card's time runs; a carousel of claims, after the App Store's
 * Today cards: a photo of the place (Bengaluru's Vidhana Soudha, San
 * Francisco's Golden Gate) framed in the card's grey and fading into it, a tab
 * cut out of the frame naming the card, a column of the recruiters' logos (or
 * the alumni's roles) floating the card's full height over the photo, and the
 * figure over the claim; then the four outcomes, each on a light-grey box, the
 * figures rolling in like counter reels.
 *
 * All motion is in ShowcaseMotion; without it the cards are a plain scroller,
 * the switcher's buttons still work, and the figures show their values.
 */
export async function PlacementsShowcase({
  eyebrow,
  title,
  lead,
  stats,
  reportLabel,
  reportHref,
  showcases,
  roles,
  logos,
  recruiters,
}: PlacementsContent) {
  const resolved = await resolveLogos(
    logos.map(({ name, logoUrl, ink }) => ({ name, logoUrl, ink, wordmark: name })),
    FLOAT_SIZING,
  );
  const byName = new Map(resolved.map((logo) => [logo.name, logo]));

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
              // The hero's secondary CTA, as it is: large, its download icon after the label.
              <Button asChild size="lg" variant="secondary">
                <a href={reportHref}>
                  {reportLabel}
                  <CtaIcon icon="download" />
                </a>
              </Button>
            }
          />

          {/* The switcher over the cards, at their left, under the header's copy. */}
          <div className="mb-6 flex">
            <div data-switch className="pl-switch" role="group" aria-label="Stories">
              {showcases.map((showcase, i) => (
                <button
                  key={showcase.label}
                  type="button"
                  data-carousel-go={i}
                  className="pl-switch-tab type-label"
                >
                  <SwitchLabel showcase={showcase} />
                </button>
              ))}
              {/* The dark pill: a copy of the tabs in light ink on dark, clipped to the active tab
                  (ShowcaseMotion slides the clip), so a label turns light exactly where the pill is. */}
              <div data-switch-pill aria-hidden className="pl-switch-pill">
                {showcases.map((showcase) => (
                  <span key={showcase.label} className="pl-switch-tab type-label">
                    <span data-carousel-fill className="pl-switch-fill" />
                    <SwitchLabel showcase={showcase} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          <ul data-carousel className="pl-carousel pl-carousel-full" aria-label="Who hires from SSB">
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

          {/* The outcomes under the cards, on four light-grey boxes (the team's call). */}
          <FigureStrip stats={stats} boxed />

          <ul className="sr-only">
            {recruiters.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </Container>
      </ShowcaseMotion>
    </Section>
  );
}

function SwitchLabel({ showcase }: { showcase: PlacementShowcase }) {
  return (
    <>
      <span className="pl-switch-icon">{ICONS[showcase.icon]}</span>
      <span className="relative">{showcase.label}</span>
    </>
  );
}

/**
 * One card. The frame (`pl-app`, grey) holds the photo, which fades into that
 * grey at its foot, with the logos (or roles) floating over its right side;
 * under it, the claim (grey, its key phrase in near-black) and the figure. The tab is cut out of the frame at the top left.
 * `data-story` is wiped open by the entrance; `data-part` marks what rises in.
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
          <div className="max-w-(--size-panel-xl)">
            <div data-part="title">
              <RollingFigure value={showcase.statValue} className="pl-app-ink type-billboard-md" />
              <Heading as="h3" size="1" className="pl-app-ink mt-1">
                {showcase.title}
              </Heading>
            </div>
            <Text data-part="description" className="pl-app-muted mt-3">
              {showcase.description}
            </Text>
          </div>
        </div>
      </div>
      <p className="pl-app-tab type-label">{showcase.label}</p>
    </article>
  );
}
