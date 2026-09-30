/**
 * Full-screen brand splash, server-rendered so the SSB shield (monogram only)
 * is on screen from the first paint. The intro (`intro.ts`) then zooms the
 * camera into it: the shield's openings look through to the campus footage,
 * and the footage fills the screen. Needs `shared/hero.css`.
 *
 * Its ground follows the theme it sits in: white on a light page, black inside
 * a dark island.
 */
export function Splash() {
  return (
    <div data-splash aria-hidden="true" className="fixed inset-0 z-dialog">
      {/* What the camera flies into: the ground (with a shield-shaped window cut
          out once the intro opens it) and the mark filling that window. The lens
          stays screen-sized, so its motion blur is measured on screen, not scaled
          up with the zoom. */}
      <div data-splash-lens className="absolute inset-0">
        <div data-splash-zoom className="absolute inset-0">
          <div data-splash-ground className="hero-splash-ground absolute inset-0 bg-page" />
          <div className="absolute inset-0 grid place-items-center">
            <span data-splash-mark className="hero-splash-mark block size-32" />
          </div>
        </div>
        {/* Ghosts: faint copies of the mark that trail the zoom a step behind,
            smearing its edges toward the centre (zoom blur). */}
        {[1, 2].map((i) => (
          <div
            key={i}
            data-splash-ghost
            className="invisible absolute inset-0 grid place-items-center opacity-0"
          >
            <span className="hero-splash-mark block size-32" />
          </div>
        ))}
      </div>
    </div>
  );
}
