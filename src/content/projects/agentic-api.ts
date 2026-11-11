import type { Project } from '../types';

const dir = '/projects/agentic-api';
const img = (n: number, alt: string) => ({
  src: `${dir}/feature-${n}-1600.webp`,
  alt,
  width: 1600,
  height: 900,
});

export const project: Project = {
  slug: 'agentic-api',
  access: 'open-source',
  order: 4,
  category: 'python',
  status: 'live',
  year: 2026,
  repoUrl: 'https://github.com/kanderson-ai-dev/agentic-api',
  tests: 179,
  coverage: 98,
  stack: ['Python', 'FastAPI', 'LangGraph', 'Pydantic', 'SQLite', 'Langfuse', 'Prometheus', 'Docker'],
  languages: ['en'],
  cardImage: {
    src: `${dir}/card-800.webp`,
    alt: 'Guardrailed Agentic AI API — the live /docs endpoint list',
    width: 800,
    height: 500,
  },
  heroImage: {
    src: `${dir}/hero-1600.webp`,
    alt: 'The live service: Swagger /docs flanked by a blocked prompt-injection response and an SSE stream',
    width: 1600,
    height: 1000,
  },
  ogImage: `${dir}/og.png`,
  video: {
    youtubeId: 'coUgnI7RFAI',
    poster: {
      src: `${dir}/video-poster-1920.webp`,
      alt: 'Watch the Guardrailed Agentic AI API film',
      width: 1920,
      height: 1080,
    },
    captionsLang: ['en', 'es'],
  },
  architecture: {
    src: `${dir}/architecture.webp`,
    alt: 'Architecture of the Guardrailed Agentic AI API: FastAPI edge checks, injection guardrail, planner with tools, output guardrail, prompt registry, checkpoints and observability stores',
    description:
      'The Client hits the FastAPI edge (request-id, security headers, rate limit, API key) over POST /agent/run and /agent/stream. The edge passes the guardrail (sanitize + injection screen, OWASP LLM01): blocked input short-circuits to error_output and then the JSON/SSE response; safe input reaches the planner (structured output with retry/backoff), then execution tools (calculator, echo, web_search), then the output_guardrail leak screen (OWASP LLM02) before the JSON/SSE response. The Prompt Registry (prompts/<name>/vN.yaml + registry.json) supplies the promoted template and links to the hash-chained audit log; the planner keeps per-session checkpoints in SQLite and emits opt-in traces; the edge emits structlog JSON logs and Prometheus /metrics counters.',
  },
  gallery: [
    {
      src: `${dir}/gallery-1-1200.webp`,
      alt: 'Interactive OpenAPI documentation served live at /docs by the FastAPI service',
      width: 1200,
      height: 750,
    },
    {
      src: `${dir}/gallery-2-1200.webp`,
      alt: 'Liveness and readiness probes answering real HTTP requests on the running service',
      width: 1200,
      height: 750,
    },
    {
      src: `${dir}/gallery-3-1200.webp`,
      alt: 'Unified diff between promoted planner v1 and a candidate v2 prompt artifact',
      width: 1200,
      height: 750,
    },
    {
      src: `${dir}/gallery-4-1200.webp`,
      alt: 'HTTP 429 body returned after exceeding the per-client rate-limit budget',
      width: 1200,
      height: 750,
    },
    {
      src: `${dir}/gallery-5-1200.webp`,
      alt: 'Audit verification returning a valid SHA-256 hash chain over the prompt registry',
      width: 1200,
      height: 750,
    },
  ],
  copy: {
    en: {
      title: 'Guardrailed Agentic AI API',
      tagline:
        'A hardened agent API: attacks screened before the model, leaks screened after it, prompts versioned behind an evaluation gate.',
      cardBlurb:
        'OWASP LLM01/LLM02 guardrails, gated prompt releases, streaming, memory and request-ID observability.',
      hook: { line: 'A prompt glued to an endpoint.', accent: 'One jailbreak and it breaks.', tone: 'danger' },
      problem:
        'Most AI features are a prompt glued to an endpoint: one jailbreak, rate limit, follow-up question or careless prompt edit and they break.',
      solution:
        'Every request is screened before the model and every answer before it leaves; blocked requests cost zero tokens; prompts ship only through an audited evaluation gate; every answer is traceable by request ID.',
      howItWorks: [
        {
          title: 'Edge',
          text: 'Each call gets a request ID, an optional API-key check and a per-client rate limit (429, not a surprise bill).',
        },
        {
          title: 'Input guardrail',
          text: 'Injection and system-prompt extraction are blocked before the model is ever called.',
        },
        {
          title: 'Plan and act',
          text: 'The model plans in a strict schema with retry/backoff; code runs the tools; memory persists per session.',
        },
        {
          title: 'Output guardrail',
          text: 'Answers are screened for prompt leakage before they leave; streamed content is released only after this check.',
        },
        {
          title: 'Observe',
          text: 'Traces, JSON logs and Prometheus metrics share one request ID and name the prompt version that answered.',
        },
      ],
      features: [
        {
          title: 'Promise one:',
          titleAccent: 'attacks stay out.',
          tone: 'accent',
          text: 'Every request is screened for prompt injection before the model is called (OWASP LLM01). A blocked request returns a generic error and costs zero tokens.',
          image: img(1, 'A real blocked response zoomed on "blocked": true with an empty plan and tool_calls'),
        },
        {
          title: 'Promise two:',
          titleAccent: 'secrets stay in.',
          tone: 'accent',
          text: 'Answers are re-screened for system-prompt leakage and reflected injection before they leave (OWASP LLM02). A flagged answer is replaced with a safe message.',
          image: img(2, 'An SSE stream where content is released only after the output guardrail passes'),
        },
        {
          title: 'Promise three:',
          titleAccent: 'every change is proven.',
          tone: 'accent',
          text: 'Prompts are versioned artifacts promoted only if they pass an A/B evaluation gate; the safety metric can never be overridden. Every change is sealed in a hash-chained audit log and rollback takes one call.',
          image: img(3, 'An A/B evaluation gate blocking a regressing prompt candidate'),
        },
        {
          title: 'A hiccup?',
          titleAccent: 'It retries.',
          tone: 'accent',
          text: 'Conversations persist per session, so follow-ups like "now double that" resolve against full history. Transient model errors are retried with backoff instead of becoming 500s.',
          image: img(4, 'A session follow-up resolved against the full conversation history'),
        },
        {
          title: 'One request ID.',
          titleAccent: 'Every answer traceable.',
          tone: 'accent',
          text: 'One request ID ties traces, JSON logs and Prometheus counters together. Every response names the prompt version and hash that produced it.',
          image: img(5, 'Prometheus metrics and a JSON log line tied by the same request ID'),
        },
        {
          title: 'Production-shaped',
          titleAccent: 'by default.',
          tone: 'accent',
          text: 'Per-client rate limiting, optional API-key auth and a non-root Docker image with a health check. CI runs the full suite with zero secrets.',
          image: img(6, 'A real 429 rate-limit response, readiness probe output and the non-root Dockerfile healthcheck'),
        },
      ],
      results: [
        {
          label: 'Automated tests',
          value: '179',
          note: 'Fully offline, deterministic planner (1 live-only test skipped)',
          kind: 'measured',
        },
        {
          label: 'Coverage',
          value: '98%',
          note: 'Line coverage, measured in CI',
          kind: 'measured',
        },
        {
          label: 'Injection block rate',
          value: '100%',
          note: 'Gate dataset · 22 synthetic cases · planner v1 · 2026-10-09',
          kind: 'measured',
        },
        {
          label: 'Prompt leak rate',
          value: '0%',
          note: 'Same gate dataset',
          kind: 'measured',
        },
        {
          label: 'CI',
          value: 'Green, zero secrets',
          note: 'ruff + mypy + pytest + Docker build',
          kind: 'measured',
        },
      ],
      limitations: [
        'SQLite memory suits demos and light workloads; high concurrency should move to a Postgres checkpointer.',
        'Shared-secret API-key auth, not OAuth2/JWT identity; no multi-tenant isolation.',
        'The 22-case evaluation dataset guards against regressions on known cases; it does not prove prompt quality.',
      ],
      galleryHeadline: { title: 'A real, running service.', accent: 'Not a slide.' },
      cta: {
        headline: 'Your product. Your tools. Your rules.',
        text: 'Guardrails, streaming, memory and a prompt gate — the boring parts are already done; the tools shown are examples, adapted to your systems on request.',
      },
    },
    es: undefined,
  },
};
