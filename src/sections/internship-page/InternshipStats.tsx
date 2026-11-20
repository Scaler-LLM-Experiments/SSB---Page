import * as React from 'react';

import type { internshipOutcomes } from '@/content/internship';
import './internship-page.css';

/**
 * The outcomes' three figures (the internship page, 2026-11-12, after the user's reference: a row of
 * boxes under the header, before the profiles): each a box of the page's, the figure in the brand green
 * over its label in small capitals. Phones: one under another.
 */
export function InternshipStats({ stats }: { stats: (typeof internshipOutcomes)['stats'] }) {
  return (
    <dl className="int-stats">
      {stats.map((s) => (
        <div key={s.label}>
          <dd>{s.value}</dd>
          <dt>{s.label}</dt>
        </div>
      ))}
    </dl>
  );
}
