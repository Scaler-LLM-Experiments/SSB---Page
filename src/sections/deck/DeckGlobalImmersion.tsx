'use client';

import * as React from 'react';
import { Container, Heading, Section, Text } from '@kishanscaler/ssx-ui';
import { Airplane, Buildings, ChalkboardTeacher, MapPin, Presentation, Sparkle, type Icon } from '@phosphor-icons/react';

import { immersion } from '@/content/immersion';
import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';
import { Title } from '@/sections/shared/Title';
import './deck-global.css';

const PILLAR_ICONS: Record<string, Icon> = { faculty: ChalkboardTeacher, visit: Buildings, jury: Presentation, culture: Sparkle };
const KIND_ICONS: Record<string, Icon> = { Class: ChalkboardTeacher, Visit: Buildings, Culture: Sparkle, Pitch: Presentation, Travel: Airplane };

/**
 * The global immersion, a week in Singapore, back on the deck pages after the third USP (2026-10-28, the
 * user's ask: "we forgot the global immersion from vFinal; redesign it premium, in our style"). vFinal's
 * content (content/immersion.ts) in the page's own vocabulary: at the left a photo stage, the chosen day's
 * photo with its copy at the foot over the closing banner's blur and charcoal wash; at the right the
 * week as an itinerary, hairline rows a tap each; under them the four pillars as placement's hairline
 * tiles. Nothing moves on its own; the photos crossfade as the day changes (not under reduced motion).
 * On a phone the days are a row of chips above the photo, and a sideways swipe on the photo moves a day.
 */
export function DeckGlobalImmersion() {
  const c = immersion;
  const ref = React.useRef<HTMLElement>(null);
  const [day, setDay] = React.useState(0);
  const railRef = React.useRef<HTMLOListElement>(null);
  useSectionEntrance(ref, { decks: ['.dkg-pillar'] });
  const n = c.days.length;
  const go = (i: number) => setDay(Math.max(0, Math.min(n - 1, i)));
  const d = c.days[day];

  // phones: the days are a row of chips; keep the chosen one in view (the row only, never the page)
  React.useEffect(() => {
    const row = railRef.current;
    const t = row?.children[day] as HTMLElement | undefined;
    if (row && t && row.scrollWidth > row.clientWidth) row.scrollTo({ left: t.offsetLeft - (row.clientWidth - t.offsetWidth) / 2, behavior: 'smooth' });
  }, [day]);

  // a sideways swipe on the photo moves a day
  const start = React.useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    start.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const s0 = start.current;
    start.current = null;
    if (!s0) return;
    const dx = e.clientX - s0.x;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - s0.y)) go(day + (dx < 0 ? 1 : -1));
  };

  return (
    <Section ref={ref} id="global-immersion" density="roomy" aria-labelledby="dkg-title" className="dkg">
      <Container>
        <div data-enter="header" className="flex max-w-(--size-measure-max) flex-col gap-3">
          <Heading as="p" size="eyebrow" className="text-content-brand" data-enter="eyebrow">
            {/* the deck's own eyebrow (2026-10-28, the user's ask); vFinal keeps "International immersion" */}
            Global immersion
          </Heading>
          <Heading as="h2" size="display" id="dkg-title" data-enter="headline">
            <Title text={`${c.title}|${c.titleTail}`} />
          </Heading>
          <Text size="lg" tone="secondary" data-enter="sub">
            {c.sub}
          </Text>
        </div>

        <div className="dkg-grid">
          {/* the stage: every day's photo stacked, the chosen one faded up; its copy at the foot */}
          <div
            className="dkg-stage"
            id="dkg-panel"
            role="tabpanel"
            aria-labelledby={`dkg-tab-${day}`}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            {c.days.map((x, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={x.image.src}
                className="dkg-img"
                data-on={i === day || undefined}
                src={x.image.src}
                alt={i === day ? x.image.alt : ''}
                aria-hidden={i === day ? undefined : true}
                loading={i < 2 ? 'eager' : 'lazy'}
                decoding="async"
                style={{ objectPosition: x.image.position }}
              />
            ))}
            {/* the closing banner's blur: a copy of the day's photo, blurred, eased in from the foot under
                the copy, then the charcoal wash (deck-finale.css .dkc-photo-blur, .dkc-scrim) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={`blur-${day}`}
              className="dkg-img dkg-img-blur"
              data-on=""
              src={d.image.src}
              alt=""
              aria-hidden="true"
              decoding="async"
              style={{ objectPosition: d.image.position }}
            />
            <span className="dkg-shade" aria-hidden="true" />
            <p className="dkg-credit">Photo: {d.image.credit}</p>
            <div key={day} className="dkg-copy">
              <p className="dkg-chip">
                Day {String(day + 1).padStart(2, '0')}
                <span aria-hidden="true">·</span>
                <MapPin weight="fill" aria-hidden="true" />
                {d.place}
              </p>
              <h3 className="dkg-day-title">{d.title}</h3>
              <ul className="dkg-slots">
                {d.slots.map((s, i) => {
                  const I = KIND_ICONS[s.kind];
                  return (
                    <li key={s.text}>
                      <span className="dkg-when">{d.slots.length > 1 ? (i === 0 ? 'Morning' : 'Afternoon') : 'All day'}</span>
                      <span className="dkg-what">
                        <I weight="regular" aria-hidden="true" />
                        {s.text}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* the week: an itinerary, a row a day */}
          <ol ref={railRef} className="dkg-days" role="tablist" aria-label="The week in Singapore, day by day">
            {c.days.map((x, i) => (
              <li key={x.label}>
                <button
                  type="button"
                  role="tab"
                  id={`dkg-tab-${i}`}
                  aria-controls="dkg-panel"
                  aria-selected={i === day}
                  className="dkg-day"
                  onClick={() => go(i)}
                >
                  <span className="dkg-day-n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="dkg-day-text">
                    <b>{x.label}</b>
                    <span>{x.title}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <ul className="dkg-pillars">
          {c.pillars.map((p) => {
            const I = PILLAR_ICONS[p.icon];
            return (
              <li key={p.title} className="dkg-pillar">
                <I weight="regular" aria-hidden="true" data-part="title" />
                <p className="dkg-pillar-t" data-part="title">
                  {p.title}
                </p>
                <p className="dkg-pillar-x" data-part="description">
                  {p.text}
                </p>
              </li>
            );
          })}
        </ul>
        <Text size="sm" tone="secondary" className="dkg-note">
          {c.note}
        </Text>
      </Container>
    </Section>
  );
}
