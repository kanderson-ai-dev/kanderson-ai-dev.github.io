import { describe, expect, it } from 'vitest';
import {
  projects,
  visibleProjects,
  openSourceProjects,
  onDemandProjects,
  getProject,
  totals,
} from './projects';
import { en } from '../i18n/en';
import { es } from '../i18n/es';

const shape = (obj: unknown): unknown =>
  Array.isArray(obj)
    ? obj.map(shape)
    : obj && typeof obj === 'object'
      ? Object.fromEntries(Object.entries(obj as Record<string, unknown>).map(([k, v]) => [k, shape(v)]))
      : typeof obj;

describe('project registry', () => {
  it('contains the published projects: open-source group first, then on-demand, each by order', () => {
    expect(projects.map((p) => p.slug)).toEqual([
      'langgraph-multiagent-orchestrator',
      'mcp-agent-toolkit-py',
      'agentic-rag-system',
      'agentic-api',
      'ecommerce-support-returns-copilot',
    ]);
    const access = projects.map((p) => p.access);
    const firstOd = access.indexOf('on-demand');
    expect(firstOd === -1 || access.slice(firstOd).every((a) => a === 'on-demand')).toBe(true);
    for (const list of [openSourceProjects, onDemandProjects]) {
      const orders = list.map((p) => p.order);
      expect([...orders].sort((a, b) => a - b)).toEqual(orders);
    }
    expect(openSourceProjects.length + onDemandProjects.length).toBe(visibleProjects.length);
  });

  it('resolves every project by slug', () => {
    for (const p of projects) expect(getProject(p.slug)).toBe(p);
  });

  it('has unique slugs and per-group orders', () => {
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
    for (const acc of ['open-source', 'on-demand'] as const) {
      const orders = projects.filter((p) => p.access === acc).map((p) => p.order);
      expect(new Set(orders).size).toBe(orders.length);
    }
  });

  it('on-demand projects have no repo URL and a get-in-touch CTA', () => {
    for (const p of projects.filter((p) => p.access === 'on-demand')) {
      expect(p.repoUrl).toBeNull();
      expect(p.copy.en?.cta).toBeTruthy();
    }
  });

  it('keeps honest numbers: every result carries a measured/simulated kind', () => {
    for (const p of projects)
      for (const r of p.copy.en?.results ?? [])
        expect(['measured', 'simulated']).toContain(r.kind);
  });

  it('embeds the published films', () => {
    expect(getProject('langgraph-multiagent-orchestrator')?.video?.youtubeId).toBe('4rsN0tXLVS4');
    expect(getProject('mcp-agent-toolkit-py')?.video?.youtubeId).toBe('3UZH518sOVg');
    expect(getProject('agentic-rag-system')?.video?.youtubeId).toBe('EWf5Oz8u7Xg');
    expect(getProject('agentic-api')?.video?.youtubeId).toBe('coUgnI7RFAI');
  });

  it('declares English burned-in plus Spanish CC captions on every film', () => {
    for (const p of projects) expect(p.video?.captionsLang).toEqual(['en', 'es']);
  });

  it('aggregates totals from real per-project test counts', () => {
    expect(totals.tests).toBe(visibleProjects.reduce((a, p) => a + p.tests, 0));
    expect(totals.testsPublic + totals.testsPrivate).toBe(totals.tests);
    expect(totals.testsPublic).toBe(openSourceProjects.reduce((a, p) => a + p.tests, 0));
    expect(totals.projects).toBe(visibleProjects.length);
    expect(totals.openSource + totals.onDemand).toBe(totals.projects);
  });
});

describe('i18n dictionaries', () => {
  it('es mirrors the en dictionary shape', () => {
    expect(shape(es)).toEqual(shape(en));
  });
});
