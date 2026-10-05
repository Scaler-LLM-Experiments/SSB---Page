import type { Metadata } from 'next';
import { hero } from '@/content/home';
import { AlumniSection } from '@/sections/alumni/AlumniSection';
import { PeersTicker } from '@/sections/alumni/PeersTicker';
import { FacultySection } from '@/sections/faculty/FacultySection';
import { HeroNav } from '@/sections/hero/shared/HeroNav';
import { HeroV2 } from '@/sections/hero/v2/HeroV2';
import { InnovationLabSection } from '@/sections/innovation-lab/InnovationLabSection';
import { ImpactSection } from '@/sections/impact/ImpactSection';
import { AdmissionsSection } from '@/sections/admissions/AdmissionsSection';
import { FaqSection } from '@/sections/faq/FaqSection';

export const metadata: Metadata = { title: 'V2 hero · SSB home page lab' };

export default function V2Page() {
  return (
    // The site is light; only the hero is dark (HeroV2 is its own dark island).
    <main data-brand="ssb" data-theme="light" className="bg-page text-content">
      {/* Dark over the black hero; HeroV2's motion turns it light with the page. */}
      <HeroNav cta={hero.primaryCta} theme="dark" />
      <HeroV2 {...hero} />
      <AlumniSection peers={<PeersTicker />} />
      <FacultySection />
      <InnovationLabSection />
      <ImpactSection />
      <AdmissionsSection />
      <FaqSection />
    </main>
  );
}
