// The page's bottom navigation (the team's ask, 2026-10-08): seven of its sections, and the call-back
// action beside them. Each item names a section by an id already on the page (its section, or its
// heading inside it). The call-back's href is the same placeholder as Admissions' "Talk to advisor"
// until a real destination is agreed.

export type BottomNavItem = { label: string; target: string };
export type BottomNavLink = { label: string; href: string };

export const bottomNav: {
  label: string;
  items: BottomNavItem[];
  callback: { label: string; href: string };
  /** Phones: the sticky apply bar, Apply now over a row of icon tabs (the team's ask, 2026-10-09);
   *  the tabs open the school's other pages on the live site, not sections of this one. */
  apply: { label: string; tabs: BottomNavLink[] };
} = {
  label: 'Sections of the page',
  items: [
    { label: 'Outcomes', target: 'placements-showcase-title' },
    { label: 'Why SSB', target: 'why-breaker-title' },
    { label: 'Faculty', target: 'people' },
    { label: 'Curriculum', target: 'curriculum' },
    { label: 'Innovation Lab', target: 'sil-band-title' },
    { label: 'Campus life', target: 'campus-title' },
    { label: 'Admissions', target: 'admissions' },
  ],
  callback: { label: 'Request a callback', href: '#advisor' },
  apply: {
    label: 'Apply now',
    tabs: [
      { label: 'Admission & Fees', href: 'https://www.scaler.com/school-of-business/admission/' },
      { label: 'Program', href: 'https://www.scaler.com/school-of-business/program/' },
      { label: 'Internship', href: 'https://www.scaler.com/school-of-business/internship/' },
      { label: 'Campus Life', href: 'https://www.scaler.com/school-of-business/campus-life/' },
    ],
  },
};
