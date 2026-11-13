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
import { copyFor, pick } from '../i18n';

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
        expect(pick(v.alt, 'en').length).toBeGreaterThan(0);
        expect(pick(v.description, 'en').length).toBeGreaterThan(0);
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

describe('bilingual project copy (D-I18N1)', () => {
  it('declares en + es on every project', () => {
    for (const p of projects) {
      expect(p.languages).toContain('en');
      expect(p.languages).toContain('es');
    }
  });

  it('mirrors the en copy shape in es: same fields, same counts', () => {
    for (const p of projects) {
      expect(p.copy.es, p.slug).toBeDefined();
      expect(shape(p.copy.es)).toEqual(shape(p.copy.en));
    }
  });

  it('keeps product names, metric values and image sources identical across languages', () => {
    for (const p of projects) {
      const enC = p.copy.en!;
      const esC = p.copy.es!;
      expect(esC.title).toBe(enC.title);
      expect(esC.features.map((f) => f.image.src)).toEqual(enC.features.map((f) => f.image.src));
      for (const [i, r] of (enC.results ?? []).entries()) {
        expect(esC.results?.[i]?.value).toBe(r.value);
        expect(esC.results?.[i]?.kind).toBe(r.kind);
      }
      if (enC.baseline) {
        expect(esC.baseline?.pipeline).toBe(enC.baseline.pipeline);
        expect(esC.baseline?.baseline).toBe(enC.baseline.baseline);
      }
    }
  });

  it('resolves an es value for every localized image and architecture text', () => {
    for (const p of projects) {
      for (const [where, l] of [
        ['cardImage.alt', p.cardImage.alt],
        ['heroImage.alt', p.heroImage.alt],
        ...((p.gallery ?? []).map((g, i) => [`gallery[${i}].alt`, g.alt] as const)),
      ]) {
        if (typeof l !== 'string') expect(l.es, `${p.slug} ${where}`).toBeDefined();
      }
      const views = p.architecture ? (Array.isArray(p.architecture) ? p.architecture : [p.architecture]) : [];
      for (const v of views) {
        for (const l of [v.alt, v.description, v.title]) {
          if (l !== undefined && typeof l !== 'string') expect(l.es, p.slug).toBeDefined();
        }
      }
    }
  });

  it('catches a broken es copy: dropping a how-it-works step changes the shape', () => {
    const p = projects.find((x) => x.copy.es);
    expect(p).toBeDefined();
    const broken = { ...p!.copy.es!, howItWorks: p!.copy.es!.howItWorks.slice(1) };
    expect(shape(broken)).not.toEqual(shape(p!.copy.en));
  });
});

describe('i18n helpers', () => {
  it('pick resolves localized strings per language with English fallback', () => {
    expect(pick('plain', 'es')).toBe('plain');
    expect(pick({ en: 'hello', es: 'hola' }, 'es')).toBe('hola');
    expect(pick({ en: 'hello', es: 'hola' }, 'en')).toBe('hello');
    expect(pick({ en: 'hello' }, 'es')).toBe('hello');
    expect(pick(undefined, 'en')).toBe('');
  });

  it('copyFor returns the language copy and falls back to English', () => {
    for (const p of projects) {
      expect(copyFor(p, 'en')).toBe(p.copy.en);
      expect(copyFor(p, 'es')).toBe(p.copy.es ?? p.copy.en);
    }
  });
});
