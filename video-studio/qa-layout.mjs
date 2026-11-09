// Layout QA for the agentic-api flagship.
// Samples every Nth frame (default 6, per plan), measures [data-qa] boxes and
// every leaf text element, and reports:
//   - text outside title-safe (x 96..1824, y 54..1026)
//   - non-caption text whose bottom is below y855
//   - computed font-size < 24 px
//   - scrollWidth > clientWidth (text overflowing its box)
//   - pairwise text-on-text overlaps
// Run:  node qa-layout.mjs [step]
import { bundle } from '@remotion/bundler';
import { openBrowser } from '@remotion/renderer';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const ROOT = path.dirname(url.fileURLToPath(import.meta.url));
const COMP = 'PromoAgenticApi';
const STEP = Math.max(1, Number(process.argv[2] || 6));
const props = fs.readFileSync(path.join(ROOT, 'projects', 'agentic-api-flagship.json'), 'utf8');

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.map': 'application/json', '.css': 'text/css', '.json': 'application/json',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.wasm': 'application/wasm',
};
const serve = (dir) => new Promise((resolve) => {
  const srv = http.createServer((req, res) => {
    let p = decodeURIComponent((req.url || '/').split('?')[0]);
    if (p === '/') p = '/index.html';
    fs.readFile(path.join(dir, p), (e, d) => {
      if (e) { res.writeHead(404); res.end('nf'); return; }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' });
      res.end(d);
    });
  });
  srv.listen(0, '127.0.0.1', () => resolve(srv));
});

const outDir = await bundle(path.join(ROOT, 'src', 'index.ts'));
const srv = await serve(outDir);
const port = srv.address().port;
const browser = await openBrowser('chrome', { logLevel: 'error', indent: false });
const page = await browser.newPage({ context: null, logLevel: 'error', indent: false, pageIndex: 0, onBrowserLog: null, onLog: null });
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
await page.evaluateOnNewDocument((input) => {
  window.remotion_puppeteerTimeout = 180000;
  window.remotion_isMainTab = true;
  window.remotion_inputProps = input;
  window.remotion_initialFrame = 0;
  window.remotion_attempt = 1;
  window.process = { env: { NODE_ENV: 'production' } };
}, props);
await page.goto({ url: `http://127.0.0.1:${port}/index.html`, timeout: 180000 });

const waitReady = () => page.evaluate(() => new Promise((res) => {
  const t = setInterval(() => { if (window.remotion_renderReady === true) { clearInterval(t); res(0); } }, 100);
}));

// wait for the bundle to be ready, then mount the composition
await waitReady();
await page.evaluate(`window.remotion_setBundleMode({type: 'evaluation'})`);
await waitReady();
const comp = await page.evaluate(`window.remotion_calculateComposition("${COMP}")`);
await page.evaluate((c) => {
  window.remotion_setBundleMode({
    type: 'composition',
    compositionName: c.id,
    serializedResolvedPropsWithSchema: c.serializedResolvedPropsWithCustomSchema,
    compositionDurationInFrames: c.durationInFrames,
    compositionFps: c.fps,
    compositionHeight: c.height,
    compositionWidth: c.width,
    compositionDefaultCodec: c.defaultCodec,
    compositionDefaultOutName: c.defaultOutName,
    compositionDefaultVideoImageFormat: c.defaultVideoImageFormat,
    compositionDefaultPixelFormat: c.defaultPixelFormat,
    compositionDefaultProResProfile: c.defaultProResProfile,
    compositionDefaultSampleRate: c.defaultSampleRate,
  });
}, comp);
await waitReady();
console.log(`mounted ${comp.id}: ${comp.width}x${comp.height} @${comp.fps}fps, ${comp.durationInFrames}f`);

const DUR = comp.durationInFrames;
const viol = [];
const push = (frame, kind, detail) => viol.push({ frame, kind, detail });

// In-page analysis: glyph-precise text boxes via Range, ancestor pairs skipped,
// stamps exempt (designed overlays), captions exempt from safe/y855 (own band).
// Straddle check: text/label boxes must not partially intersect a "solid" box
// (bordered / filled-bg element or svg shape) they aren't contained in — this is
// what catches labels sitting on card edges, floor shadows, turnstile parts.
const ANALYZE = `(() => {
  const out = { safe: [], y855: [], font: [], overflow: [], overlap: [], straddle: [] };
  const texts = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const rng = document.createRange();
  while (walker.nextNode()) {
    const tn = walker.currentNode;
    if (!tn.textContent.trim()) continue;
    const el = tn.parentElement;
    if (!el || !(el instanceof HTMLElement)) continue;
    const cs = getComputedStyle(el);
    if (parseFloat(cs.opacity) === 0 || cs.visibility === 'hidden') continue;
    rng.selectNodeContents(tn);
    const r = rng.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const it = {
      t: tn.textContent.trim().slice(0, 40), el,
      x: r.x, y: r.y, w: r.width, h: r.height,
      fs: parseFloat(cs.fontSize),
      cap: !!el.closest('[data-qa="captions"]'),
      stamp: !!el.closest('[data-qa-stamp]'),
    };
    texts.push(it);
    if (!it.cap) {
      if (r.x < 95.5 || r.x + r.width > 1824.5 || r.y < 53.5 || r.y + r.height > 1026.5)
        out.safe.push(it);
      if (r.y + r.height > 855.5)
        out.y855.push(it);
      if (it.fs < 24)
        out.font.push(it);
    }
    if (el.scrollWidth > el.clientWidth + 2)
      out.overflow.push({ t: it.t, sw: el.scrollWidth, cw: el.clientWidth });
  }
  // --- "solid" boxes: bordered / painted elements and svg shapes ---------
  const solids = [];
  const all = document.body.querySelectorAll('*');
  for (const el of all) {
    if (!(el instanceof Element)) continue;
    if (el.closest('[data-qa="captions"]') || el.closest('[data-qa-stamp]')) continue;
    const cs = getComputedStyle(el);
    if (parseFloat(cs.opacity) === 0 || cs.visibility === 'hidden') continue;
    let solid = false;
    if (el instanceof SVGElement) {
      solid = ['rect', 'ellipse', 'polygon', 'path', 'line'].includes(el.tagName);
    } else if (el instanceof HTMLElement) {
      const bw = ['borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth']
        .map((k) => parseFloat(cs[k]) || 0);
      const bc = ['borderTopColor','borderRightColor','borderBottomColor','borderLeftColor']
        .some((k) => { const c = cs[k] || ''; return c && c !== 'transparent' && !c.endsWith(', 0)') && !c.endsWith(',0)'); });
      const bg = cs.backgroundColor || '';
      const bga = bg.startsWith('rgba')
        ? parseFloat(bg.slice(bg.lastIndexOf(',') + 1)) || 0
        : (bg && bg !== 'transparent' ? 1 : 0);
      solid = (Math.max(...bw) >= 1 && bc) || bga > 0.04 || (cs.backgroundImage && cs.backgroundImage !== 'none');
    }
    if (!solid) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    if (Math.min(r.width, r.height) < 10) continue;          // thin strokes/lines
    if (r.width > 1152 || r.height > 648) continue;          // scenery containers
    solids.push({ el, x: r.x, y: r.y, w: r.width, h: r.height });
  }
  const inRect = (a, b) =>
    a.x >= b.x - 1 && a.y >= b.y - 1 && a.x + a.w <= b.x + b.w + 1 && a.y + a.h <= b.y + b.h + 1;
  // straddle: fixed engineer-label plates vs scene furniture. (General
  // text-vs-solid is NOT checked — story motion passes cards through solids
  // mid-flight by design; the recurring defect class is the label plate.)
  const labels = document.querySelectorAll('[data-qa="engineer-label"]');
  for (const p of labels) {
    const r = p.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const pcs = getComputedStyle(p);
    if (parseFloat(pcs.opacity) === 0 || pcs.visibility === 'hidden') continue;
    const lb = { el: p, x: r.x, y: r.y, w: r.width, h: r.height };
    for (const s of solids) {
      if (s.el === lb.el || s.el.contains(lb.el) || lb.el.contains(s.el)) continue;
      if (inRect(lb, s) || inRect(s, lb)) continue;
      const ox = Math.min(lb.x + lb.w, s.x + s.w) - Math.max(lb.x, s.x);
      const oy = Math.min(lb.y + lb.h, s.y + s.h) - Math.max(lb.y, s.y);
      if (ox > 10 && oy > 4)
        out.straddle.push({ t: p.textContent.trim().slice(0, 40), ox, oy, sx: s.x, sy: s.y, sw: s.w, sh: s.h });
    }
  }
  for (let i = 0; i < texts.length; i++) {
    for (let j = i + 1; j < texts.length; j++) {
      const a = texts[i], b = texts[j];
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
      if (a.stamp || b.stamp) continue;
      const xa = a.el.closest('[data-qa-xfade]'), xb = b.el.closest('[data-qa-xfade]');
      if (xa && xa === xb) continue;
      const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
      const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
      if (ox > 8 && oy > 8)
        out.overlap.push({ a: a.t, b: b.t, ox, oy });
    }
  }
  const S = (v) => ({ t: v.t, x: +v.x.toFixed(0), y: +v.y.toFixed(0), w: +v.w.toFixed(0), h: +v.h.toFixed(0), fs: v.fs });
  return {
    safe: out.safe.map(S), y855: out.y855.map(S), font: out.font.map(S),
    overflow: out.overflow,
    overlap: out.overlap.map((v) => ({ a: v.a, b: v.b, ox: +v.ox.toFixed(0), oy: +v.oy.toFixed(0) })),
    straddle: out.straddle.map((v) => ({ t: v.t, ox: +v.ox.toFixed(0), oy: +v.oy.toFixed(0), sx: +v.sx.toFixed(0), sy: +v.sy.toFixed(0), sw: +v.sw.toFixed(0), sh: +v.sh.toFixed(0) })),
  };
})()`;

for (let f = 0; f < DUR; f += STEP) {
  await page.evaluate(`window.remotion_setFrame(${f}, "${COMP}", 1)`);
  await new Promise((r) => setTimeout(r, 30));
  await page.evaluate(() => new Promise((res) => {
    const t = setInterval(() => { if (window.remotion_renderReady === true) { clearInterval(t); res(0); } }, 50);
  }));
  const r = await page.evaluate(ANALYZE);
  const sec = (f / 60).toFixed(2);
  for (const b of r.safe)
    push(f, 'safe', `t=${sec} "${b.t}" @(${b.x},${b.y},${b.w}x${b.h})`);
  for (const b of r.y855)
    push(f, 'y855', `t=${sec} "${b.t}" bottom=${b.y + b.h}`);
  for (const b of r.font)
    push(f, 'font', `t=${sec} "${b.t}" ${b.fs}px`);
  for (const b of r.overflow)
    push(f, 'overflow', `t=${sec} "${b.t}" sw=${b.sw} cw=${b.cw}`);
  for (const v of r.overlap)
    push(f, 'overlap', `t=${sec} "${v.a}" x "${v.b}" (${v.ox}x${v.oy})`);
  for (const v of r.straddle)
    push(f, 'straddle', `t=${sec} "${v.t}" x solid(${v.sx},${v.sy},${v.sw}x${v.sh}) (${v.ox}x${v.oy})`);
  if (f % 600 === 0) console.log(`…${sec}s (${viol.length} findings so far)`);
}

console.log(`\n== ${viol.length} findings (step ${STEP}) ==`);
const kinds = {};
for (const v of viol) { (kinds[v.kind] = kinds[v.kind] || []).push(v); }
for (const [k, arr] of Object.entries(kinds)) {
  console.log(`\n-- ${k}: ${arr.length}`);
  for (const v of arr.slice(0, 60)) console.log('   ', v.detail);
  if (arr.length > 60) console.log(`    … +${arr.length - 60} more`);
}
srv.close();
await browser.close({ silent: true }).catch(() => browser.close());
process.exit(viol.length ? 1 : 0);
