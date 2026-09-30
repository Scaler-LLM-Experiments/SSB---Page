import * as React from 'react';
import { VisuallyHidden } from '@kishanscaler/ssx-ui';
import type { ResolvedLogo } from '@/lib/logos';

type LogoTickerProps = React.HTMLAttributes<HTMLDivElement> & {
  logos: ResolvedLogo[];
  /** Names the list for screen readers. */
  label: string;
};

/**
 * A continuous logo marquee. Logos are set in one tone so no brand colour
 * competes with SSB's, and turn light on a dark theme. Pauses on hover; still
 * (and scrollable) under reduced motion. Needs `shared/hero.css`.
 */
export function LogoTicker({ logos, label, className, style, ...props }: LogoTickerProps) {
  const speed = {
    '--ticker-duration': `calc(var(--motion-duration-slowest) * ${logos.length * 8})`,
    ...style,
  } as React.CSSProperties;

  return (
    <div className={`hero-ticker w-full overflow-hidden ${className ?? ''}`} style={speed} {...props}>
      <div className="hero-ticker-track flex w-max">
        <LogoList logos={logos} label={label} />
        {/* The copy that makes the loop seamless. */}
        <LogoList logos={logos} copy />
      </div>
    </div>
  );
}

function LogoList({ logos, label, copy }: { logos: ResolvedLogo[]; label?: string; copy?: boolean }) {
  return (
    <ul aria-label={label} aria-hidden={copy || undefined} className="flex shrink-0 items-center">
      {logos.map((logo) => (
        <li key={logo.name} className="flex h-12 shrink-0 items-center px-8">
          {logo.src ? (
            // A plain <img>: remote logos of unknown aspect. Fixed height; the
            // width follows the artwork, capped so a long wordmark can't dominate.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo.src}
              alt={copy ? '' : logo.name}
              decoding="async"
              className="h-8 w-auto max-w-40 object-contain opacity-muted grayscale dark:invert"
            />
          ) : (
            <>
              <span aria-hidden="true" className="type-h3 whitespace-nowrap text-content-secondary">
                {logo.wordmark}
              </span>
              {copy ? null : <VisuallyHidden>{logo.name}</VisuallyHidden>}
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
