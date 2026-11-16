// Step 9 site QA captures for the supply-chain-compliance-copilot-py page.
// Run against `npm run preview` (dist) on :4180. Output: docs/qa/<slug>/step9
// and docs/qa/<slug>/film-parity, mirroring the e-commerce evidence set.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const SLUG = 'supply-chain-compliance-copilot-py';
const BASE = 'http://localhost:4180';
const QA = resolve('docs/qa', SLUG);
const S9 = resolve(QA, 'step9');
const FP = resolve(QA, 'film-parity');
mkdirSync(S9, { recursive: true });
mkdirSync(FP, { recursive: true });

const browser = await chromium.launch();
const shot = async (page, dir, name, opts = {}) => {
  await page.screenshot({ path: resolve(dir, `${name}.png`), ...opts });
  console.log('saved', dir.split(/[\\/]/).pop() + '/' + name);
};

async function newPage(w, h) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('  [page-err]', String(e).slice(0, 160)));
  return { ctx, page };
}

const goto = async (page, url) => {
  await page.goto(BASE + url);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(700);
};

/* ---------- mega-menu 1280: On-demand column order ---------- */
{
  const { ctx, page } = await newPage(1280, 800);
  await goto(page, '/projects/supply-chain-compliance-copilot-py/');
  await page.getByRole('button', { name: /projects/i }).first().hover();
  await page.waitForTimeout(700);
  await shot(page, S9, 'megamenu-1280');
  await ctx.close();
}

/* ---------- burger menu 375 ---------- */
{
  const { ctx, page } = await newPage(375, 812);
  await goto(page, '/');
  const burger = page.getByRole('button', { name: /menu|navigation/i }).first();
  await burger.click();
  await page.waitForTimeout(700);
  await shot(page, S9, 'burger-projects-375');
  await ctx.close();
}

/* ---------- landing: ON DEMAND act + counters ---------- */
{
  const { ctx, page } = await newPage(1280, 900);
  await goto(page, '/');
  await page.locator('#on-demand').scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await shot(page, S9, 'home-od-1280');
  await page.locator(`a[href*="${SLUG}"]`).first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  // counters strip is the hero figures section
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await shot(page, S9, 'home-counters');
  await ctx.close();
}

/* ---------- projects index on-demand group ---------- */
{
  const { ctx, page } = await newPage(1280, 900);
  await goto(page, '/projects/#on-demand');
  await page.waitForTimeout(900);
  await shot(page, S9, 'projects-od-1280');
  await ctx.close();
}

/* ---------- project page sections (EN) ---------- */
{
  const { ctx, page } = await newPage(1280, 900);
  await goto(page, '/projects/supply-chain-compliance-copilot-py/');
  await shot(page, S9, 'page-1280-top');
  for (const [name, sel] of [
    ['sec-how', 'h2:has-text("How it works")'],
    ['sec-arch', 'h2:has-text("Architecture")'],
    ['sec-results', 'h2:has-text("Results")'],
    ['cta', 'h2:has-text("compliance workflow")'],
  ]) {
    const el = page.locator(sel).first();
    if (await el.count()) {
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
      await shot(page, S9, name);
    } else console.log('  [miss]', sel);
  }
  // prev/next: page bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(700);
  await shot(page, S9, 'prevnext');
  await ctx.close();
}

/* ---------- page at 375 ---------- */
{
  const { ctx, page } = await newPage(375, 812);
  await goto(page, '/projects/supply-chain-compliance-copilot-py/');
  await shot(page, S9, 'page-375', { fullPage: true });
  await ctx.close();
}

/* ---------- page at 768 ---------- */
{
  const { ctx, page } = await newPage(768, 1024);
  await goto(page, '/projects/supply-chain-compliance-copilot-py/');
  await shot(page, S9, 'page-768');
  await ctx.close();
}

/* ---------- ES page + language toggle ---------- */
{
  const { ctx, page } = await newPage(1280, 900);
  await goto(page, '/es/projects/supply-chain-compliance-copilot-py/');
  await shot(page, S9, 'page-es-1280-top');
  await page.locator('h2', { hasText: /compliance/ }).first().scrollIntoViewIfNeeded().catch(() => {});
  // language toggle -> EN
  const toggle = page.getByRole('link', { name: /\bEN\b/ }).first();
  if (await toggle.count()) {
    await toggle.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(600);
    await shot(page, S9, 'langtoggle-to-en');
  }
  await ctx.close();
}

/* ---------- lightbox keyboard + Esc ---------- */
{
  const { ctx, page } = await newPage(375, 812);
  await goto(page, '/projects/supply-chain-compliance-copilot-py/');
  const gal = page.locator('img[src*="gallery-1"]').first();
  await gal.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await gal.click();
  await page.waitForTimeout(700);
  await shot(page, S9, 'lightbox-375');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  const still = await page.locator('[role="dialog"]').count();
  console.log('  lightbox esc -> dialogs left:', still);
  await ctx.close();
}

/* ---------- film-parity at 1920 ---------- */
{
  const { ctx, page } = await newPage(1920, 1080);
  await goto(page, '/projects/supply-chain-compliance-copilot-py/');
  await shot(page, FP, 'hero');
  for (const [name, sel] of [
    ['hook', 'h2'],
    ['feature-approval', 'h3:has-text("Nothing reaches")'],
    ['results-baseline', 'h2:has-text("Results")'],
    ['cta', 'h2:has-text("compliance workflow")'],
  ]) {
    const el = page.locator(sel).first();
    if (await el.count()) {
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(900);
      await shot(page, FP, name);
    } else console.log('  [miss]', sel);
  }
  await ctx.close();
}

await browser.close();
console.log('done');
