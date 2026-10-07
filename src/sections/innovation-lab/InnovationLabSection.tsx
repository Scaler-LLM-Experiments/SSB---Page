'use client';

import * as React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Container, Heading, Section, Text } from '@kishanscaler/ssx-ui';
import { ease, motionTokens, prefersReducedMotion, useMotion } from '@kishanscaler/ssx-ui/motion';

import { labBand, labTurn, labVentures } from '@/content/innovation-lab';
import { VentureCard } from '@/sections/community/VentureCard';
import '@/sections/community/community.css';
import { HeroTitle } from '@/sections/hero/HeroTitle';
import { Accent } from '@/sections/shared/Accent';
import { RowSection } from '@/sections/shared/RowSection';
import './innovation-lab.css';

const { duration: d, stagger: st, offset } = motionTokens;

/** Where the scroll moment plays (innovation-lab.css gives the track its length under the same query). */
const LIVE = '(min-width: 1056px) and (min-height: 640px)';
/** The share of the moment the photo takes to pull back into its tile; the rest is a hold. */
const CLOSE = 0.82;
/** How far out (and how much larger) the other tiles start, as a multiple of where they land. */
const SPREAD = 1.28;
/** The mosaic's places for the photos after the first, in order (innovation-lab.css). */
const AREAS = ['a', 'b', 'd', 'e'] as const;

/**
 * The Scaler Innovation Lab (2026-10-07). One moment, on desktop: the lab's photo of students
 * building a drone arrives full-bleed, sticks under the nav, and the camera pulls back: its frame
 * closes into the middle tile of a mosaic of the lab (a robotic hand, the glass-walled labs, a
 * drone in flight, a mentor trying a student's build), the other tiles settling in from beyond
 * the edges as the header (eyebrow, heading, line, as the curriculum's) and the three figures
 * (green, at its right) come up over them. Then the startups the lab incubates, as Beyond
 * Placements' cards, under a subheading (one section: a smaller heading, closer).
 *
 * The frame closes with `clip-path` and the photo inside it only ever scales down, so it stays
 * sharp; the tiles move by transforms. Below desktop, on a short screen and under reduced motion
 * the mosaic is simply there (its tiles wipe open as the faculty cards do, the head fades up).
 *
 * The photos are Scaler's own, from its Innovation Lab page (public/media/CREDITS.md). Tried that
 * day, before them, on the team's footage of the lab (Rubenius' film: soft, busy, watermarked):
 * the copy over it as a breaker, in turn (the team's verdicts): centred over a black gradient
 * ("very bad, make it classy"); a blur rising behind the copy melting into the page ("gradient
 * and fade looking weird"); one even blur ("make it premium"); a feathered backdrop; the hero's
 * layout on black; that blur over a cropped clip ("getting cropped, looks bad"); the clip uncropped
 * with the copy on a blur from the left ("ghatiya"); then the footage framed under the name and
 * figures, on white ("looks flat, doesn't excite anyone"). After this moment, that day: the
 * photos simply rising in under the header; the figures in a band of their own, then on green
 * tiles in the grid ("looks like Lumia"), then in a box above it; the team came back to this
 * ("go with the older layout"). Before all that: a sticky pitch beside count-up stat cards and a
 * framed row of banner cards (in git history).
 */
export function InnovationLabSection() {
  return (
    <>
      <LabBand />
      <RowSection
        id="sil"
        title="Startups incubated in the Innovation Lab"
        heading={
          // a subheading within the lab's section (the team's call): h3, a step smaller
          <Heading
            as="h3"
            size="1"
            id="sil-title"
            data-enter="headline"
            className="lab-sub max-w-(--size-measure-max) [text-wrap:balance]"
          >
            <span className="block">
              <Accent text={labTurn.setup} word={labTurn.accent} />
            </span>
            <span className="block">{labTurn.lead}</span>
          </Heading>
        }
        itemName="startup"
        cardWidth="38rem"
      >
        {labVentures.map((v) => (
          <VentureCard key={v.company} {...v} />
        ))}
      </RowSection>
    </>
  );
}

function LabBand() {
  const scope = React.useRef<HTMLElement>(null);
  useLabMotion(scope);
  const [first, ...rest] = labBand.photos;

  return (
    <Section ref={scope} density="roomy" aria-labelledby="sil-band-title" className="lab">
      <div data-lab-track className="lab-track">
        <div data-lab-stage className="lab-stage">
          <Container className="lab-frame">
            <div data-lab-head className="lab-head">
              {/* the page's section header, as the curriculum's: eyebrow, heading, the line under it */}
              <div className="lab-copy flex flex-col gap-3">
                <Heading as="p" size="eyebrow" className="text-content-brand">
                  {labBand.eyebrow}
                </Heading>
                <Heading as="h2" size="display" id="sil-band-title">
                  {/* keeps "non-technical" whole: it broke after "non-" */}
                  <HeroTitle title={labBand.title} />
                </Heading>
                <Text size="lg" tone="secondary">
                  {labBand.line}
                </Text>
              </div>
              <ul className="lab-stats">
                {labBand.stats.map((s) => (
                  <li key={s.label} className="lab-stat">
                    <p className="lab-stat-value">{s.value}</p>
                    <p className="lab-stat-label">{s.label}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div data-lab-mosaic className="lab-mosaic">
              {/* the first photo's tile: the moment lifts the photo out of it, over the whole stage */}
              <div data-lab-slot className="lab-slot">
                <figure data-lab-hero className="lab-tile lab-hero">
                  <img
                    src={first.src}
                    srcSet={first.srcSet}
                    sizes="100vw"
                    alt={first.alt}
                    width={1890}
                    height={1138}
                    loading="lazy"
                    decoding="async"
                    style={{ objectPosition: first.position }}
                  />
                </figure>
              </div>
              {rest.map((photo, i) => (
                <figure key={photo.src} data-lab-tile data-area={AREAS[i]} className="lab-tile">
                  <img
                    src={photo.src}
                    srcSet={photo.srcSet}
                    // the tile crops a landscape photo to a tall box: it is drawn wider than the tile
                    sizes="(min-width: 1056px) 44vw, 50vw"
                    alt={photo.alt}
                    width={1400}
                    height={843}
                    loading="lazy"
                    decoding="async"
                    style={{ objectPosition: photo.position }}
                  />
                </figure>
              ))}
            </div>
          </Container>
        </div>
      </div>
    </Section>
  );
}

/**
 * The lab's motion. On desktop (LIVE, with motion), the scroll moment: the track is tall (CSS) and
 * its stage sticks under the nav; scrubbed to the scroll, the first photo, laid over the whole
 * stage, is trimmed by `clip-path` from the stage's edges to its tile's (its corners rounding in)
 * while it scales down about the tile's centre just enough to keep covering it; the other tiles
 * come in from SPREAD times their distance from it, at SPREAD times their size, under it; the head
 * fades up once the frame has closed halfway. Every box is measured on refresh, untransformed.
 * Otherwise, an entrance: the head fades up, each tile wipes open as it is reached.
 */
function useLabMotion(scope: React.RefObject<HTMLElement | null>) {
  useMotion(
    () => {
      const root = scope.current;
      if (!root || prefersReducedMotion(root)) return;
      gsap.registerPlugin(ScrollTrigger);

      const one = <T extends Element = HTMLElement>(hook: string) => root.querySelector<T>(`[${hook}]`);
      const track = one('data-lab-track');
      const stage = one('data-lab-stage');
      const head = one('data-lab-head');
      const mosaic = one('data-lab-mosaic');
      const slot = one('data-lab-slot');
      const hero = one('data-lab-hero');
      const photo = hero?.querySelector('img');
      const tiles = gsap.utils.toArray<HTMLElement>('[data-lab-tile]', root);
      if (!track || !stage || !head || !mosaic || !slot || !hero || !photo) return;

      const mm = gsap.matchMedia();

      mm.add(LIVE, () => {
        root.setAttribute('data-lab-live', '');

        // The stage's box, the tile the photo closes into and each other tile's offset from that
        // tile's centre, all in the stage's coordinates.
        const geo = { top: 0, right: 0, bottom: 0, left: 0, cx: 0, cy: 0, scale: 1, radius: 0, rise: 0 };
        let offsets = tiles.map(() => ({ x: 0, y: 0 }));
        const measure = () => {
          gsap.set(tiles, { clearProps: 'transform' });
          const s = stage.getBoundingClientRect();
          const r = slot.getBoundingClientRect();
          geo.top = r.top - s.top;
          geo.left = r.left - s.left;
          geo.right = s.right - r.right;
          geo.bottom = s.bottom - r.bottom;
          geo.cx = geo.left + r.width / 2;
          geo.cy = geo.top + r.height / 2;
          // scaled about the tile's centre, the photo must still cover the tile on every side
          const half = [r.width / 2 / geo.cx, r.width / 2 / (s.width - geo.cx)];
          const tall = [r.height / 2 / geo.cy, r.height / 2 / (s.height - geo.cy)];
          geo.scale = Math.min(1, Math.max(...half, ...tall) * 1.02);
          geo.radius = parseFloat(getComputedStyle(tiles[0] ?? slot).borderTopLeftRadius) || 0;
          // the head rises the system's entrance offset (a rem length), in px
          geo.rise =
            parseFloat(offset.enter) * parseFloat(getComputedStyle(document.documentElement).fontSize);
          offsets = tiles.map((tile) => {
            const b = tile.getBoundingClientRect();
            return { x: b.left - s.left + b.width / 2 - geo.cx, y: b.top - s.top + b.height / 2 - geo.cy };
          });
        };

        const at = { closed: 0, head: 0 };
        const render = () => {
          const p = at.closed;
          const out = SPREAD - 1;
          hero.style.clipPath = `inset(${geo.top * p}px ${geo.right * p}px ${geo.bottom * p}px ${
            geo.left * p
          }px round ${geo.radius * p}px)`;
          gsap.set(photo, {
            scale: 1 + (geo.scale - 1) * p,
            transformOrigin: `${geo.cx}px ${geo.cy}px`,
          });
          tiles.forEach((tile, i) =>
            gsap.set(tile, {
              x: offsets[i].x * out * (1 - p),
              y: offsets[i].y * out * (1 - p),
              scale: 1 + out * (1 - p),
            }),
          );
          gsap.set(head, { opacity: at.head, y: (1 - at.head) * geo.rise });
        };
        measure();
        render();

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          onUpdate: render,
          scrollTrigger: {
            // from the stage sticking under the nav (its CSS `top`) to its track's end
            trigger: track,
            start: () => `top top+=${parseFloat(getComputedStyle(stage).top) || 0}`,
            end: 'bottom bottom',
            // the hero's smoothing: light, so a quick flick doesn't outrun the moment
            scrub: d.slow,
            invalidateOnRefresh: true,
            onRefresh: () => {
              measure();
              render();
            },
          },
        });
        tl.to(at, { closed: 1, duration: CLOSE, ease: ease('expressiveInOut') }, 0)
          .to(at, { head: 1, duration: CLOSE * 0.4, ease: ease('expressiveEntrance') }, CLOSE * 0.5)
          .to({}, { duration: 1 - CLOSE });

        return () => {
          root.removeAttribute('data-lab-live');
          hero.style.clipPath = '';
          gsap.set([photo, head, ...tiles], { clearProps: 'transform,transformOrigin,opacity' });
        };
      });

      mm.add(`not all and ${LIVE}`, () => {
        const enter = ease('expressiveEntrance');
        const long = d.slower;
        gsap.fromTo(
          head,
          { autoAlpha: 0, y: offset.enter },
          {
            autoAlpha: 1,
            y: 0,
            duration: d.slowest,
            ease: enter,
            clearProps: 'transform,opacity,visibility',
            scrollTrigger: { trigger: head, start: 'clamp(top 85%)', once: true },
          },
        );
        // each tile wipes open bottom to top as it is reached (those arriving together one stagger
        // apart), its photo settling from a slight zoom: the faculty cards' entrance
        const cards = [hero, ...tiles];
        const radius = getComputedStyle(hero).borderTopLeftRadius || '0px';
        gsap.set(cards, { clipPath: `inset(100% 0% 0% 0% round ${radius})` });
        ScrollTrigger.batch(cards, {
          start: 'clamp(top 85%)',
          once: true,
          onEnter: (batch) =>
            batch.forEach((card, i) => {
              gsap.to(card, {
                clipPath: `inset(0% 0% 0% 0% round ${radius})`,
                duration: long * 1.25,
                delay: i * st.base * 1.5,
                ease: ease('expressiveInOut'),
                clearProps: 'clipPath',
              });
              gsap.fromTo(
                card.querySelector('img'),
                { scale: 1.18 },
                {
                  scale: 1,
                  duration: long * 1.5,
                  delay: i * st.base * 1.5,
                  ease: enter,
                  clearProps: 'transform',
                },
              );
            }),
        });
        return () => gsap.set(cards, { clearProps: 'clipPath' });
      });

      return () => mm.revert();
    },
    scope,
    [],
  );
}
