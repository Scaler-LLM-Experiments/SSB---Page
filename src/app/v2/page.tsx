import type { Metadata } from 'next';
import { hero } from '@/content/home';
import { placements } from '@/content/placements';
import { why } from '@/content/why';
import { AdmissionsSection } from '@/sections/admissions/AdmissionsSection';
import { AlumniSection } from '@/sections/alumni/AlumniSection';
import { CurriculumRail } from '@/sections/curriculum/CurriculumRail';
import { FaqSection } from '@/sections/faq/FaqSection';
import { HeroV2 } from '@/sections/hero/v2/HeroV2';
import { Curriculum, FooterShell, HomeNav, ScrollRefresh } from '@/sections/home/client';
import { BottomNav } from '@/sections/site/BottomNav';
import { ImmersionsSection } from '@/sections/immersions/ImmersionsSection';
import { ImpactSection } from '@/sections/impact/ImpactSection';
import { InnovationLabSection } from '@/sections/innovation-lab/InnovationLabSection';
import { InternshipSection } from '@/sections/internship/InternshipSection';
import { LearnByDoingSection } from '@/sections/learn-by-doing/LearnByDoingSection';
import { LiveProjectsSection } from '@/sections/live-projects/LiveProjectsSection';
import { PeopleTabsSection } from '@/sections/people-tabs/PeopleTabsSection';
import { PlacementsShowcase } from '@/sections/placements/PlacementsShowcase';
import { TestimonialSection } from '@/sections/testimonial/TestimonialSection';
import {
  BeyondPlacementsSection,
  CampusLifeSection,
  InTheNewsSection,
  SuperMentorsSection,
} from '@/sections/community/CommunitySections';
import { WhySection } from '@/sections/why/WhySection';

export const metadata: Metadata = { title: 'V2 hero · SSB home page lab' };

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
export default function V2Page() {
  // The first fold is the cinematic hero only (the split variant and its toggle were dropped, 2026-10-06).
  return (
    <FooterShell>
      {/* The site is light; only the hero is dark (HeroV2 is its own dark island). */}
      <main data-brand="ssb" data-theme="light" className="bg-page text-content">
        {/* re-measures the sections' scroll entrances when the curriculum arrives and moves them */}
        <ScrollRefresh />
        {/* 1 first fold, in the chosen variant. Cinematic: the site navbar in the hero's nav slot, dark
            over the black hero (HeroV2's motion turns it light with the page). Split: a light navbar
            over a light page, the film in a rounded card, the leaders at the right. */}
        <HomeNav />
        <BottomNav />
        <HeroV2 {...hero} />
        {/* 2 placements (main's showcase take) */}
        <PlacementsShowcase {...placements} />
        {/* why SSB (deck slide 4) */}
        <WhySection {...why} />
        {/* 3 alumni: our earlier cohorts, already in the roles Why SSB names */}
        <AlumniSection />
        {/* the second breaker: founders backing the students (a judge's offer of funding, a founder's
            advice), a person to a slide */}
        <TestimonialSection />
        {/* student founders (deck p5) */}
        <BeyondPlacementsSection />
        {/* faculty and mentors (the founding team and investors come after the innovation lab) */}
        <PeopleTabsSection />
        {/* the curriculum, together (the team's call, 2026-10-06): the terms, then learn by doing, career prep, the
            150-hour AI curriculum, the live projects, the internship and the immersions behind one side navigation */}
        {/* the terms as v3 of the /v2-stack experiment (the team's pick, 2026-10-09): stacking cards, each
            opening a sheet with In class and Out of class */}
        <Curriculum part="terms" termsStack termsVersion={3} />
        <CurriculumRail
          sections={[
            // the team's order (2026-10-07): AI journey, career prep, learn by doing, internship, immersions;
            // Live projects is off the rail for now (<LiveProjectsSection /> was between the AI journey and the internship)
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
        <PeopleTabsSection groups={['founding', 'investors']} id="founders" label="The team and backers behind SSB" />
        {/* campus life, then in the news (deck p24, p25) */}
        <CampusLifeSection />
        <InTheNewsSection />
        {/* the Scaler Impact Foundation (deck p26) */}
        <ImpactSection />
        {/* 12 admissions: process, fees and eligibility */}
        <AdmissionsSection />
        {/* the FAQ (deck p28) */}
        <FaqSection />
      </main>
    </FooterShell>
  );
}
