'use client';

import * as React from 'react';
import { Container, Heading, Section } from '@kishanscaler/ssx-ui';

import { deckWhy } from '@/content/deck';
import { why } from '@/content/why';
import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';
import './deck-outcomes.css';
import './deck-kamath.css';

/** Zerodha's 15th-anniversary AMA (uploaded 24 October 2025), from his remark at 1:43:21. */
const VIDEO = { id: 'fzTWpjAAUe0', start: 6201, label: 'Zerodha 15th-anniversary AMA', at: '1:43:21' };

/**
 * Slide 4, "Why the traditional MBA doesn't work", as one card (2026-11-11, the user's sketch, in place
 * of the full-width breaker). A dark card with a soft brand-green glow: at the left the eyebrow, the
 * question as the title, his words as a pull quote (a large green mark) and who said them (a small
 * photo, his name, his role, over a hairline); at the right the YouTube video, from his remark, with a
 * label saying where it is from. The video is the clip's still with a green play button until clicked
 * (no YouTube load before then); the click swaps in youtube-nocookie's player, playing.
 * Phones: the video first, then the copy (the user's ask).
 */
/** YouTube's own play button (2026-11-11, the user's ask): the red rounded button, a white triangle; it
 *  turns from dark grey to red on hover, as on YouTube. Shared with the founders' cards. */
export function YouTubePlay() {
  return (
    <svg className="dkk-play" viewBox="0 0 68 48" aria-hidden="true">
      <path
        className="dkk-play-bg"
        d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"
      />
      <path d="M45 24 27 14v20" fill="#fff" />
    </svg>
  );
}

export function DeckKamath() {
  const ref = React.useRef<HTMLElement>(null);
  useSectionEntrance(ref, { decks: ['.dkk-card'] });
  const [playing, setPlaying] = React.useState(false);
  const q = why.quote;

  return (
    <Section ref={ref} density="roomy" aria-labelledby="dkk-title" className="dkk">
      <Container>
        {/* the placements banner's frame (2026-11-11, the user's ask): its 2px edge and green strip
            (deck-outcomes.css .dko-card); no strip (the user's call), the grey card set inside */}
        <div className="dko-card dkk-frame">
        <div className="dkk-card">
          <div className="dkk-copy" data-enter="header">
            <Heading as="p" size="eyebrow" className="dkk-eyebrow" data-enter="eyebrow">
              {deckWhy.eyebrow}
            </Heading>
            <Heading as="h2" size="display" id="dkk-title" className="dkk-title" data-enter="headline">
              {deckWhy.title}
            </Heading>
            <figure className="dkk-quote" data-enter="sub">
              <blockquote>
                <p>{q.caption}</p>
              </blockquote>
              <figcaption className="dkk-by">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/media/kamath-avatar.jpg" alt="" width={48} height={48} loading="lazy" decoding="async" />
                <span>
                  <b>{q.attribution}</b>
                  <span>{q.role}</span>
                </span>
              </figcaption>
            </figure>
          </div>

          <div className="dkk-video">
            {playing ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${VIDEO.id}?start=${VIDEO.start}&autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title={`${q.attribution} at the ${VIDEO.label}`}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <button type="button" className="dkk-poster" onClick={() => setPlaying(true)} aria-label={`Play: ${q.attribution} at the ${VIDEO.label}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={q.poster} alt="" loading="lazy" decoding="async" />
                <YouTubePlay />
                <span className="dkk-chip" aria-hidden="true">
                  {VIDEO.label} · from {VIDEO.at}
                </span>
              </button>
            )}
          </div>
        </div>
        </div>
      </Container>
    </Section>
  );
}
