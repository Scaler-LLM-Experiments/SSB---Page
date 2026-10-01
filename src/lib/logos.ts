import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { HeroLogo } from '@/sections/hero/types';

/**
 * Organisation logos: a file of our own (`logoUrl`, in `public/logos`), or one
 * looked up on Wikidata (property P154, "logo image", served by Wikimedia
 * Commons; no API key). Runs on the server, so for a static page it happens
 * once, at build time. Our own files are sized from their proportions.
 */

export type ResolvedLogo = HeroLogo & {
  /** Image URL, or unset when none was found: render `wordmark` instead. */
  src?: string;
  /** Display size in px, when the file's proportions are known (a file in `public/`). */
  width?: number;
  height?: number;
};

/**
 * Logos drawn at one visual weight: the same amount of ink each. A logo's ink
 * is its box (width × height) times `ink`, the share of the box its artwork
 * fills; so a thin, wide wordmark (Bain, McKinsey) is drawn larger than a heavy,
 * compact mark (BCG). Equal heights made the wordmarks shout or vanish; equal
 * boxes still made BCG twice the weight of Bain. INK_AREA is a logo of ink 0.4
 * at 3:1 drawn LOGO_HEIGHT tall; never wider than LOGO_MAX_WIDTH.
 */
const LOGO_HEIGHT = 30;
const LOGO_MAX_WIDTH = 196;
const INK_AREA = 0.4 * 3 * LOGO_HEIGHT ** 2;

function displaySize(ratio: number, ink = 0.4) {
  let height = Math.sqrt(INK_AREA / (ink * ratio));
  let width = height * ratio;
  if (width > LOGO_MAX_WIDTH) {
    height *= LOGO_MAX_WIDTH / width;
    width = LOGO_MAX_WIDTH;
  }
  return { width: Math.round(width), height: Math.round(height) };
}

/** Width over height of a file in `public/`, from an SVG's viewBox or a PNG's header. */
async function localRatio(src: string): Promise<number | undefined> {
  if (!src.startsWith('/')) return undefined;
  try {
    const file = await readFile(path.join(process.cwd(), 'public', src));
    if (src.endsWith('.svg')) {
      const box = /viewBox="([^"]+)"/
        .exec(file.toString('utf8'))?.[1]
        .trim()
        .split(/[\s,]+/)
        .map(Number);
      return box?.[3] ? box[2] / box[3] : undefined;
    }
    if (src.endsWith('.png')) return file.readUInt32BE(16) / file.readUInt32BE(20);
  } catch {
    // Unknown proportions: the ticker's fixed height applies.
  }
  return undefined;
}

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

  return Promise.all(
    logos.map(async (logo) => {
      const file = logo.wikidataId ? files[logo.wikidataId] : undefined;
      const src = logo.logoUrl ?? (file ? commonsUrl(file) : undefined);
      const ratio = src ? await localRatio(src) : undefined;
      return { ...logo, src, ...(ratio ? displaySize(ratio, logo.ink) : {}) };
    }),
  );
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
