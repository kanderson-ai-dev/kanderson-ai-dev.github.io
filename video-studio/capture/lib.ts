// Playwright capture helpers: 1920x1080 recording, large overlaid cursor, click ripple, human-like movement.
import { chromium, type Browser, type BrowserContext, type CDPSession, type Page } from "playwright";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const OVERLAY = `
(() => {
  if (window.__cursorInstalled) return;
  window.__cursorInstalled = true;
  const K = window.__k || 1;
  const add = () => {
    const c = document.createElement('div');
    c.id = '__cursor';
    c.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;z-index:2147483647;pointer-events:none;border-left:11px solid transparent;border-right:11px solid transparent;border-bottom:30px solid #00F5D4;transform-origin:0 0;transform:scale(' + K + ') translate(-11px,-2px) rotate(-30deg);filter:drop-shadow(0 0 6px #00F5D4)';
    document.documentElement.appendChild(c);
    addEventListener('mousemove', e => { c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px'; }, true);
    addEventListener('mousedown', e => {
      const r = document.createElement('div');
      r.style.cssText = 'position:fixed;z-index:2147483646;pointer-events:none;width:' + 20*K + 'px;height:' + 20*K + 'px;border-radius:50%;border:' + 3*K + 'px solid #00F5D4;left:' + (e.clientX - 10*K) + 'px;top:' + (e.clientY - 10*K) + 'px;transition:transform .5s ease-out,opacity .5s ease-out';
      document.documentElement.appendChild(r);
      requestAnimationFrame(() => { r.style.transform = 'scale(4)'; r.style.opacity = '0'; });
      setTimeout(() => r.remove(), 600);
    }, true);
  };
  if (document.documentElement) add(); else addEventListener('DOMContentLoaded', add);
})();`;

export type Session = {
  browser: Browser; context: BrowserContext; page: Page; pos: { x: number; y: number };
  cdp: CDPSession; frames: { file: string; ts: number }[]; dir: string; out: { w: number; h: number };
};

export type SessionOpts = { viewport?: { width: number; height: number }; scale?: number; initScripts?: string[]; dsf?: boolean };

/**
 * High-quality capture: the page is rendered at `viewport * scale` device pixels (default 1440x810 CSS px at 2x = 2880x1620)
 * and recorded through the CDP screencast (lossless-ish JPEG q=100 frames with real timestamps), then encoded with x264.
 * Playwright's built-in recordVideo is capped at 1 Mbit/s VP8 and looks soft, so it is not used.
 *
 * `dsf: true` renders via `deviceScaleFactor` instead of `body{zoom}` — the CSS viewport stays 1440x810 so `vh`/`vw`
 * units resolve correctly (the zoom approach doubles them and breaks layouts that size against the viewport).
 */
export async function startSession(workDir: string, baseURL: string, opts: SessionOpts = {}): Promise<Session> {
  const base = opts.viewport ?? { width: 1440, height: 810 };
  const k = opts.scale ?? 2;
  const dsf = opts.dsf ?? false;
  const viewport = dsf ? base : { width: Math.round(base.width * k), height: Math.round(base.height * k) };
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport, deviceScaleFactor: dsf ? k : 1, colorScheme: "dark", baseURL });
  await context.addInitScript(`window.__k = ${dsf ? 1 : k};`);
  await context.addInitScript(OVERLAY);
  if (!dsf) {
    await context.addInitScript(`addEventListener('DOMContentLoaded', () => { const st = document.createElement('style'); st.textContent = 'body{zoom:${k}}'; document.head.appendChild(st); });`);
  }
  for (const s of opts.initScripts ?? []) await context.addInitScript(s);
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  const dir = join(workDir, `frames-${Date.now()}`);
  mkdirSync(dir, { recursive: true });
  const out = { w: Math.round(viewport.width * (dsf ? k : 1)), h: Math.round(viewport.height * (dsf ? k : 1)) };
  const frames: Session["frames"] = [];
  cdp.on("Page.screencastFrame", (e) => {
    const file = join(dir, `${String(frames.length).padStart(6, "0")}.jpg`);
    writeFileSync(file, Buffer.from(e.data, "base64"));
    frames.push({ file, ts: e.metadata.timestamp ?? Date.now() / 1000 });
    void cdp.send("Page.screencastFrameAck", { sessionId: e.sessionId }).catch(() => {});
  });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 100, maxWidth: out.w, maxHeight: out.h, everyNthFrame: 1 });
  return { browser, context, page, pos: { x: viewport.width / 2, y: viewport.height / 2 }, cdp, frames, dir, out };
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

/** Stop the screencast, encode the frames (variable timing -> constant 30 fps) and return the path of the .mp4. */
export async function finish(s: Session): Promise<string> {
  const end = Date.now() / 1000;
  await s.cdp.send("Page.stopScreencast").catch(() => {});
  await s.context.close();
  await s.browser.close();
  const f = s.frames;
  if (!f.length) throw new Error("no frames captured");
  const q = (x: string) => x.replaceAll("\\", "/");
  const NL = String.fromCharCode(10);
  const dur = (i: number) => Math.max(0.001, (f[i + 1]?.ts ?? end) - f[i].ts).toFixed(4);
  const list = f.map((fr, i) => `file '${q(fr.file)}'${NL}duration ${dur(i)}`).join(NL) + `${NL}file '${q(f[f.length - 1].file)}'${NL}`;
  const listPath = join(s.dir, "list.txt");
  writeFileSync(listPath, list);
  const out = `${s.dir}.mp4`;
  const r = spawnSync("ffmpeg", ["-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", listPath, "-vf", "fps=30,format=yuv420p", "-c:v", "libx264", "-crf", "14", "-preset", "medium", "-r", "30", out], { stdio: "inherit" });
  if (r.status !== 0) throw new Error("ffmpeg encode failed");
  const secs = f.length ? (end - f[0].ts).toFixed(1) : "0";
  console.log(`encoded ${f.length} frames over ${secs}s (${(f.length / Number(secs)).toFixed(1)} fps source)`);
  rmSync(s.dir, { recursive: true, force: true });
  return out;
}
