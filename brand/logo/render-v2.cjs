// Logo alternatives v2 — clean marks, no grid / brackets / HUD ring.
// Usage (from repo root): node brand/logo/render-v2.cjs
const path = require('node:path');
const fs = require('node:fs');
const { chromium } = require(path.join(__dirname, '../../video-studio/node_modules/playwright'));

const C = { bg: '#050709', deep: '#020304', accent: '#00F5D4', accentDark: '#00A892', text: '#E8FFFB', muted: '#7FA8A1', model: '#9B8CFF' };
const OUT = path.join(__dirname, 'out-v2');
fs.mkdirSync(OUT, { recursive: true });

const defs = `
  <filter id="g" filterUnits="userSpaceOnUse" x="0" y="0" width="512" height="512">
    <feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="bloom" filterUnits="userSpaceOnUse" x="0" y="0" width="512" height="512"><feGaussianBlur stdDeviation="22"/></filter>
  <radialGradient id="halo" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="${C.accent}" stop-opacity=".16"/><stop offset="100%" stop-color="${C.accent}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="vig" cx="50%" cy="50%" r="72%">
    <stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".7"/>
  </radialGradient>
  <linearGradient id="tileGrad" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#3DFFE6"/><stop offset="55%" stop-color="${C.accent}"/><stop offset="100%" stop-color="#00B8A0"/>
  </linearGradient>
  <linearGradient id="glass" gradientUnits="userSpaceOnUse" x1="0" y1="120" x2="0" y2="392">
    <stop offset="0%" stop-color="#12302F"/><stop offset="100%" stop-color="#071012"/>
  </linearGradient>
  <clipPath id="kclip"><rect x="0" y="120" width="512" height="272"/></clipPath>`;

const svg = (body, bg = true) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512"><defs>${defs}</defs>
${bg ? `<rect width="512" height="512" fill="${C.bg}"/><rect width="512" height="512" fill="url(#halo)"/>` : ''}
${body}
${bg ? `<rect width="512" height="512" fill="url(#vig)"/>` : ''}</svg>`;

// --- Shared chamfered K glyph (Chakra Petch-like cuts) -------------------
const kStem = 'M 148 138 L 166 120 L 204 120 L 204 392 L 148 392 Z';
const kArms = (w) => `
  <g clip-path="url(#kclip)">
    <line x1="190" y1="304" x2="386" y2="78" stroke-width="${w}" stroke-linecap="butt"/>
    <line x1="258" y1="226" x2="398" y2="430" stroke-width="${w}" stroke-linecap="butt"/>
  </g>`;
const CENTER = 'translate(-17 0)'; // optical centering of the glyph
const kGlyph = (fill, w = 58) => `<g transform="${CENTER}" fill="${fill}" stroke="${fill}"><path d="${kStem}" stroke="none"/>${kArms(w)}</g>`;

// 1. NEON K — the solid chamfered K glowing on black (the films' title look)
const neon = svg(`
  <g filter="url(#bloom)" opacity=".7">${kGlyph(C.accent)}</g>
  <g filter="url(#g)">${kGlyph(C.accent)}</g>
  <path transform="${CENTER}" d="M 168 136 L 168 376" stroke="${C.text}" stroke-opacity=".45" stroke-width="5"/>`);

// 2. GLASS K — dark glass glyph with a neon outline (the films' glass panels)
// outer = neon K grown by `e` px; inner = glass K (same glyph) on top → a crisp neon edge
const outlineK = (fill, stroke, e) => `<g transform="${CENTER}"><path d="${kStem}" fill="${fill}" stroke="${stroke}" stroke-width="${e}" stroke-linejoin="miter"/><g stroke="${stroke}">${kArms(58 + e)}</g></g>`;
const glass = svg(`
  <g filter="url(#bloom)" opacity=".55">${outlineK(C.accent, C.accent, 14)}</g>
  <g filter="url(#g)">${outlineK(C.accent, C.accent, 14)}</g>
  <g transform="${CENTER}"><path d="${kStem}" fill="url(#glass)"/><g stroke="url(#glass)">${kArms(58)}</g></g>
  <path transform="${CENTER}" d="M 162 140 L 162 378" stroke="${C.accent}" stroke-opacity=".35" stroke-width="3"/>`);

// 3. TILE K — K cut out of a turquoise gradient field (strongest at tiny sizes)
const tile = svg(`
  <rect width="512" height="512" fill="url(#tileGrad)"/>
  <g filter="url(#g)" opacity=".25">${kGlyph('#00352E')}</g>
  ${kGlyph(C.deep)}`, false);

// 4. AGENT K — refined node K: the stem is the team, the hub routes to two agents
const node = (x, y, r, color) => `
  <circle cx="${x}" cy="${y}" r="${r}" fill="${C.deep}" stroke="${color}" stroke-width="7" filter="url(#g)"/>
  <circle cx="${x}" cy="${y}" r="${r * 0.42}" fill="${color}" filter="url(#g)"/>`;
const agentArms = `<path d="M 214 256 C 290 240, 290 150, 360 128" /><path d="M 214 256 C 290 272, 290 362, 360 384" />`;
const agent = svg(`
  <g filter="url(#bloom)" opacity=".6" stroke="${C.accent}" fill="none" stroke-width="30">
    <line x1="168" y1="112" x2="168" y2="400"/>${agentArms}</g>
  <path d="${'M 141 130 L 159 112 L 195 112 L 195 400 L 141 400 Z'}" fill="${C.accent}" filter="url(#g)"/>
  <g stroke="${C.accent}" fill="none" stroke-width="22" stroke-linecap="round" filter="url(#g)">${agentArms}</g>
  ${node(360, 128, 24, C.accent)}${node(360, 384, 24, C.accent)}${node(214, 256, 30, C.model)}`);

// 5. CODE K — a bar and a "<" chevron: K as code (|<), developer DNA
const code = svg(`
  <g filter="url(#bloom)" opacity=".65" stroke="${C.accent}" fill="none" stroke-width="44" stroke-linecap="round" stroke-linejoin="round">
    <line x1="170" y1="128" x2="170" y2="384"/><polyline points="356,128 236,256 356,384"/></g>
  <g filter="url(#g)" stroke="${C.accent}" fill="none" stroke-width="44" stroke-linecap="round" stroke-linejoin="round">
    <line x1="170" y1="128" x2="170" y2="384"/><polyline points="356,128 236,256 356,384"/></g>
  <circle cx="236" cy="256" r="9" fill="${C.text}" filter="url(#g)"/>`);

// 6. CIRCUIT K — a PCB-trace K: 45° traces ending in pads, a via at the junction
const pad = (x, y) => `<circle cx="${x}" cy="${y}" r="22" fill="${C.deep}" stroke="${C.accent}" stroke-width="10" filter="url(#g)"/>`;
const traces = `<line x1="168" y1="112" x2="168" y2="400"/><polyline points="168,264 292,140 340,140"/><polyline points="230,202 352,324 352,370"/>`;
const circuit = svg(`
  <g filter="url(#bloom)" opacity=".6" stroke="${C.accent}" fill="none" stroke-width="30">${traces}</g>
  <g filter="url(#g)" stroke="${C.accent}" fill="none" stroke-width="26" stroke-linecap="square" stroke-linejoin="miter">${traces}</g>
  ${pad(362, 140)}${pad(352, 392)}
  <circle cx="230" cy="202" r="12" fill="${C.text}" filter="url(#g)"/>`);

const marks = { '1-neon-k': neon, '2-glass-k': glass, '3-tile-k': tile, '4-agent-k': agent, '5-code-k': code, '6-circuit-k': circuit };

// 7. KA_ wordmark — matches the site's navbar logo (rendered as HTML text)
// Self-hosted (OFL) latin subsets, embedded so rendering never depends on the network
const face = (family, weight, file) =>
  `@font-face{font-family:'${family}';font-weight:${weight};font-display:block;src:url(data:font/woff2;base64,${fs.readFileSync(path.join(__dirname, 'fonts', file)).toString('base64')}) format('woff2')}`;
const FONTS = `<style>${face('Chakra Petch', 700, 'chakra-700.woff2')}${face('JetBrains Mono', 600, 'jbmono-600.woff2')}${face('Inter', 500, 'inter-500.woff2')}</style>`;
const kaHtml = (s) => `<div style="width:${s}px;height:${s}px;background:radial-gradient(circle at 50% 50%, ${C.accent}29, transparent 60%), ${C.bg};display:flex;align-items:center;justify-content:center;font-family:'Chakra Petch';font-weight:700;font-size:${s * 0.36}px;letter-spacing:${s * 0.01}px;color:${C.text};text-shadow:0 0 ${s * 0.05}px ${C.accent}55">KA<span style="color:${C.accent};text-shadow:0 0 ${s * 0.04}px ${C.accent}, 0 0 ${s * 0.1}px ${C.accent}">_</span></div>`;

const labels = {
  '1-neon-k': ['1 · NEON K', 'Solid angular K, like the film titles'],
  '2-glass-k': ['2 · GLASS K', 'Dark glass letter, neon edge'],
  '3-tile-k': ['3 · TILE K', 'K cut out of turquoise, boldest small'],
  '4-agent-k': ['4 · AGENT K', 'Clean node K, violet team lead'],
  '5-code-k': ['5 · CODE K', 'A bar + "<" chevron: K as code'],
  '6-circuit-k': ['6 · CIRCUIT K', 'PCB traces and pads'],
  '7-ka-cursor': ['7 · KA_', 'Initials + cursor, like the site logo'],
};

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const shot = async (html, file, w, h, scale = 1) => {
    const p = await browser.newPage({ deviceScaleFactor: scale, viewport: { width: w, height: h } });
    await p.setContent(`<html><head>${FONTS}</head><body style="margin:0;background:#000">${html}</body></html>`, { waitUntil: 'load' });
    await p.evaluate(async () => {
      await Promise.all(["700 40px 'Chakra Petch'", "600 15px 'JetBrains Mono'", "500 14px Inter"].map((f) => document.fonts.load(f)));
      await document.fonts.ready;
    });
    await p.locator('#shot').screenshot({ path: path.join(OUT, file) });
    await p.close();
  };
  for (const [name, s] of Object.entries(marks)) {
    fs.writeFileSync(path.join(OUT, `${name}.svg`), s);
    await page.setViewportSize({ width: 800, height: 800 });
    await page.setContent(`<body style="margin:0">${s.replace('width="512" height="512"', 'width="800" height="800"')}</body>`);
    await page.locator('svg').screenshot({ path: path.join(OUT, `${name}-800.png`) });
  }
  await shot(`<div id="shot">${kaHtml(800)}</div>`, '7-ka-cursor-800.png', 800, 800);

  // Comparison sheet: each option big, plus a 64 px circle (YouTube comment size)
  const item = (key) => {
    const big = key === '7-ka-cursor' ? kaHtml(300) : marks[key].replace('width="512" height="512"', 'width="300" height="300"');
    const small = key === '7-ka-cursor' ? `<div style="transform:scale(${64 / 300});transform-origin:0 0">${kaHtml(300)}</div>` : marks[key].replace('width="512" height="512"', 'width="64" height="64"');
    return `<div style="width:300px">
      <div style="border-radius:18px;overflow:hidden;width:300px;height:300px">${big}</div>
      <div style="display:flex;align-items:center;gap:14px;margin-top:14px">
        <div style="width:64px;height:64px;border-radius:50%;overflow:hidden;flex:none">${small}</div>
        <div><div style="font-family:'JetBrains Mono';font-weight:600;font-size:15px;letter-spacing:.12em;color:${C.accent}">${labels[key][0]}</div>
        <div style="font-family:Inter;font-size:14px;color:${C.muted};margin-top:4px">${labels[key][1]}</div></div>
      </div></div>`;
  };
  await shot(`<div id="shot" style="display:grid;grid-template-columns:repeat(4,300px);gap:40px 34px;padding:40px;background:#0d0f10;width:max-content">${Object.keys(labels).map(item).join('')}</div>`, 'options-sheet.png', 1500, 1000);
  await browser.close();
  console.log('done');
})();
