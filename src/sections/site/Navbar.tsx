/**
 * SSB navbar, after React Bits' Navbar 5: a full-width mega menu header.
 *   desktop  logo · mega menus · plain links · Download brochure (SSX outline
 *            secondary) + Apply now (SSX primary with its trailing icon well).
 *            A menu opens a full-width panel under the bar: grouped columns of
 *            icon + title + description, and a footer strip with a call to action.
 *            Opens on click (and on hover with a fine pointer); Esc, a click
 *            outside or moving to another menu closes it.
 *   m-web    logo · Apply now · a menu button; the panel lists the same groups
 *            as tap-to-open sections (SSX Accordion).
 * Sticky and transparent (the page blurs behind it); solid, with a hairline, while a menu is open.
 */
import * as React from 'react';
import { useDocTheme, type Theme } from './theme';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Button, ButtonIcon, Logo } from '@kishanscaler/ssx-ui';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Buildings,
  CaretDown,
  ChalkboardTeacher,
  ChartLineUp,
  Compass,
  DoorOpen,
  DownloadSimple,
  Flask,
  List,
  Moon,
  RocketLaunch,
  Sparkle,
  Sun,
  Target,
  UsersThree,
  X,
} from '@phosphor-icons/react';
import type { NavContent, NavIcon, NavMenu } from './navdata';
import { SSB_NAV } from './navdata';
import './navbar.css';

const ICON: Record<NavIcon, React.ComponentType<{ weight?: 'regular' | 'bold'; 'aria-hidden'?: boolean }>> = {
  chart: ChartLineUp,
  users: UsersThree,
  rocket: RocketLaunch,
  briefcase: Briefcase,
  target: Target,
  chalkboard: ChalkboardTeacher,
  book: BookOpen,
  sparkle: Sparkle,
  compass: Compass,
  buildings: Buildings,
  flask: Flask,
  door: DoorOpen,
};

function MegaPanel({ menu, id, onPick }: { menu: NavMenu; id: string; onPick: () => void }) {
  return (
    <div className="sn-panel" id={id} role="region" aria-label={menu.label}>
      <div className="sn-panel-inner">
        <div className="sn-groups">
          {menu.groups.map((g) => (
            <div key={g.title} className="sn-group">
              <p className="sn-group-title">{g.title}</p>
              <ul>
                {g.items.map((it) => {
                  const Icon = ICON[it.icon];
                  return (
                    <li key={it.title}>
                      <a className="sn-item" href={it.href} onClick={onPick}>
                        <span className="sn-item-icon">
                          <Icon weight="regular" aria-hidden />
                        </span>
                        <span className="sn-item-text">
                          <b>{it.title}</b>
                          <span>{it.desc}</span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="sn-panel-foot">
          <span>
            <b>{menu.footer.text}</b>
            <span>{menu.footer.sub}</span>
          </span>
          <a className="sn-foot-cta" href={menu.footer.cta.href} onClick={onPick}>
            {menu.footer.cta.label}
            <ArrowRight weight="bold" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}

const THEME_KEY = 'ssb-theme';
/** The saved or system theme, for the first paint. */
export function initialTheme(): Theme {
  try {
    const t = localStorage.getItem(THEME_KEY);
    if (t === 'light' || t === 'dark') return t;
  } catch {
    /* storage blocked */
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Light / dark switch. Controlled (`theme` + `onTheme`) when the page has its
 * own themed parts (the curriculum sets its own data-theme); otherwise it sets
 * data-theme on <html> itself. Either way the choice is remembered.
 */
function ThemeToggle({ theme, onTheme }: { theme?: Theme; onTheme?: (t: Theme) => void }) {
  const [own, setOwn] = React.useState<Theme>(() => theme ?? initialTheme());
  const t = theme ?? own;
  React.useEffect(() => {
    if (theme) return;
    document.documentElement.dataset.theme = own;
  }, [theme, own]);
  const flip = () => {
    const next: Theme = t === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* storage blocked */
    }
    if (onTheme) onTheme(next);
    else setOwn(next);
  };
  return (
    <button type="button" className="sn-theme" role="switch" aria-checked={t === 'dark'} aria-label="Dark mode" onClick={flip}>
      <span className="sn-theme-track" data-on={t === 'dark' || undefined}>
        <span className="sn-theme-knob">{t === 'dark' ? <Moon weight="fill" aria-hidden="true" /> : <Sun weight="fill" aria-hidden="true" />}</span>
      </span>
    </button>
  );
}

export function SsbNavbar({
  content = SSB_NAV,
  theme,
  onTheme,
  heroNav = false,
  themeToggle = true,
}: {
  content?: NavContent;
  theme?: Theme;
  onTheme?: (t: Theme) => void;
  /** The page's nav over a dark cinematic hero (the SSB home page): marked `data-hero-nav` so the
   * hero's motion can find it, and starting dark; the hero turns it light as the page turns white. */
  heroNav?: boolean;
  /** Hide the light / dark switch (a light page with a dark hero island has one theme). */
  themeToggle?: boolean;
}) {
  const [open, setOpen] = React.useState<number | null>(null);
  const [mobile, setMobile] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const root = React.useRef<HTMLElement>(null);
  const docTheme = useDocTheme();
  const base = React.useId();
  const hoverOK = typeof window !== 'undefined' && !!window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;
  const closeTimer = React.useRef(0);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(null);
        setMobile(false);
      }
    };
    const onDown = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(null);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
    };
  }, []);
  // the m-web panel holds the page still while it is open
  React.useEffect(() => {
    if (!mobile) return undefined;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [mobile]);

  const hoverOpen = (i: number) => () => {
    if (!hoverOK) return;
    window.clearTimeout(closeTimer.current);
    setOpen(i);
  };
  const hoverClose = () => {
    if (!hoverOK) return;
    closeTimer.current = window.setTimeout(() => setOpen(null), 160);
  };
  const pick = () => {
    setOpen(null);
    setMobile(false);
  };

  return (
    <header ref={root} className="sn" data-hero-nav={heroNav ? '' : undefined} data-brand="ssb" data-theme={heroNav ? 'dark' : theme ?? docTheme} data-scrolled={scrolled || undefined} data-open={open !== null || mobile || undefined} onPointerLeave={hoverClose}>
      <div className="sn-bar">
        <a className="sn-logo" href="#top" aria-label="Scaler School of Business, home">
          <Logo brand="ssb" size="md" decorative />
        </a>
        <nav className="sn-nav" aria-label="Main">
          <ul>
            {content.menus.map((m, i) => (
              <li key={m.label} onPointerEnter={hoverOpen(i)}>
                <button type="button" className="sn-trigger" aria-expanded={open === i} aria-controls={`${base}-m${i}`} onClick={() => setOpen(open === i ? null : i)}>
                  {m.label}
                  <CaretDown weight="bold" aria-hidden="true" />
                </button>
              </li>
            ))}
            {content.links.map((l) => (
              <li key={l.label} onPointerEnter={() => hoverOK && setOpen(null)}>
                <a className="sn-link" href={l.href}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sn-actions">
          {themeToggle ? <ThemeToggle theme={theme} onTheme={onTheme} /> : null}
          {/* the SSX buttons from the updated Storybook: outline secondary, and primary with its trailing icon well */}
          {content.secondary.icon === 'download' ? (
            <Button asChild variant="secondary" size="md" className="sn-secondary-btn">
              <a href={content.secondary.href}>
                <DownloadSimple weight="bold" aria-hidden="true" />
                {content.secondary.label}
              </a>
            </Button>
          ) : (
            <a className="sn-secondary" href={content.secondary.href}>
              {content.secondary.label}
            </a>
          )}
          <Button asChild variant="primary" size="md" className="sn-primary-btn">
            <a href={content.primary.href}>
              {content.primary.label}
              <ButtonIcon>
                <ArrowRight weight="bold" aria-hidden="true" />
              </ButtonIcon>
            </a>
          </Button>
          <button type="button" className="sn-burger" aria-expanded={mobile} aria-controls={`${base}-mobile`} aria-label={mobile ? content.closeLabel : content.menuLabel} onClick={() => setMobile((v) => !v)}>
            {mobile ? <X weight="bold" aria-hidden="true" /> : <List weight="bold" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* desktop mega panels (one open at a time) */}
      {content.menus.map((m, i) =>
        open === i ? (
          <div key={m.label} onPointerEnter={hoverOpen(i)}>
            <MegaPanel menu={m} id={`${base}-m${i}`} onPick={pick} />
          </div>
        ) : null,
      )}

      {/* m-web panel */}
      {mobile ? (
        <div className="sn-mobile" id={`${base}-mobile`}>
          {content.menus.length ? (
          <Accordion type="single" collapsible>
            {content.menus.map((m) => (
              <AccordionItem key={m.label} value={m.label}>
                <AccordionTrigger headingLevel="h2">{m.label}</AccordionTrigger>
                <AccordionContent>
                  {m.groups.map((g) => (
                    <div key={g.title} className="sn-mgroup">
                      <p className="sn-group-title">{g.title}</p>
                      <ul>
                        {g.items.map((it) => {
                          const Icon = ICON[it.icon];
                          return (
                            <li key={it.title}>
                              <a className="sn-item" href={it.href} onClick={pick}>
                                <span className="sn-item-icon">
                                  <Icon weight="regular" aria-hidden />
                                </span>
                                <span className="sn-item-text">
                                  <b>{it.title}</b>
                                  <span>{it.desc}</span>
                                </span>
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          ) : null}
          <ul className="sn-mlinks">
            {content.links.map((l) => (
              <li key={l.label}>
                <a href={l.href} onClick={pick}>
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href={content.secondary.href} onClick={pick}>
                {content.secondary.label}
              </a>
            </li>
          </ul>
          <Button asChild variant="primary" size="lg" className="sn-mcta">
            <a href={content.primary.href}>
              {content.primary.label}
              <ButtonIcon>
                <ArrowRight weight="bold" aria-hidden="true" />
              </ButtonIcon>
            </a>
          </Button>
        </div>
      ) : null}
    </header>
  );
}
