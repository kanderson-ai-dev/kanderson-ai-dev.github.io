// Post-build SEO guard (Step 0.5): every published route is served at the
// trailing-slash URL GitHub Pages redirects to, so canonical = hreflang
// self = sitemap <loc> = og:url, all ending in '/'. Fails the build when:
//   * a prerendered page's canonical != its own route URL (or lacks the slash)
//   * its own-language hreflang alternate != the canonical
//   * og:url != canonical
//   * a sitemap <loc> lacks the slash or the loc set != the canonical set
//   * any internal href points to a no-slash route (files keep extensions)
//   * /favicon.ico is missing
// Run automatically at the end of `npm run build`.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const DIST = resolve('dist');
const SITE = 'https://kaarstenanderson.com';
let failures = 0;
const err = (m) => {
  console.error(`seo: ${m}`);
  failures += 1;
};

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : e.name === 'index.html' ? [join(dir, e.name)] : [],
  );

// Route path of a dist/<route>/index.html file: '/' , '/es/', '/projects/x/'.
const routeOf = (file) => `/${relative(DIST, file).replace(/index\.html$/, '').replaceAll('\\', '/')}`;

const attr = (html, re) => html.match(re)?.[1];
const canonicals = new Set();

for (const file of walk(DIST)) {
  const html = readFileSync(file, 'utf8');
  const rel = relative(DIST, file);
  const canonical = attr(html, /<link rel="canonical" href="([^"]+)"/);
  if (!canonical) {
    err(`${rel}: no <link rel="canonical">`);
    continue;
  }
  canonicals.add(canonical);
  const route = routeOf(file);
  if (!route.endsWith('/')) err(`${rel}: route '${route}' has no trailing slash`);
  if (canonical !== `${SITE}${route}`) err(`${rel}: canonical '${canonical}' != '${SITE}${route}'`);
  if (!canonical.endsWith('/')) err(`${rel}: canonical '${canonical}' has no trailing slash`);

  const og = attr(html, /<meta property="og:url" content="([^"]+)"/);
  if (og && og !== canonical) err(`${rel}: og:url '${og}' != canonical '${canonical}'`);

  const alts = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)];
  const langs = Object.fromEntries(alts.map((m) => [m[1], m[2]]));
  const selfLang = route === '/es/' || route.startsWith('/es/') ? 'es' : 'en';
  if (langs[selfLang] !== canonical) {
    err(`${rel}: hreflang ${selfLang} '${langs[selfLang]}' != canonical '${canonical}'`);
  }
  for (const l of ['en', 'es', 'x-default']) {
    if (!langs[l]?.endsWith('/')) err(`${rel}: hreflang ${l} missing or has no trailing slash`);
  }

  for (const m of html.matchAll(/href="(\/[^"#?]*)[#?]?/g)) {
    const p = m[1];
    if (p !== '/' && !p.endsWith('/') && !/\.[a-z0-9]+$/i.test(p)) {
      err(`${rel}: internal href '${m[0].slice(6)}' points to a no-slash route`);
    }
  }
}

const sitemapPath = join(DIST, 'sitemap.xml');
if (!existsSync(sitemapPath)) {
  err('sitemap.xml missing');
} else {
  const locs = [...readFileSync(sitemapPath, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  for (const loc of locs) if (!loc.endsWith('/')) err(`sitemap <loc> '${loc}' has no trailing slash`);
  const missing = [...locs].filter((l) => !canonicals.has(l));
  const extra = [...canonicals].filter((c) => !locs.includes(c));
  if (missing.length) err(`sitemap locs without a page canonical: ${missing.join(', ')}`);
  if (extra.length) err(`page canonicals missing from sitemap: ${extra.join(', ')}`);
}

const ico = join(DIST, 'favicon.ico');
if (!existsSync(ico) || statSync(ico).size < 1000) err('favicon.ico missing or suspiciously small');

if (failures) {
  console.error(`seo: ${failures} failure(s)`);
  process.exit(1);
}
console.log(`seo: ${canonicals.size} canonical routes verified (trailing-slash canonical = hreflang self = sitemap loc)`);
