import type { Metadata } from 'next';
import { heroFrame } from '@/content/home';
import { placements } from '@/content/placements';
import { why } from '@/content/why';
import { AdmissionsV4 } from '@/sections/admissions/AdmissionsV4';
import { AlumniSection } from '@/sections/alumni/AlumniSection';
import { PeersTicker } from '@/sections/alumni/PeersTicker';
import { CurriculumRail } from '@/sections/curriculum/CurriculumRail';
import { FaqSection } from '@/sections/faq/FaqSection';
import { HeroFrame, HeroFrameDeadline } from '@/sections/hero/frame/HeroFrame';
import { Curriculum, FooterShell, HomeNav, ScrollRefresh } from '@/sections/home/client';
import { BuiltCards } from '@/sections/built/BuiltCards';
import { PressSection } from '@/sections/press/PressSection';
import { SingaporeSection } from '@/sections/international/SingaporeSection';
import { BottomNav } from '@/sections/site/BottomNav';
import { ImmersionsSection } from '@/sections/immersions/ImmersionsSection';
import { InnovationLabSection } from '@/sections/innovation-lab/InnovationLabSection';
import { InternshipSection } from '@/sections/internship/InternshipSection';
import { LearnByDoingSection } from '@/sections/learn-by-doing/LearnByDoingSection';
import { LiveProjectsSection } from '@/sections/live-projects/LiveProjectsSection';
import { PeopleTabsSection } from '@/sections/people-tabs/PeopleTabsSection';
import { PlacementsShowcase } from '@/sections/placements/PlacementsShowcase';
import { TestimonialSection } from '@/sections/testimonial/TestimonialSection';
import {
  CampusLifeSection,
  SuperMentorsSection,
} from '@/sections/community/CommunitySections';
import { WhySection } from '@/sections/why/WhySection';

export const metadata: Metadata = { title: 'V3 · SSB home page lab' };

/**
 * The home page, assembled, in the agreed sequence: the hero (first fold), placements, Why SSB
 * (Kamath's breaker, then the answer), alumni (already in those roles), the second breaker
 * (founders and investors backing the students), beyond placements (student founders), the people
 * tabs, the curriculum's terms, then one side navigation over career prep, the AI journey, live
 * projects, the internship, learn by doing and immersions; the innovation lab, the founding team
 * and backers, campus life, in the news, the impact foundation, admissions and the FAQ. All lifting
 * off the footer. Super Mentor Sessions: taken off the page on main (2026-10-07), then put back as the
 * curriculum rail's last item (the team's ask, the same day). Of the three Placements takes, the showcase is the one used.
 */
export default function V3Page() {
  // The first fold: the framed fold, light (the team's pick, 2026-10-22). The cinematic HeroV2 it
  // replaced is kept in the code (the archived pages render it); the framed fold's dark tone was dropped.
  return (
    <FooterShell>
      {/* The site is light, the first fold too (only its film frame is a dark island). */}
      <main data-brand="ssb" data-theme="light" className="bg-page text-content">
        {/* re-measures the sections' scroll entrances when the curriculum arrives and moves them */}
        <ScrollRefresh />
        {/* 1 first fold: the deadline bar (sticky), the light navbar under it (sticky), then the framed film */}
        <HeroFrameDeadline deadline={heroFrame.deadline} />
        <HomeNav light />
        <BottomNav />
        <HeroFrame content={heroFrame} />
        {/* (2026-10-27, the user's ask) the page in the minimal page's five pillars, every section kept:
            Placements, Faculty, How you learn, Admissions, Campus (the bottom nav names these five) */}

        {/* ── 1 Placements ── */}
        {/* /v3 (2026-10-09): /v2 with Placements pinned to version C (stats + logos), no switch */}
        <PlacementsShowcase {...placements} fixed="v3" />
        {/* the companies students founded, straight after the placements (review call, 21 Oct 2026);
            as a row of cards (2026-10-27); the one-photo stage (BuiltSection) kept in code */}
        <BuiltCards />
        {/* alumni: our earlier cohorts, already in roles, then where the peers come from */}
        <AlumniSection peers={<PeersTicker />} />
        {/* the second breaker: founders backing the students (a judge's offer of funding, a founder's
            advice), a person to a slide */}
        <TestimonialSection />

        {/* ── 2 Faculty ── */}
        {/* faculty as drifting rows of course cards, as Alumni's (2026-10-13, the team's mock) */}
        <PeopleTabsSection groups={['faculty']} drift />
        {/* mentors as the founding team's photo cards, one still row (2026-10-23, the team's ask) */}
        <PeopleTabsSection groups={['mentors']} id="mentors" label="Mentors" still />
        {/* the founding team and investors */}
        <PeopleTabsSection groups={['founding', 'investors']} id="founders" label="The team and backers behind SSB" still />

        {/* ── 3 How you learn ── */}
        {/* why SSB (deck slide 4): Kamath's breaker, the case for learning by doing. The "He’s right about
            the old MBA" turn and its Build / Ship / Grow cards are off (2026-10-23, the team's ask); drop
            answer={false} to bring them back. */}
        <WhySection {...why} answer={false} />
        {/* the terms as the concept site's /v4 stage, light (2026-10-23, the team's pick; v3's stack kept as termsVersion 3) */}
        <Curriculum part="terms" termsStack termsVersion={4} />
        {/* (2026-10-27, the user's ask) the minimal page's "Five ways SSB teaches business", numbered, each
            with its one line; every section kept: career prep and the internship sit with the live
            projects (work on real briefs), Singapore with the immersions */}
        <CurriculumRail
          sections={[
            { id: 'ai-journey', num: '01', label: 'Learn AI fluency', line: 'Ship an AI product every term. No coding background needed.', icon: 'ai', node: <Curriculum part="ai" aiCarousel /> },
            { id: 'learn-by-doing', num: '02', label: 'Build real businesses', line: 'Build two real businesses with real money, then pitch one to VCs.', icon: 'learn', node: <LearnByDoingSection /> },
            { id: 'live-projects-rail', num: '03', label: 'Work on live projects', line: 'Work real briefs from real companies, then defend your plan to their founders.', icon: 'projects', node: <><LiveProjectsSection /><InternshipSection /><Curriculum part="career" /></> },
            { id: 'immersions-rail', num: '04', label: 'Go on industry immersions', line: 'Learn where the work happens: factory floors, quick-commerce ops and a creative agency.', icon: 'immersions', node: <><ImmersionsSection /><SingaporeSection /></> },
            { id: 'sessions-rail', num: '05', label: 'Learn from super mentors', line: 'The people who built India’s best-known companies come to campus to teach how.', icon: 'sessions', node: <SuperMentorsSection /> },
          ]}
        />
        {/* (International immersion, Singapore: now inside the rail's 04, with the immersions) */}
        {/* innovation lab */}
        <InnovationLabSection />

        {/* ── 4 Admissions ── */}
        {/* Admissions: the concept site's /v4 section, light (2026-10-23, the team's pick; the earlier one kept in code) */}
        <AdmissionsV4 />
        {/* the FAQ (deck p28) */}
        <FaqSection />

        {/* ── 5 Campus ── */}
        {/* campus life (deck p24) */}
        <CampusLifeSection />
        {/* In the press: the concept site's /v4 section, light (2026-10-23, the team's pick; In the News kept in code) */}
        <PressSection />
        {/* the Scaler Impact Foundation came off (2026-10-23, the team's call: it is in the scholarships now) */}
      </main>
    </FooterShell>
  );
}
