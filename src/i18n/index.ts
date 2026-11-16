// Language by URL: /… = EN, /es/… = ES (Plan.md §8).
import { useLocation } from 'react-router-dom';
import { en, type Dict } from './en';
import { es } from './es';
import { getProject } from '../content/projects';
import { altPath, stripSlash, withSlash } from '../url';
import type { Lang, Localized, Project, ProjectCopy } from '../content/types';

export const dicts: Record<Lang, Dict> = { en, es };

// Pick the string for the active language; falls back to English, then ''.
export const pick = (v: Localized | undefined, lang: Lang): string =>
  typeof v === 'string' ? v : (v?.[lang] ?? v?.en ?? '');

// The project's copy for the active language; English is the safety net
// (D-I18N1 keeps every published project bilingual).
export const copyFor = (p: Project, lang: Lang): ProjectCopy => p.copy[lang] ?? p.copy.en!;

export const langFromPath = (pathname: string): Lang =>
  pathname === '/es' || pathname.startsWith('/es/') ? 'es' : 'en';

export const useLang = (): { lang: Lang; dict: Dict; l: (path: string) => string } => {
  const { pathname } = useLocation();
  const lang = langFromPath(pathname);
  const l = (path: string) =>
    lang === 'es' ? withSlash(path === '/' ? '/es' : `/es${path}`) : withSlash(path);
  return { lang, dict: dicts[lang], l };
};

export const switchPath = (pathname: string, to: Lang): string => {
  const lang = langFromPath(pathname);
  if (lang === to) return pathname;
  return altPath(pathname, to);
};

// Document title for the route — same strings the prerender writes into <head>.
export const titleForPath = (pathname: string): string => {
  const norm = stripSlash(pathname);
  const lang = langFromPath(norm);
  const d = dicts[lang];
  const stripped = lang === 'es' ? norm.replace(/^\/es(?=\/|$)/, '') || '/' : norm;
  const slug = stripped.match(/^\/projects\/([^/]+)/)?.[1];
  const p = slug && getProject(slug);
  if (p) return `${copyFor(p, lang).title} — Kaarsten Anderson`;
  if (stripped === '/projects') return d.meta.projectsTitle;
  return d.meta.siteTitle;
};
