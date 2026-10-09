import type { CSSProperties, ReactNode } from 'react';
import { Heading, Text, cn } from '@kishanscaler/ssx-ui';

import type { LogoSizing, ResolvedLogo } from '@/lib/logos';
import type { PlacementRole, PlacementStat } from './types';

/** Logos in a grid cell or a wall tile: one visual weight (equal ink), at most 128 × 36. */
export const TILE_SIZING: LogoSizing = { height: 24, maxWidth: 128, maxHeight: 36 };

/**
 * The section header, in the faculty section's type and markup, so it moves
 * the same way (useSectionEntrance animates the `data-enter` parts). `aside`
 * sits at the end of the row on wider screens: level with the bottom of the
 * header (the carousel's arrows), or with `asideAt="title"`, level with the
 * title (the showcase's report). On a phone it comes after the description.
 */
export function PlacementsHeader({
  eyebrow,
  title,
  description,
  titleId,
  aside,
  asideAt = 'end',
}: {
  eyebrow: string;
  title: string;
  description: ReactNode;
  titleId: string;
  aside?: ReactNode;
  asideAt?: 'end' | 'title';
}) {
  const parts = (
    <>
      <Heading as="p" size="eyebrow" className="text-content-brand" data-enter="eyebrow">
        {eyebrow}
      </Heading>
      <Heading
        as="h2"
        size="display"
        id={titleId}
        data-enter="headline"
        className="max-w-(--size-measure-max)"
      >
        {title}
      </Heading>
      <Text size="lg" tone="secondary" data-enter="sub" className="max-w-(--size-measure-max)">
        {description}
      </Text>
    </>
  );
  if (asideAt === 'title') {
    // A grid, so the aside can sit in the title's row: centred on the title, at the right.
    return (
      <div data-enter="header" className="pl-header-grid mb-10 gap-3 sm:mb-12">
        {parts}
        {aside ? (
          <div data-enter="controls" className="pl-header-aside">
            {aside}
          </div>
        ) : null}
      </div>
    );
  }
  return (
    <div
      data-enter="header"
      className="mb-10 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between"
    >
      <div className="flex max-w-(--size-measure-max) flex-col gap-3">{parts}</div>
      {aside ? <div data-enter="controls">{aside}</div> : null}
    </div>
  );
}

/**
 * The outcomes as one quiet strip under a hairline: each figure rolling in
 * (stripEntrance), what it measures under it in grey. Two columns on a phone,
 * four on desktop. `boxed`: each on a light-grey box of its own instead, the
 * figures a step down (the showcase's, the team's call).
 */
export function FigureStrip({ stats, boxed }: { stats: PlacementStat[]; boxed?: boolean }) {
  return (
    <ul
      data-strip
      className={cn(
        'grid grid-cols-2 md:grid-cols-4',
        boxed
          ? 'mt-10 gap-3 sm:mt-12 sm:gap-4'
          : 'mt-10 gap-x-6 gap-y-8 border-t border-border-subtle pt-8 sm:mt-12',
      )}
    >
      {stats.map((stat) => (
        <li key={stat.label} data-strip-item className={cn(boxed && 'pl-figure-box')}>
          <RollingFigure
            value={stat.value}
            // Boxed, a step down, so the card's own figure above leads (the team's call).
            className={cn(boxed ? 'type-h1' : 'type-billboard-sm', 'text-content')}
          />
          <Text tone="secondary" className={cn('text-balance', boxed ? 'mt-1' : 'mt-2')}>
            {stat.label}
          </Text>
        </li>
      ))}
    </ul>
  );
}

/** A figure with its units ("₹", "L", "%", "×", "+") set a step down in grey, so the digits carry it. */
export function Figure({ value, className }: { value: string; className?: string }) {
  const [, lead, digits, tail] = /^(\D*)([\d.,]+)(.*)$/.exec(value) ?? [value, '', value, ''];
  return (
    <p className={className}>
      {lead && <span className="pl-unit pl-unit-lead">{lead}</span>}
      {digits}
      {tail && <span className="pl-unit">{tail}</span>}
    </p>
  );
}

/** Two turns of 0–9: a digit's reel spins through one before it lands on the second. */
const REEL = Array.from({ length: 20 }, (_, i) => i % 10);

/**
 * A figure whose digits roll in like a counter's reels (the motion moves the
 * reels; StoriesMotion). Each digit is a slot the width of its final digit
 * (tabular figures, so every digit fits) with a reel of two turns of 0–9
 * behind it, drawn in its final place, so without the motion (and under
 * reduced motion) it simply shows the value. Screen readers get the value.
 */
export function RollingFigure({ value, className }: { value: string; className?: string }) {
  return (
    <p className={cn('pl-figure', className)}>
      <span className="sr-only">{value}</span>
      <span aria-hidden>
        {[...value].map((char, i) =>
          /\d/.test(char) ? (
            <span key={i} className="pl-roll" data-digit={char}>
              <span className="pl-roll-ghost">{char}</span>
              <span
                className="pl-roll-reel"
                style={{ transform: `translateY(${-(10 + Number(char)) * 5}%)` }}
              >
                {REEL.map((n, j) => (
                  <span key={j}>{n}</span>
                ))}
              </span>
            </span>
          ) : (
            <span key={i}>{char}</span>
          ),
        )}
      </span>
    </p>
  );
}

export function LogoImage({ logo }: { logo: ResolvedLogo }) {
  return logo.src ? (
    // eslint-disable-next-line @next/next/no-img-element -- static files sized from their own proportions
    <img
      src={logo.src}
      alt=""
      width={logo.width}
      height={logo.height}
      decoding="async"
      className={cn(!logo.width && 'h-8 w-auto max-w-40')}
    />
  ) : (
    <span className="type-h3 text-content">{logo.wordmark}</span>
  );
}

/** Each drifting column holds at least this many tiles per copy, so it is taller than its box. */
const MIN_COLUMN = 6;

/**
 * Tiles drifting past in two columns, one up and one down, faded at both ends
 * (CSS: `pl-wall`; paused on hover, still under reduced motion). Short lists
 * repeat until a column is taller than the box, or a gap opens before the copy
 * that makes the loop. Decorative: hidden from screen readers, so give the
 * section an accessible list of what it shows.
 */
export function Drift({ tiles, className }: { tiles: ReactNode[]; className?: string }) {
  const columns = [0, 1].map((c) => {
    const column = tiles.filter((_, i) => i % 2 === c);
    return column.length
      ? Array.from({ length: Math.ceil(MIN_COLUMN / column.length) }, () => column).flat()
      : [];
  });
  return (
    <div data-part="logos" aria-hidden className={cn('pl-wall', className)}>
      {columns.map((column, c) => (
        <div key={c} className="relative">
          <div
            className="pl-wall-track"
            data-dir={c ? 'down' : 'up'}
            style={
              {
                '--wall-duration': `calc(var(--motion-duration-slowest) * ${column.length * 5})`,
              } as CSSProperties
            }
          >
            {[...column, ...column].map((tile, i) => (
              <div key={i} className="pl-wall-tile">
                {tile}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** A logo on a white tile, for a Drift. `large`: a taller tile, for logos sized to match. */
export function LogoTile({ logo, large }: { logo: ResolvedLogo; large?: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-xl bg-surface',
        large ? 'h-20 px-3 sm:h-24 sm:px-5' : 'h-20 px-4',
      )}
    >
      <LogoImage logo={logo} />
    </div>
  );
}

/**
 * An alumnus' role and company on a white tile, for a Drift: the role over the
 * company's logo (small) when `logo` is given, else over the company's name.
 */
export function RoleTile({
  role,
  logo,
  large,
}: {
  role: PlacementRole;
  logo?: ResolvedLogo;
  large?: boolean;
}) {
  const box = cn(
    'flex flex-col justify-center rounded-xl bg-surface',
    large ? 'h-20 px-3 sm:h-24 sm:px-5' : 'h-20 px-4',
  );
  // The role leads; the company's logo sits under it, small, as the secondary line (the team's call).
  // Kept light: the role at the label size, its logo small, on a short tile (the team's call: an
  // h3 role and a big logo read heavy).
  return logo ? (
    <div className="flex h-16 flex-col items-start justify-center gap-1.5 rounded-xl bg-surface px-4">
      <p className="type-label text-content">{role.role}</p>
      {/* The large logos (a showcase's) are drawn smaller still, so both land at one size. */}
      <span className={cn('pl-role-logo', large && 'pl-role-logo-large')}>
        <LogoImage logo={logo} />
      </span>
    </div>
  ) : large ? (
    // Large, without a logo (a showcase's): the shape of the logo tiles beside it, the name centred.
    <div className={cn(box, 'items-center text-center')}>
      <p className="type-label text-content">{role.role}</p>
      <p className="type-caption text-content-secondary">{role.company}</p>
    </div>
  ) : (
    <div className={box}>
      <p className="type-label text-content">{role.role}</p>
      <p className="type-caption text-content-secondary">{role.company}</p>
    </div>
  );
}
