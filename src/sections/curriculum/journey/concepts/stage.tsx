'use client';

import * as React from 'react';
import { ArrowRight } from '@phosphor-icons/react';

import { CarouselNav } from '@/sections/shared/CarouselNav';

import type { Journey } from '../data';
import { countSkills } from '../data';
import type { JourneyConfig } from '../config';
import { YearOverlay, useOpenYear } from './shared';
import './stage.css';

/** The terms' photos (the concept site's /v4), and their focal points. */
const PHOTO: Record<number, { src: string; pos: string }> = {
  1: { src: '/media/terms/t1.webp', pos: '50% 40%' },
  2: { src: '/media/terms/t2.jpg', pos: '50% 55%' },
  3: { src: '/media/terms/t3.webp', pos: '45% 40%' },
  4: { src: '/media/terms/t4.webp', pos: '50% 50%' },
  5: { src: '/media/terms/t5.webp', pos: '50% 50%' },
};
/** [CONFIRM] the cohort's dates, as the stack's: Term 1 Jan–Mar 2027, each term three months on. */
const MONTHS: Record<number, [string, string]> = {
  1: ['Jan – Mar 2027', 'Jan – Mar ’27'],
  2: ['Apr – Jun 2027', 'Apr – Jun ’27'],
  3: ['Jul – Sep 2027', 'Jul – Sep ’27'],
  4: ['Oct – Dec 2027', 'Oct – Dec ’27'],
  5: ['Jan – Mar 2028', 'Jan – Mar ’28'],
};

/**
 * The terms as the concept site's /v4 stage (2026-10-23, the team's pick), on the light page: the term
 * on show a wide white card (its photo at the left, then the term, its title, its line, its flagship
 * project, its counts and "See every course"); the other terms tall photo cards beside it, each opening
 * on a click. Arrows and a rail of segments under it; a swipe on touch; arrow keys. Nothing moves on
 * its own. "See every course" opens the curriculum's own sheet (YearOverlay). Phones: one card in
 * view, the others peeking at the side.
 */
export function StageJourney({ j, cfg, width, portal }: { j: Journey; cfg: JourneyConfig; width: number; portal?: HTMLElement | null }) {
  const years = j.years;
  const n = years.length;
  const [active, setActive] = React.useState(0);
  const { open, setOpen, close } = useOpenYear(null);
  const openYear = years.find((y) => y.year === open) ?? null;
  const stageRef = React.useRef<HTMLDivElement>(null);
  const [stageW, setStageW] = React.useState(0);
  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(() => setStageW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // the cards' sizes and places, as /v4 lays them out: the open card centred, the rest in a row beside it
  const phone = width > 0 && width < 700;
  const w = stageW || 1200;
  const onW = phone ? Math.min(w - 40, 350) : Math.min(922, Math.round(w * 0.66));
  // phones: as tall as the tallest term needs (the photo's band plus its copy), so no term's button is cut
  const [fitH, setFitH] = React.useState(0);
  const onH = phone ? Math.max(560, fitH) : 470;
  const offW = phone ? Math.round(onW * 0.78) : 300;
  const offH = phone ? Math.round(onH * 0.8) : 357;
  const gap = phone ? 12 : 16;
  const place = (i: number) => {
    if (i === active) return 0;
    const side = i > active ? 1 : -1;
    const steps = Math.abs(i - active) - 1;
    return side * (onW / 2 + gap + offW / 2 + steps * (offW + gap));
  };

  React.useLayoutEffect(() => {
    const el = stageRef.current;
    if (!phone || !el) return undefined;
    const measure = () => {
      const photo = el.querySelector<HTMLElement>('.st-photo');
      const band = photo ? photo.offsetHeight + parseFloat(getComputedStyle(photo).marginTop) * 2 : 0;
      const need = Math.max(0, ...Array.from(el.querySelectorAll<HTMLElement>('.st-info')).map((info) => info.scrollHeight));
      setFitH(Math.ceil(band + need));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [phone, stageW]);

  const go = (i: number) => setActive(Math.max(0, Math.min(n - 1, i)));
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1); }
  };
  const start = React.useRef<{ x: number; y: number } | null>(null);
  const onDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, a')) return;
    start.current = { x: e.clientX, y: e.clientY };
  };
  const onUp = (e: React.PointerEvent) => {
    const s = start.current;
    start.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - s.y)) go(active + (dx < 0 ? 1 : -1));
  };

  return (
    <div className="st">
      <div
        ref={stageRef}
        className="st-stage"
        style={{ height: onH }}
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label="Programme terms"
        onKeyDown={onKey}
        onPointerDown={onDown}
        onPointerUp={onUp}
      >
        {years.map((y, i) => {
          const on = i === active;
          const flagship = y.projects.find((p) => p.flagship);
          const courses = countSkills(y);
          const projects = y.projects.length;
          const classes = y.workshops?.length ?? 0;
          const photo = PHOTO[y.year];
          const [long, short] = MONTHS[y.year] ?? ['', ''];
          return (
            <article
              key={y.year}
              className="st-card"
              data-on={on || undefined}
              style={{ width: on ? onW : offW, height: on ? onH : offH, transform: `translate(-50%, -50%) translateX(${place(i)}px)`, zIndex: 10 - Math.abs(i - active) }}
            >
              <button
                type="button"
                className="st-face"
                tabIndex={on ? -1 : 0}
                aria-label={`Show Term ${y.year}, ${y.name}`}
                onClick={() => go(i)}
                style={{ backgroundImage: photo ? `url("${photo.src}")` : undefined, backgroundPosition: photo?.pos }}
              >
                <span className="st-fk">Term {String(y.year).padStart(2, '0')}</span>
                <span className="st-ft">{y.name}</span>
                <span className="st-fd">{long}</span>
              </button>
              <div className="st-full" aria-hidden={!on}>
                <div className="st-photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {photo ? <img src={photo.src} alt="" loading="lazy" draggable={false} style={{ objectPosition: photo.pos }} /> : null}
                  <span className="st-date">{short}</span>
                </div>
                <div className="st-info">
                  <p className="st-k">Term {String(y.year).padStart(2, '0')}</p>
                  <h3 className="st-title">{y.name}</h3>
                  <p className="st-sum">{y.description}</p>
                  {flagship ? (
                    <div className="st-flag">
                      <small>Flagship project</small>
                      <p>{flagship.video ?? flagship.title}</p>
                    </div>
                  ) : null}
                  <div className="st-stats">
                    {courses ? <span><b>{courses}</b>{courses === 1 ? 'course' : 'courses'}</span> : null}
                    {projects ? <span><b>{projects}</b>{projects === 1 ? 'live project' : 'live projects'}</span> : null}
                    {classes ? <span><b>{classes}</b>{classes === 1 ? 'masterclass' : 'masterclasses'}</span> : null}
                  </div>
                  <button type="button" className="st-more" tabIndex={on ? 0 : -1} onClick={() => setOpen(y.year)}>
                    See every course
                    <ArrowRight weight="bold" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* the page's carousel controls, as every other row's (2026-10-23, the team's ask) */}
      <CarouselNav
        className="st-ctrl"
        count={n}
        active={active}
        itemName="term"
        onSelect={go}
        onPrev={() => go(active - 1)}
        onNext={() => go(active + 1)}
        atStart={active === 0}
        atEnd={active === n - 1}
      />

      <YearOverlay y={openYear} mode={width > 0 && width < 768 ? 'sheet' : 'drawer'} cfg={cfg} portal={portal} id="st-sheet" onClose={close} />
    </div>
  );
}
