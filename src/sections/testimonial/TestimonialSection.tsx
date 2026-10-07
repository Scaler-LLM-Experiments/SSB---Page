'use client';

import * as React from 'react';
import { Container, Heading } from '@kishanscaler/ssx-ui';

import { sharkTank } from '@/content/community';
import { testimonial as t } from '@/content/testimonial';
import { CarouselNav } from '@/sections/shared/CarouselNav';
import { useBreakerMotion } from '@/sections/why/WhyBreaker';
import '@/sections/why/why.css';
import './testimonial.css';

/**
 * The page's second breaker (2026-10-07): after the alumni already in the new roles, the people
 * who build companies backing our students: a judge's offer of funding, a founder's advice (an
 * investor's word, off for now). One person to a slide, each in the Why SSB breaker's treatment (the team's
 * call: "exactly the same"), on its markup, classes and motion: the person full bleed on the left,
 * the words on the right in white over the progressive blur, the media melting into the page at
 * the foot; on a phone the person at the top and the words over a frost under them.
 *
 * Under each statement, well clear of it and over the dots, the person's profile card (the team's
 * ask: not everyone knows who they are): their name and credentials, and the logos of where they
 * built them, in white (no photo: the team's call). It replaces the breaker's footnote.
 *
 * Where the breaker has its figures, the page's carousel controls (shared/CarouselNav, as every
 * carousel since 2026-10-07: dots between arrows, the one on show filling as its time runs; the
 * team's call). The next person comes on by itself every 7s (the team's ask: it auto-plays), when
 * that fill ends; it waits only while the band is off screen, and under reduced motion (the fill
 * doesn't run then). No pause under the pointer or on focus: a reader's pointer rests on the band,
 * so it seemed not to move at all.
 *
 * A slide's `clip` is a silent loop made for the band (Anupam Mittal's, Ankur Warikoo's). The
 * others stand on the internship cards' dark plate with the person's initial until their media
 * arrives: the YouTube stills crop badly full bleed (the team's call, 2026-10-06).
 */
type Clip = {
  src: string;
  poster: string;
  /** The file's width over its height. */
  ratio: number;
  /** Where the face is across the file (0 to 1): a phone centres the frame on it. */
  face: number;
  /** A bright scene (a white tent): the frost under the words darkens while it is on, so the white reads. */
  bright?: boolean;
};

type Logo = { name: string; src: string; scale: number };

type Person = {
  /** What happened, or (with `quote`) what they said: the breaker's words. */
  lead: string;
  quote?: boolean;
  /** Who they are, under their name. */
  credential: string;
  /** Where they built it, shown white; "Ex-" before them with `ex`. */
  logos?: readonly Logo[];
  ex?: boolean;
  clip?: Clip;
};

type Slide = Person & { id: string; name: string };

/** The line over every slide: the storyline's turn from the alumni to the people backing them. */
const EYEBROW = 'Founders and investors have noticed';

/**
 * What each slide says, and who the person is. Ours (2026-10-07), from the deck's facts; for the
 * team to check. Mittal's is an offer to invest (July 2026, ANI): not "raised", not a cheque. Only
 * the people here are on the band: Shantanu Deshpande and Kiran Shah are off it for now (the team's
 * call, 2026-10-07) until their copy and media arrive; add them back here.
 */
const PEOPLE: Record<string, Person> = {
  'Anupam Mittal': {
    lead: 'In July 2026, Anupam Mittal heard four startups our students built, and offered ₹50 lakh to back one of them, Hummusapiens.',
    credential: 'Founder & CEO, Shaadi.com · Shark Tank India judge',
    logos: [{ name: 'Shaadi.com', src: '/logos/shaadi.svg', scale: 1.6 }],
    // The team's GIF of his visit (src/Anupam Mittal Funding.gif, 55 MB, gitignored), 2026-10-07:
    // cropped of the screen recorder's marks and flipped so he looks toward the words, then
    // widened to 21:9 on Magnific (Seedance 2.5 outpaint, Magnific Precision upscale): the footage
    // kept where it was at the left, the room continued to its right under the words' blur. It
    // replaces the band's earlier file, which filled the right with a blurred copy of the clip.
    clip: { src: '/media/mittal-band.mp4', poster: '/media/mittal-band.webp', ratio: 21 / 9, face: 0.23 },
  },
  'Ankur Warikoo': {
    // The team's line (2026-10-07), cut short for phones; his words from the deck's convocation slide.
    // No date: the deck has the convocation in May 2026, the team's first draft June (to confirm).
    lead: 'Ankur Warikoo handed our graduates their degrees, and one line: “Don’t get intellectually comfortable.”',
    credential: 'Founder, WebVeda · Author, Do Epic Shit',
    logos: [{ name: 'WebVeda', src: '/logos/webveda.svg', scale: 1 }],
    // The team's GIF of his convocation speech (src/Ankoor Warikoo.gif, 76 MB, gitignored),
    // 2026-10-07: one handheld shot, his face drifting from 44% to 52% across it, where the words
    // begin; cropped of its left 300px so he holds the left third (not flipped: the banners behind
    // him carry text). The white tent is bright under the words, so the frost darkens for it.
    clip: {
      src: '/media/warikoo-band.mp4',
      poster: '/media/warikoo-band.webp',
      ratio: 980 / 720,
      face: 0.3,
      bright: true,
    },
  },
};
/**
 * The investor's word, shortened to fit the lead's two or three lines (the elision marked). Off the
 * band for now (the team's call, 2026-10-07); add it back to `SLIDES`.
 */
const SIDHANT: Person = {
  lead: 'The energy at SSB & SST was intentional… they’re definitely on the right track to building things that matter.',
  quote: true,
  credential: 'Investor',
  logos: t.logos,
  ex: true,
};

const SLIDES: Slide[] = sharkTank.stories
  .filter((s) => s.title in PEOPLE)
  .map((s) => ({ id: s.title, name: s.title, ...PEOPLE[s.title] }));

/**
 * A slide's silent loop, played like a GIF: only while its slide is on and the band on screen,
 * from the start each time the slide comes on. Under reduced motion it holds its first frame.
 */
function ClipVideo({ clip, playing }: { clip: Clip; playing: boolean }) {
  const ref = React.useRef<HTMLVideoElement>(null);
  React.useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (playing && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      v.currentTime = 0;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [playing]);
  return (
    <video
      ref={ref}
      className="oc-clip"
      src={clip.src}
      poster={clip.poster}
      muted
      loop
      playsInline
      preload="metadata"
    />
  );
}

/**
 * Who it is, under what they did or said: their name and credentials, then the logos of where they
 * built them, behind a hairline.
 */
function ProfileCard({ slide: s }: { slide: Slide }) {
  return (
    <div className="oc-profile oc-in">
      <span className="oc-who">
        <span className="oc-name">{s.name}</span>
        {s.credential ? <span className="oc-credential">{s.credential}</span> : null}
      </span>
      {s.logos ? (
        <span className="oc-logos">
          <span className="sr-only">
            {s.ex ? 'Formerly at ' : 'Of '}
            {s.logos.map((l) => l.name).join(' and ')}
          </span>
          {s.ex ? (
            <span className="oc-ex" aria-hidden="true">
              Ex-
            </span>
          ) : null}
          {s.logos.map((l) => (
            // eslint-disable-next-line @next/next/no-img-element -- small static logos, sized by height
            <img
              key={l.name}
              src={l.src}
              alt=""
              decoding="async"
              style={{ '--oc-logo-scale': l.scale } as React.CSSProperties}
            />
          ))}
        </span>
      ) : null}
    </div>
  );
}

/** How long a person stays before the next comes on. */
const DWELL = 7000;

export function TestimonialSection() {
  const [active, setActive] = React.useState(0);
  const [live, setLive] = React.useState(false);
  // which way the band last turned (1 on, -1 back): the side the next slide's text comes in from;
  // 0 until it first turns, so the first paint and the breaker's entrance are left alone
  const [dir, setDir] = React.useState<-1 | 0 | 1>(0);
  const scope = React.useRef<HTMLElement>(null);
  const swipe = React.useRef<{ x: number; y: number } | null>(null);

  useBreakerMotion(scope);

  React.useEffect(() => {
    const el = scope.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const go = (step: number) => {
    setDir(step < 0 ? -1 : 1);
    setActive((i) => (i + step + SLIDES.length) % SLIDES.length);
  };
  const show = (i: number) => {
    if (i === active) return;
    setDir(i < active ? -1 : 1);
    setActive(i);
  };

  return (
    <section
      ref={scope}
      aria-roledescription="carousel"
      aria-label="Founders and investors on SSB's students"
      className="why-breaker oc-breaker"
      data-bright={SLIDES[active].clip?.bright || undefined}
      data-turned={dir !== 0 || undefined}
      style={{ '--oc-dir': dir || 1 } as React.CSSProperties}
      // a sideways swipe goes on or back (vertical swipes still scroll the page)
      onPointerDown={(e) => {
        if (e.pointerType !== 'mouse') swipe.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={(e) => {
        const from = swipe.current;
        swipe.current = null;
        if (!from) return;
        const dx = e.clientX - from.x;
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(e.clientY - from.y)) go(dx < 0 ? 1 : -1);
      }}
    >
      <div className="why-breaker-media" aria-hidden>
        <div data-breaker-stage className="why-breaker-stage">
          {SLIDES.map((s, i) => (
            <div key={s.id} className="oc-shot" data-on={i === active || undefined}>
              {s.clip ? (
                <div
                  className="oc-frame"
                  style={{ '--oc-ratio': s.clip.ratio, '--oc-face': s.clip.face } as React.CSSProperties}
                >
                  {/* Phone: the clip's first frame under it, blurred by the copy's frost, carrying it
                      to the foot (a still, not a second video: two videos stacked halve the frame rate). */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="oc-haze" src={s.clip.poster} alt="" decoding="async" />
                  <ClipVideo clip={s.clip} playing={i === active && live} />
                </div>
              ) : (
                // no media yet: the internship cards' dark plate, with the person's initial
                <div className="oc-plate">
                  <span className="oc-initial">{s.name.charAt(0)}</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <span className="why-breaker-blur" />
      </div>

      <Container className="why-breaker-inner">
        <div className="why-breaker-copy">
          <div className="why-breaker-top">
            <div className="why-breaker-lead" data-brand="ssb" data-theme="dark">
              <Heading as="p" size="eyebrow" className="text-on-image-ink" data-breaker-part>
                {EYEBROW}
              </Heading>
              {/* every slide in one cell, so the band is as tall as the longest; the entrance fades in
                  the one on show (its parts alone are marked) */}
              <div className="oc-says">
                {SLIDES.map((s, i) => {
                  const on = i === active;
                  return (
                    <div
                      key={s.id}
                      className="oc-say"
                      data-on={on || undefined}
                      aria-hidden={!on || undefined}
                      role="group"
                      aria-roledescription="slide"
                      aria-label={`${i + 1} of ${SLIDES.length}: ${s.name}`}
                    >
                      {s.quote ? (
                        <blockquote data-breaker-part={on || undefined} className="why-breaker-words">
                          <p className="oc-in">“{s.lead}”</p>
                        </blockquote>
                      ) : (
                        <p data-breaker-part={on || undefined} className="why-breaker-words">
                          <span className="oc-in">{s.lead}</span>
                        </p>
                      )}
                      <div data-breaker-part={on || undefined}>
                        <ProfileCard slide={s} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Where the breaker has its figures: the carousel controls, a dot per person. The next
              person when the dot on show has filled: its `cn-fill` animation's end, bubbling up (the
              fill runs only while the band is on screen, and not at all under reduced motion, so
              neither advances it). It enters on its own, as on every carousel. */}
          <div
            className="why-breaker-foot oc-foot"
            onAnimationEnd={(e) => {
              if (e.animationName === 'cn-fill') go(1);
            }}
          >
            <CarouselNav
              count={SLIDES.length}
              active={active}
              itemName="person"
              onSelect={show}
              onPrev={() => go(-1)}
              onNext={() => go(1)}
              running={live}
              interval={DWELL}
              tone="dark"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
