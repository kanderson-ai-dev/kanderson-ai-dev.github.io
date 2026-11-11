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
  languages: ['en'],
  cardImage: {
    src: `${dir}/card-800.webp`,
    alt: 'MCP Agent Toolkit preview',
    width: 800,
    height: 500,
  },
  heroImage: {
    src: `${dir}/hero-1600.webp`,
    alt: 'MCP Agent Toolkit console showing a multi-tool agent run',
    width: 1600,
    height: 1000,
  },
  ogImage: `${dir}/og.png`,
  video: {
    youtubeId: '3UZH518sOVg',
    poster: {
      src: `${dir}/video-poster-1920.webp`,
      alt: 'Watch the MCP Agent Toolkit film',
      width: 1920,
      height: 1080,
    },
    captionsLang: ['en', 'es'],
  },
  architecture: {
    src: `${dir}/architecture.webp`,
    alt: 'Architecture of the MCP Agent Toolkit: React console and CLI feeding a bounded agent loop, MCP client over stdio JSON-RPC, guarded tool handlers, prompt registry and sandboxed file access',
    description:
      'The User reaches either the React console (Vite · TypeScript · Tailwind) or the mcp-toolkit-agent CLI. The console talks to the FastAPI web adapter — one MCP child per process — over POST /api/chat and GET /api/chat/stream (SSE). Both the adapter and the CLI feed the bounded agent loop (answer · iteration_limit · budget_limit) inside the Agent client, which talks bidirectionally to the LLM adapter (OpenAI or StubLLM) and onward to the MCP client with tools/list discovery. The Prompt Registry (vN.yaml + audit chain) supplies the promoted prompt resolved per run. The MCP client reaches the MCP server child process over stdio · JSON-RPC: MCPServer → guarded_invoke → rate limit per tool + session → tool handler → sanitizer with a typed result envelope. Handlers fan out to web_search (Tavily · DuckDuckGo · stub), db_query against a read-only demo.db, and read_file/write_file through a path sandbox into the sandbox folder.',
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
    es: undefined,
  },
};
