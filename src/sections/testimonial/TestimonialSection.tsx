'use client';

import * as React from 'react';
import { PlayIcon } from '@phosphor-icons/react';
import { Container } from '@kishanscaler/ssx-ui';

import { sharkTank } from '@/content/community';
import { testimonial as t } from '@/content/testimonial';
import './testimonial.css';

/**
 * Investors and founders on campus, as one banner carousel (it replaces the single testimonial
 * banner and the Shark Tank row of cards). A band the full width of the page; each slide is a
 * person: their photo or video still filling the left of the band and fading into its green, and
 * at the right their name, their designation (a line, or the logos of where they were) and what
 * happened, or what they said. A slide with a video has a play button: the talk plays in place.
 *
 * The controls are nested in the image: a row of frosted chips at its head, one per person, the
 * one on show brighter with a line filling along its foot as its time runs; the next person comes
 * on when it is full. It waits while the pointer or focus is on the band, while a video plays,
 * and while the band is off screen. No photo yet: a green ground stands in.
 */
type Slide = {
  id: string;
  name: string;
  /** Their designation, and their company (the emphasis). */
  role?: string;
  company?: string;
  /** The logos of where they are or were, under the designation ("Ex-" before them when `ex`). */
  logos?: readonly { name: string; src: string; scale: number }[];
  ex?: boolean;
  /** What they said (set in quotes) or what happened. */
  quote?: string;
  text?: string;
  image?: string;
  /** Flip the photo, for one shot with the person at the right. */
  mirror?: boolean;
  /** YouTube id: the slide gets a play button and plays in place. */
  videoId?: string;
};

/**
 * What each slide leads with (two or three lines, large) and the person's card under it: their
 * designation, their company (the emphasis) and its logo. Ours, 2026-10-06, cut from the deck's
 * longer copy; for the team to check. Logos in public/logos, shown white. None on file yet for
 * Bombay Shaving Company or for Kiran Shah.
 */
const PEOPLE: Record<string, { lead: string; title?: string; company?: string; logos?: Slide['logos'] }> = {
  'Anupam Mittal': {
    lead: 'Reviewed four student startups on campus, and offered ₹50 lakh to one of them, Hummusapiens.',
    title: 'Founder · Shark Tank India judge',
    company: 'Shaadi.com',
    logos: [{ name: 'Shaadi.com', src: '/logos/shaadi.svg', scale: 1.9 }],
  },
  'Ankur Warikoo': {
    lead: 'Handed 55 graduates their certificates in person, and left them with one line: “Don’t get intellectually comfortable.”',
    title: 'Entrepreneur, author and creator',
    company: 'WebVeda',
    logos: [{ name: 'WebVeda', src: '/logos/webveda.svg', scale: 1.1 }],
  },
  'Shantanu Deshpande': { lead: 'Dummy copy: a line about his campus visit goes here, in two or three lines.', title: 'Founder', company: 'Bombay Shaving Company' },
  'Kiran Shah': { lead: 'Dummy copy: a line about his time on campus goes here, in two or three lines.' },
};
/** The investor's word, shortened to fit the lead's two or three lines (the elision marked). */
const SIDHANT_LEAD = 'The energy at SSB & SST was intentional… they’re definitely on the right track to building things that matter.';

/** The photos and video stills are off for now (the team's call, 2026-10-06: the YouTube stills
 *  crop badly in a banner): every slide stands on the dark plate with the person's initial. true
 *  brings the media and the play buttons back. */
const SHOW_MEDIA = false;

const videoId = (href?: string) => href?.match(/[?&]v=([\w-]{6,})/)?.[1];

const SLIDES: Slide[] = [
  ...sharkTank.stories.map((s) => ({
    id: s.title,
    name: s.title,
    role: PEOPLE[s.title]?.title,
    company: PEOPLE[s.title]?.company,
    logos: PEOPLE[s.title]?.logos,
    text: PEOPLE[s.title]?.lead ?? s.text,
    image: 'media' in s ? s.media : undefined,
    videoId: videoId('href' in s ? s.href : undefined),
  })),
  { id: t.name, name: t.name, logos: t.logos, ex: true, quote: SIDHANT_LEAD, image: t.photo, mirror: true },
];

/** How long a person stays before the next comes on. */
const DWELL = 7000;

export function TestimonialSection() {
  const [active, setActive] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const [live, setLive] = React.useState(false);
  const band = React.useRef<HTMLElement>(null);
  const chips = React.useRef<(HTMLButtonElement | null)[]>([]);

  React.useEffect(() => {
    const el = band.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const go = (i: number) => {
    setPlaying(false);
    setActive(i);
    // keep the chosen chip in view in its row (the row only, never the page)
    const chip = chips.current[i];
    const row = chip?.parentElement;
    if (chip && row) row.scrollTo({ left: chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2, behavior: 'smooth' });
  };

  return (
    <section
      ref={band}
      className="oc-band"
      aria-label="Investors and founders on campus"
      data-brand="ssb"
      data-theme="dark"
      data-live={live || undefined}
      data-playing={playing || undefined}
      style={{ '--oc-dwell': `${DWELL}ms` } as React.CSSProperties}
    >
      <div className="oc-slides">
        {SLIDES.map((slide, i) => {
          const s = SHOW_MEDIA ? slide : { ...slide, image: undefined, videoId: undefined };
          const on = i === active;
          return (
            <article key={s.id} className="oc-slide" data-on={on || undefined} aria-hidden={!on || undefined} inert={!on || undefined}>
              <div className="oc-media" data-empty={!s.image || undefined} data-mirror={s.mirror || undefined}>
                {on && playing && s.videoId ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${s.videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                    title={s.name}
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                  />
                ) : (
                  <>
                    {s.image ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.image} alt="" decoding="async" />
                        {/* the same photo again, blurred, let in over the right side: the frost the copy stands on */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img className="oc-soft" src={s.image} alt="" decoding="async" aria-hidden="true" />
                      </>
                    ) : (
                      // no photo yet: the internship cards' dark plate, with the person's initial
                      <span className="oc-initial" aria-hidden="true">
                        {s.name.charAt(0)}
                      </span>
                    )}
                    {s.videoId ? (
                      <button type="button" className="oc-play" onClick={() => setPlaying(true)} aria-label={`Play video: ${s.name}`}>
                        <PlayIcon weight="fill" aria-hidden="true" />
                      </button>
                    ) : null}
                  </>
                )}
              </div>
              <Container className="oc-inner">
                <div className="oc-copy">
                  <p className="oc-eyebrow">{sharkTank.eyebrow}</p>
                  {/* what happened, or what they said: large, two or three lines */}
                  {s.quote ? (
                    <blockquote className="oc-lead">
                      <p>“{s.quote}”</p>
                    </blockquote>
                  ) : (
                    <p className="oc-lead">{s.text}</p>
                  )}
                  {/* the person's card: name and designation, then their company, its logo leading */}
                  <div className="oc-card">
                    <div className="oc-who">
                      <h3 className="oc-name">{s.name}</h3>
                      {s.role ? <p className="oc-role">{s.role}</p> : null}
                    </div>
                    {s.logos || s.company ? (
                      <div className="oc-co">
                        {s.logos ? (
                          <p className="oc-logos">
                            <span className="sr-only">{s.ex ? t.role : s.logos.map((l) => l.name).join(', ')}</span>
                            {s.ex ? (
                              <span className="oc-ex" aria-hidden="true">
                                Ex-
                              </span>
                            ) : null}
                            {s.logos.map((l, k) => (
                              <React.Fragment key={l.name}>
                                {k > 0 ? <span className="oc-divider" aria-hidden="true" /> : null}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={l.src} alt="" style={{ '--oc-logo-scale': l.scale } as React.CSSProperties} />
                              </React.Fragment>
                            ))}
                          </p>
                        ) : (
                          <p className="oc-company">{s.company}</p>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              </Container>
            </article>
          );
        })}
      </div>

      {/* the controls, in the image: one frosted chip per person */}
      <div className="oc-chips">
        <div className="oc-chips-row" role="group" aria-label="People on campus">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              ref={(el) => {
                chips.current[i] = el;
              }}
              className="oc-chip"
              aria-current={i === active}
              onClick={() => go(i)}
            >
              {s.name}
              {i === active ? <i key={active} className="oc-chip-fill" onAnimationEnd={() => go((active + 1) % SLIDES.length)} /> : null}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
