// Quick UI screenshots of the demo env (not recorded clips) to inspect the new UI.
// Usage: npx tsx capture/peek.ts  -> writes _video/<slug>/peek/*.png
import { chromium } from "playwright";
import { mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const SLUG = "supply-chain-compliance-copilot-py";
const WORK = resolve("..", "_video", SLUG);
const OUT = resolve(WORK, "peek");
const BASE = readFileSync(resolve(WORK, "base_url.txt"), "utf8").trim();
const DOC = resolve("..", "..", "supply-chain-compliance-copilot-py", "evaluation", "fixtures", "smeta-audit-sample.txt");

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 810 }, baseURL: BASE });
await ctx.addInitScript(`localStorage.setItem('sccc_operator_token','demo-token');`);
const page = await ctx.newPage();
mkdirSync(OUT, { recursive: true });
const shot = (n: string) => page.screenshot({ path: resolve(OUT, `${n}.png`), fullPage: false });

await page.goto("/");
await page.waitForSelector("nav");
await page.waitForTimeout(1200);
await shot("01-list");

// intake form
await page.getByRole("button", { name: /new case/i }).first().click().catch(() => page.goto("/#/new"));
await page.waitForSelector("form");
await page.selectOption('select[name="case_type"]', "smeta_audit_review");
await page.fill('input[name="name"]', "Meridian Textiles Ltd");
await page.fill('input[name="country"]', "BD");
await page.selectOption('select[name="sector"]', { label: "Apparel & Garments" });
await page.selectOption('select[name="tier"]', "2");
await page.getByLabel(/site 1 country/i).fill("BD");
await page.locator('input[name="audit_document"]').setInputFiles(DOC);
await page.waitForTimeout(500);
await shot("02-intake");

await page.getByRole("button", { name: /create|start|submit/i }).click();
await page.waitForSelector('[role="dialog"]', { timeout: 120000 });
await page.waitForTimeout(800);
await shot("03-review-modal");
await page.getByRole("button", { name: /close review/i }).click().catch(() => {});
await page.waitForTimeout(500);
await shot("04-caseview");

// approve all -> report
await page.getByRole("button", { name: /review|decision/i }).first().click().catch(() => {});
await page.waitForSelector('[role="dialog"]', { timeout: 10000 }).catch(() => {});
await page.getByRole("button", { name: /approve all/i }).click();
await page.getByRole("button", { name: /yes, approve all/i }).click().catch(() => {});
await page.getByRole("button", { name: /submit decisions/i }).click();
await page.waitForSelector('article[aria-label="final report"]', { timeout: 120000 });
await page.waitForTimeout(1000);
await shot("05-report-top");
await page.evaluate("scrollTo({top: document.body.scrollHeight * 0.45})");
await page.waitForTimeout(600);
await shot("06-report-mid");
await page.evaluate("scrollTo({top: document.body.scrollHeight})");
await page.waitForTimeout(600);
await shot("07-report-bottom");

// registry
await page.click('nav a:has-text("Prompt Registry")');
await page.waitForSelector('[aria-label="prompt registry"]');
await page.waitForTimeout(1000);
await shot("08-registry");
await page.click('nav[aria-label="workers"] button:has-text("Compliance Analyst")');
await page.waitForTimeout(800);
await shot("09-registry-worker");
await page.click('button:has-text("diff v1")').catch(async () => {
  await page.getByRole("button", { name: /diff/i }).first().click();
});
await page.waitForTimeout(1200);
await shot("10-registry-diff");
await page.evaluate("scrollTo({top: document.body.scrollHeight})");
await page.waitForTimeout(600);
await shot("11-registry-bottom");

await browser.close();
console.log("done ->", OUT);
