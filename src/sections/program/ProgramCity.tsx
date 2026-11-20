'use client';

import * as React from 'react';
import { Button, Container, Heading, Section, Text } from '@kishanscaler/ssx-ui';
import {
  Briefcase,
  Buildings,
  DownloadSimple,
  ForkKnife,
  MapPin,
  RocketLaunch,
  Sparkle,
  Toolbox,
  Train,
  type Icon,
} from '@phosphor-icons/react';

import { programCity as c, type CityIcon } from '@/content/program';
import { Title } from '@/sections/shared/Title';
import '@/sections/deck/deck-global.css';
import './program.css';

const ICONS: Record<CityIcon, Icon> = {
  hub: RocketLaunch,
  company: Briefcase,
  spark: Sparkle,
  building: Buildings,
  tools: Toolbox,
  transport: Train,
  food: ForkKnife,
};

/**
 * Located in Bangalore (2026-11-13, the user's ask: "take the design from the main page"), on the main
 * page's week in Singapore (DeckGlobalImmersion, its classes in deck-global.css): at the left a photo
 * stage, the chosen place's photo with its copy at the foot over a blur and wash; at the right the
 * places as hairline rows, a tap each; under them the four comforts as hairline tiles; then the
 * actions. Phones: the places as chips above the photo, a sideways swipe moves one.
 */
export function ProgramCity() {
  const [i, setI] = React.useState(0);
  const n = c.places.length;
  const go = (k: number) => setI(Math.max(0, Math.min(n - 1, k)));
  const p = c.places[i];
  const railRef = React.useRef<HTMLOListElement>(null);

  React.useEffect(() => {
    const row = railRef.current;
    const t = row?.children[i] as HTMLElement | undefined;
    if (row && t && row.scrollWidth > row.clientWidth) row.scrollTo({ left: t.offsetLeft - (row.clientWidth - t.offsetWidth) / 2, behavior: 'smooth' });
  }, [i]);

  const start = React.useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    start.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const s0 = start.current;
    start.current = null;
    if (!s0) return;
    const dx = e.clientX - s0.x;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - s0.y)) go(i + (dx < 0 ? 1 : -1));
  };

  return (
    <Section id="city" density="roomy" aria-labelledby="city-title" className="dkg pgy">
      <Container>
        <div className="pg-head">
          <Heading as="p" size="eyebrow" className="text-content-brand">
            {c.eyebrow}
          </Heading>
          <Heading as="h2" size="display" id="city-title">
            <Title text={c.title} />
          </Heading>
          <Text size="lg" tone="secondary">
            {c.sub}
          </Text>
        </div>

        <div className="dkg-grid">
          <div className="dkg-stage" data-blur={p.blur} id="pgy-panel" role="tabpanel" aria-labelledby={`pgy-tab-${i}`} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
            {c.places.map((x, k) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={x.image.src}
                className="dkg-img"
                data-on={k === i || undefined}
                src={x.image.src}
                alt={k === i ? x.image.alt : ''}
                aria-hidden={k === i ? undefined : true}
                loading="lazy"
                decoding="async"
                style={{ objectPosition: x.image.position }}
              />
            ))}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={`blur-${i}`}
              className="dkg-img dkg-img-blur"
              data-on=""
              src={p.image.src}
              alt=""
              aria-hidden="true"
              decoding="async"
              style={{ objectPosition: p.image.position }}
            />
            <span className="dkg-shade" aria-hidden="true" />
            <div key={i} className="dkg-copy">
              <p className="dkg-chip">
                <MapPin weight="fill" aria-hidden="true" />
                {p.chip}
              </p>
              <h3 className="dkg-day-title">{p.title}</h3>
              <ul className="dkg-slots">
                {p.points.map((s) => {
                  const I = ICONS[s.icon];
                  return (
                    <li key={s.text} className="pgy-slot">
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

          <ol ref={railRef} className="dkg-days" role="tablist" aria-label="Bangalore and the campus">
            {c.places.map((x, k) => (
              <li key={x.label}>
                <button
                  type="button"
                  role="tab"
                  id={`pgy-tab-${k}`}
                  aria-controls="pgy-panel"
                  aria-selected={k === i}
                  className="dkg-day"
                  onClick={() => go(k)}
                >
                  <span className="dkg-day-n">{String(k + 1).padStart(2, '0')}</span>
                  <span className="dkg-day-text">
                    <b>{x.label}</b>
                    <span>{x.title}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <ul className="dkg-pillars" aria-label={c.pillarsLabel}>
          {c.pillars.map((x) => {
            const I = ICONS[x.icon];
            return (
              <li key={x.title} className="dkg-pillar">
                <I weight="regular" aria-hidden="true" />
                <p className="dkg-pillar-t">{x.title}</p>
                <p className="dkg-pillar-x">{x.text}</p>
              </li>
            );
          })}
        </ul>

        <div className="pgy-actions" data-brand="ssb" data-theme="light">
          <Button asChild size="lg" variant="primary">
            <a href={c.ctas.brochure.href}>
              {c.ctas.brochure.label}
              <DownloadSimple weight="bold" aria-hidden="true" />
            </a>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <a href={c.ctas.locate.href} target="_blank" rel="noreferrer">
              <MapPin weight="bold" aria-hidden="true" />
              {c.ctas.locate.label}
            </a>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
