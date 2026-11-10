// Language by URL: /… = EN, /es/… = ES (Plan.md §8).
import { useLocation } from 'react-router-dom';
import { en, type Dict } from './en';
import { es } from './es';
import type { Lang } from '../content/types';

export const dicts: Record<Lang, Dict> = { en, es };

export const langFromPath = (pathname: string): Lang =>
  pathname === '/es' || pathname.startsWith('/es/') ? 'es' : 'en';

export const useLang = (): { lang: Lang; dict: Dict; l: (path: string) => string } => {
  const { pathname } = useLocation();
  const lang = langFromPath(pathname);
  const l = (path: string) => {
    const p = path === '/' ? '' : path;
    return lang === 'es' ? `/es${p || '/'}` : p || '/';
  };
  return { lang, dict: dicts[lang], l };
};

export const switchPath = (pathname: string, to: Lang): string => {
  const lang = langFromPath(pathname);
  if (lang === to) return pathname;
  if (to === 'es') return pathname === '/' ? '/es' : `/es${pathname}`;
  return pathname.replace(/^\/es(?=\/|$)/, '') || '/';
};
