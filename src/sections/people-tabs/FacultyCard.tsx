'use client';

import * as React from 'react';

import type { ShowcasePerson } from '@/sections/faculty/PeopleShowcase';
import './faculty-card.css';

/** The card's design width in px (faculty-card.css sizes it 480 x 320, as the alumni card). */
const CARD_WIDTH = 480;

/**
 * Faculty card (the team's mock, 2026-10-13): the portrait at the left on a dark ground, and at the
 * right the course they teach in large type, "by" the name, a hairline, their credentials, and
 * their company's logo on a white tile. One fixed 480 x 320 design scaled to its slot, as
 * `AlumniCard` is, so a phone shows the web card, smaller.
 */
export function FacultyCard({
  person: p,
  course,
  credentials,
  priority = false,
}: {
  person: ShowcasePerson;
  course: string;
  credentials: string;
  priority?: boolean;
}) {
  const ref = React.useRef<HTMLElement>(null);

  React.useLayoutEffect(() => {
    const el = ref.current;
    const slot = el?.parentElement;
    if (!el || !slot) return;
    const fit = () => el.style.setProperty('--fc-scale', String(slot.clientWidth / CARD_WIDTH));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(slot);
    return () => ro.disconnect();
  }, []);

  return (
    <article ref={ref} className="fc-card" data-brand="ssb" data-theme="dark">
      <img
        className="fc-card__photo"
        src={p.image}
        alt=""
        width={640}
        height={800}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
      />
      <div className="fc-card__body">
        <h3 className="fc-card__course">{course}</h3>
        <p className="fc-card__by">by {p.name}</p>
        <hr className="fc-card__rule" />
        <p className="fc-card__credentials">{credentials}</p>
        {p.logo ? (
          <span className="fc-card__logo">
            <img src={p.logo.src} alt={p.logo.name} loading="lazy" />
          </span>
        ) : null}
      </div>
    </article>
  );
}
