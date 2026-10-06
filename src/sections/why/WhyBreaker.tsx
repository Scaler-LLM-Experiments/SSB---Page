'use client';

import * as React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Container, Heading, Text } from '@kishanscaler/ssx-ui';
import { ease, motionTokens, prefersReducedMotion, useMotion } from '@kishanscaler/ssx-ui/motion';
import { Play, SpeakerSimpleSlash } from '@phosphor-icons/react';

import { PLAYING, loadYouTube, type YTPlayer } from '@/lib/youtube';
import type { WhyFigure, WhyQuote } from './types';
import './why.css';

const { duration: d, stagger: st, offset } = motionTokens;

/** No YouTube captions: the words are set beside the clip already. */
function noCaptions(player: YTPlayer) {
  player.unloadModule?.('captions');
  player.unloadModule?.('cc');
}

/**
 * The breaker that opens Why SSB, after Apple's product blocks: the clip of
 * the remark the full width of the page, Nikhil Kamath on its left looking
 * right, and the words on the right where he is looking, the clip fading and
 * blurring into the page under them (a progressive blur, then the page's
 * colour). An eyebrow, the words as the title (lighting from grey to ink as
 * they scroll up: the one moment), who said it in one line, "Watch the clip",
 * then the two figures that say he isn't alone, as Apple sets its spec
 * figures. On a phone the clip sits above the words, fading into the page.
 *
 * The clip is YouTube's player (youtube-nocookie), not a copy: the footage is
 * Zerodha's. It loads a screen away, plays muted and looping its 13 seconds
 * only while on screen, cut just before its end so YouTube's end screen never
 * shows, and framed so YouTube's title bar and the burned-in subtitles fall
 * outside. "Watch the clip" plays it from the start with sound, once. Under
 * reduced motion it holds on its first frame until asked.
 */
export function WhyBreaker({ quote, figures }: { quote: WhyQuote; figures: WhyFigure[] }) {
  const scope = React.useRef<HTMLElement>(null);
  const frame = React.useRef<HTMLDivElement>(null);
  const player = React.useRef<YTPlayer | null>(null);
  const soundRef = React.useRef(false);
  const [rolling, setRolling] = React.useState(false);
  const [sound, setSound] = React.useState(false);
  const { youtubeId, start = 0, end } = quote;

  const setSoundOn = React.useCallback((on: boolean) => {
    soundRef.current = on;
    setSound(on);
  }, []);

  React.useEffect(() => {
    const root = scope.current;
    const host = frame.current;
    if (!youtubeId || !root || !host) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let alive = true;
    let made = false;
    let seen = false;
    let ready = false;
    const make = () => {
      if (made) return;
      made = true;
      // YouTube replaces the element it is given with its iframe: one outside React's tree.
      const element = document.createElement('div');
      host.append(element);
      loadYouTube().then((YT) => {
        if (!alive) return;
        player.current = new YT.Player(element, {
          host: 'https://www.youtube-nocookie.com',
          videoId: youtubeId,
          width: '100%',
          height: '100%',
          playerVars: {
            autoplay: 0,
            mute: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            playsinline: 1,
            rel: 0,
            cc_load_policy: 0,
            start,
          },
          events: {
            onReady: (event) => {
              ready = true;
              event.target.mute();
              noCaptions(event.target);
              if (seen && !reduce) event.target.playVideo();
            },
            onStateChange: (event) => {
              if (event.data === PLAYING) setRolling(true);
            },
            onApiChange: (event) => noCaptions(event.target),
          },
        });
      });
    };
    // The loop: back to the start just before the end (the end screen never shows); a play with
    // sound plays once, then the clip goes on muted.
    const loop = window.setInterval(() => {
      const p = player.current;
      if (!ready || !p || !end) return;
      if (p.getCurrentTime() < end - 0.3) return;
      if (soundRef.current) {
        p.mute();
        setSoundOn(false);
      }
      p.seekTo(start, true);
      if (reduce) p.pauseVideo();
    }, 200);
    const near = new IntersectionObserver(([entry]) => entry.isIntersecting && make(), {
      rootMargin: '100% 0px',
    });
    const onScreen = new IntersectionObserver(([entry]) => {
      seen = entry.isIntersecting;
      const p = player.current;
      if (!ready || !p) return;
      if (seen && !reduce) p.playVideo();
      else if (!seen) {
        p.pauseVideo();
        if (soundRef.current) {
          p.mute();
          setSoundOn(false);
        }
      }
    });
    near.observe(root);
    onScreen.observe(root);
    return () => {
      alive = false;
      window.clearInterval(loop);
      near.disconnect();
      onScreen.disconnect();
      player.current?.destroy();
      player.current = null;
      host.replaceChildren();
    };
  }, [youtubeId, start, end, setSoundOn]);

  const toggleSound = () => {
    const p = player.current;
    if (!p?.playVideo) return;
    if (soundRef.current) {
      p.mute();
      setSoundOn(false);
      return;
    }
    p.seekTo(start, true);
    p.unMute();
    p.playVideo();
    setSoundOn(true);
  };

  useMotion(
    () => {
      const root = scope.current;
      if (!root || prefersReducedMotion(root)) return;
      gsap.registerPlugin(ScrollTrigger);
      const q = gsap.utils.selector(root);
      const words = q('[data-breaker-words]')[0];
      // The copy comes up block by block, one gentle fade each, as it arrives.
      gsap.fromTo(
        q('[data-breaker-part]'),
        { autoAlpha: 0, y: offset.reveal },
        {
          autoAlpha: 1,
          y: 0,
          duration: d.slower,
          stagger: st.base * 1.5,
          ease: ease('expressiveEntrance'),
          clearProps: 'transform,opacity,visibility',
          scrollTrigger: { trigger: root, start: 'clamp(top 70%)', once: true },
        },
      );
      // The figures slide up into their lines as their row arrives.
      gsap.fromTo(
        q('[data-slide]'),
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: d.slower,
          stagger: st.base * 1.5,
          ease: ease('expressiveEntrance'),
          clearProps: 'transform',
          scrollTrigger: { trigger: q('[data-breaker-stats]')[0], start: 'clamp(top 90%)', once: true },
        },
      );
      // The words light from grey to ink, top line first, as they scroll up the screen.
      if (words) {
        gsap.fromTo(
          words,
          { '--lit': '0%' },
          {
            '--lit': '100%',
            ease: ease('linear'),
            scrollTrigger: { trigger: words, start: 'top 80%', end: 'bottom 40%', scrub: true },
          },
        );
      }
      // The clip settles from a slight zoom as the breaker crosses the screen.
      gsap.fromTo(
        q('[data-breaker-stage]'),
        { scale: 1.08 },
        {
          scale: 1,
          ease: ease('linear'),
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'center center', scrub: true },
        },
      );
    },
    scope,
    [],
  );

  return (
    <section
      ref={scope}
      aria-labelledby="why-breaker-title"
      className="why-breaker"
      data-rolling={rolling || undefined}
      data-sound={sound || undefined}
    >
      <div className="why-breaker-media" aria-hidden>
        <div data-breaker-stage className="why-breaker-stage">
          <div ref={frame} className="why-breaker-frame" />
        </div>
        <span className="why-breaker-blur" />
        <span className="why-breaker-fade" />
      </div>

      <Container className="relative">
        <div className="why-breaker-copy">
          <Heading as="p" size="3" data-breaker-part>
            {quote.eyebrow}
          </Heading>
          <h2 id="why-breaker-title" data-breaker-part className="why-breaker-words">
            <span data-breaker-words>“{quote.caption}”</span>
          </h2>
          <Text size="lg" tone="secondary" data-breaker-part className="mt-6">
            <strong className="font-medium text-content">{quote.attribution}</strong> {quote.context}{' '}
            {quote.coda ? <strong className="font-medium text-content">{quote.coda}</strong> : null}
          </Text>
          {youtubeId ? (
            <div data-breaker-part className="mt-6">
              <button type="button" className="why-breaker-watch type-label" onClick={toggleSound}>
                <span className="why-breaker-watch-icon">
                  {sound ? <SpeakerSimpleSlash weight="bold" /> : <Play weight="fill" />}
                </span>
                {sound ? 'Mute the clip' : 'Watch the clip'}
              </button>
            </div>
          ) : null}

          <ul data-breaker-stats data-breaker-part className="why-breaker-stats">
            {figures.map((figure) => (
              <li key={figure.value}>
                <p className="type-caption text-content-secondary">{figure.source}</p>
                <p className="why-slide type-display text-content">
                  <span data-slide>{figure.value}</span>
                </p>
                <p className="mt-1 type-body-sm text-content-secondary">{figure.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
