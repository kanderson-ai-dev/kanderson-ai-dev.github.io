// Fix-V2 site QA captures for the supply-chain-compliance-copilot-py page
// (PLAN_FIX_V2: intake leads, buyer-language results, no architecture).
// Run against `npm run preview` (dist) on :4180.
// Output: docs/qa/<slug>/fix-v2
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const SLUG = 'supply-chain-compliance-copilot-py';
const BASE = 'http://localhost:4180';
const OUT = resolve('docs/qa', SLUG, 'fix-v2');
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const shot = async (page, name, opts = {}) => {
  await page.screenshot({ path: resolve(OUT, `${name}.png`), ...opts });
  console.log('saved', name);
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

/* ---------- mega-menu 1280: card shows the intake ---------- */
{
  const { ctx, page } = await newPage(1280, 800);
  await goto(page, '/projects/supply-chain-compliance-copilot-py/');
  await page.getByRole('button', { name: /projects/i }).first().hover();
  await page.waitForTimeout(700);
  await shot(page, 'megamenu-1280');
  await ctx.close();
}

/* ---------- landing On-demand act ---------- */
{
  const { ctx, page } = await newPage(1280, 900);
  await goto(page, '/');
  await page.locator('#on-demand').scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await shot(page, 'home-od-1280');
  await ctx.close();
}

/* ---------- projects index on-demand group ---------- */
{
  const { ctx, page } = await newPage(1280, 900);
  await goto(page, '/projects/#on-demand');
  await page.waitForTimeout(900);
  await shot(page, 'projects-od-1280');
  await ctx.close();
}

/* ---------- page top + sub-nav + results (EN) ---------- */
{
  const { ctx, page } = await newPage(1280, 900);
  await goto(page, '/projects/supply-chain-compliance-copilot-py/');
  await shot(page, 'page-1280-top');

  // sub-nav must not list Architecture (D-OD9)
  const subnav = page.locator('nav[aria-label="sections"]');
  await shot(subnav, 'subnav-1280');
  const navText = (await subnav.innerText()).toLowerCase();
  console.log('  subnav text:', navText.replace(/\s+/g, ' ').trim());
  console.log('  architecture in subnav:', /architecture|arquitectura/.test(navText));

  for (const [name, sel] of [
    ['results-1280', 'h2:has-text("Measured")'],
    ['cta-1280', 'h2:has-text("compliance workflow")'],
  ]) {
    const el = page.locator(sel).first();
    if (await el.count()) {
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(2600); // let the counters settle
      await shot(page, name);
    } else console.log('  [miss]', sel);
  }
  await ctx.close();
}

/* ---------- page top at 768 + 375, results at 375, overflow check ---------- */
{
  const { ctx, page } = await newPage(768, 1024);
  await goto(page, '/projects/supply-chain-compliance-copilot-py/');
  await shot(page, 'page-768-top');
  await ctx.close();
}
{
  const { ctx, page } = await newPage(375, 812);
  await goto(page, '/projects/supply-chain-compliance-copilot-py/');
  await shot(page, 'page-375-top');
  const results = page.locator('h2:has-text("Measured")').first();
  if (await results.count()) {
    await results.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2600);
    await shot(page, 'results-375');
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  console.log('  375 horizontal overflow (scrollWidth - innerWidth):', overflow);
  await ctx.close();
}

/* ---------- ES page: top + results ---------- */
{
  const { ctx, page } = await newPage(1280, 900);
  await goto(page, '/es/projects/supply-chain-compliance-copilot-py/');
  await shot(page, 'page-es-1280-top');
  const results = page.locator('h2', { hasText: /Medido|Medida/ }).first();
  if (await results.count()) {
    await results.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2600);
    await shot(page, 'results-es-1280');
  } else console.log('  [miss] es results h2');
  await ctx.close();
}

await browser.close();
console.log('done');
