import type { Metadata } from 'next';
import { heroFrame } from '@/content/home';
import { deckAlumni, deckLiveLogos, deckUsps } from '@/content/deck';
import { programNav } from '@/content/program';
import { AlumniSection } from '@/sections/alumni/AlumniSection';
import { PeersTicker } from '@/sections/alumni/PeersTicker';
import { CampusLifeSection, SuperMentorsSection } from '@/sections/community/CommunitySections';
import { CurriculumRail } from '@/sections/curriculum/CurriculumRail';
import { DeckCareerPrep } from '@/sections/deck/DeckCareerPrep';
import { DeckCloseSection } from '@/sections/deck/DeckFinale';
import { DeckFooter } from '@/sections/deck/DeckFooter';
import { DeckGlobalImmersion } from '@/sections/deck/DeckGlobalImmersion';
import {
  DeckAiProductsSection,
  DeckBusinessFacts,
  DeckBusinessSection,
  DeckImmersionsSection,
  DeckUsp,
  DeckUspHead,
} from '@/sections/deck/DeckSections';
import { HeroFrameDeadline } from '@/sections/hero/frame/HeroFrame';
import { Curriculum, HomeNav, ScrollRefresh } from '@/sections/home/client';
import { LiveProjectsSection } from '@/sections/live-projects/LiveProjectsSection';
import { PeopleTabsSection } from '@/sections/people-tabs/PeopleTabsSection';
import { ProgramCity } from '@/sections/program/ProgramCity';
import { ProgramCompare, ProgramHero } from '@/sections/program/ProgramSections';
import { PinLight } from '@/sections/program/PinLight';
import { ProgramVideo } from '@/sections/program/ProgramVideo';
import { ProgramWeek } from '@/sections/program/ProgramWeek';
import { BottomNav } from '@/sections/site/BottomNav';
import { CalmEntrance } from '@/sections/shared/CalmEntrance';
import { Tone } from '@/sections/tone/Tone';
import '../v6.css';
import '@/sections/deck/tokens.css';

export const metadata: Metadata = { title: 'PGP in Management & Technology | Scaler School of Business' };

/**
 * /program (2026-11-13, the user's asks): the programme page, light throughout. The order of
 * scaler.com/school-of-business/program; its own first fold (the name and six figures, no photo),
 * SSB vs traditional, a week at SSB and Bangalore (content/program.ts, sections/program/). Learn by
 * doing ("How you learn": the four USPs on their rail), the curriculum, career prep, the AI
 * curriculum, the faculty, mentors, alumni and campus life are the main page's (/) own sections,
 * unchanged, except that the alumni, faculty and mentor cards share one size here (program.css).
 */
export default function ProgramPage() {
  return (
    <>
      <PinLight />
      <main data-page="v7" data-route="program" data-entrance="calm" data-brand="ssb" data-theme="light" className="bg-page text-content">
        <ScrollRefresh />
        <CalmEntrance />
        <HeroFrameDeadline deadline={heroFrame.deadline} />
        <HomeNav light followTone pinned />
        <BottomNav instant items={programNav} />

        <Tone>
          <ProgramHero />
        </Tone>
        <Tone>
          <ProgramCompare />
        </Tone>
        {/* learn by doing: the main page's "How you learn", whole */}
        <Tone>
          <DeckUspHead />
          <CurriculumRail
            sections={[
              {
                ...deckUsps.items[0],
                line: undefined,
                node: (
                  <DeckUsp num="01" label={deckUsps.items[0].label}>
                    <DeckBusinessSection />
                    <DeckBusinessFacts />
                  </DeckUsp>
                ),
              },
              {
                ...deckUsps.items[1],
                line: undefined,
                node: (
                  <DeckUsp num="02" label={deckUsps.items[1].label}>
                    <DeckAiProductsSection />
                  </DeckUsp>
                ),
              },
              {
                ...deckUsps.items[3],
                num: '03',
                line: undefined,
                node: (
                  <DeckUsp num="03" label={deckUsps.items[3].label}>
                    <LiveProjectsSection logos={deckLiveLogos} />
                  </DeckUsp>
                ),
              },
              {
                ...deckUsps.items[2],
                num: '04',
                line: undefined,
                node: (
                  <DeckUsp num="04" label={deckUsps.items[2].label}>
                    <DeckImmersionsSection />
                    <DeckGlobalImmersion />
                  </DeckUsp>
                ),
              },
            ]}
          />
        </Tone>
        {/* the main page's future-proof curriculum, career prep and AI curriculum */}
        <Tone>
          <div id="program-curriculum">
            <Curriculum part="terms" termsStack termsVersion={4} deck />
          </div>
        </Tone>
        {/* career prep on its dark band, as on the main page */}
        <Tone dark>
          <DeckCareerPrep />
        </Tone>
        <Tone>
          <Curriculum part="ai" aiCarousel deck />
        </Tone>
        {/* super mentor sessions, under the AI journey (the user's ask), as on the main page */}
        <Tone>
          <SuperMentorsSection />
        </Tone>
        {/* who are your instructors: the live page's video banner (2026-11-13, the user's ask), then the
            faculty and the mentors */}
        <Tone>
          <ProgramVideo />
        </Tone>
        <Tone>
          <div id="program-faculty">
            <PeopleTabsSection groups={['faculty']} drift />
          </div>
        </Tone>
        <Tone>
          <PeopleTabsSection groups={['mentors']} id="mentors" label="Mentors" stack borrow={{ from: 'investors', count: 5 }} />
        </Tone>
        <Tone>
          <ProgramWeek />
        </Tone>
        {/* meet our learners */}
        <Tone>
          <AlumniSection
            eyebrow={deckAlumni.eyebrow}
            title={deckAlumni.title}
            sub={deckAlumni.sub}
            people={deckAlumni.people}
            peers={<PeersTicker title={deckAlumni.peersTitle} />}
          />
        </Tone>
        <Tone>
          <CampusLifeSection />
        </Tone>
        <Tone>
          <ProgramCity />
        </Tone>
        {/* the main page's closing banner */}
        <Tone>
          <DeckCloseSection />
        </Tone>
      </main>
      <Tone>
        <DeckFooter />
      </Tone>
    </>
  );
}
