import './mark-ticker.css';

/** `wordmark`: the mark already spells the name (BCG's), so it is drawn alone, the name its alt. */
export type Mark = { name: string; mark: string; wordmark?: boolean };

/** One run of the organisations: each colour mark, its name beside it. */
function MarkList({ marks, copy }: { marks: Mark[]; copy?: boolean }) {
  return (
    <ul className="mt-list" aria-hidden={copy || undefined}>
      {marks.map((m) => (
        <li key={m.name} data-wordmark={m.wordmark || undefined}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={m.mark}
            alt={m.wordmark ? m.name : ''}
            width={32}
            height={32}
            loading="lazy"
            decoding="async"
          />
          {m.wordmark ? null : <span>{m.name}</span>}
        </li>
      ))}
    </ul>
  );
}

/**
 * A marquee of organisations, each its colour mark with its name written beside
 * it (as the AI curriculum's tools): two identical runs slide left by one run's
 * width, forever, pausing on hover; still and scrollable under reduced motion.
 * `tone`: `dark` for white names over a photo or film, `light` for the page.
 * Marks are square images (public/logos/marks), shown on white tiles.
 */
export function MarkTicker({
  marks,
  label,
  tone = 'light',
  className,
}: {
  marks: Mark[];
  label: string;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  return (
    <div className={`mt ${className ?? ''}`} data-tone={tone} role="group" aria-label={label}>
      <div className="mt-track">
        <MarkList marks={marks} />
        <MarkList marks={marks} copy />
      </div>
    </div>
  );
}
