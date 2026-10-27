import { redirect } from 'next/navigation';

/** The page is /v3 (2026-10-13: the only route kept; the lab index is in _archive). A deployment can
 *  open another with HOME_ROUTE at build time (2026-10-27: the vFinal project opens /vfinal). */
export default function Home() {
  redirect(process.env.HOME_ROUTE || '/v3');
}
