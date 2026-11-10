// Post-build: GitHub Pages SPA fallback (404.html) + prerender every published
// route to static HTML (dist/<route>/index.html) so the initial document
// already contains the page — instant first paint and a discoverable,
// preloadable LCP image. React hydrates the static markup on load.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createServer } from 'vite';

const dist = resolve('dist');
const template = readFileSync(resolve(dist, 'index.html'), 'utf8');
copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'));

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

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
    if (route.lcpImage) {
      html = html.replace(
        '</head>',
        `    <link rel="preload" as="image" href="${route.lcpImage}" fetchpriority="high" />\n  </head>`,
      );
    }
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(route.title)}</title>`);
    if (route.path === '/es' || route.path.startsWith('/es/')) {
      html = html.replace('<html lang="en">', '<html lang="es">');
    }
    const out = resolve(dist, `.${route.path === '/' ? '' : route.path}/index.html`);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, html);
  }
  console.log(`postbuild: wrote dist/404.html + prerendered ${routes.length} routes`);
} finally {
  await vite.close();
}
