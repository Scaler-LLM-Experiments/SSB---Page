import type { BottomNavItem } from './bottom-nav';

/**
 * The FAQ page (/faq, 2026-11-13, the user's asks: the live FAQ page, scaler.com/school-of-business/faq/,
 * in the same layout and the same words, in our type and icons, light only). Every question, answer,
 * title and video is the live page's as read that day; only its links to scaler.com's admission and
 * application pages point at this site's pages. A paragraph's `link` is its closing "here".
 */

const APPLY = 'https://www.scaler.com/school-of-business/application';

export type FaqVideo = { id: string; title: string };
export type FaqBlock =
  /** a paragraph: an optional bold lead-in, the text, an optional link after it ("here") */
  | { p: string; strong?: string; link?: { label: string; href: string } }
  /** a list, with an optional bold heading over it */
  | { list: string[]; lead?: string }
  /** a table; a cell's line breaks are kept */
  | { table: { head: string[]; rows: string[][] } };
export type FaqItem = { q: string; a: FaqBlock[]; video?: FaqVideo };
export type FaqCategory = { id: string; tab: string; title: string; items: FaqItem[] };

const V = {
  top1: { id: 'clkY2FHblao', title: 'Becoming a Top 1% Business Leader with Scaler School of Business' },
  campus: { id: 'yBYXT419bFw', title: 'Scaler School of Business - Campus Walkthrough' },
  overview: { id: 'XLEGsivJZHM', title: 'Scaler School of Business - Program Overview' },
  different: { id: 'u1ANgQDw9_s', title: 'What makes Scaler School of Business different and better?' },
  mba: { id: 'Ae7ecVYzwu8', title: 'Should you pursue an MBA or not?' },
  eligibility: { id: '9kGAVYkqvZQ', title: 'Eligibility and Admission Process for 2026 batch | Scaler School of Business' },
  coding: { id: 'r05hBcMghIk', title: 'Is coding experience needed for Scaler School of Business?' },
  fees: { id: 'YKigBMv2004', title: 'Fees and Scholarships for 2026 batch | Scaler School of Business' },
  instructors: { id: 'TvRkuAHIGpQ', title: 'Instructors, Academics and Mentors at Scaler School of Business' },
  placements: { id: '_kswQmPO9Rs', title: 'Placements at Scaler School of Business | Tech and Non-Tech roles' },
  structure: { id: 'zMLjdRxMP4s', title: 'Program Structure & Curriculum Breakdown | Scaler School of Business' },
  batch: { id: 'nWjACugDDiA', title: '2024 Batch Profile & Intake | Scaler School of Business' },
  degree: { id: 'aholpOZhRP4', title: 'Degree or Diploma - What does Scaler School of Business provide?' },
  curriculum: { id: 'XLEGsivJZHM', title: 'What’s the Curriculum at SSB?' },
  lab: { id: '__fBoTGv41g', title: 'What is Scaler’s Innovation Lab?' },
} satisfies Record<string, FaqVideo>;

/** "Everything about Scaler School of Business": the three numbered videos. */
export const faqHero = {
  crumbs: [
    { label: 'Home', href: '/' },
    { label: 'Everything About SSB', href: '/faq' },
  ],
  title: 'Everything about Scaler School of Business',
  videos: [V.top1, V.campus, V.overview],
};

/** The large video and the card beside it. */
export const faqFeature = {
  video: V.different,
  kicker: 'India’s Only B-School',
  title: 'Built by Industry Leaders, for Future Leaders',
  points: [
    'Tech-Enabled, Practical-First, Industry-Integrated Curriculum',
    'Top Instructors - Practitioners and Academicians',
    'Company sourced Projects and Case studies',
    'Personalized Mentorship',
    'Build your own Business with Scaler’s Innovation Lab',
    '3 month Mandatory Internship',
    '100% Placement Support',
  ],
  cta: { label: 'Apply Now', href: APPLY },
};

export const faqIntro = {
  title: 'Frequently Asked Questions',
  sub: 'Answers to the mostly commonly asked questions about Scaler School of Business.',
};

const eligibility: FaqItem = {
  q: 'What is the eligibility criteria?',
  video: V.eligibility,
  a: [
    { lead: 'Education:', list: ['Completed Class 12th Graduation', 'Completed Bachelor’s degree from an accredited institution'] },
    {
      strong: 'Work Experience:',
      p: 'It’s ideal to have adequate professional work experience to support your learning journey (minimum of 1 year), but we encourage freshers to apply as well.',
    },
    {
      lead: 'Profile Based Evaluation:',
      list: [
        'We conduct a profile based evaluation based on your work experience, academics and co curricular and leadership abilities.',
        'We’re looking for demonstrated proactiveness through side projects, startups, or other hustles.',
      ],
    },
    { p: 'To apply for the program at Scaler School of Business, please visit our official website at:', link: { label: 'here', href: '/' } },
  ],
};
const testScores: FaqItem = {
  q: 'Do I need any management test scores to be eligible for application?',
  a: [
    {
      p: 'No, management test scores are not mandatory. We conduct a profile based evaluation based on your work experience, academics and co curricular and leadership abilities. A strong profile with side projects, startup experience, or other side hustles is a powerful indicator of your potential.',
    },
    { p: 'To apply for the program at Scaler School of Business, please visit our official website at:', link: { label: 'here', href: '/' } },
  ],
};
const financing: FaqItem = {
  q: 'What Financing options are available for paying Admission fees if I get selected?',
  a: [
    {
      p: 'We provide several financing options basis your needs and background through partnerships with Banks and NBFCs. If you want to know more, you can request for a call back. Our dedicated team will promptly reach out to you and provide assistance in resolving the issue.',
    },
  ],
};

export const faqCategories: FaqCategory[] = [
  {
    id: 'important',
    tab: 'Important FAQs',
    title: 'Important FAQs',
    items: [
      { q: 'Why Scaler School of Business?', video: V.campus, a: [] },
      { q: 'Is this a fully residential program?', a: [{ p: 'Yes, the PGP program at the Scaler School of Business is a full-time on-campus program.' }] },
      financing,
      {
        q: 'What is the Admission process for Scaler School of Business?',
        a: [
          { list: ['Submission of Application', 'Review Process', 'Interviews', 'Decision', 'Offer & Acceptance'] },
          { p: 'For a complete deep dive into the admissions process, please click', link: { label: 'here', href: '/admission' } },
        ],
      },
      {
        q: 'How can I apply for scholarships?',
        video: V.fees,
        a: [
          { p: 'The scholarship application process consists of the following steps:' },
          {
            list: [
              'Screening: Applicants are evaluated based on their academic performance, test scores, and a recorded personal interview.',
              'Document Submission: Candidates need to submit the required supporting documents based on the specific category of scholarship they are applying for.',
              'Sponsor’s Assessment: Once the applicant’s profile, including the recorded personal interview, essays, and supporting documents, is complete, it is shared with potential sponsors. We match your profile with sponsors whose criteria align with your qualifications. In some cases, a one-on-one meeting between the sponsor and the candidate may be arranged upon request.',
              'Results: The sponsors announce the final decisions regarding the scholarship recipients. The chosen candidates are informed about the outcome of their applications.',
            ],
          },
          {
            p: 'For detailed information about these scholarships, including eligibility criteria and application procedures, please visit our website',
            link: { label: 'here', href: '/admission#scholarships' },
          },
        ],
      },
      eligibility,
      testScores,
    ],
  },
  {
    id: 'degree',
    tab: 'Degree',
    title: 'Degree',
    items: [
      {
        q: 'Does this course have a Degree or Diploma?',
        video: V.degree,
        a: [
          {
            p: 'No, you will receive a certificate for PGP in Management and Technology. Maintaining control over our curriculum ensures agility and responsiveness to evolving industry trends and technological advancements. This flexibility ensures that our program remains highly relevant and competitive in today’s dynamic business landscape.',
          },
        ],
      },
    ],
  },
  {
    id: 'eligibility',
    tab: 'Eligibility Criteria',
    title: 'Eligibility Criteria',
    items: [
      eligibility,
      { ...testScores, video: V.eligibility },
      {
        q: 'Is there an age limit for entry?',
        a: [
          {
            p: 'There is no age limit for entry. However, the program is most suitable for individuals at an early stage in their career, with experience ranging from one to four years. If you have more work experience, we encourage you to request a call back from the admissions team for consultation. They will evaluate your profile and provide guidance accordingly.',
          },
        ],
      },
    ],
  },
  {
    id: 'application',
    tab: 'Application',
    title: 'Application',
    items: [
      {
        q: 'What are the earliest and latest application deadlines for the MBA program?',
        a: [{ p: 'Admissions for 2026 cohort are now open, please visit the admission page for the deadlines:', link: { label: 'Important dates and fees', href: '/admission#fees' } }],
      },
      { q: 'What is the total admission fee cost ?', a: [{ p: '₹23,00,000 for every intake, and a ₹1,500 application fee, non-refundable. Scholarships of up to 100% apply to the tuition fee.' }] }, // (2026-11-19, Stephan: 23L across all intakes, application fee ₹1,500)
      {
        q: 'How can I strengthen my application?',
        a: [
          {
            lead: 'For individuals with 0-1 year of experience:',
            list: [
              'Academic Excellence: Strong undergraduate grades and a competitive GPA.',
              'Leadership Potential: Involvement in extracurricular activities, volunteer work, or leadership roles within student organizations.',
              'Internship Experience: Any relevant internships or co-op experiences during undergraduate studies.',
              'Standardized Test Scores: High scores on standardized tests such as the GRE or GMAT.',
              'Letters of Recommendation: Strong letters of recommendation from professors, employers, or mentors.',
              'Personal Statement: A compelling personal statement outlining career goals, reasons for pursuing an MBA, and how the program aligns with their aspirations.',
            ],
          },
          {
            lead: 'For individuals with 2-3 years of experience:',
            list: [
              'Professional Experience: Demonstrated progression and achievements in their current role.',
              'Leadership Experience: Evidence of leadership roles or significant contributions to projects or teams.',
              'Industry Knowledge: Understanding of their chosen industry and how an MBA will enhance their career trajectory.',
              'Career Goals: Clear and well-defined career goals, with an understanding of how an MBA will help achieve them.',
              'Recommendations: Letters of recommendation from supervisors or colleagues who can speak to their work ethic and potential.',
            ],
          },
          {
            lead: 'For individuals with 4+ years of experience:',
            list: [
              'Leadership and Management Experience: Demonstrated leadership abilities and experience managing teams or projects.',
              'Professional Achievements: Significant accomplishments or contributions to their field or industry.',
              'Industry Impact: Evidence of making an impact within their organization or industry.',
              'Career Progression: Clear evidence of career growth and advancement.',
              'Industry Knowledge: Deep understanding of their industry and emerging trends.',
              'Recommendations: Strong recommendations from senior leaders or executives who can attest to their leadership capabilities and potential for future success.',
            ],
          },
        ],
      },
      { q: 'Are there any application fee waivers available?', a: [{ p: 'Only Existing Scaler Learners or alumni are eligible for an application fee waiver.' }] },
      {
        q: 'Does the admission fee guarantee an application review or interview?',
        a: [
          {
            p: 'The admission fee is not a guarantee of application review or interview. Selection decisions are based on a holistic assessment of your profile, including academic performance, work experience, extracurricular achievements, and essay. We employ a rubric for both application review and interview shortlisting, ensuring fairness and thorough consideration of each applicant.',
          },
        ],
      },
    ],
  },
  {
    id: 'interview',
    tab: 'Personal Interview',
    title: 'Personal Interview',
    items: [
      {
        q: 'How will the Personal Interview happen?',
        a: [
          {
            p: 'There are two Personal Interviews for the Scaler School of Business program, which can be conducted in either in-person or online formats, depending on the circumstances and preferences of the candidates. The interview process aims to assess the candidate’s suitability for the program and allows the evaluators to gauge their potential and aspirations. The specific details regarding the interview format, location, or platform (if conducted online) will be communicated to the candidates before the interview.',
          },
        ],
      },
      {
        q: 'What kind of questions will be asked in the Personal Interview?',
        a: [
          {
            p: 'The MBA personal interview serves to delve deeper into candidates’ motivations, aspirations, and readiness for the program. It evaluates their communication skills, interpersonal abilities, and potential to contribute meaningfully to the business community. Through discussions on past accomplishments and future goals, it helps assess their suitability for leadership roles in the business world.',
          },
        ],
      },
      {
        q: 'Are there any resources available for preparation for personal Interview?',
        a: [
          {
            p: 'Yes, we provide a Personal Interview Prep Kit once you have successfully been shortlisted for the interview. This kit is designed to assist you in better preparing for your personal interview, bringing you one step closer to securing admission to Scaler School of Business.',
          },
        ],
      },
      { q: 'When will the interviews take place?', a: [{ p: 'The dates for personal interviews are shared with candidates via their registered email id once their applications have been shortlisted.' }] },
    ],
  },
  {
    id: 'admissions',
    tab: 'Admissions',
    title: 'Admissions',
    items: [
      {
        q: 'When do classes start?',
        a: [
          {
            p: 'Classes for the 2026 Cohort at the Scaler School of Business program are scheduled to commence in August 2027. For more detailed information and specific dates, we recommend visiting our official website. You will find comprehensive details about the admission process, important dates, and other relevant information related to the program on our website',
            link: { label: 'here', href: '/admission' },
          },
        ],
      },
      { q: 'How can I apply for the program?', a: [{ p: 'Admissions for the 2026 cohort are now open, Click', link: { label: 'here to apply', href: APPLY } }] },
      { q: 'Can I defer admission?', a: [{ p: 'No, you are required to apply for the intake in which you intend to enroll.' }] },
    ],
  },
  {
    id: 'program',
    tab: 'Program And Outcome',
    title: 'Program and Outcome',
    items: [
      { q: 'What is the curriculum covered in Scaler School of Business?', video: V.curriculum, a: [] },
      { q: 'What kind of jobs can I expect at the end of the program?', video: V.placements, a: [] },
      { q: 'What is Scaler’s Innovation Lab?', video: V.lab, a: [] },
      { q: 'Who are the Instructors at Scaler School of Business?', video: V.instructors, a: [] },
      { q: 'Do I need prior coding experience to join Scaler School of Business?', video: V.coding, a: [] },
      {
        q: 'Is there an exchange program for this course?',
        a: [
          {
            p: 'No, We have not incorporated an exchange program into this course due to the program’s focus on providing a comprehensive and immersive learning experience within our institution. This allows us to maintain consistency in curriculum delivery, ensure high-quality instruction, and facilitate deeper engagement.',
          },
        ],
      },
    ],
  },
  {
    id: 'financing',
    tab: 'Financing And Scholarships',
    title: 'Financing and Scholarships',
    items: [
      financing,
      {
        q: 'What are the types of scholarships does Scaler school of Business offer?',
        video: V.fees,
        a: [
          {
            p: 'Scaler School of Business takes pride in offering four exclusive types of scholarships, each specifically designed to recognize and support deserving students on their educational journey:',
          },
          {
            table: {
              head: ['Category', 'Eligibility', 'Description'],
              rows: [
                ['Future Business Innovators', 'Founder/co-founder of impactful startup with measurable impact', 'Successfully closed a funding round with VCs.'],
                [
                  'Extraordinary Achievements',
                  'Students with exceptional academic or competition achievements',
                  'International Olympiad medalist\nTop finisher at HackMIT, TechCrunch Disrupt, Google Code Jam\nLeading hackathon/coding competition finisher or strong undergraduate merit rank',
                ],
                ['Industry Leaders', 'Individuals with a proven track record in a corporate setting', 'Consultant at tier 1/2 consulting firm, Founding team member of a startup'],
                ['Women in Leadership', 'Women with demonstrated leadership and professional achievements', 'Holds a leadership position in organizations/college clubs'],
              ],
            },
          },
        ],
      },
      { q: 'Are the scholarships applicable on tuition fees or the entire fees (tuition + hostel)?', a: [{ p: 'Scholarships apply to the tuition fees only.' }] },
      {
        q: 'Do you offer a zero-cost EMI option?',
        a: [{ p: 'At this time, we do not offer a zero-cost EMI option. If you have any specific questions regarding payment options or require assistance, please request a call back.' }],
      },
      { q: 'What is the fee structure of the program?', a: [{ p: 'Check out the detailed information regarding fees', link: { label: 'here', href: '/admission#fees' } }] },
    ],
  },
];

/** "Recommended for you": the live page's twelve videos and titles, in its order. */
export const faqRecommended = {
  title: 'Recommended for you',
  videos: [V.mba, V.eligibility, V.coding, V.fees, V.instructors, V.placements, V.structure, V.batch, V.different, V.degree, V.curriculum, V.lab],
};

/** The bottom navigation: the live page's sections bar. */
export const faqNav: BottomNavItem[] = [
  { label: 'Everything About SSB', target: 'fqh-title' },
  { label: 'More FAQs', target: 'fq-title' },
  { label: 'Recommended For You', target: 'fqr-title' },
];
