import './story-card.css';

/** `scale`: a compact mark (a stacked badge) drawn larger than the wordmarks' height. */
export type CardLogo = {
  name: string;
  /** The mark's file; without one the name is set as a white wordmark. */
  src?: string;
  scale?: number;
  /** The brand's colour, the tile's ground when the logos flip (the mark drawn white on it). */
  bg?: string;
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
        {logos && logos.length > 1 ? (
          // side by side, each on its brand's colour (2026-10-13; they flipped in one tile before)
          <div className="meet-card__pair" data-part="logos" role="img" aria-label={logos.map((l) => l.name).join(', ')}>
            {logos.slice(0, 2).map((l) => (
              <span key={l.name} className="meet-card__flip-face" style={{ background: l.bg }}>
                {l.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={l.src} alt="" loading="lazy" />
                ) : (
                  <span className="meet-card__flip-word">{l.name}</span>
                )}
              </span>
            ))}
          </div>
        ) : logo?.src ? (
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
