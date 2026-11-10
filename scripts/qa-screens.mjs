// Visual QA: screenshots + console error collection (needs preview on :4173).
// Usage: node scripts/qa-screens.mjs [outDir] [width ...]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = 'http://localhost:4173';
const OUT = process.argv[2] ?? 'docs/qa';
const widths = process.argv.slice(3).map(Number);
if (!widths.length) widths.push(375, 1280);
mkdirSync(OUT, { recursive: true });

const pages = [
  ['/', 'landing'],
  ['/projects', 'projects'],
  ['/projects/langgraph-multiagent-orchestrator', 'project-orch'],
  ['/projects/mcp-agent-toolkit-py', 'project-mcp'],
  ['/projects/agentic-rag-system', 'project-rag'],
  ['/projects/agentic-api', 'project-api'],
  ['/es', 'es-landing'],
  ['/nonexistent-route', '404', 404],
];
const browser = await chromium.launch();
const errors = [];

for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  const page = await ctx.newPage();
  let allow404 = false;
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    // Chrome logs the expected 404 navigation as a console resource error.
    if (allow404 && /status of 404/.test(m.text())) return;
    errors.push(`[${w}] console: ${m.text()}`);
  });
  page.on('pageerror', (e) => errors.push(`[${w}] pageerror: ${e.message}`));
  for (const [path, name, want] of pages) {
    const expected = want ?? 200;
    allow404 = expected === 404;
    const res = await page.goto(BASE + path, { waitUntil: 'networkidle' });
    if (!res || res.status() !== expected) errors.push(`[${w}] ${path}: HTTP ${res?.status()} (want ${expected})`);
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/${name}-${w}.png`, fullPage: true });
    const missing = await page.evaluate(() =>
      Array.from(document.images)
        .filter((i) => i.complete && i.naturalWidth === 0)
        .map((i) => i.src),
    );
    if (missing.length) errors.push(`[${w}] ${path}: broken images ${missing.join(', ')}`);
  }
  await ctx.close();
}
await browser.close();

if (errors.length) {
  console.log('QA issues:');
  errors.forEach((e) => console.log('  -', e));
  process.exit(1);
}
console.log('QA: all pages clean');
