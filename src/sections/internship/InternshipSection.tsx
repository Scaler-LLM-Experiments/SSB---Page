'use client';
/**
 * The internship, as one section (the SSB concept site's "Internship statistics" and
 * "Internship Pivots", ssb-school-concept.vercel.app, with the live site's success
 * stories). Three parts:
 *   numbers    three stats in the Placements grid's panel (an icon, the figure, what it
 *              measures), hairlines between.
 *   carousel   the learners, a video then a profile in turn, every one in the alumni card
 *              (../SSB---Page sections/alumni: the picture on the left, the name and the
 *              move on the dark right). A profile shows the pivot, post SSB over pre SSB;
 *              a video puts its still and a play mark where the photo goes.
 *              The cards stand in the lab's card stack (see Stories): one in front, its
 *              neighbours tucked behind, glass arrows, dots. It moves by itself.
 *   companies  the 24 companies learners have interned at, in the Placements grid's logo frame.
 * It moves as the Placements grid does (its PlacementsMotion, on the same data-* hooks), each
 * part as it is scrolled to: the header rises; the stat cells come up one after another, each
 * wiped open in the brand green, which clears as its content fades in; the carousel and the
 * logo grid fade up.
 */
import * as React from 'react';
import { Container, Heading, Section, Text } from '@kishanscaler/ssx-ui';
import { Briefcase, CaretUp, Play } from '@phosphor-icons/react';
import { PlacementsMotion } from '@/sections/placements/PlacementsMotion';
import { CardStack as PhoneCarousel } from '@/sections/shared/CardStack';
import { CardStack } from './CardStack';
import { StoryReels, type Reel } from './StoryReels';
import '@/sections/alumni/alumni.css';
import '@/sections/placements/placements.css';
import './internship.css';

// The numbers, as the Placements grid shows its stats (../SSB---Page sections/placements): an icon,
// the figure with its unit a step down in grey, what it measures, and a short line.
// Three levels a box, as Placements' cohort boxes (2026-10-07): eyebrow, figure, caption.
const STATS = [
  { eyebrow: 'Internship placement', figure: ['', '100', '%'], label: 'Internship placement', caption: 'Across cohorts 1 and 2' },
  { eyebrow: 'Top roles', figure: ['', '52', '%+'], label: 'In Product and Founder’s Office', caption: 'In Product and Founder’s Office' },
  { eyebrow: 'Duration', figure: ['', '3–6', ' months'], label: 'Months of internship', caption: 'Of internship, within the PGP' },
];
const FUNCTIONS = ['Product', 'Founder’s Office', 'Marketing', 'Finance', 'Operations', 'Strategy'];

// [name, from company, from role, to company, to role]
const PIVOTS: [string, string, string, string, string][] = [
  ['Sanyam Maheshwari', 'Deloitte', 'Analyst', 'ToolJet', 'Product Strategy'],
  ['Akarsh Sharma', 'Uber', 'Data Analyst', 'Pync', 'Founder’s Office'],
  ['Sarosha Pais', 'Aquarelle', 'HR', 'Razorpay', 'Partnerships'],
  ['Uttara Nambiar', 'DMart', 'Software Development', 'FirstClub', 'Category Management'],
  ['Ayush Poojary', 'Mutha & Co.', 'Trainee', 'LoEstro', 'Investment Banking'],
  ['Rohan Kumar', 'KPMG', 'Finance Associate', 'LimeChat', 'Operations'],
  ['Bharath Ramesh', 'Lufthansa Technik', 'Executive', 'Ninjacart', 'B2B Strategy'],
  ['Impana Reddy', 'Papermint', 'Founder', 'Onsurity', 'Product Management'],
];

// The live site's success stories (scaler.com/school-of-business). The covers carry their own
// headline and play mark. [CONFIRM] which name goes with which cover: taken from the order the
// live page lists them in. `video` is the story's link once it is known; a cover without one
// is not a link.
const STORIES: { name: string; line: string; cover: string; video?: string; clip?: string }[] = [
  { name: 'Akarsh', line: 'Created a GTM strategy for BSLR Technologies', cover: 'akarsh' },
  { name: 'Yukthi', line: 'Career pivot from operations to strategy', cover: 'yukthi' },
  { name: 'Moh', line: 'Building a Shark Tank funded startup', cover: 'moh' },
  { name: 'Ayush', line: 'From CA to private equity', cover: 'ayush' },
  { name: 'Yash', line: 'From fintech intern to Founder’s Office', cover: 'yash' },
];

// The stories as shorts (2026-10-09). PLACEHOLDER: no learner's short is in the project yet, so each
// plays the campus film from a different moment; set a story's `clip` to its own short.
const REELS: Reel[] = STORIES.map((s, i) => ({
  name: s.name,
  line: s.line,
  clip: s.clip ?? '/media/campus-film.mp4',
  start: s.clip ? 0 : i * 3,
  poster: s.clip ? undefined : '/media/campus-film-poster.jpg',
}));

// Where learners have interned: the live site's grid ("Our Learners are now creating Impact at",
// scaler.com/school-of-business), cut into its 24 logos (public/internship/logos), in the order given.
const COMPANIES = [
  'BCCI', 'Emergent', 'BharatPe', 'The Whole Truth', 'Razorpay', 'apna',
  'LoEstro', 'Airtribe', 'Slikk', 'MPL', 'Neosapien', 'Ninjacart',
  'BorderPlus', 'Chai Point', 'ToolJet', 'Vaani', 'Onsurity', 'FirstClub',
  'Clientell', 'LimeChat', 'Reckitt', 'Aeos Labs', 'SpotDraft', 'WNS Vuram',
];

// pictures in the alumni card's style (public/alumni: the person on the left, a dark blur on the right)
const PHOTOS: Record<string, string> = { 'Uttara Nambiar': 'uttara-nambiar', 'Bharath Ramesh': 'bharath-ramesh', Moh: 'moh-agarwal' };
// company marks, as the alumni set has them: each company's own app or site icon (the alumni
// section's own files, or public/internship/marks, taken from the companies' sites 2026-10-05).
// `fill` marks an icon that comes on its own coloured square (it fills the tile).
const MARKS: Record<string, { src: string; fill?: boolean }> = {
  ToolJet: { src: '/internship/marks/tooljet.png', fill: true },
  Pync: { src: '/internship/marks/pync.png' },
  Razorpay: { src: '/logos/marks/razorpay.png' },
  FirstClub: { src: '/internship/marks/firstclub.png', fill: true },
  LoEstro: { src: '/internship/marks/loestro.png' },
  LimeChat: { src: '/internship/marks/limechat.png' },
  Ninjacart: { src: '/logos/marks/ninjacart.png' },
  Onsurity: { src: '/internship/marks/onsurity.png', fill: true },
};

type Card = { key: string; kind: 'video'; story: (typeof STORIES)[number] } | { key: string; kind: 'profile'; pivot: (typeof PIVOTS)[number] };
// The video stories only (2026-10-07, the team's ask). The profile cards (PIVOTS) moved to the alumni
// section (content/alumni.ts, pivotAlumni); PIVOTS stays for the `profile` card kind.
const CARDS: Card[] = STORIES.map((story): Card => ({ key: `video-${story.name}`, kind: 'video', story }));

const initials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

/** The alumni card's design width in px (alumni.css sizes it 480 x 320 and scales it to its slot). */
const CARD_WIDTH = 480;

/**
 * One learner, in the alumni card (its classes and sizes, alumni.css). The alumni component
 * itself takes only an alumnus with a portrait; this one also takes a learner with no portrait
 * yet (see the badge below) and a video ("watch" where a profile has its move).
 */
function LearnerCard({ card }: { card: Card }) {
  const ref = React.useRef<HTMLElement>(null);
  // one 480 x 320 design, scaled to its slot (its parent), as AlumniCard does
  React.useLayoutEffect(() => {
    const el = ref.current;
    const slot = el?.parentElement;
    if (!el || !slot) return undefined;
    const fit = () => el.style.setProperty('--alumni-scale', String(slot.clientWidth / CARD_WIDTH));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(slot);
    return () => ro.disconnect();
  }, []);

  const video = card.kind === 'video';
  const name = video ? card.story.name : card.pivot[0];
  const photo = PHOTOS[name];
  const body = video ? (
    <>
      <div className="flex flex-col gap-2">
        <p className="alumni-card__name">{name}</p>
        <h3 className="alumni-card__role">{card.story.line}</h3>
      </div>
      <div className="alumni-card__path">
        {/* the cue that this card plays: a frosted pill, a white play disc with a slow ring pulsing
            out of it, then the label (it reads as a button; the whole card is the link once the
            story's video is known) */}
        <div className="in-lc-watch">
          <span className="in-lc-watch-play" aria-hidden="true">
            <Play weight="fill" />
          </span>
          <span className="in-lc-watch-text">
            <span className="in-lc-watch-label">Success story · Video</span>
            <span className="in-lc-watch-value">Watch {name}’s story</span>
          </span>
        </div>
      </div>
    </>
  ) : (
    <>
      <div className="flex flex-col gap-2">
        <p className="alumni-card__name">{name}</p>
        <h3 className="alumni-card__role">
          {card.pivot[4]} at {card.pivot[3]}
        </h3>
      </div>
      <div className="alumni-card__path">
        <div className="alumni-card__step">
          <span className="alumni-card__tile" data-fill={MARKS[card.pivot[3]]?.fill || undefined} data-letter={MARKS[card.pivot[3]] ? undefined : ''}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {MARKS[card.pivot[3]] ? <img src={MARKS[card.pivot[3]].src} alt="" loading="lazy" /> : card.pivot[3][0]}
          </span>
          <span>
            <span className="alumni-card__label">Post SSB</span>
            <span className="alumni-card__value">{card.pivot[3]}</span>
          </span>
        </div>
        <span className="alumni-card__arrow" aria-hidden="true">
          <CaretUp weight="bold" />
          <CaretUp weight="bold" />
        </span>
        <div className="alumni-card__step">
          <span className="alumni-card__tile" data-pre="">
            <Briefcase />
          </span>
          <span>
            <span className="alumni-card__label">Pre SSB</span>
            <span className="alumni-card__value">
              {card.pivot[2]}, {card.pivot[1]}
            </span>
          </span>
        </div>
      </div>
    </>
  );

  const inner = (
    <>
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="alumni-card__photo" src={`/alumni/${photo}.webp`} alt="" width={948} height={631} loading="lazy" draggable={false} />
      ) : (
        // no portrait in the alumni style yet: a generic picture for now, the same room with no
        // one in it (the plate, made from an alumni photo's blurred side) and the initials where
        // the person would stand. [TEMP] until portraits arrive
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="alumni-card__photo" src="/internship/plate.webp" alt="" width={948} height={631} loading="lazy" draggable={false} />
          <span className="in-lc-badge" aria-hidden="true">
            {initials(name)}
          </span>
        </>
      )}
      <div className="alumni-card__body" data-brand="ssb" data-theme="dark">
        {body}
      </div>
    </>
  );

  return (
    <article ref={ref} className="alumni-card in-lc" data-kind={card.kind} data-photo={photo ? '' : undefined}>
      {video && card.story.video ? (
        <a className="in-lc-link" href={card.story.video} target="_blank" rel="noreferrer" aria-label={`Watch ${name}’s success story`}>
          {inner}
        </a>
      ) : (
        inner
      )}
    </article>
  );
}

/**
 * The carousel: the lab's card stack (the one Live Projects and Faculty use on phones; our copy,
 * ./CardStack, only adds a settable pace), here at every width, moving on every 2.4 seconds. One card in front, its neighbours
 * behind it, smaller and dimmed; glass arrows on the front card's edges on phones only (on
 * wider screens the dots and its own timer move it); a dot per card underneath, the current one filling as the stack waits. It advances by itself while it is on
 * screen, holds for a few seconds after a touch, and never moves by itself under reduced motion.
 * The front card is the alumni section's width. On a phone the stage runs edge to edge and the
 * neighbours are tucked behind; on desktop the stage is the full column and the neighbours stand
 * out at its two ends, almost whole (internship.css).
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept to bring the card stack back
function Stories() {
  const announce = (c: Card) => (c.kind === 'video' ? `${c.story.name}: ${c.story.line}` : `${c.pivot[0]}: ${c.pivot[4]} at ${c.pivot[3]}`);
  // the alumni card is one fixed design scaled to its slot: this is the slot
  const renderCard = (c: Card) => (
    <div className="in-slot">
      <LearnerCard card={c} />
    </div>
  );
  return (
    <>
      {/* Phones: the gallery row every carousel has on a phone (shared/CardStack). */}
      <div className="sm:hidden">
        <PhoneCarousel items={CARDS} getKey={(c) => c.key} label="Learners: success stories" itemName="learner" announce={announce} dots renderCard={renderCard} />
      </div>
      <div className="hidden sm:block">
        <CardStack
          className="in-stack"
          items={CARDS}
          getKey={(c) => c.key}
          label="Learners: success stories"
          itemName="learner"
          cardWidth={86}
          interval={2400}
          resumeAfter={4000}
          announce={announce}
          dots
          renderCard={renderCard}
        />
      </div>
    </>
  );
}

/**
 * The companies, one logo to a cell. When the grid is scrolled to, the logos come in as a cascade:
 * each rises a little and fades in, one after another along the rows (`data-in` on the grid, set
 * once it is a quarter on screen; the delay is each logo's place in the list). Under reduced
 * motion, and with no observer, they are simply there.
 */
function LogoGrid() {
  const ref = React.useRef<HTMLUListElement>(null);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <ul ref={ref} data-in={shown || undefined} className="in-logos grid grid-cols-3 gap-px overflow-hidden border border-border-subtle bg-border-subtle sm:grid-cols-4 md:grid-cols-6">
      {COMPANIES.map((name, i) => (
        <li key={name} className="relative h-20 bg-surface sm:h-24" style={{ '--i': i } as React.CSSProperties}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/internship/logos/${name.toLowerCase().replace(/ /g, '-')}.png`} alt={name} loading="lazy" />
        </li>
      ))}
    </ul>
  );
}

export function InternshipSection() {
  return (
    <Section id="internship" density="roomy" aria-labelledby="internship-title" className="overflow-x-clip">
      <PlacementsMotion>
      <Container>
        <div data-enter="header" className="mb-10 flex max-w-(--size-measure-max) flex-col gap-3 sm:mb-12">
          <Heading as="p" size="eyebrow" className="text-content-brand" data-enter="eyebrow">
            The internship
          </Heading>
          <Heading as="h2" size="display" id="internship-title" data-enter="headline">
            Every Learner Interns. Many Change Lanes.
          </Heading>
          <Text size="lg" tone="secondary" data-enter="sub">
            The PGP includes a three-to-six-month internship across business functions.
          </Text>
        </div>

        {/* the numbers: the Placements grid's stat panel, three cells with hairlines between */}
        {/* the numbers as Placements' cohort boxes (2026-10-07, the team's ask): a grey box each, three
            levels only: the eyebrow, the figure, what it counts (the icons and second lines are gone) */}
        <ul className="in-boxes">
          {STATS.map((stat) => (
            <li key={stat.label} data-card className="pl-figure-box relative isolate overflow-hidden">
              <div data-card-body>
                <Heading as="p" size="eyebrow" className="text-content-brand">
                  {stat.eyebrow}
                </Heading>
                <p className="type-h1 mt-2 text-content">{stat.figure.join('')}</p>
                <p className="mt-1 text-content-secondary">{stat.caption}</p>
              </div>
              {/* the green the cell comes up in (clear at rest) */}
              <span data-card-tint aria-hidden className="pl-tint" />
            </li>
          ))}
        </ul>
        <Text size="sm" tone="secondary" className="in-functions-line" data-fade>
          Roles across {FUNCTIONS.slice(0, -1).join(', ')} and {FUNCTIONS[FUNCTIONS.length - 1]}.
        </Text>

        <div className="in-carousel" data-fade>
          <Heading as="h3" size="eyebrow" className="mb-4 text-content-secondary">
            Success stories
          </Heading>
          {/* shorts, in a reel row (2026-10-09); the card stack (<Stories />) was here */}
          <StoryReels reels={REELS} label="Learners: success stories" />
        </div>

        {/* where they interned: the Placements grid's logo frame, one logo to a cell */}
        <div className="in-companies" data-fade>
          <Heading as="h3" size="eyebrow" className="mb-4 text-content-secondary">
            Our learners are now creating impact at
          </Heading>
          <LogoGrid />
        </div>
      </Container>
      </PlacementsMotion>
    </Section>
  );
}
