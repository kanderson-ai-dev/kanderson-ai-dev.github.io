#!/usr/bin/env node
/* Mockup generator — renders HTML templates on the films' stage via
   Playwright (deviceScaleFactor 2), optimizes to WebP with sharp.

   Usage: npm run mockups -- <slug> [--job <name>]
   Reads tools/mockups/configs/<slug>.json, writes WebP to
   public/projects/<slug>/.

   Config:
   {
     "jobs": [
       {
         "name": "feature-3",                  // job label
         "template": "feature-browser",        // templates/<name>.html
         "size": [1600, 900],                  // render size (logical px)
         "out": "feature-3.webp",              // output name
         "variants": [1600, 960, 480],         // optional: writes <stem>-<w>.webp
         "params": { ... }                     // passed to window.render(p)
       }
     ]
   } */
import { chromium } from 'playwright';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ROOT = path.resolve(__dirname, '..', '..');
const TPL_DIR = path.join(__dirname, 'templates');
const CFG_DIR = path.join(__dirname, 'configs');

// Turn image params (paths relative to repo root, or absolute) into file:// URLs
function resolveAssets(o) {
  if (Array.isArray(o)) return o.map(resolveAssets);
  if (o && typeof o === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(o)) out[k] = resolveAssets(v);
    return out;
  }
  if (typeof o === 'string' && /\.(png|jpe?g|webp|avif)$/i.test(o) && !o.startsWith('data:') && !o.startsWith('file:')) {
    const p = path.isAbsolute(o) ? o : path.join(ROOT, o);
    return 'file:///' + p.replace(/\\/g, '/');
  }
  return o;
}

async function main() {
  const args = process.argv.slice(2);
  const slug = args[0];
  if (!slug || slug.startsWith('-')) {
    console.error('usage: npm run mockups -- <slug> [--job <name>]');
    process.exit(1);
  }
  const onlyJob = args.includes('--job') ? args[args.indexOf('--job') + 1] : null;
  const cfgPath = path.join(CFG_DIR, `${slug}.json`);
  const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
  const outDir = path.join(ROOT, 'public', 'projects', slug);
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  try {
    for (const job of cfg.jobs) {
      if (onlyJob && job.name !== onlyJob) continue;
      const tplPath = path.join(TPL_DIR, `${job.template}.html`);
      if (!fs.existsSync(tplPath)) { console.error(`template not found: ${job.template}`); process.exit(1); }
      const [w, h] = job.size;
      const params = resolveAssets(job.params || {});
      const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
      await page.goto('file:///' + tplPath.replace(/\\/g, '/'));
      await page.evaluate((p) => window.render(p), params);
      await page.evaluate(() => document.fonts.ready.then(() =>
        Promise.all([...document.images].map((i) => i.complete ? 1 : i.decode().catch(() => 0)))));
      const pngBuf = await page.screenshot({ type: 'png' });
      await page.close();

      // Intermediate PNG part: written under _raw/<slug>/parts/ for later composition
      if (job.out.toLowerCase().startsWith('parts/') && job.out.toLowerCase().endsWith('.png')) {
        const outPath = path.join(ROOT, '_raw', slug, job.out);
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        await sharp(pngBuf).png().toFile(outPath);
        console.log(`${job.name} -> _raw/${slug}/${job.out}`);
        continue;
      }

      const variants = job.variants || [w];
      const isPng = job.out.toLowerCase().endsWith('.png');
      for (const vw of variants) {
        const stem = job.out.replace(/\.(webp|png)$/i, '');
        const name = job.variants ? `${stem}-${vw}.webp` : job.out;
        const outPath = path.join(outDir, name);
        const pipe = sharp(pngBuf).resize({ width: vw });
        await (isPng ? pipe.png() : pipe.webp({ quality: job.quality ?? 85 })).toFile(outPath);
        console.log(`${job.name} -> public/projects/${slug}/${name}`);
      }
    }
  } finally {
    await browser.close();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
