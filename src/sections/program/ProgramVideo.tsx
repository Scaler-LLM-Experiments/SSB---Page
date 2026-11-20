'use client';

import * as React from 'react';
import { Button, Container, Heading, Section, Text } from '@kishanscaler/ssx-ui';
import { PlayIcon } from '@phosphor-icons/react';

import { programVideo as c } from '@/content/program';
import { Lightbox } from '@/sections/learn-by-doing/LearnByDoingSection';
import '@/sections/learn-by-doing/learn-by-doing.css';
import './program.css';

/**
 * "Who are your instructors?" (2026-11-13, the user's ask: the live program page's video banner): the
 * admission page's video band in the program page's green (the hero's), the copy and a white "Watch
 * now" at the left, the film's thumbnail large at the right in a light frame with the play disc (the
 * home page's video card, deck.css `dk-biz-media`); either opens the learn-by-doing lightbox (YouTube).
 * Phones: the thumbnail over the copy, the button full width.
 */
export function ProgramVideo() {
  const [open, setOpen] = React.useState(false);
  return (
    <Section id="instructors-video" density="roomy" aria-labelledby="pgv-title" className="pgv">
      <Container>
        <div className="pgv-band" data-brand="ssb" data-theme="dark">
          <div className="pgv-copy">
            <Heading as="p" size="eyebrow" className="pgv-k">
              {c.eyebrow}
            </Heading>
            <Heading as="h2" size="display" id="pgv-title" className="pgv-title">
              {c.title}
            </Heading>
            <Text size="md" className="pgv-sub">
              {c.sub}
            </Text>
            <Button type="button" size="lg" variant="primary" className="pgv-watch" onClick={() => setOpen(true)}>
              <PlayIcon weight="fill" aria-hidden="true" />
              {c.cta}
            </Button>
          </div>
          <button
            type="button"
            className="dk-biz-media pgv-media"
            onClick={() => setOpen(true)}
            aria-label={`Play video: ${c.video.title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- YouTube's own thumbnail */}
            <img src={c.video.image} alt="" width={1280} height={720} loading="lazy" decoding="async" />
            <span className="lb-play-disc" aria-hidden="true">
              <PlayIcon weight="fill" />
            </span>
          </button>
        </div>
      </Container>
      {open ? <Lightbox id={c.video.id} title={c.video.title} onClose={() => setOpen(false)} /> : null}
    </Section>
  );
}
