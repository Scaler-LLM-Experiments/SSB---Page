import type { BottomNavItem } from '@/content/bottom-nav';
import { bottomNav } from '@/content/bottom-nav';
import { admissionsV4, faqs } from '@/content/admissions';
import type { Faq } from '@/content/admissions';
import { deckClose } from '@/content/deck';
import type { AdmissionsContent } from '@/sections/admissions/AdmissionsV4';
import type { CloseContent } from '@/sections/deck/DeckFinale';

/*
 * The admission page (/admission, 2026-11-11), rebuilt from the live page
 * (scaler.com/school-of-business/admission/, read that day) in the home page's components, laid out
 * after SST's admission page (scaler.com/school-of-technology/admission/): the dates and fees first,
 * in the first fold; then the steps as one timeline. The copy is the live page's, set in the
 * components' patterns; nothing is added that the live page doesn't say. Links are the live page's.
 *
 * Dates and fees (2026-11-19, Stephan in #ssb-assets): early bird closes 20 Dec 2026, then Intakes 1 to 5
 * (14 Feb, 28 Mar, 9 May, 20 Jun, 15 Aug 2027); ₹23,00,000 for every intake; ₹1,500 application fee. The
 * home page's the same (content/admissions.ts, content/home.ts).
 */

const APPLY = 'https://www.scaler.com/school-of-business/application';
const BROCHURE =
  'https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/164/923/original/brochure-nov-compressed.pdf?1763005202';

/** The strip over the navbar (the home page's deadline bar): the early bird's last date, counting down. */
export const admissionDeadline = {
  message: 'Early bird applications close 20 Dec',
  shortMessage: 'Early bird closes 20 Dec',
  to: '2026-12-20T23:59:00+05:30',
  label: '20 Dec 2026, 11:59 PM IST',
};

/** The facts' and groups' icons (Phosphor, mapped in the components). */
export type AdmissionIcon = 'calendar' | 'receipt' | 'wallet' | 'cap' | 'briefcase' | 'profile';

export type AdmissionFact = {
  value: string;
  label: string;
  note?: string;
  icon: AdmissionIcon;
};

/** The first fold (2026-11-11, the user's asks: the dates and fees right on top; short; not bland; no
 *  breadcrumb): the footer's forest green, the campus photo running out to the panel's right edge and
 *  melting into the green under the copy, then the four facts in one box, split by rules. */
export const admissionTop = {
  chip: 'Admissions open · 2027 cohort',
  title: 'Admissions & Fees',
  sub: 'Four steps to your seat in the 2027 cohort.',
  primaryCta: { label: 'Apply Now', href: APPLY },
  secondaryCta: { label: 'Download Brochure', href: BROCHURE },
  // SSB's own photo: the Commencement Day arch, "Welcome aboard, future leaders"
  photo: {
    src: '/campus/arch.webp',
    alt: 'The SSB campus arch on Commencement Day: Welcome aboard, future leaders',
  },
  facts: [
    { value: '20 Dec 2026', label: 'Early bird closes', note: '11:59 PM IST', icon: 'calendar' },
    { value: '₹1,500', label: 'Application fee', note: 'Non-refundable', icon: 'receipt' },
    { value: '₹23,00,000', label: 'Course fee', note: 'Subject to revision', icon: 'wallet' },
    { value: 'Aug 2027', label: 'Batch begins', note: 'The 2027 cohort, on campus', icon: 'cap' },
  ] satisfies AdmissionFact[],
};

/** The steps' header (the live page's "Admissions Made Simple"). */
export const admissionStepsHead = {
  eyebrow: 'Admission process',
  title: 'Admissions made simple.|Four steps, start to finish.',
  sub: 'Selection goes beyond academics: a profile-based evaluation and an interview with industry leaders.',
};

/** One block of a step's card: its title, then its points (step 1 has three, side by side). */
export type AdmissionGroup = { title: string; points: string[]; icon?: AdmissionIcon };

export type AdmissionStepContent = {
  id: string;
  num: string;
  /** the step's name in the side list */
  label: string;
  /** the timeline's title, "Lead|tail": the tail (the step's timing) in the brand green */
  title: string;
  /** the step in one line, under its title */
  lede: string;
  /** the card, the same order in every step (2026-11-11, the user's ask): title, points, then a box
   *  if needed, then the action */
  groups: AdmissionGroup[];
  note?: string;
  /** a call to action, and the deadline beside it */
  cta?: { label: string; href: string; aside?: { label: string; date: string } };
  /** the card's illustration, drawn in CSS on the home page's AI product panel (`dk-product-art`):
   *  the application, the interview invite, the SSB student ID */
  art?: 'application' | 'interview' | 'idcard';
};

/** The four steps, one timeline (the layout after SST's admission page). */
export const admissionSteps: AdmissionStepContent[] = [
  {
    id: 'adm-eligibility',
    num: '01',
    label: 'Check your eligibility',
    title: 'Check your eligibility',
    lede: 'Graduates of 2017 to 2027, with or without work experience.',
    groups: [
      {
        title: 'Education',
        icon: 'cap',
        points: [
          'Successfully completed Class 12',
          'A bachelor’s degree from an accredited institution, graduating between 2017 and 2027',
        ],
      },
      {
        title: 'Work experience',
        icon: 'briefcase',
        points: [
          'Ideally at least one year of work experience',
          'Freshers with internships, leadership roles in college, good projects or side hustles are welcome to apply',
        ],
      },
      {
        title: 'Profile-based evaluation',
        icon: 'profile',
        points: [
          'Your work experience, academics, co-curriculars and leadership',
          'Proactiveness shown through side projects, startups or other hustles',
        ],
      },
    ],
  },
  {
    id: 'adm-application',
    num: '02',
    label: 'Submit your application',
    title: 'Submit your application|within 7 days',
    lede: 'Online, with a video essay, after you pay the application fee.',
    groups: [
      {
        title: 'Your application',
        points: [
          'Submit within 7 days of paying the application fee',
          'Include a video essay as part of the application',
        ],
      },
    ],
    note: 'Admissions run in weekly phases that close every Sunday. Applying earlier gives you a better chance of a seat and a scholarship.',
    cta: {
      label: 'Apply Now',
      href: APPLY,
      aside: { label: 'Early bird closes', date: '20 Dec 2026, 11:59 PM' },
    },
    art: 'application',
  },
  {
    id: 'adm-interview',
    num: '03',
    label: 'Appear for interviews',
    title: 'Appear for interviews|within 3–7 days',
    lede: 'Scheduled once you’re shortlisted.',
    groups: [
      {
        title: 'Industry leaders interview round',
        points: [
          'Discuss your vision, professional journey and readiness for the programme with industry experts',
          'Solve a case study as part of the interview',
        ],
      },
    ],
    note: 'The admissions committee may ask for an additional Industry Leaders interview round if needed.',
    art: 'interview',
  },
  {
    id: 'adm-decision',
    num: '04',
    label: 'Receive your decision',
    title: 'Receive your decision|in 3–5 days',
    lede: 'Then you have 7 days to decide.',
    groups: [
      {
        title: 'After your interview',
        points: [
          'Admission results are communicated within 3 to 5 days of completing your interviews',
          'Successful candidates receive an offer to join the programme, with details on onboarding',
          'You have 7 days to decide whether you want to join the programme',
        ],
      },
    ],
    // the process ends in an SSB student ID
    art: 'idcard',
  },
];

/** The video, highlighted as the live SSB page has it: a band of its own after the steps, the copy
 *  and a "Watch now" beside the large thumbnail. Its video is YouTube's "Eligibility and Admission
 *  Process for 2025 Batch"; the live page labels it 2027, so no year is named here. */
export const admissionVideo = {
  eyebrow: 'Watch',
  title: 'Eligibility and admission process, explained',
  sub: 'Who can apply, how selection works and what happens after you apply.',
  cta: 'Watch now',
  video: {
    id: '9kGAVYkqvZQ',
    title: 'Eligibility and Admission Process | Scaler School of Business',
    image: '/admission/eligibility-video.jpg',
  },
};

/** "Important Dates and Fees" (2026-11-13, the user's ask: the live page's table was missing): the
 *  live page's one intake row, its notes and the detailed fee structure's brochure, as read on
 *  scaler.com/school-of-business/admission/ that day. */
export const admissionFees = {
  eyebrow: 'Dates & fees',
  title: 'Important dates and fees.|Every intake.',
  sub: 'Admissions run in weekly phases that close every Sunday. Apply early for a better chance of a seat and a scholarship.',
  // the table is the main page's (admissionsV4.intakes and its fine print, content/admissions.ts)
  brochure: {
    lead: 'Want the detailed fee structure?',
    cta: { label: 'Download Brochure', href: BROCHURE },
  },
};

/** The FAQ (2026-11-13): the home page's FAQ section with admission questions, every answer from the
 *  live admission page (scaler.com/school-of-business/admission/, read that day) or the home page's FAQ. */
export const admissionFaqs: Faq[] = [
  {
    question: 'Who can apply?',
    answer:
      'Anyone who has completed Class 12 and holds a bachelor’s degree from an accredited institution, graduating between 2017 and 2027. A year of work experience is ideal, but freshers with internships, leadership roles in college, good projects or side hustles are welcome.',
  },
  ...faqs.filter((f) => /entrance score/i.test(f.question)),
  {
    question: 'Is the application fee refundable?',
    answer: 'No. The ₹1,500 application fee is non-refundable. You have 7 days from paying it to submit your application.',
  },
  {
    question: 'When will I hear back after my interview?',
    answer:
      'Admission results are communicated within 3 to 5 days of completing your interviews. Successful candidates then have 7 days to decide whether to join.',
  },
  {
    question: 'Who awards the scholarships?',
    answer:
      'Every scholarship is awarded by the Scaler Impact Foundation, supported by industry stalwarts. Applying early gives the admissions team time to review your application before the scholarship committee; decisions are final.',
  },
  {
    question: 'Can I get a loan for the fees?',
    answer:
      'Yes. We offer easy financing through our banking partners, and our counselling team can connect you with financial service providers.',
  },
  {
    question: 'When does the batch begin?',
    answer: 'The 2027 cohort begins in August 2027.',
  },
];

/** The scholarships, on the home page's admissions section (`parts="scholarships"`): its four
 *  scholarships and the foundation's backers, with the live page's notes. */
export const admissionScholarships: AdmissionsContent = {
  ...admissionsV4,
  steps: undefined,
  fastTrack: undefined,
  apply: { label: 'Apply Now', href: APPLY },
  // the section's headline (2026-11-11, the user's ask), so the photo card can say something else
  scholarshipsHead: {
    eyebrow: 'Fees & scholarships',
    title: 'Scholarships up to 100%.|Four ways to qualify.',
    // the fee table's fine print, short, under the title (2026-11-11)
    notes: [
      '₹1,500 application fee, non-refundable',
      'Scholarships apply to tuition fees',
      'Fees may be revised',
    ],
    cta: { label: 'Apply Now', href: APPLY },
  },
  // the fine print moved to the notes beside the table
  fine: '',
  scholarshipsTitle: 'Merit-based. Backed by industry leaders.',
  // "tuition fees only": the live FAQ (scaler.com/school-of-business/faq/, 2026-11-11)
  scholarshipsText:
    'Every scholarship is awarded by the Scaler Impact Foundation and applies to tuition fees. Apply early for the best chance; decisions are final.',
};

/** Financing (2026-11-11, the user's asks: no "if you need a student loan" line; the partners'
 *  logos centre stage): the header and pointers over a row of the four logos, large. */
export const admissionFinancing = {
  eyebrow: 'Financing',
  title: 'Easy financing.|Through our banking partners.',
  // from the live FAQ (scaler.com/school-of-business/faq/, "Financing and Scholarships", 2026-11-11)
  points: [
    'Loans through partnerships with banks and NBFCs',
    'Options matched to your needs and background',
    'Request a callback to talk through your options',
  ],
  // the partners' logo files, each trimmed to its artwork (2026-11-11), drawn at one visual weight: the
  // same amount of ink each (the home page's rule, lib/logos.ts), measured in the browser (`ink`: the
  // share of the box the artwork fills), within 180 × 56
  logos: [
    { name: 'Axis Bank', src: '/admission/axis-bank.svg', width: 180, height: 44 },
    { name: 'RBL Bank', src: '/admission/rbl-bank.svg', width: 139, height: 42 },
    { name: 'Propelld', src: '/admission/propelld.svg', width: 180, height: 33 },
    { name: 'GyanDhan', src: '/admission/gyandhan.svg', width: 64, height: 56 },
  ],
};

/** The request-a-callback band, last before the footer (the home page's closing band), the key facts again. */
export const admissionCallback: CloseContent = {
  ...deckClose,
  // no chip over the title (2026-11-11, the user's ask)
  eyebrow: undefined,
  title: 'Questions about fees or eligibility?',
  line: 'Talk to an admissions counsellor, one to one, about the process, scholarships and financing.',
  // PLACEHOLDER href: the home page's call-back placeholder, until a real destination is agreed
  primaryCta: { label: bottomNav.callback.label, href: bottomNav.callback.href, icon: 'arrow' },
  secondaryCta: { label: 'Download Brochure', href: BROCHURE, icon: 'download' },
  // the first fold's facts again, at the foot of the page (2026-11-11, the user's ask)
  facts: [
    { value: '20 Dec', label: 'Early bird closes' },
    { value: '₹1,500', label: 'Application fee' },
    { value: '₹23,00,000', label: 'Course fee' },
    { value: 'Aug 2027', label: 'Batch begins' },
  ],
  // the team's photo (the user's file, 2026-11-11, moved here from financing): SSB students in the lab
  image: '/admission/students-lab.jpg',
  imageSmall: '/admission/students-lab.jpg',
  imageAlt: 'SSB students high-fiving in the lab',
};

/** The bottom navigation: the live page's sections bar, on this page's sections. The first fold is
 *  first, so "Dates & fees" leads back to the top. */
export const admissionNav: BottomNavItem[] = [
  { label: 'Overview', target: 'adm-top' },
  { label: 'Process', target: 'adm-steps' },
  { label: 'Dates & fees', target: 'fees' },
  { label: 'Scholarships', target: 'scholarships' },
  { label: 'Financing', target: 'financing' },
  { label: 'FAQ', target: 'faq-title' },
];
