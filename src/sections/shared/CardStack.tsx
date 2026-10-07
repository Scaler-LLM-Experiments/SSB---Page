'use client';

import * as React from 'react';
import { prefersReducedMotion } from '@kishanscaler/ssx-ui/motion';

import { CarouselNav } from './CarouselNav';
import { onSideways } from './onSideways';
import './card-stack.css';

const AUTOPLAY_MS = 6000; // Apple's galleries hold each slide about this long

export type CardStackProps<T> = {
  items: T[];
  getKey: (item: T) => string;
  renderCard: (item: T, index: number) => React.ReactNode;
  /** What is announced when the card changes. */
  announce: (item: T) => string;
  /** The carousel's name ("Faculty"). */
  label: string;
  /** One item, for the controls' names ("faculty" -> "Next faculty"). */
  itemName: string;
  /** A card's width as a share of the carousel's, e.g. 86 (the default): the next one peeks in. */
  cardWidth?: number;
  /** A dot per card under the row; the current one fills while autoplay waits. */
  dots?: boolean;
  /** true: after the last card, autoplay goes back to the first. false: it plays through once. */
  loop?: boolean;
  className?: string;
};

/**
 * Phone carousel, as Apple's galleries on a phone (apple.com/iphone-18-pro): a row of cards
 * that scrolls sideways under the finger and snaps to each card, the next one peeking in at the
 * edge. The card on show brings its text in: it slides in from the right and fades up as the
 * card settles (card-stack.css); the others' text waits out of sight.
 *
 * While the row is on screen it moves one card on every AUTOPLAY_MS, the current dot filling as
 * it waits (CarouselNav), and stops at the last card (or goes back to the first, `loop`). A
 * sideways swipe, a dot or an arrow stops it for good: the visitor has taken over (scrolling the
 * page past it does not). Never under reduced
 * motion. The card on show is read from the scroll position, so a swipe, a dot and the timer
 * all agree.
 */
export function CardStack<T>({
  items,
  getKey,
  renderCard,
  announce,
  label,
  itemName,
  cardWidth = 86,
  dots = false,
  loop = false,
  className,
}: CardStackProps<T>) {
  const n = items.length;
  const [active, setActive] = React.useState(0);
  // Autoplay: off for good once the visitor takes over, or at the end.
  const [on, setOn] = React.useState(true);
  const [visible, setVisible] = React.useState(false);
  const [reduced, setReduced] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const rowRef = React.useRef<HTMLUListElement>(null);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    setReduced(prefersReducedMotion(root));
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.5 });
    io.observe(root);
    return () => io.disconnect();
  }, []);

  // Where card i starts, and the furthest the row can scroll (the last card stops at the end).
  const geometry = React.useCallback(() => {
    const row = rowRef.current;
    const first = row?.firstElementChild as HTMLElement | null;
    if (!row || !first) return null;
    const step = first.offsetWidth + parseFloat(getComputedStyle(row).columnGap || '0');
    return { row, step, max: row.scrollWidth - row.clientWidth };
  }, []);

  // The card on show follows the scroll position (a swipe, a dot, the timer alike).
  React.useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    let frame = 0;
    const read = () => {
      frame = 0;
      const g = geometry();
      if (!g || !g.step) return;
      const i = row.scrollLeft >= g.max - 4 ? n - 1 : Math.round(row.scrollLeft / g.step);
      setActive(Math.min(n - 1, Math.max(0, i)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    row.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      row.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [geometry, n]);

  const go = React.useCallback(
    (to: number) => {
      const g = geometry();
      if (!g) return;
      const i = loop ? ((to % n) + n) % n : Math.min(n - 1, Math.max(0, to));
      g.row.scrollTo({ left: Math.min(i * g.step, g.max), behavior: reduced ? 'auto' : 'smooth' });
    },
    [geometry, loop, n, reduced],
  );
  const take = (to: number) => {
    setOn(false); // the visitor has taken over
    go(to);
  };

  // A sideways swipe takes over; the page scrolling past (a vertical swipe on a card) does not.
  React.useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    return onSideways(row, () => setOn(false));
  }, []);

  // Autoplay: one timer per card, restarted on every change, so the current dot's fill and the
  // move to the next card stay in step.
  const playing = on && visible && !reduced && n > 1;
  React.useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => {
      if (!loop && active >= n - 1) setOn(false);
      else go(active + 1);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [playing, active, go, loop, n]);

  return (
    <div
      ref={rootRef}
      className={`fs ${className ?? ''}`}
      style={{ '--fs-card-w': `${cardWidth}cqw` } as React.CSSProperties}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <ul ref={rowRef} className="fs-row">
        {items.map((item, i) => (
          <li
            key={getKey(item)}
            className="fs-slide"
            data-active={i === active || undefined}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${n}`}
          >
            {renderCard(item, i)}
          </li>
        ))}
      </ul>

      {dots ? (
        <CarouselNav
          count={n}
          active={active}
          itemName={itemName}
          onSelect={take}
          onPrev={() => take(active - 1)}
          onNext={() => take(active + 1)}
          atStart={!loop && active === 0}
          atEnd={!loop && active === n - 1}
          running={playing}
          // timed only while autoplay is on; after that the current dot shows full, not frozen empty
          interval={on && !reduced && n > 1 ? AUTOPLAY_MS : undefined}
          tone="light"
        />
      ) : null}

      <p className="sr-only" aria-live="polite">
        {announce(items[active])}
      </p>
    </div>
  );
}
