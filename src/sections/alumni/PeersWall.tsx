import * as React from 'react';
import type { ResolvedLogo } from '@/lib/logos';

/** Columns drawn: 4 from a tablet up, 3 on a phone (CSS hides the last). */
const COLUMNS = 4;
/** Each column holds at least this many tiles per copy, so it is taller than its box. */
const MIN_COLUMN = 6;

/**
 * "Your peers come from" as Placements' drifting wall (2026-10-12, the team's ask: "something like"
 * version C's logo columns): the logos on white tiles in columns, every other one drifting up, the
 * rest down, faded at the top and the foot; paused under the pointer, still under reduced motion.
 * Decorative: screen readers get the full list.
 */
export function PeersWall({ logos, label }: { logos: ResolvedLogo[]; label: string }) {
  const columns = Array.from({ length: COLUMNS }, (_, c) => {
    const column = logos.filter((_, i) => i % COLUMNS === c);
    return column.length ? Array.from({ length: Math.ceil(MIN_COLUMN / column.length) }, () => column).flat() : [];
  });
  return (
    <>
      <ul className="sr-only" aria-label={label}>
        {logos.map((l) => (
          <li key={l.name}>{l.name}</li>
        ))}
      </ul>
      <div className="peers-wall" aria-hidden>
        {columns.map((column, c) => (
          <div key={c} className="peers-wall-col">
            <div
              className="peers-wall-track"
              data-dir={c % 2 ? 'down' : 'up'}
              style={{ '--n': column.length } as React.CSSProperties}
            >
              {[...column, ...column].map((logo, i) => (
                <div key={i} className="peers-wall-tile">
                  {logo.src ? (
                    // eslint-disable-next-line @next/next/no-img-element -- at its display size, no layout shift
                    <img
                      src={logo.src}
                      alt=""
                      width={logo.width}
                      height={logo.height}
                      decoding="async"
                      style={logo.width ? ({ '--w': `${logo.width}px` } as React.CSSProperties) : undefined}
                    />
                  ) : (
                    <span className="type-label text-content">{logo.wordmark}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
