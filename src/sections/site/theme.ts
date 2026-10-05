import * as React from 'react';

export type Theme = 'light' | 'dark';

const read = () => document.documentElement.dataset.theme as Theme | undefined;
const subscribe = (onChange: () => void) => {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => mo.disconnect();
};
// on the server (a pre-rendered page) there is no document yet; hydration starts
// from the same undefined, then React re-renders with the theme read from <html>
const readOnServer = () => undefined;

/**
 * The theme on <html>, kept live. Parts that carry `data-brand="ssb"` must
 * repeat it as their own `data-theme`: the brand rule re-declares the light
 * tokens on that element, so an ancestor's dark theme would not reach inside.
 */
export function useDocTheme(): Theme | undefined {
  return React.useSyncExternalStore(subscribe, read, readOnServer);
}
