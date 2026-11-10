// Screenshot specific sections/elements for review.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = 'http://localhost:4173';
const OUT = 'docs/qa/sections';
mkdirSync(OUT, { recursive: true });

const shots = [
  ['/projects/langgraph-multiagent-orchestrator', 'results', 'orch-results'],
  ['/projects/langgraph-multiagent-orchestrator', 'features', 'orch-features'],
  ['/projects/langgraph-multiagent-orchestrator', null, 'orch-top'],
  ['/projects/mcp-agent-toolkit-py', 'results', 'mcp-results'],
  ['/projects/agentic-rag-system', 'results', 'rag-results'],
  ['/projects/agentic-rag-system', null, 'rag-top'],
  ['/projects/agentic-rag-system', 'features', 'rag-features'],
  ['/projects/agentic-api', 'results', 'api-results'],
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
for (const [path, sel, name] of shots) {
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  if (sel) {
    const el = page.locator(`#${sel}`);
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    await el.screenshot({ path: `${OUT}/${name}.png` });
  } else {
    await page.screenshot({ path: `${OUT}/${name}.png` });
  }
}
await browser.close();
console.log('done');
