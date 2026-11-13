// QA: Spanish site (PLAN_fix_v3 Part B). Against `npm run preview`.
// For every /es route at desktop and mobile width assert:
//   - <html lang="es"> and a non-English <title>
//   - Spanish chrome renders (nav, section titles, CTAs)
//   - no English-only UI strings leak into visible body text
//   - project pages resolve Spanish copy + localized image alt text
// Screenshots land in docs/qa/spanish/.
//
// Usage: node scripts/qa-spanish.mjs [--base URL] [--shots]
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const BASE = process.argv.includes('--base')
  ? process.argv[process.argv.indexOf('--base') + 1]
  : 'http://localhost:4173';
const shots = process.argv.includes('--shots');
if (shots) mkdirSync('docs/qa/spanish', { recursive: true });

const ROUTES = [
  '/es',
  '/es/projects',
  '/es/projects/ecommerce-support-returns-copilot',
  '/es/projects/langgraph-multiagent-orchestrator',
  '/es/projects/mcp-agent-toolkit-py',
  '/es/projects/agentic-rag-system',
  '/es/projects/agentic-api',
];
const VIEWPORTS = [
  { w: 1440, h: 900, tag: '1440' },
  { w: 375, h: 812, tag: '375', mobile: true },
];

// English-only UI strings: none of these may appear in visible body text on
// an /es route. Word-boundary phrases so 'Contacto' does not trip 'Contact'.
const EN_LEAKS = [
  /\bGet in touch\b/,
  /\bView projects\b/,
  /\bView all projects\b/,
  /\bThe problem\b/,
  /\bThe solution\b/,
  /\bHow it works\b/,
  /\bKnown limitations\b/,
  /\bPrevious project\b/,
  /\bNext project\b/,
  /\bON DEMAND\b/,
  /\bOPEN SOURCE\b/,
  /\bEvery project,/,
  /\ba production system\./,
  /\bAgents you can trust\./,
  /\bWith real work\./,
  /\bNot a slide\./,
  /\bWatch the film\b/,
  /\bRead the code\./,
  /\bLet's build\b/,
  /\bText description of the diagram\b/,
  /\bMeasured\. Not claimed\./,
  /\bautomated tests\b/,
];

// Strings that must be present per route kind (visible text). Case-insensitive:
// chrome labels render via CSS text-transform: uppercase. Nav labels only
// exist in the open burger on mobile, so they are asserted on desktop only.
const EXPECT = {
  landing: [/Medido\./i, /BAJO DEMANDA|CÓDIGO ABIERTO/i],
  projects: [/Cada proyecto,/i, /un sistema en producción\./i, /Bajo demanda/i, /Código abierto/i],
  project: [/El problema/i, /La solución/i, /Cómo funciona/i, /Resultados/i, /Resumen|Demo/i],
};
const EXPECT_NAV = [/Inicio/i, /Proyectos/i, /Sobre mí/i, /Contacto/i];

const failures = [];
const pass = (ok, msg) => {
  if (!ok) failures.push(msg);
  return ok;
};

const run = async () => {
  const browser = await chromium.launch();
  for (const vp of VIEWPORTS) {
    for (const route of ROUTES) {
      const name = route.replace('/es/projects/', 'p/').replace('/es', 'es') || 'es';
      const tag = `${name}@${vp.tag}`;
      const context = await browser.newContext({
        viewport: { width: vp.w, height: vp.h },
        isMobile: !!vp.mobile,
        hasTouch: !!vp.mobile,
      });
      const page = await context.newPage();
      await page.goto(BASE + route, { waitUntil: 'networkidle' });

      pass(
        (await page.getAttribute('html', 'lang')) === 'es',
        `${tag}: <html lang> is not es`,
      );
      const title = await page.title();
      pass(
        !/Agentic AI Developer/.test(title),
        `${tag}: <title> still English — ${title}`,
      );

      const body = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
      for (const re of EN_LEAKS) {
        const m = re.exec(body);
        if (m) failures.push(`${tag}: English UI string leaks — "${m[0]}"`);
      }

      const kind = route === '/es' ? 'landing' : route === '/es/projects' ? 'projects' : 'project';
      for (const re of EXPECT[kind]) {
        pass(re.test(body), `${tag}: expected Spanish text missing — ${re}`);
      }
      if (!vp.mobile) {
        for (const re of EXPECT_NAV) {
          pass(re.test(body), `${tag}: expected Spanish nav label missing — ${re}`);
        }
      }

      if (kind === 'project') {
        const alts = await page.locator('main img[alt]').evaluateAll((els) =>
          els.map((e) => e.getAttribute('alt') ?? ''),
        );
        pass(
          alts.some((a) => /[áéíóúñ¿¡]|consola|informe|herramienta|reembolso|fuente|servidor|registro/i.test(a)),
          `${tag}: no Spanish image alt found — first alts: ${alts.slice(0, 2).join(' | ')}`,
        );
        pass(
          /Proyecto anterior|Proyecto siguiente|Contactar/i.test(body),
          `${tag}: project nav/CTA not localized`,
        );
      }

      if (shots) {
        await page.screenshot({
          path: `docs/qa/spanish/${name.replaceAll('/', '_')}-${vp.tag}.png`,
          fullPage: false,
        });
      }
      await context.close();
    }
  }
  await browser.close();

  if (failures.length) {
    console.error(`qa-spanish — ${failures.length} failure(s):`);
    failures.forEach((f) => console.error(`  ✗ ${f}`));
    process.exit(1);
  }
  console.log(`qa-spanish — ${ROUTES.length} routes × ${VIEWPORTS.length} viewports, all OK`);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
