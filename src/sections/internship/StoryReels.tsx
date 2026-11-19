'use client';

import * as React from 'react';
import { CaretLeft, CaretRight, SpeakerHigh, SpeakerSlash } from '@phosphor-icons/react';

import { ScrollDots } from '@/sections/shared/ScrollDots';

export type Reel = {
  name: string;
  line: string;
  /** The short, vertical (9:16 is cropped from anything wider). */
  clip: string;
  /** Where to start in the clip, in seconds (the placeholder footage is shared, so each starts elsewhere). */
  start?: number;
  poster?: string;
  /** A cover (2026-11-19: the live page's thumbnails, with their own headline and play mark): shown
   *  until the card is tapped. A row with covers plays nothing on its own; a tap plays that short with
   *  sound, a second tap stops it and brings the cover back. */
  cover?: string;
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
  const tapToPlay = reels.some((r) => r.cover);

  // a row with covers: only the tapped short plays, with sound; the rest go back to their covers
  React.useEffect(() => {
    if (!tapToPlay) return;
    const vids = Array.from(rowRef.current?.querySelectorAll('video') ?? []);
    vids.forEach((v, j) => {
      if (j === loud) {
        v.muted = false;
        v.play().catch(() => {});
      } else if (v.currentTime > 0 || !v.paused) {
        v.pause();
        v.load(); // back to the cover
      }
    });
  }, [loud, tapToPlay]);

  // play the one short most on screen, pause the rest (2026-10-27, performance: two or three 1080p
  // shorts decoding at once, each under a blurred button, held the page at 30fps)
  React.useEffect(() => {
    const row = rowRef.current;
    if (!row) return undefined;
    // a row with covers never plays on its own (see above)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches || tapToPlay;
    const vids = Array.from(row.querySelectorAll('video'));
    const seen = new Map<HTMLVideoElement, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target as HTMLVideoElement, e.isIntersecting ? e.intersectionRatio : 0);
        let best: HTMLVideoElement | null = null;
        let most = 0.6;
        seen.forEach((ratio, v) => {
          if (ratio >= most) {
            most = ratio;
            best = v;
          }
        });
        vids.forEach((v) => {
          if (v === best && !reduced) v.play().catch(() => {});
          else v.pause();
        });
      },
      { threshold: [0, 0.6, 0.8, 1] },
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
              data-cover={r.cover ? '' : undefined}
              aria-pressed={loud === i}
              aria-label={`${r.name}: ${r.line}. ${loud === i ? 'Mute' : 'Play with sound'}`}
              onClick={() => setLoud((cur) => (cur === i ? null : i))}
            >
              <video
                src={`${r.clip}#t=${r.start ?? 0}`}
                poster={r.cover ?? r.poster}
                muted={loud !== i}
                loop
                playsInline
                preload={r.cover ? 'none' : 'metadata'}
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
      {/* the page's carousel controls (2026-10-13, the team's ask), a screenful at a time; no autoplay
          (the shorts are playing). The plain arrows before them kept, off. */}
      <ScrollDots scroller={rowRef} count={reels.length} itemName="story" fill="solid" autoplay={false} />
      <div className="in-reels-nav" hidden>
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
