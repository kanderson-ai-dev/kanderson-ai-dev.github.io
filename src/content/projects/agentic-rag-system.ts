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
  languages: ['en'],
  cardImage: {
    src: `${dir}/card-800.webp`,
    alt: 'Agentic RAG & Knowledge System preview',
    width: 800,
    height: 500,
  },
  heroImage: {
    src: `${dir}/hero-1600.webp`,
    alt: 'Agentic RAG & Knowledge System console answering with sources',
    width: 1600,
    height: 1000,
  },
  ogImage: `${dir}/og.png`,
  video: {
    youtubeId: 'EWf5Oz8u7Xg',
    poster: {
      src: `${dir}/video-poster-1920.webp`,
      alt: 'Watch the Agentic RAG & Knowledge System film',
      width: 1920,
      height: 1080,
    },
    captionsLang: ['en', 'es'],
  },
  architecture: {
    src: `${dir}/architecture.webp`,
    alt: 'Architecture of the Agentic RAG system: input guardrail, budget gate, hybrid vector and graph retrieval, document grading loop, human review and output guardrail',
    description:
      'START enters the guardrail: blocked input goes to error_output and END; safe input continues to the budget_gate — an exhausted budget ends the run, ok reaches hybrid retrieve (vector · Pinecone/Chroma plus graph · Neo4j/NetworkX) then grade_documents. With enough docs the flow goes to generate; with retry available it rewrites via transform_query and retrieves again; retries exhausted escalates to human_review — approve generates, retry retrieves again, override goes straight to output_guardrail. Generated answers always pass the output_guardrail before END.',
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
    es: undefined,
  },
};
