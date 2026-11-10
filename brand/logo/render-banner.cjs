// YouTube channel banner 2560x1440 (safe area 1546x423 centered). Run: node brand/logo/render-banner.cjs
const path = require('node:path');
const fs = require('node:fs');
const { chromium } = require(path.join(__dirname, '../../video-studio/node_modules/playwright'));
const C = { bg: '#050709', accent: '#00F5D4', text: '#E8FFFB', muted: '#7FA8A1', model: '#9B8CFF' };
const OUT = path.join(__dirname, 'final');
const W = 2560, H = 1440;

const K = [[148,138],[166,120],[204,120],[204,243.6],[311.2,120],[387.9,120],[294.4,227.9],[407.1,392],[336.8,392],[255.2,273.1],[204,332.1],[204,392],[148,392]]
  .map(([x, y]) => `${(x - 17).toFixed(1)},${y}`).join(' ');
const logo = (s) => `<svg viewBox="40 40 432 432" width="${s}" height="${s}"><defs>
  <filter id="gl" filterUnits="userSpaceOnUse" x="0" y="0" width="512" height="512"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="bl" filterUnits="userSpaceOnUse" x="0" y="0" width="512" height="512"><feGaussianBlur stdDeviation="24"/></filter></defs>
  <polygon points="${K}" fill="${C.accent}" filter="url(#bl)" opacity=".7"/><polygon points="${K}" fill="${C.accent}" filter="url(#gl)"/>
  <line x1="151" y1="136" x2="151" y2="376" stroke="${C.text}" stroke-opacity=".45" stroke-width="5"/></svg>`;

// Decorative agent network, kept outside the central safe area
const nodes = [[250,260],[400,470],[330,900],[640,1150],[900,330],[1000,1180],[1700,1190],[1950,300],[2300,520],[2330,980],[2000,1100],[2200,200]];
const edges = [[0,1],[1,2],[2,3],[0,4],[1,4],[3,5],[5,6],[6,10],[10,9],[9,8],[8,7],[7,11],[11,8],[6,9]];
const net = `<svg width="${W}" height="${H}" style="position:absolute;inset:0">
  ${edges.map(([a, b]) => `<line x1="${nodes[a][0]}" y1="${nodes[a][1]}" x2="${nodes[b][0]}" y2="${nodes[b][1]}" stroke="${C.accent}" stroke-opacity=".22" stroke-width="3"/>`).join('')}
  ${nodes.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 4 === 0 ? 16 : 10}" fill="#020304" stroke="${i === 5 ? C.model : C.accent}" stroke-width="4" stroke-opacity=".7"/><circle cx="${x}" cy="${y}" r="${i % 4 === 0 ? 6 : 4}" fill="${i === 5 ? C.model : C.accent}" opacity=".8"/>`).join('')}</svg>`;

const face = (f, w, file) => `@font-face{font-family:'${f}';font-weight:${w};src:url(data:font/woff2;base64,${fs.readFileSync(path.join(__dirname, 'fonts', file)).toString('base64')}) format('woff2')}`;

const html = `<html><head><style>${face('Chakra Petch',700,'chakra-700.woff2')}${face('JetBrains Mono',600,'jbmono-600.woff2')}body{margin:0}</style></head><body>
<div id="shot" style="width:${W}px;height:${H}px;position:relative;overflow:hidden;background:radial-gradient(ellipse 45% 40% at 50% 50%, ${C.accent}24, transparent 70%), radial-gradient(ellipse at 50% 50%, transparent 40%, #000 110%), ${C.bg}">
  ${net}
  <!-- safe area 1546x423 centered: x 507..2053, y 508..931 -->
  <div style="position:absolute;left:507px;top:508px;width:1546px;height:423px;display:flex;align-items:center;justify-content:center;gap:30px;font-family:'Chakra Petch'">
    <div style="flex:none">${logo(330)}</div>
    <div style="margin-top:-6px">
      <div style="font-weight:700;font-size:92px;line-height:1;color:${C.text};letter-spacing:.03em;white-space:nowrap">KAARSTEN <span style="color:${C.accent};text-shadow:0 0 30px ${C.accent}88">ANDERSON</span></div>
      <div style="margin:18px 0 16px;width:100%;height:3px;background:linear-gradient(90deg,${C.accent},transparent);box-shadow:0 0 16px ${C.accent}"></div>
      <div style="font-family:'JetBrains Mono';font-weight:600;font-size:38px;letter-spacing:.3em;color:${C.accent};white-space:nowrap">AGENTIC AI DEVELOPER</div>
      <div style="font-family:'JetBrains Mono';font-weight:600;font-size:26px;letter-spacing:.14em;color:${C.muted};margin-top:20px;white-space:nowrap">LANGGRAPH · RAG · MULTI-AGENT · GUARDRAILS</div>
      <div style="font-family:'JetBrains Mono';font-weight:600;font-size:26px;letter-spacing:.08em;color:${C.text};margin-top:12px;white-space:nowrap">kaarstenanderson.com &nbsp;·&nbsp; contact@kaarstenanderson.com</div>
    </div>
  </div>
</div></body></html>`;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: W, height: H } });
  await p.setContent(html, { waitUntil: 'load' });
  await p.evaluate(async () => { await document.fonts.load("700 40px 'Chakra Petch'"); await document.fonts.load("600 20px 'JetBrains Mono'"); await document.fonts.ready; });
  await p.locator('#shot').screenshot({ path: path.join(OUT, 'youtube-banner-2560x1440.png') });
  // safe-area overlay check
  await p.evaluate(() => { const d = document.createElement('div'); d.style.cssText = 'position:absolute;left:507px;top:508px;width:1546px;height:423px;outline:4px dashed #ff4d6d;'; document.getElementById('shot').appendChild(d); });
  await p.locator('#shot').screenshot({ path: path.join(OUT, 'youtube-banner-safe-area-check.png') });
  await b.close(); console.log('done');
})();
