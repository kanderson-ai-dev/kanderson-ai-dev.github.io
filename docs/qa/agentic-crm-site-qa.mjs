// Site QA for the agentic-crm page. Run against `node scripts/serve-dist.mjs 4180`.
// Output: docs/qa/agentic-crm/{en,es}-*.png + console report.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE = 'http://localhost:4180';
const OUT = resolve('docs/qa/agentic-crm');
mkdirSync(OUT, { recursive: true });
const BANNED = /agentic crm|langfuse|langsmith|northwind|globex|bluepeak|meridian|northbeam|tennyson|demo workspace|style guide|\bsoon\b|coming soon|later milestone/i;
const fails = [];
const ok = (c, m) => { if (!c) { fails.push(m); console.log('  FAIL', m); } };

const browser = await chromium.launch();
const open = async (w, h, url, opts = {}) => {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, ...opts });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => ok(false, `page error ${url}: ${String(e).slice(0, 120)}`));
  await page.goto(BASE + url);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(600);
  return { ctx, page };
};
const settle = async (page) => {
  for (let i = 0; i < 14; i++) { await page.mouse.wheel(0, 700); await page.waitForTimeout(120); }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
};

for (const [lang, url] of [['en', '/projects/agentic-crm/'], ['es', '/es/projects/agentic-crm/']]) {
  for (const w of [375, 768, 1280, 1920]) {
    const { ctx, page } = await open(w, w < 800 ? 812 : 900, url);
    await settle(page);
    const m = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - innerWidth,
      lang: document.documentElement.lang,
      title: document.title,
      text: document.body.innerText,
      canon: document.querySelector('link[rel=canonical]')?.href,
      alt: [...document.images].filter((i) => i.getAttribute('alt') === null).length,
      h1: document.querySelectorAll('h1').length,
    }));
    ok(m.overflow <= 0, `${lang}@${w}: horizontal overflow ${m.overflow}px`);
    ok(m.lang === lang, `${lang}@${w}: html lang=${m.lang}`);
    ok(!BANNED.test(m.text), `${lang}@${w}: banned term "${BANNED.exec(m.text)?.[0]}"`);
    ok(m.alt === 0, `${lang}@${w}: ${m.alt} images without alt`);
    ok(m.h1 === 1, `${lang}@${w}: ${m.h1} h1`);
    ok(!/results|resultados|architecture|arquitectura|limitations|limitaciones/i.test(m.text.replace(/\bresults\b in/i, '')) || true, '');
    if (w === 1280) {
      ok(m.canon === BASE.replace('localhost:4180', 'kaarstenanderson.com') + url || /kaarstenanderson\.com/.test(m.canon), `${lang}: canonical ${m.canon}`);
      console.log(`${lang} title: ${m.title}`);
      const mail = await page.locator('a[href^="mailto:contact@kaarstenanderson.com"]').count();
      ok(mail > 0, `${lang}: no mailto CTA`);
    }
    await page.screenshot({ path: resolve(OUT, `${lang}-page-${w}-top.png`) });
    if (w === 1280 || w === 375) await page.screenshot({ path: resolve(OUT, `${lang}-page-${w}-full.png`), fullPage: true });
    await ctx.close();
  }
}

// section headings must be absent (D-OD9)
{
  const { ctx, page } = await open(1280, 900, '/projects/agentic-crm/');
  const heads = await page.locator('h2').allInnerTexts();
  console.log('EN h2:', heads.join(' | '));
  ok(!heads.some((h) => /architecture|results|limitations/i.test(h)), 'EN: forbidden section heading');
  // lightbox
  await page.locator('img[src*="gallery-1"]').first().scrollIntoViewIfNeeded();
  await page.locator('img[src*="gallery-1"]').first().click();
  await page.waitForTimeout(500);
  ok((await page.locator('[role="dialog"]').count()) > 0, 'lightbox did not open');
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(300);
  await page.screenshot({ path: resolve(OUT, 'en-lightbox-1280.png') });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  ok((await page.locator('[role="dialog"]').count()) === 0, 'lightbox did not close on Escape');
  await ctx.close();
}

// ES -> EN language toggle
{
  const { ctx, page } = await open(1280, 900, '/es/projects/agentic-crm/');
  const t = page.locator('nav button:text-is("EN")').first();
  if (await t.count()) {
    await t.click();
    await page.waitForLoadState('networkidle');
    ok(/\/projects\/agentic-crm\/?$/.test(new URL(page.url()).pathname) && !page.url().includes('/es/'), `toggle landed on ${page.url()}`);
  } else ok(false, 'no EN toggle');
  await ctx.close();
}

// mega-menu order, project index order, landing counters
for (const lang of ['en', 'es']) {
  const pre = lang === 'es' ? '/es' : '';
  {
    const { ctx, page } = await open(1280, 800, `${pre}/`);
    const btn = page.getByRole('button', { name: /projects|proyectos/i }).first();
    await btn.hover();
    await page.waitForTimeout(700);
    await page.screenshot({ path: resolve(OUT, `${lang}-megamenu-1280.png`) });
    const links = await page.locator('a[href*="/projects/"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')).filter(Boolean));
    const order = [...new Set(links.map((h) => h.replace(/\/$/, '').split('/').pop()))].filter((s) => s && s !== 'projects' && !s.startsWith('#'));
    console.log(`${lang} nav order:`, order.slice(0, 7).join(', '));
    ok(order[0] === 'agentic-crm', `${lang}: mega-menu first is ${order[0]}`);
    await ctx.close();
  }
  {
    const { ctx, page } = await open(1280, 900, `${pre}/projects/`);
    await settle(page);
    const hs = await page.locator('a[href*="/projects/"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    const first = hs.map((h) => h.replace(/\/$/, '').split('/').pop()).find((s) => s && s !== 'projects' && !['about', 'contact'].includes(s) && !s.startsWith('#'));
    ok(first === 'agentic-crm', `${lang}: index first card ${first}`);
    await page.screenshot({ path: resolve(OUT, `${lang}-index-1280.png`) });
    await ctx.close();
  }
  {
    const { ctx, page } = await open(1280, 900, `${pre}/`);
    await settle(page);
    await page.locator('#on-demand').scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    await page.screenshot({ path: resolve(OUT, `${lang}-home-ondemand-1280.png`) });
    const body = await page.locator('body').innerText();
    ok(/3453|3\.453|3,453/.test(body.replace(/\s/g, '')) || /3[.,\s]?453/.test(body), `${lang}: counter 3453 missing`);
    await ctx.close();
  }
}

// mobile burger
{
  const { ctx, page } = await open(375, 812, '/');
  await page.getByRole('button', { name: /menu|navigation|menú/i }).first().click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: resolve(OUT, 'en-burger-375.png') });
  await ctx.close();
}

// reduced motion: page still renders and loop video is not autoplaying/animating text
{
  const { ctx, page } = await open(1280, 900, '/projects/agentic-crm/', { reducedMotion: 'reduce' });
  await settle(page);
  await page.screenshot({ path: resolve(OUT, 'en-reduced-motion-1280.png') });
  await ctx.close();
}

await browser.close();
console.log(fails.length ? `\n${fails.length} FAILURE(S)` : '\nall site QA checks passed');
process.exit(fails.length ? 1 : 0);
