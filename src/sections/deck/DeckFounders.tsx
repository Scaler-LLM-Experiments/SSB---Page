'use client';

import * as React from 'react';
import { Container, Heading, Section, Text } from '@kishanscaler/ssx-ui';

import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';
import { YouTubePlay } from './DeckKamath';
import './deck-kamath.css';
import './deck-founders.css';

type Founder = {
  name: string;
  credential: string;
  /** What they did with our students: the card's title, then one line. */
  title: string;
  line: string;
  avatar?: string;
  clip?: { src: string; poster: string; label: string };
  /** A still in place of a clip, with the credit its license asks for. */
  photo?: { src: string; alt: string; credit: string; href: string };
};

/**
 * Slide 8 (2026-11-11, the user's ask): the founders on campus as three cards in the Kamath card's
 * look (grey, the clip with a green play button, then the copy and who it is), in place of the
 * Mittal / Warikoo band. Copy ours, from the band's facts; Mittal's is an offer to invest (July 2026,
 * ANI), not a cheque. PLACEHOLDER: Ashneer Grover's title and line, and his photo and clip, to come
 * from the team; nothing on the site says what he did at SSB yet.
 */
const FOUNDERS: Founder[] = [
  {
    name: 'Anupam Mittal',
    credential: 'Founder & CEO, Shaadi.com · Shark Tank India judge',
    title: 'Offered ₹50 lakh to a student startup',
    line: 'In July 2026 he heard four startups our students built, and offered to back one of them, Hummusapiens.',
    avatar: '/media/mittal-avatar.jpg',
    clip: { src: '/media/mittal-band.mp4', poster: '/media/mittal-band.webp', label: 'Student pitches at SSB' },
  },
  {
    name: 'Ankur Warikoo',
    credential: 'Founder, WebVeda · Author, Do Epic Shit',
    title: 'Handed our graduates their degrees',
    line: 'At convocation he gave the first cohort one line to carry: “Don’t get intellectually comfortable.”',
    avatar: '/media/warikoo-avatar.jpg',
    clip: { src: '/media/warikoo-band.mp4', poster: '/media/warikoo-band.webp', label: 'SSB convocation' },
  },
  {
    name: 'Ashneer Grover',
    credential: 'Co-founder, BharatPe · Founder, Third Unicorn',
    title: 'Pressure-tested student pitches',
    line: 'He put student founders through the questions an investor asks before writing a cheque.',
    // PLACEHOLDER (2026-11-11, the user's ask: an image from the internet for now): the only freely
    // licensed photo of him, his book Doglapan held up at a book fair (Wikimedia Commons, CC BY-SA 4.0,
    // M Rahil 2004; credit required, shown on the card). The avatar is cropped from the book's cover
    // portrait: swap both for the team's own photo or clip.
    avatar: '/media/ashneer-avatar.jpg',
    photo: {
      src: '/media/ashneer-card.jpg',
      alt: 'Ashneer Grover’s book Doglapan, held up at a book fair',
      credit: 'Photo: M Rahil 2004, CC BY-SA 4.0',
      href: 'https://commons.wikimedia.org/wiki/File:DOGLAPAN_FT~ASHNEER_GROVER~.jpg',
    },
  },
];

/**
 * Nikhil Kamath as a fourth card, first (the minimal page, 2026-11-11, the user's ask: "Anupam's and
 * Nikhil's sections in the same format, all four cards"). His words are from Zerodha's AMA, not a
 * campus visit, so the card says so; the clip is the team's cut used by the breaker (Zerodha's
 * permission, CREDITS.md).
 */
const KAMATH: Founder = {
  name: 'Nikhil Kamath',
  credential: 'Co-founder, Zerodha',
  title: 'Said what we built SSB to fix',
  line: '“If you’re 25 and going to an MBA college today, you must be some kind of idiot, if you ask me.”',
  avatar: '/media/kamath-avatar.jpg',
  clip: { src: '/media/kamath-clip.mp4', poster: '/media/kamath-clip.webp', label: 'Zerodha 15th-anniversary AMA' },
};

const initials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('');

function FounderMedia({ f }: { f: Founder }) {
  const [playing, setPlaying] = React.useState(false);
  if (!f.clip && f.photo) {
    return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="dkf-photo" src={f.photo.src} alt={f.photo.alt} loading="lazy" decoding="async" />
        <a className="dkk-chip dkf-credit" href={f.photo.href} target="_blank" rel="noopener noreferrer">
          {f.photo.credit}
        </a>
      </>
    );
  }
  if (!f.clip) {
    return (
      <div className="dkf-plate" aria-hidden="true">
        <span>{initials(f.name)}</span>
      </div>
    );
  }
  return playing ? (
    <video src={f.clip.src} poster={f.clip.poster} autoPlay controls playsInline muted loop />
  ) : (
    <button type="button" className="dkk-poster" onClick={() => setPlaying(true)} aria-label={`Play: ${f.name}, ${f.clip.label}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={f.clip.poster} alt="" loading="lazy" decoding="async" />
      <YouTubePlay />
      <span className="dkk-chip" aria-hidden="true">
        {f.clip.label}
      </span>
    </button>
  );
}

export function DeckFounders({ kamath = false }: { kamath?: boolean } = {}) {
  const founders = kamath ? [KAMATH, ...FOUNDERS] : FOUNDERS;
  const ref = React.useRef<HTMLElement>(null);
  useSectionEntrance(ref, { decks: ['.dkf-card'] });

  return (
    <Section ref={ref} density="roomy" aria-labelledby="dkf-title" className="dkf overflow-x-clip" data-count={founders.length}>
      <Container>
        <div className="dkf-head" data-enter="header">
          <Heading as="p" size="eyebrow" className="text-content-brand" data-enter="eyebrow">
            {kamath ? 'Founders on SSB' : 'Founders on campus'}
          </Heading>
          <Heading as="h2" size="display" id="dkf-title" className="dkf-title" data-enter="headline">
            {kamath ? 'India’s best-known founders, on the MBA and in our classrooms.' : 'India’s best-known founders, in our classrooms.'}
          </Heading>
          <Text size="lg" tone="secondary" className="dkf-sub" data-enter="sub">
            {kamath
              ? 'One called out the old MBA. Others hear what our students build, back the best of it, and send our graduates off.'
              : 'They hear what students build, put money behind the best of it, and send our graduates off.'}
          </Text>
        </div>
      </Container>
      <ul className="dkf-row" aria-label="Founders on campus">
        {founders.map((f) => (
          <li key={f.name} className="dkf-card">
            <div className="dkk-video dkf-media">
              <FounderMedia f={f} />
            </div>
            <div className="dkf-copy">
              <Heading as="h3" size="3" className="dkf-card-title">
                {f.title}
              </Heading>
              <p className="dkf-line">{f.line}</p>
              <div className="dkk-by">
                {f.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.avatar} alt="" width={44} height={44} loading="lazy" decoding="async" />
                ) : (
                  <span className="dkf-initials" aria-hidden="true">
                    {initials(f.name)}
                  </span>
                )}
                <span>
                  <b>{f.name}</b>
                  <span>{f.credential}</span>
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
