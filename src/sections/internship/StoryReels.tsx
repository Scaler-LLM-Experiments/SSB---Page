'use client';

import * as React from 'react';
import { CaretLeft, CaretRight, SpeakerHigh, SpeakerSlash } from '@phosphor-icons/react';

export type Reel = {
  name: string;
  line: string;
  /** The short, vertical (9:16 is cropped from anything wider). */
  clip: string;
  /** Where to start in the clip, in seconds (the placeholder footage is shared, so each starts elsewhere). */
  start?: number;
  poster?: string;
};

/**
 * Success stories as shorts (2026-10-09, the team's ask: "a reel format carousel"): a row of 9:16
 * cards, each a muted short playing on a loop while it is on screen (paused off screen and under
 * reduced motion), the name and the story's line over its foot. A tap on a card turns its sound
 * on (and every other card's off). The row scrolls sideways, a card at a time, with arrows.
 */
export function StoryReels({ reels, label }: { reels: Reel[]; label: string }) {
  const rowRef = React.useRef<HTMLUListElement>(null);
  const [loud, setLoud] = React.useState<number | null>(null);
  const [edges, setEdges] = React.useState({ start: true, end: false });

  // play what is on screen, pause the rest
  React.useEffect(() => {
    const row = rowRef.current;
    if (!row) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const vids = Array.from(row.querySelectorAll('video'));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting && !reduced) v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: 0.6 },
    );
    vids.forEach((v) => io.observe(v));
    const onScroll = () =>
      setEdges({ start: row.scrollLeft < 4, end: row.scrollLeft > row.scrollWidth - row.clientWidth - 4 });
    onScroll();
    row.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      io.disconnect();
      row.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const go = (dir: 1 | -1) => {
    const row = rowRef.current;
    const card = row?.firstElementChild as HTMLElement | null;
    if (!row || !card) return;
    const gap = parseFloat(getComputedStyle(row).columnGap || '0');
    row.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: 'smooth' });
  };

  return (
    <div className="in-reels">
      <ul ref={rowRef} className="in-reels-row" aria-label={label}>
        {reels.map((r, i) => (
          <li key={r.name}>
            <button
              type="button"
              className="in-reel"
              aria-pressed={loud === i}
              aria-label={`${r.name}: ${r.line}. ${loud === i ? 'Mute' : 'Play with sound'}`}
              onClick={() => setLoud((cur) => (cur === i ? null : i))}
            >
              <video
                src={`${r.clip}#t=${r.start ?? 0}`}
                poster={r.poster}
                muted={loud !== i}
                loop
                playsInline
                preload="metadata"
                aria-hidden
              />
              <span className="in-reel-shade" aria-hidden />
              <span className="in-reel-sound" aria-hidden>
                {loud === i ? <SpeakerHigh weight="fill" /> : <SpeakerSlash weight="fill" />}
              </span>
              <span className="in-reel-copy">
                <span className="in-reel-name">{r.name}</span>
                <span className="in-reel-line">{r.line}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="in-reels-nav">
        <button type="button" onClick={() => go(-1)} disabled={edges.start} aria-label="Previous stories">
          <CaretLeft weight="bold" />
        </button>
        <button type="button" onClick={() => go(1)} disabled={edges.end} aria-label="Next stories">
          <CaretRight weight="bold" />
        </button>
      </div>
    </div>
  );
}
