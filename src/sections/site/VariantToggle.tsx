import './variant-toggle.css';

/**
 * A lab-only switch between the home page's variants (2026-10-28, the user's ask): vFinal and the
 * deck variant (/v7, the stakeholders' deck in its order and words). Plain links, so each page loads
 * fresh. Desktop: the window's bottom-left corner, clear of the section nav's centred pill; phones:
 * the bottom-left, above the apply bar (the callback button has the right).
 */
const VARIANTS = [
  { id: 'vfinal', label: 'vFinal', href: '/vfinal' },
  { id: 'deck', label: 'Deck', href: '/v7' },
] as const;

export type HomeVariant = (typeof VARIANTS)[number]['id'];

export function VariantToggle({ current }: { current: HomeVariant }) {
  return (
    <nav aria-label="Page variant" className="vt" data-brand="ssb" data-theme="light">
      <span className="vt-label">Variant</span>
      {VARIANTS.map((v) => (
        <a key={v.id} href={v.href} aria-current={v.id === current ? 'page' : undefined} className="vt-item">
          {v.label}
        </a>
      ))}
    </nav>
  );
}
