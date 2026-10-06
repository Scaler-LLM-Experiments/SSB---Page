/**
 * L4 sections: arrangements of cards. Each is self-contained and reads only
 * its props, so the layout can reorder them (freeplay).
 */
import * as React from 'react';
import {
  Badge,
  BottomSheet,
  Button,
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetDescription,
  Heading,
  IconButton,
  SegmentedControl,
  SegmentedControlItem,
  SideDrawer,
  SideDrawerBody,
  SideDrawerContent,
  SideDrawerDescription,
  SideDrawerHeader,
  SideDrawerTitle,
  Text,
} from '@kishanscaler/ssx-ui';
import { CaretDown, Compass, Hammer, Pause, Play, RocketLaunch } from '@phosphor-icons/react';
import type { CareerIcon, CareerPrep, Fork, Journey, Project, Year } from './data';
import { fmt } from './data';
import { c, type JourneyConfig } from './config';
import { LaneLabel, SkillBadge } from './atoms';
import { FactList, PortfolioTile, ProjectMediaCard, useLabels } from './parts';
import { SpeedNumber } from './speednumber';
import { SCENES, SceneCanvas } from './scene';
import { YearDetail, YearRow } from './cards';
import { ForkPaths } from './fork';
import { SwipeDeck } from './learn';

/** Width of an element, for the few decisions CSS container queries cannot make (sheet vs inline). */
export function useWidth<T extends HTMLElement>(): [React.RefObject<T | null>, number] {
  const ref = React.useRef<T | null>(null);
  const [w, setW] = React.useState(0);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    setW(el.clientWidth);
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

/* ── Section frame (L0 of the spec) ─────────────────────────────────────── */

/** The section's head. The By year / By discipline toggle shows only when there is a view to switch (`onView`). */
export function SectionFrame({ j, cfg, view, onView, headingId }: { j: Journey; cfg: JourneyConfig; view: string; onView?: (v: string) => void; headingId?: string }) {
  const L = useLabels();
  return (
    <header className="sj-frame" {...c(cfg, 'frame')}>
      <div className="sj-frame-top">
        <div className="sj-frame-text">
          <Heading as="p" size="eyebrow" className="sj-frame-eyebrow">
            {j.eyebrow}
          </Heading>
          <Heading as="h2" size="display" id={headingId}>
            {j.title}
          </Heading>
          <Text size="lg" className="sj-lede">
            {j.lede}
          </Text>
        </div>
        {/* the carousel's arrows land here (the stack concept portals them in), beside the lede as on the faculty section */}
        <div className="sj-frame-controls" data-frame-controls="" />
        {onView ? (
          <SegmentedControl aria-label={L.viewToggle} value={view} onValueChange={(v) => v && onView(v)} {...c(cfg, 'viewToggle')}>
            <SegmentedControlItem value="by-year">{L.byYear}</SegmentedControlItem>
            <SegmentedControlItem value="by-discipline">{L.byDiscipline}</SegmentedControlItem>
          </SegmentedControl>
        ) : null}
      </div>
      {cfg.showFacts ? <FactList facts={j.facts} cfg={cfg} /> : null}
    </header>
  );
}

/* ── Year spine: collapsed years, one open at a time ────────────────────── */

type Portal = HTMLElement | null | undefined;

export function YearSpine({ years, cfg, width, portal, initialOpen = null }: { years: Year[]; cfg: JourneyConfig; width: number; portal?: Portal; initialOpen?: number | null }) {
  const L = useLabels();
  const [open, setOpen] = React.useState<number | null>(initialOpen);
  React.useEffect(() => setOpen(initialOpen), [initialOpen]);
  const rows = React.useRef<Record<number, HTMLButtonElement | null>>({});
  const base = React.useId();
  const narrow = width > 0 && width < 768;
  const wide = width >= 1024;
  const mode: 'sheet' | 'drawer' | 'inline' = narrow ? (cfg.openMobile === 'sheet' ? 'sheet' : 'inline') : cfg.openDesktop === 'drawer' ? 'drawer' : 'inline';
  const spine = narrow ? 'stack' : !wide && cfg.spine === 'rail' ? 'stack' : cfg.spine;
  const openYear = years.find((y) => y.year === open) || null;
  const detailId = (n: number) => `${base}-y${n}`;
  const yl = (n: number) => fmt(L.yearLabel, n);

  const toggle = (n: number) => {
    const next = open === n ? null : n;
    setOpen(next);
    // mobile inline: bring the opened header to the top, under the sticky nav (§4.2)
    if (next && mode === 'inline' && narrow) requestAnimationFrame(() => rows.current[n]?.scrollIntoView({ block: 'start', behavior: 'smooth' }));
  };

  const detail = (y: Year) => (
    <YearDetail
      y={y}
      cfg={cfg}
      id={detailId(y.year)}
      narrow={width < 672}
      onClose={() => {
        setOpen(null);
        rows.current[y.year]?.focus();
      }}
    />
  );
  const inlineUnderRow = mode === 'inline' && spine === 'stack';

  return (
    <div className="sj-spine" data-spine={spine} {...c(cfg, 'spine')}>
      <ol aria-label={L.years}>
        {years.map((y) => (
          <li key={y.year}>
            <YearRow
              ref={(el) => {
                rows.current[y.year] = el;
              }}
              y={y}
              cfg={cfg}
              open={open === y.year}
              controls={detailId(y.year)}
              onToggle={() => toggle(y.year)}
              compact={spine === 'rail'}
            />
            {inlineUnderRow && open === y.year ? (
              <div className="sj-inline" style={{ scrollMarginTop: 72 }}>
                {detail(y)}
              </div>
            ) : null}
          </li>
        ))}
      </ol>

      {mode === 'inline' && !inlineUnderRow && openYear ? (
        <div className="sj-inline" key={openYear.year}>
          {detail(openYear)}
        </div>
      ) : null}
      {mode === 'inline' && spine === 'rail' && !openYear ? (
        <div className="sj-rail-empty" aria-hidden="true">
          <Text size="sm" tone="secondary">
            {L.chooseYear}
          </Text>
        </div>
      ) : null}

      {mode === 'sheet' ? (
        <BottomSheet open={!!openYear} onOpenChange={(o) => !o && setOpen(null)}>
          {openYear ? (
            <BottomSheetContent container={portal ?? undefined}>
              <BottomSheetHeader eyebrow={yl(openYear.year)} closeLabel={fmt(L.close, yl(openYear.year))}>
                <BottomSheetTitle>{openYear.name}</BottomSheetTitle>
                <BottomSheetDescription>{openYear.ship}</BottomSheetDescription>
              </BottomSheetHeader>
              <BottomSheetBody>
                <YearDetail y={openYear} cfg={cfg} id={detailId(openYear.year)} narrow headless />
              </BottomSheetBody>
            </BottomSheetContent>
          ) : null}
        </BottomSheet>
      ) : null}

      {mode === 'drawer' ? (
        <SideDrawer open={!!openYear} onOpenChange={(o) => !o && setOpen(null)}>
          {openYear ? (
            <SideDrawerContent size="wide" container={portal ?? undefined}>
              <SideDrawerHeader eyebrow={yl(openYear.year)} closeLabel={fmt(L.close, yl(openYear.year))}>
                <SideDrawerTitle>{openYear.name}</SideDrawerTitle>
                <SideDrawerDescription>{openYear.ship}</SideDrawerDescription>
              </SideDrawerHeader>
              <SideDrawerBody>
                <YearDetail y={openYear} cfg={cfg} id={detailId(openYear.year)} narrow={false} headless />
              </SideDrawerBody>
            </SideDrawerContent>
          ) : null}
        </SideDrawer>
      ) : null}
    </div>
  );
}

/* ── Threads view: tech and business side by side, every year (§5.3) ────── */

type ThreadRow = { key: string; label: React.ReactNode; name: string; cells: (string[] | null)[]; kind: 'tech' | 'business' | 'text' };

export function ThreadsTable({ years, cfg }: { years: Year[]; cfg: JourneyConfig }) {
  const L = useLabels();
  const [openRows, setOpenRows] = React.useState<string[]>([]);
  const rows: ThreadRow[] = [
    { key: 'tech', name: 'Tech', label: <LaneLabel lane="tech" cfg={cfg} />, kind: 'tech', cells: years.map((y) => (y.skills?.tech.length ? y.skills.tech : null)) },
    { key: 'business', name: 'Business', label: <LaneLabel lane="business" cfg={cfg} />, kind: 'business', cells: years.map((y) => (y.skills?.business.length ? y.skills.business : null)) },
    { key: 'build', name: L.rowBuild, label: <span className="sj-eyebrow">{L.rowBuild}</span>, kind: 'text', cells: years.map((y) => (y.projects.length ? y.projects.map((p) => p.title) : null)) },
    // Industry: Y1–Y3 stay empty until SST publishes where internships sit (§10.7)
    { key: 'industry', name: L.rowIndustry, label: <span className="sj-eyebrow">{L.rowIndustry}</span>, kind: 'text', cells: years.map((y) => (y.split?.some((s) => s.phase === 'Industry') ? [L.industryY4] : null)) },
  ];
  const toggle = (k: string) => setOpenRows((r) => (r.includes(k) ? r.filter((x) => x !== k) : [...r, k]));
  return (
    <div className="sj-threads-wrap" role="region" aria-label={L.byDiscipline} tabIndex={0} {...c(cfg, 'threads')}>
      <table className="sj-threads">
        <thead>
          <tr>
            <td />
            {years.map((y) => (
              <th scope="col" key={y.year}>
                <span className="sj-eyebrow">{fmt(L.yearLabel, y.year)}</span>
                <Text as="span" size="sm" style={{ fontWeight: 600 }}>
                  {y.name}
                </Text>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const isOpen = openRows.includes(r.key);
            return (
              <tr key={r.key}>
                <th scope="row">
                  <button type="button" aria-expanded={isOpen} onClick={() => toggle(r.key)} aria-label={`${r.name}: ${isOpen ? 'show less' : 'show everything'}`}>
                    {r.label}
                    <CaretDown weight="bold" aria-hidden="true" />
                  </button>
                </th>
                {r.cells.map((items, i) => {
                  if (!items)
                    return (
                      <td key={i}>
                        <span className="sj-empty" aria-label="Not published">
                          —
                        </span>
                      </td>
                    );
                  const shown = isOpen ? items : items.slice(0, cfg.threadsLimit);
                  const more = items.length - shown.length;
                  return (
                    <td key={i}>
                      <ul>
                        {shown.map((it) => (
                          <li key={it}>
                            {r.kind === 'text' ? (
                              <Text as="span" size="sm" style={{ display: 'block', width: '100%' }}>
                                {it}
                              </Text>
                            ) : (
                              <SkillBadge lane={r.kind} cfg={cfg}>
                                {it}
                              </SkillBadge>
                            )}
                          </li>
                        ))}
                        {more > 0 ? <li className="sj-more">+{more}</li> : null}
                      </ul>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ── Career prep (SSB): a track alongside every term ──────────────────── */

/**
 * Career prep as graphics, not a wall of numbers. The stats are icon tiles:
 * one featured (a count, the rest are hours, so they are NOT drawn as parts of
 * one bar: they are separate claims). The phases are a track that starts at
 * `start` and runs Clarity → Building → Executing, each an icon node with its
 * activities as pills; across on desktop, down on m-web.
 */
/**
 * The stats as an illustrated bento (after card-section bentos): two rows of
 * two. Career prep hours and domain prep share the first card (the study scene). Each card's illustration acts out
 * its stat while the card is hovered (on touch screens, while it is on
 * screen); the number and label sit under it.
 */
const BENTO_ORDER: CareerIcon[] = ['hours', 'oneToOne', 'interviews', 'behaviour'];
/** stats that share a card with another: domain prep sits in the career-prep-hours card, beside it */
const BENTO_JOIN: Partial<Record<CareerIcon, CareerIcon>> = { domain: 'hours' };

/** bar heights (%) of the decorative voice waveform */
const WAVE = [30, 55, 80, 45, 95, 60, 35, 70, 100, 50, 25, 65, 85, 40, 60, 30, 75, 45];

/**
 * True while the element is hovered (on touch screens: while it is mostly on
 * screen). Native listeners: the Lab portals the section into an iframe, where
 * React's root never hears pointer events.
 */
function usePlay<T extends HTMLElement>(): [React.RefObject<T | null>, boolean] {
  const ref = React.useRef<T | null>(null);
  const [play, setPlay] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const win = el.ownerDocument.defaultView ?? window;
    if (win.matchMedia?.('(hover: none)').matches) {
      const io = new IntersectionObserver(([e]) => setPlay(e.isIntersecting), { threshold: 0.6 });
      io.observe(el);
      return () => io.disconnect();
    }
    const on = () => setPlay(true);
    const off = () => setPlay(false);
    el.addEventListener('pointerenter', on);
    el.addEventListener('pointerleave', off);
    return () => {
      el.removeEventListener('pointerenter', on);
      el.removeEventListener('pointerleave', off);
    };
  }, []);
  return [ref, play];
}

/**
 * The career card's art: a briefcase with a graduation cap (a small flat image),
 * in the card's bottom-right corner, spilling a little past its edges. Still: no hover animation.
 */
const CAREER_ART = { src: '/career/briefcase.webp', w: 560, h: 507 };
function CareerArt() {
  return (
    <span className="sj-cal" style={{ aspectRatio: `${CAREER_ART.w} / ${CAREER_ART.h}` }} aria-hidden="true">
      <img src={CAREER_ART.src} alt="" loading="lazy" decoding="async" />
    </span>
  );
}

function SceneCard({ stats, kind }: { stats: { value: string; label: string }[]; kind: CareerIcon }) {
  const scene = SCENES[kind];
  const [ref, play] = usePlay<HTMLDivElement>();
  return (
    <div ref={ref} className="sj-pb-card" data-k={kind} data-play={play || undefined}>
      {scene ? (
        <div className="sj-pb-art" style={{ aspectRatio: `${scene.w} / ${scene.h}` }}>
          <SceneCanvas scene={scene} active={play} />
          {/* behavioural sessions: a speech bubble over each of them, taking turns */}
          {kind === 'behaviour' ? (
            <>
              <span className="sj-pb-bubble" data-who="a" aria-hidden="true"><i /><i /><i /></span>
              <span className="sj-pb-bubble" data-who="b" aria-hidden="true"><i /><i /><i /></span>
            </>
          ) : null}
        </div>
      ) : null}
      {/* mock interviews: a voice waveform fills the width under the text */}
      {kind === 'interviews' ? (
        <span className="sj-pb-wave" aria-hidden="true">
          {WAVE.map((h, i) => (
            <i key={i} style={{ '--h': h, '--d': i } as React.CSSProperties} />
          ))}
        </span>
      ) : null}
      {/* each stat: the number over its label, top-left (dt stays first in the DOM, CSS moves it);
          a joined card sets its two side by side */}
      <div className="sj-pb-text" data-pair={stats.length > 1 || undefined}>
        {stats.map((s) => (
          <div key={s.label} className="sj-pb-stat">
            <dt>{s.label}</dt>
            <dd>
              <SpeedNumber value={s.value} />
            </dd>
          </div>
        ))}
      </div>
    </div>
  );
}

/** The tab that names each stat card in the desktop showcase. */
const SHOW_TAB: Partial<Record<CareerIcon, string>> = { hours: 'Prep hours', oneToOne: '1:1 solving', interviews: 'Mock interviews', behaviour: 'Behavioural' };
/** How long a card stays before the showcase slides on (the Placements showcase holds for 5s). */
const SHOW_DWELL = 3000;

/**
 * Desktop: the stats as the Placements showcase's sliding cards. A pill switcher names each card,
 * its dark pill sliding to the one on show and filling as that card's time runs; the cards sit in
 * a row and slide across, one at a time. Each card is minimal: its drawing at the right (it acts
 * while its card is on show), the number and what it counts at the lower left. It moves on by
 * itself and waits while the pointer is on it, while it is off screen, and under reduced motion.
 */
function PrepShowcase({ cards }: { cards: [CareerIcon, { value: string; label: string }[]][] }) {
  const [active, setActive] = React.useState(0);
  const [live, setLive] = React.useState(false);
  const root = React.useRef<HTMLDivElement>(null);
  const tabs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const [pill, setPill] = React.useState<{ x: number; w: number } | null>(null);
  React.useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  // the pill sits under the active tab: measured, and again when the row changes size
  React.useLayoutEffect(() => {
    const measure = () => {
      const t = tabs.current[active];
      if (t) setPill({ x: t.offsetLeft, w: t.offsetWidth });
    };
    measure();
    if (typeof ResizeObserver === 'undefined' || !root.current) return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(root.current);
    return () => ro.disconnect();
  }, [active]);
  const n = cards.length;
  return (
    <div ref={root} className="sj-ps" data-live={live || undefined} style={{ '--ps-dwell': `${SHOW_DWELL}ms` } as React.CSSProperties}>
      <div className="sj-ps-switch" role="group" aria-label="Career prep in numbers">
        {pill ? (
          <span className="sj-ps-pill" style={{ transform: `translateX(${pill.x}px)`, width: pill.w }} aria-hidden="true">
            {/* the fill: it runs for the card's time, then the next card comes on (restarts with the card) */}
            <i key={active} onAnimationEnd={() => setActive((a) => (a + 1) % n)} />
          </span>
        ) : null}
        {cards.map(([k], i) => (
          <button
            key={k}
            type="button"
            ref={(el) => {
              tabs.current[i] = el;
            }}
            className="sj-ps-tab"
            aria-current={i === active}
            onClick={() => setActive(i)}
          >
            {SHOW_TAB[k] ?? k}
          </button>
        ))}
      </div>
      <div className="sj-ps-view">
        <ul className="sj-ps-track" style={{ transform: `translateX(${-active * 100}%)` }}>
          {cards.map(([k, stats], i) => {
            const scene = SCENES[k];
            const on = i === active;
            return (
              <li key={k} className="sj-ps-card" data-k={k} aria-hidden={!on || undefined}>
                {scene ? (
                  <div className="sj-ps-art sj-pb-art" style={{ aspectRatio: `${scene.w} / ${scene.h}` }} aria-hidden="true">
                    <SceneCanvas scene={scene} active={on && live} />
                  </div>
                ) : null}
                <dl className="sj-ps-copy">
                  {stats.map((st) => (
                    <div key={st.label} className="sj-ps-stat">
                      <dt>{st.label}</dt>
                      {/* the number as it is: no count-up (the team's call, 2026-10-06) */}
                      <dd>{st.value}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/** a phase's node icon: its own, else by its place (clarity → building → executing) */
const PHASE_ICON: Partial<Record<CareerIcon, React.ComponentType<{ weight?: 'regular'; 'aria-hidden'?: boolean }>>> = { clarity: Compass, building: Hammer, executing: RocketLaunch };
function PhaseIcon({ k, i }: { k?: CareerIcon; i: number }) {
  const Icon = PHASE_ICON[k ?? (['clarity', 'building', 'executing'] as const)[Math.min(i, 2)]] ?? Compass;
  return <Icon weight="regular" aria-hidden />;
}

export function CareerPrepBlock({ prep, cfg }: { prep: CareerPrep; cfg: JourneyConfig }) {
  const id = React.useId();
  // the track fills with scroll: a light brand line runs from the start marker to the
  // last phase as the track passes the middle of the screen, lighting each phase it reaches
  const track = React.useRef<HTMLOListElement>(null);
  const [lit, setLit] = React.useState(-1);
  React.useEffect(() => {
    const el = track.current;
    if (!el) return undefined;
    // no scroll fill: the line is drawn whole and every phase lit; this only measures where it runs
    const still = true;
    let raf = 0;
    let shown = 0; // what is drawn: it glides toward the scroll target, never jumps
    let target = 0;
    const draw = () => {
      raf = 0;
      shown += (target - shown) * (still ? 1 : 0.06);
      if (Math.abs(target - shown) < 0.002) shown = target;
      el.style.setProperty('--p', shown.toFixed(4));
      const nodesNow = Array.from(el.querySelectorAll<HTMLElement>('.sj-cphase-node'));
      const l0 = parseFloat(el.style.getPropertyValue('--l0')) || 0;
      const len = parseFloat(el.style.getPropertyValue('--len')) || 0;
      const vertical = getComputedStyle(el).gridTemplateColumns.split(' ').length === 1;
      const box = el.getBoundingClientRect();
      const reach = l0 + shown * len;
      let k = -1;
      nodesNow.forEach((n, i) => {
        const r = n.getBoundingClientRect();
        if ((vertical ? r.top + r.height / 2 - box.top : r.left + r.width / 2 - box.left) <= reach + 1) k = i;
      });
      setLit(k);
      if (shown !== target) raf = requestAnimationFrame(draw);
    };
    const update = () => {
      const nodes = Array.from(el.querySelectorAll<HTMLElement>('.sj-cphase-node'));
      if (!nodes.length) return;
      const vertical = getComputedStyle(el).gridTemplateColumns.split(' ').length === 1;
      const box = el.getBoundingClientRect();
      const start = el.querySelector<HTMLElement>('.sj-ctrack-start');
      const at = (n: HTMLElement) => {
        const r = n.getBoundingClientRect();
        return vertical ? r.top + r.height / 2 - box.top : r.left + r.width / 2 - box.left;
      };
      // the line runs from just past the start marker (or the first node) to the last node
      const s0 = start ? (vertical ? start.getBoundingClientRect().bottom - box.top + 4 : start.getBoundingClientRect().right - box.left + 4) : at(nodes[0]);
      const s1 = at(nodes[nodes.length - 1]);
      el.style.setProperty('--l0', `${s0}px`);
      el.style.setProperty('--len', `${Math.max(0, s1 - s0)}px`);
      // progress: how far the track has scrolled past the screen's middle (its reading line)
      const line = window.innerHeight * 0.75;
      // the block often ends the page: at the bottom of the page the line is complete
      const atEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
      // spread over ~1.8× the line's length of scrolling, so it fills slowly
      const p = still || atEnd ? 1 : Math.max(0, Math.min(1, (line - (box.top + (vertical ? s0 : 0))) / Math.max(1, (vertical ? s1 - s0 : box.height) * 1.8)));
      target = p;
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const on = () => update();
    update();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, []);
  const fallbackStat: CareerIcon[] = ['hours', 'interviews', 'oneToOne', 'domain', 'behaviour'];
  const card = React.useRef<HTMLDivElement>(null);
  return (
    <section className="sj-career" aria-labelledby={id} {...c(cfg, 'career')}>
      {/* desktop: the bento on the left; the title and the phases down the right, as tall as the bento.
          m-web: title, bento, phases */}
      {/* the block's header, as the page's other sections have: an eyebrow, then the title */}
      <header className="sj-career-header">
        <p className="sj-career-eyebrow">Career prep</p>
        <Heading as="h2" size="display" id={id} className="sj-career-head">
          {prep.title}
        </Heading>
      </header>
      <div className="sj-career-split">
      <div className="sj-career-col">
      {(() => {
        // one card per scene: a joined stat goes into its host's card, after the host's own
        const cards = new Map<CareerIcon, { value: string; label: string }[]>();
        prep.stats.forEach((s, i) => {
          const k = s.icon ?? fallbackStat[i % fallbackStat.length];
          const host = BENTO_JOIN[k] ?? k;
          const list = cards.get(host) ?? [];
          if (host === k) list.unshift(s);
          else list.push(s);
          cards.set(host, list);
        });
        const sorted = [...cards.entries()].sort(([a], [b]) => BENTO_ORDER.indexOf(a) - BENTO_ORDER.indexOf(b));
        return (
          <>
            {/* desktop: the sliding showcase; smaller screens: the bento (CSS shows one of the two) */}
            <PrepShowcase cards={sorted} />
            <dl className="sj-pbento">
              {sorted.map(([k, stats]) => (
                <SceneCard key={k} kind={k} stats={stats} />
              ))}
            </dl>
          </>
        );
      })()}
      </div>
      {/* the phases, unframed: a plain list beside the stats */}
      <div ref={card} className="sj-career-col sj-career-card">
      {/* the phases as a timeline: one after another down a thin line, each with its icon on the
          line, its step, its name and what happens in it */}
      <ol className="sj-tl" aria-label="Career prep phases">
        {prep.phases.map((p, i) => (
          <li key={p.name} className="sj-tl-item">
            <span className="sj-tl-node" aria-hidden="true" />
            <div className="sj-tl-body">
              <b className="sj-tl-name">{p.name}</b>
              {/* what happens in it, as one quiet line */}
              <p className="sj-tl-items">{p.items.join(' · ')}</p>
            </div>
          </li>
        ))}
      </ol>
      </div>
      </div>
    </section>
  );
}

/* ── The fork after Year 4 (§3.3, §4.4): the variants live in fork.tsx ─── */

export function ForkBlock({ fork, cfg, width = 1200 }: { fork: Fork; cfg: JourneyConfig; width?: number }) {
  return <ForkPaths fork={fork} cfg={cfg} width={width} />;
}

/* ── Portfolio (every listed project, §5.5) ─────────────────────────────── */

/**
 * Your portfolio by graduation. One card per listed project (24), never
 * padded to 50 (§5.5). The cards are information, not controls: nothing
 * opens.
 *   carousel  an auto-scrolling, looping row. DEVIATION: §6.4 says no
 *             auto-advancing carousels; built on request for review. It
 *             pauses on hover and keyboard focus, has a Pause / Play button
 *             (WCAG 2.2.2), and under reduced motion it is a still row you
 *             scroll by hand.
 *   bento     flagships as 2 × 2 feature cards · cards: a uniform grid ·
 *   tiles     the compact badge_grid
 */
export function PortfolioGrid({ j, cfg }: { j: Journey; cfg: JourneyConfig; width?: number; portal?: Portal }) {
  const L = useLabels();
  const [filter, setFilter] = React.useState('all');
  const [all, setAll] = React.useState(false);
  const [paused, setPaused] = React.useState(false);
  const hid = React.useId();
  const gridId = React.useId();
  // flagship first within each year, so a feature card leads its year
  const items = j.years.flatMap((y) => [...y.projects].sort((a, b) => Number(!!b.flagship) - Number(!!a.flagship)).map((p) => ({ p, y })));
  if (!items.length) return null;
  const years = j.years.filter((y) => y.projects.length);
  const filtered = filter === 'all' ? items : items.filter((t) => String(t.y.year) === filter);
  const style = cfg.portfolioStyle;
  const limited = style === 'bento' || style === 'cards';
  const shown = !limited || all ? filtered : filtered.slice(0, cfg.portfolioLimit);
  const card = (p: Project, y: Year, feature?: boolean) => <ProjectMediaCard project={p} year={y} cfg={cfg} showYear={cfg.showYearChip} feature={feature} eager={style === 'carousel'} />;
  return (
    <section className="sj-portfolio" data-style={style} aria-labelledby={hid} {...c(cfg, 'portfolio')}>
      <div className="sj-portfolio-head">
        <div style={{ display: 'grid', gap: 4 }}>
          <Heading as="h3" size="2" id={hid}>
            {L.portfolioTitle}
          </Heading>
          <Text size="sm" tone="secondary">
            {j.projectsTotal}
          </Text>
        </div>
        <div className="sj-portfolio-tools">
          {style !== 'tiles' && years.length > 1 ? (
            <SegmentedControl
              aria-label={L.filterProjects}
              value={filter}
              onValueChange={(v) => {
                if (!v) return;
                setFilter(v);
                setAll(false);
              }}
              {...c(cfg, 'portfolioFilter')}
            >
              <SegmentedControlItem value="all">
                {L.filterAll} · {items.length}
              </SegmentedControlItem>
              {years.map((y) => (
                <SegmentedControlItem key={y.year} value={String(y.year)}>
                  {fmt(L.yearLabel, y.year)} · {y.projects.length}
                </SegmentedControlItem>
              ))}
            </SegmentedControl>
          ) : null}
          {style === 'carousel' ? (
            <IconButton variant="secondary" size="md" className="sj-marquee-toggle" aria-label={paused ? L.playProjects : L.pauseProjects} aria-pressed={paused} onClick={() => setPaused((v) => !v)}>
              {paused ? <Play weight="fill" /> : <Pause weight="fill" />}
            </IconButton>
          ) : null}
        </div>
      </div>
      {style === 'tiles' ? (
        <ul className="sj-tiles">
          {items.map(({ p, y }) => (
            <li key={`${y.year}-${p.title}`} style={{ display: 'contents' }}>
              <PortfolioTile project={p} year={y} cfg={cfg} />
            </li>
          ))}
        </ul>
      ) : style === 'carousel' ? (
        <div className="sj-marquee" data-paused={paused || undefined} {...c(cfg, 'marquee')}>
          {/* key: a new filter restarts the loop from its first card */}
          <div className="sj-marquee-track" key={filter} style={{ '--sj-loop': `${Math.max(12, filtered.length * cfg.carouselSpeed)}s` } as React.CSSProperties}>
            {[0, 1].map((copy) => (
              // the second copy only closes the loop seamlessly: hidden from AT and tab order
              <ul key={copy} className="sj-marquee-set" aria-hidden={copy === 1 || undefined} inert={copy === 1 || undefined} aria-label={copy === 0 ? L.portfolioTitle : undefined}>
                {filtered.map(({ p, y }) => (
                  <li key={`${y.year}-${p.title}`} data-flagship={p.flagship || undefined}>
                    {card(p, y)}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      ) : (
        <ul className="sj-mgrid" id={gridId} data-style={style}>
          {shown.map(({ p, y }) => (
            <li key={`${y.year}-${p.title}`} data-feature={(style === 'bento' && p.flagship) || undefined}>
              {card(p, y, style === 'bento' && !!p.flagship)}
            </li>
          ))}
        </ul>
      )}
      {limited && filtered.length > cfg.portfolioLimit ? (
        <div>
          <Button variant="secondary" size="sm" aria-expanded={all} aria-controls={gridId} onClick={() => setAll((v) => !v)}>
            {all ? L.showFewer : fmt(L.showAll, filtered.length)}
          </Button>
        </div>
      ) : null}
    </section>
  );
}
