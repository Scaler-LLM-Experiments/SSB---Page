/**
 * A lab-only switch between the first-fold variants, fixed at the bottom of the
 * window. Plain links (?hero=…): each variant loads fresh, with its own intro
 * and scroll moment, rather than both mounting at once.
 */
const VARIANTS = [
  { id: 'cinematic', label: 'Cinematic' },
  { id: 'split', label: 'Split' },
] as const;

export type HeroVariant = (typeof VARIANTS)[number]['id'];

export function HeroVariantToggle({ current }: { current: HeroVariant }) {
  return (
    <nav
      aria-label="First fold variant"
      className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-border-subtle bg-surface-raised p-1"
      style={{ boxShadow: '0 10px 30px -12px rgb(0 0 0 / 0.35)' }}
      data-brand="ssb"
      data-theme="light"
    >
      <span className="whitespace-nowrap px-3 type-caption text-content-secondary">First fold</span>
      {VARIANTS.map((v) => (
        <a
          key={v.id}
          href={v.id === 'cinematic' ? '?' : `?hero=${v.id}`}
          aria-current={v.id === current ? 'page' : undefined}
          className={
            v.id === current
              ? 'whitespace-nowrap rounded-full bg-surface-inverse px-4 py-2 type-label text-content-inverse'
              : 'whitespace-nowrap rounded-full px-4 py-2 type-label text-content hover:bg-surface-subtle'
          }
        >
          {v.label}
        </a>
      ))}
    </nav>
  );
}
