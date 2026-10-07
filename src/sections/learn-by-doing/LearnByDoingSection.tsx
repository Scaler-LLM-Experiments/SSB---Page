'use client';

import * as React from 'react';
import { Heading, Logo, Text } from '@kishanscaler/ssx-ui';
import { CheckCircle, Play, X } from '@phosphor-icons/react';

import { SSB_JOURNEY } from '@/sections/curriculum/journey/ssb';
import { RowSection } from '@/sections/shared/RowSection';
import '@/sections/community/community.css';
import './learn-by-doing.css';

/**
 * Learn by doing (2026-10-07, the team's ask: "mimic" Beyond Placements). The same turn at the
 * display size in ink, its last words in the logo's green, then a row of the same cards
 * (`vc-*`, community.css): the video's thumbnail square at the left with the challenge on a glass
 * chip and its money figure in white over the progressive blur; at the right the challenge's
 * line as the title, the channel where the founders sit (the SSB shield, views and age), and the
 * challenge in a line at the foot. A play disc on the photo opens the video in a lightbox
 * (youtube-nocookie); nothing loads from YouTube until then. Copy from SSB_JOURNEY.learn.
 */

/** The figure on each card's photo, from the challenge's own line (keyed by its number). */
const STATS: Record<string, { value: string; label: string }> = {
  '01': { value: '₹25K', label: 'startup funding, ₹5L+ revenue target' },
  '02': { value: '₹25L', label: 'funding pathway, from ₹50K to start' },
};

const LAYERS = ['', 'soft', 'deep'] as const;

/** "761 views", "1.6K views": YouTube's short counts. */
const views = (n: number) =>
  (n < 1000 ? `${n}` : `${(n / 1000).toFixed(n < 10000 ? 1 : 0).replace(/\.0$/, '')}K`) + ' views';
/** "10 months ago", "1 year ago". */
const ago = (iso: string) => {
  const days = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 864e5));
  const [n, u] = days >= 365 ? [Math.floor(days / 365), 'year'] : [Math.max(1, Math.floor(days / 30)), 'month'];
  return `${n} ${u}${n === 1 ? '' : 's'} ago`;
};
const duration = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

type Item = (typeof SSB_JOURNEY)['learn'] extends infer L ? (L extends { items: (infer I)[] } ? I : never) : never;

function ChallengeCard({ item, onPlay }: { item: Item; onPlay: () => void }) {
  const v = item.video;
  const stat = STATS[item.n];
  return (
    <article className="vc lb-card">
      <div className="vc-media">
        <div className="vc-layers" data-part="photo">
          {LAYERS.map((layer) => (
            // eslint-disable-next-line @next/next/no-img-element -- fills its box, so it can't shift layout
            <img
              key={layer}
              src={item.image}
              alt=""
              aria-hidden={layer ? true : undefined}
              loading="lazy"
              decoding="async"
              className={layer ? `vc-photo vc-blur vc-blur-${layer}` : 'vc-photo'}
            />
          ))}
          <span aria-hidden className="vc-scrim" />
        </div>
        <span className="vc-tag type-label">{item.label}</span>
        {v ? (
          <button type="button" className="lb-play" onClick={onPlay} aria-label={`Play video: ${v.title}, ${duration(v.seconds)}`}>
            <span className="lb-play-disc">
              <Play weight="fill" aria-hidden />
            </span>
          </button>
        ) : null}
        {stat ? (
          <p className="vc-stat" data-part="title">
            <span className="vc-stat-value">{stat.value}</span>
            <span className="vc-stat-label">{stat.label}</span>
          </p>
        ) : null}
      </div>

      <div className="vc-body">
        <div className="vc-head">
          <Heading as="h3" size="2" data-part="title">
            {item.title}
          </Heading>
          {v ? (
            <div className="vc-founders" data-part="description">
              <span className="lb-avatar" aria-hidden>
                <Logo brand="ssb" variant="monogram" size="sm" surface="light" decorative />
              </span>
              <span className="vc-who">
                <span className="vc-names lb-channel">
                  {v.channel}
                  <CheckCircle weight="fill" aria-label="Verified" />
                </span>
                <span className="vc-role">
                  {views(v.views)} · {ago(v.published)} · {duration(v.seconds)}
                </span>
              </span>
            </div>
          ) : null}
        </div>
        <Text size="sm" tone="secondary" className="vc-text" data-part="description">
          {item.desc}
        </Text>
      </div>
    </article>
  );
}

/** The video, large, over the page; Esc, the close button or a click outside closes it. */
function Lightbox({ id, title, onClose }: { id: string; title: string; onClose: () => void }) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="lb-box" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div className="lb-box-frame" onClick={(e) => e.stopPropagation()}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      <button type="button" className="lb-box-close" onClick={onClose} aria-label="Close video">
        <X weight="bold" aria-hidden />
      </button>
    </div>
  );
}

export function LearnByDoingSection() {
  const l = SSB_JOURNEY.learn!;
  const [open, setOpen] = React.useState<Item | null>(null);
  return (
    <>
      <RowSection
        id="learn"
        title={`${l.title} ${l.titleAccent}`}
        // the curriculum sections' header (2026-10-07): eyebrow, title, subtext (the two-line turn
        // with its green words, Beyond Placements' form, was here first)
        eyebrow={l.eyebrow}
        sub={l.lede}
        itemName="challenge"
        cardWidth="38rem"
      >
        {l.items.map((item) => (
          <ChallengeCard key={item.n} item={item} onPlay={() => setOpen(item)} />
        ))}
      </RowSection>
      {open?.video ? <Lightbox id={open.video.id} title={open.video.title} onClose={() => setOpen(null)} /> : null}
    </>
  );
}
