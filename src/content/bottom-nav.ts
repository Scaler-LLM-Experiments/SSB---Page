// The page's bottom navigation (the team's ask, 2026-10-08): its five pillars (2026-10-27; was seven sections), and the call-back
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
   *  (review call, 21 Oct 2026) the tabs go to this page's sections until the other pages are refreshed. */
  apply: { label: string; tabs: BottomNavLink[] };
} = {
  label: 'Sections of the page',
  items: [
    // (2026-10-27, the user's ask) the minimal page's five pillars; each points at its group's first
    // section (was seven: Outcomes, Why SSB, Faculty, Curriculum, Innovation Lab, Campus life, Admissions)
    { label: 'Placements', target: 'placements-showcase-title' },
    { label: 'Faculty', target: 'people' },
    { label: 'How you learn', target: 'why-breaker-title' },
    { label: 'Admissions', target: 'admissions' },
    { label: 'Campus', target: 'campus-title' },
  ],
  callback: { label: 'Request a callback', href: '#advisor' },
  apply: {
    label: 'Apply now',
    tabs: [
      { label: 'Admission & Fees', href: '#admissions' },
      { label: 'Program', href: '#curriculum' },
      { label: 'Internship', href: '#internship' },
      { label: 'Campus Life', href: '#campus-title' },
    ],
  },
};
