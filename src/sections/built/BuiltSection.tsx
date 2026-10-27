'use client';

import * as React from 'react';
import { Container, Heading, Section } from '@kishanscaler/ssx-ui';

import { builtAtSsb, type BuiltCompany } from '@/content/community';
import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';
import './built.css';

/** How long a company holds before the stage moves on (the concept site's 6.5s). */
const DWELL_S = 6.5;

/**
 * "Built at SSB" (the concept site's /v4 section, 2026-10-23; the team's pick, in place of Beyond
 * Placements' card rows), on the light page: the turn as the title, then one photo stage, a company
 * to a slide. Over each photo: the sector, the company, one line on what was built, and its figure
 * (top right on desktop, over the tab bar at the left below 900px). A glass tab bar at the
 * stage's foot names the companies; the white pill slides to the one on show, and fills in mint as
 * its time runs, then the stage moves on. It waits while pointed at, focused, or off
 * screen; arrows on the tabs, a swipe on touch. Reduced motion: no autoplay, no zoom, no slide.
 */
export function BuiltSection() {
  const c = builtAtSsb;
  const n = c.companies.length;
  const sectionRef = React.useRef<HTMLElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const tabsRef = React.useRef<HTMLDivElement>(null);
  const tabEls = React.useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = React.useState(0);
  const [held, setHeld] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [reduced, setReduced] = React.useState(false);
  const [ind, setInd] = React.useState<{ x: number; w: number } | null>(null);
  useSectionEntrance(sectionRef, { decks: [] });

  const go = React.useCallback((i: number) => {
    setActive(((i % n) + n) % n);
  }, [n]);

  // off screen, reduced motion
  React.useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const el = stageRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // the pill under the active tab, and that tab kept in view in the bar (the bar only, never the page)
  React.useLayoutEffect(() => {
    const measure = () => {
      const t = tabEls.current[active];
      if (t) setInd({ x: t.offsetLeft, w: t.offsetWidth });
    };
    measure();
    const t = tabEls.current[active];
    const row = tabsRef.current;
    if (t && row) row.scrollTo({ left: t.offsetLeft - (row.clientWidth - t.offsetWidth) / 2, behavior: reduced ? 'auto' : 'smooth' });
    const ro = row ? new ResizeObserver(measure) : null;
    if (row && ro) ro.observe(row);
    return () => ro?.disconnect();
  }, [active, reduced]);

  // no autoplay (2026-10-23, the team's ask: nothing moves on its own); the tabs, arrows and swipe only
  const auto = false && !reduced && visible && !held;

  // a swipe on touch (or a drag with the mouse) moves a slide
  const drag = React.useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, a')) return;
    drag.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - d.y)) go(active + (dx < 0 ? 1 : -1));
  };

  const onTabKey = (e: React.KeyboardEvent) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = (active + d + n) % n;
    go(next);
    tabEls.current[next]?.focus();
  };

  return (
    <Section ref={sectionRef} id="built" density="roomy" aria-labelledby="bs-title" className="bs-sec">
      <Container>
        <div data-enter="header" className="bs-head">
          <Heading as="p" size="eyebrow" className="bs-eyebrow" data-enter="eyebrow">
            {c.eyebrow}
          </Heading>
          <Heading as="h2" size="display" id="bs-title" data-enter="headline" className="bs-title">
            {c.title} <span>{c.titleTail}</span>
          </Heading>
        </div>

        <div
          ref={stageRef}
          className="bs-stage"
          data-auto={auto || undefined}
          aria-roledescription="carousel"
          aria-label={c.label}
          style={{ '--bs-dur': `${DWELL_S}s` } as React.CSSProperties}
          onPointerEnter={(e) => e.pointerType === 'mouse' && setHeld(true)}
          onPointerLeave={() => setHeld(false)}
          onFocus={() => setHeld(true)}
          onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setHeld(false)}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          <div className="bs-track" style={{ transform: `translate3d(${-active * 100}%, 0, 0)` }}>
            {c.companies.map((co, i) => (
              <Slide key={co.company} co={co} i={i} active={i === active} />
            ))}
          </div>

          <div className="bs-bar">
            <div ref={tabsRef} className="bs-tabs" role="tablist" aria-label="Choose a company" onKeyDown={onTabKey}>
              {ind ? (
                <span className="bs-ind" aria-hidden="true" style={{ width: ind.w, transform: `translateX(${ind.x}px)` }}>
                  {/* keyed by the slide: the fill restarts with each one; its end moves the stage on */}
                  <span key={active} className="bs-fill" onAnimationEnd={() => go(active + 1)} />
                </span>
              ) : null}
              {c.companies.map((co, i) => (
                <button
                  key={co.company}
                  ref={(el) => {
                    tabEls.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`bs-t${i}`}
                  aria-controls={`bs-p${i}`}
                  aria-selected={i === active}
                  tabIndex={i === active ? 0 : -1}
                  className="bs-tab"
                  onClick={() => go(i)}
                >
                  {co.company}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

// (2026-10-27, the user's ask) the pulsing hotspot and its note removed from every card
function Slide({ co, i, active }: { co: BuiltCompany; i: number; active: boolean }) {
  return (
    <article
      className="bs-slide"
      data-active={active || undefined}
      id={`bs-p${i}`}
      role="tabpanel"
      aria-labelledby={`bs-t${i}`}
      aria-hidden={!active}
      inert={!active || undefined}
      style={{ '--bs-top': co.topShade } as React.CSSProperties}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="bs-img"
        src={co.image.src}
        alt={co.image.alt}
        width={co.image.width}
        height={co.image.height}
        loading={i < 2 ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
        style={{ objectPosition: `${co.focus[0] * 100}% ${co.focus[1] * 100}%` }}
      />
      <div className="bs-top">
        <div className="bs-cap">
          <p className="bs-cap-k">
            <b>{String(i + 1).padStart(2, '0')}</b>
            {co.sector}
          </p>
          <h3 className="bs-cap-n">{co.company}</h3>
          {/* (2026-10-27, the user's ask) one line on what was built, in place of the founders' chip */}
          <p className="bs-blurb">{co.blurb}</p>
        </div>
      </div>
      {/* the figure at the card's foot, at the left, over the tab bar (2026-10-27, the user's ask) */}
      <div className="bs-met">
        <p className="bs-met-v">{co.stat.value}</p>
        <p className="bs-met-l">{co.stat.label}</p>
      </div>

    </article>
  );
}
