// The page's bottom navigation (the team's ask, 2026-10-08): seven of its sections, and the call-back
// action beside them. Each item names a section by an id already on the page (its section, or its
// heading inside it). The call-back's href is the same placeholder as Admissions' "Talk to advisor"
// until a real destination is agreed.

export type BottomNavItem = { label: string; target: string };

export const bottomNav: {
  label: string;
  items: BottomNavItem[];
  callback: { label: string; href: string };
  /** Phones: the sticky apply bar (its date: the next intake's deadline, from the fee table). */
  apply: { label: string; deadlineLabel: string };
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
  apply: { label: 'Apply now', deadlineLabel: 'Last date to register' },
};
