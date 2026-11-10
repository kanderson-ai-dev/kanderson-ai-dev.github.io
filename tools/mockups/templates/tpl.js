/* Shared helpers for mockup templates. */
const GRAIN_SVG = `<svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 480 270">
  <filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
  <rect width="480" height="270" filter="url(#g)"/></svg>`;

function stage(opts = {}) {
  const el = document.createElement('div');
  el.className = 'stage';
  el.innerHTML = `<div class="grid"></div>${opts.halo === false ? '' : '<div class="halo"></div>'}<div class="vignette"></div>`;
  if (opts.grain !== false) {
    const g = document.createElement('div');
    g.className = 'grain'; g.innerHTML = GRAIN_SVG; el.appendChild(g);
  }
  if (opts.brackets) {
    const b = document.createElement('div');
    b.className = 'brackets';
    b.innerHTML = '<i class="tl"></i><i class="tr"></i><i class="bl"></i><i class="br"></i>';
    el.appendChild(b);
  }
  document.body.appendChild(el);
  return el;
}

/* Film "real app" browser chrome (RealFrame replica). Returns {root, view}. */
function chrome({ width, imgSrc, imgNatural = [1920, 1080], crop = null, tag = 'REAL APP · LIVE RUN', url = 'kaarstenanderson.com', glow = true } = {}) {
  const [iw, ih] = imgNatural;
  const [cx, cy, cw, ch] = crop ?? [0, 0, iw, ih];
  const scale = width / cw;
  const imgW = iw * scale, imgH = ih * scale;
  const offX = -cx * scale, offY = -cy * scale;
  const frameH = ch * scale;
  const root = document.createElement('div');
  root.className = 'chrome';
  root.style.width = width + 'px';
  if (!glow) root.style.boxShadow = '0 30px 70px #000000cc';
  const showUrl = width >= 700, showTag = tag !== '' && width >= 300;
  root.innerHTML = `
    <div class="bar">
      <div class="dot" style="background:#ff5f57"></div>
      <div class="dot" style="background:#febc2e"></div>
      <div class="dot" style="background:#28c840"></div>
      ${showUrl ? `<div class="url">${url}</div>` : ''}
      ${showTag ? `<div class="tag">${tag}</div>` : ''}
    </div>
    <div class="view" style="width:${width}px;height:${frameH}px">
      <img src="${imgSrc}" style="left:${offX}px;top:${offY}px;width:${imgW}px;height:${imgH}px" draggable="false">
    </div>`;
  return { root, view: root.querySelector('.view'), scale, offset: [cx, cy] };
}

/* Add RealFrame-style highlights into view. rect in SOURCE px of the image. */
function addHighlights(view, highlights, scale, offset) {
  const [ix, iy] = offset;
  const dims = highlights.filter((h) => h.dim !== false).map((h) => h.rect);
  if (dims.length) {
    const u = dims.reduce((a, r) => [Math.min(a[0], r[0]), Math.min(a[1], r[1]),
      Math.max(a[0] + a[2], r[0] + r[2]) - Math.min(a[0], r[0]),
      Math.max(a[1] + a[3], r[1] + r[3]) - Math.min(a[1], r[1])]);
    const s = document.createElement('div');
    s.className = 'scrim';
    s.style.cssText = `left:${(u[0] - ix) * scale - 5}px;top:${(u[1] - iy) * scale - 5}px;width:${u[2] * scale + 10}px;height:${u[3] * scale + 10}px`;
    view.appendChild(s);
  }
  for (const h of highlights) {
    const [hx, hy, hw, hh] = h.rect;
    const color = h.color || 'var(--accent)';
    const box = document.createElement('div');
    box.className = 'hl';
    box.style.cssText = `left:${(hx - ix) * scale - 8}px;top:${(hy - iy) * scale - 8}px;width:${hw * scale + 16}px;height:${hh * scale + 16}px;border-color:${color};box-shadow:0 0 22px ${color}55,inset 0 0 22px ${color}18`;
    view.appendChild(box);
    if (h.label) {
      const l = document.createElement('div');
      l.className = 'hl-label';
      l.style.cssText = `left:${(hx - ix) * scale}px;background:${color};box-shadow:0 6px 24px ${color}66;` +
        (h.labelPos === 'below' ? `top:${(hy + hh - iy) * scale + 14}px` : `top:${(hy - iy) * scale - 50}px`);
      l.textContent = h.label;
      view.appendChild(l);
    }
  }
}

function kicker(text, size = 26) {
  const k = document.createElement('div');
  k.className = 'kicker'; k.style.fontSize = size + 'px'; k.textContent = text;
  return k;
}

function chip(text, cls = '') {
  const c = document.createElement('span');
  c.className = 'chip ' + cls; c.textContent = text;
  return c;
}
