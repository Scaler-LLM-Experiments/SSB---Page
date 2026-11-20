'use client';

import * as React from 'react';
import { CheckCircle, MinusCircle } from '@phosphor-icons/react';

import { programCompare as cmp } from '@/content/program';
import { ScrollDots } from '@/sections/shared/ScrollDots';

/**
 * SSB vs traditional on phones (2026-11-13, the user's ask: "a carousel kind of feel"): one card an
 * aspect, swiped sideways, the next card peeking in at the right. Each card names its aspect, then
 * SSB's line on the pale brand green with a green check, then the conventional programmes' line under
 * it on grey with a grey minus, so each pair reads at a glance. Dots under it mark the card in view
 * (the page's own ScrollDots, as every carousel). Shown below 672px only (program.css); desktop keeps its two cards.
 */
export function CompareSwipe() {
  const row = React.useRef<HTMLOListElement>(null);

  return (
    <div className="pgs">
      <ol ref={row} className="pgs-row" aria-label="SSB’s PGP-MT compared with conventional programs">
        {cmp.rows.map((r, i) => (
          <li key={r.label} className="pgs-card" aria-label={`${r.label}, ${i + 1} of ${cmp.rows.length}`}>
            <p className="pgs-aspect">
              <span className="pgs-n">{String(i + 1).padStart(2, '0')}</span>
              {r.label}
            </p>
            <div className="pgs-side pgs-side-ssb">
              <p className="pgs-who">SSB’s PGP-MT</p>
              <p className="pgs-line">
                <CheckCircle weight="fill" aria-hidden="true" />
                {r.ssb}
              </p>
            </div>
            <div className="pgs-side pgs-side-trad">
              <p className="pgs-who">{cmp.traditionalLabel}</p>
              <p className="pgs-line">
                <MinusCircle aria-hidden="true" />
                {r.traditional}
              </p>
            </div>
          </li>
        ))}
      </ol>
      {/* the page's own carousel controls (the alumni and faculty rows' ScrollDots): dots between arrows */}
      <div className="pgs-dots">
        <ScrollDots scroller={row} count={cmp.rows.length} itemName="aspects" fill="solid" autoplay={false} />
      </div>
    </div>
  );
}
