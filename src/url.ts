// Canonical URL form: every published route ends with a trailing slash —
// the form GitHub Pages actually serves (dist/<route>/index.html answers
// <route>/, and <route> is a 301 to it). One shared helper feeds router
// links, canonical, hreflang alternates, og:url and the sitemap so the
// form cannot drift. Files keep their extension, hashes and queries pass
// through untouched.

export const SITE = 'https://kaarstenanderson.com';

// '/projects' -> '/projects/'; '/#about' -> '/#about'; '/a/og.png' -> itself;
// '#id', '' and '/' pass through.
export const withSlash = (path: string): string => {
  const i = path.search(/[?#]/);
  const base = i === -1 ? path : path.slice(0, i);
  const suffix = i === -1 ? '' : path.slice(i);
  if (!base || base.endsWith('/') || /\.[a-z0-9]+$/i.test(base)) return base + suffix;
  return `${base}/${suffix}`;
};

// '/projects/' -> '/projects'; '/' stays '/'. Used when comparing a router
// location (either form) with a link path.
export const stripSlash = (path: string): string =>
  path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;

// The other-language twin of a route path:
// '/' <-> '/es/', '/projects/' <-> '/es/projects/'. The input may be in
// either slash form and either language; the output is always the
// canonical slashed form, so altPath(p, langOf(p)) === slashed p.
export const altPath = (path: string, to: 'en' | 'es'): string => {
  const bare = stripSlash(path.split(/[?#]/)[0]);
  const enBare =
    bare === '/es' || bare.startsWith('/es/')
      ? bare.replace(/^\/es(?=\/|$)/, '') || '/'
      : bare;
  if (to === 'es') return enBare === '/' ? '/es/' : `/es${enBare}/`;
  return enBare === '/' ? '/' : `${enBare}/`;
};

// Absolute canonical URL for a route path (already the slashed form, but
// withSlash keeps this correct either way).
export const canonicalFor = (path: string): string => `${SITE}${withSlash(path)}`;
