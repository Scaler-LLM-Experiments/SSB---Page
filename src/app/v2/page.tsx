import type { Metadata } from 'next';
import { hero } from '@/content/home';
import { placements } from '@/content/placements';
import { FacultySection } from '@/sections/faculty/FacultySection';
import { HeroNav } from '@/sections/hero/shared/HeroNav';
import { HeroV2 } from '@/sections/hero/v2/HeroV2';
import { PlacementsSection } from '@/sections/placements/PlacementsSection';
import { PlacementsShowcase } from '@/sections/placements/PlacementsShowcase';
import { PlacementsStories } from '@/sections/placements/PlacementsStories';

export const metadata: Metadata = { title: 'V2 hero · SSB home page lab' };

export default function V2Page() {
  return (
    // The site is light; only the hero is dark (HeroV2 is its own dark island).
    <main data-brand="ssb" data-theme="light" className="bg-page text-content">
      {/* Dark over the black hero; HeroV2's motion turns it light with the page. */}
      <HeroNav cta={hero.primaryCta} theme="dark" />
      <HeroV2 {...hero} />
      {/* Three takes on Placements, on the same content, to compare: the stories carousel above
          Faculty; the logo grid, then the showcase, below it. */}
      <PlacementsStories {...placements} />
      <FacultySection />
      <PlacementsSection {...placements} />
      <PlacementsShowcase {...placements} />
    </main>
  );
}
