import { redirect } from 'next/navigation';

/** The page is /v3 (2026-10-13: the only route kept; the lab index is in _archive). */
export default function Home() {
  redirect('/v3');
}
