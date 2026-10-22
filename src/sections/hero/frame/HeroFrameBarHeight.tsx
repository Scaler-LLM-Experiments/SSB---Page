'use client';

import * as React from 'react';

/**
 * Keeps `--hf-bar` on <html> at the deadline bar's height (it wraps to two lines on a phone), so the
 * sticky navbar can stand just under the sticky bar. Renders nothing.
 */
export function HeroFrameBarHeight() {
  const ref = React.useRef<HTMLSpanElement>(null);
  React.useEffect(() => {
    const bar = ref.current?.parentElement;
    if (!bar) return undefined;
    const root = document.documentElement;
    const set = () => root.style.setProperty('--hf-bar', `${Math.round(bar.getBoundingClientRect().height)}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(bar);
    return () => {
      ro.disconnect();
      root.style.removeProperty('--hf-bar');
    };
  }, []);
  return <span ref={ref} hidden />;
}
