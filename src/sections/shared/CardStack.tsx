'use client';

import * as React from 'react';
import { GlassButton } from '@kishanscaler/ssx-ui';
import { prefersReducedMotion } from '@kishanscaler/ssx-ui/motion';

import './card-stack.css';

const ArrowLeft = () => (
  <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M228,128a12,12,0,0,1-12,12H69l51.52,51.51a12,12,0,0,1-17,17l-72-72a12,12,0,0,1,0-17l72-72a12,12,0,0,1,17,17L69,116H216A12,12,0,0,1,228,128Z" />
  </svg>
);
const ArrowRight = () => (
  <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M224.49,136.49l-72,72a12,12,0,0,1-17-17L187,140H40a12,12,0,0,1,0-24H187L135.51,64.48a12,12,0,0,1,17-17l72,72A12,12,0,0,1,224.49,136.49Z" />
  </svg>
);

const AUTOPLAY_MS = 4000;
const RESUME_AFTER_MS = 6000;
const SWIPE_PX = 60; // how far a drag must travel to change the card
const MAX_TILT_DEG = 6;
const SIDE_SCALE = 0.86;

/** Shortest signed distance from `active` to `i` on a loop of `n`. */
const offset = (i: number, active: number, n: number) => {
  let d = (i - active) % n;
  if (d > n / 2) d -= n;
  if (d < -n / 2) d += n;
  return d;
};
const posOf = (d: number) =>
  d === 0 ? '0' : d === 1 ? '1' : d === -1 ? '-1' : d < 0 ? 'far-left' : 'far-right';

export type CardStackProps<T> = {
  items: T[];
  getKey: (item: T) => string;
  renderCard: (item: T, index: number) => React.ReactNode;
  /** What is announced when the card changes. */
  announce: (item: T) => string;
  /** The carousel's name ("Faculty"). */
  label: string;
  /** One item, for the arrows' names ("faculty" -> "Next faculty"). */
  itemName: string;
  /** Front card's width as a share of the stage, e.g. 76 (the default). */
  cardWidth?: number;
  /** Arrows over a photo take the white on-image glass; over a light card, the neutral glass. */
  arrows?: 'on-image' | 'neutral';
  /** A dot per card under the stack; the current one fills while autoplay waits. */
  dots?: boolean;
  /** false: no autoplay and no wrapping: it stops at the first and last card (arrows disabled there). */
  loop?: boolean;
  className?: string;
};

/**
 * Phone carousel: a looping stack (front card, its neighbours tucked behind,
 * smaller and dimmed) with glass arrows. Drag the front card and it follows
 * the finger with a slight tilt; let go past SWIPE_PX and it drops to the back
 * as the next comes forward. It advances on its own every AUTOPLAY_MS while on
 * screen, pausing for RESUME_AFTER_MS after any interaction, never under
 * reduced motion. The stage is as tall as its tallest card (cards stack in
 * one grid cell), so cards of any height work.
 */
export function CardStack<T>({
  items,
  getKey,
  renderCard,
  announce,
  label,
  itemName,
  cardWidth = 76,
  arrows = 'on-image',
  dots = false,
  loop = true,
  className,
}: CardStackProps<T>) {
  const n = items.length;
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [reduced, setReduced] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const resumeTimer = React.useRef<number | undefined>(undefined);
  // Drag state: where the touch began, whether it has locked to horizontal.
  const drag = React.useRef<{ x: number; y: number; dx: number; axis: 'x' | 'y' | null } | null>(null);

  // Any interaction holds autoplay for RESUME_AFTER_MS.
  const hold = React.useCallback(() => {
    setPaused(true);
    window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => setPaused(false), RESUME_AFTER_MS);
  }, []);
  React.useEffect(() => () => window.clearTimeout(resumeTimer.current), []);

  const go = React.useCallback(
    (to: number, user = true) => {
      setActive(loop ? ((to % n) + n) % n : Math.min(n - 1, Math.max(0, to)));
      if (user) hold();
    },
    [n, hold, loop],
  );

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    setReduced(prefersReducedMotion(root));
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.5 });
    io.observe(root);
    return () => io.disconnect();
  }, []);

  // Autoplay: one timer per card, restarted on every change, so the current
  // dot's fill and the move to the next card stay in step.
  const playing = loop && visible && !paused && !reduced && n > 1;
  React.useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => go(active + 1, false), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [playing, active, go]);

  const front = () => stageRef.current?.querySelector<HTMLElement>('.fc-slide[data-pos="0"]') ?? null;
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    drag.current = { x: t.clientX, y: t.clientY, dx: 0, axis: null };
    hold();
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const d = drag.current;
    if (!d) return;
    const t = e.touches[0];
    const dx = t.clientX - d.x;
    const dy = t.clientY - d.y;
    // Lock to an axis once the finger has clearly moved: a vertical drag
    // stays a page scroll, a horizontal one moves the card.
    if (!d.axis && Math.hypot(dx, dy) > 8) d.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    if (d.axis !== 'x') return;
    d.dx = dx;
    const el = front();
    if (!el) return;
    const tilt = Math.max(-1, Math.min(1, dx / (el.offsetWidth || 1))) * MAX_TILT_DEG;
    el.style.transition = 'none';
    el.style.transform = `translateX(${dx}px) rotate(${tilt}deg)`;
  };
  const onTouchEnd = () => {
    const d = drag.current;
    drag.current = null;
    const el = front();
    if (el) {
      // Hand the card back to the stylesheet: it animates from where the
      // finger left it to its new place (the back) or to the centre.
      el.style.transition = '';
      el.style.transform = '';
    }
    if (d?.axis === 'x' && Math.abs(d.dx) > SWIPE_PX) go(active + (d.dx < 0 ? 1 : -1));
  };

  // A side card's outer edge meets the stage edge: shift it by
  // (50% - its scaled half-width) of the stage, written as a share of the card.
  const shift = ((50 - (SIDE_SCALE * cardWidth) / 2) / cardWidth) * 100;
  const stageVars = {
    '--fc-card-w': `${cardWidth}%`,
    '--fc-shift': `${shift}%`,
    '--fc-side-scale': SIDE_SCALE,
    '--fc-interval': `${AUTOPLAY_MS}ms`,
  } as React.CSSProperties;

  return (
    <div
      ref={rootRef}
      className={className}
      style={stageVars}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div
        ref={stageRef}
        className="fc-stage"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        {items.map((item, i) => {
          const d = loop ? offset(i, active, n) : i - active;
          const isActive = d === 0;
          return (
            <div
              key={getKey(item)}
              className="fc-slide"
              data-pos={posOf(d)}
              aria-hidden={!isActive || undefined}
              inert={!isActive || undefined}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}`}
            >
              {renderCard(item, i)}
            </div>
          );
        })}

        <div
          className="fc-arrow"
          data-side="prev"
          data-surface-ink={arrows === 'on-image' ? 'on-image' : undefined}
        >
          <GlassButton
            shape="capsule"
            size="icon-lg"
            aria-label={`Previous ${itemName}`}
            disabled={!loop && active === 0}
            onClick={() => go(active - 1)}
          >
            <ArrowLeft />
          </GlassButton>
        </div>
        <div
          className="fc-arrow"
          data-side="next"
          data-surface-ink={arrows === 'on-image' ? 'on-image' : undefined}
        >
          <GlassButton
            shape="capsule"
            size="icon-lg"
            aria-label={`Next ${itemName}`}
            disabled={!loop && active === n - 1}
            onClick={() => go(active + 1)}
          >
            <ArrowRight />
          </GlassButton>
        </div>
      </div>

      {dots ? (
        <div className="fc-dots" role="group" aria-label={`Choose a ${itemName}`}>
          {items.map((item, i) => (
            <button
              key={getKey(item)}
              type="button"
              className="fc-dot"
              aria-label={`${itemName} ${i + 1} of ${n}`}
              aria-current={i === active ? 'true' : undefined}
              data-playing={i === active && playing ? '' : undefined}
              onClick={() => go(i)}
            >
              {/* Re-keyed on every change so the fill restarts with the timer. */}
              <span key={`${active}-${playing}`} className="fc-dot__fill" aria-hidden="true" />
            </button>
          ))}
        </div>
      ) : null}

      <p className="sr-only" aria-live="polite">
        {announce(items[active])}
      </p>
    </div>
  );
}
