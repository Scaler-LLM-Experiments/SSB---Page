/**
 * What every concept shares: which year is open (one at a time, §4.2), how
 * the rest of an open year is presented (inline under the concept, or the
 * existing BottomSheet / SideDrawer), and focus return on close (§9).
 */
import * as React from 'react';
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetHeader,
  BottomSheetTitle,
  SideDrawer,
  SideDrawerBody,
  SideDrawerContent,
  SideDrawerDescription,
  SideDrawerHeader,
  SideDrawerTitle,
} from '@kishanscaler/ssx-ui';
import type { Year } from '../data';
import { fmt } from '../data';
import type { JourneyConfig } from '../config';
import { YearDetail } from '../cards';
import { useLabels } from '../parts';

export type Omit4 = NonNullable<React.ComponentProps<typeof YearDetail>['omit']>;

/** The open year + a registry of the controls that opened each year, for focus return. */
export function useOpenYear(initial: number | null) {
  const [open, setOpen] = React.useState<number | null>(initial);
  React.useEffect(() => setOpen(initial), [initial]);
  const openers = React.useRef<Record<number, HTMLElement | null>>({});
  const close = React.useCallback(() => {
    setOpen((n) => {
      if (n) requestAnimationFrame(() => openers.current[n]?.focus());
      return null;
    });
  }, []);
  const toggle = React.useCallback((n: number) => setOpen((o) => (o === n ? null : n)), []);
  const opener = (n: number) => (el: HTMLElement | null) => {
    openers.current[n] = el;
  };
  return { open, setOpen, toggle, close, opener };
}

/** Where the rest of an open year goes at this width. */
export function presentation(cfg: JourneyConfig, width: number): 'inline' | 'sheet' | 'drawer' {
  const narrow = width > 0 && width < 768;
  if (narrow) return cfg.openMobile === 'sheet' ? 'sheet' : 'inline';
  return cfg.openDesktop === 'drawer' ? 'drawer' : 'inline';
}

/** Sheet (m-web) or drawer (desktop) holding the open year. Inline is rendered by the concept. */
export function YearOverlay({
  y,
  mode,
  cfg,
  portal,
  id,
  onClose,
  omit,
  lead,
}: {
  y: Year | null;
  mode: 'sheet' | 'drawer';
  cfg: JourneyConfig;
  portal?: HTMLElement | null;
  id: string;
  onClose: () => void;
  omit?: Omit4;
  /** The concept's own open state (an exploded artifact) above the detail. */
  lead?: React.ReactNode;
}) {
  const L = useLabels();
  const yl = y ? fmt(L.yearLabel, y.year) : '';
  const body = y ? (
    <div style={{ display: 'grid', gap: 24 }}>
      {lead}
      <YearDetail y={y} cfg={cfg} id={id} narrow={mode === 'sheet'} headless omit={omit} />
    </div>
  ) : null;
  if (mode === 'sheet')
    return (
      <BottomSheet open={!!y} onOpenChange={(o) => !o && onClose()}>
        {y ? (
          <BottomSheetContent container={portal ?? undefined}>
            <BottomSheetHeader eyebrow={yl} closeLabel={fmt(L.close, yl)}>
              <BottomSheetTitle>{y.name}</BottomSheetTitle>
              <BottomSheetDescription>{y.ship}</BottomSheetDescription>
            </BottomSheetHeader>
            <BottomSheetBody>{body}</BottomSheetBody>
          </BottomSheetContent>
        ) : null}
      </BottomSheet>
    );
  return (
    <SideDrawer open={!!y} onOpenChange={(o) => !o && onClose()}>
      {y ? (
        <SideDrawerContent size="wide" container={portal ?? undefined}>
          <SideDrawerHeader eyebrow={yl} closeLabel={fmt(L.close, yl)}>
            <SideDrawerTitle>{y.name}</SideDrawerTitle>
            <SideDrawerDescription>{y.ship}</SideDrawerDescription>
          </SideDrawerHeader>
          <SideDrawerBody>{body}</SideDrawerBody>
        </SideDrawerContent>
      ) : null}
    </SideDrawer>
  );
}

/** Element size, kept in sync. */
export function useSize<T extends HTMLElement>(): [React.RefCallback<T>, { w: number; h: number }, T | null] {
  const [el, setEl] = React.useState<T | null>(null);
  const [size, setSize] = React.useState({ w: 0, h: 0 });
  React.useLayoutEffect(() => {
    if (!el) return undefined;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, [el]);
  return [setEl, size, el];
}

export const prefersReducedMotion = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
