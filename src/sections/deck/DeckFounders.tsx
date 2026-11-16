'use client';

import * as React from 'react';
import { Container, Heading, Section, Text } from '@kishanscaler/ssx-ui';

import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';
import { ScrollDots } from '@/sections/shared/ScrollDots';
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
  /** A session on YouTube: our still with YouTube's play button; the click swaps in the player. */
  youtube?: { id: string; poster: string; label: string };
  /** A still in place of a clip, with the credit its license asks for (none for our own photos). */
  photo?: { src: string; alt: string; credit?: string; href?: string };
};

/**
 * Slide 8 (2026-11-11, the user's ask): the founders on campus as cards (three, five since 2026-11-16) in the Kamath card's
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
  // (2026-11-16, the team's review: "add Shantanu Deshpande and Kiran Shah") the two in the first fold.
  // Shantanu's from his SSB masterclass on SSB's YouTube channel (31 Oct 2026, "The ₹100 Crore D2C
  // Playbook"); the photo is the team's (Figma, SSB 2026 > LP 2026-27 Assets)
  {
    name: 'Shantanu Deshpande',
    credential: 'Founder & CEO, Bombay Shaving Company',
    title: 'Taught the ₹100 crore D2C playbook',
    line: 'In his SSB masterclass he showed how Bombay Shaving Company took on Gillette, then took students’ questions on fundraising and delegation.',
    avatar: '/media/shantanu-avatar.jpg',
    youtube: { id: 'ki_0jkW-2oc', poster: '/media/shantanu-card.webp', label: 'Masterclass at SSB' },
  },
  // the team's photo of him on SSB's stage (Figma, as Shantanu's). PLACEHOLDER: the title and line, from
  // his public story (Apsara Ice Cream to 100 stores, then Go Zero), until the team says what his session
  // covered; his video, which the team says is on YouTube, isn't findable yet
  {
    name: 'Kiran Shah',
    credential: 'Founder, Go Zero · Shark Tank India',
    title: 'From one parlour to a national brand',
    line: 'He scaled Apsara Ice Cream to 100 stores, then built Go Zero, and brought that playbook to our students on campus.',
    avatar: '/media/kiran-avatar.jpg',
    photo: { src: '/media/kiran-card.webp', alt: 'Kiran Shah speaking on stage at SSB' },
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

const initials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('');

function FounderMedia({ f }: { f: Founder }) {
  const [playing, setPlaying] = React.useState(false);
  if (f.youtube) {
    const y = f.youtube;
    return playing ? (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${y.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
        title={`${f.name}, ${y.label}`}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
      />
    ) : (
      <button type="button" className="dkk-poster" onClick={() => setPlaying(true)} aria-label={`Play: ${f.name}, ${y.label}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={y.poster} alt="" loading="lazy" decoding="async" />
        <YouTubePlay />
        <span className="dkk-chip" aria-hidden="true">
          {y.label}
        </span>
      </button>
    );
  }
  if (!f.clip && f.photo) {
    return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="dkf-photo" src={f.photo.src} alt={f.photo.alt} loading="lazy" decoding="async" />
        {f.photo.credit ? (
          <a className="dkk-chip dkf-credit" href={f.photo.href} target="_blank" rel="noopener noreferrer">
            {f.photo.credit}
          </a>
        ) : null}
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

export function DeckFounders() {
  const ref = React.useRef<HTMLElement>(null);
  const rowRef = React.useRef<HTMLUListElement>(null);
  useSectionEntrance(ref, { decks: ['.dkf-card'] });

  return (
    <Section ref={ref} density="roomy" aria-labelledby="dkf-title" className="dkf overflow-x-clip">
      <Container>
        <div className="dkf-head" data-enter="header">
          <Heading as="p" size="eyebrow" className="text-content-brand" data-enter="eyebrow">
            Founders on campus
          </Heading>
          <Heading as="h2" size="display" id="dkf-title" className="dkf-title" data-enter="headline">
            India’s best-known founders, in our classrooms.
          </Heading>
          <Text size="lg" tone="secondary" className="dkf-sub" data-enter="sub">
            They hear what students build, put money behind the best of it, and send our graduates off.
          </Text>
        </div>
      </Container>
      {/* five cards now (2026-11-16): a row scrolled sideways at every width, three to a screen on the
          web, the page's arrows and dots under it */}
      <ul ref={rowRef} className="dkf-row" aria-label="Founders on campus">
        {FOUNDERS.map((f) => (
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
      <div className="dkf-dots">
        <ScrollDots scroller={rowRef} count={FOUNDERS.length} itemName="founder" fill="solid" autoplay={false} />
      </div>
    </Section>
  );
}
