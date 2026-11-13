// QA: in-page anchor navigation (PLAN_fix_v3 Part C). Against `npm run preview`.
// For each case a FRESH page is loaded, one link is clicked, and once the
// scroll settles (scrollY stable for 300 ms) the target's top must sit within
// [navH, navH + 40] px — under the sticky chrome, not midway. On mobile the
// burger must be closed after the click.
//
// Cases per viewport (1440×900, 390×844) and language (/, /es):
//   landing — navbar About/Contact, hero "Get in touch", on-demand teaser,
//             contact-band "See the work", deep link /<lang>#about
//   project — every sub-nav link (demo, features, architecture, results, stack)
//   /projects — navbar About and Contact (cross-route to the landing)
//   mega-menu — "On demand" and "Open source" group headings
//
// Usage: node scripts/qa-anchors.mjs [--base URL]
import { chromium } from 'playwright';

const BASE = process.argv.includes('--base')
  ? process.argv[process.argv.indexOf('--base') + 1]
  : 'http://localhost:4173';

const VIEWPORTS = [
  { w: 1440, h: 900, mobile: false, navH: 64 },
  { w: 390, h: 844, mobile: true, navH: 64 },
];
const SUBNAV_H = 44;
const LANGS = ['', '/es'];
const PROJECT = 'langgraph-multiagent-orchestrator';

const failures = [];
const pass = (ok, msg) => {
  if (!ok) failures.push(msg);
  return ok;
};

// Poll window.scrollY until it stops changing for `stableMs`.
const settle = async (page, stableMs = 300, timeout = 12000) => {
  const start = Date.now();
  let last = -1;
  let stableSince = Date.now();
  while (Date.now() - start < timeout) {
    const y = await page.evaluate(() => window.scrollY);
    if (y !== last) {
      last = y;
      stableSince = Date.now();
    } else if (Date.now() - stableSince >= stableMs) return;
    await page.waitForTimeout(50);
  }
};

const check = async (page, { id, navH, tag, burger }) => {
  await waitCvOff(page); // scroll may not have started yet when check runs
  await settle(page);
  const { top, y, maxY, vh } = await page.evaluate((i) => {
    const el = document.getElementById(i);
    return {
      top: el ? el.getBoundingClientRect().top : null,
      y: window.scrollY,
      maxY: document.documentElement.scrollHeight - window.innerHeight,
      vh: window.innerHeight,
    };
  }, id);
  // Targets near the page bottom can never reach the margin position (the
  // scroll clamps first) — there it's enough that the element sits fully
  // below the sticky chrome and inside the viewport.
  const atBottom = maxY > 0 && y >= maxY - 2;
  const ok =
    top !== null &&
    (atBottom ? top >= navH - 1 && top < vh : top >= navH - 1 && top <= navH + 40);
  pass(
    ok,
    `${tag}: #${id} top ${top === null ? 'missing' : Math.round(top)} not in [${navH}, ${navH + 40}]` +
      (atBottom ? ` (clamped at page bottom y=${Math.round(y)}/${Math.round(maxY)})` : ''),
  );
  if (burger) {
    const open = await page
      .locator('button[aria-controls="primary-nav"]')
      .getAttribute('aria-expanded');
    pass(open !== 'true', `${tag}: burger menu still open after click`);
  }
};

const openBurger = async (page) => {
  const btn = page.locator('button[aria-controls="primary-nav"]');
  if ((await btn.getAttribute('aria-expanded')) !== 'true') await btn.click();
};

// cv-off only ever exists while scrollToId is running — waiting on it
// proves the React scroll path took the click (a native fragment reload
// would clear the document instead). Polls on rAF via waitForFunction.
const waitCvOff = (page) =>
  page
    .waitForFunction(() => document.documentElement.classList.contains('cv-off'), null, {
      timeout: 3000,
      polling: 30,
    })
    .then(() => true)
    .catch(() => false);

// A click before hydration finishes falls through to the raw <a href> and
// does a native fragment reload — retry until the React scroll path runs.
const clickWhenReady = async (page, sel) => {
  for (let i = 0; i < 2; i += 1) {
    await page.locator(sel).first().click({ timeout: 8000 });
    if (await waitCvOff(page)) return;
  }
};

const run = async () => {
  const browser = await chromium.launch();
  for (const vp of VIEWPORTS) {
    for (const lang of LANGS) {
      const L = (p) => `${lang}${p}`;
      const tag = (what) => `${lang || '/'}${what}@${vp.w}`;

      // ------- landing cases -------
      const landingCases = [
        { name: 'nav-about', sel: '#primary-nav > a[href$="#about"]', id: 'about', burger: vp.mobile },
        { name: 'nav-contact', sel: '#primary-nav > a[href$="#contact"]', id: 'contact', burger: vp.mobile },
        { name: 'hero-touch', sel: 'main a[href$="#contact"]', id: 'contact' },
        { name: 'hero-teaser', sel: 'main a[href$="#on-demand"]', id: 'on-demand' },
        { name: 'band-work', sel: 'main a[href$="#work"]', id: 'work' },
      ];
      for (const c of landingCases) {
        const context = await browser.newContext({
          viewport: { width: vp.w, height: vp.h },
          isMobile: vp.mobile,
          hasTouch: vp.mobile,
        });
        const page = await context.newPage();
        await page.goto(`${BASE}${lang}/`, { waitUntil: 'networkidle' });
        try {
          if (c.burger) await openBurger(page);
          await clickWhenReady(page, c.sel);
          await check(page, { id: c.id, navH: vp.navH, tag: tag(`/${c.name}`), burger: c.burger });
        } catch (e) {
          failures.push(`${tag(`/${c.name}`)}: click failed — ${String(e).split('\n')[0]}`);
        }
        await context.close();
      }

      // deep link: fresh load straight at the hash
      {
        const context = await browser.newContext({
          viewport: { width: vp.w, height: vp.h },
          isMobile: vp.mobile,
          hasTouch: vp.mobile,
        });
        const page = await context.newPage();
        await page.goto(`${BASE}${lang}/#about`, { waitUntil: 'networkidle' });
        await check(page, { id: 'about', navH: vp.navH, tag: tag('/deep-about') });
        await context.close();
      }

      // ------- project sub-nav -------
      for (const id of ['demo', 'features', 'architecture', 'results', 'stack']) {
        const context = await browser.newContext({
          viewport: { width: vp.w, height: vp.h },
          isMobile: vp.mobile,
          hasTouch: vp.mobile,
        });
        const page = await context.newPage();
        await page.goto(`${BASE}${L(`/projects/${PROJECT}`)}`, { waitUntil: 'networkidle' });
        await clickWhenReady(page, `nav a[href$="#${id}"]`);
        await check(page, { id, navH: vp.navH + SUBNAV_H, tag: tag(`/project#${id}`) });
        await context.close();
      }

      // ------- /projects: dead About/Contact (cross-route) -------
      for (const id of ['about', 'contact']) {
        const context = await browser.newContext({
          viewport: { width: vp.w, height: vp.h },
          isMobile: vp.mobile,
          hasTouch: vp.mobile,
        });
        const page = await context.newPage();
        await page.goto(`${BASE}${L('/projects')}`, { waitUntil: 'networkidle' });
        try {
          if (vp.mobile) await openBurger(page);
          await clickWhenReady(page, `#primary-nav > a[href$="#${id}"]`);
          const appeared = await page
            .waitForSelector(`#${id}`, { timeout: 10000 })
            .then(() => true)
            .catch(() => false);
          pass(
            appeared,
            `${tag(`/projects nav#${id}`)}: target never appeared (link dead or wrong route)`,
          );
          await check(page, { id, navH: vp.navH, tag: tag(`/projects nav#${id}`), burger: vp.mobile });
        } catch (e) {
          failures.push(`${tag(`/projects nav#${id}`)}: click failed — ${String(e).split('\n')[0]}`);
        }
        await context.close();
      }

      // ------- mega-menu group headings -------
      for (const id of ['on-demand', 'open-source']) {
        const context = await browser.newContext({
          viewport: { width: vp.w, height: vp.h },
          isMobile: vp.mobile,
          hasTouch: vp.mobile,
        });
        const page = await context.newPage();
        await page.goto(`${BASE}${lang}/`, { waitUntil: 'networkidle' });
        if (vp.mobile) await openBurger(page);
        await page.locator('button[aria-controls="mega-panel"]').click();
        await page.locator(`#mega-${id}`).click();
        await page.waitForURL(`**${L('/projects')}**`, { timeout: 10000 }).catch(() => {});
        await check(page, { id, navH: vp.navH, tag: tag(`/mega#${id}`), burger: vp.mobile });
        await context.close();
      }
    }
  }
  await browser.close();

  if (failures.length) {
    console.error(`qa-anchors — ${failures.length} failure(s):`);
    failures.forEach((f) => console.error(`  ✗ ${f}`));
    process.exit(1);
  }
  console.log('qa-anchors — all cases pass');
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
