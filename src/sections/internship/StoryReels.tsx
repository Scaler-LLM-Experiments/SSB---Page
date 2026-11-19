'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { CaretLeft, CaretRight, SpeakerHigh, SpeakerSlash, X } from '@phosphor-icons/react';

import { ScrollDots } from '@/sections/shared/ScrollDots';

export type Reel = {
  name: string;
  line: string;
  /** The short, vertical (9:16 is cropped from anything wider). */
  clip: string;
  /** Where to start in the clip, in seconds (the placeholder footage is shared, so each starts elsewhere). */
  start?: number;
  poster?: string;
  /** A cover (2026-11-19: the live page's thumbnails, with their own headline and play mark). A row
   *  with covers shows them and plays nothing in place: a tap opens the short large, over the page
   *  (ReelBox), with sound and controls, as the live page's modal does. */
  cover?: string;
};

/** A short, large, over the page (2026-11-19, the user's ask: "it should open in a big overlay"): 9:16
 *  as tall as fits, playing with sound and the browser's controls. Esc, the close button or a click
 *  outside closes it. In a portal, so no transformed ancestor can trap it. */
function ReelBox({ reel, onClose }: { reel: Reel; onClose: () => void }) {
  const close = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    close.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return createPortal(
    <div className="in-reel-box" role="dialog" aria-modal="true" aria-label={`${reel.name}: ${reel.line}`} onClick={onClose}>
      <div className="in-reel-box__frame" onClick={(e) => e.stopPropagation()}>
        <video src={reel.clip} poster={reel.cover} autoPlay controls playsInline />
      </div>
      <button ref={close} type="button" className="in-reel-box__close" onClick={onClose} aria-label="Close video">
        <X weight="bold" aria-hidden />
      </button>
    </div>,
    document.body,
  );
}

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
  // a row with covers: the short opened large, over the page
  const [open, setOpen] = React.useState<number | null>(null);

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
            {r.cover ? (
              <button type="button" className="in-reel" data-cover="" aria-haspopup="dialog" aria-label={`${r.name}: ${r.line}. Play the video`} onClick={() => setOpen(i)}>
                {/* eslint-disable-next-line @next/next/no-img-element -- the live page's cover, as it is */}
                <img src={r.cover} alt="" loading="lazy" decoding="async" />
              </button>
            ) : (
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
            )}
          </li>
        ))}
      </ul>
      {/* the page's carousel controls (2026-10-13, the team's ask), a screenful at a time; no autoplay
          (the shorts are playing). The plain arrows before them kept, off. */}
      <ScrollDots scroller={rowRef} count={reels.length} itemName="story" fill="solid" autoplay={false} />
      {open !== null ? <ReelBox reel={reels[open]} onClose={() => setOpen(null)} /> : null}
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
