'use client';

import * as React from 'react';

import './card-stack.css';

/**
 * Progress dots for a horizontal scroller: one per card. The current card's
 * dot stretches into a pill that fills as the row moves through that card,
 * so a looping ticker reads as steady progress and a manual row shows where
 * you are. A row that loops (its items rendered twice) wraps with `count`.
 * With `fill="solid"` (a row you swipe yourself) the nearest card's dot is
 * simply lit instead. Tapping a dot calls `onSelect` (or scrolls there).
 */
export function ScrollDots({
  scroller,
  count,
  itemName,
  onSelect,
  fill = 'progress',
}: {
  scroller: React.RefObject<HTMLElement | null>;
  count: number;
  itemName: string;
  onSelect?: (index: number) => void;
  fill?: 'progress' | 'solid';
}) {
  const [state, setState] = React.useState({ active: 0, progress: 0 });

  const step = (el: HTMLElement) => {
    const first = el.firstElementChild as HTMLElement | null;
    if (!first) return 0;
    return first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0');
  };

  React.useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const s = step(el);
      if (!s) return;
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 1;
      // A row that cannot scroll its last cards to the start: the end is the last card.
      if (atEnd && el.scrollWidth <= s * count + el.clientWidth) {
        setState({ active: count - 1, progress: 1 });
        return;
      }
      const at = el.scrollLeft / s;
      if (fill === 'solid') {
        setState({ active: Math.min(count - 1, Math.round(at)), progress: 1 });
        return;
      }
      const index = Math.floor(at + 0.01); // snap can land a hair short of a card
      setState({ active: ((index % count) + count) % count, progress: Math.min(1, Math.max(0, at - index)) });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [scroller, count, fill]);

  const select = (i: number) => {
    if (onSelect) return onSelect(i);
    const el = scroller.current;
    if (el) el.scrollTo({ left: i * step(el), behavior: 'smooth' });
  };

  return (
    <div className="fc-dots" role="group" aria-label={`Choose a ${itemName}`}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          className="fc-dot"
          aria-label={`${itemName} ${i + 1} of ${count}`}
          aria-current={i === state.active ? 'true' : undefined}
          data-progress=""
          style={
            i === state.active ? ({ '--fc-dot-progress': state.progress } as React.CSSProperties) : undefined
          }
          onClick={() => select(i)}
        >
          <span className="fc-dot__fill" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
