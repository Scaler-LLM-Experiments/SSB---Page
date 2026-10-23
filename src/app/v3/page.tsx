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
import { BuiltSection } from '@/sections/built/BuiltSection';
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
        {/* 2 placements (main's showcase take) */}
        {/* /v3 (2026-10-09): /v2 with Placements pinned to version C (stats + logos), no switch */}
        <PlacementsShowcase {...placements} fixed="v3" />
        {/* (review call, 21 Oct 2026) the companies students founded, straight after the placements */}
        {/* student founders (deck p5); before the second breaker since 2026-10-09 (the team's call) */}
        {/* Built at SSB: the concept site's /v4 section, on the light page (2026-10-23, the team's pick; it
            replaces Beyond Placements' card rows, whose component is kept) */}
        <BuiltSection />
        {/* why SSB (deck slide 4) */}
        {/* The "He’s right about the old MBA" turn and its Build / Grow cards hidden for now (2026-10-09);
            drop answer={false} to bring them back. The breaker above them stays. */}
        {/* The "He’s right about the old MBA" turn and its Build / Ship / Grow cards off again (2026-10-23, the
            team's ask); the breaker above them stays. Drop answer={false} to bring them back. */}
        <WhySection {...why} answer={false} />
        {/* 3 alumni: our earlier cohorts, already in the roles Why SSB names */}
        <AlumniSection peers={<PeersTicker />} />
        {/* the second breaker: founders backing the students (a judge's offer of funding, a founder's
            advice), a person to a slide */}
        <TestimonialSection />
        {/* faculty and mentors (the founding team and investors come after the innovation lab) */}
        {/* faculty and mentors as sections of their own (2026-10-12, the team's ask; were tabs of one):
            faculty with the stacked cards, mentors with the photo cards, smaller */}
        {/* faculty as drifting rows of course cards, as Alumni's (2026-10-13, the team's mock) */}
        <PeopleTabsSection groups={['faculty']} drift />
        {/* mentors as the founding team's photo cards, one still row (2026-10-23, the team's ask) */}
        <PeopleTabsSection groups={['mentors']} id="mentors" label="Mentors" still />
        {/* International immersion: a week in Singapore, after the mentors (2026-10-23, the team's ask) */}
        <SingaporeSection />
        {/* the curriculum, together (the team's call, 2026-10-06): the terms, then learn by doing, career prep, the
            150-hour AI curriculum, the live projects, the internship and the immersions behind one side navigation */}
        {/* the terms as v3 of the /v2-stack experiment (the team's pick, 2026-10-09): stacking cards, each
            opening a sheet with In class and Out of class */}
        {/* the terms as the concept site's /v4 stage, light (2026-10-23, the team's pick; v3's stack kept as termsVersion 3) */}
        <Curriculum part="terms" termsStack termsVersion={4} />
        <CurriculumRail
          sections={[
            // the team's order (2026-10-07): AI journey, career prep, learn by doing, internship, immersions
            { id: 'ai-journey', label: 'AI journey', icon: 'ai', node: <Curriculum part="ai" aiCarousel /> }, // the experiment's carousel of cards (2026-10-09)
            { id: 'career-prep', label: 'Career prep', icon: 'career', node: <Curriculum part="career" /> },
            { id: 'learn-by-doing', label: 'Learn by doing', icon: 'learn', node: <LearnByDoingSection /> },
            // Live projects back on the rail (2026-10-08, the team's ask), after learn by doing
            { id: 'live-projects-rail', label: 'Live projects', icon: 'projects', node: <LiveProjectsSection /> },
            { id: 'internship-rail', label: 'Internship', icon: 'internship', node: <InternshipSection /> },
            { id: 'immersions-rail', label: 'Immersions', icon: 'immersions', node: <ImmersionsSection /> },
            // Super Mentor Sessions, into the curriculum's rail (2026-10-07, the team's ask; it followed the Innovation Lab)
            { id: 'sessions-rail', label: 'Super Mentor Sessions', icon: 'sessions', node: <SuperMentorsSection /> },
          ]}
        />
        {/* innovation lab */}
        <InnovationLabSection />
        {/* the founding team and investors */}
        <PeopleTabsSection groups={['founding', 'investors']} id="founders" label="The team and backers behind SSB" still />
        {/* campus life, then in the news (deck p24, p25) */}
        <CampusLifeSection />
        {/* In the press: the concept site's /v4 section, light (2026-10-23, the team's pick; In the News kept in code) */}
        <PressSection />
        {/* the Scaler Impact Foundation came off (2026-10-23, the team's call: it is in the scholarships now) */}
        {/* 12 admissions: process, fees and eligibility */}
        {/* Admissions: the concept site's /v4 section, light (2026-10-23, the team's pick; the earlier one kept in code) */}
        <AdmissionsV4 />
        {/* the FAQ (deck p28) */}
        <FaqSection />
      </main>
    </FooterShell>
  );
}
