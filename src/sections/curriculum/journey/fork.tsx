/**
 * The fork after Year 4 (§3.3, §4.4): founder or placements. Four ways to
 * show the two paths, all from the same fork data:
 *
 *   cover    image-covered cards: the photo is the card, text on a scrim
 *   branch   an animated fork: a line comes down, splits and draws itself
 *            to each card as the section scrolls into view (once per entry)
 *   split    expanding panels: the active path widens and reveals its
 *            points; hover previews, click / Enter locks
 *   cards    the plain cards (PathCard)
 *   transform  after a "magic transform": one card (both paths) travels in
 *            from the left into a glowing axis and comes out the other side
 *            as the two path cards with their photos (Stack concept, desktop;
 *            otherwise reveal)
 *
 * The safety net stays a single line under the fork, never a card (§4.4).
 */
import * as React from 'react';
import { Heading, Text } from '@kishanscaler/ssx-ui';
import { ArrowRight, ArrowsIn, CaretDown, CheckCircle, GitFork, Pause, Play } from '@phosphor-icons/react';
import type { Fork } from './data';
import { c, type JourneyConfig } from './config';
import { RoleBadge, Visual } from './atoms';
import { PathCard } from './cards';
import { useLabels } from './parts';

type Path = Fork['paths'][number];

/** Roles + points, as chips (used on photos, where a ticked list reads poorly). */
export function PathDetails({ path, cfg }: { path: Path; cfg: JourneyConfig }) {
  return (
    <>
      {path.roles ? (
        <ul className="sj-roles" aria-label="Roles">
          {path.roles.map((r) => (
            <li key={r} style={{ display: 'contents' }}>
              <RoleBadge cfg={cfg}>{r}</RoleBadge>
            </li>
          ))}
        </ul>
      ) : null}
      <ul className="sj-pointchips">
        {path.points.map((pt) => (
          <li key={pt} {...c(cfg, 'point')}>
            <CheckCircle weight="fill" aria-hidden="true" />
            {pt}
          </li>
        ))}
      </ul>
    </>
  );
}

/* ── cover ────────────────────────────────────────────────────────────────── */

/** A path as an image-covered card: photo fills it, text sits on the scrim (surface-ink: on-image). */
export function PathCover({ path, cfg }: { path: Path; cfg: JourneyConfig }) {
  return (
    <article className="sj-pathcover" data-path={path.id} data-surface-ink={path.image ? 'on-image' : undefined} {...c(cfg, 'pathCover')}>
      <Visual photo={path.image} cfg={cfg} ratio={[960, 720]} />
      <div className="sj-pathcover-body">
        <Heading as="h3" size="2" style={{ color: 'inherit' }}>
          {path.title}
        </Heading>
        <Text size="base" style={{ color: 'inherit', opacity: 0.9 }}>
          {path.desc}
        </Text>
        <PathDetails path={path} cfg={cfg} />
      </div>
    </article>
  );
}

/* ── branch ───────────────────────────────────────────────────────────────── */

type Seg = { d: string };

/** The fork drawn as it happens: one line splits into two, then the cards arrive. */
function BranchFork({ fork, cfg, narrow }: { fork: Fork; cfg: JourneyConfig; narrow: boolean }) {
  const root = React.useRef<HTMLDivElement>(null);
  const head = React.useRef<HTMLButtonElement>(null);
  const cards = React.useRef<(HTMLDivElement | null)[]>([]);
  const [segs, setSegs] = React.useState<Seg[]>([]);
  const [size, setSize] = React.useState({ w: 0, h: 0 });
  // idle: shown as-is (no observer yet, or none) · armed: hidden, waiting · drawn: animating in
  const [phase, setPhase] = React.useState<'idle' | 'armed' | 'drawn'>('idle');

  // geometry: from the fork icon to each card
  React.useLayoutEffect(() => {
    const el = root.current;
    if (!el) return undefined;
    const measure = () => {
      const box = el.getBoundingClientRect();
      const h = head.current?.getBoundingClientRect();
      if (!h) return;
      const x0 = h.left + h.width / 2 - box.left;
      const y0 = h.bottom - box.top + 4;
      const next: Seg[] = cards.current.map((card) => {
        if (!card) return { d: '' };
        const r = card.getBoundingClientRect();
        if (narrow) {
          const y = r.top - box.top + 34;
          return { d: `M${x0} ${y0} V${y - 14} Q${x0} ${y} ${x0 + 14} ${y} H${r.left - box.left - 2}` };
        }
        const x1 = r.left + r.width / 2 - box.left;
        const y1 = r.top - box.top - 2;
        const mid = y0 + (y1 - y0) * 0.45;
        return { d: `M${x0} ${y0} V${mid} C${x0} ${mid + 24} ${x1} ${mid - 6} ${x1} ${mid + 30} V${y1}` };
      });
      setSegs(next);
      setSize({ w: el.clientWidth, h: el.clientHeight });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [narrow, fork]);

  // draw when a third of it is on screen; reset once fully off, so it replays
  React.useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined; // stays idle: fully visible
    const io = new IntersectionObserver(
      ([e]) => {
        // only hide it once we KNOW it is off screen, so a missing observer never hides content
        if (e.intersectionRatio === 0) setPhase('armed');
        else if (e.intersectionRatio >= 0.3) setPhase((p) => (p === 'armed' ? 'drawn' : p));
      },
      { threshold: [0, 0.3] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const replay = () => {
    setPhase('armed');
    window.setTimeout(() => setPhase('drawn'), 40);
  };

  return (
    <div ref={root} className="sj-branch" data-phase={phase} data-narrow={narrow || undefined} {...c(cfg, 'forkBranch')}>
      <p className="sj-fork-head">
        <button ref={head} type="button" className="sj-fork-icon" onClick={replay} aria-label="Replay the fork">
          <GitFork weight="bold" aria-hidden="true" />
        </button>
        <Text as="span" size="base" style={{ fontWeight: 600, color: 'var(--content-primary)' }}>
          {fork.intro}
        </Text>
      </p>
      <svg className="sj-branch-lines" width={size.w} height={size.h} aria-hidden="true">
        {segs.map((s, i) => (
          <path key={i} d={s.d} pathLength={1} data-i={i} data-path={fork.paths[i]?.id} {...c(cfg, 'thread')} />
        ))}
      </svg>
      <div className="sj-fork-paths" data-style="branch">
        {fork.paths.map((p, i) => (
          <div
            key={p.id}
            className="sj-branch-card"
            data-i={i}
            ref={(el) => {
              cards.current[i] = el;
            }}
          >
            <PathCard path={p} cfg={cfg} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── split ────────────────────────────────────────────────────────────────── */

/**
 * Expanding panels. Both titles are always visible (the choice is the story).
 * Hover previews a path; click or Enter / Space locks it; click again unlocks.
 * Each panel's head is a disclosure button inside its h3 (the accordion
 * pattern), so the details region is reachable and announced.
 */
function SplitFork({ fork, cfg }: { fork: Fork; cfg: JourneyConfig }) {
  const [locked, setLocked] = React.useState<string | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const active = locked ?? preview;
  const base = React.useId();
  return (
    <div className="sj-panels" data-active={active || undefined} onMouseLeave={() => setPreview(null)} {...c(cfg, 'forkSplit')}>
      {fork.paths.map((p) => {
        const on = active === p.id;
        const id = `${base}-${p.id}`;
        return (
          <div
            key={p.id}
            className="sj-panel"
            data-path={p.id}
            data-on={on || undefined}
            data-dim={(active && !on) || undefined}
            data-surface-ink={p.image ? 'on-image' : undefined}
            onMouseEnter={() => setPreview(p.id)}
            onClick={(e) => {
              if ((e.target as HTMLElement).closest('button')) return; // the head button handles itself
              setLocked((l) => (l === p.id ? null : p.id));
            }}
            {...c(cfg, 'forkPanel')}
          >
            <Visual photo={p.image} cfg={cfg} ratio={[960, 720]} />
            <div className="sj-panel-body">
              <h3 className="sj-panel-title">
                <button type="button" aria-expanded={on} aria-controls={id} onClick={() => setLocked((l) => (l === p.id ? null : p.id))}>
                  <span>{p.title}</span>
                  <CaretDown weight="bold" aria-hidden="true" />
                </button>
              </h3>
              <Text size="base" style={{ color: 'inherit', opacity: 0.9 }}>
                {p.desc}
              </Text>
              <div id={id} className="sj-panel-more" data-open={on || undefined} inert={!on || undefined}>
                <div>
                  <PathDetails path={p} cfg={cfg} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── reveal ───────────────────────────────────────────────────────────────── */

/** A spring (critically under-damped): overshoots ~16%, settles. linear() where supported. */
const SPRING =
  typeof CSS !== 'undefined' && CSS.supports?.('transition-timing-function', 'linear(0, 1)')
    ? 'linear(0, 0.009, 0.035 2.1%, 0.141, 0.281 6.7%, 0.723 12.9%, 0.938 16.7%, 1.017, 1.077, 1.121, 1.149 24.3%, 1.159, 1.163, 1.161, 1.154 29.9%, 1.129 32.8%, 1.051 39.6%, 1.017 43.1%, 0.991, 0.977 51%, 0.974 53.8%, 0.975 57.1%, 0.997 69.8%, 1.003 76.9%, 1)'
    : 'cubic-bezier(0.34, 1.56, 0.64, 1)';
const reduced = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const SPARKS = 14;
/** An animation's end, or a timer (a backgrounded tab never finishes animations). */
const settle = (a: Animation | null | undefined, ms: number) =>
  Promise.race([a?.finished.catch(() => undefined) ?? Promise.resolve(), new Promise((r) => window.setTimeout(r, ms))]);

/**
 * One card that splits into two, choreographed:
 *   idle     the card tilts toward the pointer; the seam breathes; hover parts the halves a hair
 *   open     squash (anticipation) → seam flash + a burst of sparks → the halves swing apart
 *            like doors (3D) and spring into place (FLIP from where they were) → photos settle →
 *            titles wipe in → chips pop in one by one
 *   close    the halves spring back into one card
 * Closed, it is ONE button naming the choice and both options (§1). Reduced motion: instant.
 */
function RevealFork({ fork, cfg, narrow }: { fork: Fork; cfg: JourneyConfig; narrow: boolean }) {
  const L = useLabels();
  const [open, setOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const root = React.useRef<HTMLDivElement>(null);
  const halvesRef = React.useRef<HTMLDivElement>(null);
  const halves = React.useRef<(HTMLDivElement | null)[]>([]);
  const sparks = React.useRef<HTMLSpanElement>(null);
  const cover = React.useRef<HTMLButtonElement>(null);
  const firstHead = React.useRef<HTMLHeadingElement>(null);
  const first = React.useRef<DOMRect[] | null>(null);
  const base = React.useId();

  // pointer tilt while closed (a card you want to pick up)
  const onMove = (e: React.PointerEvent) => {
    if (open || reduced() || e.pointerType !== 'mouse') return;
    const el = halvesRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--rv-ry', `${(x * 7).toFixed(2)}deg`);
    el.style.setProperty('--rv-rx', `${(-y * 5).toFixed(2)}deg`);
  };
  const onLeave = () => {
    halvesRef.current?.style.setProperty('--rv-ry', '0deg');
    halvesRef.current?.style.setProperty('--rv-rx', '0deg');
  };

  const burst = () => {
    const host = sparks.current;
    if (!host) return;
    Array.from(host.children).forEach((node, i) => {
      const el = node as HTMLElement;
      const a = (i / SPARKS) * Math.PI * 2 + Math.random() * 0.4;
      const d = 70 + Math.random() * 90;
      const dx = Math.cos(a) * d * (narrow ? 1.4 : 0.8);
      const dy = Math.sin(a) * d * (narrow ? 0.6 : 1.2);
      el.animate(
        [
          { transform: 'translate(-50%, -50%) scale(0.4)', opacity: 1 },
          { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1)`, opacity: 1, offset: 0.55 },
          { transform: `translate(calc(-50% + ${dx * 1.25}px), calc(-50% + ${dy * 1.25 + 18}px)) scale(0.2)`, opacity: 0 },
        ],
        { duration: 720 + Math.random() * 240, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)', fill: 'forwards' },
      );
    });
  };

  const toggle = async (next: boolean) => {
    if (busy) return;
    if (reduced()) {
      setOpen(next);
      window.setTimeout(() => (next ? firstHead.current : cover.current)?.focus(), 40);
      return;
    }
    setBusy(true);
    const wrap = halvesRef.current;
    onLeave();
    if (next && wrap) {
      // 1 · anticipation: a quick squash
      await settle(wrap.animate([{ transform: 'scale(1)' }, { transform: 'scale(0.97, 0.985)' }], { duration: 150, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' }), 260);
      wrap.getAnimations().forEach((a) => a.cancel());
      burst();
    }
    // FLIP: remember where the halves are, change the layout, animate from there
    first.current = halves.current.map((h) => h?.getBoundingClientRect() ?? new DOMRect());
    setOpen(next);
  };

  React.useLayoutEffect(() => {
    const from = first.current;
    if (!from) return;
    first.current = null;
    const anims = halves.current.map((h, i) => {
      if (!h) return null;
      const to = h.getBoundingClientRect();
      const f = from[i];
      const dx = f.left - to.left;
      const dy = f.top - to.top;
      const sx = f.width / (to.width || 1);
      const sy = f.height / (to.height || 1);
      const dir = i === 0 ? -1 : 1;
      const swing = narrow ? `rotateX(${-dir * 16}deg)` : `rotateY(${dir * 18}deg)`;
      const push = narrow ? `translateY(${dir * 10}px)` : `translateX(${dir * 12}px)`;
      const start = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
      const frames = open
        ? [{ transform: start }, { transform: `${push} ${swing} scale(1.03)`, offset: 0.42 }, { transform: 'none' }]
        : [{ transform: start }, { transform: `${narrow ? 'translateY(0)' : 'translateX(0)'} scale(1.015)`, offset: 0.6 }, { transform: 'none' }];
      return h.animate(frames, { duration: open ? 900 : 620, easing: SPRING, delay: open ? i * 40 : 0 });
    });
    Promise.all(anims.map((a) => settle(a, 1300))).then(() => {
      setBusy(false);
      (open ? firstHead.current : cover.current)?.focus({ preventScroll: true });
    });
  }, [open, narrow]);

  return (
    <div
      ref={root}
      className="sj-reveal"
      data-open={open || undefined}
      data-narrow={narrow || undefined}
      data-busy={busy || undefined}
      onKeyDown={(e) => e.key === 'Escape' && open && toggle(false)}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      {...c(cfg, 'forkReveal')}
    >
      <div ref={halvesRef} className="sj-reveal-halves" id={`${base}-paths`}>
        {fork.paths.map((p, i) => (
          <div
            key={p.id}
            ref={(el) => {
              halves.current[i] = el;
            }}
            className="sj-reveal-half"
            data-path={p.id}
            data-i={i}
            data-surface-ink={p.image ? 'on-image' : undefined}
            {...c(cfg, 'revealHalf')}
          >
            <Visual photo={p.image} cfg={cfg} ratio={[960, 720]} eager />
            <span className="sj-reveal-teaser" aria-hidden="true">
              {p.title}
            </span>
            <div className="sj-reveal-content" inert={!open || undefined}>
              <Heading as="h3" size="2" className="sj-reveal-title" style={{ color: 'inherit' }} ref={i === 0 ? firstHead : undefined} tabIndex={-1}>
                {p.title}
              </Heading>
              <Text size="base" className="sj-reveal-desc" style={{ color: 'inherit', opacity: 0.9 }}>
                {p.desc}
              </Text>
              <PathDetails path={p} cfg={cfg} />
            </div>
          </div>
        ))}
        <span className="sj-reveal-seam" aria-hidden="true" />
        <span ref={sparks} className="sj-reveal-sparks" aria-hidden="true">
          {Array.from({ length: SPARKS }, (_, i) => (
            <i key={i} data-k={i % 3} />
          ))}
        </span>
      </div>
      {open ? null : (
        <button ref={cover} type="button" className="sj-reveal-cover" aria-expanded={false} aria-controls={`${base}-paths`} onClick={() => toggle(true)}>
          <span className="sj-reveal-intro">
            <GitFork weight="bold" aria-hidden="true" />
            {fork.intro}
          </span>
          <span className="sj-reveal-names">
            {fork.paths[0]?.title} <i>{L.pathsOr}</i> {fork.paths[1]?.title}
          </span>
          <span className="sj-reveal-cta">
            {L.seePaths}
            <ArrowRight weight="bold" aria-hidden="true" />
          </span>
        </button>
      )}
      {open ? (
        <button type="button" className="sj-reveal-join" aria-expanded aria-controls={`${base}-paths`} onClick={() => toggle(false)}>
          <ArrowsIn weight="bold" aria-hidden="true" />
          {L.joinPaths}
        </button>
      ) : null}
    </div>
  );
}

/* ── transform: one card in, two paths out ──────────────────────────────── */

/** How long one pass of the transform lasts before it plays again (while in view). */
const LOOP_MS = 12500;
/** When a pass comes to rest (the tile stops pulsing): after the split has settled (CSS --open + 1s). */
const REST_MS = 5200;
/**
 * One card in, two paths out, across an axis (the moment you choose). When the stage scrolls into
 * view a single card (both paths, still together: founder photo over
 * placement photo) travels in from the left and fades into the axis
 * into the axis; out of the other side come the two path cards,
 * each keeping its half, which travel apart up and down to their places as
 * the line branches after them; their points arrive one by one. Then the tile rests and the
 * cards rest, readable; the pass plays again every LOOP_MS while the stage is
 * in view (the fork tile replays it on demand). Pause stops the motion (WCAG 2.2.2); reduced motion = the settled state.
 * Before the stage is seen the cards are simply in place (nothing is hidden
 * if the observer never fires).
 */
function TransformFork({ fork, cfg, narrow }: { fork: Fork; cfg: JourneyConfig; narrow?: boolean }) {
  const L = useLabels();
  const [paused, setPaused] = React.useState(false);
  const [run, setRun] = React.useState(0); // 0 = settled, n = the n-th time the split plays
  const [leaving, setLeaving] = React.useState(false);
  const [rested, setRested] = React.useState(false); // the pass is over: the tile stops pulsing
  const [seen, setSeen] = React.useState(false);
  const stage = React.useRef<HTMLDivElement>(null);
  const still = typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  React.useEffect(() => {
    const el = stage.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.45 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  // plays when the stage comes into view, then again every LOOP_MS while it
  // stays in view: the two cards fade out and a new single card comes through
  React.useEffect(() => {
    if (!seen || paused || still) return undefined;
    if (!run) {
      setRun(1);
      return undefined;
    }
    setRested(false);
    const t0 = window.setTimeout(() => setRested(true), REST_MS);
    let t2 = 0;
    const t1 = window.setTimeout(() => {
      setLeaving(true);
      t2 = window.setTimeout(() => {
        setLeaving(false);
        setRun((n) => n + 1);
      }, 450);
    }, LOOP_MS);
    return () => {
      window.clearTimeout(t0);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [seen, paused, still, run]);
  // the branches are drawn in real pixels: from the tile's edge to the middle of each card
  const outRef = React.useRef<HTMLDivElement>(null);
  const [geo, setGeo] = React.useState<{ branches: string[]; toCenter: number[]; atAxis: number; fromTop: number[] }>({ branches: [], toCenter: [], atAxis: 0, fromTop: [] });
  React.useLayoutEffect(() => {
    const out = outRef.current;
    if (!out) return undefined;
    const measure = () => {
      const h = out.clientHeight;
      const x0 = 0; // this pane clips (and fades) at its left edge; the tile's stub bridges the gap
      const cards = Array.from(out.querySelectorAll<HTMLElement>('.sj-mt-path'));
      const x1 = cards[0]?.offsetLeft ?? 0;
      setGeo({
        branches: cards.map((el) => {
          const y1 = el.offsetTop + el.offsetHeight / 2;
          const mid = (x0 + x1) / 2;
          return `M${x0} ${h / 2} C${mid} ${h / 2}, ${mid} ${y1}, ${x1} ${y1}`;
        }),
        // how far each card sits from the middle: where it starts, inside the one card
        toCenter: cards.map((el) => h / 2 - (el.offsetTop + el.offsetHeight / 2)),
        // the cards start wholly behind the pane's left edge (at 70%
        // size) and slide out of it: this far back from their slots
        atAxis: Math.round(-(x1 + 0.85 * (cards[0]?.offsetWidth ?? 0))),
        // m-web runs top to bottom: each card starts wholly above the pane's top
        // edge (under the axis) and drops into place; the lower one travels
        // further, so the pair pulls apart as it comes out
        fromTop: cards.map((el) => -(el.offsetTop + el.offsetHeight)),
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(out);
    return () => ro.disconnect();
  }, [run, narrow]);
  const [founder, placement] = [fork.paths.find((p) => p.id === 'founder') ?? fork.paths[0], fork.paths.find((p) => p.id === 'placement') ?? fork.paths[1]];
  const card = (p: Path | undefined, lane: 'founder' | 'placement', i: number) =>
    p ? (
      <article className="sj-mt-path" data-lane={lane} data-photo={p.image ? '' : undefined} style={{ '--to-center': `${geo.toCenter[i] ?? 0}px`, '--from-top': `${geo.fromTop[i] ?? 0}px` } as React.CSSProperties}>
        {p.image ? (
          <div className="sj-mt-media">
            <Visual photo={p.image} alt="" cfg={cfg} ratio={[480, 400]} eager />
          </div>
        ) : null}
        <div className="sj-mt-body">
          <Heading as="h4" size="3">
            {p.title}
          </Heading>
          <Text size="sm" tone="secondary">
            {p.desc}
          </Text>
          <ul className="sj-mt-chips" aria-label={p.title}>
            {[...(p.roles ?? []), ...p.points].map((t, i) => (
              <li key={t} style={{ '--i': i } as React.CSSProperties}>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </article>
    ) : null;
  return (
    <div className="sj-mt" data-narrow={narrow || undefined} data-paused={paused || undefined} data-rested={rested || undefined} {...c(cfg, 'forkTransform')}>
      <p className="sj-fork-head">
        <GitFork weight="bold" aria-hidden="true" />
        <Text as="span" size="base" style={{ fontWeight: 600, color: 'var(--content-primary)' }}>
          {fork.intro}
        </Text>
        <button type="button" className="sj-mt-pause" aria-pressed={paused} onClick={() => setPaused((v) => !v)}>
          {paused ? <Play weight="fill" aria-hidden="true" /> : <Pause weight="fill" aria-hidden="true" />}
          {paused ? L.playProjects : L.pauseProjects}
        </button>
      </p>
      <div ref={stage} className="sj-mt-stage">
        <div className="sj-mt-in" aria-hidden="true">
          {/* the one card: it travels in from the left and fades into the axis into the axis */}
          {run ? (
            <div key={`major-${run}`} className="sj-mt-major">
              {founder?.image || placement?.image ? (
                <div className="sj-mt-major-media">
                  {[founder, placement].map((p) => (p?.image ? <Visual key={p.id} photo={p.image} alt="" cfg={cfg} ratio={[480, 400]} eager /> : <span key={p?.id ?? 'x'} />))}
                </div>
              ) : null}
              <div className="sj-mt-major-text">
                <GitFork weight="bold" />
                {/* short on purpose: it is read while it moves; the two names arrive with the split */}
                <b>{L.choosePath ?? 'Choose your path'}</b>
              </div>
            </div>
          ) : null}
        </div>
        <div className="sj-mt-axis">
          <button type="button" className="sj-mt-tile" aria-label="Replay the fork" onClick={() => {
              setLeaving(false);
              setRun((n) => n + 1);
            }}>
            <GitFork weight="bold" />
          </button>
        </div>
        {/* keyed by the run, so every replay starts the split from the axis again */}
        <div key={run} ref={outRef} className="sj-mt-out" data-run={run || undefined} data-leaving={leaving || undefined} style={{ '--at-axis': `${geo.atAxis}px` } as React.CSSProperties}>
          <svg className="sj-mt-branches" aria-hidden="true">
            {geo.branches.map((d, i) => (
              <path key={i} className="sj-mt-branch" d={d} pathLength={1} />
            ))}
          </svg>
          {card(founder, 'founder', 0)}
          {card(placement, 'placement', 1)}
        </div>
      </div>
    </div>
  );
}

/* ── the block ────────────────────────────────────────────────────────────── */

export function ForkPaths({ fork, cfg, width }: { fork: Fork; cfg: JourneyConfig; width: number }) {
  const narrow = width > 0 && width < 720;
  // the transform belongs to the Stack concept and needs width: anywhere else it is the reveal
  // the transform belongs to the Stack concept (desktop left→right, m-web top→bottom); elsewhere it is the reveal
  const style = cfg.forkStyle === 'transform' && cfg.concept !== 'stack' ? 'reveal' : cfg.forkStyle;
  const head = (
    <p className="sj-fork-head">
      <GitFork weight="bold" aria-hidden="true" />
      <Text as="span" size="base" style={{ fontWeight: 600, color: 'var(--content-primary)' }}>
        {fork.intro}
      </Text>
    </p>
  );
  return (
    <section className="sj-fork" data-style={style} aria-label="After Year 4" style={{ '--fork-scrim': cfg.forkScrim } as React.CSSProperties} {...c(cfg, 'fork')}>
      {style === 'transform' ? (
        <TransformFork fork={fork} cfg={cfg} narrow={narrow} />
      ) : style === 'branch' ? (
        <BranchFork fork={fork} cfg={cfg} narrow={narrow} />
      ) : style === 'reveal' ? (
        <RevealFork fork={fork} cfg={cfg} narrow={narrow} />
      ) : (
        <>
          {head}
          {style === 'split' ? (
            <SplitFork fork={fork} cfg={cfg} />
          ) : (
            <div className="sj-fork-paths" data-style={style}>
              {fork.paths.map((p) => (style === 'cover' ? <PathCover key={p.id} path={p} cfg={cfg} /> : <PathCard key={p.id} path={p} cfg={cfg} />))}
            </div>
          )}
        </>
      )}
      {/* the safety net is a line, not a card (§4.4) */}
      <p className="sj-safety" {...c(cfg, 'safety')}>
        {fork.safetyNet}
      </p>
    </section>
  );
}
