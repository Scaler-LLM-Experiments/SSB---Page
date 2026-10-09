'use client';

import * as React from 'react';
import type { ResolvedLogo } from '@/lib/logos';

/** Twelve cells at most (6 × 2 on desktop, 4 × 2 on a tablet, 2 × 3 on a phone: CSS hides the rest). */
const CELLS = 12;
/** One cell turns every this many ms. */
const EVERY = 1800;

function Logo({ logo }: { logo: ResolvedLogo }) {
  return logo.src ? (
    // eslint-disable-next-line @next/next/no-img-element -- at its display size, no layout shift
    <img src={logo.src} alt="" width={logo.width} height={logo.height} decoding="async" className="peers-flip-logo" />
  ) : (
    <span className="type-h3 whitespace-nowrap text-content-secondary">{logo.wordmark}</span>
  );
}

/**
 * "Your peers come from" (2026-10-09): the logos in a grid of white cells, two rows on desktop. Every
 * couple of seconds one cell, picked at random, flips over (a turn on its horizontal axis) to a logo
 * not on show. Each cell has two faces; the hidden one takes the new logo, then the cell turns.
 * Still under reduced motion. Screen readers get the full list.
 */
export function PeersFlip({ logos, label }: { logos: ResolvedLogo[]; label: string }) {
  const n = Math.min(CELLS, logos.length);
  // per cell: the logo index on each face, and how far it has turned (in half turns)
  const [cells, setCells] = React.useState(() =>
    Array.from({ length: n }, (_, i) => ({ faces: [i, i] as [number, number], turns: 0 })),
  );
  const gridRef = React.useRef<HTMLUListElement>(null);

  React.useEffect(() => {
    if (logos.length <= n || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let last = -1;
    const id = window.setInterval(() => {
      const grid = gridRef.current;
      if (!grid || document.hidden) return;
      // only the cells this breakpoint shows
      const visible = Array.from(grid.children).flatMap((el, i) => ((el as HTMLElement).offsetParent ? [i] : []));
      if (!visible.length) return;
      setCells((prev) => {
        const shown = new Set(visible.map((i) => prev[i].faces[prev[i].turns % 2]));
        const pool = logos.map((_, k) => k).filter((k) => !shown.has(k));
        const choices = visible.filter((i) => i !== last);
        const at = choices[Math.floor(Math.random() * choices.length)];
        if (at === undefined || !pool.length) return prev;
        last = at;
        const next = pool[Math.floor(Math.random() * pool.length)];
        return prev.map((c, i) => {
          if (i !== at) return c;
          const faces = [...c.faces] as [number, number];
          faces[(c.turns + 1) % 2] = next;
          return { faces, turns: c.turns + 1 };
        });
      });
    }, EVERY);
    return () => window.clearInterval(id);
  }, [logos, n]);

  return (
    <>
      <ul className="sr-only" aria-label={label}>
        {logos.map((l) => (
          <li key={l.name}>{l.name}</li>
        ))}
      </ul>
      <ul ref={gridRef} className="peers-flip" aria-hidden>
        {cells.map((c, i) => (
          <li key={i} className="peers-flip-cell">
            <div className="peers-flip-card" style={{ transform: `rotateX(${c.turns * 180}deg)` }}>
              <div className="peers-flip-face">
                <Logo logo={logos[c.faces[0]]} />
              </div>
              <div className="peers-flip-face" data-back>
                <Logo logo={logos[c.faces[1]]} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
