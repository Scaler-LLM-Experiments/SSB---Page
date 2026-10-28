'use client';

/**
 * Groups of people (faculty, mentors, the founding team, investors and founders) as a section
 * with tabs, in place of sections one under another. The page uses it twice: faculty and mentors
 * after Beyond Placements, the founding team and investors after Super Mentors (`groups`).
 *
 * A pill switcher (as the career prep stats': a dark pill slides to the tab on show) names the
 * groups. It stands at the header's right on wider screens, and left-aligned between the header
 * and the cards on phones. The tab on show brings its own eyebrow, headline, subtext and its row of
 * MEET cards, with the gallery dots under it (as every carousel has). The row runs by itself
 * from the moment its tab comes on; the tabs change only when chosen (they no longer move on by
 * themselves: that cut every carousel short). Phones get the swipeable carousel (CardStack).
 *
 * Content is the sections' own (content/people, content/community); nothing is rewritten.
 */
import * as React from 'react';
import { Container, Heading, Section, Text } from '@kishanscaler/ssx-ui';

import { companyLogos } from '@/content/company-logos';
import { foundingTeamSection, investors, mentorsSection } from '@/content/community';
import { impactPeople } from '@/content/impact';
import { faculty } from '@/content/people';
import { HScrollerTrack, useHScroller } from '@/sections/faculty/HScroller';
import { MeetCard } from '@/sections/faculty/MeetCard';
import type { ShowcasePerson } from '@/sections/faculty/PeopleShowcase';
import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';
import { FacultyCard } from './FacultyCard';
import { CardStack } from '@/sections/shared/CardStack';
import { ScrollDots } from '@/sections/shared/ScrollDots';
import { useRows } from '@/sections/shared/useRows';
import { CarouselNav } from '@/sections/shared/CarouselNav';
import './people-tabs.css';
import { Title } from '@/sections/shared/Title';

export type PeopleGroupId = 'faculty' | 'mentors' | 'founding' | 'investors' | 'impact';

type Group = { id: string; tab: string; eyebrow: string; title: string; sub: string; itemName: string; people: ShowcasePerson[] };

const withPhoto = (people: readonly { image?: string }[]) => people.filter((p): p is ShowcasePerson => Boolean(p.image));

const ALL_GROUPS: (Group & { id: PeopleGroupId })[] = [
  {
    id: 'faculty',
    tab: 'Faculty',
    eyebrow: 'Faculty',
    title: 'Learn from your future recruiters.|Not just faculty.',
    sub: 'Operators and leaders from BCG, McKinsey, Razorpay, Zomato, PayPal, Flipkart and more teach at SSB.',
    itemName: 'faculty',
    people: faculty
      .filter((m) => m.photo)
      .map((m) => ({ name: m.name, role: m.role, image: `/faculty/${m.photo}.webp`, logo: companyLogos[m.companies[0]] })),
  },
  { id: 'mentors', tab: 'Mentors', ...mentorsSection, itemName: 'mentor', people: withPhoto(mentorsSection.people) },
  { id: 'founding', tab: 'Founding Team', ...foundingTeamSection, itemName: 'person', people: withPhoto(foundingTeamSection.people) },
  { id: 'investors', tab: 'Investors & Founders', ...investors, itemName: 'person', people: withPhoto(investors.people) },
  // the Scaler Impact Foundation as a tab (the deck variant, /v7, 2026-10-28: with the founding team), in
  // ImpactSection's words
  {
    id: 'impact',
    tab: 'Scaler Impact Foundation',
    eyebrow: 'Scaler Impact Foundation',
    title: 'The people behind the Scaler Impact Foundation.|Founders, operators and creators.',
    sub: 'Founders, operators and creators from Paytm, Rippling, Zeta, WebVeda and Soch by Mohak.',
    itemName: 'member',
    people: impactPeople,
  },
];

/** PLACEHOLDER (2026-10-12): the stacked cards' line under the logo, until each person's own is written. */
const PLACEHOLDER_BIO = 'A line on what they teach at SSB and the work they have led.';

/** PLACEHOLDER (2026-10-13): the faculty cards' course titles, until each person's own is written. */
const PLACEHOLDER_COURSES = [
  'Operation Management',
  'Brand Strategy',
  'Growth Marketing',
  'Corporate Finance',
  'Product Management',
  'Sales Leadership',
  'Business Analytics',
  'Strategy & Consulting',
];

/**
 * Faculty as two rows of `FacultyCard`s drifting sideways (2026-10-13, the team's ask: the alumni
 * section's layout): both rows the same way, the second half a card behind (faculty-card.css).
 */
function FacultyDrift({ group: g, stack = false }: { group: Group; stack?: boolean }) {
  const gridRef = React.useRef<HTMLUListElement>(null);
  const rows = useRows(2);
  const driftRef = React.useRef<HTMLDivElement>(null);
  useSwipeDrift(driftRef);
  // mentors on the web: the looping scroller (not the CSS drift), so the dots can follow and step it
  const { ref: tickerRef, goTo } = useHScroller({ speed: 40 });
  // mentors: their earlier photo card (MeetCard), smaller, in this layout (2026-10-13, the team's ask);
  // with `stack` (the deck pages, 2026-10-28) every group takes the faculty's two rows on the web too
  const meet = !stack && g.id === 'mentors';
  // only the faculty teach a course; everyone else's card leads with their name and role
  const withCourse = g.id === 'faculty';
  const card = (p: ShowcasePerson, i: number, priority: boolean) =>
    !withCourse ? (
      // mentors as the faculty cards (2026-10-23, the team's ask): no "Meet", their name leading, their
      // role under it, their company as its mark and name (the company in the role; the second logo off)
      <FacultyCard person={p} credentials={p.role} priority={priority} />
    ) : (
      <FacultyCard person={p} course={PLACEHOLDER_COURSES[i % PLACEHOLDER_COURSES.length]} credentials={p.role} priority={priority} />
    );
  const kind = meet ? 'meet' : undefined;
  const n = g.people.length;
  const all = g.people.map((p, i) => ({ p, i }));
  // A long list splits between the rows; a short one (mentors: five) runs whole in each row, the
  // second started halfway along, and repeats until a set is wider than the screen (no gap in the loop).
  const rowsOf = (r: number) => {
    const mine = n >= 12 ? all.filter(({ i }) => i % 2 === r) : [...all.slice(r * Math.ceil(n / 2)), ...all.slice(0, r * Math.ceil(n / 2))];
    return Array.from({ length: Math.ceil(6 / mine.length) }, () => mine).flat().map((x, k) => ({ ...x, k }));
  };
  return (
    <div className="pt-panel" role="tabpanel" id={`people-panel-${g.id}`} aria-labelledby={`people-tab-${g.id}`}>
      {meet ? (
        <div className="fc-meet-web">
          <HScrollerTrack trackRef={tickerRef} label={g.eyebrow}>
            {[0, 1, 2].map((c) =>
              g.people.map((p, i) => (
                <li key={`${c}-${p.name}`} data-copy={c > 0 || undefined} aria-hidden={c > 0 || undefined} inert={c > 0 || undefined}>
                  {card(p, i, c === 0 && i < 4)}
                </li>
              )),
            )}
          </HScrollerTrack>
          <ScrollDots scroller={tickerRef} count={g.people.length} itemName={g.itemName} onSelect={goTo} />
        </div>
      ) : null}
      <div
        ref={driftRef}
        className="fc-drift"
        hidden={meet}
        data-kind={kind}
        // mentors: one row of bigger cards on desktop (2026-10-13, the team's ask)
        data-single={(!stack && g.id === 'mentors') || undefined}
      >
      {[0, 1].map((r) => {
        const mine = rowsOf(r);
        return (
          // the lane: on phones a row the reader can swipe, the drift carried on by its scroll (useSwipeDrift)
          <div key={r} className="fc-drift-lane">
          <div className="fc-drift-row" data-dir={r ? 'back' : undefined} style={{ '--n': mine.length } as React.CSSProperties}>
            {[0, 1].map((copy) => (
              <ul key={copy} className="fc-drift-set" aria-label={copy ? undefined : g.eyebrow} aria-hidden={copy ? true : undefined}>
                {mine.map(({ p, i, k }) => (
                  <li key={k}>
                    {card(p, i, !copy && k < 3)}
                  </li>
                ))}
              </ul>
            ))}
          </div>
          </div>
        );
      })}
      </div>
      {meet ? null : <DriftNav root={driftRef} itemName={g.itemName} count={rowsOf(0).length} />}
      {/* m-web (2026-10-13, the team's ask): no drifting; two rows, card over card, swiped a column
          at a time, with the dots under them */}
      <ul ref={gridRef} className="fc-grid" data-kind={kind} aria-label={g.eyebrow}>
        {g.people.map((p, i) => (
          <li key={p.name}>
            {card(p, i, i < 2)}
          </li>
        ))}
      </ul>
      <div className="fc-grid-dots">
        <ScrollDots scroller={gridRef} count={Math.ceil(g.people.length / rows)} itemName={g.itemName} fill="solid" autoplay={false} />
      </div>
    </div>
  );
}

/**
 * Phones (2026-10-13, the team's ask: the swipe back, the drift kept): each lane scrolls sideways, and
 * its scroll moves on by itself at the desktop drift's pace (40px a second), wrapping by one set's
 * width (the row is its cards twice over). A touch hands it to the reader; it carries on a moment
 * after they let go. The second lane starts half a card along. Reduced motion: swipe only.
 */
function useSwipeDrift(root: React.RefObject<HTMLDivElement | null>) {
  React.useEffect(() => {
    const el = root.current;
    if (!el) return;
    const phone = window.matchMedia('(width < 672px)');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0;
    let stop = () => {};
    const start = () => {
      stop();
      if (!phone.matches) return;
      const lanes = [...el.querySelectorAll<HTMLElement>('.fc-drift-lane')].map((lane, i) => {
        const set = lane.querySelector<HTMLElement>('.fc-drift-set');
        const card = set?.firstElementChild as HTMLElement | null;
        const st = { lane, set, pos: i ? (card?.offsetWidth ?? 0) / 4 + 3 : 0, last: -1, held: false, idle: 0 };
        lane.scrollLeft = st.pos;
        st.last = lane.scrollLeft;
        return st;
      });
      const offs: Array<() => void> = [];
      lanes.forEach((st) => {
        const hold = () => { st.held = true; };
        const free = () => { st.held = false; st.idle = performance.now() + 1200; };
        const onScroll = () => {
          // a scroll we did not make (a swipe, its glide): take the reader's place, wait for it to settle
          if (Math.abs(st.lane.scrollLeft - st.last) > 1.5) { st.pos = st.lane.scrollLeft; st.last = st.pos; st.idle = performance.now() + 900; }
        };
        st.lane.addEventListener('touchstart', hold, { passive: true });
        st.lane.addEventListener('touchend', free, { passive: true });
        st.lane.addEventListener('touchcancel', free, { passive: true });
        st.lane.addEventListener('scroll', onScroll, { passive: true });
        // the controls (DriftNav) moving the lane: stand back while it glides there, then drift on
        const onNav = () => { st.idle = performance.now() + 1400; };
        st.lane.addEventListener('fc-nav', onNav);
        offs.push(() => {
          st.lane.removeEventListener('fc-nav', onNav);
          st.lane.removeEventListener('touchstart', hold);
          st.lane.removeEventListener('touchend', free);
          st.lane.removeEventListener('touchcancel', free);
          st.lane.removeEventListener('scroll', onScroll);
        });
      });
      let t0 = performance.now();
      const tick = (t: number) => {
        const dt = Math.min(0.05, (t - t0) / 1000);
        t0 = t;
        if (!still.matches) {
          for (const st of lanes) {
            if (st.held || t < st.idle || !st.set) continue;
            const w = st.set.offsetWidth;
            st.pos += 40 * dt;
            if (st.pos >= w) st.pos -= w;
            st.lane.scrollLeft = st.pos;
            st.last = st.lane.scrollLeft;
          }
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      stop = () => { cancelAnimationFrame(raf); offs.forEach((f) => f()); };
    };
    start();
    phone.addEventListener('change', start);
    return () => { stop(); phone.removeEventListener('change', start); };
  }, [root]);
}

/**
 * Phones (2026-10-13, the team's ask: "for people to navigate faster"): the gallery controls under the
 * drifting rows, one dot a card (the first row's), the current one filling as the row drifts across
 * it. An arrow or a dot moves both rows by the same distance, so their step holds; the drift carries
 * on from there (useSwipeDrift waits a beat after any scroll it did not make).
 */
function DriftNav({ root, itemName, count }: { root: React.RefObject<HTMLDivElement | null>; itemName: string; count: number }) {
  // the count from the start: CarouselNav sets up its entrance on its first render
  const [st, setSt] = React.useState({ count, active: 0, progress: 0 });
  const lanes = () => [...(root.current?.querySelectorAll<HTMLElement>('.fc-drift-lane') ?? [])];
  const cardOf = (lane: HTMLElement) => {
    const set = lane.querySelector<HTMLElement>('.fc-drift-set');
    const li = set?.firstElementChild as HTMLElement | null;
    return { set, step: li ? li.offsetWidth + parseFloat(getComputedStyle(set!).columnGap || '0') : 0, n: set?.children.length ?? 1 };
  };
  React.useEffect(() => {
    let raf = 0;
    const read = () => {
      const lane = lanes()[0];
      if (lane && lane.offsetParent) {
        const { step, n } = cardOf(lane);
        if (step) {
          const at = lane.scrollLeft / step;
          const i = Math.floor(at + 0.01);
          const next = { count: n, active: ((i % n) + n) % n, progress: Math.min(1, Math.max(0, at - i)) };
          setSt((o) => (o.count === next.count && o.active === next.active && Math.abs(o.progress - next.progress) < 0.02 ? o : next));
        }
      }
      raf = requestAnimationFrame(read);
    };
    raf = requestAnimationFrame(read);
    return () => cancelAnimationFrame(raf);
  }, [root]);
  // move every lane by the first lane's distance to card `i` (or a card on / back)
  const moveBy = (cards: (at: number, n: number) => number) => {
    const ls = lanes();
    if (!ls[0]) return;
    const { step, n, set } = cardOf(ls[0]);
    if (!step || !set) return;
    const at = ls[0].scrollLeft / step;
    const target = cards(at, n);
    let delta = target * step - ls[0].scrollLeft;
    // past the first set's end: the copy is the same cards, so go there from a set's width back
    if (ls[0].scrollLeft + delta < 0) delta += set.offsetWidth;
    for (const l of ls) {
      let left = l.scrollLeft + delta;
      const w = l.querySelector<HTMLElement>('.fc-drift-set')?.offsetWidth ?? 0;
      if (w && left >= w) { l.scrollLeft -= w; left -= w; }
      if (w && left < 0) { l.scrollLeft += w; left += w; }
      l.dispatchEvent(new Event('fc-nav'));
      l.scrollTo({ left, behavior: 'smooth' });
    }
  };
  return (
    <div className="fc-drift-nav">
      <CarouselNav
        count={st.count}
        active={st.active}
        itemName={itemName}
        progress={st.progress}
        onSelect={(i) => moveBy((at, n) => Math.floor(at + 0.01) - (((Math.floor(at + 0.01)) % n) + n) % n + i)}
        onPrev={() => moveBy((at) => Math.ceil(at - 0.01) - 1)}
        onNext={() => moveBy((at) => Math.floor(at + 0.01) + 1)}
      />
    </div>
  );
}

/** One group's row: mounted afresh for each tab, so the carousel starts from its first card. */
function Row({ group: g, stacked = false, compact = false, still = false }: { group: Group; stacked?: boolean; compact?: boolean; still?: boolean }) {
  const row = stacked || compact;
  // still (2026-10-23, the team's ask): one plain row, scrolled by hand, at every width (no ticker)
  const { ref, goTo } = useHScroller({ speed: 40, auto: !still });
  // the ticker wraps by one set's width: a short list needs a third copy to fill a wide screen
  const copies = still ? 1 : g.people.length < 8 ? 3 : 2;
  return (
    <div className="pt-panel" role="tabpanel" data-compact={compact || undefined} data-still={still || undefined} id={`people-panel-${g.id}`} aria-labelledby={`people-tab-${g.id}`}>
      {/* Phones, stacked (2026-10-12, the team's layout): a row to swipe, two cards in view and the
          edges of the next and the last. */}
      {row ? (
        <ul className="pt-stack-row" data-compact={compact || undefined} aria-label={g.eyebrow}>
          {g.people.map((m, i) => (
            <li key={m.name}>
              <MeetCard
                image={m.image}
                name={m.name}
                role={m.role}
                logo={m.logo}
                align={stacked ? 'start' : 'center'}
                stacked={stacked}
                bio={PLACEHOLDER_BIO}
                priority={i < 3}
              />
            </li>
          ))}
        </ul>
      ) : null}
      {/* Phones: the card stack. */}
      <Container className={row || still ? 'hidden' : 'sm:hidden'}>
        <CardStack
          items={g.people}
          getKey={(m) => m.name}
          label={g.eyebrow}
          itemName={g.itemName}
          announce={(m) => `${m.name}, ${m.role}`}
          dots
          loop={false}
          renderCard={(m, i) => (
            <MeetCard image={m.image} priority={i === 0 || i === 1 || i === g.people.length - 1} name={m.name} role={m.role} logo={m.logo} />
          )}
        />
      </Container>

      {/* Tablet and up: the looping row (copies of the list; only the first is real). */}
      <HScrollerTrack trackRef={ref} label={g.eyebrow}>
        {Array.from({ length: copies }, (_, c) =>
          g.people.map((m, i) => {
            const copy = c > 0;
            return (
              <li key={`${c}-${m.name}`} data-copy={copy || undefined} aria-hidden={copy || undefined} inert={copy || undefined}>
                <MeetCard
                  image={m.image}
                  name={m.name}
                  role={m.role}
                  logo={m.logo}
                  align="start"
                  stacked={stacked}
                  bio={PLACEHOLDER_BIO}
                  priority={!copy && i < 5}
                  company={still}
                />
              </li>
            );
          }),
        )}
      </HScrollerTrack>
      <div className={still ? 'block' : 'hidden sm:block'}>
        <ScrollDots scroller={ref} count={g.people.length} itemName={g.itemName} onSelect={goTo} autoplay={!still} />
      </div>
    </div>
  );
}

export function PeopleTabsSection({
  groups: ids = ['faculty', 'mentors'],
  id = 'people',
  label = 'The people at SSB',
  stacked = false,
  compact = false,
  drift = false,
  stack = false,
  borrow,
  still = false,
}: {
  groups?: PeopleGroupId[];
  /** One still row of the photo cards, with the company's mark and name (2026-10-23, the team's ask). */
  still?: boolean;
  /** Faculty cards in two drifting rows, as Alumni's (2026-10-13). */
  drift?: boolean;
  /** The faculty's two-row stack for any group, on the web and phones, no course on the cards (2026-10-28). */
  stack?: boolean;
  /** More cards for the group, borrowed from another: `count` of its people, every other one from the
   *  start (a fixed pick, so server and browser agree), skipping anyone already there (2026-10-28). */
  borrow?: { from: PeopleGroupId; count: number };
  /** The cards with the photo on top and the text under it (2026-10-12). */
  stacked?: boolean;
  /** Smaller cards, unchanged otherwise: four in view on desktop, two and a peek on a phone (2026-10-12, mentors). */
  compact?: boolean;
  id?: string;
  label?: string;
}) {
  const GROUPS = React.useMemo(() => {
    const picked = ALL_GROUPS.filter((g) => ids.includes(g.id));
    if (!borrow) return picked;
    const source = ALL_GROUPS.find((g) => g.id === borrow.from)?.people ?? [];
    return picked.map((g) => {
      const have = new Set(g.people.map((p) => p.name));
      const spread = [...source.filter((_, i) => i % 2 === 0), ...source.filter((_, i) => i % 2 === 1)];
      const extra = spread.filter((p) => !have.has(p.name)).slice(0, borrow.count);
      return { ...g, people: [...g.people, ...extra] };
    });
  }, [ids.join(), borrow?.from, borrow?.count]); // eslint-disable-line react-hooks/exhaustive-deps
  const titleId = `${id}-title`;
  const [active, setActive] = React.useState(0);
  const sectionRef = React.useRef<HTMLElement>(null);
  const tabs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const [pill, setPill] = React.useState<{ x: number; w: number } | null>(null);
  useSectionEntrance(sectionRef);

  // the pill sits under the active tab: measured, and again when the row changes size
  React.useLayoutEffect(() => {
    const measure = () => {
      const t = tabs.current[active];
      if (t) setPill({ x: t.offsetLeft, w: t.offsetWidth });
    };
    measure();
    const row = tabs.current[0]?.parentElement;
    if (!row || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(row);
    return () => ro.disconnect();
  }, [active]);

  const select = (i: number) => {
    setActive(i);
    // on a phone the row of tabs scrolls: keep the chosen one in view (the row only, never the page)
    const t = tabs.current[i];
    const row = t?.parentElement;
    if (t && row) row.scrollTo({ left: t.offsetLeft - (row.clientWidth - t.offsetWidth) / 2, behavior: 'smooth' });
  };
  // arrow keys move between tabs, as a tab list does
  const onKey = (e: React.KeyboardEvent) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = (active + d + GROUPS.length) % GROUPS.length;
    select(next);
    tabs.current[next]?.focus();
  };

  return (
    <Section ref={sectionRef} id={id} density="roomy" aria-labelledby={titleId} className="overflow-x-clip pt-section">
      <Container>
        <div className="mb-8 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          {/* keyed: the header comes on afresh with its tab */}
          <div key={GROUPS[active].id} className="pt-panel flex max-w-(--size-measure-max) flex-col gap-3">
            <Heading as="p" size="eyebrow" className="text-content-brand">
              {GROUPS[active].eyebrow}
            </Heading>
            {/* the titles stacked the same way (the active one the h2), so a longer title doesn't jump it */}
            <div className="pt-subs">
              {GROUPS.map((g, i) =>
                i === active ? (
                  <Heading key={g.id} as="h2" size="display" id={titleId} data-on>
                    <Title text={g.title} />
                  </Heading>
                ) : (
                  <Heading key={g.id} as="p" size="display" aria-hidden>
                    <Title text={g.title} />
                  </Heading>
                ),
              )}
            </div>
            {/* every tab's sub-line laid in one cell, only the active one shown, so the cell is as tall
                as the longest at any width and the header doesn't jump between tabs (2026-10-13) */}
            <div className="pt-subs">
              {GROUPS.map((g, i) => (
                <Text key={g.id} size="lg" tone="secondary" aria-hidden={i !== active || undefined} data-on={i === active || undefined}>
                  {g.sub}
                </Text>
              ))}
            </div>
          </div>
          {/* the tabs: at the header's right; left-aligned above the cards on phones */}
          {/* one group (faculty and mentors as sections of their own, 2026-10-12): no tabs */}
          <div className="pt-tabs" hidden={GROUPS.length < 2}>
            <div className="pt-switch-wrap">
              <div className="pt-switch" role="tablist" aria-label={label} onKeyDown={onKey}>
                {pill ? (
                  <span className="pt-pill" style={{ transform: `translateX(${pill.x}px)`, width: pill.w }} aria-hidden="true" />
                ) : null}
                {GROUPS.map((g, i) => (
                  <button
                    key={g.id}
                    type="button"
                    role="tab"
                    id={`people-tab-${g.id}`}
                    aria-selected={i === active}
                    aria-controls={`people-panel-${g.id}`}
                    tabIndex={i === active ? 0 : -1}
                    ref={(el) => {
                      tabs.current[i] = el;
                    }}
                    className="pt-tab"
                    onClick={() => select(i)}
                  >
                    {g.tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
      {/* keyed: each tab mounts its own row, so its carousel starts from the first card */}
      {drift || stack ? (
        <FacultyDrift key={GROUPS[active].id} group={GROUPS[active]} stack={stack} />
      ) : (
        <Row key={GROUPS[active].id} group={GROUPS[active]} stacked={stacked} compact={compact} still={still} />
      )}
    </Section>
  );
}
