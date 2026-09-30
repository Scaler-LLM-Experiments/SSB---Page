'use client';

import * as React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ease, motionTokens, useMotion } from '@kishanscaler/ssx-ui/motion';
import { centredFrame, navHeight, tokenPx } from '../shared/frame';
import { hooksIn, runIntro, type Get } from '../shared/intro';

const { duration, offset } = motionTokens;

/** The system's `md` breakpoint. Below it the video stays where it is. */
const DESKTOP_WITH_MOTION = '(min-width: 1056px) and (prefers-reduced-motion: no-preference)';
const OTHERWISE = '(max-width: 1055px), (prefers-reduced-motion: reduce)';

/**
 * Hero V2's motion: the shared intro (fly into the SSB mark, land on campus,
 * the footage settles into the hero and feathers into the black); then, on
 * desktop, the scroll moment. The hero pins, the copy recedes, and the video
 * travels to the centre of the screen, inside the page margins, while its
 * feathered edges harden into a rounded 16:9 frame. Then the black fades to
 * the light page, so the hero hands over to white.
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
            { ...rest, duration: duration.slowest * 1.25, ease: ease('expressiveEntrance') },
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

    // The play button (shown once the video is framed) opens the full film from
    // YouTube in the frame, with sound, in place of the silent loop. Scrolling
    // back out of the frame, or the hero off screen, closes it and the loop
    // carries on, so the film never plays where it can't be seen.
    const play = root.querySelector('[data-video-play] button');
    const filmId = hooksIn(root)('video-play')?.dataset.youtubeId;
    const loop = root.querySelector('video');
    const openFilm = () => {
      if (!card || !filmId || card.querySelector('iframe')) return;
      const film = document.createElement('iframe');
      film.src = `https://www.youtube-nocookie.com/embed/${filmId}?autoplay=1&rel=0&playsinline=1`;
      film.title = 'Scaler School of Business campus film';
      film.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      film.allowFullscreen = true;
      film.className = 'absolute inset-0 h-full w-full';
      card.setAttribute('data-film-open', '');
      card.append(film);
      loop?.pause();
      film.focus();
    };
    function closeFilm() {
      const film = card?.querySelector('iframe');
      if (!film) return;
      film.remove();
      card!.removeAttribute('data-film-open');
      void loop?.play();
    }
    play?.addEventListener('click', openFilm);

    return () => {
      play?.removeEventListener('click', openFilm);
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
  const from = restingFeathers(card);
  // Inside the page margins, lined up with the copy, not edge to edge.
  const frame = () => centredFrame(get, 'content');

  // Where the play button starts to fade in: scrolled back before it, the
  // frame is opening up again, and an open film closes.
  const framedAt = 0.3;

  // The hero scrolled away under the nav: an open film closes.
  ScrollTrigger.create({
    trigger: get('hero-pin'),
    start: () => `bottom top+=${navHeight(get)}`,
    onEnter: closeFilm,
  });

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      // The hero sticks under the nav (CSS) while its tall track scrolls past.
      trigger: get('hero-pin'),
      start: () => `top top+=${navHeight(get)}`,
      end: 'bottom bottom',
      scrub: duration.slower,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (self.progress * tl.duration() < framedAt) closeFilm();
      },
    },
  });

  tl
    // Positions are shares of the scroll distance.
    .fromTo(
      card,
      {
        left: 0,
        top: 0,
        width: () => slot.offsetWidth,
        height: () => slot.offsetHeight,
        borderRadius: 0,
        ...from,
      },
      {
        left: () => frame().left,
        top: () => frame().top,
        width: () => frame().width,
        height: () => frame().height,
        borderRadius: () => tokenPx('--radius-2xl'),
        '--feather-left': '0%',
        '--feather-right': '0%',
        '--feather-top': '0%',
        '--feather-bottom': '0%',
        ease: ease('productiveInOut'),
        duration: 0.4,
      },
      0,
    )
    // The copy fades as soon as scrolling starts, clearing the stage for the video.
    .to(
      gsap.utils.toArray<HTMLElement>('[data-hero-fade]', section),
      {
        autoAlpha: 0,
        y: `-${offset.reveal}`,
        duration: 0.12,
        ease: ease('productiveInOut'),
      },
      0,
    )
    // The play button and caption arrive with the video, overlapping its last stretch.
    .fromTo(
      get('video-play'),
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.12, ease: ease('productiveInOut') },
      framedAt,
    )
    .fromTo(
      get('video-caption'),
      { autoAlpha: 0, y: offset.enter },
      { autoAlpha: 1, y: 0, duration: 0.12, ease: ease('productiveInOut') },
      framedAt,
    )
    // Then the black gives way to the light page, behind the open frame, and
    // the nav turns light with it.
    .fromTo(get('hero-light'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 0.6)
    .set(get('hero-nav'), { attr: { 'data-theme': 'light' } }, 0.7)
    // Hold the frame on white for the rest of the scroll.
    .to({}, { duration: 0.2 });
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
