import { ArrowRight, DownloadSimple } from '@phosphor-icons/react/ssr';

import type { CtaIconName } from './types';

/**
 * A CTA's trailing icon (the team's call: every CTA carries one): an arrow to go
 * somewhere, a download for a file. Pass it as the Button's last child; the
 * Button sizes it.
 */
export function CtaIcon({ icon }: { icon?: CtaIconName }) {
  if (icon === 'arrow') return <ArrowRight weight="bold" />;
  if (icon === 'download') return <DownloadSimple weight="bold" />;
  return null;
}
