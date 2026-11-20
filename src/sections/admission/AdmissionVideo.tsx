'use client';

import * as React from 'react';
import { Button, Container, Heading, Section, Text } from '@kishanscaler/ssx-ui';
import { PlayIcon } from '@phosphor-icons/react';

import type { admissionVideo } from '@/content/admission';
import { Lightbox } from '@/sections/learn-by-doing/LearnByDoingSection';
import '@/sections/learn-by-doing/learn-by-doing.css';
import './admission.css';

/**
 * The admission video as its own band (2026-11-11, the user's ask: highlight it as the live SSB
 * admission page does, not as a card in a step): on the first fold's forest green, the copy and a
 * white "Watch now" at the left, the large thumbnail at the right in a light frame with the play disc
 * (the video card's, deck.css `dk-biz-media`); either opens the learn-by-doing lightbox. Phones: the
 * thumbnail over the copy.
 */
export function AdmissionVideo({ content: c }: { content: typeof admissionVideo }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Section id="adm-video" density="roomy" aria-labelledby="adm-video-title" className="adm-video-sec">
      <Container>
        <div className="adm-video-band" data-brand="ssb" data-theme="dark">
          <div className="adm-video-copy">
            <Heading as="p" size="eyebrow" className="adm-video-k">
              {c.eyebrow}
            </Heading>
            <Heading as="h2" size="display" id="adm-video-title" className="adm-video-title">
              {c.title}
            </Heading>
            <Text size="md" className="adm-video-sub">
              {c.sub}
            </Text>
            <Button
              type="button"
              size="lg"
              variant="primary"
              className="adm-apply"
              onClick={() => setOpen(true)}
            >
              <PlayIcon weight="fill" aria-hidden="true" />
              {c.cta}
            </Button>
          </div>
          <button
            type="button"
            className="dk-biz-media adm-video-media"
            onClick={() => setOpen(true)}
            aria-label={`Play video: ${c.title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
