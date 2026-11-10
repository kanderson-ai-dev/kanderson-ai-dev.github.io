import type { Project } from '../types';
import { project as langgraph } from './langgraph-multiagent-orchestrator';
import { project as mcp } from './mcp-agent-toolkit-py';
import { project as rag } from './agentic-rag-system';
import { project as api } from './agentic-api';

export const projects: Project[] = [langgraph, mcp, rag, api].sort(
  (a, b) => a.order - b.order,
);

export const getProject = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug);

export const visibleProjects = projects.filter((p) => !p.hiddenFromIndex);

// Aggregate, verifiable figures for the landing counter strip.
export const totals = {
  tests: 572 + 517 + 394 + 179, // automated tests across the four live projects
  projects: projects.length,
  topCoverage: '98%',
};
