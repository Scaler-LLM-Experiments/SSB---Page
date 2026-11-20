'use client';

import * as React from 'react';
import { ChartLineUp, Trophy } from '@phosphor-icons/react';

import type { internshipCloser } from '@/content/internship';
import type { ResolvedLogo } from '@/lib/logos';
import { PeersFlip } from '@/sections/alumni/PeersFlip';
import '@/sections/alumni/alumni.css';
import './internship-page.css';

/** The donut's ring: radius and circumference in the SVG's units (a 120 × 120 box). */
const R = 48;
const C = 2 * Math.PI * R;
/** The gap between two segments, in the same units. */
const GAP = 1.6;

const ICONS = { revenue: ChartLineUp, trophy: Trophy };

/**
 * "A closer look" (the internship page, 2026-11-12, after the user's reference: his earlier "Take a look
 * at cohort distribution"), under the profiles: a heading with the brand green's bar beside it, then one
 * white card of the page's split by hairlines into numbered blocks. 01 the role split as a donut in the
 * brand green's steps beside its legend; 02 the live page's two "Did you know?" facts, each its icon
 * on a tint, the figure and its line; 03 the companies in bordered tiles across the card's foot, on the
 * first fold's flip grid (PeersFlip, the user's ask: "let it change logos"): twelve tiles turning
 * through the twenty-four, starting from the other twelve so the two grids don't mirror. The donut
 * draws in once the card is a fifth on screen; under reduced motion it is simply there. Phones: the
 * blocks stacked, the tiles three across.
 */
export function InternshipCloser({
  content: c,
  logos,
}: {
  content: typeof internshipCloser;
  /** the companies, sized by the page (`resolveLogos`, server-only) */
  logos: ResolvedLogo[];
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const total = c.roles.items.reduce((sum, r) => sum + r.share, 0);
  let start = 0;
  const segments = c.roles.items.map((r) => {
    const len = (r.share / total) * C;
    const seg = { name: r.name, len: Math.max(0, len - GAP), off: -start };
    start += len;
    return seg;
  });

  return (
    <div className="int-closer">
      <h3 className="int-closer-title">{c.title}</h3>
      <div ref={ref} className="int-num-card" data-in={shown || undefined}>
        <div className="int-num-top">
          {/* 01: the role split */}
          <div className="int-num-block">
            <h4 className="int-num-title">
              <span className="int-num-k">{c.roles.num}</span>
              {c.roles.title}
            </h4>
            <div className="int-donut-wrap">
              <svg className="int-donut" viewBox="0 0 120 120" role="img" aria-label={c.roles.title}>
                <g transform="rotate(-90 60 60)">
                  {segments.map((s, i) => (
                    <circle
                      key={s.name}
                      cx="60"
                      cy="60"
                      r={R}
                      data-step={i}
                      style={
                        {
                          '--len': s.len,
                          '--c': C,
                          strokeDashoffset: s.off,
                          transitionDelay: `${i * 90}ms`,
                        } as React.CSSProperties
                      }
                    />
                  ))}
                </g>
              </svg>
              <ul className="int-donut-legend">
                {c.roles.items.map((r, i) => (
                  <li key={r.name} data-step={i}>
                    <span className="int-key" aria-hidden="true" />
                    <b>{r.share}%</b>
                    {r.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 02: the two facts */}
          <div className="int-num-block">
            <h4 className="int-num-title">
              <span className="int-num-k">{c.facts.num}</span>
              {c.facts.title}
            </h4>
            <dl className="int-facts">
              {c.facts.items.map((f) => {
                const Icon = ICONS[f.icon];
                return (
                  <div key={f.value}>
                    <span className="int-fact-icon" aria-hidden="true">
                      <Icon weight="duotone" />
                    </span>
                    <dd>{f.value}</dd>
                    <dt>{f.label}</dt>
                  </div>
                );
              })}
            </dl>
          </div>
        </div>

        {/* 03: the companies */}
        <div className="int-num-block int-num-foot">
          <h4 className="int-num-title">
            <span className="int-num-k">{c.companies.num}</span>
            {c.companies.title}
          </h4>
          {/* all 24 companies up front (2026-11-13, the user's ask): a tile each, so nothing turns over */}
          <PeersFlip
            logos={logos}
            label={c.companies.title}
            cells={logos.length}
            className="int-co-flip"
          />
        </div>
      </div>
    </div>
  );
}
