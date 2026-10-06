'use client';

import * as React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ease, motionTokens, useMotion } from '@kishanscaler/ssx-ui/motion';
import { centredFrame, clearCard, drawCard, navHeight, tokenPx, type CardView } from '../shared/frame';
import { hooksIn, runIntro, type Get } from '../shared/intro';
import { MOMENT } from './moment';

const { duration, offset } = motionTokens;

/** The system's `md` breakpoint. Below it the video stays where it is. */
const DESKTOP_WITH_MOTION = '(min-width: 1056px) and (prefers-reduced-motion: no-preference)';
const OTHERWISE = '(max-width: 1055px), (prefers-reduced-motion: reduce)';

/**
 * Hero V2's motion: the shared intro (fly into the SSB mark, land on campus,
 * the footage settles into the hero and feathers into the black); then, on
 * desktop, the scroll moment. The hero pins, the copy recedes, and the video
 * travels to the centre of the screen, inside the page margins, while its
 * feathered edge hardens into a rounded 16:9 frame. Then the black fades to
 * the light page, so the hero hands over to white. The card moves by
 * transforms only (`drawCard`): none of it is a layout shift.
 */
export function HeroV2Motion({ children }: { children: React.ReactNode }) {
  const scope = React.useRef<HTMLDivElement>(null);

  useMotion((context) => {
    const root = scope.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const scroll = gsap.matchMedia();

    // The resting feathers, read from hero-v2.css before anything is tweened.
    const card = hooksIn(root)('video-card');
    const rest = card ? restingFeathers(card) : null;

    // The full film (FilmPlayer) closes when the scroll moment says: scrolled
    // back out of the frame, or the hero off screen. It never plays unseen.
    const closeFilm = () => card?.dispatchEvent(new Event('film:close'));

    const stopIntro = runIntro(root, context, {
      // Full-screen, the footage has hard edges; as it settles into the hero,
      // its edges feather back into the black.
      media: (tl, get) => {
        if (!rest) return;
        tl.set(
          get('video-card'),
          {
            '--feather-left': '0%',
            '--feather-right': '0%',
            '--feather-top': '0%',
            '--feather-bottom': '0%',
          },
          'swap',
        )
          .to(
            get('video-card'),
            {
              ...rest,
              duration: duration.slowest * 1.25,
              ease: ease('expressiveEntrance'),
            },
            'land',
          )
          .set(get('video-card'), {
            clearProps: '--feather-left,--feather-right,--feather-top,--feather-bottom',
          });
      },
      onDone: () => {
        scroll.add(DESKTOP_WITH_MOTION, () => videoMoment(hooksIn(root), closeFilm));
        scroll.add(OTHERWISE, () => navFollowsPage(hooksIn(root)));
      },
    });

    return () => {
      closeFilm();
      stopIntro();
      scroll.revert();
    };
  }, scope);

  return <div ref={scope}>{children}</div>;
}

/** The card's feathers as hero-v2.css sets them for the current width. */
function restingFeathers(card: HTMLElement) {
  const style = getComputedStyle(card);
  const feather = (edge: string) => style.getPropertyValue(`--feather-${edge}`).trim();
  return {
    '--feather-left': feather('left'),
    '--feather-right': feather('right'),
    '--feather-top': feather('top'),
    '--feather-bottom': feather('bottom'),
  };
}

function videoMoment(get: Get, closeFilm: () => void) {
  const section = get('hero')!;
  const slot = get('video-slot')!;
  const card = get('video-card')!;
  const overlay = get('video-overlay');
  const from = restingFeathers(card);
  // Inside the page margins, lined up with the copy, not edge to edge.
  const frame = () => centredFrame(get, 'content');
  const view: CardView = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    radius: 0,
    zoom: 1,
  };
  const draw = () => drawCard(get, view);
  // The overlays are laid out at the frame's size, so they are 1:1 once framed.
  const sizeOverlay = () => {
    if (!overlay) return;
    const { width, height } = frame();
    overlay.style.width = `${width}px`;
    overlay.style.height = `${height}px`;
  };
  sizeOverlay();

  // The timeline runs in screens of scroll (moment.ts): the track adds exactly
  // its length to the hero's own screen, so position 0.25 is a quarter of a
  // viewport's height of scrolling, on any display.
  const framedAt = MOMENT.frame * 0.75; // the play button starts to arrive
  const whiteAt = MOMENT.frame + MOMENT.beat;

  // The hero scrolled away under the nav: an open film closes.
  ScrollTrigger.create({
    trigger: get('hero-pin'),
    start: () => `bottom top+=${navHeight(get)}`,
    onEnter: closeFilm,
  });

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      // The hero sticks at the top of the window, under the floating nav (CSS), while its
      // tall track scrolls past.
      trigger: get('hero-pin'),
      start: 'top top',
      end: 'bottom bottom',
      // Light smoothing: more lags the scroll, and a quick flick reaches the end
      // of the track (the hero starts scrolling away) before the moment has.
      scrub: duration.slow,
      invalidateOnRefresh: true,
      onRefresh: sizeOverlay,
      // Scrolled back before the play button arrives, the frame is opening up
      // again: an open film closes.
      onUpdate: (self) => {
        if (self.progress * tl.duration() < framedAt) closeFilm();
      },
    },
  });

  tl
    // The card's box, drawn with transforms, and its feathered edge hardening,
    // on the same curve.
    .fromTo(
      view,
      {
        left: 0,
        top: 0,
        width: () => slot.offsetWidth,
        height: () => slot.offsetHeight,
        radius: 0,
      },
      {
        left: () => frame().left,
        top: () => frame().top,
        width: () => frame().width,
        height: () => frame().height,
        radius: () => tokenPx('--radius-2xl'),
        ease: ease('productiveInOut'),
        duration: MOMENT.frame,
        onUpdate: draw,
      },
      0,
    )
    .fromTo(
      card,
      { ...from },
      {
        '--feather-left': '0%',
        '--feather-right': '0%',
        '--feather-top': '0%',
        '--feather-bottom': '0%',
        ease: ease('productiveInOut'),
        duration: MOMENT.frame,
      },
      0,
    )
    // The copy fades as soon as scrolling starts, clearing the stage for the video.
    .to(
      gsap.utils.toArray<HTMLElement>('[data-hero-fade]', section),
      {
        autoAlpha: 0,
        y: `-${offset.reveal}`,
        duration: MOMENT.fade,
        ease: ease('productiveInOut'),
      },
      0,
    )
    // After a beat, the black gives way to the light page, behind the open
    // frame, and the nav turns light with it.
    .fromTo(get('hero-light'), { autoAlpha: 0 }, { autoAlpha: 1, duration: MOMENT.white }, whiteAt)
    .set(get('hero-nav'), { attr: { 'data-theme': 'light' } }, whiteAt + MOMENT.white / 2)
    // Hold the frame on white to the end of the track.
    .to({}, { duration: MOMENT.hold }, whiteAt + MOMENT.white);

  // The play button and caption arrive with the video, overlapping its last
  // stretch (each only if the hero has one).
  const arrive = { autoAlpha: 1, duration: MOMENT.frame * 0.35, ease: ease('productiveInOut') };
  const play = get('video-play');
  const caption = get('video-caption');
  if (play) tl.fromTo(play, { autoAlpha: 0 }, arrive, framedAt);
  if (caption) tl.fromTo(caption, { autoAlpha: 0, y: offset.enter }, { ...arrive, y: 0 }, framedAt);

  return () => clearCard(get);
}

/** Without the scroll moment, the nav turns light as the black hero scrolls out from under it. */
function navFollowsPage(get: Get) {
  const nav = get('hero-nav');
  if (!nav) return;
  ScrollTrigger.create({
    trigger: get('hero'),
    start: () => `bottom top+=${navHeight(get)}`,
    onEnter: () => nav.setAttribute('data-theme', 'light'),
    onLeaveBack: () => nav.setAttribute('data-theme', 'dark'),
  });
  return () => nav.setAttribute('data-theme', 'dark');
}
