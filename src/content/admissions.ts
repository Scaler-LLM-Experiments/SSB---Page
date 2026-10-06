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
