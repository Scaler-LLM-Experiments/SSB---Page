import { Button, ButtonIcon, Container, Logo } from '@kishanscaler/ssx-ui';
import { ArrowUpRight } from '@phosphor-icons/react/ssr';
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
        <Logo />
        <Button asChild>
          <a href={cta.href}>
            {cta.label}
            <ButtonIcon>
              <ArrowUpRight />
            </ButtonIcon>
          </a>
        </Button>
      </Container>
    </header>
  );
}
