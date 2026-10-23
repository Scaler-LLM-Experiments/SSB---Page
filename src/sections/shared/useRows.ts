'use client';

import * as React from 'react';

/**
 * How many rows a card grid shows at this width: `wide` from 672px, one on a phone (2026-10-23, the
 * team's ask: single rows on phones). For the dots under the grid, one per column.
 */
export function useRows(wide = 2) {
  const [rows, setRows] = React.useState(wide);
  React.useEffect(() => {
    const mq = window.matchMedia('(min-width: 672px)');
    const set = () => setRows(mq.matches ? wide : 1);
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, [wide]);
  return rows;
}
