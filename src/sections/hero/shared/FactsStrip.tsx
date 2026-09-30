import type { HeroFact } from '../types';

/**
 * The programme's key facts on one frosted-glass strip, split by hairlines.
 * Made for dark ground (footage, or a black page). Position it with `className`.
 */
export function FactsStrip({ facts, className }: { facts: HeroFact[]; className?: string }) {
  return (
    <ul
      data-hero-facts
      data-hero-fade
      data-surface-ink="on-image"
      className={`flex w-fit flex-wrap items-center gap-x-4 gap-y-2 rounded-xl bg-glass-on-image px-4 py-3 backdrop-blur-glass ${className ?? ''}`}
    >
      {facts.map((fact, i) => (
        <li key={fact.value} className="flex items-center gap-4">
          {i > 0 ? <span aria-hidden="true" className="h-4 w-px bg-on-image-ink opacity-faint" /> : null}
          <span className="type-label whitespace-nowrap text-on-image-ink">{fact.value}</span>
        </li>
      ))}
    </ul>
  );
}
