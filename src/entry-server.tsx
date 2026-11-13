// Prerender entry — loaded by scripts/postbuild.mjs via vite ssrLoadModule.
// Renders each published route to static HTML so content is in the initial
// document (discoverable LCP, first paint before JS), then main.tsx hydrates.
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Shell } from './App';
import { projects } from './content/projects';
import { copyFor, dicts } from './i18n';
import type { Lang } from './content/types';

export const render = (url: string): string =>
  renderToString(
    <StaticRouter location={url}>
      <Shell />
    </StaticRouter>,
  );

export interface PrerenderRoute {
  path: string;
  lang: Lang;
  title: string;
  description: string;
  ogDescription?: string;
  ogImage?: string;
  lcpImage?: string;
}

const SITE = 'https://kaarstenanderson.com';

const flagship = projects.find((p) => p.slug === 'langgraph-multiagent-orchestrator');
const loopPoster = flagship?.loop ? `/projects/${flagship.slug}/loop-poster.webp` : undefined;
const siteOg = flagship ? `${SITE}${flagship.ogImage}` : undefined;

const routesFor = (lang: Lang): PrerenderRoute[] => {
  const d = dicts[lang];
  const p = (path: string) => (lang === 'es' ? (path === '/' ? '/es' : `/es${path}`) : path);
  return [
    {
      path: p('/'),
      lang,
      title: d.meta.siteTitle,
      description: d.meta.description,
      ogDescription: d.meta.ogDescription,
      ogImage: siteOg,
      lcpImage: loopPoster,
    },
    {
      path: p('/projects'),
      lang,
      title: d.meta.projectsTitle,
      description: d.meta.description,
      ogDescription: d.meta.ogDescription,
      ogImage: siteOg,
    },
    ...projects.map((proj) => {
      const copy = copyFor(proj, lang);
      return {
        path: p(`/projects/${proj.slug}`),
        lang,
        title: `${copy.title} — Kaarsten Anderson`,
        description: copy.tagline,
        ogImage: `${SITE}${proj.ogImage}`,
        lcpImage: `/projects/${proj.slug}/hook-1920.webp`,
      };
    }),
  ];
};

export const routes: PrerenderRoute[] = [...routesFor('en'), ...routesFor('es')];
