import type { Metadata } from 'next';
import {
  admissionCallback,
  admissionDeadline,
  admissionFaqs,
  admissionFees,
  admissionFinancing,
  admissionNav,
  admissionScholarships,
  admissionSteps,
  admissionStepsHead,
  admissionTop,
  admissionVideo,
} from '@/content/admission';
import { AdmissionTimeline } from '@/sections/admission/AdmissionTimeline';
import { AdmissionFees } from '@/sections/admission/AdmissionFees';
import { AdmissionFinancing } from '@/sections/admission/AdmissionFinancing';
import { AdmissionTop } from '@/sections/admission/AdmissionTop';
import { AdmissionVideo } from '@/sections/admission/AdmissionVideo';
import { AdmissionsV4 } from '@/sections/admissions/AdmissionsV4';
import { DeckCloseSection, DeckFaqSection } from '@/sections/deck/DeckFinale';
import { DeckFooter } from '@/sections/deck/DeckFooter';
import { HeroFrameDeadline } from '@/sections/hero/frame/HeroFrame';
import { HomeNav, ScrollRefresh } from '@/sections/home/client';
import { CalmEntrance } from '@/sections/shared/CalmEntrance';
import { BottomNav } from '@/sections/site/BottomNav';
import { Tone } from '@/sections/tone/Tone';
import '@/sections/deck/tokens.css';

export const metadata: Metadata = {
  title: 'Admissions & Fees | Scaler School of Business',
  description:
    'Scaler School of Business admissions: key dates and fees, the four-step admission process, scholarships and financing.',
};

/**
 * /admission (2026-11-11, the user's asks): the live admission page
 * (scaler.com/school-of-business/admission/) rebuilt from the home page's sections, laid out after
 * SST's admission page. The dates and fees first, in a short first fold on the footer's green (not
 * the home page's film, so the page reads as its own), the deadline counting down in the top strip; the four steps as
 * one timeline; the video in a green band of its own, as the live SSB page has it; the scholarships (dark, as the live page has them); financing; the request-a-callback band last
 * before the footer. Copy and its open questions: src/content/admission.ts. The page keeps the home
 * page's `data-page` and calm entrance, so the deck styles and the one appear animation apply.
 */
export default function AdmissionPage() {
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
        {/* the early bird's countdown as the page's top strip (2026-11-11, the user's ask) */}
        <HeroFrameDeadline deadline={admissionDeadline} />
        <HomeNav light followTone pinned />
        <BottomNav instant hero="#adm-top" items={admissionNav} />
        {/* the page's title and its dates and fees (the live page's header and "Key Dates" table); the
            early bird's countdown is the strip over the navbar */}
        <Tone>
          <AdmissionTop content={admissionTop} />
        </Tone>
        {/* "Admissions Made Simple": the four steps as one timeline, the eligibility video in step 1 */}
        <Tone>
          <AdmissionTimeline head={admissionStepsHead} steps={admissionSteps} />
        </Tone>
        {/* the video, highlighted as the live SSB page has it: its own green band after the steps */}
        <Tone>
          <AdmissionVideo content={admissionVideo} />
        </Tone>
        {/* "Important Dates and Fees" (2026-11-13, the user's ask): the live page's table, its notes and
            the detailed fee structure's brochure, where the live page has them, after the video */}
        <Tone>
          <AdmissionFees content={admissionFees} />
        </Tone>
        {/* "Scholarships", dark as on the live page, with a headline of its own (the home page's fee
            table beside it until 2026-11-13: its intakes and fees were the home page's, not this page's) */}
        <Tone dark>
          <AdmissionsV4 content={admissionScholarships} parts="scholarships" backers={false} />
        </Tone>
        {/* "Financing": the pointers and the partners' logos beside the students' photo */}
        <Tone>
          <AdmissionFinancing content={admissionFinancing} />
        </Tone>
        {/* the home page's FAQ, with the admission questions */}
        <Tone>
          <DeckFaqSection
            items={admissionFaqs}
            title="Questions, answered.|Before you apply."
            sub="What applicants ask most about the process, fees and scholarships."
          />
        </Tone>
        {/* request a callback, the last thing before the footer */}
        <Tone>
          <DeckCloseSection content={admissionCallback} id="callback" />
        </Tone>
      </main>
      <Tone>
        <DeckFooter />
      </Tone>
    </>
  );
}
