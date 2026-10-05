import type { ReactElement } from 'react';
import { Container, Heading, Icon, Section, Text, cn } from '@kishanscaler/ssx-ui';
import { ArrowsLeftRight, CurrencyInr, Sparkle, TrendUp } from '@phosphor-icons/react/ssr';

import { resolveLogos, type ResolvedLogo } from '@/lib/logos';
import { PlacementsMotion } from './PlacementsMotion';
import { Figure, LogoImage, PlacementsHeader, TILE_SIZING } from './shared';
import type { PlacementIcon, PlacementStat, PlacementsContent } from './types';
import './placements.css';

/** The logo grid: 12 cells (6 × 2 on desktop, 4 × 3 on a tablet, 3 × 4 on a phone). */
const CELLS = 12;

/** Phosphor's light weight: thin, precise lines, in grey. */
const ICONS: Record<PlacementIcon, ReactElement> = {
  currency: <CurrencyInr weight="light" />,
  trend: <TrendUp weight="light" />,
  switch: <ArrowsLeftRight weight="light" />,
  sparkle: <Sparkle weight="light" />,
};

/** Hairlines between the stat cells: a column on a phone, 2 × 2 on a tablet, a row of four on desktop. */
const STAT_RULES = [
  '',
  'border-t sm:border-t-0 sm:border-l',
  'border-t md:border-t-0 md:border-l',
  'border-t sm:border-l md:border-t-0',
];

type CellLogo = { logo: ResolvedLogo; placed?: number };

/**
 * Placements, the grid variation: the founding cohort's outcomes as one tight
 * panel of four stats, then the recruiters on a grid of twelve logos.
 *
 * The header is the faculty section's, in type and motion. The stats are
 * neutral at rest: near-black figures with their units a step down in grey,
 * thin grey icons, solid hairlines between cells. The brand green is only
 * motion: the cells come up one after another, each wiped open from the bottom
 * in green that clears to white as its content fades in. Figures are static.
 *
 * Every few seconds the grid's logos all cross-fade to the next ones together.
 * Pointing at a logo turns its cell over (a 3D flip) to how many of the cohort
 * it hired, on one line, while the other logos step back. All motion is in
 * PlacementsMotion; without it the stats are shown and the grid holds its
 * first logos.
 */
export async function PlacementsSection({
  eyebrow,
  title,
  description,
  stats,
  recruitersTitle,
  logos,
  recruiters,
}: PlacementsContent) {
  const resolved = await resolveLogos(
    logos.map(({ name, logoUrl, ink }) => ({ name, logoUrl, ink, wordmark: name })),
    TILE_SIZING,
  );
  // Logo i goes to cell i % CELLS: the grid opens on the first twelve, then moves on together.
  const cells = Array.from({ length: CELLS }, (_, cell) =>
    resolved.flatMap((logo, i): CellLogo[] =>
      i % CELLS === cell ? [{ logo, placed: logos[i].placed }] : [],
    ),
  ).filter((list) => list.length);

  return (
    <Section density="roomy" aria-labelledby="placements-grid-title">
      <PlacementsMotion>
        <Container>
          <PlacementsHeader
            eyebrow={eyebrow}
            title={title}
            description={description}
            titleId="placements-grid-title"
          />

          <ul className="grid overflow-hidden rounded-2xl border border-border-subtle bg-surface sm:grid-cols-2 md:grid-cols-4">
            {stats.map((stat, i) => (
              <StatCell key={stat.label} stat={stat} className={STAT_RULES[i]} />
            ))}
          </ul>

          <div data-fade className="mt-12 sm:mt-16">
            <Heading as="h3" size="eyebrow" className="mb-4 text-content-secondary">
              {recruitersTitle}
            </Heading>
            <ul className="sr-only">
              {recruiters.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
            <div
              data-logo-grid
              aria-hidden
              className="pl-grid grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border-subtle bg-border-subtle sm:grid-cols-4 md:grid-cols-6"
            >
              {cells.map((list, i) => (
                <div key={i} data-logo-cell className="pl-cell relative h-20 bg-surface sm:h-24">
                  <div data-flipper className="pl-flipper absolute inset-0">
                    <div className="pl-face absolute inset-0 bg-surface">
                      {list.map(({ logo }, j) => (
                        <div
                          key={logo.name}
                          data-front={j}
                          className={cn(
                            'absolute inset-0 flex items-center justify-center px-3 sm:px-4',
                            j > 0 && 'invisible',
                          )}
                        >
                          <LogoImage logo={logo} />
                        </div>
                      ))}
                    </div>
                    <div className="pl-face pl-face-back absolute inset-0 bg-surface-sunken">
                      {list.map(({ logo, placed }, j) => (
                        <div
                          key={logo.name}
                          data-back={j}
                          data-placed={placed ? '' : undefined}
                          className={cn(
                            'absolute inset-0 flex flex-wrap items-baseline justify-center content-center gap-x-1.5 px-3 text-center',
                            j > 0 && 'invisible',
                          )}
                        >
                          {placed ? (
                            <>
                              <span className="type-h2 tabular-nums text-content">{placed}</span>
                              <span className="type-caption text-content-secondary">
                                {placed === 1 ? 'student' : 'students'} placed
                              </span>
                            </>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </PlacementsMotion>
    </Section>
  );
}

/**
 * One stat in the panel, tight: its icon, the figure, what it measures and a
 * short line. `data-card` is wiped open and `data-card-tint` is the green it
 * comes up in (clear at rest).
 */
function StatCell({ stat, className }: { stat: PlacementStat; className?: string }) {
  return (
    <li data-card className={cn('relative isolate border-border-subtle', className)}>
      <div data-card-body className="flex h-full flex-col p-5 sm:p-6">
        <Icon size="md" className="text-content-secondary">
          {ICONS[stat.icon]}
        </Icon>
        <Figure value={stat.value} className="mt-6 type-billboard-sm text-content" />
        <p className="mt-2 type-label text-content">{stat.label}</p>
        <Text size="sm" tone="secondary" className="mt-0.5">
          {stat.description}
        </Text>
      </div>
      <span data-card-tint aria-hidden className="pl-tint" />
    </li>
  );
}
