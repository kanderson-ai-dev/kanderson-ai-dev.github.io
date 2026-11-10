import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
// gallery: find the section containing "A real product"
await page.goto('http://localhost:4173/projects/langgraph-multiagent-orchestrator', { waitUntil: 'networkidle' });
const gal = page.locator('.gallery').first();
await gal.scrollIntoViewIfNeeded();
await page.waitForTimeout(900);
await gal.screenshot({ path: 'docs/qa/sections/v4-orch-gallery.png' });
// click a feature image → lightbox
await page.locator('.featureImg').nth(2).click();
await page.waitForTimeout(500);
await page.screenshot({ path: 'docs/qa/sections/v4-lightbox.png' });
await browser.close();
console.log('done');
