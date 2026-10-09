'use client';

import * as React from 'react';
import { Button } from '@kishanscaler/ssx-ui';
import { ArrowRight, BookOpen, Briefcase, Buildings, GraduationCap, Phone, PhoneCall, type Icon } from '@phosphor-icons/react';

import { bottomNav } from '@/content/bottom-nav';
import { SSB_FOOTER } from './data';
import './bottom-nav.css';

/** The section an item names: its `target` is the section's id, or an id inside it (its heading). */
const sectionOf = (target: string) => {
  const el = document.getElementById(target);
  return (el?.closest('section') as HTMLElement | null) ?? el;
};

/** The phone tabs' icons, in the order of `bottomNav.apply.tabs`. */
const TAB_ICONS: Icon[] = [GraduationCap, BookOpen, Briefcase, Buildings];


/**
 * The page's bottom navigation (the team's ask, 2026-10-08): a frosted bar at the foot of the window,
 * the page's main sections in it, the one being read marked in the brand's green (as the people
 * tabs mark theirs), and beside it, floating on its own, the call-back action (the design system's
 * primary Button; its label goes on a phone, its icon stays). A tap scrolls to the section, under
 * the navbar.
 *
 * It comes up once the hero has been scrolled past and goes again as the footer is uncovered (the
 * footer has the same actions); on a phone it also steps aside while the curriculum's own section
 * bar is on screen there. The section being read is the last whose top has passed 40% of the window.
 *
 * Phones (below 672px) get two pieces in its place (bottom-nav.css): a thin strip of the same
 * sections pinned under the navbar, and a sticky apply bar at the foot: Apply now
 * at full width over a row of icon tabs (links to the school's other pages on the live site),
 * with the call-back as a round button floating above it; shown and hidden as the
 * bar is.
 */
export function BottomNav() {
  const [shown, setShown] = React.useState(false);
  const [active, setActive] = React.useState(-1);
  // tablets: the bar steps aside while the curriculum's own bar is at the window's foot
  const [inRail, setInRail] = React.useState(false);
  const list = React.useRef<HTMLUListElement>(null);
  const strip = React.useRef<HTMLUListElement>(null);

  React.useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const first = sectionOf(bottomNav.items[0].target);
      const pastHero = first ? first.getBoundingClientRect().top < vh * 0.6 : window.scrollY > vh;
      // the footer is uncovered once the sheet the page lifts off it has risen above the window's foot
      const sheet = document.querySelector('.sf-lift');
      const footer = sheet ? sheet.getBoundingClientRect().bottom < vh - 24 : false;
      // phones: the curriculum's own bar sits at the window's foot while its section is on screen
      const rail = document.querySelector('.cr');
      const phone = window.matchMedia('(max-width: 1055px)').matches;
      const inRail = phone && rail ? (() => { const b = rail.getBoundingClientRect(); return b.top < vh && b.bottom > vh * 0.5; })() : false;
      setShown(pastHero && !footer);
      // phones: the strip sits flush under the navbar, at its measured foot (its height on a phone
      // isn't the --sn-h token's, which left a gap)
      const bar = document.querySelector('header.sn');
      const strip = document.querySelector<HTMLElement>('.bn-strip');
      if (bar && strip) strip.style.setProperty('--bn-top', `${Math.max(0, Math.round(bar.getBoundingClientRect().bottom))}px`);
      // and the two read as one bar: while the strip is up on a phone, the navbar's frosted layer runs
      // down behind it (bottom-nav.css), so the page sees one surface, one edge
      const combined = pastHero && !footer && !!strip && getComputedStyle(strip).display !== 'none';
      document.documentElement.toggleAttribute('data-bn-strip', combined);
      if (strip) document.documentElement.style.setProperty('--bn-strip-h', `${Math.round(strip.getBoundingClientRect().height)}px`);
      // phones: the apply bar's height, for what stands above it (the call-back, the curriculum's bar)
      const apply = document.querySelector('.bn-apply');
      if (apply) document.documentElement.style.setProperty('--bn-apply-h', `${Math.round(apply.getBoundingClientRect().height)}px`);
      setInRail(inRail);
      let at = -1;
      bottomNav.items.forEach((item, i) => {
        const s = sectionOf(item.target);
        if (s && s.getBoundingClientRect().top <= vh * 0.4) at = i;
      });
      setActive(at);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.removeAttribute('data-bn-strip');
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, []);

  // keep the item being read in view in the bar (it scrolls sideways on a phone): the bar's own scroll only
  React.useEffect(() => {
    for (const ul of [list.current, strip.current]) {
      const li = active >= 0 ? (ul?.children[active] as HTMLElement | undefined) : undefined;
      if (ul && li && ul.scrollWidth > ul.clientWidth) ul.scrollTo({ left: li.offsetLeft - (ul.clientWidth - li.offsetWidth) / 2, behavior: 'smooth' });
    }
  }, [active]);

  const go = (e: React.MouseEvent, target: string) => {
    const s = sectionOf(target);
    if (!s) return;
    e.preventDefault();
    // under the navbar, and on a phone under the section strip too
    const strip = document.querySelector('.bn-strip');
    const stripH = strip && getComputedStyle(strip).display !== 'none' ? strip.getBoundingClientRect().height : 0;
    const nav = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sn-h')) || 69) + stripH;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: s.getBoundingClientRect().top + window.scrollY - nav + 1, behavior: still ? 'auto' : 'smooth' });
  };

  return (
    <>
      {/* desktop and tablet: the bar and the call-back */}
      <div className="bn" data-shown={(shown && !inRail) || undefined} data-brand="ssb" data-theme="light">
        <nav className="bn-bar" aria-label={bottomNav.label}>
          <ul ref={list} className="bn-list">
          {bottomNav.items.map((item, i) => (
            <li key={item.target}>
              <a
                className="bn-item"
                href={`#${item.target}`}
                aria-current={i === active ? 'true' : undefined}
                onClick={(e) => go(e, item.target)}
                tabIndex={shown ? undefined : -1}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        </nav>
        <Button asChild variant="primary" size="md" className="bn-cta">
          <a href={bottomNav.callback.href} aria-label={bottomNav.callback.label} tabIndex={shown ? undefined : -1}>
            <Phone weight="fill" aria-hidden="true" />
            <span className="bn-cta-label">{bottomNav.callback.label}</span>
          </a>
        </Button>
      </div>

      {/* phones: a thin strip of the sections under the navbar */}
      <nav className="bn-strip" data-shown={shown || undefined} aria-label={bottomNav.label} data-brand="ssb" data-theme="light">
        <ul ref={strip} className="bn-strip-list">
          {bottomNav.items.map((item, i) => (
            <li key={item.target}>
              <a
                className="bn-item"
                href={`#${item.target}`}
                aria-current={i === active ? 'true' : undefined}
                onClick={(e) => go(e, item.target)}
                tabIndex={shown ? undefined : -1}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* phones: the call-back, a rounded-square button floating above the apply bar */}
      <a
        className="bn-call"
        href={bottomNav.callback.href}
        aria-label={bottomNav.callback.label}
        data-shown={shown || undefined}
        data-brand="ssb"
        data-theme="light"
        tabIndex={shown ? undefined : -1}
      >
        <PhoneCall weight="regular" aria-hidden="true" />
      </a>

      {/* phones: the sticky apply bar, Apply now over the icon tabs */}
      <div className="bn-apply" data-shown={shown || undefined} data-brand="ssb" data-theme="light">
        <Button asChild variant="primary" size="md" className="bn-apply-btn">
          <a href={SSB_FOOTER.cta.primary.href} tabIndex={shown ? undefined : -1}>
            {bottomNav.apply.label}
            <ArrowRight weight="bold" aria-hidden="true" />
          </a>
        </Button>
        <nav aria-label={bottomNav.label}>
          <ul className="bn-tabs">
            {bottomNav.apply.tabs.map((tab, i) => {
              const TabIcon = TAB_ICONS[i];
              return (
                <li key={tab.href}>
                  <a className="bn-tab" href={tab.href} tabIndex={shown ? undefined : -1}>
                    <TabIcon weight="regular" aria-hidden="true" />
                    <span>{tab.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
