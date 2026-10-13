import { Heading, Text } from '@kishanscaler/ssx-ui';

import { peerCompanies } from '@/content/alumni';
import { resolveLogos } from '@/lib/logos';
import type { HeroLogo } from '@/sections/hero/types';
import { PeersFlip } from './PeersFlip';
import '@/sections/hero/shared/hero.css';
import './alumni.css';

/** "Your peers come from": the logos in a grid of cells that flip one at a time (PeersFlip; it was the hero's ticker). Server-only (reads the files). */
export async function PeersTicker({
  companies = peerCompanies,
  title = 'Your peers come from companies like these',
  sub = null, // "Where the people in your cohort worked before SSB." removed (the team, 2026-10-13)
  label = 'Companies our students come from',
}: {
  /** Another list in the same flip grid (Placements C: the companies that have visited, 2026-10-12). */
  companies?: HeroLogo[];
  title?: string;
  /** null: no line under the title. */
  sub?: string | null;
  label?: string;
} = {}) {
  const logos = await resolveLogos(companies);
  return (
    <div className="flex flex-col gap-5" data-enter="block">
      {/* ssx-ui's Heading at the card-and-panel size (3), as Placements' "Companies that have visited"
          line, with a quiet line under it (Text, secondary): no longer the small grey caps (2026-10-09) */}
      <div className="flex flex-col gap-1">
        <Heading as="h3" size="3" className="peers-title">
          {title}
        </Heading>
        {sub ? (
          <Text size="md" tone="secondary">
            {sub}
          </Text>
        ) : null}
      </div>
      <PeersFlip logos={logos} label={label} />
    </div>
  );
}
