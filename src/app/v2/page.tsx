import type { Metadata } from 'next';
import { hero } from '@/content/home';
import { placements } from '@/content/placements';
import { AdmissionsSection } from '@/sections/admissions/AdmissionsSection';
import { AlumniSection } from '@/sections/alumni/AlumniSection';
import { PeersTicker } from '@/sections/alumni/PeersTicker';
import { FacultySection } from '@/sections/faculty/FacultySection';
import { FaqSection } from '@/sections/faq/FaqSection';
import { HeroV2 } from '@/sections/hero/v2/HeroV2';
import { Curriculum, FooterShell, HomeNav, ScrollRefresh } from '@/sections/home/client';
import { ImmersionsSection } from '@/sections/immersions/ImmersionsSection';
import { ImpactSection } from '@/sections/impact/ImpactSection';
import { InnovationLabSection } from '@/sections/innovation-lab/InnovationLabSection';
import { LiveProjectsSection } from '@/sections/live-projects/LiveProjectsSection';
import { PlacementsSection } from '@/sections/placements/PlacementsSection';
import { PlacementsShowcase } from '@/sections/placements/PlacementsShowcase';
import { PlacementsStories } from '@/sections/placements/PlacementsStories';

export const metadata: Metadata = { title: 'V2 hero · SSB home page lab' };

/**
 * The home page, assembled. In order: the hero, placements (three takes, two of them after the
 * faculty), alumni, the 150-hour AI curriculum and Learn
 * by doing, the faculty, the curriculum (the terms, then career prep), immersions, live projects, the
 * innovation lab, the impact foundation, admissions and the FAQ; all lifting off the footer.
 */
export default function V2Page() {
  return (
    <FooterShell>
      {/* The site is light; only the hero is dark (HeroV2 is its own dark island). */}
      <main data-brand="ssb" data-theme="light" className="bg-page text-content">
        {/* re-measures the sections' scroll entrances when the curriculum arrives and moves them */}
        <ScrollRefresh />
        {/* The site navbar in the hero's nav slot: dark over the black hero; HeroV2's motion turns it light with the page. */}
        <HomeNav />
        <HeroV2 {...hero} />
        {/* Three takes on Placements, on the same content, to compare: the stories carousel above
            Faculty; the logo grid, then the showcase, below it. */}
        <PlacementsStories {...placements} />
        <AlumniSection peers={<PeersTicker />} />
        {/* the 150-hour AI curriculum, then Learn by doing */}
        <Curriculum part="ai" />
        <FacultySection />
        <PlacementsSection {...placements} />
        <PlacementsShowcase {...placements} />
        {/* the curriculum (the terms), then career prep */}
        <Curriculum part="main" />
        <ImmersionsSection />
        <LiveProjectsSection />
        <InnovationLabSection />
        <ImpactSection />
        <AdmissionsSection />
        <FaqSection />
      </main>
    </FooterShell>
  );
}
