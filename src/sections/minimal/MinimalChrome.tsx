'use client';

import * as React from 'react';
import { Logo } from '@kishanscaler/ssx-ui';

import './minimal.css';

/** The minimal page's sections, as its top bar names them, and where each starts on this page. */
const LINKS = [
  { label: 'Placements', target: 'placements-showcase-title' },
  { label: 'Faculty', target: 'people' },
  { label: 'How you learn', target: 'dk-usp-title' },
  { label: 'Admissions', target: 'admissions' },
  { label: 'Campus', target: 'campus-title' },
];

const sectionOf = (id: string) => {
  const el = document.getElementById(id);
  return (el?.closest('section') as HTMLElement | null) ?? el;
};

/**
 * The minimal landing page's top bar (ssb-minimal.vercel.app/minimal-sudh, 2026-11-03, the user's
 * ask): sticky and frosted, the logo at the left, the five sections and a green Apply at the right;
 * the section being read is marked with a soft pill. A tap scrolls to the section under the bar.
 */
export function MinimalNav() {
  const [active, setActive] = React.useState(-1);
  const bar = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      let at = -1;
      LINKS.forEach((l, i) => {
        const s = sectionOf(l.target);
        if (s && s.getBoundingClientRect().top <= window.innerHeight * 0.35) at = i;
      });
      setActive(at);
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

  const go = (e: React.MouseEvent, target: string) => {
    const s = sectionOf(target);
    if (!s) return;
    e.preventDefault();
    // under the bar's foot: the bar's height and the announcement bar's over it (both stay at the top)
    const el = bar.current;
    const h = el ? (parseFloat(getComputedStyle(el).top) || 0) + el.offsetHeight : 64;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: s.getBoundingClientRect().top + window.scrollY - h, behavior: still ? 'auto' : 'smooth' });
  };

  return (
    <header ref={bar} className="mn" data-brand="ssb" data-theme="light">
      <div className="mn-bar">
        <a className="mn-logo" href="#top" aria-label="Scaler School of Business, home">
          <Logo brand="ssb" size="md" decorative />
        </a>
        <nav aria-label="Sections">
          <ul className="mn-links">
            {LINKS.map((l, i) => (
              <li key={l.target}>
                <a href={`#${l.target}`} aria-current={i === active ? 'true' : undefined} onClick={(e) => go(e, l.target)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {/* (2026-11-05, the user's ask) no Apply button in the bar: the sign-up card is always in view */}
      </div>
    </header>
  );
}

/**
 * The minimal page's floating pill at the foot (there, its four variants): here this page only
 * (2026-11-03, the user's ask: "keep only Minimal").
 */
export function VariantPill() {
  return (
    <nav className="mv" aria-label="Variant" data-brand="ssb" data-theme="light">
      <span className="mv-k">Variant</span>
      <a href="/v9" aria-current="page">
        Minimal
      </a>
    </nav>
  );
}

/**
 * The minimal page's sign-up card (2026-11-03, the user's ask: sticky at the right, always white), for
 * visualisation only: its fields take typing but nothing is sent; "Start your Application" opens the
 * apply modal. A green band (the intake), the title, email, the mobile with its country code, the
 * early-bird deadline, the button, the WhatsApp opt-in and the terms line.
 */
export function MinimalForm({ id }: { id: string }) {
  const [wa, setWa] = React.useState(true);
  return (
    <div className="mf" data-brand="ssb" data-theme="light">
      <div className="mf-band">
        <p className="mf-band-t">PGP-MT Admission Open for 2027</p>
        <p className="mf-band-s">Build startups &amp; AI products · No tech background required</p>
      </div>
      <form className="mf-form" aria-labelledby={`${id}-title`} onSubmit={(e) => e.preventDefault()} noValidate>
        <h2 id={`${id}-title`} className="mf-title">
          Create your account
        </h2>
        <p className="mf-sub">Enter your details to proceed</p>
        <input className="mf-input" type="email" placeholder="Enter Email Address" aria-label="Email address" autoComplete="off" />
        <div className="mf-phone">
          <span className="mf-cc">
            <span aria-hidden="true">🇮🇳</span> +91<span className="mf-sr"> (India)</span>
          </span>
          <input className="mf-input" type="tel" placeholder="Enter Mobile Number" aria-label="Mobile number" autoComplete="off" />
        </div>
        <p className="mf-deadline">
          Early Bird Intake Application Deadline - <b>1st Nov 2026</b>
        </p>
        <button type="button" className="mf-cta">
          Start your Application
        </button>
        <label className="mf-wa">
          <input type="checkbox" checked={wa} onChange={(e) => setWa(e.target.checked)} />
          <span>Receive updates and confirmation from us on WhatsApp</span>
        </label>
        <p className="mf-terms">
          By creating an account, I agree to Scaler&rsquo;s <b>terms</b> &amp; <b>policy</b>
        </p>
      </form>
    </div>
  );
}

/**
 * Desktop: the sign-up card centred on the hero's frame, level with the hero's copy (2026-11-03, the
 * user's ask): its rail starts half the difference of the two heights down, measured as they change.
 */
export function HeroCardAlign() {
  React.useEffect(() => {
    const root = document.querySelector<HTMLElement>('.m9');
    const frame = root?.querySelector<HTMLElement>('.m9-hero .hf-frame');
    const card = root?.querySelector<HTMLElement>('.m9-sticky');
    const side = frame?.querySelector<HTMLElement>('.hf-side');
    if (!root || !frame || !card || !side) return undefined;
    // (2026-11-05, the user's ask) the card's foot on the line of the copy's foot (the facts strip), both
    // low in the frame so more of the video shows
    const place = () => {
      const foot = side.getBoundingClientRect().bottom - root.getBoundingClientRect().top;
      root.style.setProperty('--m9-card-top', `${Math.max(0, Math.round(foot - card.offsetHeight))}px`);
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(frame);
    ro.observe(side);
    ro.observe(card);
    return () => ro.disconnect();
  }, []);
  return null;
}

/**
 * Phones (2026-11-03, the user's ask): once the sign-up card after the first fold has scrolled away, an
 * Apply now bar stays at the window's foot (it takes you back to that card); it goes again over the footer.
 * At its left the intake's last date and the time left, ticking (2026-11-04).
 */
export function StickyApply({ deadline }: { deadline: { shortMessage: string; to: string; label: string } }) {
  const toForm = (e: React.MouseEvent) => {
    const form = document.querySelector<HTMLElement>('.m9-inline');
    if (!form) return;
    e.preventDefault();
    const bar = document.querySelector<HTMLElement>('.mn');
    const h = bar ? (parseFloat(getComputedStyle(bar).top) || 0) + bar.offsetHeight : 64;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - h, behavior: still ? 'auto' : 'smooth' });
    form.querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true });
  };
  const [shown, setShown] = React.useState(false);
  const end = React.useMemo(() => new Date(deadline.to).getTime(), [deadline.to]);
  const [now, setNow] = React.useState<number | null>(null);
  React.useEffect(() => {
    if (!shown) return undefined;
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [shown]);
  React.useEffect(() => {
    const card = document.querySelector<HTMLElement>('.m9-inline');
    const foot = document.querySelector<HTMLElement>('.dkft, footer');
    if (!card) return undefined;
    let raf = 0;
    const read = () => {
      raf = 0;
      const past = card.getBoundingClientRect().bottom < 0;
      const atFoot = foot ? foot.getBoundingClientRect().top < window.innerHeight : false;
      setShown(past && !atFoot);
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
  React.useEffect(() => {
    document.documentElement.toggleAttribute('data-m9-apply', shown);
    return () => document.documentElement.removeAttribute('data-m9-apply');
  }, [shown]);

  const left = now === null ? null : Math.max(0, end - now);
  const two = (n: number) => String(n).padStart(2, '0');
  const units: [string, number | null][] = [
    ['d', left === null ? null : Math.floor(left / 86_400_000)],
    ['h', left === null ? null : Math.floor(left / 3_600_000) % 24],
    ['m', left === null ? null : Math.floor(left / 60_000) % 60],
    ['s', left === null ? null : Math.floor(left / 1000) % 60],
  ];
  return (
    <div className="msa" data-shown={shown || undefined} aria-hidden={!shown || undefined} data-brand="ssb" data-theme="light">
      {/* the last date and the time left (2026-11-04, the user's ask), then the button */}
      <div className="msa-when">
        <p className="msa-k">{deadline.shortMessage}</p>
        <time className="msa-count" dateTime={new Date(end).toISOString()}>
          <span className="mf-sr">{deadline.label}</span>
          <span aria-hidden="true">
            {units.map(([u, n]) => (
              <span key={u} className="msa-unit">
                <b>{n === null ? '--' : two(n)}</b>
                {u}
              </span>
            ))}
          </span>
        </time>
      </div>
      {/* (2026-11-05, the user's ask) back to the sign-up card after the hero, not the apply modal */}
      <a className="msa-btn" href="#mf-inline-title" data-no-modal tabIndex={shown ? undefined : -1} onClick={toForm}>
        Apply now
      </a>
    </div>
  );
}
