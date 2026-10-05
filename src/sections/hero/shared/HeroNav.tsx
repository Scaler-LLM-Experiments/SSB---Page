import { Button, Container, Logo, LogoLoader } from '@kishanscaler/ssx-ui';
import { CtaIcon } from '../CtaIcon';
import type { HeroCta } from '../types';

/**
 * The page's sticky bar: the SSB logo and the primary action, so applying is
 * one tap away at any scroll depth (the page is for lead generation).
 *
 * Built from Container rather than the package's TopNav: TopNav's padding is
 * fixed for app bars, so its logo would not line up with the page's content
 * column. The line under it is the same token TopNav uses.
 *
 * `theme` pins the bar's theme (a dark hero starts it dark); the variation's
 * motion may switch it as the page scrolls past the hero.
 *
 * Hovering the logo plays the package's loading mark (`LogoLoader`: the shield
 * tracing and inking itself) in place of the static shield; the wordmark stays.
 * Needs `shared/hero.css`.
 */
export function HeroNav({ cta, theme }: { cta: HeroCta; theme?: 'light' | 'dark' }) {
  return (
    <header
      data-hero-nav
      data-brand={theme ? 'ssb' : undefined}
      data-theme={theme}
      className="sticky top-0 z-sticky border-b border-border-decorative bg-page"
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <span className="hero-nav-logo">
          <Logo />
          <LogoLoader decorative />
        </span>
        <Button asChild>
          <a href={cta.href}>
            {cta.label}
            <CtaIcon icon={cta.icon} />
          </a>
        </Button>
      </Container>
    </header>
  );
}
