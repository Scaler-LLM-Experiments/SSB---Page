'use client';

import * as React from 'react';
import { prefersReducedMotion } from '@kishanscaler/ssx-ui/motion';

import { CarouselNav } from './CarouselNav';
import { onSideways } from './onSideways';

/** How long each card holds before the row moves on (Apple's gallery: about 6s). */
const INTERVAL = 6000;

/**
 * The controls for a horizontal scroller, in Apple's gallery style (CarouselNav:
 * a pill of dots between two arrows), one dot per card.
 *
 * `fill="solid"` (a row of cards): while the row is on screen it moves one card
 * on every INTERVAL, the current dot filling as it waits, and stops at the last
 * card (no loop). Any arrow or dot, or a sideways swipe, drag or trackpad stroke, stops
 * it for good (the visitor has taken over). Scrolling the page past it does not.
 *
 * `fill="progress"` (a ticker row that moves on its own, useHScroller): the fill
 * follows the row; the arrows and dots step it.
 *
 * Tapping a dot calls `onSelect` (or scrolls there). No autoplay under reduced motion.
 * `cardStep`: one card's travel in px, for a row whose cards are not its direct children
 * (the curriculum's terms, placed absolutely in a deck); otherwise measured from the first child.
 */
export function ScrollDots({
  scroller,
  count,
  itemName,
  onSelect,
  fill = 'progress',
  tone = 'light',
  cardStep,
  autoplay = true,
  interval = INTERVAL,
  loop = false,
}: {
  scroller: React.RefObject<HTMLElement | null>;
  count: number;
  itemName: string;
  onSelect?: (index: number) => void;
  fill?: 'progress' | 'solid';
  tone?: 'light' | 'dark';
  cardStep?: number;
  /** false: a row of cards that never moves by itself (the curriculum's terms); the dots and arrows only. */
  autoplay?: boolean;
  /** ms a card holds before the row moves on (6s by default). */
  interval?: number;
  /** true: at the end the row goes back to its start and keeps playing, instead of stopping. */
  loop?: boolean;
}) {
  const stepPx = React.useRef(cardStep);
  stepPx.current = cardStep;
  const [state, setState] = React.useState({ active: 0, progress: 0, atEnd: false });
  const [playing, setPlaying] = React.useState(true);
  const [visible, setVisible] = React.useState(false);
  const [reduced, setReduced] = React.useState(false);
  // A ticker row (useHScroller renders its cards twice, the copy marked data-copy) moves on its own:
  // the button pauses the ticker rather than this stepping the row.
  const [ticker, setTicker] = React.useState(false);

  // A move the visitor asked for (a dot, an arrow): the dot goes straight to its card and holds
  // there while the row scrolls over (reading the row on the way lit every dot it passed, each
  // restarting its stretch: the dots juddered). Cleared once the row is there, or after a beat.
  const pending = React.useRef<{ index: number; until: number } | null>(null);
  // a dot chosen that the row can only reach by scrolling to its end: kept lit while the row stays there
  const chosenAtEnd = React.useRef<number | null>(null);

  const step = (el: HTMLElement) => {
    if (stepPx.current) return stepPx.current;
    const first = el.firstElementChild as HTMLElement | null;
    if (!first) return 0;
    return first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0');
  };

  // Where the row is: the current card, how far into it, and whether it is at its end.
  React.useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    setReduced(prefersReducedMotion(el));
    setTicker(Boolean(el.querySelector(':scope > [data-copy]')));
    let frame = 0;
    const measure = () => {
      frame = 0;
      const s = step(el);
      if (!s) return;
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 1;
      const going = pending.current;
      if (going) {
        // there once the row reads as that card (counted as the fill counts: rounded for a row of
        // cards, floored for a ticker), or at the row's end, or after the beat
        const at0 = el.scrollLeft / s;
        const idx = fill === 'solid' ? Math.round(at0) : Math.floor(at0 + 0.01);
        if (idx !== going.index && !atEnd && performance.now() < going.until) {
          setState({ active: going.index, progress: fill === 'solid' ? 1 : 0, atEnd: false });
          return;
        }
        pending.current = null;
        // a card chosen near the end of a row that can't scroll it to the start: the chosen dot stays lit
        if (atEnd) {
          chosenAtEnd.current = going.index;
          setState({ active: going.index, progress: 1, atEnd: true });
          return;
        }
      }
      if (!atEnd) chosenAtEnd.current = null;
      else if (chosenAtEnd.current !== null) {
        setState({ active: chosenAtEnd.current, progress: 1, atEnd: true });
        return;
      }
      // A row that cannot scroll its last cards to the start: the end is the last card.
      if (atEnd && el.scrollWidth <= s * count + el.clientWidth) {
        setState({ active: count - 1, progress: 1, atEnd: true });
        return;
      }
      const at = el.scrollLeft / s;
      if (fill === 'solid') {
        setState({ active: Math.min(count - 1, Math.round(at)), progress: 1, atEnd });
        return;
      }
      const index = Math.floor(at + 0.01); // snap can land a hair short of a card
      setState({
        active: ((index % count) + count) % count,
        progress: Math.min(1, Math.max(0, at - index)),
        atEnd,
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      io.disconnect();
    };
  }, [scroller, count, fill]);

  const timed = fill === 'solid' && !ticker && autoplay;

  // A row of cards: the visitor moving it sideways stops it (not the page scrolling past).
  React.useEffect(() => {
    const el = scroller.current;
    if (!el || !timed) return;
    return onSideways(el, () => setPlaying(false));
  }, [scroller, timed]);

  // A row of cards: one card on, every INTERVAL, while playing and on screen; stop at the end.
  const running = timed && playing && visible && !reduced;
  React.useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => {
      const el = scroller.current;
      if (!el) return;
      if (state.atEnd || state.active >= count - 1) {
        if (loop) {
          pending.current = { index: 0, until: performance.now() + 1100 };
          setState((st) => ({ ...st, active: 0, atEnd: false }));
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else setPlaying(false);
        return;
      }
      el.scrollTo({ left: (state.active + 1) * step(el), behavior: 'smooth' });
    }, interval);
    return () => window.clearTimeout(id);
  }, [running, state.active, state.atEnd, count, scroller, interval, loop]);

  const select = (i: number) => {
    if (timed) setPlaying(false); // the visitor has taken over
    // the dot moves at once, and holds while the row travels (about the length of a smooth scroll)
    pending.current = { index: i, until: performance.now() + 1100 };
    setState((st) => ({ ...st, active: i, progress: fill === 'solid' ? 1 : 0 }));
    if (onSelect) return onSelect(i);
    const el = scroller.current;
    if (el) el.scrollTo({ left: i * step(el), behavior: 'smooth' });
  };

  const prev = () => select(Math.max(0, state.active - 1));
  const next = () => select(Math.min(count - 1, state.active + 1));

  return (
    <CarouselNav
      count={count}
      active={state.active}
      itemName={itemName}
      onSelect={select}
      onPrev={prev}
      onNext={next}
      atStart={!ticker && state.active === 0}
      atEnd={!ticker && (state.atEnd || state.active >= count - 1)}
      running={running}
      // a timed fill only while autoplay is still on: once the visitor has taken over, or it has
      // played through (or never runs, reduced motion), the current dot simply shows full,
      // not frozen empty as if broken
      interval={timed && playing && !reduced ? interval : undefined}
      progress={timed && playing && !reduced ? undefined : fill === 'solid' ? 1 : state.progress}
      tone={tone}
    />
  );
}
