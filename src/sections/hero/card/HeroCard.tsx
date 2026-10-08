import { CREDITS_SIZING, SCHOOLS_SIZING, resolveLogos } from '@/lib/logos';
import { FoldCopy, FoldCredits, FoldFacts } from '../shared/FoldCopy';
import type { HeroContent } from '../types';
import './hero-card.css';

/**
 * The "split" first fold, a variant of the hero (?hero=split), after the team's
 * references: a light page under a light, frosted nav; the campus film full-bleed
 * in one large rounded card, under an SSB-green wash at the left and a dark fade.
 * At its bottom left: the eyebrow, a short, large title, the line and the
 * actions, the facts and the schools; then the leaders running past. Both
 * shared (`FoldCopy`, `FoldCredits`) with the
 * cinematic V2 lays out the same. One gentle entrance (CSS): the card settles in,
 * then the copy fades up.
 */
export async function HeroCard(hero: HeroContent) {
  const { media } = hero;
  const [leaders, schools] = await Promise.all([
    hero.leaders?.length ? resolveLogos(hero.leaders, CREDITS_SIZING) : [],
    hero.alumniFrom?.length ? resolveLogos(hero.alumniFrom, SCHOOLS_SIZING) : [],
  ]);
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
          <FoldFacts hero={hero} schools={schools} className="hc-leaders" />
          <FoldCredits line={hero.leadersLine} logos={leaders} className="hc-leaders" />
        </div>
      </div>
    </section>
  );
}
