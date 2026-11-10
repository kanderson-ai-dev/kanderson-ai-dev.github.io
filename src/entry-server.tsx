// Prerender entry — loaded by scripts/postbuild.mjs via vite ssrLoadModule.
// Renders each published route to static HTML so content is in the initial
// document (discoverable LCP, first paint before JS), then main.tsx hydrates.
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Shell } from './App';
import { projects } from './content/projects';

export const render = (url: string): string =>
  renderToString(
    <StaticRouter location={url}>
      <Shell />
    </StaticRouter>,
  );

export interface PrerenderRoute {
  path: string;
  title: string;
  lcpImage?: string;
}

const flagship = projects.find((p) => p.slug === 'langgraph-multiagent-orchestrator');
const loopPoster = flagship?.loop ? `/projects/${flagship.slug}/loop-poster.webp` : undefined;

const enRoutes: PrerenderRoute[] = [
  {
    path: '/',
    title: 'Kaarsten Anderson — Agentic AI Developer',
    lcpImage: loopPoster,
  },
  { path: '/projects', title: 'Projects — Kaarsten Anderson' },
  ...projects.map((p) => ({
    path: `/projects/${p.slug}`,
    title: `${p.copy.en!.title} — Kaarsten Anderson`,
    lcpImage: `/projects/${p.slug}/hook-1920.webp`,
  })),
];

export const routes: PrerenderRoute[] = [
  ...enRoutes,
  ...enRoutes.map((r) => ({
    path: r.path === '/' ? '/es' : `/es${r.path}`,
    title: r.title,
    lcpImage: r.lcpImage,
  })),
];
