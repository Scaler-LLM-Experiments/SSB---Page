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
import {
  CampusLifeSection,
  SuperMentorsSection,
} from '@/sections/community/CommunitySections';
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
import { VariantToggle } from '@/sections/site/VariantToggle';
import '../v6/v6.css';

export const metadata: Metadata = { title: 'Deck · SSB home page' };

/**
 * /v7, the deck variant (2026-10-28, the user's ask): the home page in the stakeholders' deck's
 * order and words ("SSB Website vF _ Sep'26"), slide by slide, toggled against vFinal
 * (VariantToggle). vFinal's sections are reused as they are, fed the deck's copy where theirs
 * differs (src/content/deck.ts); the slides it had no section for are in sections/deck/. The deck
 * is the order to keep; the team will change this variant one section at a time from here.
 */
export default function V7Page() {
  return (
    // the deck variant's own footer, static, after the last section (2026-10-28, the user's ask: DeckFooter)
    <>
      <main data-page="v7" data-brand="ssb" data-theme="light" className="bg-page text-content">
        <ScrollRefresh />
        <HeroFrameDeadline deadline={heroFrame.deadline} />
        <HomeNav light />
        <BottomNav
          items={[
            { label: 'Placements', target: 'placements-showcase-title' },
            { label: 'Startups', target: 'bc-title' },
            { label: 'How you learn', target: 'dk-usp-title' },
            { label: 'Faculty', target: 'people' },
            { label: 'Admissions', target: 'admissions' },
          ]}
        />
        {/* 2 the first fold: vFinal's, its eyebrow without "Full-Time" as a brand-green chip, the title on the hero line height (2026-10-28, the user's ask) */}
        <HeroFrame content={deckHero} variant="deck" />
        {/* 3 placement highlights: five figures, the audited report, the recruiters */}
        {/* rebuilt (2026-10-28, the user's brief): the figures as a bento, the report as a newspaper */}
        <DeckOutcomes />
        {/* 4 MBA is not dead: the heading, Kamath's breaker, the emerging roles */}
        <DeckWhySection />
        {/* 5 a strong alumni base, then "Your peers come from" */}
        <AlumniSection
          eyebrow={deckAlumni.eyebrow}
          title={deckAlumni.title}
          sub={deckAlumni.sub}
          people={deckAlumni.people}
          peers={<PeersTicker title={deckAlumni.peersTitle} />}
        />
        {/* 6 beyond placements: startups by our students, on vFinal's Built at SSB cards (the deck's two rows) */}
        <BuiltCards content={deckStartups} variant="deck" />
        {/* 7 investors and founders on campus (Sidhant Goyal's words and the VC events after it came off, 2026-10-28, the user's ask) */}
        {/* on the faculty and mentors' card (2026-10-28, the user's ask): the same size, the company's mark, no "Meet" */}
        <PeopleTabsSection groups={['investors']} id="investors" label="Investors and founders on campus" stack />
        {/* 8 the Shark Tank judge (Anupam Mittal) and Ankur Warikoo on campus */}
        {/* vFinal's band (2026-10-28, the user's ask): Anupam Mittal's offer, Ankur Warikoo's convocation;
            framed as the first fold, as Kamath's (deck.css, .dk-frame) */}
        <div className="dk-frame">
          <TestimonialSection />
        </div>
        {/* 9–12 the four USPs (2026-10-28, the user's ask): vFinal's "How you learn" header and numbered
            side navigation, in the deck's order, each block tagged with its number */}
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
        {/* 13 the Scaler Innovation Lab: its five figures and four startups */}
        {/* the deck's figures band; the startups as vFinal has them, its heading and every startup (2026-10-28, the user's ask) */}
        {/* the startups on the student startups' cards (2026-10-28, the user's ask), every field kept */}
        <InnovationLabSection band={deckLab.band} variant="deck" builtCards />
        {/* 14 learn from your future recruiters: the faculty, then the mentors, each a section of its own
            (2026-10-28, the user's ask; no toggle between them; the founding team is at the foot, with the foundation) */}
        <PeopleTabsSection groups={['faculty']} drift />
        <PeopleTabsSection groups={['mentors']} id="mentors" label="Mentors" stack borrow={{ from: 'investors', count: 5 }} />
        {/* 15 student testimonials: inside the internship section now, framed (below) */}
        {/* 16 super mentor sessions */}
        <SuperMentorsSection />
        {/* 17–22 the curriculum: the five terms (each opens its courses), then the AI journey (career prep came off, 2026-10-28, the user's ask: "not looking good") */}
        <Curriculum part="terms" termsStack termsVersion={4} />
        {/* 23 the 150-hour AI curriculum */}
        <Curriculum part="ai" aiCarousel />
        {/* 24 internship statistics */}
        {/* the students' videos inside the internship section, framed, no heading (2026-10-28, the user's ask) */}
        <InternshipSection stats={deckInternshipStats} reels="framed" />
        {/* 25 life beyond the classroom */}
        <CampusLifeSection />
        {/* 26 Scaler in the news */}
        <PressSection />
        {/* 27 the founding team and the Scaler Impact Foundation */}
        {/* the founding team and the Scaler Impact Foundation as one toggle (2026-10-28, the user's ask) */}
        <PeopleTabsSection groups={['founding', 'impact']} id="leadership" label="The team and the foundation behind SSB" stack />
        {/* 28 admissions, fees and eligibility (the foundation's faces are in its own section above) */}
        <AdmissionsV4 backers={false} />
        {/* 29 the FAQ, the deck's six questions */}
        {/* the last two rebuilt (2026-10-28, the user's ask: minimal, impressive): DeckFinale.tsx */}
        <DeckFaqSection />
        {/* 30 the closing band */}
        <DeckCloseSection />
        <VariantToggle current="deck" />
      </main>
      <DeckFooter />
    </>
  );
}
