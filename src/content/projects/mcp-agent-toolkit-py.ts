import type { Project } from '../types';

const dir = '/projects/mcp-agent-toolkit-py';
const img = (n: number, alt: string) => ({
  src: `${dir}/feature-${n}-1600.webp`,
  alt,
  width: 1600,
  height: 900,
});
const ui = (name: string, alt: string) => ({
  src: `${dir}/ui-${name}.webp`,
  alt,
  width: 1600,
  height: 900,
});

export const project: Project = {
  slug: 'mcp-agent-toolkit-py',
  access: 'open-source',
  order: 2,
  category: 'python',
  status: 'live',
  year: 2026,
  repoUrl: 'https://github.com/kanderson-ai-dev/mcp-agent-toolkit',
  tests: 517,
  coverage: 93,
  stack: ['Python', 'MCP SDK', 'FastAPI', 'OpenAI', 'SQLite', 'React', 'Docker'],
  languages: ['en', 'es'],
  cardImage: {
    src: `${dir}/card-800.webp`,
    alt: {
      en: 'MCP Agent Toolkit preview',
      es: 'Vista previa de MCP Agent Toolkit',
    },
    width: 800,
    height: 500,
  },
  heroImage: {
    src: `${dir}/hero-1600.webp`,
    alt: {
      en: 'MCP Agent Toolkit console showing a multi-tool agent run',
      es: 'Consola de MCP Agent Toolkit mostrando una corrida de agente multi-herramienta',
    },
    width: 1600,
    height: 1000,
  },
  ogImage: `${dir}/og.png`,
  video: {
    youtubeId: '3UZH518sOVg',
    poster: {
      src: `${dir}/video-poster-1920.webp`,
      alt: {
        en: 'Watch the MCP Agent Toolkit film',
        es: 'Ver la película de MCP Agent Toolkit',
      },
      width: 1920,
      height: 1080,
    },
    captionsLang: ['en', 'es'],
  },
  architecture: {
    src: `${dir}/architecture.webp`,
    alt: {
      en: 'Architecture of the MCP Agent Toolkit: React console and CLI feeding a bounded agent loop, MCP client over stdio JSON-RPC, guarded tool handlers, prompt registry and sandboxed file access',
      es: 'Arquitectura del MCP Agent Toolkit: consola React y CLI alimentando un bucle de agente acotado, cliente MCP sobre stdio JSON-RPC, manejadores de herramientas protegidos, registro de prompts y acceso a archivos en sandbox',
    },
    description: {
      en: 'The User reaches either the React console (Vite · TypeScript · Tailwind) or the mcp-toolkit-agent CLI. The console talks to the FastAPI web adapter — one MCP child per process — over POST /api/chat and GET /api/chat/stream (SSE). Both the adapter and the CLI feed the bounded agent loop (answer · iteration_limit · budget_limit) inside the Agent client, which talks bidirectionally to the LLM adapter (OpenAI or StubLLM) and onward to the MCP client with tools/list discovery. The Prompt Registry (vN.yaml + audit chain) supplies the promoted prompt resolved per run. The MCP client reaches the MCP server child process over stdio · JSON-RPC: MCPServer → guarded_invoke → rate limit per tool + session → tool handler → sanitizer with a typed result envelope. Handlers fan out to web_search (Tavily · DuckDuckGo · stub), db_query against a read-only demo.db, and read_file/write_file through a path sandbox into the sandbox folder.',
      es: 'El Usuario llega a la consola React (Vite · TypeScript · Tailwind) o a la CLI mcp-toolkit-agent. La consola habla con el adaptador web FastAPI — un hijo MCP por proceso — sobre POST /api/chat y GET /api/chat/stream (SSE). Tanto el adaptador como la CLI alimentan el bucle de agente acotado (answer · iteration_limit · budget_limit) dentro del cliente Agent, que habla bidireccional con el adaptador LLM (OpenAI o StubLLM) y hacia el cliente MCP con descubrimiento tools/list. El Registro de Prompts (vN.yaml + cadena de auditoría) suministra el prompt promovido resuelto por corrida. El cliente MCP llega al proceso hijo del servidor MCP sobre stdio · JSON-RPC: MCPServer → guarded_invoke → límite de tasa por herramienta + sesión → manejador de herramienta → sanitizador con un sobre de resultado tipado. Los manejadores abren en abanico a web_search (Tavily · DuckDuckGo · stub), db_query contra un demo.db de solo lectura, y read_file/write_file a través de un sandbox de rutas hacia la carpeta sandbox.',
    },
  },
  copy: {
    en: {
      title: 'MCP Agent Toolkit',
      tagline:
        'A production-shaped MCP server with guarded tools, an agent that discovers them at runtime, and prompts promoted only by live A/B evidence.',
      cardBlurb:
        'A real MCP server with four guarded tools, a gated Prompt Registry and a scorecard graded by an independent model.',
      hook: { line: 'One bad instruction —', accent: 'and it turns on you.', tone: 'danger' },
      problem:
        'Tool integrations are bespoke and brittle, tools without guardrails are an attack surface, and prompt changes ship on gut feeling instead of evidence.',
      solution:
        "The open protocol is the boundary: a guarded MCP server exposes four tools, an agent discovers them with tools/list and runs a bounded loop, and every prompt change must beat the current one in a live A/B test before it goes live.",
      howItWorks: [
        { title: 'Connect', text: 'The agent client spawns the MCP server over stdio and opens a session.' },
        {
          title: 'Discover',
          text: 'The tools are discovered at runtime and handed to the model; nothing is hard-coded.',
        },
        {
          title: 'Call and guard',
          text: 'Each call passes a rate limit, a path sandbox or SQL guard and an output sanitizer; failures come back as typed errors.',
        },
        {
          title: 'Answer within bounds',
          text: 'The loop ends with an answer, an iteration limit or a hard budget cap, streaming every step live.',
        },
        {
          title: 'Promote with evidence',
          text: 'A new prompt version goes live only after a live A/B run beats the current one; every change is hash-chained.',
        },
        {
          title: 'Measure',
          text: 'A 24-question dataset, deterministic checks and an independent judge produce a committed scorecard.',
        },
      ],
      features: [
        {
          title: 'Runtime',
          titleAccent: 'tool discovery.',
          tone: 'model',
          text: "The agent never hard-codes a tool schema: the server's tool list becomes the model's function list on every run. Remove a tool from the server and the agent adapts on its next run.",
          image: ui('discovery', 'A real agent run in the console: the discovered tools called in sequence with per-step results'),
        },
        {
          title: 'Guardrails that',
          titleAccent: 'fail loudly.',
          tone: 'accent',
          text: 'Every call passes a rate limit, a path sandbox or SQL guard and an output sanitizer; a violation returns a typed error to the model. Nothing unsafe runs and nothing fails silently.',
          image: ui('guardrail', 'The console blocking a policy-violating tool call and returning a typed error to the agent'),
        },
        {
          title: 'Prompts promoted',
          titleAccent: 'by evidence.',
          tone: 'accent',
          text: 'System prompts are versioned files; a new version goes live only after a live A/B run beats the current one. A failed gate blocks promotion unless a human gives an audited reason.',
          image: ui('ab', 'The Prompt Registry blocking a promotion: A/B gate failed, override requires an audited reason'),
        },
        {
          title: 'Tamper-evident',
          titleAccent: 'audit log.',
          tone: 'accent',
          text: 'Every registry change is appended to a hash-chained log that flags the first altered line. It is tamper-evident, not tamper-proof.',
          image: ui('auditlog', 'The registry audit log: the blocked A/B regression callout and hash-chained entries under the chain verified badge'),
        },
        {
          title: 'Quality you',
          titleAccent: 'can read.',
          tone: 'accent',
          text: 'A 24-question dataset, deterministic checks and a judge running on a different model produce a committed scorecard. It did not pass the first time, and the fix went through the same registry.',
          image: img(5, 'The committed scorecard panel with judge and grounding scores'),
        },
        {
          title: 'See the',
          titleAccent: 'protocol traffic.',
          tone: 'model',
          text: 'A technical view shows the exact calls and typed results the agent exchanged with the server. Engineers can verify the behaviour instead of trusting a summary.',
          image: ui('traffic', 'The technical view of the console: exact MCP calls and typed JSON results exchanged with the server'),
        },
      ],
      results: [
        {
          label: 'Task success',
          value: '4.79 / 5',
          note: 'Live scorecard, dataset v1.2.0 (24 questions), judge on a different model than the agent',
          kind: 'measured',
        },
        {
          label: 'Adversarial resistance',
          value: '13 / 13',
          note: 'Attack cases resisted; gate 100%',
          kind: 'measured',
        },
        {
          label: 'Citation verification',
          value: '100%',
          note: 'Citation-expecting answers verified against tool output',
          kind: 'measured',
        },
        {
          label: 'Cost per question',
          value: '$0.00039',
          note: 'Agent only; the whole 24-question run cost $0.0093',
          kind: 'measured',
        },
        {
          label: 'Automated tests',
          value: '517',
          note: 'Offline backend suite, plus 54 browser e2e and 55 frontend tests; 93% coverage',
          kind: 'measured',
        },
      ],
      limitations: [
        'The web console is local, single-user and unauthenticated; put an identity layer in front before exposing it.',
        'Latency is informational, not gated: p50 1.8 s, p95 13.1 s on the committed live run.',
        'The audit log is tamper-evident, not tamper-proof.',
        'The dataset is 24 questions: a regression gate, not a benchmark.',
      ],
      cta: {
        headline: 'Your systems — plugged in safely.',
        text: 'Your database, your documents, your tools: I connect them to your agents behind the same guardrails.',
      },
    },
    es: {
      title: 'MCP Agent Toolkit',
      tagline:
        'Un servidor MCP real: herramientas protegidas, un agente que las descubre en ejecución y prompts promovidos solo por evidencia A/B.',
      cardBlurb:
        'Servidor MCP real: cuatro herramientas protegidas, registro de prompts con puerta y scorecard por modelo independiente.',
      hook: { line: 'Una mala instrucción —', accent: 'y se vuelve contra ti.', tone: 'danger' },
      problem:
        'Las integraciones de herramientas son a medida y frágiles, las herramientas sin guardrails son una superficie de ataque, y los cambios de prompt salen por intuición en vez de evidencia.',
      solution:
        'El protocolo abierto es la frontera: un servidor MCP protegido expone cuatro herramientas, un agente las descubre con tools/list y ejecuta un bucle acotado, y cada cambio de prompt debe superar al actual en un test A/B en vivo antes de salir.',
      howItWorks: [
        {
          title: 'Conectar',
          text: 'El cliente agente lanza el servidor MCP por stdio y abre una sesión.',
        },
        {
          title: 'Descubrir',
          text: 'Las herramientas se descubren en tiempo de ejecución y se entregan al modelo; nada está cableado.',
        },
        {
          title: 'Llamar y proteger',
          text: 'Cada llamada pasa un límite de tasa, un sandbox de rutas o un guardia SQL y un sanitizador de salida; los fallos vuelven como errores tipados.',
        },
        {
          title: 'Responder dentro de los límites',
          text: 'El bucle termina con una respuesta, un límite de iteraciones o un tope de presupuesto duro, streameando cada paso en vivo.',
        },
        {
          title: 'Promover con evidencia',
          text: 'Una nueva versión de prompt solo sale tras una corrida A/B en vivo que supera a la actual; cada cambio queda encadenado con hash.',
        },
        {
          title: 'Medir',
          text: 'Un dataset de 24 preguntas, checks deterministas y un juez independiente producen un scorecard cometido.',
        },
      ],
      features: [
        {
          title: 'Descubrimiento de',
          titleAccent: 'herramientas en ejecución.',
          tone: 'model',
          text: 'El agente nunca cablea un esquema de herramienta: la lista de herramientas del servidor se convierte en la lista de funciones del modelo en cada corrida. Quita una herramienta del servidor y el agente se adapta en la siguiente.',
          image: ui('discovery', 'Una corrida real del agente en la consola: las herramientas descubiertas llamadas en secuencia con resultados por paso'),
        },
        {
          title: 'Guardrails que',
          titleAccent: 'fallan en voz alta.',
          tone: 'accent',
          text: 'Cada llamada pasa un límite de tasa, un sandbox de rutas o un guardia SQL y un sanitizador de salida; una violación devuelve un error tipado al modelo. Nada inseguro corre y nada falla en silencio.',
          image: ui('guardrail', 'La consola bloqueando una llamada de herramienta que viola la política y devolviendo un error tipado al agente'),
        },
        {
          title: 'Prompts promovidos',
          titleAccent: 'por evidencia.',
          tone: 'accent',
          text: 'Los prompts de sistema son archivos versionados; una nueva versión solo sale tras una corrida A/B en vivo que supera a la actual. Una puerta fallida bloquea la promoción salvo que un humano dé una razón auditada.',
          image: ui('ab', 'El Registro de Prompts bloqueando una promoción: puerta A/B fallida, el override requiere una razón auditada'),
        },
        {
          title: 'Log de auditoría',
          titleAccent: 'que evidencia manipulación.',
          tone: 'accent',
          text: 'Cada cambio del registro se añade a un log encadenado con hash que marca la primera línea alterada. Evidencia manipulación; no la impide.',
          image: ui('auditlog', 'El log de auditoría del registro: el aviso de regresión A/B bloqueada y entradas encadenadas con hash bajo el sello de cadena verificada'),
        },
        {
          title: 'Calidad que',
          titleAccent: 'puedes leer.',
          tone: 'accent',
          text: 'Un dataset de 24 preguntas, checks deterministas y un juez corriendo en un modelo distinto producen un scorecard cometido. No pasó la primera vez, y el arreglo pasó por el mismo registro.',
          image: img(5, 'El panel del scorecard cometido con las puntuaciones del juez y de grounding'),
        },
        {
          title: 'Mira el',
          titleAccent: 'tráfico del protocolo.',
          tone: 'model',
          text: 'Una vista técnica muestra las llamadas exactas y los resultados tipados que el agente intercambió con el servidor. Los ingenieros pueden verificar el comportamiento en vez de fiarse de un resumen.',
          image: ui('traffic', 'La vista técnica de la consola: llamadas MCP exactas y resultados JSON tipados intercambiados con el servidor'),
        },
      ],
      results: [
        {
          label: 'Éxito de tarea',
          value: '4.79 / 5',
          note: 'Scorecard en vivo, dataset v1.2.0 (24 preguntas), juez en un modelo distinto al del agente',
          kind: 'measured',
        },
        {
          label: 'Resistencia adversarial',
          value: '13 / 13',
          note: 'Casos de ataque resistidos; puerta 100%',
          kind: 'measured',
        },
        {
          label: 'Verificación de citas',
          value: '100%',
          note: 'Respuestas que esperan cita verificadas contra la salida de la herramienta',
          kind: 'measured',
        },
        {
          label: 'Coste por pregunta',
          value: '$0.00039',
          note: 'Solo el agente; la corrida completa de 24 preguntas costó $0.0093',
          kind: 'measured',
        },
        {
          label: 'Tests automatizados',
          value: '517',
          note: 'Suite backend offline, más 54 e2e de navegador y 55 tests de frontend; 93% cobertura',
          kind: 'measured',
        },
      ],
      limitations: [
        'La consola web es local, monousuario y sin autenticación; pon una capa de identidad delante antes de exponerla.',
        'La latencia es informativa, no cerrada por puerta: p50 1.8 s, p95 13.1 s en la corrida en vivo versionada.',
        'El log de auditoría evidencia manipulación; no la impide.',
        'El dataset son 24 preguntas: una puerta de regresión, no un benchmark.',
      ],
      cta: {
        headline: 'Tus sistemas — conectados seguros.',
        text: 'Tu base de datos, tus documentos, tus herramientas: los conecto a tus agentes detrás de los mismos guardrails.',
      },
    },
  },
};
