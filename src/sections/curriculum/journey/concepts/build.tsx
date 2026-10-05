/**
 * Concept: the build-up artifact. What you ship literally grows: a web page
 * (Y1), then users and a business model (Y2), then an AI system on data (Y3),
 * then a company (Y4). The spec asks for year visuals that "get visibly more
 * complex each year" (§5.1); here they are drawn from tokens, not photos.
 *
 *   desktop, collapsed   an evolution strip of all four years (the story in
 *                        one glance), one artifact large; the strip is a
 *                        radio group, arrow keys move along it
 *   desktop, open        the artifact comes apart (exploded view): tech on
 *                        one side, business on the other, flagship labelled
 *   m-web                four cards, each with its artifact; one opens into
 *                        the exploded view in the sheet (or inline)
 */
import * as React from 'react';
import { Button, Heading, Text } from '@kishanscaler/ssx-ui';
import { Brain, Buildings, ChartBar, CurrencyInr, Database, RocketLaunch, Sparkle, UsersThree } from '@phosphor-icons/react';
import type { Journey, Lane, Year } from '../data';
import { fmt } from '../data';
import { c, type JourneyConfig } from '../config';
import { LaneLabel, SkillBadge, SummaryBadge, YearEyebrow } from '../atoms';
import { FlagshipCard, OutcomeStrip, summaryParts, useLabels } from '../parts';
import { YearDetail } from '../cards';
import { presentation, useOpenYear, YearOverlay } from './shared';

/* ── L1: artifact pieces ──────────────────────────────────────────────────── */

type PieceId = 'browser' | 'users' | 'price' | 'ai' | 'data' | 'company';
/** Where each piece sits (% of the canvas), when it arrives, and where it flies when exploded. */
type Box = { x: number; y: number; w: number; h: number };
const PIECES: (Box & { id: PieceId; year: 1 | 2 | 3 | 4; dx: number; dy: number; at?: Partial<Record<number, Box>> })[] = [
  // the page fills the canvas in Year 1 and makes room as the product grows around it
  { id: 'browser', year: 1, x: 8, y: 8, w: 58, h: 58, dx: -10, dy: -8, at: { 1: { x: 12, y: 12, w: 76, h: 76 }, 2: { x: 8, y: 10, w: 58, h: 76 } } },
  { id: 'users', year: 2, x: 70, y: 8, w: 24, h: 20, dx: 12, dy: -10, at: { 2: { x: 70, y: 14, w: 24, h: 30 } } },
  { id: 'price', year: 2, x: 70, y: 32, w: 24, h: 14, dx: 16, dy: 0, at: { 2: { x: 70, y: 52, w: 24, h: 20 } } },
  { id: 'ai', year: 3, x: 70, y: 50, w: 24, h: 24, dx: 14, dy: 10 },
  { id: 'data', year: 3, x: 8, y: 70, w: 58, h: 12, dx: -10, dy: 10 },
  { id: 'company', year: 4, x: 4, y: 86, w: 92, h: 11, dx: 0, dy: 16 },
];

/** One piece of the artifact. Pure token drawing, decorative. */
export function ArtPiece({ id, cfg }: { id: PieceId; cfg: JourneyConfig }) {
  const inner: Record<PieceId, React.ReactNode> = {
    browser: (
      <>
        <span className="cb-bar">
          <i />
          <i />
          <i />
          <b />
        </span>
        <span className="cb-page">
          <em className="cb-l1" />
          <em className="cb-l2" />
          <em className="cb-l3" />
          <em className="cb-btn" />
        </span>
      </>
    ),
    users: (
      <>
        <UsersThree weight="duotone" />
        <ChartBar weight="duotone" />
      </>
    ),
    price: <CurrencyInr weight="bold" />,
    ai: (
      <>
        <Brain weight="duotone" />
        <Sparkle weight="fill" className="cb-spark" />
      </>
    ),
    data: (
      <>
        <Database weight="duotone" />
        <Database weight="duotone" />
        <Database weight="duotone" />
      </>
    ),
    company: (
      <>
        <Buildings weight="duotone" />
        <RocketLaunch weight="duotone" />
      </>
    ),
  };
  return (
    <span className="cb-piece" data-piece={id} {...c(cfg, 'artPiece')}>
      {inner[id]}
    </span>
  );
}

/* ── L2: the artifact ─────────────────────────────────────────────────────── */

/** The thing you ship by `level` (1–4): every piece up to that year. `exploded` pulls it apart. */
export function Artifact({ level, cfg, exploded, size = 'lg' }: { level: number; cfg: JourneyConfig; exploded?: boolean; size?: 'sm' | 'lg' }) {
  return (
    <div className="cb-art" data-style={cfg.artifactStyle} data-size={size} data-exploded={exploded || undefined} data-level={level} aria-hidden="true" {...c(cfg, 'artifact')}>
      {PIECES.map((p) => {
        const b = p.at?.[level] ?? p;
        return (
          <span
            key={p.id}
            className="cb-slot"
            data-on={p.year <= level || undefined}
            data-new={p.year === level || undefined}
            style={
              {
                left: `${b.x}%`,
                top: `${b.y}%`,
                width: `${b.w}%`,
                height: `${b.h}%`,
                '--dx': `${p.dx * cfg.explode}cqi`,
                '--dy': `${p.dy * cfg.explode}cqi`,
              } as React.CSSProperties
            }
          >
            <ArtPiece id={p.id} cfg={cfg} />
          </span>
        );
      })}
    </div>
  );
}

/* ── L3: the exploded view ────────────────────────────────────────────────── */

/**
 * The open year: the artifact apart, with what built it around it. Years 1–3:
 * Tech | artifact | Business, shared + flagship below. Year 4 has no skills
 * (§3.2): the journey steps and what SST gives you take the two sides.
 */
export function ExplodedView({ y, cfg, stacked }: { y: Year; cfg: JourneyConfig; stacked?: boolean }) {
  const L = useLabels();
  const flagship = y.projects.find((p) => p.flagship);
  const list = (l: Lane, items: string[]) =>
    items.length ? (
      <div className="cb-callouts" data-lane={l}>
        <LaneLabel lane={l} cfg={cfg} count={items.length} />
        <ul>
          {items.map((s) => (
            <li key={s}>
              <SkillBadge lane={l} cfg={cfg}>
                {s}
              </SkillBadge>
            </li>
          ))}
        </ul>
      </div>
    ) : null;
  const side = (label: string, items: { t: string; d?: string }[], lane: 'tech' | 'business') => (
    <div className="cb-callouts" data-lane={lane}>
      <span className="sj-eyebrow">{label}</span>
      <ol className="cb-textlist">
        {items.map((i) => (
          <li key={i.t}>
            <b>{i.t}</b>
            {i.d ? <span>{i.d}</span> : null}
          </li>
        ))}
      </ol>
    </div>
  );
  const left = y.skills ? list('tech', y.skills.tech) : y.journey ? side(L.journey, y.journey.map((s) => ({ t: s.title, d: s.desc })), 'tech') : null;
  const right = y.skills ? list('business', y.skills.business) : y.youGet ? side(L.youGet, y.youGet.map((p) => ({ t: p.title, d: p.desc })), 'business') : null;
  return (
    <div className="cb-exploded" data-stacked={stacked || undefined} {...c(cfg, 'exploded')}>
      <OutcomeStrip outcome={y.outcome} cfg={cfg} />
      <div className="cb-explode-grid">
        <div className="cb-side" data-side="l">{left}</div>
        <div className="cb-center">
          <Artifact level={y.year} cfg={cfg} exploded />
        </div>
        <div className="cb-side" data-side="r">{right}</div>
      </div>
      {y.skills?.shared.length ? list('shared', y.skills.shared) : null}
      {flagship ? <FlagshipCard project={flagship} cfg={cfg} /> : null}
    </div>
  );
}

/* ── L4: the section ──────────────────────────────────────────────────────── */

const OMIT = ['outcome', 'skills', 'flagship', 'journey', 'perks'] as const;

export function BuildJourney({ j, cfg, width, portal, initialOpen = null }: { j: Journey; cfg: JourneyConfig; width: number; portal?: HTMLElement | null; initialOpen?: number | null }) {
  const L = useLabels();
  const { open, setOpen, toggle, close, opener } = useOpenYear(initialOpen);
  const [sel, setSel] = React.useState(initialOpen ?? 1);
  React.useEffect(() => {
    if (initialOpen) setSel(initialOpen);
  }, [initialOpen]);
  const narrow = width > 0 && width < 768;
  const mode = presentation(cfg, width);
  const base = React.useId();
  const detailId = `${base}-detail`;
  const years = j.years;
  const y = years.find((x) => x.year === sel) ?? years[0];
  const openYear = years.find((x) => x.year === open) ?? null;
  const stops = React.useRef<Record<number, HTMLButtonElement | null>>({});

  const pick = (n: number) => {
    setSel(n);
    if (open) setOpen(n); // an exploded view follows the strip
  };
  const onStripKey = (e: React.KeyboardEvent) => {
    const i = years.findIndex((x) => x.year === sel);
    const next = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? years.length - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const n = years[Math.max(0, Math.min(years.length - 1, next))].year;
    pick(n);
    stops.current[n]?.focus();
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && open) close();
  };

  /* m-web: four cards, each its own artifact */
  if (narrow)
    return (
      <div className="cb-wrap" data-narrow="" onKeyDown={onKey} {...c(cfg, 'build')}>
        <ol className="cb-cards" aria-label={L.years}>
          {years.map((yr) => (
            <li key={yr.year}>
              <button ref={opener(yr.year)} type="button" className="cb-card" aria-expanded={open === yr.year} aria-controls={detailId} onClick={() => toggle(yr.year)} {...c(cfg, 'buildCard')}>
                <Artifact level={yr.year} cfg={cfg} size="sm" />
                <span className="cb-card-text">
                  <YearEyebrow year={yr.year} cfg={cfg} as="span" />
                  <Heading as="h3" size="3" style={{ color: 'inherit' }}>
                    {yr.name}
                  </Heading>
                  <span className="cj-ship">{yr.ship}</span>
                  {cfg.showSummary ? <SummaryBadge parts={summaryParts(yr, L)} cfg={cfg} /> : null}
                </span>
              </button>
              {mode === 'inline' && open === yr.year ? (
                <div className="sj-inline" id={detailId}>
                  <ExplodedView y={yr} cfg={cfg} stacked />
                  <YearDetail y={yr} cfg={cfg} id={`${detailId}-y`} narrow headless omit={[...OMIT]} />
                </div>
              ) : null}
            </li>
          ))}
        </ol>
        {mode !== 'inline' ? (
          <YearOverlay y={openYear} mode={mode} cfg={cfg} portal={portal} id={detailId} onClose={close} lead={openYear ? <ExplodedView y={openYear} cfg={cfg} stacked /> : null} omit={[...OMIT]} />
        ) : null}
      </div>
    );

  /* desktop: strip + stage */
  const exploded = open === y.year;
  return (
    <div className="cb-wrap" onKeyDown={onKey} {...c(cfg, 'build')}>
      <div className="cb-strip" role="radiogroup" aria-label={L.pickYear} onKeyDown={onStripKey} style={{ '--cb-sel': years.findIndex((x) => x.year === sel), '--cb-n': years.length } as React.CSSProperties} {...c(cfg, 'buildStrip')}>
        <span className="cb-track" aria-hidden="true">
          <i />
        </span>
        {years.map((yr) => (
          <button
            key={yr.year}
            ref={(el) => {
              stops.current[yr.year] = el;
            }}
            type="button"
            role="radio"
            aria-checked={sel === yr.year}
            tabIndex={sel === yr.year ? 0 : -1}
            className="cb-stop"
            onClick={() => pick(yr.year)}
            {...c(cfg, 'buildStop')}
          >
            <Artifact level={yr.year} cfg={cfg} size="sm" />
            <span className="cb-stop-text">
              <YearEyebrow year={yr.year} cfg={cfg} as="span" />
              <b>{yr.name}</b>
              <span>{yr.ship}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="cb-stage" data-exploded={exploded || undefined} {...c(cfg, 'buildStage')}>
        {exploded ? (
          <ExplodedView y={y} cfg={cfg} />
        ) : (
          <div className="cb-hero">
            <Artifact level={y.year} cfg={cfg} />
            <div className="cb-hero-text">
              <YearEyebrow year={y.year} cfg={cfg} />
              <Heading as="h3" size="2">
                {y.name}
              </Heading>
              <Text size="base" tone="secondary">
                {y.description}
              </Text>
              {cfg.showSummary ? <SummaryBadge parts={summaryParts(y, L)} cfg={cfg} /> : null}
            </div>
          </div>
        )}
        <div className="cb-actions">
          <Button ref={opener(y.year) as React.Ref<HTMLButtonElement>} variant={exploded ? 'secondary' : 'primary'} aria-expanded={exploded} aria-controls={detailId} onClick={() => toggle(y.year)}>
            {exploded ? L.putBack : L.takeApart}
          </Button>
          <Text as="span" size="sm" tone="secondary">
            {fmt(L.yearLabel, y.year)} · {y.ship}
          </Text>
        </div>
      </div>

      {openYear && mode === 'inline' ? (
        <div className="sj-inline cj-rest" id={detailId} key={openYear.year}>
          <YearDetail y={openYear} cfg={cfg} id={`${detailId}-y`} narrow={width < 672} headless omit={[...OMIT]} />
        </div>
      ) : null}
      {mode === 'drawer' ? <YearOverlay y={openYear} mode="drawer" cfg={cfg} portal={portal} id={detailId} onClose={close} omit={[...OMIT]} /> : null}
    </div>
  );
}
