// Captures the clips of the Supply Chain Compliance Co-Pilot (Python) video against the fixture-backed demo env.
// Usage: npx tsx capture/supply-chain-compliance-copilot-py.ts [clip ...]   (clips: intake-run review report)
// Requires scc_demo_env.py running (base URL in _video/<slug>/base_url.txt). Output: _video/<slug>/clips/*.webm
import { chromium, type Page } from "playwright";
import { mkdirSync, readFileSync, renameSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { clickOn, finish, moveTo, pause, startSession, typeInto, type Session } from "./lib";

const SLUG = "supply-chain-compliance-copilot-py";
const WORK = resolve("..", "_video", SLUG);
const CLIPS = resolve(WORK, "clips");
const BASE = readFileSync(resolve(WORK, "base_url.txt"), "utf8").trim();
const DOC = resolve("..", "..", "supply-chain-compliance-copilot-py", "evaluation", "fixtures", "smeta-audit-sample.txt");
const VIEWPORT = { width: 1920, height: 1080 };
const SUPPLIER = "Meridian Textiles Ltd";

const HIDE_TOKEN = `
addEventListener('DOMContentLoaded', () => {
  const st = document.createElement('style');
  st.textContent = 'span.token{visibility:hidden!important}body{zoom:1.3333}';
  document.head.appendChild(st);
});
localStorage.setItem('sccc_operator_token', 'demo-token');`;

const opts = { viewport: VIEWPORT, initScripts: [HIDE_TOKEN] };

async function fillIntake(page: Page, fast = false) {
  await page.getByRole("button", { name: /new case/i }).first().click().catch(() => page.goto("/#/new"));
  await page.waitForSelector("form");
  await page.selectOption('select[name="case_type"]', "smeta_audit_review");
  await page.fill('input[name="name"]', SUPPLIER);
  await page.fill('input[name="country"]', "BD");
  await page.selectOption('select[name="sector"]', { label: "Apparel & Garments" });
  await page.selectOption('select[name="tier"]', "2");
  await page.getByLabel(/site 1 country/i).fill("BD");
  await page.locator('input[name="audit_document"]').setInputFiles(DOC);
  if (!fast) await pause(300);
}

/** Non-recorded preparation: creates a case and drives it to `review` (awaiting) or `done`. Returns the case URL. */
async function prepCase(stage: "review" | "done"): Promise<string> {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: VIEWPORT, baseURL: BASE });
  await ctx.addInitScript(`localStorage.setItem('sccc_operator_token','demo-token');`);
  const page = await ctx.newPage();
  await page.goto("/");
  await page.waitForSelector("nav");
  await fillIntake(page, true);
  await page.getByRole("button", { name: /create|start|submit/i }).click();
  await page.waitForSelector('[role="dialog"]', { timeout: 120000 });
  if (stage === "done") {
    await page.getByRole("button", { name: /approve all/i }).click();
    await page.getByRole("button", { name: /yes, approve all/i }).click();
    await page.getByRole("button", { name: /submit decisions/i }).click();
    await page.waitForSelector('article[aria-label="final report"]', { timeout: 120000 });
  }
  const url = page.url();
  await browser.close();
  return url;
}

async function save(s: Session, name: string) {
  const tmp = await finish(s);
  mkdirSync(CLIPS, { recursive: true });
  const out = resolve(CLIPS, `${name}.webm`);
  rmSync(out, { force: true });
  renameSync(tmp, out);
  console.log("saved", out);
}

async function intakeRun() {
  const s = await startSession(resolve(WORK, "raw"), BASE, opts);
  const p = s.page;
  await p.goto("/");
  await p.waitForSelector("nav");
  await pause(900);
  await clickOn(s, 'button:has-text("New case")', 700);
  await p.waitForSelector("form");
  await p.selectOption('select[name="case_type"]', "smeta_audit_review");
  await typeInto(s, 'input[name="name"]', SUPPLIER);
  await typeInto(s, 'input[name="country"]', "BD");
  await p.selectOption('select[name="sector"]', { label: "Apparel & Garments" });
  await pause(300);
  await p.selectOption('select[name="tier"]', "2");
  await p.getByLabel(/site 1 country/i).fill("BD");
  await pause(300);
  await p.locator('input[name="audit_document"]').setInputFiles(DOC);
  await pause(900);
  await clickOn(s, 'button:has-text("Create"), button:has-text("Start"), button:has-text("Submit")', 400);
  await p.waitForSelector('[aria-label="SMETA pillar fan-out"]', { timeout: 60000 });
  await moveTo(s, 1000, 560);
  await p.waitForSelector("text=/awaiting human review/i", { timeout: 120000 });
  await pause(1200);
  await p.waitForSelector('[role="dialog"]');
  await pause(500);
  await p.getByRole("button", { name: /close review/i }).click();
  await pause(900);
  await clickOn(s, "summary:has-text('Event log')", 1800);
  await save(s, "01-intake-run");
}

async function review() {
  const url = await prepCase("review");
  const s = await startSession(resolve(WORK, "raw"), BASE, opts);
  const p = s.page;
  await p.goto(url);
  await p.waitForSelector('[role="dialog"]');
  await pause(1200);
  const n = await p.locator("fieldset.capa-card").count();
  console.log("capas", n);
  const card = (i: number) => `fieldset.capa-card >> nth=${i}`;
  const radio = (i: number, d: string) => `${card(i)} >> label:has-text("${d}")`;
  await moveTo(s, 1000, 560);
  await pause(1800);
  await clickOn(s, radio(0, "Approve"), 900);
  if (n > 1) {
    await clickOn(s, radio(1, "Edit"), 700);
    await clickOn(s, `${card(1)} >> label:has-text("Action") >> input`, 150);
    await p.keyboard.press("End");
    await p.keyboard.type(" and verify on site", { delay: 55 });
    await pause(900);
  }
  if (n > 2) {
    await clickOn(s, radio(2, "Reject"), 600);
    await typeInto(s, `${card(2)} >> input[required]`, "Not proportionate to the finding", 900);
  }
  await clickOn(s, 'button:has-text("Submit decisions")', 400);
  await p.waitForSelector('article[aria-label="final report"]', { timeout: 120000 });
  await pause(1500);
  await save(s, "02-review");
}

async function report() {
  const url = await prepCase("done");
  const s = await startSession(resolve(WORK, "raw"), BASE, opts);
  const p = s.page;
  await p.goto(url);
  await p.waitForSelector('article[aria-label="final report"]');
  await p.locator('article[aria-label="final report"]').scrollIntoViewIfNeeded();
  await pause(2500);
  const scroll = async (dy: number, hold: number) => {
    await p.evaluate(`scrollBy({ top: ${dy}, behavior: "smooth" })`);
    await pause(900);
    await pause(250);
    await pause(hold);
  };
  await moveTo(s, 1200, 400);
  await scroll(380, 2200);
  await scroll(420, 2600);
  await scroll(420, 2200);
  await p.locator("summary", { hasText: "Provenance" }).scrollIntoViewIfNeeded();
  await clickOn(s, "summary:has-text('Provenance')", 2500);
  await scroll(400, 2500);
  await save(s, "03-report");
}

const all = { "intake-run": intakeRun, review, report } as const;
const wanted = process.argv.slice(2);
for (const k of Object.keys(all) as (keyof typeof all)[]) {
  if (wanted.length && !wanted.includes(k)) continue;
  console.log("capturing", k);
  await all[k]();
}
