import type { Metadata } from 'next';
import { hero } from '@/content/home';
import { placements } from '@/content/placements';
import { why } from '@/content/why';
import { AdmissionsSection } from '@/sections/admissions/AdmissionsSection';
import { AlumniSection } from '@/sections/alumni/AlumniSection';
import { PeersTicker } from '@/sections/alumni/PeersTicker';
import { FacultySection } from '@/sections/faculty/FacultySection';
import { FaqSection } from '@/sections/faq/FaqSection';
import { HeroV2 } from '@/sections/hero/v2/HeroV2';
import { HeroCard } from '@/sections/hero/card/HeroCard';
import { CardNav } from '@/sections/hero/card/CardNav';
import { HeroVariantToggle, type HeroVariant } from '@/sections/hero/HeroVariantToggle';
import { Curriculum, FooterShell, HomeNav, ScrollRefresh } from '@/sections/home/client';
import { ImmersionsSection } from '@/sections/immersions/ImmersionsSection';
import { ImpactSection } from '@/sections/impact/ImpactSection';
import { InnovationLabSection } from '@/sections/innovation-lab/InnovationLabSection';
import { InternshipSection } from '@/sections/internship/InternshipSection';
import { LiveProjectsSection } from '@/sections/live-projects/LiveProjectsSection';
import { PlacementsShowcase } from '@/sections/placements/PlacementsShowcase';
import { TestimonialSection } from '@/sections/testimonial/TestimonialSection';
import { WhySection } from '@/sections/why/WhySection';

export const metadata: Metadata = { title: 'V2 hero · SSB home page lab' };

/**
 * The home page, assembled, in the agreed sequence: the hero (first fold), placements, Why SSB
 * (deck slide 4, between placements and alumni as the deck has it), alumni,
 * Learn by doing, the 150-hour AI curriculum, live projects, the innovation lab, the faculty,
 * the curriculum, its stats (career prep), student testimonials and placements (the internship
 * section), admissions. Immersions, the impact foundation and the FAQ are not in that sequence
 * and follow it for now. All lifting off the footer. Of the three Placements takes, the
 * showcase is the one used.
 */
export default async function V2Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // The first fold has two variants, switched by the toggle at the foot of the window (?hero=split).
  const asked = (await searchParams).hero;
  const variant: HeroVariant = asked === 'split' ? 'split' : 'cinematic';

  return (
    <FooterShell>
      {/* The site is light; only the hero is dark (HeroV2 is its own dark island). */}
      <main data-brand="ssb" data-theme="light" className="bg-page text-content">
        {/* re-measures the sections' scroll entrances when the curriculum arrives and moves them */}
        <ScrollRefresh />
        {/* 1 first fold, in the chosen variant. Cinematic: the site navbar in the hero's nav slot, dark
            over the black hero (HeroV2's motion turns it light with the page). Split: a light navbar
            over a light page, the film in a rounded card, the leaders at the right. */}
        {variant === 'split' ? (
          <>
            <CardNav />
            <HeroCard {...hero} />
          </>
        ) : (
          <>
            <HomeNav />
            <HeroV2 {...hero} />
          </>
        )}
        <HeroVariantToggle current={variant} />
        {/* 2 placements (main's showcase take) */}
        <PlacementsShowcase {...placements} />
        {/* Why SSB (deck slide 4): the case for a new kind of MBA */}
        <WhySection {...why} />
        {/* 3 alumni */}
        <AlumniSection peers={<PeersTicker />} />
        {/* instructors, then the investor's word (moved up after alumni, the team's call) */}
        <FacultySection />
        <TestimonialSection />
        {/* 4 learn by doing, 5 the 150-hour AI curriculum */}
        <Curriculum part="learn" />
        <Curriculum part="ai" />
        {/* 6 projects */}
        <LiveProjectsSection />
        {/* 7 innovation lab */}
        <InnovationLabSection />
        {/* 9 the curriculum (the terms), 10 its stats (career prep) */}
        <Curriculum part="main" />
        {/* 11 student testimonials and placements (the internship: stats, stories, where they went) */}
        <InternshipSection />
        {/* 12 admissions: process, fees and eligibility */}
        <AdmissionsSection />
        {/* not in the agreed sequence, kept after it for now: immersions, the impact foundation, the FAQ */}
        <ImmersionsSection />
        <ImpactSection />
        <FaqSection />
      </main>
    </FooterShell>
  );
}
