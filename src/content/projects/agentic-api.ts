import type { Localized, Project } from '../types';

const dir = '/projects/agentic-api';
const img = (n: number, alt: string) => ({
  src: `${dir}/feature-${n}-1600.webp`,
  alt,
  width: 1600,
  height: 900,
});
const gal = (n: number, alt: Localized) => ({
  src: `${dir}/gallery-${n}-1200.webp`,
  alt,
  width: 1200,
  height: 750,
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
  languages: ['en', 'es'],
  cardImage: {
    src: `${dir}/card-800.webp`,
    alt: {
      en: 'Guardrailed Agentic AI API — the live /docs endpoint list',
      es: 'Guardrailed Agentic AI API — la lista de endpoints de /docs en vivo',
    },
    width: 800,
    height: 500,
  },
  heroImage: {
    src: `${dir}/hero-1600.webp`,
    alt: {
      en: 'The live service: Swagger /docs flanked by a blocked prompt-injection response and an SSE stream',
      es: 'El servicio en vivo: /docs de Swagger flanqueado por una respuesta de inyección de prompt bloqueada y un stream SSE',
    },
    width: 1600,
    height: 1000,
  },
  ogImage: `${dir}/og.png`,
  video: {
    youtubeId: 'coUgnI7RFAI',
    poster: {
      src: `${dir}/video-poster-1920.webp`,
      alt: {
        en: 'Watch the Guardrailed Agentic AI API film',
        es: 'Ver la película de Guardrailed Agentic AI API',
      },
      width: 1920,
      height: 1080,
    },
    captionsLang: ['en', 'es'],
  },
  architecture: {
    src: `${dir}/architecture.webp`,
    alt: {
      en: 'Architecture of the Guardrailed Agentic AI API: FastAPI edge checks, injection guardrail, planner with tools, output guardrail, prompt registry, checkpoints and observability stores',
      es: 'Arquitectura de la Guardrailed Agentic AI API: checks de borde FastAPI, guardrail de inyección, planner con herramientas, guardrail de salida, registro de prompts, checkpoints y almacenes de observabilidad',
    },
    description: {
      en: 'The Client hits the FastAPI edge (request-id, security headers, rate limit, API key) over POST /agent/run and /agent/stream. The edge passes the guardrail (sanitize + injection screen, OWASP LLM01): blocked input short-circuits to error_output and then the JSON/SSE response; safe input reaches the planner (structured output with retry/backoff), then execution tools (calculator, echo, web_search), then the output_guardrail leak screen (OWASP LLM02) before the JSON/SSE response. The Prompt Registry (prompts/<name>/vN.yaml + registry.json) supplies the promoted template and links to the hash-chained audit log; the planner keeps per-session checkpoints in SQLite and emits opt-in traces; the edge emits structlog JSON logs and Prometheus /metrics counters.',
      es: 'El Cliente llega al borde FastAPI (request-id, cabeceras de seguridad, límite de tasa, API key) sobre POST /agent/run y /agent/stream. El borde pasa el guardrail (sanitize + filtro de inyección, OWASP LLM01): la entrada bloqueada hace cortocircuito a error_output y luego a la respuesta JSON/SSE; la entrada segura llega al planner (salida estructurada con reintento/backoff), luego las herramientas de ejecución (calculator, echo, web_search), luego el filtro de fuga output_guardrail (OWASP LLM02) antes de la respuesta JSON/SSE. El Registro de Prompts (prompts/<name>/vN.yaml + registry.json) suministra la plantilla promovida y enlaza al log de auditoría encadenado con hash; el planner guarda checkpoints por sesión en SQLite y emite trazas opt-in; el borde emite logs JSON structlog y contadores /metrics de Prometheus.',
    },
  },
  gallery: [
    gal(1, {
      en: 'Interactive OpenAPI documentation served live at /docs by the FastAPI service',
      es: 'Documentación interactiva OpenAPI servida en vivo en /docs por el servicio FastAPI',
    }),
    gal(2, {
      en: 'Liveness and readiness probes answering real HTTP requests on the running service',
      es: 'Sondas de liveness y readiness respondiendo a peticiones HTTP reales en el servicio en marcha',
    }),
    gal(3, {
      en: 'Unified diff between promoted planner v1 and a candidate v2 prompt artifact',
      es: 'Diff unificado entre el artefacto de prompt planner v1 promovido y un candidato v2',
    }),
    gal(4, {
      en: 'HTTP 429 body returned after exceeding the per-client rate-limit budget',
      es: 'Cuerpo HTTP 429 devuelto tras superar el presupuesto de límite de tasa por cliente',
    }),
    gal(5, {
      en: 'Audit verification returning a valid SHA-256 hash chain over the prompt registry',
      es: 'Verificación de auditoría devolviendo una cadena hash SHA-256 válida sobre el registro de prompts',
    }),
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
    es: {
      title: 'Guardrailed Agentic AI API',
      tagline:
        'Una API de agente endurecida: ataques filtrados antes del modelo, fugas después, prompts versionados tras una puerta de evaluación.',
      cardBlurb:
        'Guardrails OWASP LLM01/LLM02, releases de prompt con puerta, streaming, memoria y observabilidad por request-ID.',
      hook: { line: 'Un prompt pegado a un endpoint.', accent: 'Un jailbreak y se rompe.', tone: 'danger' },
      problem:
        'La mayoría de las funciones de IA son un prompt pegado a un endpoint: un jailbreak, un límite de tasa, una pregunta de seguimiento o una edición descuidada del prompt y se rompen.',
      solution:
        'Cada petición se filtra antes del modelo y cada respuesta antes de salir; las peticiones bloqueadas cuestan cero tokens; los prompts solo salen por una puerta de evaluación auditada; cada respuesta es rastreable por request ID.',
      howItWorks: [
        {
          title: 'Borde',
          text: 'Cada llamada recibe un request ID, un check opcional de API key y un límite de tasa por cliente (429, no una factura sorpresa).',
        },
        {
          title: 'Guardrail de entrada',
          text: 'La inyección y la extracción del prompt de sistema se bloquean antes de llamar al modelo.',
        },
        {
          title: 'Planear y actuar',
          text: 'El modelo planea en un esquema estricto con reintento/backoff; el código ejecuta las herramientas; la memoria persiste por sesión.',
        },
        {
          title: 'Guardrail de salida',
          text: 'Las respuestas se filtran por fuga de prompt antes de salir; el contenido streameado solo se libera tras este check.',
        },
        {
          title: 'Observar',
          text: 'Trazas, logs JSON y métricas Prometheus comparten un request ID y nombran la versión de prompt que respondió.',
        },
      ],
      features: [
        {
          title: 'Promesa uno:',
          titleAccent: 'los ataques fuera.',
          tone: 'accent',
          text: 'Cada petición se filtra por inyección de prompt antes de llamar al modelo (OWASP LLM01). Una petición bloqueada devuelve un error genérico y cuesta cero tokens.',
          image: img(1, 'Una respuesta bloqueada real con zoom en "blocked": true con un plan vacío y tool_calls'),
        },
        {
          title: 'Promesa dos:',
          titleAccent: 'los secretos dentro.',
          tone: 'accent',
          text: 'Las respuestas se re-filtran por fuga del prompt de sistema e inyección reflejada antes de salir (OWASP LLM02). Una respuesta marcada se reemplaza con un mensaje seguro.',
          image: img(2, 'Un stream SSE donde el contenido solo se libera tras pasar el guardrail de salida'),
        },
        {
          title: 'Promesa tres:',
          titleAccent: 'cada cambio probado.',
          tone: 'accent',
          text: 'Los prompts son artefactos versionados promovidos solo si pasan una puerta de evaluación A/B; la métrica de seguridad nunca puede anularse. Cada cambio se sella en un log de auditoría encadenado con hash y el rollback toma una llamada.',
          image: img(3, 'Una puerta de evaluación A/B bloqueando un candidato de prompt que regresa'),
        },
        {
          title: '¿Un tropiezo?',
          titleAccent: 'Reintenta.',
          tone: 'accent',
          text: 'Las conversaciones persisten por sesión, así que seguimientos como "ahora duplica eso" se resuelven contra el historial completo. Los errores transitorios del modelo se reintentan con backoff en vez de volverse 500s.',
          image: img(4, 'Un seguimiento de sesión resuelto contra el historial completo de la conversación'),
        },
        {
          title: 'Un request ID.',
          titleAccent: 'Cada respuesta rastreable.',
          tone: 'accent',
          text: 'Un request ID une trazas, logs JSON y contadores Prometheus. Cada respuesta nombra la versión de prompt y el hash que la produjo.',
          image: img(5, 'Métricas Prometheus y una línea de log JSON unidas por el mismo request ID'),
        },
        {
          title: 'Forma de producción',
          titleAccent: 'por defecto.',
          tone: 'accent',
          text: 'Límite de tasa por cliente, auth opcional por API key y una imagen Docker no-root con health check. CI corre la suite completa con cero secretos.',
          image: img(6, 'Una respuesta real 429 de límite de tasa, salida de la sonda de readiness y el healthcheck del Dockerfile no-root'),
        },
      ],
      results: [
        {
          label: 'Tests automatizados',
          value: '179',
          note: 'Totalmente offline, planner determinista (1 test solo-en-vivo omitido)',
          kind: 'measured',
        },
        {
          label: 'Cobertura',
          value: '98%',
          note: 'Cobertura de líneas, medida en CI',
          kind: 'measured',
        },
        {
          label: 'Tasa de bloqueo de inyección',
          value: '100%',
          note: 'Dataset de la puerta · 22 casos sintéticos · planner v1 · 2026-10-09',
          kind: 'measured',
        },
        {
          label: 'Tasa de fuga de prompt',
          value: '0%',
          note: 'Mismo dataset de la puerta',
          kind: 'measured',
        },
        {
          label: 'CI',
          value: 'Green, zero secrets',
          note: 'ruff + mypy + pytest + build de Docker',
          kind: 'measured',
        },
      ],
      limitations: [
        'La memoria SQLite sirve para demos y cargas ligeras; la alta concurrencia debería moverse a un checkpointer Postgres.',
        'Auth por API key de secreto compartido, no identidad OAuth2/JWT; sin aislamiento multi-inquilino.',
        'El dataset de evaluación de 22 casos protege contra regresiones en casos conocidos; no prueba la calidad del prompt.',
      ],
      galleryHeadline: { title: 'Un servicio real en marcha.', accent: 'No una diapositiva.' },
      cta: {
        headline: 'Tu producto. Tus herramientas. Tus reglas.',
        text: 'Guardrails, streaming, memoria y una puerta de prompts — las partes aburridas ya están hechas; las herramientas mostradas son ejemplos, adaptadas a tus sistemas bajo petición.',
      },
    },
  },
};
