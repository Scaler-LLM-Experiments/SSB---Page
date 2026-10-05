/**
 * L1 atoms. Thin wrappers over ssx-ui atoms: they decide WHICH SSX atom and
 * tone a curriculum concept maps to, and nothing else. Every root carries
 * `c(cfg, id)`, the layer name + overrides from the Lab.
 */
import * as React from 'react';
import { Badge, Heading } from '@kishanscaler/ssx-ui';
import { ArrowRight, Briefcase, CaretDown, CheckCircle, Code, Lightbulb, Plus } from '@phosphor-icons/react';
import type { Lane } from './data';
import { fmt } from './data';
import { c, type JourneyConfig } from './config';
import { useLabels } from './labels';
import { PHOTOS, photoSet, photoSrc } from './photos';

export const LANE_LABEL: Record<Lane, string> = { tech: 'Tech', business: 'Business', shared: 'Shared' };
const LANE_ICON: Record<Lane, React.ReactElement> = {
  tech: <Code aria-hidden="true" />,
  business: <Briefcase aria-hidden="true" />,
  shared: <Lightbulb aria-hidden="true" />,
};

/** "YEAR 02". Monospace only if Brand approves it ([CONFIRM] §10.11). */
export function YearEyebrow({ year, cfg, as: Tag = 'p' }: { year: number; cfg: JourneyConfig; as?: 'p' | 'span' }) {
  const L = useLabels();
  return (
    <Tag className="sj-eyebrow" data-mono={cfg.eyebrowMono || undefined} {...c(cfg, 'eyebrow')}>
      {fmt(L.yearLabel, cfg.eyebrowMono ? String(year).padStart(2, '0') : year)}
    </Tag>
  );
}

/** Lane label: always a word, optionally an icon, never colour alone (§6.1). */
export function LaneLabel({ lane, cfg, count }: { lane: Lane; cfg: JourneyConfig; count?: number }) {
  const L = useLabels();
  const name = { tech: L.laneTech, business: L.laneBusiness, shared: L.laneShared }[lane] ?? LANE_LABEL[lane];
  return (
    <span className="sj-lane" data-lane={lane} {...c(cfg, 'lane')}>
      {cfg.laneIcons ? LANE_ICON[lane] : null}
      <span className="sj-eyebrow" style={{ color: 'inherit' }}>
        {name}
      </span>
      {count !== undefined ? <span className="sj-count sj-eyebrow">{count}</span> : null}
    </span>
  );
}

/**
 * A skill. SSX's naming rule: a label nobody can operate is a Badge, not a
 * Chip, so it cannot look clickable (spec §5 "MUST NOT look clickable").
 * Tech = brand tint. Business = accent1 (SSX's `--color-accent` is the
 * neutral hover grey, which would make Business look Shared). Shared = neutral.
 */
export function SkillBadge({ lane, children, cfg }: { lane: Lane; children: React.ReactNode; cfg: JourneyConfig }) {
  // one neutral pill for every lane: the lane heading already says which is which, and colour stays for photos and actions
  const tone = 'default';
  return (
    <Badge tone={tone} size={cfg.badgeSize} data-lane={lane} {...c(cfg, 'skill')}>
      {children}
    </Badge>
  );
}

/** "10 skills · 6 projects", derived from the arrays (§8: authors never type counts). */
export function SummaryBadge({ parts, cfg }: { parts: string[]; cfg: JourneyConfig }) {
  if (!parts.length) return null;
  return (
    <Badge tone="default" size={cfg.badgeSize} {...c(cfg, 'summary')}>
      {parts.join(' · ')}
    </Badge>
  );
}

/** A programme highlight ("50+ projects across 4 years"). */
export function FactBadge({ children, cfg }: { children: React.ReactNode; cfg: JourneyConfig }) {
  return (
    <Badge tone="default" size="lg" {...c(cfg, 'fact')}>
      {children}
    </Badge>
  );
}

/** A placement role on the fork ("AI Product Manager"). */
export function RoleBadge({ children, cfg }: { children: React.ReactNode; cfg: JourneyConfig }) {
  return (
    <Badge tone="default" size={cfg.badgeSize} {...c(cfg, 'role')}>
      {children}
    </Badge>
  );
}

/** A ticked line ("Demo days with Peak XV, Tiger Global"). */
export function CheckPoint({ children, cfg }: { children: React.ReactNode; cfg: JourneyConfig }) {
  return (
    <li className="sj-point" {...c(cfg, 'point')}>
      <CheckCircle weight="fill" aria-hidden="true" />
      <span>{children}</span>
    </li>
  );
}

/** "What you learn", "What you build": the h4 over each group of an open year. */
export function GroupLabel({ children, cfg }: { children: React.ReactNode; cfg: JourneyConfig }) {
  return (
    <Heading as="h4" size="eyebrow" className="sj-grouplabel" {...c(cfg, 'groupLabel')}>
      {children}
    </Heading>
  );
}

/** The legal line, verbatim (§2.5). */
export function FinePrint({ children, cfg }: { children: React.ReactNode; cfg: JourneyConfig }) {
  return (
    <p className="sj-fine" {...c(cfg, 'fine')}>
      {children}
    </p>
  );
}

const GLYPH = { plus: Plus, caret: CaretDown, arrow: ArrowRight };

/** The 44×44 expand affordance. Decorative: the row button carries the state. */
export function ExpandGlyph({ cfg }: { cfg: JourneyConfig }) {
  const G = GLYPH[cfg.expandGlyph] ?? Plus;
  return (
    <span className="sj-expand" data-glyph={cfg.expandGlyph} aria-hidden="true" {...c(cfg, 'expand')}>
      <G weight="bold" />
    </span>
  );
}

const RATIO: Record<JourneyConfig['visualRatio'], [number, number]> = { '16:10': [800, 500], '16:9': [800, 450], '4:3': [800, 600], '1:1': [640, 640] };

/**
 * Image slot. Renders nothing when there is no art, so the layout holds (§5.1).
 * The overlay (scrim / tint / dark / light) is the `visual` component's
 * override, so every image in the section shares it.
 */
export function Visual({ photo, alt, eager, cfg, ratio }: { photo?: string; alt?: string; eager?: boolean; cfg: JourneyConfig; ratio?: [number, number] }) {
  if (!photo || !PHOTOS[photo]) return null;
  const [w, h] = ratio ?? RATIO[cfg.visualRatio] ?? RATIO['16:10'];
  return (
    <figure className="sj-visual" {...c(cfg, 'visual', { '--sj-ratio': `${w} / ${h}` } as React.CSSProperties)}>
      <img
        src={photoSrc(photo, w, h)}
        srcSet={photoSet(photo, w, h)}
        sizes="(max-width: 767px) 100vw, 480px"
        width={w}
        height={h}
        alt={alt ?? PHOTOS[photo].alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    </figure>
  );
}
