import * as React from 'react';
import { VisuallyHidden } from '@kishanscaler/ssx-ui';
import type { ResolvedLogo } from '@/lib/logos';

type LogoTickerProps = React.HTMLAttributes<HTMLDivElement> & {
  logos: ResolvedLogo[];
  /** Names the list for screen readers. */
  label: string;
};

/**
 * A continuous logo marquee. Every logo is drawn at one visual weight (sizes
 * from `resolveLogos`) and in one tone, so no brand colour competes with SSB's;
 * hovering one shows its own colours. Pauses on hover; still
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
        <li key={logo.name} className="hero-ticker-item flex h-12 shrink-0 items-center px-6">
          {logo.src ? (
            // A plain <img> at its display size, so it takes no layout shift as it
            // loads. Without known proportions: a fixed height, the width following
            // the artwork, capped so a long wordmark can't dominate.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logo.src}
              alt={copy ? '' : logo.name}
              width={logo.width}
              height={logo.height}
              decoding="async"
              className={`hero-ticker-logo object-contain ${logo.width ? '' : 'h-8 w-auto max-w-40'}`}
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
