import * as React from 'react';
import { Container, Section } from '@kishanscaler/ssx-ui';

import type { internshipStories } from '@/content/internship';
import { Header } from '@/sections/deck/DeckSections';
import { StoryReels } from '@/sections/internship/StoryReels';
import '@/sections/internship/internship.css';
import './internship-page.css';

/**
 * "What our students are saying" (the internship page, 2026-11-12, the user's ask: the home page's
 * video section): the page's header over the home page's reel row (StoryReels: 9:16 cards, the one
 * most on screen playing muted on a loop, a tap for its sound), with the five students' own videos
 * from the live page in place of the home page's placeholder footage.
 */
export function InternshipReels({ content: c }: { content: typeof internshipStories }) {
  return (
    <Section id="stories" density="roomy" aria-labelledby="stories-title" className="overflow-x-clip">
      <Container>
        <Header id="stories" eyebrow={c.eyebrow} title={c.title} />
        <div className="in-carousel int-reels">
          <StoryReels reels={c.reels} label="Student stories" />
        </div>
      </Container>
    </Section>
  );
}
