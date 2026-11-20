'use client';

import * as React from 'react';

/**
 * Pins the whole document to light on /program (2026-11-13, the user's ask: no dark anywhere). The
 * design system's dark tokens apply at the root whenever the OS prefers dark and `<html>` isn't
 * `data-theme="light"`, and its `--color-*` aliases resolve there, so a light `<main>` alone still
 * showed dark surfaces. The inline script sets it before the first paint; the effect takes it off
 * again when the page is left, so other routes keep following the OS.
 */
export function PinLight() {
  React.useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-theme', 'light');
    return () => html.removeAttribute('data-theme');
  }, []);
  return (
    <script
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: "document.documentElement.setAttribute('data-theme','light')" }}
    />
  );
}
