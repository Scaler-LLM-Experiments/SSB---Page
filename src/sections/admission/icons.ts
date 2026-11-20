import {
  Briefcase,
  CalendarDots,
  GraduationCap,
  Receipt,
  UserFocus,
  Wallet,
} from '@phosphor-icons/react/ssr';
import type { Icon } from '@phosphor-icons/react';

import type { AdmissionIcon } from '@/content/admission';

/** The admission page's icons (Phosphor's server build: no context, so they render in server and
 *  client components alike). */
export const ADMISSION_ICONS: Record<AdmissionIcon, Icon> = {
  calendar: CalendarDots,
  receipt: Receipt,
  wallet: Wallet,
  cap: GraduationCap,
  briefcase: Briefcase,
  profile: UserFocus,
};
