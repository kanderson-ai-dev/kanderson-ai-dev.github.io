// Post-build: GitHub Pages SPA fallback (404.html) + prerender every published
// route to static HTML (dist/<route>/index.html) so the initial document
// already contains the page — instant first paint and a discoverable,
// preloadable LCP image. React hydrates the static markup on load.
// Each route also gets its own canonical, hreflang en/es/x-default triplet,
// og locale and per-route title/description/image (D-I18N1).
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createServer } from 'vite';

const dist = resolve('dist');
const template = readFileSync(resolve(dist, 'index.html'), 'utf8');
copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'));

const SITE = 'https://kaarstenanderson.com';
const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const setMeta = (html, pattern, content) =>
  html.replace(pattern, (m) => m.replace(/content="[^"]*"/, `content="${escapeHtml(content)}"`));

// The other-language twin of a route path ('/' <-> '/es', '/x' <-> '/es/x').
const altPath = (path, to) =>
  to === 'es' ? (path === '/' ? '/es' : `/es${path}`) : path.replace(/^\/es(?=\/|$)/, '') || '/';
const alternates = (path) => {
  const enPath = path === '/es' || path.startsWith('/es/') ? altPath(path, 'en') : path;
  const esPath = altPath(enPath, 'es');
  return [
    `    <link rel="alternate" hreflang="en" href="${SITE}${enPath}" />`,
    `    <link rel="alternate" hreflang="es" href="${SITE}${esPath}" />`,
    `    <link rel="alternate" hreflang="x-default" href="${SITE}${enPath}" />`,
  ].join('\n');
};

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});
try {
  const { render, routes } = await vite.ssrLoadModule('/src/entry-server.tsx');
  for (const route of routes) {
    let html = template.replace(
      '<div id="root"></div>',
      `<div id="root">${render(route.path)}</div>`,
    );
    const canonical = `${SITE}${route.path}`;
    const head = [
      `    <link rel="canonical" href="${canonical}" />`,
      alternates(route.path),
      `    <meta property="og:locale" content="${route.lang === 'es' ? 'es_ES' : 'en_US'}" />`,
      `    <meta property="og:locale:alternate" content="${route.lang === 'es' ? 'en_US' : 'es_ES'}" />`,
    ];
    if (route.lcpImage) {
      head.push(
        `    <link rel="preload" as="image" href="${route.lcpImage}" fetchpriority="high" />`,
      );
    }
    html = html.replace('</head>', `${head.join('\n')}\n  </head>`);
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(route.title)}</title>`);
    html = setMeta(html, /<meta\s+name="description"[^>]*\/>/, route.description);
    html = setMeta(html, /<meta\s+property="og:title"[^>]*\/>/, route.title);
    html = setMeta(html, /<meta\s+property="og:description"[^>]*\/>/, route.ogDescription ?? route.description);
    html = setMeta(html, /<meta\s+property="og:url"[^>]*\/>/, canonical);
    if (route.ogImage) html = setMeta(html, /<meta\s+property="og:image"[^>]*\/>/, route.ogImage);
    if (route.lang === 'es') html = html.replace('<html lang="en">', '<html lang="es">');
    const out = resolve(dist, `.${route.path === '/' ? '' : route.path}/index.html`);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, html);
  }
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${routes
    .map(
      (r) => `  <url>\n    <loc>${SITE}${r.path}</loc>\n${alternates(r.path)
        .split('\n')
        .map((l) => `    ${l.trim().replace('<link', '<xhtml:link')}`)
        .join('\n')}\n  </url>`,
    )
    .join('\n')}\n</urlset>\n`;
  writeFileSync(resolve(dist, 'sitemap.xml'), sitemap);
  console.log(`postbuild: wrote dist/404.html + sitemap.xml + prerendered ${routes.length} routes`);
} finally {
  await vite.close();
}
