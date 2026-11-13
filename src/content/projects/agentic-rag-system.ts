import type { Project } from '../types';

const dir = '/projects/agentic-rag-system';
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
  slug: 'agentic-rag-system',
  access: 'open-source',
  order: 3,
  category: 'python',
  status: 'live',
  year: 2026,
  repoUrl: 'https://github.com/kanderson-ai-dev/agentic-rag-system',
  tests: 394,
  coverage: 95,
  stack: ['Python', 'LangGraph', 'FastAPI', 'Pinecone', 'Chroma', 'Neo4j', 'Langfuse', 'Docker'],
  languages: ['en', 'es'],
  cardImage: {
    src: `${dir}/card-800.webp`,
    alt: {
      en: 'Agentic RAG & Knowledge System preview',
      es: 'Vista previa de Agentic RAG & Knowledge System',
    },
    width: 800,
    height: 500,
  },
  heroImage: {
    src: `${dir}/hero-1600.webp`,
    alt: {
      en: 'Agentic RAG & Knowledge System console answering with sources',
      es: 'Consola de Agentic RAG & Knowledge System respondiendo con fuentes',
    },
    width: 1600,
    height: 1000,
  },
  ogImage: `${dir}/og.png`,
  video: {
    youtubeId: 'EWf5Oz8u7Xg',
    poster: {
      src: `${dir}/video-poster-1920.webp`,
      alt: {
        en: 'Watch the Agentic RAG & Knowledge System film',
        es: 'Ver la película de Agentic RAG & Knowledge System',
      },
      width: 1920,
      height: 1080,
    },
    captionsLang: ['en', 'es'],
  },
  architecture: {
    src: `${dir}/architecture.webp`,
    alt: {
      en: 'Architecture of the Agentic RAG system: input guardrail, budget gate, hybrid vector and graph retrieval, document grading loop, human review and output guardrail, with a versioned prompt registry feeding every model step',
      es: 'Arquitectura del sistema Agentic RAG: guardrail de entrada, puerta de presupuesto, recuperación híbrida vector y grafo, bucle de evaluación de documentos, revisión humana y guardrail de salida, con un registro de prompts versionado alimentando cada paso de modelo',
    },
    description: {
      en: 'START enters the guardrail: blocked input goes to error_output and END; safe input continues to the budget_gate — an exhausted budget ends the run, ok reaches hybrid retrieve (vector · Pinecone/Chroma plus graph · Neo4j/NetworkX) then grade_documents. With enough docs the flow goes to generate; with retry available it rewrites via transform_query and retrieves again; retries exhausted escalates to human_review — approve generates, retry retrieves again, override goes straight to output_guardrail. Generated answers always pass the output_guardrail before END. Dotted edges are prompts injected from the prompt_registry, which holds the promoted version of each prompt: grade_documents, transform_query and generate resolve theirs at call time, and the output_guardrail reads the same protected texts to catch prompt leakage. New versions reach the registry only through the A/B gate and its hash-chained audit chain, which promote or roll back a version without a restart.',
      es: 'START entra en el guardrail: la entrada bloqueada va a error_output y END; la entrada segura continúa al budget_gate — un presupuesto agotado termina la corrida, ok llega a retrieve híbrido (vector · Pinecone/Chroma más grafo · Neo4j/NetworkX) y luego grade_documents. Con suficientes docs el flujo va a generate; con reintento disponible reescribe vía transform_query y recupera de nuevo; reintentos agotados escala a human_review — approve genera, retry recupera de nuevo, override va directo a output_guardrail. Las respuestas generadas siempre pasan el output_guardrail antes de END. Las aristas punteadas son prompts inyectados desde el prompt_registry, que guarda la versión promovida de cada prompt: grade_documents, transform_query y generate resuelven el suyo en tiempo de llamada, y el output_guardrail lee los mismos textos protegidos para detectar fuga de prompt. Las nuevas versiones llegan al registro solo a través de la puerta A/B y su cadena de auditoría encadenada con hash, que promueven o revierten una versión sin reinicio.',
    },
    width: 1920,
    height: 1080,
  },
  copy: {
    en: {
      title: 'Agentic RAG & Knowledge System',
      tagline:
        'A knowledge assistant that proves its answers: hybrid vector + graph retrieval, self-grading, and a human instead of a guess.',
      cardBlurb:
        'Hybrid vector and graph retrieval with a self-grading loop that escalates instead of guessing.',
      hook: { line: 'Confident answers.', accent: 'Zero proof.', tone: 'danger' },
      problem:
        "Your company runs on documents nobody has time to read. Ask a plain AI and it sounds sure of itself, but it makes things up and can't show where the answer came from.",
      solution:
        'The system retrieves from a vector store and a knowledge graph, grades its own evidence, rewrites the question when evidence is weak, and hands off to a person when retries run out. Every answer shows its sources, and quality is a number gated in CI.',
      howItWorks: [
        { title: 'Ask', text: 'A question arrives and passes the input guardrail.' },
        { title: 'Retrieve', text: 'Vector search and graph relationships are fused.' },
        { title: 'Grade', text: 'The agent grades the retrieved context.' },
        {
          title: 'Rewrite or escalate',
          text: 'Weak evidence triggers a query rewrite; exhausted retries escalate to a human.',
        },
        {
          title: 'Answer with sources',
          text: 'The answer is generated from the graded context, with its sources attached.',
        },
      ],
      features: [
        {
          title: 'Every answer',
          titleAccent: 'shows its sources.',
          tone: 'accent',
          text: 'Vector search and a knowledge graph are fused, and every answer cites the passages it used. On multi-hop questions hybrid retrieval recalls 0.92 of the needed context vs 0.83 for vector-only.',
          image: ui('answer', 'The product landing answering "What is LangGraph?" with the source chip langgraph-overview cited under the answer'),
        },
        {
          title: 'It checks',
          titleAccent: 'its own evidence.',
          tone: 'accent',
          text: 'Before it answers, the agent grades what it retrieved. Too weak? It rephrases the question and tries again.',
          image: img(2, 'A run showing the evidence grade and the rewritten query'),
        },
        {
          title: 'Still nothing?',
          titleAccent: "It won't guess.",
          tone: 'human',
          text: 'When retries run out, the run stops and a person decides in the review queue. Off-topic questions are refused instead of answered.',
          image: ui('hitl', 'The console escalating an exhausted run to a human review modal: approve, retry or override'),
        },
        {
          title: 'Quality',
          titleAccent: 'you can measure.',
          tone: 'accent',
          text: 'A RAGAS-style scorecard with its provenance is versioned in git and gated in CI. A regression in faithfulness fails the build.',
          image: ui('quality', 'The console dashboard: EDD quality gauges for faithfulness, relevancy, precision and recall with their gates'),
        },
        {
          title: 'Prompts ship',
          titleAccent: 'only when they win.',
          tone: 'accent',
          text: 'Prompts are versioned with a hash-chained audit log and promoted only after a measured A/B run. The answer prompt went v1 to v2 that way: judge 4.76 to 4.86.',
          image: ui('ab', 'The prompt registry A/B table: v2 vs v3 metrics with the gate verdict to promote'),
        },
        {
          title: 'A fraction',
          titleAccent: 'of a cent per query.',
          tone: 'accent',
          text: 'Token usage is tracked per query against a one-cent budget, live in the dashboard. The committed run measured $0.0004 per query.',
          image: ui('cost', 'The dashboard comparing human vs agent cost per query and cost by prompt version'),
        },
      ],
      results: [
        {
          label: 'Faithfulness',
          value: '1.00',
          note: 'Live scorecard, 18 typed cases, Pinecone + Neo4j; gate 0.85',
          kind: 'measured',
        },
        {
          label: 'Answer relevancy',
          value: '1.00',
          note: 'Same run; gate 0.85',
          kind: 'measured',
        },
        {
          label: 'Context recall',
          value: '0.96',
          note: 'Same run; context precision 0.98; gate 0.75',
          kind: 'measured',
        },
        {
          label: 'Cost per query',
          value: '$0.0004',
          note: 'Same run; budget $0.01',
          kind: 'measured',
        },
        {
          label: 'Automated tests',
          value: '394',
          note: 'Plus 27 browser e2e; 95% coverage on app/',
          kind: 'measured',
        },
      ],
      baseline: {
        label: 'Faithfulness — hybrid retrieval vs no retrieval, same 18 cases',
        pipeline: '1.00',
        baseline: '0.07',
        note: 'The retrieval layer, not the prompt, is what grounds the answers',
      },
      limitations: [
        'Latency misses its targets on the cloud-backed path: p50 3.6 s / p95 7.2 s vs 3 s / 6 s.',
        'Neo4j Aura free tier sleeps after inactivity: the system degrades to vector-only and the first query after idle can be slow.',
        'The Prompt Registry is a single-writer, file-based store.',
        '18 evaluation cases are a regression gate, not a benchmark.',
      ],
      cta: {
        headline: 'Point it at your documents.',
        text: 'Policies, contracts, manuals: I adapt it to your knowledge base on request.',
      },
    },
    es: {
      title: 'Agentic RAG & Knowledge System',
      tagline:
        'Un asistente de conocimiento que prueba sus respuestas: recuperación vector + grafo, auto-evaluación y un humano en vez de adivinar.',
      cardBlurb:
        'Recuperación híbrida vector y grafo con un bucle de auto-evaluación que escala en vez de adivinar.',
      hook: { line: 'Respuestas seguras.', accent: 'Cero pruebas.', tone: 'danger' },
      problem:
        'Tu empresa funciona sobre documentos que nadie tiene tiempo de leer. Pregunta a una IA cualquiera y suena segura de sí misma, pero se inventa cosas y no puede mostrar de dónde salió la respuesta.',
      solution:
        'El sistema recupera de un vector store y un grafo de conocimiento, evalúa su propia evidencia, reescribe la pregunta cuando la evidencia es débil y pasa a una persona cuando se acaban los reintentos. Cada respuesta muestra sus fuentes, y la calidad es un número cerrado por puerta en CI.',
      howItWorks: [
        { title: 'Preguntar', text: 'Llega una pregunta y pasa el guardrail de entrada.' },
        { title: 'Recuperar', text: 'Se fusionan la búsqueda vectorial y las relaciones del grafo.' },
        { title: 'Evaluar', text: 'El agente evalúa el contexto recuperado.' },
        {
          title: 'Reescribir o escalar',
          text: 'La evidencia débil dispara una reescritura de la query; los reintentos agotados escalan a un humano.',
        },
        {
          title: 'Responder con fuentes',
          text: 'La respuesta se genera desde el contexto evaluado, con sus fuentes adjuntas.',
        },
      ],
      features: [
        {
          title: 'Cada respuesta',
          titleAccent: 'muestra sus fuentes.',
          tone: 'accent',
          text: 'Se fusionan la búsqueda vectorial y un grafo de conocimiento, y cada respuesta cita los pasajes que usó. En preguntas multi-hop la recuperación híbrida alcanza 0.92 del contexto necesario frente a 0.83 de solo vectorial.',
          image: ui('answer', 'La landing del producto respondiendo "¿Qué es LangGraph?" con el chip de fuente langgraph-overview citado bajo la respuesta'),
        },
        {
          title: 'Comprueba',
          titleAccent: 'su propia evidencia.',
          tone: 'accent',
          text: 'Antes de responder, el agente evalúa lo que recuperó. ¿Demasiado débil? Reformula la pregunta y lo intenta de nuevo.',
          image: img(2, 'Una corrida mostrando la evaluación de evidencia y la query reescrita'),
        },
        {
          title: '¿Sigue sin haber?',
          titleAccent: 'No adivina.',
          tone: 'human',
          text: 'Cuando se acaban los reintentos, la corrida se detiene y una persona decide en la cola de revisión. Las preguntas fuera de tema se rechazan en vez de responderse.',
          image: ui('hitl', 'La consola escalando una corrida agotada a un modal de revisión humana: aprobar, reintentar o anular'),
        },
        {
          title: 'Calidad',
          titleAccent: 'que puedes medir.',
          tone: 'accent',
          text: 'Un scorecard estilo RAGAS con su procedencia se versiona en git y se cierra por puerta en CI. Una regresión en faithfulness rompe el build.',
          image: ui('quality', 'El dashboard de la consola: medidores de calidad EDD para faithfulness, relevancia, precisión y recall con sus puertas'),
        },
        {
          title: 'Los prompts salen',
          titleAccent: 'solo cuando ganan.',
          tone: 'accent',
          text: 'Los prompts se versionan con un log de auditoría encadenado con hash y se promueven solo tras una corrida A/B medida. El prompt de respuesta pasó así de v1 a v2: juez de 4.76 a 4.86.',
          image: ui('ab', 'La tabla A/B del registro de prompts: métricas de v2 vs v3 con el veredicto de la puerta para promover'),
        },
        {
          title: 'Una fracción',
          titleAccent: 'de céntimo por query.',
          tone: 'accent',
          text: 'El uso de tokens se rastrea por query contra un presupuesto de un céntimo, en vivo en el dashboard. La corrida cometida midió $0.0004 por query.',
          image: ui('cost', 'El dashboard comparando el coste por query humano vs agente y el coste por versión de prompt'),
        },
      ],
      results: [
        {
          label: 'Fidelidad',
          value: '1.00',
          note: 'Scorecard en vivo, 18 casos tipados, Pinecone + Neo4j; puerta 0.85',
          kind: 'measured',
        },
        {
          label: 'Relevancia de respuesta',
          value: '1.00',
          note: 'Misma corrida; puerta 0.85',
          kind: 'measured',
        },
        {
          label: 'Recall de contexto',
          value: '0.96',
          note: 'Misma corrida; precisión de contexto 0.98; puerta 0.75',
          kind: 'measured',
        },
        {
          label: 'Coste por query',
          value: '$0.0004',
          note: 'Misma corrida; presupuesto $0.01',
          kind: 'measured',
        },
        {
          label: 'Tests automatizados',
          value: '394',
          note: 'Más 27 e2e de navegador; 95% cobertura en app/',
          kind: 'measured',
        },
      ],
      baseline: {
        label: 'Fidelidad — recuperación híbrida vs sin recuperación, mismos 18 casos',
        pipeline: '1.00',
        baseline: '0.07',
        note: 'La capa de recuperación, no el prompt, es lo que asienta las respuestas',
      },
      limitations: [
        'La latencia no cumple sus objetivos en la ruta con nube: p50 3.6 s / p95 7.2 s vs 3 s / 6 s.',
        'El tier gratis de Neo4j Aura duerme tras inactividad: el sistema degrada a solo vectorial y la primera query tras el reposo puede ser lenta.',
        'El Registro de Prompts es un almacén de un solo escritor basado en archivos.',
        '18 casos de evaluación son una puerta de regresión, no un benchmark.',
      ],
      cta: {
        headline: 'Apúntalo a tus documentos.',
        text: 'Políticas, contratos, manuales: lo adapto a tu base de conocimiento bajo petición.',
      },
    },
  },
};
