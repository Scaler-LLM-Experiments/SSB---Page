import type { Metadata } from 'next';
import { Container, Heading, Section, Text } from '@kishanscaler/ssx-ui';
import { heroFrame } from '@/content/home';
import { placements } from '@/content/placements';
import { why } from '@/content/why';
import { AdmissionsV4 } from '@/sections/admissions/AdmissionsV4';
import { FaqSection } from '@/sections/faq/FaqSection';
import { InnovationLabSection } from '@/sections/innovation-lab/InnovationLabSection';
import { PressSection } from '@/sections/press/PressSection';
import { WhySection } from '@/sections/why/WhySection';
import { AlumniSection } from '@/sections/alumni/AlumniSection';
import { BuiltCards } from '@/sections/built/BuiltCards';
import { PeersTicker } from '@/sections/alumni/PeersTicker';
import { HeroFrame, HeroFrameDeadline } from '@/sections/hero/frame/HeroFrame';
import { Curriculum, FooterShell, HomeNav, ScrollRefresh } from '@/sections/home/client';
import { CurriculumRail } from '@/sections/curriculum/CurriculumRail';
import { ImmersionsSection } from '@/sections/immersions/ImmersionsSection';
import { SingaporeSection } from '@/sections/international/SingaporeSection';
import { InternshipSection } from '@/sections/internship/InternshipSection';
import { LearnByDoingSection } from '@/sections/learn-by-doing/LearnByDoingSection';
import { LiveProjectsSection } from '@/sections/live-projects/LiveProjectsSection';
import { CampusLifeSection, SuperMentorsSection } from '@/sections/community/CommunitySections';
import { BottomNav } from '@/sections/site/BottomNav';
import { PeopleTabsSection } from '@/sections/people-tabs/PeopleTabsSection';
import { PlacementsShowcase } from '@/sections/placements/PlacementsShowcase';
import { TestimonialSection } from '@/sections/testimonial/TestimonialSection';
import { VariantToggle } from '@/sections/site/VariantToggle';
import './v6.css';

export const metadata: Metadata = { title: 'V6 · SSB home page lab' };

/**
 * /v6 (2026-10-27, the user's ask): a blank page to rebuild the home page's order one section at a
 * time, each brought over from /v3 as it is agreed. So far: the first fold (the deadline bar, the light
 * navbar, the framed hero), then Placements (the figures and the companies that have visited), then
 * Alumni (our earlier cohorts, and the logos "Your peers come from"), Built at SSB, the founders'
 * breaker ("Founders and investors have noticed"), Faculty, Mentors, Kamath's breaker and the curriculum (the terms, then the
 * five pillars) and Leadership (the founding team, the investors and founders); then the rest in /v3's
 * order: the Innovation Lab, Admissions, the FAQ, Campus life and In the press, in the
 * site footer; with /v3's section nav and phones' apply bar (BottomNav), pointed at this order.
 */
export default function V6Page() {
  return (
    // the site footer the page lifts off, as /v3
    <FooterShell>
    <main data-page="v6" data-brand="ssb" data-theme="light" className="bg-page text-content">
      {/* re-measures the sections' scroll entrances when the curriculum (client-only) arrives and moves them */}
      <ScrollRefresh />
      {/* 1 the first fold: the deadline bar (sticky), the light navbar under it (sticky), then the framed film */}
      <HeroFrameDeadline deadline={heroFrame.deadline} />
      <HomeNav light />
      {/* the section nav (desktop: the pill at the foot; phones: the strip under the navbar and the sticky
          apply bar with its tabs), as /v3, its five pillars pointed at /v6's own sections */}
      <BottomNav
        items={[
          { label: 'Placements', target: 'placements-showcase-title' },
          { label: 'Faculty', target: 'people' },
          { label: 'How you learn', target: 'why-breaker-title' },
          { label: 'Admissions', target: 'admissions' },
          { label: 'Campus', target: 'campus-title' },
        ]}
      />
      <HeroFrame content={heroFrame} />
      {/* 2 placements: the figures, then the companies that have visited (as /v3, version C pinned) */}
      <PlacementsShowcase {...placements} fixed="v3" />
      {/* 3 alumni: our earlier cohorts in their roles, then "Your peers come from" (the logo grid) */}
      <AlumniSection peers={<PeersTicker />} />
      {/* 4 Built at SSB: the companies students founded, as /v3's row of cards */}
      <BuiltCards />
      {/* 5 the breaker: founders and investors backing the students (Anupam Mittal, Ankur Warikoo) */}
      <TestimonialSection />
      {/* 6 faculty: "Learn from your future recruiters", the drifting rows of course cards */}
      <PeopleTabsSection groups={['faculty']} drift />
      {/* 7 mentors: the founders and investors behind Zomato, Flipkart, Paytm and CRED, one still row */}
      <PeopleTabsSection groups={['mentors']} id="mentors" label="Mentors" still />
      {/* Kamath's breaker, opening the curriculum (2026-10-27, the user's ask; as /v3's How you learn):
          why the traditional MBA doesn't work, its answer cards off */}
      <WhySection {...why} answer={false} />
      {/* 8 the curriculum, as /v3: the terms as one row of horizontal cards, then the five pillars
          behind the side navigation (01 AI fluency … 05 super mentors; Singapore inside 04) */}
      {/* the terms as the concept site's /v4 stage, light (2026-10-23, the team's pick; v3's stack kept as termsVersion 3) */}
      <Curriculum part="terms" termsStack termsVersion={4} />
      {/* (2026-10-27, the user's ask) the minimal page's "Five ways SSB teaches business", numbered, each
          with its one line; every section kept: career prep and the internship sit with the live
          projects (work on real briefs), Singapore with the immersions */}
      {/* the five pillars' header (2026-10-27, the user's ask, the minimal page's words), over the rail */}
      <Section density="roomy" aria-labelledby="v6-learn-title" className="v6-learn-head">
        <Container>
          <div className="flex max-w-(--size-measure-max) flex-col gap-3">
            <Heading as="p" size="eyebrow" className="text-content-brand">
              How you learn
            </Heading>
            <Heading as="h2" size="display" id="v6-learn-title">
              Five ways SSB teaches business. All of them by doing it.
            </Heading>
            <Text size="lg" tone="secondary">
              Every term ends in a build. Some became companies.
            </Text>
          </div>
        </Container>
      </Section>
      <CurriculumRail
        sections={[
          { id: 'ai-journey', num: '01', label: 'Learn AI fluency', line: 'Ship an AI product every term. No coding background needed.', icon: 'ai', node: <Curriculum part="ai" aiCarousel /> },
          { id: 'learn-by-doing', num: '02', label: 'Build real businesses', line: 'Build two real businesses with real money, then pitch one to VCs.', icon: 'learn', node: <LearnByDoingSection /> },
          { id: 'live-projects-rail', num: '03', label: 'Work on live projects', line: 'Work real briefs from real companies, then defend your plan to their founders.', icon: 'projects', node: <><LiveProjectsSection /><InternshipSection /><Curriculum part="career" /></> },
          { id: 'immersions-rail', num: '04', label: 'Go on industry immersions', line: 'Learn where the work happens: factory floors, quick-commerce ops and a creative agency.', icon: 'immersions', node: <><ImmersionsSection /><SingaporeSection /></> },
          { id: 'sessions-rail', num: '05', label: 'Learn from super mentors', line: 'The people who built India’s best-known companies come to campus to teach how.', icon: 'sessions', node: <SuperMentorsSection /> },
        ]}
      />
      {/* 10 leadership: the founding team, and the investors and founders behind SSB (a pill switcher) */}
      <PeopleTabsSection groups={['founding', 'investors']} id="founders" label="The team and backers behind SSB" still />
      {/* the rest in /v3's order (2026-10-27, the user's ask) */}
      {/* 12 Scaler's Innovation Lab */}
      <InnovationLabSection />
      {/* 13 admissions, then 14 the FAQ */}
      <AdmissionsV4 />
      <FaqSection />
      {/* 15 campus life, then 16 in the press */}
      <CampusLifeSection />
      <PressSection />
      {/* the switch to the deck variant (/v7, 2026-10-28) */}
      <VariantToggle current="vfinal" />
    </main>
    </FooterShell>
  );
}
