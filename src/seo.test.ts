// SEO invariants (Step 0.5): every prerendered route is the trailing-slash
// form GitHub Pages serves, and canonical = hreflang self = sitemap <loc>
// (postbuild writes loc = SITE + route.path — the same value asserted here).
import { describe, expect, it } from 'vitest';
import { routes } from './entry-server';
import { altPath, canonicalFor, SITE, stripSlash, withSlash } from './url';
import { switchPath, titleForPath } from './i18n';
import { dicts } from './i18n';

describe('withSlash', () => {
  it('adds the slash only to extensionless routes', () => {
    expect(withSlash('/')).toBe('/');
    expect(withSlash('/projects')).toBe('/projects/');
    expect(withSlash('/projects/')).toBe('/projects/');
    expect(withSlash('/es')).toBe('/es/');
    expect(withSlash('/es/projects')).toBe('/es/projects/');
    expect(withSlash('/projects#on-demand')).toBe('/projects/#on-demand');
    expect(withSlash('/es/projects#open-source')).toBe('/es/projects/#open-source');
    expect(withSlash('/#contact')).toBe('/#contact');
    expect(withSlash('#contact')).toBe('#contact');
    expect(withSlash('')).toBe('');
    // files keep their extension — never a route
    expect(withSlash('/og.png')).toBe('/og.png');
    expect(withSlash('/projects/x/loop.webm')).toBe('/projects/x/loop.webm');
    expect(withSlash('/favicon.svg')).toBe('/favicon.svg');
  });
});

describe('altPath', () => {
  it('maps both slash forms to the canonical twin', () => {
    expect(altPath('/', 'es')).toBe('/es/');
    expect(altPath('/es/', 'en')).toBe('/');
    expect(altPath('/es', 'en')).toBe('/');
    expect(altPath('/projects/', 'es')).toBe('/es/projects/');
    expect(altPath('/projects', 'es')).toBe('/es/projects/');
    expect(altPath('/es/projects/x/', 'en')).toBe('/projects/x/');
    expect(altPath('/es/projects/x', 'en')).toBe('/projects/x/');
  });
});

describe('canonical = hreflang self = sitemap loc', () => {
  it('every prerendered route ends with the slash and is self-referencing', () => {
    expect(routes.length).toBeGreaterThan(0);
    for (const r of routes) {
      expect(r.path.endsWith('/'), r.path).toBe(true);
      // the hreflang alternate for the route's own language is the canonical
      // itself (postbuild emits the same SITE+path as <loc>)
      expect(`${SITE}${altPath(r.path, r.lang)}`, r.path).toBe(`${SITE}${r.path}`);
      expect(canonicalFor(r.path), r.path).toBe(`${SITE}${r.path}`);
    }
  });

  it('every route has its language twin', () => {
    for (const r of routes) {
      const twin = altPath(r.path, r.lang === 'en' ? 'es' : 'en');
      expect(
        routes.some((x) => x.path === twin),
        `${r.path} twin ${twin}`,
      ).toBe(true);
    }
  });
});

describe('switchPath', () => {
  it('produces the canonical slashed twin in both directions', () => {
    expect(switchPath('/projects/', 'es')).toBe('/es/projects/');
    expect(switchPath('/es/projects/', 'en')).toBe('/projects/');
    expect(switchPath('/projects', 'es')).toBe('/es/projects/');
    expect(switchPath('/', 'es')).toBe('/es/');
    expect(switchPath('/es/', 'en')).toBe('/');
    // no-op when already in the target language
    expect(switchPath('/es/projects/', 'es')).toBe('/es/projects/');
  });
});

describe('titleForPath', () => {
  it('resolves the same title in both slash forms', () => {
    const project = routes.find((r) => r.path.startsWith('/projects/') && r.lang === 'en');
    expect(project).toBeDefined();
    const bare = stripSlash(project!.path);
    expect(titleForPath(project!.path)).toBe(titleForPath(bare));
    expect(titleForPath('/es/')).toBe(dicts.es.meta.siteTitle);
    expect(titleForPath('/es/projects/')).toBe(dicts.es.meta.projectsTitle);
    expect(titleForPath('/projects/')).toBe(dicts.en.meta.projectsTitle);
  });
});
