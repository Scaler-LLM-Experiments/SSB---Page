'use client';

import * as React from 'react';
import { Button, Container, Heading, Section, Text } from '@kishanscaler/ssx-ui';
import {
  ArrowUpRight,
  Briefcase,
  ChatTeardropText,
  Confetti,
  DownloadSimple,
  Handshake,
  PlayIcon,
  Receipt,
} from '@phosphor-icons/react';

import {
  deckAiProducts,
  deckBusinessFacts,
  deckBusinesses,
  deckClose,
  deckImmersions,
  deckLiveProjects,
  deckOnCampus,
  deckStories,
  deckUsps,
  deckWhy,
  deckWhyFigures,
} from '@/content/deck';
import { why } from '@/content/why';
import { creators, domesticImmersions } from '@/content/immersions';
import { CreatorCard } from '@/sections/immersions/ImmersionsSection';
import { useSectionEntrance } from '@/sections/faculty/useSectionEntrance';
import { REELS } from '@/sections/internship/InternshipSection';
import { Lightbox } from '@/sections/learn-by-doing/LearnByDoingSection';
import { TOOL_LOGOS } from '@/sections/curriculum/journey/tool-logos';
import '@/sections/learn-by-doing/learn-by-doing.css';
import { StoryReels } from '@/sections/internship/StoryReels';
import { StoryCard } from '@/sections/shared/cards';
import { RowSection } from '@/sections/shared/RowSection';
import { ScrollDots } from '@/sections/shared/ScrollDots';
import { Title } from '@/sections/shared/Title';
import { WhyBreaker } from '@/sections/why/WhyBreaker';
import '@/sections/community/community.css';
import '@/sections/why/why.css';
import '@/sections/internship/internship.css';
import './deck.css';

/*
 * The deck variant's own sections (/v7, 2026-10-28): the slides nothing on vFinal covered, or
 * covered in other words. Each in the page's vocabulary: the section header (eyebrow, display title
 * as "Lead.|Tail.", a large secondary line), 8px cards, the type roles of type-standard.css, and the
 * one gentle entrance (useSectionEntrance). Copy in src/content/deck.ts.
 */

/** The page's section header, as RowSection's: eyebrow, title, line. */
function Header({ id, eyebrow, title, sub }: { id: string; eyebrow?: string; title: string; sub?: string }) {
  return (
    <div data-enter="header" className="flex max-w-(--size-measure-max) flex-col gap-3">
      {eyebrow ? (
        <Heading as="p" size="eyebrow" className="text-content-brand" data-enter="eyebrow">
          {eyebrow}
        </Heading>
      ) : null}
      <Heading as="h2" size="display" id={`${id}-title`} data-enter="headline">
        <Title text={title} />
      </Heading>
      {sub ? (
        <Text size="lg" tone="secondary" data-enter="sub">
          {sub}
        </Text>
      ) : null}
    </div>
  );
}

/**
 * Slide 4: vFinal's Kamath breaker (his clip and the 60% / 62% figures), framed as the first fold, in
 * the stakeholders' words: the title and its line, his remark as a small note, the roles as pills.
 */
export function DeckWhySection() {
  return (
    <div className="dk-frame">
      {/* the figures back with the 4b copy, the second simplified (2026-10-28, the user's ask) */}
      <WhyBreaker quote={why.quote} figures={deckWhyFigures} copy={deckWhy} />
    </div>
  );
}

/**
 * Slide 7, under the investors' row: Sidhant Goyal's words on the left, the VC events (20+ VCs on
 * campus) on the right; one column on a phone.
 */
export function DeckOnCampusQuote() {
  const ref = React.useRef<HTMLElement>(null);
  useSectionEntrance(ref, { decks: ['.dk-quote-grid > *'] });
  const c = deckOnCampus;
  return (
    <Section ref={ref} density="roomy" aria-label="What investors say" className="dk-tight-top">
      <Container>
        <div className="dk-quote-grid">
          <figure className="dk-quote">
            <blockquote>
              <Heading as="p" size="2" className="dk-quote-text" data-part="title">
                “{c.quote}”
              </Heading>
            </blockquote>
            <figcaption className="dk-quote-by" data-part="description">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.photo} alt="" width={96} height={96} loading="lazy" decoding="async" />
              <span>
                <b>{c.name}</b>
                <span>{c.role}</span>
              </span>
            </figcaption>
          </figure>
          <div className="dk-events">
            <p className="dk-events-value" data-part="title">
              {c.events.value}
            </p>
            <p className="dk-events-label">{c.events.label}</p>
            <Text size="md" tone="secondary" className="dk-events-text" data-part="description">
              {c.events.text}
            </Text>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/**
 * Slide 9: the two businesses as vertical cards (2026-10-28, the user's ask): the video's thumbnail on
 * top with a play button (the film opens in the learn-by-doing lightbox), the programme's name and its
 * line, three figures in a highlighted strip, then the proof under a hairline.
 */
export function DeckBusinessSection() {
  const ref = React.useRef<HTMLElement>(null);
  useSectionEntrance(ref, { decks: ['.dk-biz-grid > article'] });
  const [open, setOpen] = React.useState<{ id: string; title: string } | null>(null);
  const c = deckBusinesses;
  return (
    <Section ref={ref} density="roomy" aria-labelledby="dk-biz-title">
      <Container>
        <div className="mb-8">
          <Header id="dk-biz" title={c.title} />
        </div>
        <div className="dk-biz-grid">
          {c.cards.map((b) => (
            <article key={b.label} className="dk-biz">
              <button
                type="button"
                className="dk-biz-media"
                onClick={() => setOpen(b.video)}
                aria-label={`Play video: ${b.video.title}`}
                data-part="photo"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.image} alt="" width={1280} height={720} loading="lazy" decoding="async" />
                <span className="lb-play-disc" aria-hidden="true">
                  <PlayIcon weight="fill" />
                </span>
              </button>
              <div className="dk-biz-body">
                <Heading as="h3" size="3" className="dk-biz-title" data-part="title">
                  {b.label}
                </Heading>
                <p className="dk-biz-sub" data-part="description">
                  {b.sub}
                </p>
                {/* (2026-10-28, the user's ask) no stat strip: the figures are in the line above; the proof
                    highlighted on its own, green on grey */}
                <div className="dk-biz-proof dk-biz-proof--panel" data-part="description">
                  <span className="dk-biz-proof-k">{b.proof.tag}</span>
                  <p className="dk-biz-proof-t">
                    {/* the figure (₹15L+) lit in the panel's mint */}
                    {b.proof.text.split(/(₹[\d.,]+[KLC]r?\+?)/).map((part, k) =>
                      k % 2 ? (
                        <strong key={k}>{part}</strong>
                      ) : (
                        <React.Fragment key={k}>{part}</React.Fragment>
                      ),
                    )}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
      {open ? <Lightbox id={open.id} title={open.title} onClose={() => setOpen(null)} /> : null}
    </Section>
  );
}

/**
 * Slide 9, under the two businesses (2026-10-28, the user's ask: images, padding, a gap from the cards
 * above): a sub-heading, then the fund, the demo days, the lab and the mentors as photo cards (the
 * photo inset at the top, 12px in, then the title and its line).
 */
export function DeckBusinessFacts() {
  const ref = React.useRef<HTMLElement>(null);
  const rowRef = React.useRef<HTMLUListElement>(null);
  useSectionEntrance(ref, { decks: ['.dk-facts > li'] });
  const c = deckBusinessFacts;
  return (
    <Section ref={ref} density="roomy" aria-labelledby="dk-backed-title" className="dk-tight-top">
      <Container>
        <Heading as="h3" size="2" id="dk-backed-title" className="dk-facts-head" data-enter="headline">
          {c.title}
        </Heading>
        {/* a row scrolled sideways (2026-10-28, the user's ask: four in the column read cramped), as the
            page's other rows: snapping card to card, the dots and arrows under it */}
        <ul ref={rowRef} className="dk-facts" aria-label={c.title}>
          {c.items.map((f) => (
            <li key={f.title} className="dk-photo-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.image} alt="" loading="lazy" decoding="async" data-part="photo" />
              <div className="dk-photo-card-body">
                <p className="dk-card-title" data-part="title">
                  {f.title}
                </p>
                <p className="dk-card-text" data-part="description">
                  {f.text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
      <div className="dk-facts-dots">
        <ScrollDots scroller={rowRef} count={c.items.length} itemName="card" fill="solid" autoplay={false} />
      </div>
    </Section>
  );
}

/** A tool's mark in its brand colour (the AI journey's vendored logos), or its initial. */
function ToolMark({ name }: { name: string }) {
  const l = TOOL_LOGOS[name];
  if (!l) return <span className="dk-tool-mono">{name.charAt(0)}</span>;
  return (
    <svg
      viewBox={l.vb}
      fill={l.ink ? 'currentColor' : (l.color ?? 'currentColor')}
      fillRule={l.evenodd ? 'evenodd' : undefined}
      aria-label={name}
      role="img"
      dangerouslySetInnerHTML={{ __html: l.svg }}
    />
  );
}

/** The products' icons, in the content's order (2026-10-28). */
const PRODUCT_ICONS = [Receipt, ChatTeardropText, Handshake, Briefcase, Confetti];

/**
 * Slide 10 (2026-10-28, the user's ask): the three steps as white cards, each led by a panel that
 * proves it (the tools' logos; the mentors' faces; the products and hackathons as figures), then its
 * title and one line; then the kinds of
 * products as a sideways row of cards, each an icon on a pale green panel (as the live site's
 * "products like" tiles) over its name and line, the dots and arrows under them.
 */
export function DeckAiProductsSection() {
  const c = deckAiProducts;
  const ref = React.useRef<HTMLElement>(null);
  const rowRef = React.useRef<HTMLUListElement>(null);
  useSectionEntrance(ref, { decks: ['.dk-steps > li', '.dk-products > li'] });
  return (
    <Section ref={ref} density="roomy" aria-labelledby="dk-ai-title">
      <Container>
        <div className="mb-8">
          <Header id="dk-ai" eyebrow={c.eyebrow} title={c.title} />
        </div>
        <ol className="dk-steps">
          {c.steps.map((st) => (
            <li key={st.title} className="dk-step">
              <div className="dk-step-art" data-part="photo">
                {'tools' in st && st.tools ? (
                  <ul className="dk-step-tools" aria-label="Tools">
                    {st.tools.map((t) => (
                      <li key={t} title={t}>
                        <ToolMark name={t} />
                      </li>
                    ))}
                    <li className="dk-step-more" aria-hidden="true">
                      +17
                    </li>
                  </ul>
                ) : null}
                {'mentors' in st && st.mentors ? (
                  <ul className="dk-step-mentors" aria-label="Mentors">
                    {st.mentors.map((m) => (
                      <li key={m.name}>
                        <span className="dk-avatar">
                          {m.photo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={m.photo} alt="" loading="lazy" decoding="async" />
                          ) : (
                            m.name
                              .split(' ')
                              .map((w) => w[0])
                              .join('')
                          )}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img className="dk-avatar-logo" src={m.logo} alt="" loading="lazy" decoding="async" />
                        </span>
                        <span className="dk-avatar-name">{m.name}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {'figures' in st && st.figures ? (
                  <dl className="dk-step-figures">
                    {st.figures.map((f) => (
                      <div key={f.label}>
                        <dd>{f.value}</dd>
                        <dt>{f.label}</dt>
                      </div>
                    ))}
                  </dl>
                ) : null}
                {'badges' in st && st.badges ? (
                  <p className="dk-step-badges">
                    {st.badges.map((b) => (
                      <span key={b}>{b}</span>
                    ))}
                  </p>
                ) : null}
              </div>
              <div className="dk-step-body">
                <Heading as="h3" size="3" className="dk-card-title" data-part="title">
                  {st.title}
                </Heading>
                <p className="dk-card-text" data-part="description">
                  {st.line}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <Heading as="h3" size="2" className="dk-facts-head dk-products-head">
          {c.productsTitle}
        </Heading>
        <ul ref={rowRef} className="dk-facts dk-products" aria-label={c.productsTitle}>
          {c.products.map((pr, i) => {
            const Icon = PRODUCT_ICONS[i];
            return (
              <li key={pr.title} className="dk-photo-card dk-product">
                <span className="dk-product-art" aria-hidden="true" data-part="photo">
                  <Icon weight="duotone" />
                </span>
                <div className="dk-photo-card-body">
                  <p className="dk-card-title" data-part="title">
                    {pr.title}
                  </p>
                  <p className="dk-card-text" data-part="description">
                    {pr.text}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
      <div className="dk-facts-dots">
        <ScrollDots scroller={rowRef} count={c.products.length} itemName="product" fill="solid" autoplay={false} />
      </div>
    </Section>
  );
}

/**
 * Slide 15: the students' success stories, as the internship section's shorts (StoryReels: each plays
 * the campus film until the learner's own short is in the project), here as a section of their own.
 */
export function DeckStoriesSection() {
  const ref = React.useRef<HTMLElement>(null);
  useSectionEntrance(ref, { decks: [] });
  const c = deckStories;
  return (
    <Section ref={ref} density="roomy" aria-labelledby="dk-stories-title" className="overflow-x-clip">
      <Container>
        <div className="mb-10 sm:mb-12">
          <Header id="dk-stories" eyebrow={c.eyebrow} title={c.title} sub={c.sub} />
        </div>
        <div data-enter="block">
          <StoryReels reels={REELS} label="Students: success stories" />
        </div>
      </Container>
    </Section>
  );
}

/**
 * Slides 9–12, the four USPs (2026-10-28, the user's ask): vFinal's "How you learn" header over its
 * numbered side navigation (CurriculumRail), each block tagged with its number ("01 Build real
 * businesses"), as the live site numbers its pillars. `DeckUspHead` is the header; `DeckUsp` tags one block.
 */
export function DeckUspHead() {
  const ref = React.useRef<HTMLElement>(null);
  useSectionEntrance(ref, { decks: [] });
  return (
    <Section ref={ref} density="roomy" aria-labelledby="dk-usp-title" className="dk-usp-head">
      <Container>
        <Header id="dk-usp" eyebrow={deckUsps.eyebrow} title={deckUsps.title} sub={deckUsps.sub} />
      </Container>
    </Section>
  );
}

export function DeckUsp({ num, label, children }: { num: string; label: string; children: React.ReactNode }) {
  return (
    <div className="dk-usp" data-usp={num}>
      <Container>
        <p className="dk-usp-tag">
          <span className="dk-usp-num">{num}</span>
          <span>{label}</span>
        </p>
      </Container>
      {children}
    </div>
  );
}

/**
 * Slide 11 (2026-10-28, the user's ask: the page's theme, less cluttered): two feature cards, the
 * domestic immersions (a factory floor; the three companies listed inside) and the creator-preneur
 * track (the Jio Creative Labs photo), their photos on alternate sides; then the lab's creators as
 * vFinal's creator cards, refined.
 */
export function DeckImmersionsSection() {
  const ref = React.useRef<HTMLElement>(null);
  const tripRef = React.useRef<HTMLUListElement>(null);
  const creatorRef = React.useRef<HTMLUListElement>(null);
  useSectionEntrance(ref, { decks: ['.dk-track', '.dk-trips > li', '.dk-creators > li'] });
  const c = deckImmersions;
  return (
    <Section ref={ref} density="roomy" aria-labelledby="dk-imm-title">
      <Container>
        <div className="mb-8">
          <Header id="dk-imm" title={c.title} />
        </div>
        <article className="dk-track dk-track--flip">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="dk-track-photo" src={c.trips.image} alt="A factory floor" loading="lazy" decoding="async" data-part="photo" />
          <div className="dk-track-body">
            <p className="dk-track-label">{c.trips.label}</p>
            <Heading as="h3" size="2" className="dk-track-title" data-part="title">
              {c.trips.title}
            </Heading>
            <p className="dk-card-text dk-track-line" data-part="description">
              {c.trips.line}
            </p>
          </div>
        </article>
        </Container>
        <Container>
        <ul ref={tripRef} className="dk-facts dk-trips" aria-label={c.trips.title}>
          {domesticImmersions.map((t) => (
            <li key={t.name} className="dk-photo-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={t.image.src}
                alt=""
                loading="lazy"
                decoding="async"
                data-part="photo"
                style={t.image.position ? { objectPosition: t.image.position } : undefined}
              />
              <div className="dk-photo-card-body">
                {/* the company's logo, then the industry as the title, then the line (2026-10-28) */}
                {t.logo ? (
                  <span className="dk-trip-logo-box" data-part="title">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="dk-trip-logo" src={t.logo.src} alt={t.logo.alt} loading="lazy" decoding="async" />
                  </span>
                ) : null}
                {/* a student and what they did there (placeholders, deck.ts `trips.stories`) */}
                <p className="dk-card-title" data-part="title">
                  {c.stories[t.logo?.alt ?? '']?.name ?? t.name}
                </p>
                <p className="dk-card-text" data-part="description">
                  {c.stories[t.logo?.alt ?? '']?.did ?? t.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
      <div className="dk-facts-dots">
        <ScrollDots scroller={tripRef} count={domesticImmersions.length} itemName="immersion" fill="solid" autoplay={false} />
      </div>
      <Container>
        <article className="dk-track dk-track--jio">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="dk-track-photo" src={c.track.image} alt="The Jio Creative Labs sign" loading="lazy" decoding="async" data-part="photo" />
          <div className="dk-track-body">
            <p className="dk-track-label">{c.track.label}</p>
            <Heading as="h3" size="2" className="dk-track-title" data-part="title">
              {c.track.title}
            </Heading>
            <p className="dk-card-text dk-track-line" data-part="description">
              {c.track.line}
            </p>
          </div>
        </article>
        <p className="dk-creators-title">{c.track.creatorsTitle}</p>
        <ul ref={creatorRef} className="dk-creators" aria-label={c.track.creatorsTitle}>
          {creators.map((cr) => (
            <li key={cr.name}>
              {/* vFinal's creator card (2026-10-28, the user's ask), refined in deck.css */}
              <CreatorCard creator={cr} />
            </li>
          ))}
        </ul>
      </Container>
      <div className="dk-facts-dots dk-creators-dots">
        <ScrollDots scroller={creatorRef} count={creators.length} itemName="creator" fill="solid" autoplay={false} />
      </div>
    </Section>
  );
}

/**
 * Slide 12 (2026-10-28, the user's ask: the page's cards, real logos, smaller): the live projects as the
 * page's photo cards in a sideways row, each the brief's photo inset, the company's logo (its name
 * where there is none yet), the brief as the title and its line.
 */
export function DeckLiveProjectsSection() {
  const ref = React.useRef<HTMLElement>(null);
  const rowRef = React.useRef<HTMLUListElement>(null);
  useSectionEntrance(ref, { decks: ['.dk-live > li'] });
  const c = deckLiveProjects;
  return (
    <Section ref={ref} density="roomy" aria-labelledby="dk-live-title">
      <Container>
        <div className="mb-8">
          <Header id="dk-live" title={c.title} sub={c.sub} />
        </div>
        <ul ref={rowRef} className="dk-facts dk-trips dk-live" aria-label="Live projects">
          {c.projects.map((p) => (
            <li key={p.company} className="dk-photo-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt="" loading="lazy" decoding="async" data-part="photo" />
              <div className="dk-photo-card-body">
                <span className="dk-trip-logo-box" data-part="title">
                  {p.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="dk-trip-logo" src={p.logo} alt={p.company} loading="lazy" decoding="async" />
                  ) : (
                    <span className="dk-logo-word">{p.company}</span>
                  )}
                </span>
                <p className="dk-card-title" data-part="title">
                  {p.title}
                </p>
                <p className="dk-card-text" data-part="description">
                  {p.desc}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
      <div className="dk-facts-dots">
        <ScrollDots scroller={rowRef} count={c.projects.length} itemName="project" fill="solid" autoplay={false} />
      </div>
    </Section>
  );
}

/** Slide 30: the closing band, a photo full bleed under the call to apply. */
export function DeckCloseSection() {
  const c = deckClose;
  return (
    <section className="dk-close" aria-labelledby="dk-close-title" data-brand="ssb" data-theme="dark">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="dk-close-photo" src={c.image} alt={c.imageAlt} loading="lazy" decoding="async" />
      <span className="dk-close-scrim" aria-hidden="true" />
      <Container className="dk-close-body">
        <Heading as="h2" size="display" id="dk-close-title" className="dk-close-title">
          {c.title}
        </Heading>
        <Text size="lg" className="dk-close-line">
          {c.line}
        </Text>
        <div className="dk-close-actions" data-brand="ssb" data-theme="light">
          <Button asChild size="lg" variant="primary">
            <a href={c.primaryCta.href}>
              {c.primaryCta.label}
              <ArrowUpRight weight="bold" aria-hidden="true" />
            </a>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <a href={c.secondaryCta.href}>
              {c.secondaryCta.label}
              <DownloadSimple weight="bold" aria-hidden="true" />
            </a>
          </Button>
        </div>
      </Container>
    </section>
  );
}
