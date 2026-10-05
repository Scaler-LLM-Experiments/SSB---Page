'use client';

import * as React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ease, motionTokens, prefersReducedMotion, useMotion } from '@kishanscaler/ssx-ui/motion';

import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';

const { duration: d, stagger: st, offset } = motionTokens;

/** Stat cells that arrive together (the desktop row) come up this far apart, in seconds. */
const CARD_GAP = st.base * 2;

/** The grid's logos all move on together every this many seconds. */
const CYCLE = 4;

/**
 * The placements section's motion, on the server-rendered markup in
 * PlacementsSection, found by `data-*` hooks:
 *
 *   data-enter        the header: the faculty section's entrance (useSectionEntrance)
 *   data-fade         a block (the recruiters): one gentle fade, once
 *   data-card         a stat cell: data-card-body, data-card-tint
 *   data-logo-grid    the logo grid: data-logo-cell > data-flipper > a face of data-front logos
 *                     and a face of data-back counts (the same order)
 *
 * Under reduced motion nothing moves: the stats are shown, each cell holds its
 * first logo, and pointing at one shows its count at once (no turn).
 */
export function PlacementsMotion({ children }: { children: React.ReactNode }) {
  const scope = React.useRef<HTMLDivElement>(null);

  // The header moves exactly as the faculty section's does.
  useSectionEntrance(scope);

  useMotion(
    (context) => {
      const root = scope.current;
      if (!root) return;
      gsap.registerPlugin(ScrollTrigger);
      const reduced = prefersReducedMotion(root);

      if (!reduced) {
        gsap.utils.toArray<HTMLElement>('[data-fade]', root).forEach(fadeIn);
        cards(root, context);
      }
      return logoGrid(root, reduced);
    },
    scope,
    [],
  );

  return <div ref={scope}>{children}</div>;
}

/** One gentle fade, once, as the block comes up. clamp() keeps the start reachable at the page's end. */
function fadeIn(block: HTMLElement) {
  // fromTo, never from(): an explicit end state survives React re-running the
  // effect (Strict Mode), where from() would read a half-hidden value.
  gsap.fromTo(
    block,
    { autoAlpha: 0, y: offset.enter },
    {
      autoAlpha: 1,
      y: 0,
      duration: d.slowest,
      ease: ease('expressiveEntrance'),
      clearProps: 'transform,opacity,visibility',
      scrollTrigger: { trigger: block, start: 'clamp(top 85%)', once: true },
    },
  );
}

/**
 * The stat cells come up one after another as the panel arrives (like the
 * faculty cards): each is wiped open from the bottom in the brand green, which
 * clears to white as its content fades in. The panel clips the outer corners.
 * Cells are batched by when they arrive, so the desktop row of four staggers
 * and a phone's column brings each up as it is reached.
 */
function cards(root: HTMLElement, context: gsap.Context) {
  const list = gsap.utils.toArray<HTMLElement>('[data-card]', root);
  if (!list.length) return;
  const closed = 'inset(100% 0% 0% 0%)';
  const open = 'inset(0% 0% 0% 0%)';

  const parts = list.map((card) => {
    const tint = card.querySelector('[data-card-tint]');
    const body = card.querySelector('[data-card-body]');
    gsap.set(card, { clipPath: closed });
    gsap.set(tint, { opacity: 1 });
    gsap.set(body, { autoAlpha: 0, y: offset.enter });
    return { card, tint, body };
  });

  const play = (card: Element, at: number) => {
    const part = parts.find((p) => p.card === card);
    if (!part) return;
    const wipe = d.slower * 1.25;
    gsap
      .timeline({ delay: at })
      .to(card, { clipPath: open, duration: wipe, ease: ease('expressiveInOut'), clearProps: 'clipPath' }, 0)
      // The green holds while the cell opens, then clears as its content comes in.
      .to(part.tint, { opacity: 0, duration: d.slowest, ease: ease('productiveInOut') }, wipe * 0.7)
      .to(
        part.body,
        {
          autoAlpha: 1,
          y: 0,
          duration: d.slowest,
          ease: ease('expressiveEntrance'),
          clearProps: 'transform',
        },
        wipe * 0.8,
      );
  };

  ScrollTrigger.batch(list, {
    start: 'clamp(top 85%)',
    once: true,
    // Added to the context, so the tweens are reverted with everything else.
    onEnter: (batch) => context.add(() => batch.forEach((card, i) => play(card, i * CARD_GAP))),
  });
}

/** A cell turns over in one continuous move. */
const FLIP = d.slower * 1.2;

/**
 * The logo grid. Every CYCLE seconds all the logos on show cross-fade to their
 * cell's next logo together (the old one drifts up and out as the new one
 * rises in). Pointing at a logo turns its cell over (a 3D flip on the
 * horizontal axis, both faces drawn, the back hidden by backface-visibility)
 * to how many of the cohort it hired; leaving turns it back; on a touch screen
 * a tap does both. The cycle waits while the pointer is on the grid, so a
 * turned cell keeps its company, and while the grid is off screen.
 *
 * The logos cross-fade inside the front face, never on the flipper or its
 * parents: opacity below 1 on an element flattens its 3D children, which would
 * show both faces mid-turn.
 */
function logoGrid(root: HTMLElement, reduced: boolean) {
  const grid = root.querySelector<HTMLElement>('[data-logo-grid]');
  if (!grid) return;
  type Cell = {
    cell: HTMLElement;
    flipper: HTMLElement;
    fronts: HTMLElement[];
    backs: HTMLElement[];
    at: number;
    flipped: boolean;
  };
  const cells = gsap.utils.toArray<HTMLElement>('[data-logo-cell]', grid).flatMap((cell): Cell[] => {
    const flipper = cell.querySelector<HTMLElement>('[data-flipper]');
    const fronts = gsap.utils.toArray<HTMLElement>('[data-front]', cell);
    const backs = gsap.utils.toArray<HTMLElement>('[data-back]', cell);
    return flipper && fronts.length ? [{ cell, flipper, fronts, backs, at: 0, flipped: false }] : [];
  });
  if (!cells.length) return;

  const flip = (c: Cell, toBack: boolean) => {
    if (c.flipped === toBack || (toBack && !c.backs[c.at]?.hasAttribute('data-placed'))) return;
    c.flipped = toBack;
    gsap.to(c.flipper, {
      rotateX: toBack ? 180 : 0,
      duration: reduced ? 0 : FLIP,
      ease: ease('expressiveInOut'),
      overwrite: true,
    });
  };

  const advance = () => {
    const tl = gsap.timeline();
    cells
      .filter((c) => c.fronts.length > 1 && c.cell.offsetParent !== null)
      .forEach((c) => {
        const from = c.at;
        c.at = (c.at + 1) % c.fronts.length;
        // A cell turned over by a tap turns back first; its count changes once it faces away.
        const turned = c.flipped;
        flip(c, false);
        tl.to(
          c.fronts[from],
          { autoAlpha: 0, y: `-${offset.enter}`, duration: d.slow, ease: ease('productiveExit') },
          0,
        )
          .set(c.fronts[from], { y: 0 }, d.slow)
          .fromTo(
            c.fronts[c.at],
            { autoAlpha: 0, y: offset.enter },
            {
              autoAlpha: 1,
              y: 0,
              duration: d.slower,
              ease: ease('expressiveEntrance'),
              clearProps: 'transform',
            },
            d.slow * 0.6,
          )
          .set(c.backs[from], { autoAlpha: 0 }, turned ? FLIP : 0)
          .set(c.backs[c.at], { autoAlpha: 1 }, turned ? FLIP : 0);
      });
  };

  let onScreen = false;
  let pointing = false;
  let timer: gsap.core.Tween | null = null;
  const schedule = () => {
    timer?.kill();
    timer =
      onScreen && !pointing && !reduced
        ? gsap.delayedCall(CYCLE, () => {
            advance();
            schedule();
          })
        : null;
  };

  ScrollTrigger.create({
    trigger: grid,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => {
      onScreen = self.isActive;
      schedule();
    },
  });

  const off: (() => void)[] = [];
  const listen = <K extends keyof HTMLElementEventMap>(
    el: HTMLElement,
    type: K,
    fn: (event: HTMLElementEventMap[K]) => void,
  ) => {
    el.addEventListener(type, fn);
    off.push(() => el.removeEventListener(type, fn));
  };
  listen(grid, 'pointerenter', (e) => {
    if (e.pointerType !== 'mouse') return;
    pointing = true;
    schedule();
  });
  listen(grid, 'pointerleave', (e) => {
    if (e.pointerType !== 'mouse') return;
    pointing = false;
    schedule();
  });
  cells.forEach((c) => {
    listen(c.cell, 'pointerenter', (e) => e.pointerType === 'mouse' && flip(c, true));
    listen(c.cell, 'pointerleave', (e) => e.pointerType === 'mouse' && flip(c, false));
    listen(c.cell, 'pointerup', (e) => e.pointerType !== 'mouse' && flip(c, !c.flipped));
  });

  return () => {
    timer?.kill();
    off.forEach((fn) => fn());
    gsap.killTweensOf(cells.map((c) => c.flipper));
  };
}
