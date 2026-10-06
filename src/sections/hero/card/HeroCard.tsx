import { FoldCopy, FoldLeaders } from '../shared/FoldCopy';
import type { HeroContent } from '../types';
import './hero-card.css';

/**
 * The "split" first fold, a variant of the hero (?hero=split), after the team's
 * references: a light page under a light, frosted nav; the campus film full-bleed
 * in one large rounded card, under an SSB-green wash at the left and a dark fade.
 * At its bottom left: the eyebrow, a short, large title, the line, the actions
 * and the facts. At its bottom right, right-aligned: "Built by 100+ industry
 * leaders from" over the leaders running past, each a colour mark with its name
 * (as the AI curriculum's tools); both are the shared `FoldCopy`, which the
 * cinematic V2 lays out the same. One gentle entrance (CSS): the card settles in,
 * then the copy fades up.
 */
export function HeroCard(hero: HeroContent) {
  const { media, leadersLine, leaders } = hero;
  return (
    <section className="hc" aria-labelledby="hc-title">
      <div className="hc-card" data-brand="ssb" data-theme="dark">
        {media?.videoSrc ? (
          <video
            className="hc-media"
            src={media.videoSrc}
            poster={media.poster}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
        ) : null}
        <div className="hc-wash" aria-hidden="true" />

        <div className="hc-body">
          <FoldCopy hero={hero} titleId="hc-title" className="hc-copy" />
          {leaders?.length ? (
            <FoldLeaders line={leadersLine} leaders={leaders} className="hc-leaders" />
          ) : null}
        </div>
      </div>
    </section>
  );
}
