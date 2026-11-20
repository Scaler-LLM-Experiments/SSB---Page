import type { Metadata } from 'next';
import { resolveLogos } from '@/lib/logos';
import { admissionDeadline } from '@/content/admission';
import {
  internshipCallback,
  internshipCloser,
  internshipHero,
  internshipNav,
  internshipOutcomes,
  internshipStories,
} from '@/content/internship';
import { AlumniSection } from '@/sections/alumni/AlumniSection';
import { DeckCloseSection } from '@/sections/deck/DeckFinale';
import { DeckOutcomes } from '@/sections/deck/DeckOutcomes';
import { DeckFooter } from '@/sections/deck/DeckFooter';
import { HeroFrameDeadline } from '@/sections/hero/frame/HeroFrame';
import { HomeNav, ScrollRefresh } from '@/sections/home/client';
import { InternshipCloser } from '@/sections/internship-page/InternshipCloser';
import { InternshipHero } from '@/sections/internship-page/InternshipHero';
import { InternshipReels } from '@/sections/internship-page/InternshipReels';
import { InternshipStats } from '@/sections/internship-page/InternshipStats';
import { CalmEntrance } from '@/sections/shared/CalmEntrance';
import { BottomNav } from '@/sections/site/BottomNav';
import { Tone } from '@/sections/tone/Tone';
import '@/sections/deck/tokens.css';

export const metadata: Metadata = {
  title: 'Internship | Scaler School of Business',
  description:
    'Scaler School of Business internship outcomes: full-time internships, stipends, the companies our learners intern at, their roles and their stories.',
};

/**
 * /internship (2026-11-12, the user's asks): the live internship page
 * (scaler.com/school-of-business/internship/) rebuilt from the home page's sections, short and light.
 * The first fold shows the companies our learners intern at, flipping (the home page's "Your peers
 * come from" grid, on the site's green panel). Then the outcomes, after the user's reference (his
 * earlier cohort section, broken up): the header and three figures, the learners' profiles on the
 * home page's alumni cards, and a closer look (the role split, the two facts, the companies). Then the
 * five students' videos on the home page's reel row, and the request-a-callback band before the
 * footer. The early bird's countdown is the site's top strip, as on /admission. Copy and its open
 * questions: src/content/internship.ts.
 */
export default async function InternshipPage() {
  const o = internshipOutcomes;
  // the companies, sized once for the closer look's flip grid (the first fold sizes its own)
  const logos = await resolveLogos(internshipHero.logos);
  return (
    <>
      <main
        data-page="v7"
        data-entrance="calm"
        data-brand="ssb"
        data-theme="light"
        className="bg-page text-content"
      >
        <ScrollRefresh />
        <CalmEntrance />
        <HeroFrameDeadline deadline={admissionDeadline} />
        <HomeNav light followTone pinned />
        <BottomNav instant hero="#int-top" items={internshipNav} />
        {/* the title and the companies our learners intern at */}
        <Tone>
          <InternshipHero content={internshipHero} />
        </Tone>
        {/* the outcomes: the figures, the learners' profiles, a closer look */}
        <Tone>
          <AlumniSection
            eyebrow={o.eyebrow}
            title={o.title}
            sub={o.sub}
            lead={<InternshipStats stats={o.stats} />}
            people={o.people}
            peers={<InternshipCloser content={internshipCloser} logos={logos} />}
          />
        </Tone>
        {/* the main page's placement report banner (2026-11-13, the user's ask): after the outcomes
            (the user's ask: above the stories), where the internships lead: the figures and the audited report, then the recruiters' grid under it as on the main page (the user's ask) */}
        <Tone>
          <DeckOutcomes ticker />
        </Tone>
        {/* "What Our Students Are Saying": the five students' videos on the home page's reel row */}
        <Tone>
          <InternshipReels content={internshipStories} />
        </Tone>
        {/* request a callback, the last thing before the footer */}
        <Tone>
          <DeckCloseSection content={internshipCallback} id="callback" />
        </Tone>
      </main>
      <Tone>
        <DeckFooter />
      </Tone>
    </>
  );
}
