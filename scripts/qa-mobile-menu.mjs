// QA: mobile mega-menu (PLAN_fix_v3 Part A). Against `npm run preview`.
// For each viewport × language: open the burger, open PROJECTS, and assert
//   - the mega panel's bounding box stays inside [0, viewportWidth]
//   - both group headings are fully visible and not covered
//   - Contact, the EN/ES toggle, GitHub and the status pill are reachable by
//     scrolling the menu and not covered by the panel
//   - no horizontal page scroll
// Also runs at 960px (floating desktop panel at tablet width) checking the
// panel never passes the right edge.
//
// Usage: node scripts/qa-mobile-menu.mjs [--shots before|after] [--base URL]
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const BASE = process.argv.includes('--base')
  ? process.argv[process.argv.indexOf('--base') + 1]
  : 'http://localhost:4173';
const shots = process.argv.includes('--shots')
  ? process.argv[process.argv.indexOf('--shots') + 1]
  : null;
if (shots) mkdirSync('docs/qa/mobile-menu', { recursive: true });

const VIEWPORTS = [
  { w: 360, h: 780, mobile: true },
  { w: 390, h: 844, mobile: true },
  { w: 412, h: 915, mobile: true },
  { w: 960, h: 800, mobile: false },
];
const LANGS = ['/', '/es'];

const failures = [];
const pass = (ok, msg) => {
  if (!ok) failures.push(msg);
  return ok;
};

const rectInside = (r, vw, slack = 0.5) =>
  r && r.x >= -slack && r.x + r.width <= vw + slack;

const uncoveredCenter = async (loc) =>
  loc.evaluate((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return !!hit && (hit === el || el.contains(hit) || hit.contains(el));
  });

const run = async () => {
  const browser = await chromium.launch();
  for (const vp of VIEWPORTS) {
    for (const lang of LANGS) {
      const tag = `${lang === '/es' ? 'es' : 'en'}@${vp.w}`;
      const context = await browser.newContext({
        viewport: { width: vp.w, height: vp.h },
        isMobile: vp.mobile,
        hasTouch: vp.mobile,
      });
      const page = await context.newPage();
      await page.goto(BASE + (lang === '/' ? '/' : '/es'), { waitUntil: 'networkidle' });

      const projectsBtn = page.locator('button[aria-haspopup="true"]');
      const panel = projectsBtn.locator('xpath=following-sibling::div[1]');

      if (vp.mobile) {
        await page.locator('header button:has(i)').click();
        await projectsBtn.click();
        await page.waitForTimeout(350);

        if (shots) {
          await page.screenshot({
            path: `docs/qa/mobile-menu/${shots}-${vp.w}${lang === '/es' ? '-es' : ''}.png`,
          });
        }

        // Panel inside the viewport horizontally.
        const pBox = await panel.boundingBox();
        pass(
          rectInside(pBox, vp.w),
          `${tag}: panel outside viewport — x=${pBox?.x.toFixed(0)} w=${pBox?.width.toFixed(0)}`,
        );

        // Group headings fully visible and uncovered.
        for (const id of ['mega-on-demand', 'mega-open-source']) {
          const head = page.locator(`#${id}`);
          const box = await head.boundingBox();
          pass(rectInside(box, vp.w), `${tag}: #${id} clipped — x=${box?.x.toFixed(0)} w=${box?.width.toFixed(0)}`);
          pass(await uncoveredCenter(head), `${tag}: #${id} covered by another element`);
        }

        // Menu items below the fold reachable by scrolling the menu itself.
        for (const [name, sel] of [
          ['contact', 'header nav a[href$="#contact"]'],
          ['lang-toggle', 'header nav [role="group"]'],
          ['github', 'header nav a[href*="github.com"]'],
          ['status-pill', 'header nav > span'],
        ]) {
          const el = page.locator(sel).first();
          await el.evaluate((n) => n.scrollIntoView({ block: 'center' }));
          await page.waitForTimeout(80);
          const box = await el.boundingBox();
          const visible =
            box && box.y >= 64 - 1 && box.y + box.height <= vp.h + 1 && box.x >= -0.5 && box.x + box.width <= vp.w + 0.5;
          pass(!!visible, `${tag}: ${name} not reachable in menu (y=${box?.y.toFixed(0)}, h=${box?.height.toFixed(0)})`);
          if (visible) pass(await uncoveredCenter(el), `${tag}: ${name} covered by another element`);
        }
      } else {
        // Tablet-width desktop panel: open via click, check right edge.
        await projectsBtn.click();
        await page.waitForTimeout(350);
        const pBox = await panel.boundingBox();
        pass(
          rectInside(pBox, vp.w),
          `${tag}: desktop panel overflows viewport — x=${pBox?.x.toFixed(0)} w=${pBox?.width.toFixed(0)}`,
        );
        for (const id of ['mega-on-demand', 'mega-open-source']) {
          const head = page.locator(`#${id}`);
          pass(await uncoveredCenter(head), `${tag}: #${id} covered by another element`);
        }
      }

      const noHScroll = await page.evaluate(
        () =>
          document.documentElement.scrollWidth <= window.innerWidth &&
          document.body.scrollWidth <= window.innerWidth,
      );
      pass(noHScroll, `${tag}: horizontal page scroll present`);

      await context.close();
    }
  }
  await browser.close();
};

await run();
if (failures.length) {
  console.error(`qa-mobile-menu — ${failures.length} failure(s):`);
  failures.forEach((f) => console.error(`  ✗ ${f}`));
  process.exit(1);
}
console.log('qa-mobile-menu — all viewports pass');
