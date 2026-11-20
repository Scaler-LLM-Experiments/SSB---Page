'use client';

import * as React from 'react';
import { Button, Container, Heading, Section, Text } from '@kishanscaler/ssx-ui';
import { ArrowRight, CaretLeft, CaretRight, CheckCircle, PlayIcon } from '@phosphor-icons/react';

import type { FaqBlock, FaqCategory, FaqVideo } from '@/content/faq';
import { faqCategories, faqFeature, faqHero, faqIntro, faqRecommended } from '@/content/faq';
import { Lightbox } from '@/sections/learn-by-doing/LearnByDoingSection';
import '@/sections/learn-by-doing/learn-by-doing.css';
import '@/sections/deck/deck-finale.css';
import './faq.css';

/**
 * The FAQ page's sections (/faq, 2026-11-13, the user's asks: the live FAQ page's layout and words
 * exactly, in our type scale and icons, light only). Top to bottom as on scaler.com: the breadcrumb and
 * title over the three numbered videos; the large video beside the "India's Only B-School" card;
 * "Frequently Asked Questions" with the categories at the left and the questions at the right on the
 * main page's FAQ accordion (a phone lists the categories, and a category opens its questions with a
 * back link); "Recommended for you" as a 3-column grid of the twelve videos. Every video opens the
 * learn-by-doing lightbox (YouTube). Copy: content/faq.ts; styles: faq.css.
 */

const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;

/** A video's thumbnail with the page's play disc; a click opens the lightbox. */
function VideoThumb({ video, onPlay, eager, className }: { video: FaqVideo; onPlay: (v: FaqVideo) => void; eager?: boolean; className?: string }) {
  return (
    <button type="button" className={`fq-thumb ${className ?? ''}`} onClick={() => onPlay(video)} aria-label={`Play video: ${video.title}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- YouTube's own thumbnail */}
      <img src={thumb(video.id)} alt="" width={1280} height={720} loading={eager ? 'eager' : 'lazy'} decoding="async" />
      <span className="lb-play-disc" aria-hidden="true">
        <PlayIcon weight="fill" />
      </span>
    </button>
  );
}

/** One lightbox per page section, opened by any of its videos. */
function usePlayer() {
  const [playing, setPlaying] = React.useState<FaqVideo | null>(null);
  const box = playing ? <Lightbox id={playing.id} title={playing.title} onClose={() => setPlaying(null)} /> : null;
  return [setPlaying, box] as const;
}

/* ── everything about SSB: the band, the three numbered videos, the large video and the card ──────── */

export function FaqHero() {
  const [play, box] = usePlayer();
  const c = faqHero;
  const f = faqFeature;
  return (
    <Section id="fq-top" density="roomy" aria-labelledby="fqh-title" className="fqh">
      <Container>
        <nav aria-label="Breadcrumb" className="fqh-crumbs">
          <ol>
            {c.crumbs.map((x, i) => (
              <li key={x.label}>
                {i > 0 ? <CaretRight weight="bold" aria-hidden="true" /> : null}
                {i === c.crumbs.length - 1 ? <span aria-current="page">{x.label}</span> : <a href={x.href}>{x.label}</a>}
              </li>
            ))}
          </ol>
        </nav>
        <Heading as="h1" size="display" id="fqh-title" className="fqh-title">
          {c.title}
        </Heading>

        <ol className="fqh-three">
          {c.videos.map((v, i) => (
            <li key={v.id} className="fqh-item">
              <VideoThumb video={v} onPlay={play} eager />
              <h2 className="fqh-item-title">
                <span className="fqh-num">{String(i + 1).padStart(2, '0')}</span>
                {v.title}
              </h2>
            </li>
          ))}
        </ol>

        <div className="fqf">
          <VideoThumb video={f.video} onPlay={play} className="fqf-video" />
          <div className="fqf-card">
            <p className="fqf-kicker">{f.kicker}</p>
            <h2 className="fqf-title">{f.title}</h2>
            <ul className="fqf-points">
              {f.points.map((p) => (
                <li key={p}>
                  <CheckCircle weight="fill" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
            <Button asChild size="lg" variant="primary" className="fqf-cta">
              <a href={f.cta.href}>
                {f.cta.label}
                <ArrowRight weight="bold" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
      </Container>
      {box}
    </Section>
  );
}

/* ── frequently asked questions ─────────────────────────────────────────────────────────────────── */

function Answer({ blocks, video, onPlay }: { blocks: FaqBlock[]; video?: FaqVideo; onPlay: (v: FaqVideo) => void }) {
  return (
    <div className="fq-a">
      {video ? <VideoThumb video={video} onPlay={onPlay} className="fq-a-video" /> : null}
      {blocks.map((b, i) =>
        'p' in b ? (
          <p key={i}>
            {b.strong ? <b>{b.strong} </b> : null}
            {b.p}
            {b.link ? (
              <>
                {' '}
                <a href={b.link.href}>{b.link.label}</a>
              </>
            ) : null}
          </p>
        ) : 'list' in b ? (
          <div key={i} className="fq-a-list">
            {b.lead ? <p className="fq-a-lead">{b.lead}</p> : null}
            <ul>
              {b.list.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div key={i} className="fq-a-table">
            <table>
              <thead>
                <tr>
                  {b.table.head.map((h) => (
                    <th key={h} scope="col">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {b.table.rows.map((r) => (
                  <tr key={r[0]}>
                    {r.map((x, j) => (j === 0 ? <th key={j} scope="row">{x}</th> : <td key={j}>{x}</td>))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ),
      )}
    </div>
  );
}

function Questions({ cat, onPlay }: { cat: FaqCategory; onPlay: (v: FaqVideo) => void }) {
  const [open, setOpen] = React.useState(0);
  return (
    <ol className="dkf-list fq-list">
      {cat.items.map((f, i) => {
        const on = open === i;
        const id = `fq-${cat.id}-${i}`;
        return (
          <li key={f.q} className="dkf-item" data-open={on ? '' : undefined}>
            <h4 className="dkf-q">
              <button type="button" aria-expanded={on} aria-controls={id} onClick={() => setOpen(on ? -1 : i)}>
                <span className="fq-q-num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="dkf-q-text">{f.q}</span>
                <span className="dkf-icon" aria-hidden="true" />
              </button>
            </h4>
            <div id={id} role="region" className="dkf-a" aria-hidden={!on}>
              <div className="dkf-a-inner">
                <Answer blocks={f.a} video={f.video} onPlay={onPlay} />
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function FaqBrowser() {
  const [play, box] = usePlayer();
  const [cat, setCat] = React.useState(0);
  // phones: the categories as a list; a pick opens that category with a back link (the live page's)
  const [opened, setOpened] = React.useState(false);
  const c = faqCategories[cat];
  return (
    <Section id="faq" density="roomy" aria-labelledby="fq-title" className="dkf fq">
      <Container>
        <div className="fq-intro">
          <Heading as="h2" size="display" id="fq-title" className="fq-title">
            {faqIntro.title}
          </Heading>
          <Text size="lg" tone="secondary">
            {faqIntro.sub}
          </Text>
        </div>
        <div className="fq-grid" data-opened={opened ? '' : undefined}>
          <ul className="fq-tabs" aria-label="FAQ categories">
            {faqCategories.map((x, i) => (
              <li key={x.id}>
                <button
                  type="button"
                  aria-pressed={i === cat}
                  onClick={() => {
                    setCat(i);
                    setOpened(true);
                  }}
                >
                  <span>{x.tab}</span>
                  <small>{x.items.length}</small>
                  <CaretRight weight="bold" aria-hidden="true" className="fq-tab-caret" />
                </button>
              </li>
            ))}
          </ul>
          <div className="fq-panel">
            <h3 className="fq-cat">
              <button type="button" className="fq-back" onClick={() => setOpened(false)} aria-label="All categories">
                <CaretLeft weight="bold" aria-hidden="true" />
              </button>
              {c.title}
            </h3>
            {/* keyed by category, so each opens on its first question */}
            <Questions key={c.id} cat={c} onPlay={play} />
          </div>
        </div>
      </Container>
      {box}
    </Section>
  );
}

/* ── recommended for you ────────────────────────────────────────────────────────────────────────── */

export function FaqRecommended() {
  const [play, box] = usePlayer();
  const c = faqRecommended;
  return (
    <Section density="roomy" aria-labelledby="fqr-title" className="fqr">
      <Container>
        <Heading as="h2" size="display" id="fqr-title" className="fq-title">
          {c.title}
        </Heading>
        <ul className="fqr-grid">
          {c.videos.map((v) => (
            <li key={v.id + v.title}>
              <VideoThumb video={v} onPlay={play} />
              <p>{v.title}</p>
            </li>
          ))}
        </ul>
      </Container>
      {box}
    </Section>
  );
}
