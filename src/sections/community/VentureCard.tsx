import * as React from 'react';
import { Heading, Text } from '@kishanscaler/ssx-ui';

import type { Venture } from '@/content/community';

/** The photo and its two blurred copies (soft, then deep toward the foot), as Why SSB's stories. */
const LAYERS = ['', 'soft', 'deep'] as const;

const initials = (name: string) =>
  name
    .replace(/^Dr\.?\s+/, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join('');

/** One founder by full name; two by first names ("Mayank & Sanskriti"), so the pair fits one line. */
const names = (founders: string[]) =>
  founders.length > 1 ? founders.map((n) => n.split(/\s+/)[0]).join(' & ') : founders[0];

/**
 * A company a student started or grew (Beyond Placements, 2026-10-07; the team's brief): a card
 * with a square photo inset at its left (12px in, 12px corners, as Why SSB's chapter cards inset
 * theirs; the team: "our style"), its field on a glass chip at the top and its figure in white
 * over a progressive blur at the foot (the Why stories' blur: blurred copies revealed by
 * gradients, a scrim). At the right: the company; its founders (round photos, initials until
 * there is one) with their cohort under the names; and at the foot, level with the figure, a line on what
 * it is (when and where it started was tried, then cut). Below `sm` it stacks: the photo over the
 * copy. No photo
 * yet: the internship cards' dark plate, which needs no blur.
 *
 * Markup hooks for the section entrance (useSectionEntrance): the photo layers settle from a
 * slight zoom (`data-part="photo"`), the figure and copy rise in after (`title`, `description`).
 * Nothing between the chip and the photo has a mask, filter or opacity, or its glass would blur
 * nothing.
 */
export function VentureCard({
  company,
  founders,
  avatars,
  cohort = 'Cohort 1',
  description,
  sector,
  stat,
  image,
  imageSmall,
  imagePosition,
  imageAlt,
}: Venture) {
  return (
    <article className="vc">
      <div className="vc-media">
        <div className="vc-layers" data-part="photo">
          {image ? (
            LAYERS.map((layer) => (
              // eslint-disable-next-line @next/next/no-img-element -- fills its box, so it can't shift layout
              <img
                key={layer}
                src={image}
                srcSet={imageSmall ? `${imageSmall} 800w, ${image} 1400w` : undefined}
                // 16rem square on desktop, the card's width on a phone
                sizes="(min-width: 672px) 256px, 90vw"
                alt={layer ? '' : (imageAlt ?? '')}
                aria-hidden={layer ? true : undefined}
                loading="lazy"
                decoding="async"
                className={layer ? `vc-photo vc-blur vc-blur-${layer}` : 'vc-photo'}
                style={imagePosition ? { objectPosition: imagePosition } : undefined}
              />
            ))
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- fills its box, so it can't shift layout
            <img
              className="vc-photo vc-plate"
              src="/internship/plate.webp"
              alt=""
              loading="lazy"
              decoding="async"
            />
          )}
          <span aria-hidden className="vc-scrim" />
        </div>
        <span className="vc-tag type-label">{sector}</span>
        <p className="vc-stat" data-part="title">
          <span className="vc-stat-value">{stat.value}</span>
          <span className="vc-stat-label">{stat.label}</span>
        </p>
      </div>

      <div className="vc-body">
        <div className="vc-head">
          <Heading as="h3" size="2" data-part="title">
            {company}
          </Heading>
          <div className="vc-founders" data-part="description">
            <span className="vc-avatars" aria-hidden>
              {founders.map((name, i) => {
                const photo = avatars?.[i];
                return photo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- a fixed 32px avatar
                  <img
                    key={name}
                    className="vc-avatar"
                    src={photo}
                    alt=""
                    width={32}
                    height={32}
                    loading="lazy"
                  />
                ) : (
                  <span key={name} className="vc-avatar vc-avatar-initials">
                    {initials(name)}
                  </span>
                );
              })}
            </span>
            <span className="vc-who">
              <span className="vc-names">{names(founders)}</span>
              <span className="vc-role">{cohort}</span>
            </span>
          </div>
        </div>
        {/* at the foot, level with the figure */}
        <Text size="sm" tone="secondary" className="vc-text" data-part="description">
          {description}
        </Text>
      </div>
    </article>
  );
}
