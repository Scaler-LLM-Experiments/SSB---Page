'use client';

import * as React from 'react';

/**
 * The Placements card's two versions (2026-10-09): A, the carousel of three cards with chips; B, one
 * static card with the three figures and a strip of logos; C (?placements=v3), A's card held still
 * with all three figures and the logos drifting at its right. Both are in the page; this sets
 * `data-placements` on <html> (the CSS shows one) and keeps it in the address (?placements=static).
 * A small switch fixed at the window's foot, as the terms' experiment has.
 */
type Version = 'carousel' | 'static' | 'v3';

export function PlacementsVariant() {
  const [v, setV] = React.useState<Version>('carousel');
  React.useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('placements');
    setV(p === 'static' || p === 'v3' ? p : 'carousel');
  }, []);
  React.useEffect(() => {
    document.documentElement.dataset.placements = v;
  }, [v]);
  const pick = (next: Version) => {
    setV(next);
    const u = new URL(window.location.href);
    if (next !== 'carousel') u.searchParams.set('placements', next);
    else u.searchParams.delete('placements');
    window.history.replaceState(null, '', u);
  };
  return (
    <div className="pl-variant" role="group" aria-label="Placements card version">
      <span>Placements</span>
      <button type="button" aria-pressed={v === 'carousel'} onClick={() => pick('carousel')}>
        A · Carousel
      </button>
      <button type="button" aria-pressed={v === 'static'} onClick={() => pick('static')}>
        B · Static
      </button>
      <button type="button" aria-pressed={v === 'v3'} onClick={() => pick('v3')}>
        C · Stats + logos
      </button>
    </div>
  );
}
