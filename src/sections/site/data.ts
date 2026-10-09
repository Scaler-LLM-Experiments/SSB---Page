/**
 * SSB footer content, from the SSB concept site (ssb-school-concept.vercel.app),
 * captured 2026-09-29. Components hold no copy: everything they print is here.
 */
export interface FooterLink {
  label: string;
  href: string;
}
export interface FooterContent {
  cta: {
    eyebrow: string;
    title: string;
    body: string;
    note: string;
    image: { src: string; alt: string };
    primary: FooterLink;
    secondary: FooterLink;
  };
  tagline: string;
  columns: { title: string; links: FooterLink[] }[];
  legal: string;
  backToTop: string;
  navLabel: string;
  /** Drawn in particles at the foot (decorative). */
  wordmark: string;
  /** The campus footer: the photo the footer stands on, and the short line beside the tagline. */
  campus: { image: { src: string; small: string; alt: string }; place: string };
  /** The building footer: the SSB building cut out (transparent around it), standing in front of the name. */
  building: { src: string; small: string; alt: string };
}

export const SSB_FOOTER: FooterContent = {
  cta: {
    eyebrow: 'Your next step',
    title: 'Build the Future. Don’t Just Study It.',
    body: 'Explore the PGP in Management & Technology and decide whether this way of learning is right for you.',
    note: 'Applications are open for the next cohort.',
    image: { src: 'https://ssb-school-concept.vercel.app/assets/program.webp', alt: 'Illustrative scene of learners together outdoors' },
    primary: { label: 'Apply now', href: 'https://www.scaler.com/school-of-business/admission/' },
    secondary: { label: 'Download Brochure', href: 'https://www.scaler.com/school-of-business/' },
  },
  tagline: 'For people who build.',
  columns: [
    {
      title: 'Explore',
      links: [
        { label: 'Why SSB', href: '#why-ssb' },
        { label: 'Outcomes', href: '#outcomes' },
        { label: 'Curriculum', href: '#curriculum' },
      ],
    },
    {
      title: 'Next steps',
      links: [
        { label: 'Program Details', href: '#curriculum' },
        { label: 'Admission Process', href: '#admissions' },
        { label: 'FAQs', href: '#faq' },
      ],
    },
  ],
  legal: '© 2026 InterviewBit Technologies Pvt. Ltd. The PGP awards a certificate, not a degree.',
  backToTop: 'Back to top',
  navLabel: 'Footer',
  wordmark: 'Scaler School of Business',
  // the school's own photo of the campus entrance (DSC06135, supplied 2026-10-05); served by the page
  campus: { image: { src: '/footer/campus.webp', small: '/footer/campus-1200.webp', alt: 'The Scaler School of Business campus entrance at dusk' }, place: 'Campus: Bengaluru' },
  // the team's cut-out of the building with its walkway (2026-10-08): 1536 × 1024, transparent above the roofline (its top 261px, 17% of its width)
  building: { src: '/footer/building.webp', small: '/footer/building-800.webp', alt: 'The Scaler School of Business building in Bengaluru' },
};
