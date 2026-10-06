'use client';

/**
 * The curriculum's later sections behind one navigation (after Sarvam's product page): a short
 * list at the left that stays put (Learn by doing, Career prep, AI journey, Live projects, Internship, Immersions) while the
 * sections scroll past at the right, each in the narrower column. The item for the section on
 * screen is marked; clicking one scrolls to it.
 *
 * Below desktop there is no room for a side column: the sections run full width as before and the
 * list becomes a floating pill at the foot of the window (the people tabs' form), for this block
 * only (sticky, held inside the block).
 */
import * as React from 'react';
import { BriefcaseIcon, FactoryIcon, RocketLaunchIcon, HandshakeIcon, IdentificationBadgeIcon, SparkleIcon } from '@phosphor-icons/react';

import './curriculum-rail.css';

const ICONS = { career: BriefcaseIcon, ai: SparkleIcon, projects: HandshakeIcon, internship: IdentificationBadgeIcon, immersions: FactoryIcon, learn: RocketLaunchIcon };

export type RailSection = { id: string; label: string; icon: keyof typeof ICONS; node: React.ReactNode };

export function CurriculumRail({ sections }: { sections: RailSection[] }) {
  const [active, setActive] = React.useState(0);
  const main = React.useRef<HTMLDivElement>(null);

  // the section on screen: the last one whose head has passed 40% of the window's height
  React.useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const items = main.current?.querySelectorAll<HTMLElement>(':scope > [data-rail-section]');
      if (!items) return;
      const line = window.innerHeight * 0.4;
      let now = 0;
      items.forEach((el, i) => {
        if (el.getBoundingClientRect().top <= line) now = i;
      });
      setActive(now);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, []);

  const go = (id: string) => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <div className="cr">
      {/* (the sections first in the markup, so on small screens the list can stick to the window's foot) */}
      <div ref={main} className="cr-main">
        {sections.map((s) => (
          <div key={s.id} id={s.id} data-rail-section className="cr-section">
            {s.node}
          </div>
        ))}
      </div>
      <nav className="cr-nav" aria-label="Curriculum sections">
        <ul className="cr-list">
          {sections.map((s, i) => {
            const Icon = ICONS[s.icon];
            return (
              <li key={s.id}>
                <button type="button" className="cr-item" aria-current={i === active ? 'true' : undefined} onClick={() => go(s.id)}>
                  <Icon weight={i === active ? 'fill' : 'regular'} aria-hidden="true" />
                  {s.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
