'use client';

import * as React from 'react';
import { Container, Heading, Section } from '@kishanscaler/ssx-ui';

import { deckWhy } from '@/content/deck';
import { why } from '@/content/why';
import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';
import { ReelBox } from '@/sections/internship/StoryReels';
import './deck-outcomes.css';
import './deck-kamath.css';

/** SSB's own reel (2026-11-19, the team's ask in #ssb-assets: "our video", instagram.com/reel/DQy8-G0iNMs,
 *  8 Nov 2025, "Business has changed. The way we learn it should too."): it opens on his remark, then SSB.
 *  Instagram's 720p file, 1:26, in public/media. The card's thumbnail (2026-11-19, the user's ask): the
 *  landscape still of the same footage (kamath-clip.webp) made a 16:9 thumbnail with image generation, the
 *  headline "Why MBA?" at its top-left (the user's line); the vertical reel cropped to 16:9 was only his face. */
const VIDEO = {
  clip: '/media/kamath-reel.mp4',
  still: '/media/kamath-thumb.webp',
  cover: '/media/kamath-reel-cover.webp',
  label: 'Business has changed',
  length: '1:26',
};

/**
 * Slide 4, "Why the traditional MBA doesn't work", as one card (2026-11-11, the user's sketch, in place
 * of the full-width breaker). A dark card with a soft brand-green glow: at the left the eyebrow, the
 * question as the title, his words as a pull quote (a large green mark) and who said them (a small
 * photo, his name, his role, over a hairline); at the right SSB's reel, its first frame with a play button;
 * a click opens it large over the page, with sound (ReelBox, as the testimonials' shorts).
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
            <button type="button" className="dkk-poster" onClick={() => setPlaying(true)} aria-label={`Play: ${VIDEO.label}, with ${q.attribution}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={VIDEO.still} alt="" loading="lazy" decoding="async" />
              <span className="dkk-disc" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" /></svg>
              </span>
              <span className="dkk-chip dkk-chip--end" aria-hidden="true">
                {VIDEO.length}
              </span>
            </button>
          </div>
        </div>
        </div>
        {playing ? (
          <ReelBox
            reel={{ name: q.attribution, line: VIDEO.label, clip: VIDEO.clip, cover: VIDEO.cover }}
            onClose={() => setPlaying(false)}
          />
        ) : null}
      </Container>
    </Section>
  );
}
