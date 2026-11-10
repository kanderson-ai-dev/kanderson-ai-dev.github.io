// Final "Neon K" logo exports.
// Usage (from repo root): node brand/logo/render-final.cjs
const path = require('node:path');
const fs = require('node:fs');
const { chromium } = require(path.join(__dirname, '../../video-studio/node_modules/playwright'));

const C = { bg: '#050709', accent: '#00F5D4', text: '#E8FFFB', muted: '#7FA8A1' };
const OUT = path.join(__dirname, 'final');
fs.mkdirSync(OUT, { recursive: true });

// Chamfered K as a single polygon (512 box), optically centered
const K = [
  [148, 138], [166, 120], [204, 120], [204, 243.6], [311.2, 120], [387.9, 120],
  [294.4, 227.9], [407.1, 392], [336.8, 392], [255.2, 273.1], [204, 332.1], [204, 392], [148, 392],
].map(([x, y]) => `${(x - 17).toFixed(1)},${y}`).join(' ');

function logo({ bg = true, size = 512 } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}">
  <defs>
    <filter id="glow" filterUnits="userSpaceOnUse" x="0" y="0" width="512" height="512">
      <feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="bloom" filterUnits="userSpaceOnUse" x="0" y="0" width="512" height="512"><feGaussianBlur stdDeviation="24"/></filter>
    <radialGradient id="halo" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${C.accent}" stop-opacity=".16"/><stop offset="100%" stop-color="${C.accent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vig" cx="50%" cy="50%" r="72%">
      <stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".7"/>
    </radialGradient>
  </defs>
  ${bg ? `<rect width="512" height="512" fill="${C.bg}"/><rect width="512" height="512" fill="url(#halo)"/>` : ''}
  <polygon points="${K}" fill="${C.accent}" filter="url(#bloom)" opacity=".7"/>
  <polygon points="${K}" fill="${C.accent}" filter="url(#glow)"/>
  <line x1="151" y1="136" x2="151" y2="376" stroke="${C.text}" stroke-opacity=".45" stroke-width="5"/>
  ${bg ? `<rect width="512" height="512" fill="url(#vig)"/>` : ''}
</svg>`;
}

const face = (family, weight, file) =>
  `@font-face{font-family:'${family}';font-weight:${weight};font-display:block;src:url(data:font/woff2;base64,${fs.readFileSync(path.join(__dirname, 'fonts', file)).toString('base64')}) format('woff2')}`;
const FONTS = `<style>${face('Chakra Petch', 700, 'chakra-700.woff2')}${face('JetBrains Mono', 600, 'jbmono-600.woff2')}${face('Inter', 500, 'inter-500.woff2')}</style>`;

// Horizontal lockup (CV, LinkedIn banner, email signature)
const lockup = (w = 1600, h = 520) => `<div id="shot" style="width:${w}px;height:${h}px;position:relative;overflow:hidden;background:radial-gradient(ellipse at 34% 50%, ${C.accent}1c, transparent 55%), ${C.bg};display:flex;align-items:center;justify-content:center;gap:40px;padding:0 90px;box-sizing:border-box;font-family:'Chakra Petch'">
  <div style="flex:none">${logo({ bg: false, size: 380 })}</div>
  <div>
    <div style="font-family:'JetBrains Mono';font-weight:600;font-size:24px;letter-spacing:.42em;color:${C.muted};margin-bottom:18px">FREELANCE</div>
    <div style="font-weight:700;font-size:92px;line-height:.95;color:${C.text};letter-spacing:.04em">KAARSTEN<br><span style="color:${C.accent};text-shadow:0 0 28px ${C.accent}88">ANDERSON</span></div>
    <div style="margin-top:26px;width:520px;height:3px;background:linear-gradient(90deg,${C.accent},transparent);box-shadow:0 0 18px ${C.accent}"></div>
    <div style="font-family:'JetBrains Mono';font-weight:600;font-size:28px;letter-spacing:.3em;color:${C.accent};margin-top:22px">AGENTIC AI DEVELOPER</div>
  </div></div>`;

// Real-size check: LinkedIn square on its light feed, YouTube circle on dark
const preview = () => {
  const sizes = [400, 160, 96, 48];
  const cell = (s, round) => `<div style="width:${s}px;height:${s}px;border-radius:${round ? '50%' : '4px'};overflow:hidden;flex:none">${logo({ size: s })}</div>`;
  const row = (round, bg, label) => `<div style="display:flex;align-items:center;gap:40px;padding:30px 40px;background:${bg}">${sizes.map((s) => cell(s, round)).join('')}<div style="font:500 15px Inter;color:${round ? '#aaa' : '#555'}">${label}</div></div>`;
  return `<div id="shot" style="width:1100px">${row(false, '#f3f2ef', 'LinkedIn')}${row(true, '#0f0f0f', 'YouTube')}</div>`;
};

(async () => {
  const browser = await chromium.launch();
  const shot = async (html, file, w, h, scale = 1, transparent = false) => {
    const p = await browser.newPage({ deviceScaleFactor: scale, viewport: { width: w, height: h } });
    await p.setContent(`<html><head>${FONTS}</head><body style="margin:0;background:transparent">${html}</body></html>`, { waitUntil: 'load' });
    await p.evaluate(async () => { await document.fonts.load("700 40px 'Chakra Petch'"); await document.fonts.ready; });
    await p.locator('#shot').screenshot({ path: path.join(OUT, file), omitBackground: transparent });
    await p.close();
  };
  fs.writeFileSync(path.join(OUT, 'kaarsten-logo.svg'), logo());
  fs.writeFileSync(path.join(OUT, 'kaarsten-logo-transparent.svg'), logo({ bg: false }));
  for (const s of [800, 400]) await shot(`<div id="shot" style="width:${s}px;height:${s}px">${logo({ size: s })}</div>`, `kaarsten-logo-${s}.png`, s, s);
  await shot(`<div id="shot" style="width:1024px;height:1024px">${logo({ bg: false, size: 1024 })}</div>`, 'kaarsten-logo-transparent-1024.png', 1024, 1024, 1, true);
  await shot(lockup(), 'kaarsten-lockup.png', 1600, 520, 2);
  await shot(preview(), 'preview-sizes.png', 1100, 700);
  await browser.close();
  console.log('done');
})();
