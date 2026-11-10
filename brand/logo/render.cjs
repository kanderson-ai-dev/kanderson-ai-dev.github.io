// Renders the KA monogram (SVG master + PNG exports) with Playwright.
// Usage (from repo root): node brand/logo/render.cjs
const path = require('node:path');
const fs = require('node:fs');
const { chromium } = require(path.join(__dirname, '../../video-studio/node_modules/playwright'));

const C = {
  bg: '#050709', bgDeep: '#020304', panel: '#0B1114', line: '#17343A',
  accent: '#00F5D4', text: '#E8FFFB', muted: '#7FA8A1', model: '#9B8CFF', human: '#FFC857',
};

// ---- The mark (viewBox 0 0 512 512) -------------------------------------
// K = an agent graph: the stem is a column of agents, the junction is the
// supervisor (hub), the two arms are routing curves to two worker nodes.
const HUB = { x: 206, y: 256 };
const STEM_X = 170;
const TOP = 132, BOT = 380;
const ARM_TOP = { x: 352, y: 132 };
const ARM_BOT = { x: 352, y: 380 };

const armTop = `M ${HUB.x} ${HUB.y} C ${HUB.x + 70} ${HUB.y - 14}, ${ARM_TOP.x - 92} ${ARM_TOP.y + 40}, ${ARM_TOP.x} ${ARM_TOP.y}`;
const armBot = `M ${HUB.x} ${HUB.y} C ${HUB.x + 70} ${HUB.y + 14}, ${ARM_BOT.x - 92} ${ARM_BOT.y - 40}, ${ARM_BOT.x} ${ARM_BOT.y}`;

function node(x, y, r, color, id) {
  return `
    <circle cx="${x}" cy="${y}" r="${r + 9}" fill="none" stroke="${color}" stroke-opacity=".35" stroke-width="2"/>
    <circle cx="${x}" cy="${y}" r="${r}" fill="${C.bgDeep}" stroke="${color}" stroke-width="6" filter="url(#glow-${id})"/>
    <circle cx="${x}" cy="${y}" r="${r * 0.42}" fill="${color}" filter="url(#glow-${id})"/>`;
}

const SW = 19, CH = 16; // half stem width, chamfer
const stem = [
  [STEM_X - SW, TOP - 18 + CH], [STEM_X - SW + CH, TOP - 18], [STEM_X + SW, TOP - 18],
  [STEM_X + SW, BOT + 18 - CH], [STEM_X + SW - CH, BOT + 18], [STEM_X - SW, BOT + 18],
].map((p) => p.join(',')).join(' ');

function hudRing(r) {
  // segmented ring with tick marks, like the films' HUD details
  const arcs = [];
  const seg = (a0, a1) => {
    const p = (a) => [256 + r * Math.cos((a * Math.PI) / 180), 256 + r * Math.sin((a * Math.PI) / 180)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}" fill="none" stroke="${C.accent}" stroke-width="3" stroke-opacity=".38"/>`;
  };
  // gaps around ±52° where the worker nodes break through the ring
  for (const [a0, a1] of [[-160, -100], [-86, -72], [-32, -8], [8, 32], [72, 86], [100, 160], [168, 192]]) arcs.push(seg(a0, a1));
  for (let a = 0; a < 360; a += 10) {
    const n = ((a + 180) % 360) - 180;
    if (Math.abs(Math.abs(n) - 52) < 16) continue;
    const big = a % 90 === 0;
    const r0 = r + 8, r1 = r + (big ? 22 : 14);
    const c = Math.cos((a * Math.PI) / 180), s = Math.sin((a * Math.PI) / 180);
    arcs.push(`<line x1="${(256 + r0 * c).toFixed(1)}" y1="${(256 + r0 * s).toFixed(1)}" x2="${(256 + r1 * c).toFixed(1)}" y2="${(256 + r1 * s).toFixed(1)}" stroke="${C.accent}" stroke-width="${big ? 3 : 2}" stroke-opacity="${big ? 0.55 : 0.22}"/>`);
  }
  return arcs.join('');
}

function mark({ tile = true, circleSafe = false, grid = true, brackets = true, ring = true, hub = C.accent } = {}) {
  const s = circleSafe ? 0.86 : 1; // shrink artwork inside a circular crop
  const t = `translate(${256 - 256 * s} ${256 - 256 * s}) scale(${s})`;
  const k = 1.12; // K scaled around the optical center for small-size legibility
  const kt = `translate(${258 - 258 * k} ${256 - 256 * k}) scale(${k})`;
  const bracket = (x, y, dx, dy) =>
    `<path d="M ${x} ${y + dy * 46} L ${x} ${y} L ${x + dx * 46} ${y}" fill="none" stroke="${C.accent}" stroke-width="7" stroke-opacity=".75" stroke-linecap="square"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="glow-a" filterUnits="userSpaceOnUse" x="0" y="0" width="512" height="512">
      <feGaussianBlur stdDeviation="7" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glow-soft" filterUnits="userSpaceOnUse" x="0" y="0" width="512" height="512">
      <feGaussianBlur stdDeviation="18"/>
    </filter>
    <radialGradient id="vignette" cx="50%" cy="46%" r="70%">
      <stop offset="45%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity=".85"/>
    </radialGradient>
    <radialGradient id="halo" cx="${HUB.x / 512 * 100}%" cy="50%" r="45%">
      <stop offset="0%" stop-color="${C.accent}" stop-opacity=".22"/>
      <stop offset="100%" stop-color="${C.accent}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="${C.accent}" stroke-width="1"/>
    </pattern>
    <clipPath id="tile"><rect width="512" height="512" rx="${tile === 'rounded' ? 96 : 0}"/></clipPath>
  </defs>
  <g clip-path="url(#tile)">
    <rect width="512" height="512" fill="${C.bg}"/>
    ${grid ? `<rect width="512" height="512" fill="url(#grid)" opacity=".13"/>` : ''}
    <rect width="512" height="512" fill="url(#halo)"/>
    <rect width="512" height="512" fill="url(#vignette)"/>
    ${brackets && !circleSafe ? bracket(40, 40, 1, 1) + bracket(472, 40, -1, 1) + bracket(40, 472, 1, -1) + bracket(472, 472, -1, -1) : ''}
    <g transform="${t}">
      ${ring ? hudRing(200) : ''}
      <g transform="${kt}">
      <!-- soft bloom under the strokes -->
      <g filter="url(#glow-soft)" opacity=".75">
        <line x1="${STEM_X}" y1="${TOP}" x2="${STEM_X}" y2="${BOT}" stroke="${C.accent}" stroke-width="30"/>
        <path d="${armTop}" fill="none" stroke="${C.accent}" stroke-width="24"/>
        <path d="${armBot}" fill="none" stroke="${C.accent}" stroke-width="24"/>
      </g>
      <!-- stem: chamfered bar (Chakra Petch cut) with an inner light line -->
      <polygon points="${stem}" fill="${C.accent}" filter="url(#glow-a)"/>
      <line x1="${STEM_X - 4}" y1="${TOP + 4}" x2="${STEM_X - 4}" y2="${BOT - 4}" stroke="#E8FFFB" stroke-opacity=".55" stroke-width="4"/>
      <!-- link stem -> hub -->
      <line x1="${STEM_X}" y1="${HUB.y}" x2="${HUB.x}" y2="${HUB.y}" stroke="${C.accent}" stroke-width="16" filter="url(#glow-a)"/>
      <!-- routing arms -->
      <path d="${armTop}" fill="none" stroke="${C.accent}" stroke-width="22" stroke-linecap="round" filter="url(#glow-a)"/>
      <path d="${armBot}" fill="none" stroke="${C.accent}" stroke-width="22" stroke-linecap="round" filter="url(#glow-a)"/>
      <!-- travelling pulses -->
      <circle cx="${HUB.x + 92}" cy="${HUB.y - 46}" r="6" fill="#E8FFFB" filter="url(#glow-a)"/>
      <circle cx="${HUB.x + 92}" cy="${HUB.y + 46}" r="6" fill="#E8FFFB" filter="url(#glow-a)"/>
      <!-- nodes -->
      ${node(ARM_TOP.x, ARM_TOP.y, 22, C.accent, 'a')}
      ${node(ARM_BOT.x, ARM_BOT.y, 22, C.accent, 'a')}
      ${node(HUB.x, HUB.y, 28, hub, 'a')}
      </g>
    </g>
  </g>
</svg>`;
}

// ---- Exports ------------------------------------------------------------
const OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });

const variants = {
  'ka-mark': mark(),
  'ka-mark-violet-hub': mark({ hub: C.model }),
  'ka-mark-circle': mark({ circleSafe: true }),
  'ka-mark-violet-hub-circle': mark({ circleSafe: true, hub: C.model }),
};

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=JetBrains+Mono:wght@500;600&display=block" rel="stylesheet">`;

// Horizontal lockup: mark + name + role (LinkedIn banner, CV, email signature)
function lockup(markSvg, w = 1600, h = 520) {
  const m = markSvg.replace('width="512" height="512"', 'width="360" height="360"').replace(/<rect width="512" height="512" fill="url\(#grid\)"[^>]*\/>/, '');
  return `<div id="shot" style="width:${w}px;height:${h}px;position:relative;overflow:hidden;background:${C.bg};display:flex;align-items:center;gap:56px;padding:0 90px;box-sizing:border-box;font-family:'Chakra Petch'">
    <div style="position:absolute;inset:0;opacity:.12;background-image:linear-gradient(${C.accent} 1px,transparent 1px),linear-gradient(90deg,${C.accent} 1px,transparent 1px);background-size:40px 40px"></div>
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 30% 50%,transparent 35%,#000c 100%)"></div>
    <div style="position:relative;flex:none;border-radius:28px;overflow:hidden;box-shadow:0 0 60px ${C.accent}33">${m}</div>
    <div style="position:relative">
      <div style="font-family:'JetBrains Mono';font-weight:600;font-size:24px;letter-spacing:.42em;color:${C.muted};margin-bottom:18px">FREELANCE</div>
      <div style="font-weight:700;font-size:92px;line-height:.95;color:${C.text};letter-spacing:.04em;text-shadow:0 0 40px ${C.accent}33">KAARSTEN<br><span style="color:${C.accent};text-shadow:0 0 28px ${C.accent}88">ANDERSON</span></div>
      <div style="margin-top:26px;width:520px;height:3px;background:linear-gradient(90deg,${C.accent},transparent);box-shadow:0 0 18px ${C.accent}"></div>
      <div style="font-family:'JetBrains Mono';font-weight:600;font-size:28px;letter-spacing:.3em;color:${C.accent};margin-top:22px">AGENTIC AI DEVELOPER</div>
    </div>
  </div>`;
}

// Preview sheet: how the mark reads at real display sizes, square and circle-cropped
function preview(sq, circ) {
  const sizes = [400, 160, 96, 48];
  const cell = (svg, s, round) => `<div style="width:${s}px;height:${s}px;border-radius:${round ? '50%' : '4px'};overflow:hidden;flex:none">${svg.replace('width="512" height="512"', `width="${s}" height="${s}"`)}</div>`;
  const row = (svg, round, bg) => `<div style="display:flex;align-items:center;gap:40px;padding:30px 40px;background:${bg}">${sizes.map((s) => cell(svg, s, round)).join('')}</div>`;
  return `<div id="shot" style="width:1000px;font-family:sans-serif">${row(sq, false, '#f3f2ef')}${row(circ, true, '#0f0f0f')}</div>`;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  for (const [name, svg] of Object.entries(variants)) {
    fs.writeFileSync(path.join(OUT, `${name}.svg`), svg);
    for (const size of [800, 400]) {
      await page.setViewportSize({ width: size, height: size });
      await page.setContent(`<html><body style="margin:0;background:transparent">${svg.replace('width="512" height="512"', `width="${size}" height="${size}"`)}</body></html>`);
      await page.locator('svg').screenshot({ path: path.join(OUT, `${name}-${size}.png`), omitBackground: true });
    }
  }
  const shoot = async (html, file, scale = 1) => {
    const p = await browser.newPage({ deviceScaleFactor: scale, viewport: { width: 1800, height: 1200 } });
    await p.setContent(`<html><head>${FONTS}</head><body style="margin:0">${html}</body></html>`, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.locator('#shot').screenshot({ path: path.join(OUT, file) });
    await p.close();
  };
  for (const hub of ['', '-violet-hub']) {
    await shoot(lockup(variants[`ka-mark${hub}`]), `ka-lockup${hub}.png`, 2);
    await shoot(preview(variants[`ka-mark${hub}`], variants[`ka-mark${hub}-circle`]), `preview${hub}.png`);
  }
  await browser.close();
  console.log('done');
})();
