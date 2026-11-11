import type { Project } from '../types';

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
  languages: ['en'],
  cardImage: {
    src: `${dir}/card-800.webp`,
    alt: 'LangGraph Multi-Agent Orchestrator preview',
    width: 800,
    height: 500,
  },
  heroImage: {
    src: `${dir}/hero-1600.webp`,
    alt: 'LangGraph Multi-Agent Orchestrator console on laptop, tablet and phone',
    width: 1600,
    height: 1000,
  },
  ogImage: `${dir}/og.png`,
  video: {
    youtubeId: '4rsN0tXLVS4',
    poster: {
      src: `${dir}/video-poster-1920.webp`,
      alt: 'Watch the LangGraph Multi-Agent Orchestrator film',
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
  architecture: {
    src: `${dir}/architecture.webp`,
    alt: 'Architecture of the LangGraph Multi-Agent Orchestrator: input guardrail, supervisor LLM router, Send() fan-out to specialist workers, human review interrupt and sealed report assembly',
    description:
      'START enters the input_guardrail. Blocked input goes to rejection_output and END; safe input reaches the Supervisor, an LLM router. The Supervisor fans out parallel mandates to workers via Send() and receives their results, then dispatches each specialist — researcher, financial_analyst/compliance_analyst, writer, reviewer — through next_worker edges. Every worker returns to the Supervisor, and the reviewer may bounce back for a revise round. When budget or rounds are exhausted, control passes to human_review (interrupt): edit/fund returns to the Supervisor, approve goes to report_assembler, reject goes to rejection_output. On approval, report_assembler ends the run with citations re-verified and an audit seal.',
  },
  gallery: [
    {
      src: `${dir}/gallery-1-1200.webp`,
      alt: 'The product landing: a research brief form — topic, audience, tone and budget cap — beside the specialist loop it runs',
      width: 1200,
      height: 750,
    },
    {
      src: `${dir}/gallery-2-1200.webp`,
      alt: 'The console Prompt Registry tab: versioned prompts per agent role with promoted status, changelog and diff tooling',
      width: 1200,
      height: 750,
    },
    {
      src: `${dir}/gallery-3-1200.webp`,
      alt: 'A finished orchestration run: the live transcript beside the sealed report with its audit chain and PDF, DOCX and Markdown export',
      width: 1200,
      height: 750,
    },
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
    es: undefined,
  },
};
