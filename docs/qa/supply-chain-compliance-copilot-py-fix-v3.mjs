// Fix V3 QA: no metric figures on the rendered page + sub-nav/screenshots.
// Playwright against `vite preview` on :4180 (prerendered dist/).
// Run: node docs/qa/supply-chain-compliance-copilot-py-fix-v3.mjs
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE = 'http://localhost:4180';
const OUT = resolve('docs/qa', 'supply-chain-compliance-copilot-py', 'fix-v3');
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

const shot = async (page, name, el) => {
  const target = el ?? page;
  await target.screenshot({ path: resolve(OUT, `${name}.png`) });
  console.log('saved', name);
};

for (const lang of ['en', 'es']) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const url = `${BASE}${lang === 'es' ? '/es' : ''}/projects/supply-chain-compliance-copilot-py/`;
  await page.goto(url, { waitUntil: 'networkidle' });

  // Scroll the whole page so lazily-rendered sections (footer, reveals)
  // are mounted, then sweep every DOM text node (script/style excluded)
  // for digits — innerText alone is viewport-dependent here.
  await page.evaluate(async () => {
    await new Promise((done) => {
      let y = 0;
      const step = () => {
        y += 600;
        window.scrollTo(0, y);
        if (y < document.body.scrollHeight) setTimeout(step, 60);
        else done();
      };
      step();
    });
  });
  await page.waitForTimeout(500);
  const text = await page.evaluate(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) =>
        n.parentElement && ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(n.parentElement.tagName)
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT,
    });
    const lines = [];
    let n;
    while ((n = walker.nextNode())) {
      const t = n.textContent.trim();
      if (t) lines.push(t);
    }
    return lines.join('\n');
  });
  const digitLines = text.split('\n').filter((l) => /\d/.test(l));
  console.log(`\n[${lang}] lines containing digits:`);
  for (const l of digitLines) console.log('   ', JSON.stringify(l.slice(0, 120)));
  const banned = /%|\btests?\b|\bcoverage\b|\bcobertura\b|\bCI\b|measured|medido|baseline|referencia|705|automated|automatizad/i;
  const hits = text.split('\n').filter((l) => banned.test(l));
  console.log(`[${lang}] banned-term lines:`, hits.length);
  for (const l of hits) console.log('   !', JSON.stringify(l.slice(0, 120)));

  // Sub-nav check + shot.
  const subnav = page.locator('nav[aria-label="sections"], nav[aria-label="secciones"]').first();
  const navText = await subnav.innerText().catch(() => '(missing)');
  console.log(`[${lang}] subnav:`, navText.replace(/\n/g, ' '), '| results present:', /result/i.test(navText));
  await shot(page, `subnav-${lang}-1280`, subnav);

  // Features end -> stack -> CTA at 1280.
  const stack = page.locator('#stack, h2', { hasText: /stack/i }).first();
  if (await stack.count()) {
    await stack.scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    await shot(page, `stack-${lang}-1280`);
  }
  await ctx.close();
}

// 375 pass: overflow + end-of-page shot.
{
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/projects/supply-chain-compliance-copilot-py/`, { waitUntil: 'networkidle' });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log('\n375 horizontal overflow (scrollWidth - innerWidth):', overflow);
  const text = await page.evaluate(() => document.body.innerText);
  console.log('375 digit-lines:', text.split('\n').filter((l) => /\d/.test(l)).length);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.55));
  await page.waitForTimeout(700);
  await shot(page, 'mid-375');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(700);
  await shot(page, 'cta-375');
  await ctx.close();
}

await browser.close();
console.log('done');
