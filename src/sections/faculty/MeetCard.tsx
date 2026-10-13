import { brandTile } from '@/content/brand-tiles';
import './story-card.css';

/** `scale`: a compact mark (a stacked badge) drawn larger than the wordmarks' height. */
export type CardLogo = {
  name: string;
  /** The mark's file; without one the name is set as a white wordmark. */
  src?: string;
  scale?: number;
  /** The brand's colour, the tile's ground when the logos flip (the mark drawn white on it). */
  bg?: string;
  /** Draw the mark in its own colours, not white (a multi-colour mark, on a white ground). */
  native?: boolean;
};

/**
 * Faculty card: the photo, with text over its dark base — a small kicker with
 * a rule under it, the name large, the role in capitals, then the company
 * wordmark in white. Centred on phones, left-aligned in the desktop row.
 */
export function MeetCard({
  image,
  name,
  role,
  logo,
  logos,
  kicker = 'Meet',
  align = 'center',
  priority = false,
  stacked = false,
  bio,
}: {
  image: string;
  name: string;
  role: string;
  logo?: CardLogo;
  /** Two or more: one tile that flips between them, each white on its brand colour. */
  logos?: CardLogo[];
  kicker?: string;
  align?: 'center' | 'start';
  /** Load the photo straight away at high priority (cards visible on first paint). */
  priority?: boolean;
  /** The photo on top and the text under it on the page (2026-10-12, the team's layout), not on the photo. */
  stacked?: boolean;
  /** A line or two under the logo (stacked only). */
  bio?: string;
}) {
  return (
    <article className="ssx-card" data-align={align} data-layout={stacked ? 'stacked' : undefined}>
      <div className="ssx-card__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt=""
          width={640}
          height={800}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          data-part="photo"
        />
      </div>
      <div className="meet-card__content">
        <p className="meet-card__kicker" data-part="title">
          {kicker}
        </p>
        <h3 className="meet-card__name" data-part="title">
          {name}
        </h3>
        <p className="meet-card__role" data-part="description">
          {role}
        </p>
        {/* every logo on its brand's tile (2026-10-13): two side by side, or one */}
        {(logos && logos.length > 1 ? logos : logo?.src ? [logo] : null) ? (
          <div className="meet-card__pair" data-part="logos" data-count={logos && logos.length > 1 ? 2 : 1} role="img" aria-label={(logos && logos.length > 1 ? logos : [logo!]).map((l) => l.name).join(', ')}>
            {(logos && logos.length > 1 ? logos.slice(0, 2) : [logo!]).map((l) => {
              const t = l.src ? brandTile(l.src) : null;
              return (
                <span key={l.name} className="meet-card__flip-face" style={{ background: t?.bg ?? l.bg }}>
                  {t ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.src} alt="" loading="lazy" data-native={t.white ? undefined : ''} />
                  ) : (
                    <span className="meet-card__flip-word">{l.name}</span>
                  )}
                </span>
              );
            })}
          </div>
        ) : null}
        {/* (the earlier markup, kept, off: the pair from `logos` on each `bg`; the single logo drawn
            white with no tile, `<div className="meet-card__logo"><img src={logo.src} … /></div>`,
            its height `--meet-logo-h` times `logo.scale`) */}
        {stacked && bio ? (
          <p className="meet-card__bio" data-part="description">
            {bio}
          </p>
        ) : null}
      </div>
    </article>
  );
}
