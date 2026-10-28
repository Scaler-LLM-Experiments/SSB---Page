import type { Metadata } from 'next';
import { heroFrame } from '@/content/home';
import {
  deckAlumni,
  deckHero,
  deckInternshipStats,
  deckLab,
  deckLiveLogos,
  deckStartups,
  deckUsps,
} from '@/content/deck';
import { AdmissionsV4 } from '@/sections/admissions/AdmissionsV4';
import { AlumniSection } from '@/sections/alumni/AlumniSection';
import { PeersTicker } from '@/sections/alumni/PeersTicker';
import { BuiltCards } from '@/sections/built/BuiltCards';
import { CampusLifeSection, SuperMentorsSection } from '@/sections/community/CommunitySections';
import {
  DeckAiProductsSection,
  DeckBusinessFacts,
  DeckBusinessSection,
  DeckImmersionsSection,
  DeckUsp,
  DeckUspHead,
  DeckWhySection,
} from '@/sections/deck/DeckSections';
import { DeckOutcomes } from '@/sections/deck/DeckOutcomes';
import { DeckCloseSection, DeckFaqSection } from '@/sections/deck/DeckFinale';
import { HeroFrame, HeroFrameDeadline } from '@/sections/hero/frame/HeroFrame';
import { Curriculum, HomeNav, ScrollRefresh } from '@/sections/home/client';
import { DeckFooter } from '@/sections/deck/DeckFooter';
import { DeckGlobalImmersion } from '@/sections/deck/DeckGlobalImmersion';
import { CurriculumRail } from '@/sections/curriculum/CurriculumRail';
import { InnovationLabSection } from '@/sections/innovation-lab/InnovationLabSection';
import { InternshipSection } from '@/sections/internship/InternshipSection';
import { LiveProjectsSection } from '@/sections/live-projects/LiveProjectsSection';
import { PeopleTabsSection } from '@/sections/people-tabs/PeopleTabsSection';
import { PressSection } from '@/sections/press/PressSection';
import { TestimonialSection } from '@/sections/testimonial/TestimonialSection';
import { BottomNav } from '@/sections/site/BottomNav';
import { CalmEntrance } from '@/sections/shared/CalmEntrance';
import { Tone } from '@/sections/tone/Tone';
import '../v6/v6.css';

export const metadata: Metadata = { title: 'Tone · SSB home page' };

/**
 * /v8, the tone variant (2026-10-28, the user's ask): /v7, the deck variant, with its sections in two
 * tones, some light and some dark (Tone), the navbar taking the tone of the section under it
 * (HomeNav followTone). Dark in the tone of the team's concept (ssb-school-concept /v4): first the
 * students' startups, then the Mittal band, the lab's startups, the press and Admissions; the FAQ, the
 * closing banner and the footer's ground light; no people cards on dark (the user's calls, 2026-10-28). The page keeps /v7's `data-page`, so
 * all of /v7's styling applies; the dark sections' fixes are in sections/tone/tone.css.
 */
export default function V8Page() {
  return (
    // the deck variant's own footer, static, after the last section (2026-10-28, the user's ask: DeckFooter)
    <>
      <main data-page="v7" data-entrance="calm" data-brand="ssb" data-theme="light" className="bg-page text-content">
        <ScrollRefresh />
        {/* every section's appear animation, one calm fade (2026-10-28, the user's ask) */}
        <CalmEntrance />
        <HeroFrameDeadline deadline={heroFrame.deadline} />
        <HomeNav light followTone pinned />
        <BottomNav
          instant
          items={[
            { label: 'Placements', target: 'placements-showcase-title' },
            { label: 'Startups', target: 'bc-title' },
            { label: 'How you learn', target: 'dk-usp-title' },
            { label: 'Faculty', target: 'people' },
            { label: 'Admissions', target: 'admissions' },
          ]}
        />
        {/* 2 the first fold: vFinal's, its eyebrow without "Full-Time" as a brand-green chip, the title on the hero line height (2026-10-28, the user's ask) */}
        {/* the first two folds on light again (2026-10-28, the user's ask: "white, as earlier") */}
        <Tone>
          <HeroFrame content={deckHero} variant="deck" />
        </Tone>
        {/* 3 placement highlights: five figures, the audited report, the recruiters */}
        {/* rebuilt (2026-10-28, the user's brief): the figures as a bento, the report as a newspaper */}
        {/* the earlier design, with a ticker strip across it and a thicker edge (2026-10-28, the user's ask) */}
        <Tone>
          <DeckOutcomes ticker />
        </Tone>
        {/* 4 MBA is not dead: the heading, Kamath's breaker, the emerging roles */}
        <Tone>
          <DeckWhySection />
        </Tone>
        {/* 5 a strong alumni base, then "Your peers come from" */}
        <Tone>
          <AlumniSection
            eyebrow={deckAlumni.eyebrow}
            title={deckAlumni.title}
            sub={deckAlumni.sub}
            people={deckAlumni.people}
            peers={<PeersTicker title={deckAlumni.peersTitle} />}
          />
        </Tone>
        {/* 6 beyond placements: startups by our students, on vFinal's Built at SSB cards (the deck's two rows) */}
        <Tone dark>
          <BuiltCards content={deckStartups} variant="deck" />
        </Tone>
        {/* 7 investors and founders on campus (Sidhant Goyal's words and the VC events after it came off, 2026-10-28, the user's ask) */}
        {/* on the faculty and mentors' card (2026-10-28, the user's ask): the same size, the company's mark, no "Meet" */}
        <Tone>
          <PeopleTabsSection
            groups={['investors']}
            id="investors"
            label="Investors and founders on campus"
            stack
          />
        </Tone>
        {/* 8 the Shark Tank judge (Anupam Mittal) and Ankur Warikoo on campus */}
        {/* vFinal's band (2026-10-28, the user's ask): Anupam Mittal's offer, Ankur Warikoo's convocation;
            framed as the first fold, as Kamath's (deck.css, .dk-frame) */}
        {/* on the light tone (2026-10-28, the user's ask: no black frame round it), the band its own dark panel */}
        <Tone>
          <div className="dk-frame">
            <TestimonialSection />
          </div>
        </Tone>
        {/* 9–12 the four USPs (2026-10-28, the user's ask): vFinal's "How you learn" header and numbered
            side navigation, in the deck's order, each block tagged with its number */}
        <Tone>
          <DeckUspHead />
          <CurriculumRail
            sections={[
              {
                ...deckUsps.items[0],
                line: undefined,
                node: (
                  <DeckUsp num="01" label={deckUsps.items[0].label}>
                    <DeckBusinessSection />
                    <DeckBusinessFacts />
                  </DeckUsp>
                ),
              },
              {
                ...deckUsps.items[1],
                line: undefined,
                node: (
                  <DeckUsp num="02" label={deckUsps.items[1].label}>
                    <DeckAiProductsSection />
                  </DeckUsp>
                ),
              },
              {
                ...deckUsps.items[2],
                line: undefined,
                node: (
                  <DeckUsp num="03" label={deckUsps.items[2].label}>
                    <DeckImmersionsSection />
                    {/* the global immersion, a week in Singapore, back from vFinal (2026-10-28, the user's ask) */}
                    <DeckGlobalImmersion />
                  </DeckUsp>
                ),
              },
              {
                ...deckUsps.items[3],
                line: undefined,
                node: (
                  <DeckUsp num="04" label={deckUsps.items[3].label}>
                    {/* vFinal's cards (2026-10-28, the user's ask), each company's logo in white for its name */}
                    <LiveProjectsSection logos={deckLiveLogos} />
                  </DeckUsp>
                ),
              },
            ]}
          />
        </Tone>
        {/* 13 the Scaler Innovation Lab: its five figures and four startups */}
        {/* the deck's figures band; the startups as vFinal has them, its heading and every startup (2026-10-28, the user's ask) */}
        {/* the startups on the student startups' cards (2026-10-28, the user's ask), every field kept */}
        <Tone dark>
          <InnovationLabSection band={deckLab.band} variant="deck" builtCards />
        </Tone>
        {/* 14 learn from your future recruiters: the faculty, then the mentors, each a section of its own
            (2026-10-28, the user's ask; no toggle between them; the founding team is at the foot, with the foundation) */}
        <Tone>
          <PeopleTabsSection groups={['faculty']} drift />
        </Tone>
        <Tone>
          <PeopleTabsSection groups={['mentors']} id="mentors" label="Mentors" stack borrow={{ from: 'investors', count: 5 }} />
        </Tone>
        {/* 15 student testimonials: inside the internship section now, framed (below) */}
        {/* 16 super mentor sessions */}
        <Tone>
          <SuperMentorsSection />
        </Tone>
        {/* 17–22 the curriculum: the five terms (each opens its courses), then the AI journey (career prep came off, 2026-10-28, the user's ask: "not looking good") */}
        <Tone>
          <Curriculum part="terms" termsStack termsVersion={4} />
          {/* 23 the 150-hour AI curriculum */}
          <Curriculum part="ai" aiCarousel />
        </Tone>
        {/* 24 internship statistics */}
        {/* the students' videos inside the internship section, framed, no heading (2026-10-28, the user's ask) */}
        <Tone>
          <InternshipSection stats={deckInternshipStats} reels="framed" />
        </Tone>
        {/* 25 life beyond the classroom */}
        <Tone>
          <CampusLifeSection />
        </Tone>
        {/* 26 Scaler in the news */}
        <Tone dark>
          <PressSection />
        </Tone>
        {/* 27 the founding team and the Scaler Impact Foundation */}
        {/* the founding team and the Scaler Impact Foundation as one toggle (2026-10-28, the user's ask) */}
        <Tone>
          <PeopleTabsSection
            groups={['founding', 'impact']}
            id="leadership"
            label="The team and the foundation behind SSB"
            stack
          />
        </Tone>
        {/* 28 admissions, fees and eligibility (the foundation's faces are in its own section above) */}
        {/* Admissions dark; the FAQ, the banner and the footer's ground light (2026-10-28, the user's ask) */}
        <Tone dark>
          <AdmissionsV4 backers={false} />
        </Tone>
        {/* the FAQ and the closing banner on light (2026-10-28, the user's ask) */}
        <Tone>
          {/* 29 the FAQ, the deck's six questions */}
          {/* the last two rebuilt (2026-10-28, the user's ask: minimal, impressive): DeckFinale.tsx */}
          <DeckFaqSection />
          {/* 30 the closing band */}
          <DeckCloseSection />
        </Tone>
      </main>
      {/* the footer's green card on the light ground, after the light banner */}
      <Tone>
        <DeckFooter />
      </Tone>
    </>
  );
}
