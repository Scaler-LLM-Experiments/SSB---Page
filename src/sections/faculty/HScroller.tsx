'use client';

import * as React from 'react';
import { IconButton } from '@kishanscaler/ssx-ui';
import { prefersReducedMotion } from '@kishanscaler/ssx-ui/motion';

// Phosphor "arrow-left" / "arrow-right" (bold), the system's icon family.
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

/**
 * A ticker on a real scroller. The track holds its items twice; the page
 * advances `scrollLeft` a little every frame and wraps by one set's width,
 * so the row loops forever while swiping, trackpad scroll and the arrows
 * keep working. It pauses on hover, on keyboard focus inside it, while a
 * finger is on it, while an arrow scroll plays, while the track carries
 * `data-hold` (its entrance is playing), and whenever the row is off screen.
 * Under reduced motion it never starts.
 *
 * Mark the second (visual) copy of each item with `data-copy`.
 */
export function useHScroller({ speed = 32, auto = true }: { speed?: number; auto?: boolean } = {}) {
  const ref = React.useRef<HTMLUListElement>(null);
  const holdUntil = React.useRef(0);

  // One set's width: from the first item to the first copied item.
  const setWidth = (el: HTMLElement) => {
    const first = el.firstElementChild as HTMLElement | null;
    const copy = el.querySelector<HTMLElement>(':scope > [data-copy]');
    return first && copy ? copy.offsetLeft - first.offsetLeft : 0;
  };

  React.useEffect(() => {
    const el = ref.current;
    // auto: false is a plain scroller (arrows, swipe, trackpad), no ticker.
    if (!el || !auto || prefersReducedMotion(el)) return;

    let pos = el.scrollLeft;
    let last = 0;
    let frame = 0;
    let hovered = false;
    let visible = false;

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const dt = last ? Math.min(now - last, 64) / 1000 : 0;
      last = now;
      const busy =
        hovered ||
        el.contains(document.activeElement) ||
        now < holdUntil.current ||
        el.hasAttribute('data-hold') ||
        // its carousel's pause button (CarouselNav, via ScrollDots)
        el.hasAttribute('data-paused');
      const w = setWidth(el);
      if (busy || !w) {
        pos = el.scrollLeft; // pick up wherever the visitor left it
        return;
      }
      pos += speed * dt;
      if (pos >= w) pos -= w;
      el.scrollLeft = pos;
    };
    const start = () => {
      if (!frame) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    // Keep the loop seamless for manual scrolling too.
    const onScroll = () => {
      const w = setWidth(el);
      if (w && el.scrollLeft >= w) el.scrollLeft -= w;
    };
    const enter = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') hovered = true;
    };
    const leave = () => {
      hovered = false;
    };
    const touch = () => {
      holdUntil.current = performance.now() + 2500;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !document.hidden) start();
      else stop();
    });
    const onVisibility = () => (document.hidden || !visible ? stop() : start());

    io.observe(el);
    el.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('pointerenter', enter);
    el.addEventListener('pointerleave', leave);
    el.addEventListener('pointerdown', touch);
    el.addEventListener('touchmove', touch, { passive: true });
    el.addEventListener('wheel', touch, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      io.disconnect();
      el.removeEventListener('scroll', onScroll);
      el.removeEventListener('pointerenter', enter);
      el.removeEventListener('pointerleave', leave);
      el.removeEventListener('pointerdown', touch);
      el.removeEventListener('touchmove', touch);
      el.removeEventListener('wheel', touch);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [speed, auto]);

  const page = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0') : el.clientWidth;
    const w = setWidth(el);
    // Going back from the start: jump to the same spot in the copy first.
    if (dir < 0 && w && el.scrollLeft < step) el.scrollLeft += w;
    holdUntil.current = performance.now() + 1500;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  // Straight to item `i` of the first set (the progress dots).
  const goTo = (i: number) => {
    const el = ref.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    holdUntil.current = performance.now() + 2500;
    el.scrollTo({ left: i * (card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0')), behavior: 'smooth' });
  };

  return { ref, page, goTo };
}

export function HScrollerControls({ label, page }: { label: string; page: (dir: 1 | -1) => void }) {
  return (
    <div className="flex shrink-0 gap-2">
      <IconButton variant="secondary" aria-label={`Previous ${label}`} onClick={() => page(-1)}>
        <ArrowLeft />
      </IconButton>
      <IconButton variant="secondary" aria-label={`Next ${label}`} onClick={() => page(1)}>
        <ArrowRight />
      </IconButton>
    </div>
  );
}

export function HScrollerTrack({
  trackRef,
  label,
  children,
}: {
  trackRef: React.Ref<HTMLUListElement>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <ul ref={trackRef} className="h-scroller" aria-label={label}>
      {children}
    </ul>
  );
}
