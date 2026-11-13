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
  it('contains the published projects: on-demand group first, then open-source, each by order', () => {
    expect(projects.map((p) => p.slug)).toEqual([
      'ecommerce-support-returns-copilot',
      'langgraph-multiagent-orchestrator',
      'mcp-agent-toolkit-py',
      'agentic-rag-system',
      'agentic-api',
    ]);
    const access = projects.map((p) => p.access);
    const firstOs = access.indexOf('open-source');
    expect(firstOs === -1 || access.slice(firstOs).every((a) => a === 'open-source')).toBe(true);
    for (const list of [openSourceProjects, onDemandProjects]) {
      const orders = list.map((p) => p.order);
      expect([...orders].sort((a, b) => a - b)).toEqual(orders);
    }
    expect(openSourceProjects.length + onDemandProjects.length).toBe(visibleProjects.length);
  });

  it('leads prev/next order with an on-demand project when any exists', () => {
    if (onDemandProjects.length > 0) expect(visibleProjects[0].access).toBe('on-demand');
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

  it('on-demand projects have no repo URL, a get-in-touch CTA and no limitations (D-OD8)', () => {
    for (const p of projects.filter((p) => p.access === 'on-demand')) {
      expect(p.repoUrl).toBeNull();
      expect(p.copy.en?.cta).toBeTruthy();
      expect(p.copy.en?.limitations).toBeUndefined();
      expect(p.copy.es?.limitations).toBeUndefined();
    }
    for (const p of projects.filter((p) => p.access === 'open-source')) {
      expect(p.copy.en?.limitations?.length ?? 0).toBeGreaterThanOrEqual(1);
    }
  });

  it('keeps honest numbers: every result carries a measured/simulated kind', () => {
    for (const p of projects)
      for (const r of p.copy.en?.results ?? [])
        expect(['measured', 'simulated']).toContain(r.kind);
  });

  it('supports a single architecture view or a list of views; the orchestrator ships two', () => {
    const orc = getProject('langgraph-multiagent-orchestrator');
    expect(Array.isArray(orc?.architecture)).toBe(true);
    expect(orc?.architecture).toHaveLength(2);
    for (const p of projects) {
      const a = p.architecture;
      if (!a) continue;
      for (const v of Array.isArray(a) ? a : [a]) {
        expect(v.src.startsWith(`/projects/${p.slug}/`)).toBe(true);
        expect(v.alt.length).toBeGreaterThan(0);
        expect(v.description.length).toBeGreaterThan(0);
      }
    }
  });

  it('embeds the published films', () => {
    expect(getProject('ecommerce-support-returns-copilot')?.video?.youtubeId).toBe('Btnuw-aMXtA');
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
