'use client';

import * as React from 'react';

import './carousel-nav.css';

// Phosphor "caret-left" / "caret-right" (bold), the system's icon family.
const CaretLeft = () => (
  <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M168.49,199.51a12,12,0,0,1-17,17l-80-80a12,12,0,0,1,0-17l80-80a12,12,0,0,1,17,17L97,128Z" />
  </svg>
);
const CaretRight = () => (
  <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M184.49,136.49l-80,80a12,12,0,0,1-17-17L159,128,87.51,56.49a12,12,0,1,1,17-17l80,80A12,12,0,0,1,184.49,136.49Z" />
  </svg>
);

/**
 * A carousel's controls, after Apple's media galleries (apple.com/iphone-18-pro,
 * "Highlights"): a pill of dots between two round arrow buttons. Dots are 8px;
 * the current one stretches into a track that fills while its slide plays. A dot
 * goes to its slide; the arrows step one either way.
 *
 * The fill is either timed (`interval`: a CSS animation over that long, frozen
 * while not `running`, restarted on every change) or follows a value
 * (`progress`, 0-1: a row that moves continuously).
 *
 * It enters once, the first time it comes fully on screen: one circle springs up
 * from below, then splits: the arrows slide out of it to either side while it
 * stretches into the dots' pill (carousel-nav.css; nothing moves under reduced
 * motion). `--cn-shift` is how far each arrow travels from behind the circle.
 */
export function CarouselNav({
  count,
  active,
  itemName,
  onSelect,
  onPrev,
  onNext,
  atStart = false,
  atEnd = false,
  running = false,
  interval,
  progress,
  tone = 'light',
  className,
}: {
  count: number;
  active: number;
  /** One item, for the labels ("alumni" -> "alumni 2 of 5"). */
  itemName: string;
  onSelect: (index: number) => void;
  onPrev?: () => void;
  onNext?: () => void;
  /** Disable the arrow at either end (a row that does not loop). */
  atStart?: boolean;
  atEnd?: boolean;
  /** It is moving right now; the timed fill runs only then. */
  running?: boolean;
  /** ms per slide, for a timed fill. */
  interval?: number;
  /** 0-1, for a fill that follows the row. */
  progress?: number;
  /** `light` on the white page (Apple's light pill), `dark` over dark sections. */
  tone?: 'light' | 'dark';
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  // What is watched: a still wrapper. The controls themselves wait 72px low before they enter,
  // and inside a clipping card (the Innovation Lab's panel) that part is cut off, so they would
  // never count as on screen.
  const frameRef = React.useRef<HTMLDivElement>(null);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    let idle = 0;
    let frame = 0;
    // The section coming on screen is busy (its images decode, the scroll entrances
    // re-measure): a spring started then would play through a stalled frame and look
    // like a jump. Wait for the page to be idle, then start on a fresh frame.
    const start = () => {
      frame = requestAnimationFrame(() => setShown(true));
    };
    // Once: the first time it comes whole into view and a little way up from the window's foot
    // (rootMargin), where the eye is, not while it is still at the bottom edge.
    const cancel = () => {
      if (typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(idle);
      globalThis.clearTimeout(idle);
      cancelAnimationFrame(frame);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio < 0.9) return;
        io.disconnect();
        if (typeof window.requestIdleCallback === 'function') idle = window.requestIdleCallback(start, { timeout: 700 });
        else idle = globalThis.setTimeout(start, 120) as unknown as number;
      },
      { threshold: 0.9, rootMargin: '0px 0px -12% 0px' },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancel();
    };
  }, []);

  // How far each arrow sits from the centre: where it starts, hidden behind the circle.
  React.useLayoutEffect(() => {
    const el = ref.current;
    const dots = el?.querySelector<HTMLElement>('.cn-dots');
    const arrow = el?.querySelector<HTMLElement>('.cn-arrow');
    if (!el || !dots || !arrow) return;
    const measure = () => {
      const gap = parseFloat(getComputedStyle(el).columnGap || '0');
      el.style.setProperty('--cn-shift', `${dots.offsetWidth / 2 + gap + arrow.offsetWidth / 2}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(dots);
    return () => ro.disconnect();
  }, [count]);

  if (count < 2) return null;
  // Many dots: tighter, so the pill and arrows fit a phone (Faculty has 15).
  const gap = count > 10 ? 6 : count > 7 ? 8 : 12;
  return (
    <div ref={frameRef} className="cn-frame">
      <div
        ref={ref}
        className={`cn ${className ?? ''}`}
        data-tone={tone}
        data-shown={shown || undefined}
        style={{ '--cn-gap': `${gap}px` } as React.CSSProperties}
      >
        {onPrev ? (
          <button
            type="button"
            className="cn-arrow"
            data-side="prev"
            aria-label={`Previous ${itemName}`}
            disabled={atStart}
            onClick={onPrev}
          >
            <CaretLeft />
          </button>
        ) : null}
        <div className="cn-dots" role="group" aria-label={`Choose a ${itemName}`}>
          {Array.from({ length: count }, (_, i) => {
            const current = i === active;
            return (
              <button
                key={i}
                type="button"
                className="cn-dot"
                aria-label={`${itemName} ${i + 1} of ${count}`}
                aria-current={current ? 'true' : undefined}
                onClick={() => onSelect(i)}
              >
                {current ? (
                  progress !== undefined ? (
                    <span
                      className="cn-fill"
                      style={{ '--cn-p': Math.min(1, Math.max(0, progress)) } as React.CSSProperties}
                    />
                  ) : interval ? (
                    // Re-keyed on every change, so the fill restarts with the slide.
                    <span
                      key={`${active}`}
                      className="cn-fill"
                      data-timed=""
                      data-paused={!running || undefined}
                      style={{ '--cn-interval': `${interval}ms` } as React.CSSProperties}
                    />
                  ) : (
                    <span className="cn-fill" style={{ '--cn-p': 1 } as React.CSSProperties} />
                  )
                ) : null}
              </button>
            );
          })}
        </div>
        {onNext ? (
          <button
            type="button"
            className="cn-arrow"
            data-side="next"
            aria-label={`Next ${itemName}`}
            disabled={atEnd}
            onClick={onNext}
          >
            <CaretRight />
          </button>
        ) : null}
      </div>
    </div>
  );
}
