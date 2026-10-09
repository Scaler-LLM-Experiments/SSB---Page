import { Heading } from '@kishanscaler/ssx-ui';

import { peerCompanies } from '@/content/alumni';
import { resolveLogos } from '@/lib/logos';
import { PeersFlip } from './PeersFlip';
import '@/sections/hero/shared/hero.css';
import './alumni.css';

/** "Your peers come from": the logos in a grid of cells that flip one at a time (PeersFlip; it was the hero's ticker). Server-only (reads the files). */
export async function PeersTicker() {
  const logos = await resolveLogos(peerCompanies);
  return (
    <div className="flex flex-col gap-6" data-enter="block">
      <Heading as="h3" size="eyebrow" className="text-center text-content-secondary">
        Your peers come from
      </Heading>
      <PeersFlip logos={logos} label="Companies our students come from" />
    </div>
  );
}
