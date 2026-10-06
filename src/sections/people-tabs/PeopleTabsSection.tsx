'use client';

/**
 * The four groups of people (faculty, mentors, the founding team, investors and founders) as one
 * section with tabs, in place of four sections one under another. A pill switcher (as the career
 * prep stats': a dark pill slides to the tab on show) names the groups; the tab on show brings
 * its own eyebrow, headline, subtext and its row of MEET cards. The row is a looping carousel
 * that runs by itself from the moment its tab comes on, and after a few seconds the next tab
 * comes on by itself (the pill fills as the time runs) (it holds on hover, on focus, while
 * touched, off screen, and under reduced motion); arrows, swipe and the dots still work. Phones
 * get the swipeable card stack, as the people sections had.
 *
 * Content is the sections' own (content/people, content/community); nothing is rewritten.
 */
import * as React from 'react';
import { Container, Heading, Section, Text } from '@kishanscaler/ssx-ui';

import { companyLogos } from '@/content/company-logos';
import { foundingTeamSection, investors, mentorsSection } from '@/content/community';
import { faculty } from '@/content/people';
import { HScrollerControls, HScrollerTrack, useHScroller } from '@/sections/faculty/HScroller';
import { MeetCard } from '@/sections/faculty/MeetCard';
import type { ShowcasePerson } from '@/sections/faculty/PeopleShowcase';
import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';
import { CardStack } from '@/sections/shared/CardStack';
import { ScrollDots } from '@/sections/shared/ScrollDots';
import './people-tabs.css';

type Group = { id: string; tab: string; eyebrow: string; title: string; sub: string; itemName: string; people: ShowcasePerson[] };

const withPhoto = (people: readonly { image?: string }[]) => people.filter((p): p is ShowcasePerson => Boolean(p.image));

const GROUPS: Group[] = [
  {
    id: 'faculty',
    tab: 'Faculty',
    eyebrow: 'Faculty',
    title: 'Learn From Your Future Recruiters, Not Just Faculty.',
    sub: 'Operators and leaders from BCG, McKinsey, Razorpay, Zomato, PayPal, Flipkart and more teach at SSB.',
    itemName: 'faculty',
    people: faculty
      .filter((m) => m.photo)
      .map((m) => ({ name: m.name, role: m.role, image: `/faculty/${m.photo}.webp`, logo: companyLogos[m.companies[0]] })),
  },
  { id: 'mentors', tab: 'Mentors', ...mentorsSection, itemName: 'mentor', people: withPhoto(mentorsSection.people) },
  { id: 'founding', tab: 'Founding Team', ...foundingTeamSection, itemName: 'person', people: withPhoto(foundingTeamSection.people) },
  { id: 'investors', tab: 'Investors & Founders', ...investors, itemName: 'person', people: withPhoto(investors.people) },
];

/** How long a tab stays before the next comes on by itself. */
const DWELL = 7000;

/** One group's header and its row: mounted afresh for each tab, so the carousel starts from its first card. */
function Panel({ group: g }: { group: Group }) {
  const { ref, page, goTo } = useHScroller({ speed: 40 });
  // the ticker wraps by one set's width: a short list needs a third copy to fill a wide screen
  const copies = g.people.length < 8 ? 3 : 2;
  return (
    <div className="pt-panel" role="tabpanel" id={`people-panel-${g.id}`} aria-labelledby={`people-tab-${g.id}`}>
      <Container>
        <div className="mb-10 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex max-w-(--size-measure-max) flex-col gap-3">
            <Heading as="p" size="eyebrow" className="text-content-brand">
              {g.eyebrow}
            </Heading>
            <Heading as="h2" size="display" id="people-title">
              {g.title}
            </Heading>
            <Text size="lg" tone="secondary">
              {g.sub}
            </Text>
          </div>
          <div className="hidden sm:block">
            <HScrollerControls label={g.itemName} page={page} />
          </div>
        </div>
      </Container>

      {/* Phones: the card stack. */}
      <Container className="sm:hidden">
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
                <MeetCard image={m.image} name={m.name} role={m.role} logo={m.logo} align="start" priority={!copy && i < 5} />
              </li>
            );
          }),
        )}
      </HScrollerTrack>
      <div className="hidden sm:block">
        <ScrollDots scroller={ref} count={g.people.length} itemName={g.itemName} onSelect={goTo} fill="solid" />
      </div>
    </div>
  );
}

export function PeopleTabsSection() {
  const [active, setActive] = React.useState(0);
  const sectionRef = React.useRef<HTMLElement>(null);
  const tabs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const [pill, setPill] = React.useState<{ x: number; w: number } | null>(null);
  useSectionEntrance(sectionRef);

  // the tabs move on by themselves: the pill fills over DWELL while the section is on screen
  // (`live`), and the next tab comes on when it is full. It waits while the pointer or focus is
  // inside the section (CSS pauses the fill).
  const [live, setLive] = React.useState(false);
  React.useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

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

  const select = (i: number, byHand = true) => {
    setActive(i);
    // on a phone the row of tabs scrolls: keep the chosen one in view (the row only, never the page)
    const t = tabs.current[i];
    const row = t?.parentElement;
    if (t && row) row.scrollTo({ left: t.offsetLeft - (row.clientWidth - t.offsetWidth) / 2, behavior: byHand ? 'smooth' : 'auto' });
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
    <Section ref={sectionRef} id="people" density="roomy" aria-labelledby="people-title" className="overflow-x-clip pt-section" data-live={live || undefined} style={{ '--pt-dwell': `${DWELL}ms` } as React.CSSProperties}>
      {/* phones: this bar floats under the navbar for as long as this section is on screen (CSS sticky,
          held inside the section, so it leaves with it) */}
      <Container className="pt-bar">
        <div className="pt-switch-wrap" data-enter="block">
          <div className="pt-switch" role="tablist" aria-label="The people at SSB" onKeyDown={onKey}>
            {pill ? (
              <span className="pt-pill" style={{ transform: `translateX(${pill.x}px)`, width: pill.w }} aria-hidden="true">
                {/* the fill: restarts with each tab; when it ends, the next tab comes on */}
                <i key={active} onAnimationEnd={() => select((active + 1) % GROUPS.length, false)} />
              </span>
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
      </Container>
      {/* keyed: each tab mounts its own panel, so its carousel starts from the first card */}
      <Panel key={GROUPS[active].id} group={GROUPS[active]} />
    </Section>
  );
}
