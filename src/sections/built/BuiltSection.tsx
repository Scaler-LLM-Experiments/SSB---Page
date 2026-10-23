'use client';

import * as React from 'react';
import { Container, Heading, Section } from '@kishanscaler/ssx-ui';
import { ArrowRight, X } from '@phosphor-icons/react';

import { builtAtSsb, type BuiltCompany } from '@/content/community';
import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';
import './built.css';

/** How long a company holds before the stage moves on (the concept site's 6.5s). */
const DWELL_S = 6.5;

/**
 * "Built at SSB" (the concept site's /v4 section, 2026-10-23; the team's pick, in place of Beyond
 * Placements' card rows), on the light page: the turn as the title, then one photo stage, a company
 * to a slide. Over each photo: the sector, the company, its founders on a glass chip with "Read
 * story", and its figure at the right; a dot on the photo opens a note. A glass tab bar at the
 * stage's foot names the companies; the white pill slides to the one on show, and fills in mint as
 * its time runs, then the stage moves on. It waits while pointed at, focused, a note is open, or off
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
  const [open, setOpen] = React.useState<number | null>(null);
  const [held, setHeld] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [reduced, setReduced] = React.useState(false);
  const [ind, setInd] = React.useState<{ x: number; w: number } | null>(null);
  const [size, setSize] = React.useState<{ w: number; h: number } | null>(null);
  useSectionEntrance(sectionRef, { decks: [] });

  const go = React.useCallback((i: number) => {
    setOpen(null);
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

  // the stage's size, for placing the hotspots on the covered photo
  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
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
  const auto = false && !reduced && visible && !held && open === null;

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
              <Slide
                key={co.company}
                co={co}
                i={i}
                active={i === active}
                size={size}
                open={open === i}
                onToggle={() => setOpen(open === i ? null : i)}
              />
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

function Slide({
  co,
  i,
  active,
  size,
  open,
  onToggle,
}: {
  co: BuiltCompany;
  i: number;
  active: boolean;
  size: { w: number; h: number } | null;
  open: boolean;
  onToggle: () => void;
}) {
  // where the hotspot falls on the photo as `object-fit: cover` draws it in the stage
  const spot = React.useMemo(() => {
    if (!size) return null;
    const { width: iw, height: ih } = co.image;
    const s = Math.max(size.w / iw, size.h / ih);
    const rw = iw * s;
    const rh = ih * s;
    const x = (size.w - rw) * co.focus[0] + co.hotspot.x * rw;
    const y = (size.h - rh) * co.focus[1] + co.hotspot.y * rh;
    // the note beside the dot, kept inside the stage
    const cw = Math.min(260, size.w - 32);
    const cx = Math.min(Math.max(16, x + 24), size.w - cw - 16);
    const cy = Math.min(Math.max(16, y - 20), size.h - 150);
    return { x, y, cx, cy, cw };
  }, [size, co]);

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
          <div className="bs-by">
            <span className="bs-av" aria-hidden="true">
              <span>{co.initials}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {co.avatar ? <img src={co.avatar} alt="" loading="lazy" decoding="async" /> : null}
            </span>
            <span className="bs-by-t">
              <b>{co.by}</b>
              <small>{co.role}</small>
            </span>
            <a className="bs-by-a" href={co.story}>
              Read story
              <ArrowRight weight="bold" aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="bs-met">
          <p className="bs-met-v">{co.stat.value}</p>
          <p className="bs-met-l">{co.stat.label}</p>
        </div>
      </div>

      {spot ? (
        <>
          <button
            type="button"
            className="bs-hs"
            style={{ left: spot.x, top: spot.y }}
            aria-expanded={open}
            aria-controls={`bs-c${i}`}
            aria-label={`${co.company}: ${co.hotspot.label}`}
            onClick={onToggle}
          >
            <span className="bs-hs-dot" />
          </button>
          <div className="bs-card" id={`bs-c${i}`} role="dialog" aria-label={co.hotspot.label} data-open={open || undefined} style={{ left: spot.cx, top: spot.cy, width: spot.cw }}>
            <p className="bs-card-k">{co.hotspot.label}</p>
            <p className="bs-card-t">{co.hotspot.text}</p>
            <button type="button" className="bs-card-x" aria-label="Close" onClick={onToggle}>
              <X weight="bold" aria-hidden="true" />
            </button>
          </div>
        </>
      ) : null}
    </article>
  );
}
