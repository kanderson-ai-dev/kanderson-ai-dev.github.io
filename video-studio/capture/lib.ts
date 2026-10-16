// Playwright capture helpers: 1920x1080 recording, large overlaid cursor, click ripple, human-like movement.
import { chromium, type Browser, type BrowserContext, type Page } from "playwright";

const OVERLAY = `
(() => {
  if (window.__cursorInstalled) return;
  window.__cursorInstalled = true;
  const add = () => {
    const c = document.createElement('div');
    c.id = '__cursor';
    c.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;z-index:2147483647;pointer-events:none;border-left:11px solid transparent;border-right:11px solid transparent;border-bottom:30px solid #00F5D4;transform:translate(-11px,-2px) rotate(-30deg);filter:drop-shadow(0 0 6px #00F5D4)';
    document.documentElement.appendChild(c);
    addEventListener('mousemove', e => { c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px'; }, true);
    addEventListener('mousedown', e => {
      const r = document.createElement('div');
      r.style.cssText = 'position:fixed;z-index:2147483646;pointer-events:none;width:20px;height:20px;border-radius:50%;border:3px solid #00F5D4;left:' + (e.clientX - 10) + 'px;top:' + (e.clientY - 10) + 'px;transition:transform .5s ease-out,opacity .5s ease-out';
      document.documentElement.appendChild(r);
      requestAnimationFrame(() => { r.style.transform = 'scale(4)'; r.style.opacity = '0'; });
      setTimeout(() => r.remove(), 600);
    }, true);
  };
  if (document.documentElement) add(); else addEventListener('DOMContentLoaded', add);
})();`;

export type Session = { browser: Browser; context: BrowserContext; page: Page; pos: { x: number; y: number } };

export type SessionOpts = { viewport?: { width: number; height: number }; initScripts?: string[] };

/** Records at 1920x1080. A smaller viewport is NOT upscaled (Playwright pads it with grey): keep 1920x1080 and enlarge the UI with an init script (e.g. `body{zoom:1.3333}`). */
export async function startSession(videoDir: string, baseURL: string, opts: SessionOpts = {}): Promise<Session> {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: opts.viewport ?? { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    colorScheme: "dark",
    baseURL,
    recordVideo: { dir: videoDir, size: { width: 1920, height: 1080 } }
  });
  await context.addInitScript(OVERLAY);
  for (const s of opts.initScripts ?? []) await context.addInitScript(s);
  const page = await context.newPage();
  return { browser, context, page, pos: { x: 960, y: 540 } };
}

export const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Curved (quadratic Bezier) cursor path with easing, then a short settle pause. */
export async function moveTo(s: Session, x: number, y: number, steps = 40) {
  const { x: x0, y: y0 } = s.pos;
  const cx = (x0 + x) / 2 + (y - y0) * 0.15;
  const cy = (y0 + y) / 2 - (x - x0) * 0.15;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const e = t * t * (3 - 2 * t);
    const px = (1 - e) ** 2 * x0 + 2 * (1 - e) * e * cx + e ** 2 * x;
    const py = (1 - e) ** 2 * y0 + 2 * (1 - e) * e * cy + e ** 2 * y;
    await s.page.mouse.move(px, py);
    await pause(10);
  }
  s.pos = { x, y };
  await pause(150);
}

export async function clickOn(s: Session, selector: string, after = 600) {
  const loc = s.page.locator(selector).first();
  await loc.scrollIntoViewIfNeeded();
  const b = await loc.boundingBox();
  if (!b) throw new Error(`no box for ${selector}`);
  await moveTo(s, b.x + b.width / 2, b.y + b.height / 2);
  await s.page.mouse.down();
  await pause(80);
  await s.page.mouse.up();
  await pause(after);
}

export async function typeInto(s: Session, selector: string, text: string, after = 500) {
  await clickOn(s, selector, 150);
  await s.page.keyboard.type(text, { delay: 55 });
  await pause(after);
}

/** Close the context and return the path of the recorded .webm. */
export async function finish(s: Session): Promise<string> {
  const path = await s.page.video()!.path();
  await s.context.close();
  await s.browser.close();
  return path;
}
