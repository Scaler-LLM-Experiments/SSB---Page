'use client';

import * as React from 'react';

/** How long each step holds before the next tile turns over. */
const STEP_MS = 2400;

/**
 * The phones' "Faculty & leaders from" logos (the team's ask, 2026-10-22): four white tiles showing four
 * of the logos; every STEP_MS one tile turns over (left to right, in turn) to the next logo not on
 * show, so all of them come round and none shows twice at once. The new face turns in from edge-on
 * (rotateX, no back face: Safari drew back faces mirrored). Waits while off screen or on a hidden tab;
 * still under reduced motion. Every logo is named once to screen readers.
 */
export function HeroFrameFlipLogos({ logos, tiles = 4 }: { logos: { name: string; src: string }[]; tiles?: number }) {
  const n = Math.min(tiles, logos.length);
  // which logo each tile shows, and the next logo to bring in
  const [shown, setShown] = React.useState(() => Array.from({ length: n }, (_, i) => i));
  const next = React.useRef(n);
  const turn = React.useRef(0);
  const ref = React.useRef<HTMLUListElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || logos.length <= n || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    const t = window.setInterval(() => {
      if (!visible || document.hidden) return;
      setShown((cur) => {
        const out = [...cur];
        // the next logo that isn't already on a tile
        let pick = next.current % logos.length;
        while (out.includes(pick)) pick = (pick + 1) % logos.length;
        out[turn.current] = pick;
        next.current = pick + 1;
        turn.current = (turn.current + 1) % n;
        return out;
      });
    }, STEP_MS);
    return () => {
      window.clearInterval(t);
      io.disconnect();
    };
  }, [logos.length, n]);

  return (
    <>
      <p className="hf-sr">{logos.map((l) => l.name).join(', ')}</p>
      <ul ref={ref} className="hf-flip" aria-hidden="true">
        {shown.map((idx, i) => (
          <li key={i}>
            {/* keyed by the logo: a new logo mounts afresh and plays the turn */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={idx} src={logos[idx].src} alt="" className="hf-flip-logo" loading="eager" decoding="async" />
          </li>
        ))}
      </ul>
    </>
  );
}
