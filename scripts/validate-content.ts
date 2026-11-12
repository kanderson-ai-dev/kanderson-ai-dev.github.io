// Content validation: every asset a project references must exist in public/,
// every image needs alt + explicit dimensions matching the real file, feature
// images are 16:9, WebP sizes stay under budget, no duplicate sources within a
// project, no orphan files under public/projects/<slug>/, and film-derived
// assets carry no burned caption text in their bottom band.
// Run: npm run validate:content
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { projects } from '../src/content/projects';
import type { Project } from '../src/content/types';

const errors: string[] = [];
const ok = (cond: boolean, msg: string) => {
  if (!cond) errors.push(msg);
};

const pubPath = (src: string) => resolve('public', src.slice(1));
const assetExists = (src: string, where: string) => {
  ok(src.startsWith('/'), `${where}: asset path must start with / — ${src}`);
  ok(existsSync(pubPath(src)), `${where}: missing file public${src}`);
};

const WEBP_MAX = 250 * 1024;
const WEBP_MAX_WIDE = 400 * 1024; // for 1600px-wide assets
const RATIO_169 = 16 / 9;

const checkImg = async (
  img: { src: string; alt: string; width: number; height: number } | undefined,
  where: string,
) => {
  if (!img) return;
  assetExists(img.src, where);
  ok(img.width > 0 && img.height > 0, `${where}: image needs explicit dimensions — ${img.src}`);
  ok(typeof img.alt === 'string' && img.alt.length >= 0, `${where}: image needs an alt string — ${img.src}`);
  if (!existsSync(pubPath(img.src))) return;
  const meta = await sharp(pubPath(img.src)).metadata();
  ok(
    meta.width === img.width && meta.height === img.height,
    `${where}: declared ${img.width}x${img.height} but file is ${meta.width}x${meta.height} — ${img.src}`,
  );
  if (img.src.endsWith('.webp')) {
    const kb = statSync(pubPath(img.src)).size;
    const cap = (meta.width ?? 0) >= 1600 ? WEBP_MAX_WIDE : WEBP_MAX;
    ok(kb <= cap, `${where}: ${img.src} is ${Math.round(kb / 1024)} KB, over the ${Math.round(cap / 1024)} KB budget`);
  }
};

// Burned-caption regression guard: film captions render as centered near-white
// mono text in the bottom strip. A caption line produces a sustained run of
// rows whose center-50% bright-pixel fraction stays high, which legitimate
// stage/UI content (diffuse, edge-distributed) does not produce. Thresholds are
// calibrated against the reviewed clean set (clean max: 0.083 / run 7).
const captionGuard = async (src: string, where: string) => {
  const file = pubPath(src);
  if (!existsSync(file) || !src.endsWith('.webp')) return;
  const meta = await sharp(file).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  if (!w || !h) return;
  const bandH = Math.round(h * 0.12);
  const { data } = await sharp(file)
    .extract({ left: 0, top: h - bandH, width: w, height: bandH })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const x0 = Math.round(w * 0.25);
  const x1 = Math.round(w * 0.75);
  let maxRow = 0;
  let run = 0;
  let maxRun = 0;
  for (let y = 0; y < bandH; y++) {
    let bright = 0;
    for (let x = x0; x < x1; x++) if (data[y * w + x] > 200) bright++;
    const frac = bright / (x1 - x0);
    maxRow = Math.max(maxRow, frac);
    run = frac > 0.06 ? run + 1 : 0;
    maxRun = Math.max(maxRun, run);
  }
  ok(
    !(maxRow > 0.1 && maxRun >= 9),
    `${where}: bottom strip of ${src} looks like it carries burned caption text (peak row ${(maxRow * 100).toFixed(1)}% bright for ${maxRun} rows)`,
  );
};

// Assets derived from film stills or rendered on the film stage must pass the
// caption guard. Real-UI captures (ui-*) are exempt — their own product text
// legitimately fills the frame.
const FILM_DERIVED = /(feature-\d|hook-|video-poster|loop-poster|card-800|hero-1600|og\.png$)/;

// Confidentiality scan (D-OD4): on-demand projects sell the product without
// publishing the private codebase, so no public copy, alt, diagram label or
// description may leak implementation identifiers.
const CONFIDENTIAL: [RegExp, string][] = [
  [/github\.com/i, 'repository URL'],
  [/\bsrc\//i, 'source path (src/)'],
  [/\b[\w.-]+\.(ts|py|ya?ml|jsonl?|env|sql|sqlite|db|toml|ini|log|sh|pem|key)\b/, 'source/config file name'],
  [/\/api\/|\b(GET|POST|PUT|PATCH|DELETE)\s+\//, 'API route'],
  [/\b[A-Z][A-Z0-9]*_[A-Z0-9_]{3,}\b/, 'env-var-like token'],
  [/\b[a-z][a-z0-9]*(?:_[a-z0-9]+)+\b/, 'snake_case identifier'],
  [/\b[A-Z][A-Za-z0-9]*(?:Error|Violation|Repo)\b/, 'class/error name'],
  [/langfuse|langsmith/i, 'third-party dashboard name'],
];

// Per-project allow-list for false positives: slug -> additional allowed strings.
const CONFIDENTIAL_ALLOW: Record<string, string[]> = {};

const copyStrings = (v: unknown, out: string[] = []): string[] => {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => copyStrings(x, out));
  else if (v && typeof v === 'object') Object.values(v).forEach((x) => copyStrings(x, out));
  return out;
};

const confidentialScan = (p: Project) => {
  const allow = new Set(CONFIDENTIAL_ALLOW[p.slug] ?? []);
  const texts: [string, string][] = [];
  for (const str of copyStrings(p.copy)) texts.push([str, 'copy']);
  texts.push([p.cardImage.alt, 'cardImage.alt'], [p.heroImage.alt, 'heroImage.alt']);
  for (const g of p.gallery ?? []) texts.push([g.alt, 'gallery alt']);
  if (p.video) texts.push([p.video.poster.alt, 'video poster alt']);
  if (p.loop) texts.push([p.loop.poster.alt, 'loop poster alt']);
  if (p.architecture) {
    texts.push([p.architecture.alt, 'architecture.alt'], [p.architecture.description, 'architecture.description']);
    const svgPath = pubPath(p.architecture.src);
    if (p.architecture.src.endsWith('.svg') && existsSync(svgPath)) {
      const svg = readFileSync(svgPath, 'utf8');
      for (const m of svg.matchAll(/>([^<]{2,})</g)) texts.push([m[1], 'architecture.svg text']);
    } else if (!p.architecture.src.endsWith('.svg')) {
      // Raster diagrams carry no machine-readable text — scan the mockup
      // config that produced them instead (label/sub/edge label strings).
      const cfgPath = resolve('tools/mockups/configs', `${p.slug}.json`);
      if (existsSync(cfgPath)) {
        const cfg = JSON.parse(readFileSync(cfgPath, 'utf8')) as {
          jobs?: { template?: string; params?: unknown }[];
        };
        for (const job of cfg.jobs ?? []) {
          if (job.template !== 'architecture') continue;
          for (const str of copyStrings(job.params)) texts.push([str, 'architecture config text']);
        }
      }
    }
  }
  for (const [text, where] of texts) {
    for (const [re, what] of CONFIDENTIAL) {
      const m = re.exec(text);
      if (m && !allow.has(m[0])) {
        errors.push(`${p.slug}: ${where} leaks ${what} — "${m[0]}" in "${text.slice(0, 90)}"`);
      }
    }
  }
};

const checkProject = async (p: Project) => {
  ok(!!p.slug && /^[a-z0-9-]+$/.test(p.slug), `${p.slug}: invalid slug`);
  ok(!!p.copy.en?.title, `${p.slug}: missing English copy/title`);
  ok(p.access === 'open-source' || p.access === 'on-demand', `${p.slug}: missing/invalid access group`);
  ok(Number.isFinite(p.tests) && p.tests > 0, `${p.slug}: needs a real automated-test count`);
  if (p.access === 'on-demand') {
    ok(p.repoUrl === null, `${p.slug}: on-demand projects must keep repoUrl null`);
    ok(!!p.copy.en?.cta, `${p.slug}: on-demand projects need a copy.en.cta (get-in-touch band)`);
    confidentialScan(p);
  }
  ok(!!p.copy.en?.problem && !!p.copy.en?.solution, `${p.slug}: missing problem/solution`);
  ok((p.copy.en?.howItWorks?.length ?? 0) >= 3, `${p.slug}: needs >=3 how-it-works steps`);
  ok((p.copy.en?.features?.length ?? 0) >= 3, `${p.slug}: needs >=3 features`);
  ok((p.copy.en?.results?.length ?? 0) >= 3, `${p.slug}: needs >=3 measured results`);
  ok((p.copy.en?.limitations?.length ?? 0) >= 1, `${p.slug}: limitations must be stated honestly`);

  const used = new Set<string>();
  const track = (src: string | undefined) => {
    if (src) used.add(src);
  };

  await checkImg(p.cardImage, p.slug);
  await checkImg(p.heroImage, p.slug);
  track(p.cardImage?.src);
  track(p.heroImage?.src);
  assetExists(p.ogImage, p.slug);
  track(p.ogImage);

  const srcs = new Map<string, string>();
  const dup = (src: string | undefined, where: string) => {
    if (!src) return;
    if (srcs.has(src)) errors.push(`${p.slug}: duplicate image ${src} used by ${srcs.get(src)} and ${where}`);
    else srcs.set(src, where);
    track(src);
  };

  for (const [i, f] of (p.copy.en?.features ?? []).entries()) {
    const where = `${p.slug}/feature-${i + 1}`;
    await checkImg(f.image, where);
    dup(f.image.src, where);
    const r = f.image.width / f.image.height;
    ok(Math.abs(r - RATIO_169) < 0.03, `${where}: feature image must be 16:9, declared ${f.image.width}x${f.image.height}`);
  }
  for (const [i, g] of (p.gallery ?? []).entries()) {
    const where = `${p.slug}/gallery-${i + 1}`;
    await checkImg(g, where);
    dup(g.src, where);
  }
  if (p.loop?.poster) {
    await checkImg(p.loop.poster, `${p.slug}/loop`);
    track(p.loop.poster.src);
  }
  if (p.loop) {
    assetExists(p.loop.webm, p.slug);
    assetExists(p.loop.mp4, p.slug);
    track(p.loop.webm);
    track(p.loop.mp4);
  }
  if (p.video) {
    await checkImg(p.video.poster, `${p.slug}/video-poster`);
    dup(p.video.poster.src, `${p.slug}/video-poster`);
    ok(
      p.video.youtubeId === null || /^[\w-]{11}$/.test(p.video.youtubeId),
      `${p.slug}: suspicious youtubeId ${p.video.youtubeId}`,
    );
  }
  if (p.architecture) {
    assetExists(p.architecture.src, p.slug);
    track(p.architecture.src);
  }
  const hookSrc = `/projects/${p.slug}/hook-1920.webp`;
  if (p.copy.en?.hook) {
    assetExists(hookSrc, `${p.slug}/hook`);
    track(hookSrc);
  }

  // Orphan sweep: every file under public/projects/<slug>/ must be referenced.
  const dir = resolve('public', 'projects', p.slug);
  if (existsSync(dir)) {
    for (const f of readdirSync(dir)) {
      const src = `/projects/${p.slug}/${f}`;
      ok(used.has(src), `${p.slug}: orphan file public${src} — referenced by nothing`);
    }
  }

  // Caption guard on film-derived assets.
  for (const src of used) {
    if (FILM_DERIVED.test(src)) await captionGuard(src, p.slug);
  }
};

for (const acc of ['open-source', 'on-demand'] as const) {
  const orders = projects.filter((p) => p.access === acc).map((p) => p.order);
  ok(new Set(orders).size === orders.length, `duplicate order values in ${acc}: ${orders}`);
}
for (const p of projects) await checkProject(p);

if (errors.length) {
  console.error(`validate:content — ${errors.length} problem(s):`);
  errors.forEach((e) => console.error(`  ✗ ${e}`));
  process.exit(1);
}
console.log(`validate:content — ${projects.length} projects, all assets OK`);
