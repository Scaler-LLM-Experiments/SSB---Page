import { redirect } from 'next/navigation';

/** The page is /v8, the tone variant, made final (2026-10-28, the user's ask; was /v3). A deployment
 *  can open another with HOME_ROUTE at build time (2026-10-27: the vFinal project opens /vfinal). */
export default function Home() {
  redirect(process.env.HOME_ROUTE || '/v8');
}
