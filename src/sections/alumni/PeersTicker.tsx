import { Heading, Text } from '@kishanscaler/ssx-ui';

import { peerCompanies } from '@/content/alumni';
import { resolveLogos } from '@/lib/logos';
import { PeersWall } from './PeersWall';
import '@/sections/hero/shared/hero.css';
import './alumni.css';

/** "Your peers come from": a card, the heading at its left and the logos drifting past in columns at its
 * right (PeersWall, 2026-10-12; before it a grid of cells that flipped one at a time, PeersFlip, and the hero's ticker). Server-only (reads the files). */
export async function PeersTicker() {
  const logos = await resolveLogos(peerCompanies);
  return (
    <div className="peers-card" data-enter="block">
      {/* ssx-ui's Heading at the card-and-panel size (3), as Placements' "Companies that have visited"
          line, with a quiet line under it (Text, secondary): no longer the small grey caps (2026-10-09) */}
      <div className="peers-card-copy flex flex-col gap-1">
        <Heading as="h3" size="3" className="peers-title">
          Your peers come from companies like these
        </Heading>
        <Text size="md" tone="secondary">
          Where the people in your cohort worked before SSB.
        </Text>
      </div>
      {/* the drifting wall (2026-10-12); the flip grid was here: <PeersFlip logos={logos} label=… />
          (PeersFlip.tsx, kept) */}
      <PeersWall logos={logos} label="Companies our students come from" />
    </div>
  );
}
