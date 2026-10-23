'use client';

import * as React from 'react';

import { brandMark } from '@/content/brand-marks';
import { brandTile } from '@/content/brand-tiles';
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
  /** The course they teach (faculty). Unset (mentors, 2026-10-23): their name leads the card instead. */
  course?: string;
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
        <h3 className="fc-card__course">{course ?? p.name}</h3>
        {course ? <p className="fc-card__by">by {p.name}</p> : null}
        <hr className="fc-card__rule" />
        <p className="fc-card__credentials">{credentials}</p>
        {p.logo?.src && brandMark(p.logo.src) ? (
          // the company as its mark in a box and its name beside it (2026-10-23, the team's ask)
          <span className="fc-card__co">
            {/* data-inset: a mark on a ground (not its own full square) sits a little in from the edge */}
            <span className="fc-card__mark" data-inset={brandMark(p.logo.src)!.bg ? '' : undefined} style={{ background: brandMark(p.logo.src)!.bg }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={brandMark(p.logo.src)!.src} alt="" loading="lazy" decoding="async" />
            </span>
            <span className="fc-card__co-name">{p.logo.name}</span>
          </span>
        ) : p.logo?.src ? (
          // no mark yet: the wordmark on its brand's tile (2026-10-13)
          <span className="fc-card__logo" style={{ background: brandTile(p.logo.src!).bg }}>
            <img src={brandTile(p.logo.src!).src} alt={p.logo.name} loading="lazy" data-white={brandTile(p.logo.src!).white || undefined} />
          </span>
        ) : null}
      </div>
    </article>
  );
}
