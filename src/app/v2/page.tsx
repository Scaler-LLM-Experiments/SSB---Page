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
import { ImmersionsSection } from '@/sections/immersions/ImmersionsSection';
import { ImpactSection } from '@/sections/impact/ImpactSection';
import { InnovationLabSection } from '@/sections/innovation-lab/InnovationLabSection';
import { InternshipSection } from '@/sections/internship/InternshipSection';
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
 * The home page, assembled, in the agreed sequence: the hero (first fold), placements, alumni,
 * Learn by doing, the 150-hour AI curriculum, live projects, the innovation lab, the faculty,
 * the curriculum, its stats (career prep), student testimonials and placements (the internship
 * section), admissions. Immersions, the impact foundation and the FAQ are not in that sequence
 * and follow it for now. All lifting off the footer. Of the three Placements takes, the
 * showcase is the one used.
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
        <HeroV2 {...hero} />
        {/* 2 placements (main's showcase take) */}
        <PlacementsShowcase {...placements} />
        {/* why SSB (deck slide 4) */}
        <WhySection {...why} />
        {/* 3 alumni */}
        <AlumniSection />
        {/* student founders (deck p5) */}
        <BeyondPlacementsSection />
        {/* faculty, mentors, the founding team, investors and founders: one section, four tabs;
            then the investor's word */}
        <PeopleTabsSection />
        {/* investors and founders on campus: one banner carousel (the testimonial and the Shark Tank
            stories, a person to a slide) */}
        <TestimonialSection />
        {/* the curriculum, together (the team's call, 2026-10-06): the terms, then learn by doing, career prep, the
            150-hour AI curriculum, the live projects, the internship and the immersions behind one side navigation */}
        <Curriculum part="terms" />
        <CurriculumRail
          sections={[
            { id: 'career-prep', label: 'Career prep', icon: 'career', node: <Curriculum part="career" /> },
            { id: 'ai-journey', label: 'AI journey', icon: 'ai', node: <Curriculum part="ai" /> },
            { id: 'live-projects-rail', label: 'Live projects', icon: 'projects', node: <LiveProjectsSection /> },
            { id: 'internship-rail', label: 'Internship', icon: 'internship', node: <InternshipSection /> },
            { id: 'learn-by-doing', label: 'Learn by doing', icon: 'learn', node: <Curriculum part="learn" /> },
            { id: 'immersions-rail', label: 'Immersions', icon: 'immersions', node: <ImmersionsSection /> },
          ]}
        />
        {/* innovation lab */}
        <InnovationLabSection />
        {/* Super Mentor Sessions (deck p15) */}
        <SuperMentorsSection />
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
