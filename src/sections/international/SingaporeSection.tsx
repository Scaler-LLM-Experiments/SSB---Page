'use client';

import * as React from 'react';
import { Container, Heading, Section, Text } from '@kishanscaler/ssx-ui';
import { Airplane, CaretLeft, CaretRight, ChalkboardTeacher, Buildings, Presentation, MapPin, Sparkle, type Icon } from '@phosphor-icons/react';

import { immersion } from '@/content/immersion';
import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';
import './singapore.css';

const PILLAR_ICONS: Record<string, Icon> = { faculty: ChalkboardTeacher, visit: Buildings, jury: Presentation, culture: Sparkle };
const KIND_ICONS: Record<string, Icon> = { Class: ChalkboardTeacher, Visit: Buildings, Culture: Sparkle, Pitch: Presentation, Travel: Airplane };

/**
 * International Immersion, a week in Singapore (the team's brief, 2026-10-23: immersive, premium,
 * not long; big photos as Built at SSB's). One stage, a day to a frame: the day's photo full-bleed,
 * settling from a slight zoom as it crossfades in; over it, the day's number large, its title, where
 * it happens, and its morning and afternoon. The seven days are a rail at the stage's foot (a tab to
 * each), with arrows; a swipe on touch. Nothing moves on its own. Under the stage, the brief's four
 * points as a quiet row. Reduced motion: the photos swap without the zoom or the fade.
 */
export function SingaporeSection() {
  const c = immersion;
  const n = c.days.length;
  const ref = React.useRef<HTMLElement>(null);
  const railRef = React.useRef<HTMLDivElement>(null);
  const tabs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const [day, setDay] = React.useState(0);
  useSectionEntrance(ref, { decks: ['.sg-pillar'] });

  const go = (i: number) => setDay(Math.max(0, Math.min(n - 1, i)));

  // keep the chosen day's tab in view on a phone (the rail only, never the page)
  React.useEffect(() => {
    const t = tabs.current[day];
    const row = railRef.current;
    if (t && row && row.scrollWidth > row.clientWidth) row.scrollTo({ left: t.offsetLeft - (row.clientWidth - t.offsetWidth) / 2, behavior: 'smooth' });
  }, [day]);

  const onKey = (e: React.KeyboardEvent) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = Math.max(0, Math.min(n - 1, day + d));
    go(next);
    tabs.current[next]?.focus();
  };

  // a sideways swipe moves a day
  const start = React.useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, a')) return;
    start.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const s = start.current;
    start.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - s.y)) go(day + (dx < 0 ? 1 : -1));
  };

  const d = c.days[day];

  return (
    <Section ref={ref} id="singapore" density="roomy" aria-labelledby="sg-title" className="sg-sec">
      <Container>
        <div data-enter="header" className="sg-head">
          <Heading as="p" size="eyebrow" className="text-content-brand" data-enter="eyebrow">
            {c.eyebrow}
          </Heading>
          <Heading as="h2" size="display" id="sg-title" data-enter="headline" className="sg-title">
            {c.title} <span>{c.titleTail}</span>
          </Heading>
          <Text size="lg" tone="secondary" data-enter="sub">
            {c.sub}
          </Text>
        </div>

        <div className="sg-stage" aria-roledescription="carousel" aria-label="The week in Singapore, day by day" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
          {/* every day's photo stacked; the chosen one fades up over the rest */}
          {c.days.map((x, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={x.image.src}
              className="sg-img"
              data-on={i === day || undefined}
              src={x.image.src}
              alt={i === day ? x.image.alt : ''}
              aria-hidden={i === day ? undefined : true}
              loading={i < 2 ? 'eager' : 'lazy'}
              decoding="async"
              draggable={false}
              style={{ objectPosition: x.image.position }}
            />
          ))}
          <div className="sg-shade" aria-hidden="true" />

          {/* the day: keyed, so its copy rises in afresh with each day */}
          <div key={day} className="sg-day" id="sg-panel" role="tabpanel" aria-labelledby={`sg-tab-${day}`}>
            <p className="sg-num" aria-hidden="true">
              <span>Day</span>
              {String(day + 1).padStart(2, '0')}
            </p>
            <h3 className="sg-day-title">
              <span className="sg-sr">Day {day + 1}: </span>
              {d.title}
            </h3>
            <p className="sg-place">
              <MapPin weight="fill" aria-hidden="true" />
              {d.place}
            </p>
            <ul className="sg-slots">
              {d.slots.map((s, i) => {
                const I = KIND_ICONS[s.kind];
                return (
                  <li key={s.text}>
                    <span className="sg-when">{d.slots.length > 1 ? (i === 0 ? 'Morning' : 'Afternoon') : 'All day'}</span>
                    <span className="sg-what">
                      <I weight="regular" aria-hidden="true" />
                      {s.text}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <p className="sg-credit">Photo: {d.image.credit}</p>

          {/* the week: a tab to each day, arrows either side */}
          <div className="sg-bar">
            <button type="button" className="sg-arrow" aria-label="Previous day" disabled={day === 0} onClick={() => go(day - 1)}>
              <CaretLeft weight="bold" aria-hidden="true" />
            </button>
            <div ref={railRef} className="sg-rail" role="tablist" aria-label="Days" onKeyDown={onKey}>
              {c.days.map((x, i) => (
                <button
                  key={x.label}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`sg-tab-${i}`}
                  aria-controls="sg-panel"
                  aria-selected={i === day}
                  tabIndex={i === day ? 0 : -1}
                  className="sg-tab"
                  onClick={() => go(i)}
                >
                  <span className="sg-tab-n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="sg-tab-l">{x.label}</span>
                </button>
              ))}
            </div>
            <button type="button" className="sg-arrow" aria-label="Next day" disabled={day === n - 1} onClick={() => go(day + 1)}>
              <CaretRight weight="bold" aria-hidden="true" />
            </button>
          </div>
        </div>

        <ul className="sg-pillars">
          {c.pillars.map((p) => {
            const I = PILLAR_ICONS[p.icon];
            return (
              <li key={p.title} className="sg-pillar">
                <I weight="regular" aria-hidden="true" data-part="title" />
                <div>
                  <p className="sg-pillar-t" data-part="title">{p.title}</p>
                  <p className="sg-pillar-x" data-part="description">{p.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
        <Text size="sm" tone="secondary" className="sg-note">
          {c.note}
        </Text>
      </Container>
    </Section>
  );
}
