import type { Project } from '../types';
import { project as langgraph } from './langgraph-multiagent-orchestrator';
import { project as mcp } from './mcp-agent-toolkit-py';
import { project as rag } from './agentic-rag-system';
import { project as api } from './agentic-api';
import { project as ecom } from './ecommerce-support-returns-copilot';

export const projects: Project[] = [langgraph, mcp, rag, api, ecom].sort(
  (a, b) =>
    (a.access === 'open-source' ? 0 : 1) - (b.access === 'open-source' ? 0 : 1) ||
    a.order - b.order,
);

export const getProject = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug);

export const visibleProjects = projects.filter((p) => !p.hiddenFromIndex);
export const openSourceProjects = visibleProjects.filter((p) => p.access === 'open-source');
export const onDemandProjects = visibleProjects.filter((p) => p.access === 'on-demand');

const sumTests = (list: Project[]) => list.reduce((a, p) => a + p.tests, 0);
const topCov = Math.max(...visibleProjects.map((p) => p.coverage ?? 0));

// Aggregate, verifiable figures for the landing counter strip. On-demand
// projects count only once they have a page on the site; the notes show the
// public/private split so nothing unverifiable is mixed in silently.
export const totals = {
  projects: visibleProjects.length,
  openSource: openSourceProjects.length,
  onDemand: onDemandProjects.length,
  tests: sumTests(visibleProjects),
  testsPublic: sumTests(openSourceProjects),
  testsPrivate: sumTests(onDemandProjects),
  topCoverage: `${topCov}%`,
};
