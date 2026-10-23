// Admission process, fees and eligibility, and the FAQ: from the deck
// (SSB Website vF, Sep '26, slides 27–28). CTA hrefs are placeholders until
// real destinations are agreed (as in home.ts).

export const admissionsCtas = {
  primary: { label: 'Start application', href: '#apply' },
  secondary: { label: 'Talk to advisor', href: '#advisor' },
};

export const eligibility =
  "Class 12th, then graduation: a bachelor's degree from an accredited institution. Ideal for professionals with work experience, and for freshers who bring a strong track record of initiative: internships, projects, clubs or similar engagements.";

// The main landing page's process (feedback, 2026-10-06); the deck's seven steps were replaced.
export const admissionSteps = ['Apply', 'Pay application fee', 'Submit application', 'Interview', 'Receive verdict'];

export const fastTrack = 'If 90 percentile & above in CAT/XAT/NMAT/SNAP, or a 640+ score in GMAT.';

export const feeColumns = ['Intake', 'Deadline', 'Application fee', 'Course fee'] as const;

export const feeRows = [
  { intake: 'Early bird', deadline: 'Oct 4, 2026', application: '₹1,000', course: '₹15,50,000' },
  { intake: 'Intake 2', deadline: 'Dec 27, 2026', application: '₹1,000', course: '₹16,00,000' },
  { intake: 'Intake 3', deadline: 'Feb 27, 2027', application: '₹1,000', course: '₹16,00,000' },
  { intake: 'Intake 4', deadline: 'May 2, 2027', application: '₹1,000', course: '₹16,00,000' },
  { intake: 'Final deadline: last intake', deadline: 'Jul 31, 2027', application: '₹1,000', course: '₹16,00,000' },
];

export const scholarships =
  'Up to 100% merit-based scholarships for high-achieving profiles, evaluated after your interview.';

export type Faq = { question: string; answer: string; link?: { label: string; href: string } };

// The deck's sixth question ("Where can I see the full Outcomes Report?") is
// left out until the report has a link.
export const faqs: Faq[] = [
  {
    question: 'Does the lack of a degree hold back my career later?',
    answer:
      "Short answer: no. The industry cares about your skills, experience, and body of work, not the accreditation on your certificate. SSB's PGP in Management & Technology is a certificate program by design: a degree is fixed the day it's accredited; our curriculum isn't. We rebuild it every term against what industry is actually hiring for right now.",
  },
  {
    question: 'What is the eligibility criteria?',
    answer: 'See the Eligibility & Admissions section above.',
    link: { label: 'Eligibility & Admissions', href: '#admissions' },
  },
  {
    question: 'Do I need a management entrance score to apply?',
    answer: 'No mandatory entrance exam score. Profile-based evaluation.',
  },
  {
    question: 'What is the program structure and duration?',
    answer: '18 months, full-time, on-campus, including a 3–6 month internship, structured across 5 terms.',
  },
  {
    question: 'What happens during the internship?',
    answer:
      '100% of Cohort 1 completed a mandatory internship, with stipends up to ₹60K. Several converted directly into full-time offers.',
  },
];

/** The concept site's /v4 admissions (2026-10-23, the team's pick), on the light page: its copy,
 *  intakes (the open one worked out from today), the four scholarships and their criteria. */
export const admissionsV4 = {
  eyebrow: 'Admissions',
  title: 'Admissions, fees and',
  titleTail: 'eligibility.',
  lede: 'Who can apply, how selection works, what the programme costs, and the scholarships on offer.',
  eligibility: "Class 12, then a bachelor's degree from an accredited institution. Ideal for professionals with work experience, and for freshers with a strong record of internships, projects, clubs or similar.",
  apply: { label: 'Start application', href: 'https://www.scaler.com/school-of-business/admission/' },
  advisor: { label: 'Talk to an advisor', href: '#advisor' },
  steps: ['Apply', 'Pay the application fee', 'Submit your application, with a short video essay', 'Interview with industry leaders', 'Receive your decision'],
  fastTrack: '90 percentile or above in CAT, XAT, NMAT or SNAP, or 640+ in the GMAT.',
  intakes: [
    { name: 'Early bird', by: '2026-10-04', byLabel: '4 Oct 2026', fee: '₹15,50,000' },
    { name: 'Intake 2', by: '2026-12-27', byLabel: '27 Dec 2026', fee: '₹16,00,000' },
    { name: 'Intake 3', by: '2027-02-27', byLabel: '27 Feb 2027', fee: '₹16,00,000' },
    { name: 'Intake 4', by: '2027-05-02', byLabel: '2 May 2027', fee: '₹16,00,000' },
    { name: 'Final intake', by: '2027-07-31', byLabel: '31 Jul 2027', fee: '₹16,00,000' },
  ],
  fine: 'Application fee ₹1,000 for every intake, non-refundable. Fees may be revised. Financing is available through our banking partners.',
  scholarshipsTitle: 'Scholarships up to 100%.',
  scholarshipsText: 'Merit-based and decided after your interview. Every scholarship is awarded by the Scaler Impact Foundation. Applying early improves your chances.',
  scholarships: [
    { k: 'For founders', t: 'Future Business Innovators', full: 'Future Business Innovators Scholarship', lede: 'Rewarding entrepreneurial spirit and innovation in business.', c: ['You are a founder or co-founder, or built a startup with measurable impact', 'You have closed a funding round with VCs', 'You were a founding team member at a startup'] },
    { k: 'For achievers', t: 'Extraordinary Achievements', full: 'Extraordinary Achievements Scholarship', lede: 'Recognising outstanding academic achievement and potential.', c: ['Academics: a top rank in national or international management entrance tests, or a merit rank at undergraduate level', 'Competitions: gold medal or equivalent in business case competitions, Olympiads or prestigious contests', 'Sport: exceptional accomplishments at national or international level'] },
    { k: 'For professionals', t: 'Industry Leaders', full: 'Industry Leaders Scholarship', lede: 'Valuing professionals with impactful work and leadership.', c: ['Recognised accomplishments in your field with an established company', 'Consultant at a tier 1 or tier 2 consulting firm'] },
    { k: 'For women leaders', t: 'Women in Leadership', full: 'Women in Leadership Scholarship', lede: 'Helping women into leadership roles in business.', c: ['Proven leadership and strong professional achievements', 'A leadership position in an organisation or college club'] },
  ],
  backersLabel: 'The Scaler Impact Foundation is backed by',
  backers: [
    { name: 'Vijay Shekhar Sharma', role: 'Founder, Paytm', image: '/impact/vijay-shekhar-sharma.webp' },
    { name: 'Prasanna Sankar', role: 'Co-founder, Rippling', image: '/impact/prasanna-sankar.webp' },
    { name: 'Bhavin Turakhia', role: 'Founder, Zeta and Titan', image: '/impact/bhavin-turakhia.webp' },
    { name: 'Ankur Warikoo', role: 'Founder, WebVeda', image: '/impact/ankur-warikoo.webp' },
    { name: 'Mohak Mangal', role: 'Founder, Soch by Mohak', image: '/impact/mohak-mangal.webp' },
  ],
};
