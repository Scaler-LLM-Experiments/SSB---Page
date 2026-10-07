import * as React from 'react';
import { ArrowUpRight } from '@phosphor-icons/react/ssr';
import { Heading, Text } from '@kishanscaler/ssx-ui';

import type { Venture } from '@/content/community';

/** The photo and its two blurred copies (soft, then deep toward the foot), as Why SSB's stories. */
const LAYERS = ['', 'soft', 'deep'] as const;

const bare = (name: string) => name.replace(/^Dr\.?\s+/, '');

const initials = (name: string) =>
  bare(name)
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join('');

/** One founder by full name; more by first names ("Mayank & Sanskriti", "Ravi, Vikas & Madhuker"). */
const names = (founders: string[]) => {
  if (founders.length === 1) return founders[0];
  const first = founders.map((n) => bare(n).split(/\s+/)[0]);
  return `${first.slice(0, -1).join(', ')} & ${first[first.length - 1]}`;
};

/**
 * A company (Beyond Placements' student ventures, 2026-10-07; the Innovation Lab's startups, the
 * same card): a square inset at its left (12px in, 12px corners, as Why SSB's chapter cards inset
 * their photos; the team: "our style"), its field on a glass chip at the top. In the square: a
 * photo with its figure in white over a progressive blur (the Why stories' blur: blurred copies
 * revealed by gradients, a scrim); or, with no photo, the internship cards' dark plate under the
 * figure; or a startup's banner, the square in its two colours with the banner across its middle
 * (a wide logo can't be cropped square). At the right: the company (an arrow to its site, if any);
 * its founders (round photos, initials until there is one) with their cohort or role under the
 * names; and at the foot, level with the figure, a line on what it is (when and where it started
 * was tried, then cut). Below `sm` it stacks.
 *
 * Markup hooks for the section entrance (useSectionEntrance): the square's layers settle from a
 * slight zoom (`data-part="photo"`), the figure and copy rise in after (`title`, `description`).
 * Nothing between the chip and the photo has a mask, filter or opacity, or its glass would blur
 * nothing.
 */
export function VentureCard({
  company,
  founders,
  avatars,
  role = 'Cohort 1',
  description,
  sector,
  stat,
  image,
  imageSmall,
  imagePosition,
  imageAlt,
  banner,
  href,
}: Venture) {
  return (
    <article className="vc">
      <div
        className="vc-media"
        data-banner={banner ? '' : undefined}
        style={
          banner
            ? ({ '--vc-top': banner.top, '--vc-bottom': banner.bottom } as React.CSSProperties)
            : undefined
        }
      >
        <div className="vc-layers" data-part="photo">
          {banner ? (
            // eslint-disable-next-line @next/next/no-img-element -- its width set, its height from the file's ratio
            <img
              className="vc-banner"
              src={banner.src}
              alt={`${company} logo`}
              width={1133}
              height={542}
              loading="lazy"
              decoding="async"
            />
          ) : image ? (
            (stat ? LAYERS : LAYERS.slice(0, 1)).map((layer) => (
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
          {stat ? <span aria-hidden className="vc-scrim" /> : null}
        </div>
        <span className="vc-tag type-label">{sector}</span>
        {stat ? (
          <p className="vc-stat" data-part="title">
            <span className="vc-stat-value">{stat.value}</span>
            <span className="vc-stat-label">{stat.label}</span>
          </p>
        ) : null}
      </div>

      <div className="vc-body">
        <div className="vc-head">
          <div className="vc-title">
            <Heading as="h3" size="2" data-part="title">
              {company}
            </Heading>
            {href ? (
              <a
                className="vc-link"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${company}'s website (opens in a new tab)`}
              >
                <ArrowUpRight aria-hidden />
              </a>
            ) : null}
          </div>
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
              <span className="vc-role">{role}</span>
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
