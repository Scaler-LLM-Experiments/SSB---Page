/**
 * SSB navbar content.
 *   SSB_NAV          the live site's own nav (scaler.com/school-of-business, read 2026-10-05):
 *                    Home · Admission & Fees · Program · Internship · Campus Life · Events ·
 *                    Career Roadmap · Guide · FAQs, then Login and Apply Now. Same labels,
 *                    same order, same destinations.
 *   SSB_NAV_CONCEPT  the earlier concept nav (ssb-school-concept.vercel.app) grouped into two
 *                    mega menus after React Bits' Navbar 5; kept so it can be switched back.
 */
export type NavIcon = 'chart' | 'users' | 'rocket' | 'briefcase' | 'target' | 'chalkboard' | 'book' | 'sparkle' | 'compass' | 'buildings' | 'flask' | 'door';
export interface NavItem {
  title: string;
  desc: string;
  href: string;
  icon: NavIcon;
}
export interface NavMenu {
  label: string;
  groups: { title: string; items: NavItem[] }[];
  footer: { text: string; sub: string; cta: { label: string; href: string } };
}
export interface NavContent {
  menus: NavMenu[];
  links: { label: string; href: string }[];
  /** `icon: 'download'` draws it as the outline button with the download glyph; without it, a plain text link */
  secondary: { label: string; href: string; icon?: 'download' };
  primary: { label: string; href: string };
  menuLabel: string;
  closeLabel: string;
}

const APPLY = 'https://www.scaler.com/school-of-business/admission/';
const SSB = 'https://www.scaler.com/school-of-business';

export const SSB_NAV: NavContent = {
  menus: [],
  links: [
    { label: 'Home', href: '#top' },
    { label: 'Admission & Fees', href: `${SSB}/admission/` },
    { label: 'Program', href: `${SSB}/program/` },
    { label: 'Internship', href: `${SSB}/internship/` },
    { label: 'Campus Life', href: `${SSB}/campus-life/` },
    { label: 'Events', href: `${SSB}/events` },
    { label: 'Career Roadmap', href: 'https://interviewbit.typeform.com/career-planning/' },
    { label: 'Guide', href: `${SSB}/guide` },
    { label: 'FAQs', href: `${SSB}/faq/` },
  ],
  // [CONFIRM] the live Login and Apply Now are buttons that open the site's own forms, not links
  secondary: { label: 'Login', href: 'https://www.scaler.com/users/sign_in/' },
  primary: { label: 'Apply Now', href: APPLY },
  menuLabel: 'Menu',
  closeLabel: 'Close menu',
};

export const SSB_NAV_CONCEPT: NavContent = {
  menus: [
    {
      label: 'Why SSB',
      groups: [
        {
          title: 'The school',
          items: [
            { title: 'Outcomes', desc: 'Placement highlights of the founding PGP cohort', href: '#outcomes', icon: 'chart' },
            { title: 'Alumni', desc: 'Career switches from the first cohorts', href: '#alumni', icon: 'users' },
            { title: 'Founders & leaders', desc: 'EIRs, operators and investors who teach', href: '#founders', icon: 'rocket' },
          ],
        },
        {
          title: 'How you learn',
          items: [
            { title: 'Live consulting projects', desc: 'With actual companies, from brief to boardroom', href: '#experience', icon: 'briefcase' },
            { title: 'Challenges', desc: 'Sell on the street, launch a live D2C brand', href: '#challenges', icon: 'target' },
            { title: 'People & faculty', desc: 'Leaders across strategy, product and marketing', href: '#people', icon: 'chalkboard' },
          ],
        },
      ],
      footer: { text: 'Applications are open for the next cohort.', sub: '18 months · Bengaluru campus · 150 seats', cta: { label: 'Apply now', href: APPLY } },
    },
    {
      label: 'Programme',
      groups: [
        {
          title: 'Curriculum',
          items: [
            { title: 'Five terms', desc: 'Learn the principles, make a sale, launch a brand', href: '#curriculum', icon: 'book' },
            { title: 'AI journey', desc: '150+ hours, 25+ tools, three hackathons', href: '#ai', icon: 'sparkle' },
            { title: 'Career prep', desc: 'Running parallel from Month 1', href: '#career', icon: 'compass' },
          ],
        },
        {
          title: 'Beyond the classroom',
          items: [
            { title: 'Internship', desc: 'A 3–6 month internship with industry', href: '#internship', icon: 'buildings' },
            { title: 'Innovation lab', desc: 'Ventures from the wider lab community', href: '#innovation', icon: 'flask' },
            { title: 'Admissions', desc: 'How to apply and what happens next', href: '#admissions', icon: 'door' },
          ],
        },
      ],
      footer: { text: 'See the whole programme in one place.', sub: 'The PGP in Management & Technology brochure', cta: { label: 'Download brochure', href: 'https://www.scaler.com/school-of-business/' } },
    },
  ],
  links: [
    { label: 'Outcomes', href: '#outcomes' },
    { label: 'Admissions', href: '#admissions' },
  ],
  secondary: { label: 'Download brochure', href: 'https://www.scaler.com/school-of-business/', icon: 'download' },
  primary: { label: 'Apply now', href: APPLY },
  menuLabel: 'Menu',
  closeLabel: 'Close menu',
};
