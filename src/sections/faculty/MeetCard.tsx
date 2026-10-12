import './story-card.css';

/** `scale`: a compact mark (a stacked badge) drawn larger than the wordmarks' height. */
export type CardLogo = { name: string; src: string; scale?: number };

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
        {logo ? (
          <div className="meet-card__logo" data-part="logos">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.src}
              alt={logo.name}
              loading="lazy"
              style={logo.scale ? ({ height: `calc(var(--meet-logo-h) * ${logo.scale})` } as React.CSSProperties) : undefined}
            />
          </div>
        ) : null}
        {stacked && bio ? (
          <p className="meet-card__bio" data-part="description">
            {bio}
          </p>
        ) : null}
      </div>
    </article>
  );
}
