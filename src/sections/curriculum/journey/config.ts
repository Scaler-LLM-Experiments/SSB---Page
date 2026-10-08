/**
 * Every knob the Lab exposes. Two kinds, as in Figma:
 *
 *   - Variant props (flat fields below): which variant of a component renders.
 *     A knob belongs to one component; everything built from it follows.
 *   - Overrides (`comp`): per-component auto-layout, appearance, text and
 *     overlay values, keyed by component id (registry.tsx). Editing one edits
 *     the main component, so every instance on the page changes.
 *
 * The `decisions` group mirrors the spec's open [CONFIRM] items (§10) so each
 * answer can be previewed before it is signed off.
 */
import type * as React from 'react';

export type Brand = 'sst' | 'ssb';
export type BlockId = 'frame' | 'journey' | 'ai' | 'learn' | 'fork' | 'career' | 'portfolio' | 'fine';

export interface JourneyConfig {
  // L0 tokens (these override SSX tokens on the section root)
  brand: Brand; // SST blue / SSB green primary
  theme: 'light' | 'dark';
  radius: number; // × SSX radius scale
  density: number; // × section spacing
  // L1 atoms
  businessTone: 'yellowSubtle' | 'brand' | 'default';
  badgeSize: 'sm' | 'md' | 'lg';
  eyebrowMono: boolean; // [CONFIRM] §10.11
  laneIcons: boolean;
  expandGlyph: 'plus' | 'caret' | 'arrow';
  visualRatio: '16:10' | '16:9' | '4:3' | '1:1';
  // L2 molecules
  outcomeStyle: 'tint' | 'rule' | 'solid';
  flagshipStyle: 'media' | 'overlay' | 'inverted' | 'plain';
  projectStyle: 'media' | 'cards' | 'list';
  mediaRatio: '4:3' | '16:9' | '3:2' | '1:1'; // project media cards
  showYearChip: boolean; // year chip on portfolio card images
  perkStyle: 'card' | 'plain';
  // L3 cards
  showVisual: boolean;
  showSummary: boolean;
  invertOpen: boolean; // navy "inverted card" for the open year (desktop)
  rowLayout: 'stacked' | 'cover' | 'side';
  pathStyle: 'card' | 'outline';
  forkStyle: 'reveal' | 'cover' | 'branch' | 'split' | 'cards' | 'transform';
  forkScrim: number; // 0–1, how dark the photo overlay is under text
  // L4 sections
  spine: 'rail' | 'row' | 'stack';
  openDesktop: 'inline' | 'drawer'; // [CONFIRM] §10.9
  openMobile: 'sheet' | 'inline';
  projectLimit: number;
  threadsLimit: number;
  showFacts: boolean;
  portfolioStyle: 'carousel' | 'bento' | 'cards' | 'tiles';
  carouselSpeed: number; // seconds each card takes to pass
  portfolioLimit: number; // cards before "Show all"
  // concepts (the year journey's interaction model)
  concept: 'classic' | 'build' | 'stack';
  artifactStyle: 'wire' | 'filled';
  explode: number; // × how far the exploded view pulls pieces apart
  stackFan: number; // degrees between fanned cards
  /** the terms as the phones' stacking cards at every width (an experiment, /v2-stack) */
  termsStack?: boolean;
  /** In class as an accordion instead of columns (the /v2-stack experiment's second version) */
  inClassAccordion?: boolean;
  /** v3: a short stacked card; In class and Out of class in a no-scroll sheet */
  termsSheet?: boolean;
  stackOpen: 'expand' | 'modal' | 'sheet'; // unfold in place, morph into a centred modal, or rise as a bottom sheet
  aiLayout: 'stack' | 'carousel'; // desktop AI journey: heading pinned left + cards stacking on scroll, or a carousel
  sheetTrigger: 'click' | 'peek' | 'hover'; // desktop sheet: open on click; hover peeks a strip, click opens; or open on hover (stays open until closed)
  // L5 layout
  view: 'by-year' | 'by-discipline';
  blockGap: number; // px, desktop (mobile uses 2/3)
  maxWidth: number;
  blocks: { id: BlockId; on: boolean }[];
  // decisions [CONFIRM]
  industryCompulsory: boolean; // §10.2
  y1Alt: boolean; // §10.5
  fixPersonas: boolean; // §7.1
  empty: 'none' | 'no-skills' | 'no-outcomes' | 'no-visuals' | 'no-projects';
  // per-component overrides
  comp: Partial<Record<string, CompStyle>>;
}

/**
 * Overrides on one component. Unset = the component's own value (shown as
 * "auto" in the panel). Colours are SSX token names, never hex.
 */
export interface CompStyle {
  hidden?: boolean;
  // auto layout
  gap?: number;
  padX?: number;
  padY?: number;
  align?: 'start' | 'center' | 'end' | 'stretch';
  cols?: number; // desktop (container ≥ 768)
  colsM?: number; // m-web (container < 768)
  width?: 'hug' | 'fill';
  // appearance
  fill?: Fill;
  border?: number;
  borderTone?: 'subtle' | 'strong' | 'brand' | 'control';
  radius?: number;
  shadow?: 'none' | 'raised' | 'overlay';
  opacity?: number;
  // text
  text?: number; // × every type role inside
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  // overlay (image components)
  overlay?: 'none' | 'scrim' | 'tint' | 'dark' | 'light';
  overlayOpacity?: number;
}

export type Fill = 'none' | 'page' | 'raised' | 'subtle' | 'sunken' | 'tint' | 'brand' | 'solid' | 'inverse' | 'accent';

export const DEFAULT_BLOCKS: JourneyConfig['blocks'] = [
  { id: 'frame', on: true },
  { id: 'journey', on: true },
  { id: 'fork', on: true },
  { id: 'career', on: true },
  { id: 'portfolio', on: true },
  { id: 'fine', on: true },
  // a separate section after the curriculum: always last (see normalize)
  { id: 'ai', on: true },
  // SSB: Learn by doing, the two challenge videos, after the AI journey
  { id: 'learn', on: true },
];

export const DEFAULT_CONFIG: JourneyConfig = {
  brand: 'sst',
  theme: 'light',
  radius: 1,
  density: 1,
  businessTone: 'yellowSubtle',
  badgeSize: 'md',
  eyebrowMono: true,
  laneIcons: true,
  expandGlyph: 'plus',
  visualRatio: '16:10',
  outcomeStyle: 'tint',
  flagshipStyle: 'media',
  projectStyle: 'media',
  mediaRatio: '4:3',
  showYearChip: true,
  perkStyle: 'card',
  showVisual: true,
  showSummary: true,
  invertOpen: false,
  rowLayout: 'stacked',
  pathStyle: 'card',
  forkStyle: 'transform',
  forkScrim: 0.75,
  spine: 'row',
  openDesktop: 'inline',
  openMobile: 'sheet',
  projectLimit: 6,
  threadsLimit: 2,
  showFacts: false,
  portfolioStyle: 'carousel',
  carouselSpeed: 5,
  portfolioLimit: 8,
  concept: 'stack',
  artifactStyle: 'filled',
  explode: 1,
  stackFan: 4,
  stackOpen: 'sheet',
  sheetTrigger: 'hover',
  aiLayout: 'stack',
  view: 'by-year',
  blockGap: 48,
  maxWidth: 1280,
  blocks: DEFAULT_BLOCKS,
  industryCompulsory: true,
  y1Alt: false,
  fixPersonas: false,
  empty: 'none',
  comp: {},
};

export const LEVELS = [
  { n: 0, key: 'tokens', name: 'Tokens' },
  { n: 1, key: 'atoms', name: 'Atoms' },
  { n: 2, key: 'molecules', name: 'Molecules' },
  { n: 3, key: 'cards', name: 'Cards' },
  { n: 4, key: 'sections', name: 'Sections' },
  { n: 5, key: 'layout', name: 'Layout' },
] as const;

/* ── overrides → DOM ──────────────────────────────────────────────────────── */

const FILL: Record<Fill, [bg: string, fg?: string]> = {
  none: ['transparent'],
  page: ['var(--surface-page)'],
  raised: ['var(--surface-raised)'],
  subtle: ['var(--surface-subtle)'],
  sunken: ['var(--surface-sunken)'],
  tint: ['var(--brand-tint-surface)', 'var(--brand-tint-content)'],
  brand: ['var(--surface-brand-subtle)', 'var(--content-brand)'],
  solid: ['var(--surface-brand-solid)', 'var(--content-on-brand-solid)'],
  inverse: ['var(--surface-inverse)', 'var(--content-inverse)'],
  accent: ['var(--accent1-surface)', 'var(--accent1-content)'],
};
const TONE = { subtle: 'var(--border-subtle)', strong: 'var(--border-strong)', brand: 'var(--border-brand)', control: 'var(--border-control)' };
const SHADOW = { none: 'none', raised: 'var(--shadow-raised)', overlay: 'var(--shadow-overlay)' };
const WEIGHT = { regular: '400', medium: '500', semibold: '600', bold: '700' };
const OVERLAY = {
  none: 'none',
  scrim: 'linear-gradient(180deg, transparent 30%, rgb(0 0 0 / 0.85))',
  tint: 'var(--surface-brand-solid)',
  dark: 'rgb(0 0 0)',
  light: 'rgb(255 255 255)',
};

export type CProps = { 'data-c': string; 'data-o'?: string; style?: React.CSSProperties };

/**
 * Spread onto a component's root: `<div className="sj-x" {...c(cfg, 'x')}>`.
 * `data-c` names the layer (inspect, x-ray, selection); `data-o` lists the
 * overridden properties, and journey.css applies only those, so an unset
 * value leaves the component's own CSS untouched.
 */
export function c(cfg: Pick<JourneyConfig, 'comp'>, id: string, style?: React.CSSProperties): CProps {
  const s = cfg.comp?.[id];
  const out: CProps = { 'data-c': id };
  if (!s) {
    if (style) out.style = style;
    return out;
  }
  const o: string[] = [];
  const v: Record<string, string | number> = {};
  const put = (flag: string, name: string, val: string | number) => {
    o.push(flag);
    v[`--c-${name}`] = val;
  };
  if (s.hidden) o.push('hide');
  if (s.gap != null) put('gap', 'gap', `${s.gap}px`);
  if (s.padX != null) put('px', 'px', `${s.padX}px`);
  if (s.padY != null) put('py', 'py', `${s.padY}px`);
  if (s.align) put('align', 'align', s.align);
  if (s.cols) put('cols', 'cols', s.cols);
  if (s.colsM) put('colsm', 'colsm', s.colsM);
  if (s.width) put('w', 'w', s.width === 'fill' ? '100%' : 'fit-content');
  if (s.fill) {
    const [bg, fg] = FILL[s.fill];
    put('bg', 'bg', bg);
    if (fg) put('fg', 'fg', fg);
  }
  if (s.border != null) put('bw', 'bw', `${s.border}px`);
  if (s.borderTone) put('bc', 'bc', TONE[s.borderTone]);
  if (s.radius != null) put('r', 'r', `${s.radius}px`);
  if (s.shadow) put('sh', 'sh', SHADOW[s.shadow]);
  if (s.opacity != null && s.opacity < 1) put('op', 'op', s.opacity);
  if (s.text != null && s.text !== 1) put('ts', 'ts', s.text);
  if (s.weight) put('fw', 'fw', WEIGHT[s.weight]);
  if (s.overlay && s.overlay !== 'none') {
    put('ov', 'ov', OVERLAY[s.overlay]);
    v['--c-ovop'] = s.overlayOpacity ?? (s.overlay === 'scrim' ? 1 : 0.4);
  }
  if (o.length) out['data-o'] = o.join(' ');
  out.style = { ...(v as React.CSSProperties), ...style };
  return out;
}

/** Custom properties on the section root: the L0 token multipliers. */
export function rootStyle(cfg: JourneyConfig): React.CSSProperties {
  return {
    '--sj-radius': cfg.radius,
    '--sj-density': cfg.density,
    '--sj-gap-web': `${cfg.blockGap}px`,
    '--sj-max': `${cfg.maxWidth}px`,
  } as React.CSSProperties;
}

/** Old saved configs predate some fields: fill them from the defaults. */
export function normalize(raw: Partial<JourneyConfig> | undefined): JourneyConfig {
  const cfg = { ...DEFAULT_CONFIG, ...raw, comp: { ...raw?.comp } };
  const known = new Set(DEFAULT_BLOCKS.map((b) => b.id));
  const blocks = (raw?.blocks || []).filter((b) => known.has(b.id));
  // a block added since the save goes in at its default place, not at the end
  DEFAULT_BLOCKS.forEach((b, i) => {
    if (!blocks.some((x) => x.id === b.id)) blocks.splice(Math.min(i, blocks.length), 0, b);
  });
  // the AI journey is its own section after the curriculum: keep it at the end
  const ai = blocks.findIndex((b) => b.id === 'ai');
  if (ai >= 0 && ai !== blocks.length - 1) blocks.push(...blocks.splice(ai, 1));
  // ...followed by Learn by doing
  const learn = blocks.findIndex((b) => b.id === 'learn');
  if (learn >= 0 && learn !== blocks.length - 1) blocks.push(...blocks.splice(learn, 1));
  cfg.blocks = blocks;
  // saved before media cards existed: 'cards' was only the old default, move it to 'media'
  if (raw && raw.mediaRatio === undefined && raw.projectStyle === 'cards') cfg.projectStyle = 'media';
  // the stack's flip option is gone: old saves with it (or nothing) expand
  if (cfg.stackOpen !== 'expand' && cfg.stackOpen !== 'modal' && cfg.stackOpen !== 'sheet') cfg.stackOpen = 'expand';
  if (cfg.aiLayout !== 'stack' && cfg.aiLayout !== 'carousel') cfg.aiLayout = 'stack';
  if (cfg.sheetTrigger !== 'click' && cfg.sheetTrigger !== 'peek' && cfg.sheetTrigger !== 'hover') cfg.sheetTrigger = 'click';
  // v1 is Stack only (the stakeholders' choice, 2026-09-28): old saves say braid
  cfg.concept = 'stack';
  return cfg;
}
