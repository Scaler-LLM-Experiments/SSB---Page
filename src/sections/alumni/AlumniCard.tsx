'use client';

import * as React from 'react';
import { BriefcaseIcon, CaretUpIcon } from '@phosphor-icons/react';

import type { Alumnus } from '@/content/alumni';

/** The card's design width in px (alumni.css sizes it 480 x 320). */
const CARD_WIDTH = 480;

/**
 * Alumni card: the photo full-bleed (the person on the left, a dark blur on
 * the right), and over the dark side the name, the role now in large type,
 * then the move: post SSB (company mark) above pre SSB (briefcase), joined by
 * a double arrow pointing up. Hovering the card sets the arrow climbing; on
 * touch screens, with no hover, it climbs while the card is on screen.
 *
 * It is one fixed 480 x 320 design, scaled to fit its slot, so a phone shows
 * the web card exactly, only smaller.
 *
 * data-part marks what the section entrance animates.
 */
export function AlumniCard({ alumnus: a, priority = false }: { alumnus: Alumnus; priority?: boolean }) {
  const ref = React.useRef<HTMLElement>(null);
  const [inView, setInView] = React.useState(false);

  // The card is one 480 x 320 design; scale it to its slot (the row's li).
  React.useLayoutEffect(() => {
    const el = ref.current;
    const slot = el?.parentElement;
    if (!el || !slot) return;
    const fit = () => el.style.setProperty('--alumni-scale', String(slot.clientWidth / CARD_WIDTH));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(slot);
    return () => ro.disconnect();
  }, []);

  // Touch screens only: climb while on screen (the CSS ignores this where hover exists).
  React.useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(hover: hover)').matches) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <article ref={ref} className="alumni-card" data-in-view={inView || undefined}>
      <img
        className="alumni-card__photo"
        src={`/alumni/${a.photo}.webp`}
        alt=""
        width={948}
        height={631}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        data-part="photo"
      />
      <div className="alumni-card__body" data-brand="ssb" data-theme="dark">
        <div className="flex flex-col gap-2">
          <p className="alumni-card__name" data-part="title">
            {a.name}
          </p>
          <h3 className="alumni-card__role" data-part="title">
            {a.role} at {a.company.name}
          </h3>
        </div>

        <div className="alumni-card__path" data-part="description">
          <div className="alumni-card__step">
            <span className="alumni-card__tile" data-fill={a.company.fill || undefined}>
              <img src={a.company.src} alt="" loading="lazy" />
            </span>
            <span>
              <span className="alumni-card__label">Post SSB</span>
              <span className="alumni-card__value">{a.company.name}</span>
            </span>
          </div>
          <span className="alumni-card__arrow" aria-hidden="true">
            <CaretUpIcon weight="bold" />
            <CaretUpIcon weight="bold" />
          </span>
          <div className="alumni-card__step">
            <span className="alumni-card__tile" data-pre="">
              <BriefcaseIcon />
            </span>
            <span>
              <span className="alumni-card__label">Pre SSB</span>
              <span className="alumni-card__value">{a.before}</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
