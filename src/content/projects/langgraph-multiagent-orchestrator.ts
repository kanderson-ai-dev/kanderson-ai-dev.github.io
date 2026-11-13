import type { Localized, Project } from '../types';

const dir = '/projects/langgraph-multiagent-orchestrator';
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
const gal = (n: number, alt: Localized) => ({
  src: `${dir}/gallery-${n}-1200.webp`,
  alt,
  width: 1200,
  height: 750,
});

export const project: Project = {
  slug: 'langgraph-multiagent-orchestrator',
  access: 'open-source',
  order: 1,
  category: 'python',
  status: 'live',
  year: 2026,
  repoUrl: 'https://github.com/kanderson-ai-dev/langgraph-multiagent-orchestrator',
  tests: 572,
  coverage: 92,
  stack: ['Python', 'LangGraph', 'FastAPI', 'SQLite', 'Langfuse', 'Docker'],
  languages: ['en', 'es'],
  cardImage: {
    src: `${dir}/card-800.webp`,
    alt: {
      en: 'LangGraph Multi-Agent Orchestrator preview',
      es: 'Vista previa de LangGraph Multi-Agent Orchestrator',
    },
    width: 800,
    height: 500,
  },
  heroImage: {
    src: `${dir}/hero-1600.webp`,
    alt: {
      en: 'LangGraph Multi-Agent Orchestrator console on laptop, tablet and phone',
      es: 'Consola de LangGraph Multi-Agent Orchestrator en portátil, tablet y teléfono',
    },
    width: 1600,
    height: 1000,
  },
  ogImage: `${dir}/og.png`,
  video: {
    youtubeId: '4rsN0tXLVS4',
    poster: {
      src: `${dir}/video-poster-1920.webp`,
      alt: {
        en: 'Watch the LangGraph Multi-Agent Orchestrator film',
        es: 'Ver la película de LangGraph Multi-Agent Orchestrator',
      },
      width: 1920,
      height: 1080,
    },
    captionsLang: ['en', 'es'],
  },
  loop: {
    webm: `${dir}/loop.webm`,
    mp4: `${dir}/loop.mp4`,
    poster: {
      src: `${dir}/loop-poster.webp`,
      alt: '',
      width: 1280,
      height: 582,
    },
  },
  architecture: [
    {
      src: `${dir}/architecture.webp`,
      alt: {
        en: 'Runtime flow of the LangGraph Multi-Agent Orchestrator: input guardrail, supervisor LLM router, Send() fan-out and five specialist workers, human review interrupt, report assembly and output guardrail',
        es: 'Flujo de ejecución del LangGraph Multi-Agent Orchestrator: guardrail de entrada, enrutador LLM supervisor, abanico Send() y cinco trabajadores especialistas, interrupción de revisión humana, ensamblado del informe y guardrail de salida',
      },
      description: {
        en: 'START enters input_guardrail. Blocked input goes to rejection_output and END; safe input reaches the Supervisor, an LLM router. Dashed edges are routing decisions, solid edges are fixed wiring. The Supervisor dispatches each specialist — researcher, financial_analyst, compliance_analyst, writer, reviewer — through next_worker, or fans out parallel mandates via Send(); every worker returns to the Supervisor, which decides whether the reviewer\'s verdict needs another revision round. When budget or rounds are exhausted, control passes to human_review (interrupt()): fund returns to the Supervisor with a topped-up budget, edit sends the reviewer\'s feedback plus the human\'s note straight to the writer, approve goes to report_assembler and reject to rejection_output. Once approved, report_assembler re-verifies every citation and seals the transcript, and output_guardrail screens the finished report for prompt leakage before END.',
        es: 'START entra en input_guardrail. La entrada bloqueada va a rejection_output y END; la entrada segura llega al Supervisor, un enrutador LLM. Las aristas discontinuas son decisiones de enrutado, las sólidas cableado fijo. El Supervisor despacha a cada especialista — researcher, financial_analyst, compliance_analyst, writer, reviewer — por next_worker, o abre mandatos en paralelo vía Send(); cada trabajador vuelve al Supervisor, que decide si el veredicto del revisor necesita otra ronda de revisión. Cuando el presupuesto o las rondas se agotan, el control pasa a human_review (interrupt()): fund devuelve al Supervisor con el presupuesto rellenado, edit envía el feedback del revisor más la nota del humano directo al writer, approve va a report_assembler y reject a rejection_output. Una vez aprobado, report_assembler reverifica cada cita y sella la transcripción, y output_guardrail filtra el informe terminado buscando fuga de prompt antes de END.',
      },
      width: 1920,
      height: 1080,
      title: { en: 'Runtime flow', es: 'Flujo de ejecución' },
    },
    {
      src: `${dir}/architecture-system.webp`,
      alt: {
        en: 'System view of the LangGraph Multi-Agent Orchestrator: console and job runner feeding the agent graph, every agent resolving its prompt from a versioned prompt registry with a metric-gated lifecycle, and prompt provenance flowing to traces and the audit chain',
        es: 'Vista de sistema del LangGraph Multi-Agent Orchestrator: consola y runner de trabajos alimentando el grafo de agentes, cada agente resolviendo su prompt desde un registro de prompts versionado con ciclo de vida cerrado por métricas, y la procedencia del prompt fluyendo a trazas y a la cadena de auditoría',
      },
      description: {
        en: 'Prompts are injected, not routed: the Prompt Registry is a dependency of every agent, not a graph node, which is why the runtime flow shows no edges to it. The console and REST API submit jobs to the job runner, which drives the LangGraph orchestration. The supervisor, researcher, financial_analyst, compliance_analyst, writer and reviewer each call render(role) on the registry to get their promoted template. The registry reads and writes a PromptStore (SQLite or Postgres) seeded from committed YAML files. New versions come in through the prompts API and the console Registry tab and move through draft → candidate → A/B → promoted → retired, gated by run_ab_eval against the EDD thresholds. Every generation carries the prompt name, version and SHA-256 into trace metadata (LangSmith or Langfuse) and the audit hash-chain.',
        es: 'Los prompts se inyectan, no se enrutan: el Registro de Prompts es una dependencia de cada agente, no un nodo del grafo, por eso el flujo de ejecución no muestra aristas hacia él. La consola y la API REST envían trabajos al runner de trabajos, que conduce la orquestación LangGraph. El supervisor, researcher, financial_analyst, compliance_analyst, writer y reviewer llaman cada uno render(role) sobre el registro para obtener su plantilla promovida. El registro lee y escribe un PromptStore (SQLite o Postgres) sembrado desde archivos YAML versionados. Las nuevas versiones entran por la API de prompts y la pestaña Registro de la consola y avanzan por draft → candidate → A/B → promoted → retired, cerradas por run_ab_eval contra los umbrales EDD. Cada generación lleva el nombre del prompt, la versión y el SHA-256 a los metadatos de traza (LangSmith o Langfuse) y a la cadena hash de auditoría.',
      },
      width: 1920,
      height: 1080,
      title: { en: 'System view', es: 'Vista de sistema' },
    },
  ],
  gallery: [
    gal(1, {
      en: 'The product landing: a research brief form — topic, audience, tone and budget cap — beside the specialist loop it runs',
      es: 'La landing del producto: un formulario de brief de investigación — tema, audiencia, tono y tope de presupuesto — junto al bucle de especialistas que ejecuta',
    }),
    gal(2, {
      en: 'The console Prompt Registry tab: versioned prompts per agent role with promoted status, changelog and diff tooling',
      es: 'La pestaña Registro de Prompts de la consola: prompts versionados por rol de agente con estado promovido, changelog y herramientas de diff',
    }),
    gal(3, {
      en: 'A finished orchestration run: the live transcript beside the sealed report with its audit chain and PDF, DOCX and Markdown export',
      es: 'Una corrida de orquestación terminada: la transcripción en vivo junto al informe sellado con su cadena de auditoría y exportación a PDF, DOCX y Markdown',
    }),
  ],
  copy: {
    en: {
      title: 'LangGraph Multi-Agent Orchestrator',
      tagline:
        'A team of AI specialists that writes your reports and proves every word: dynamic routing, a hard budget and a sealed audit trail.',
      cardBlurb:
        'Multi-tenant agent teams with dynamic routing, verified citations, a dollar budget and a tamper-evident audit trail.',
      hook: { line: 'Fast answers.', accent: 'Nobody checks.', tone: 'danger' },
      problem:
        "You could ask an AI for the report. But it makes things up, runs up the bill and can't show its work, and most agent demos hard-wire one pipeline for every kind of report.",
      solution:
        'A supervisor assembles the team that fits each brief and routes work dynamically; every quote is checked against its source; a dollar budget is enforced before every model call; humans make the final call; and every report is sealed in a hash-chained audit trail.',
      howItWorks: [
        {
          title: 'Brief in, attacks out',
          text: 'A company submits a brief and a budget; hostile briefs are stopped at the door before a cent is spent.',
        },
        {
          title: 'Assemble the team',
          text: 'The supervisor picks the specialists that fit the report type.',
        },
        {
          title: 'Route and fan out',
          text: 'Work is routed at runtime and split in parallel when the brief calls for it.',
        },
        {
          title: 'Debate and verify',
          text: 'A bounded Writer–Reviewer debate revises the draft; every citation is checked against its source.',
        },
        {
          title: 'Seal and audit',
          text: 'The finished report is sealed in a SHA-256 hash chain; exhausted debates or budgets wait for a human.',
        },
      ],
      features: [
        {
          title: 'A team lead',
          titleAccent: 'decides who works.',
          tone: 'model',
          text: 'No fixed edges: a supervisor picks the next specialist at runtime and splits the work in parallel when the brief calls for it. Each report type gets the team it needs.',
          image: img(1, 'Supervisor routing a brief to parallel specialist agents in the live trace view'),
        },
        {
          title: 'Promise one:',
          titleAccent: 'nothing made up.',
          tone: 'accent',
          text: 'Every quote in the draft is checked against the source text it cites. A changed figure is caught and sent back for revision before the report ships.',
          image: img(2, 'A misquoted figure flagged by citation verification next to its source passage'),
        },
        {
          title: 'Promise two:',
          titleAccent: 'no runaway bills.',
          tone: 'accent',
          text: 'Every job carries a dollar budget that is checked before each model call. Over budget, it stops and asks a human to fund, approve or reject.',
          image: ui('budget', 'The live console transcript stopping the run at budget exceeded, with the human approval recorded below'),
        },
        {
          title: 'Promise three:',
          titleAccent: 'proof for every word.',
          tone: 'accent',
          text: 'Every finished report is sealed in a SHA-256 hash chain, and its footnotes carry the hash of their evidence. Change one line and verification fails.',
          image: ui('audit', 'The console Audit tab: chain verified, anchor verified, 23 sealed evidence sources in the manifest'),
        },
        {
          title: 'The code enforces.',
          titleAccent: 'You decide.',
          tone: 'human',
          text: 'Exhausted debates escalate through a real LangGraph interrupt on a SQLite checkpointer. A paused job survives a restart and waits for your call.',
          image: img(5, 'A paused job waiting for human review in the console'),
        },
        {
          title: 'Nothing ships',
          titleAccent: 'unless it wins.',
          tone: 'accent',
          text: 'Prompts are versioned and A/B tested on the same dataset; a candidate goes live only if it beats the current version. When writer v2 scored lower, v1 stayed live.',
          image: ui('registry', 'The console Prompt Registry tab: versioned prompts for every agent role with the promoted version marked live'),
        },
      ],
      results: [
        {
          label: 'Held-out briefs',
          value: '22',
          note: '14 quality + 8 must-block briefs never used for tuning; live model and live web, 2026-10-27',
          kind: 'measured',
        },
        {
          label: 'Citation support',
          value: '1.000 / 0.929',
          note: 'Two consecutive complete held-out runs; gate 0.90',
          kind: 'measured',
        },
        {
          label: 'Attacks blocked',
          value: '8/8 at $0.00',
          note: 'Stopped before any paid call, in both runs',
          kind: 'measured',
        },
        {
          label: 'Cost per report',
          value: '~$0.01',
          note: '$0.0092 and $0.011 per job in the two held-out runs',
          kind: 'measured',
        },
        {
          label: 'Automated tests',
          value: '572',
          note: 'Offline suite incl. browser E2E; 92% coverage, mypy --strict',
          kind: 'measured',
        },
      ],
      limitations: [
        'The held-out proof is 2 complete passing runs plus 2 runs truncated by the spend cap; 22 briefs is a gate, not a benchmark.',
        'Held-out numbers were measured on gpt-4o-mini: a lower bound, not a guarantee for other models.',
        'The audit chain is tamper-evident, not tamper-proof.',
      ],
      cta: {
        headline: 'Need agents you can trust with real work?',
        text: "Let's build yours: a team of specialists for your reports, under budget and audited.",
      },
    },
    es: {
      title: 'LangGraph Multi-Agent Orchestrator',
      tagline:
        'Un equipo de especialistas de IA que redacta tus informes y prueba cada palabra: enrutado dinámico, presupuesto duro y auditoría sellada.',
      cardBlurb:
        'Equipos multi-inquilino con enrutado dinámico, citas verificadas, presupuesto en dólares y traza de auditoría sellada.',
      hook: { line: 'Respuestas rápidas.', accent: 'Nadie comprueba.', tone: 'danger' },
      problem:
        'Podrías pedirle el informe a una IA. Pero se inventa cosas, dispara la factura y no puede mostrar su trabajo, y la mayoría de las demos de agentes cablean un solo pipeline para todo tipo de informe.',
      solution:
        'Un supervisor monta el equipo que encaja con cada brief y enruta el trabajo dinámicamente; cada cita se comprueba contra su fuente; un presupuesto en dólares se hace cumplir antes de cada llamada al modelo; los humanos deciden al final; y cada informe se sella en una traza de auditoría encadenada con SHA-256.',
      howItWorks: [
        {
          title: 'Entra el brief, fuera los ataques',
          text: 'Una empresa envía un brief y un presupuesto; los briefs hostiles se frenan en la puerta antes de gastar un céntimo.',
        },
        {
          title: 'Montar el equipo',
          text: 'El supervisor elige los especialistas que encajan con el tipo de informe.',
        },
        {
          title: 'Enrutar y abrir en abanico',
          text: 'El trabajo se enruta en tiempo de ejecución y se divide en paralelo cuando el brief lo pide.',
        },
        {
          title: 'Debatir y verificar',
          text: 'Un debate acotado Escritor–Revisor revisa el borrador; cada cita se comprueba contra su fuente.',
        },
        {
          title: 'Sellar y auditar',
          text: 'El informe final se sella en una cadena hash SHA-256; los debates o presupuestos agotados esperan a un humano.',
        },
      ],
      features: [
        {
          title: 'Un líder de equipo',
          titleAccent: 'decide quién trabaja.',
          tone: 'model',
          text: 'Sin aristas fijas: un supervisor elige el siguiente especialista en tiempo de ejecución y divide el trabajo en paralelo cuando el brief lo pide. Cada tipo de informe recibe el equipo que necesita.',
          image: img(1, 'Supervisor enrutando un brief a agentes especialistas en paralelo en la vista de traza en vivo'),
        },
        {
          title: 'Promesa uno:',
          titleAccent: 'nada inventado.',
          tone: 'accent',
          text: 'Cada cita del borrador se comprueba contra el texto fuente que cita. Una cifra cambiada se detecta y se devuelve a revisión antes de que salga el informe.',
          image: img(2, 'Una cifra mal citada marcada por la verificación de citas junto a su pasaje fuente'),
        },
        {
          title: 'Promesa dos:',
          titleAccent: 'sin facturas desbocadas.',
          tone: 'accent',
          text: 'Cada trabajo lleva un presupuesto en dólares que se comprueba antes de cada llamada al modelo. Si se supera, se detiene y pide a un humano financiar, aprobar o rechazar.',
          image: ui('budget', 'La traza de la consola en vivo deteniendo la corrida al superar el presupuesto, con la aprobación humana grabada debajo'),
        },
        {
          title: 'Promesa tres:',
          titleAccent: 'prueba de cada palabra.',
          tone: 'accent',
          text: 'Cada informe terminado se sella en una cadena hash SHA-256, y sus notas al pie llevan el hash de su evidencia. Cambia una línea y la verificación falla.',
          image: ui('audit', 'La pestaña de Auditoría de la consola: cadena verificada, ancla verificada, 23 fuentes de evidencia selladas en el manifiesto'),
        },
        {
          title: 'El código hace cumplir.',
          titleAccent: 'Tú decides.',
          tone: 'human',
          text: 'Los debates agotados escalan por un interrupt real de LangGraph sobre un checkpointer de SQLite. Un trabajo pausado sobrevive un reinicio y espera tu decisión.',
          image: img(5, 'Un trabajo pausado esperando revisión humana en la consola'),
        },
        {
          title: 'Nada sale',
          titleAccent: 'si no gana.',
          tone: 'accent',
          text: 'Los prompts se versionan y se someten a tests A/B sobre el mismo dataset; un candidato solo sale en vivo si supera a la versión actual. Cuando el escritor v2 puntuó peor, v1 siguió en vivo.',
          image: ui('registry', 'La pestaña Registro de Prompts de la consola: prompts versionados para cada rol de agente con la versión promovida marcada en vivo'),
        },
      ],
      results: [
        {
          label: 'Briefs de validación',
          value: '22',
          note: '14 de calidad + 8 de bloqueo obligatorio, nunca usados para ajustar; modelo y web en vivo, 2026-10-27',
          kind: 'measured',
        },
        {
          label: 'Soporte de citas',
          value: '1.000 / 0.929',
          note: 'Dos corridas completas de validación consecutivas; puerta 0.90',
          kind: 'measured',
        },
        {
          label: 'Ataques bloqueados',
          value: '8/8 at $0.00',
          note: 'Detenidos antes de cualquier llamada de pago, en ambas corridas',
          kind: 'measured',
        },
        {
          label: 'Coste por informe',
          value: '~$0.01',
          note: '$0.0092 y $0.011 por trabajo en las dos corridas de validación',
          kind: 'measured',
        },
        {
          label: 'Tests automatizados',
          value: '572',
          note: 'Suite offline incl. E2E de navegador; 92% cobertura, mypy --strict',
          kind: 'measured',
        },
      ],
      limitations: [
        'La prueba de validación son 2 corridas completas más 2 corridas truncadas por el tope de gasto; 22 briefs son una puerta, no un benchmark.',
        'Las cifras de validación se midieron en gpt-4o-mini: una cota inferior, no una garantía para otros modelos.',
        'La cadena de auditoría evidencia manipulación, no la impide.',
      ],
      cta: {
        headline: '¿Necesitas agentes en los que confiar con trabajo real?',
        text: 'Construyamos el tuyo: un equipo de especialistas para tus informes, bajo presupuesto y auditado.',
      },
    },
  },
};
