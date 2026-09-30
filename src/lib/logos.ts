import type { HeroLogo } from '@/sections/hero/types';

/**
 * Organisation logos from Wikidata (property P154, "logo image"), served by
 * Wikimedia Commons. No API key. Runs on the server, so for a static page the
 * lookup happens once, at build time.
 */

export type ResolvedLogo = HeroLogo & {
  /** Image URL, or unset when none was found: render `wordmark` instead. */
  src?: string;
};

type Statement = {
  rank: 'preferred' | 'normal' | 'deprecated';
  mainsnak: { datavalue?: { value: string } };
  qualifiers?: Record<string, unknown>;
};

type EntitiesResponse = {
  entities: Record<string, { claims?: { P154?: Statement[] } }>;
};

const API = 'https://www.wikidata.org/w/api.php';
// Wikimedia asks API clients to identify themselves.
const USER_AGENT = 'SSB-home-lab/0.1 (+https://www.scaler.com/school-of-business/)';

export async function resolveLogos(logos: HeroLogo[]): Promise<ResolvedLogo[]> {
  const ids = logos.filter((logo) => !logo.logoUrl && logo.wikidataId).map((logo) => logo.wikidataId!);

  let files: Record<string, string> = {};
  if (ids.length) {
    try {
      files = await fetchLogoFiles(ids);
    } catch (error) {
      console.warn('Logo lookup failed; showing wordmarks instead.', error);
    }
  }

  return logos.map((logo) => {
    const file = logo.wikidataId ? files[logo.wikidataId] : undefined;
    return { ...logo, src: logo.logoUrl ?? (file ? commonsUrl(file) : undefined) };
  });
}

async function fetchLogoFiles(ids: string[]): Promise<Record<string, string>> {
  const params = new URLSearchParams({
    action: 'wbgetentities',
    ids: ids.join('|'),
    props: 'claims',
    format: 'json',
  });
  const response = await fetch(`${API}?${params}`, {
    headers: { 'User-Agent': USER_AGENT, 'Api-User-Agent': USER_AGENT },
    cache: 'force-cache',
  });
  if (!response.ok) throw new Error(`Wikidata responded ${response.status}`);

  const { entities } = (await response.json()) as EntitiesResponse;
  const files: Record<string, string> = {};
  for (const [id, entity] of Object.entries(entities)) {
    const file = pickLogo(entity.claims?.P154 ?? []);
    if (file) files[id] = file;
  }
  return files;
}

/** The current logo: not retired (no end date), vector before raster, then preferred rank. */
function pickLogo(statements: Statement[]): string | undefined {
  const current = statements.filter(
    (s) => s.rank !== 'deprecated' && s.mainsnak.datavalue && !s.qualifiers?.P582,
  );
  const score = (s: Statement) =>
    (s.mainsnak.datavalue!.value.toLowerCase().endsWith('.svg') ? 2 : 0) + (s.rank === 'preferred' ? 1 : 0);
  return current.sort((a, b) => score(b) - score(a))[0]?.mainsnak.datavalue?.value;
}

function commonsUrl(file: string): string {
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}`;
  // Raster originals can be large; ask Commons for a resized copy.
  return file.toLowerCase().endsWith('.svg') ? url : `${url}?width=480`;
}
