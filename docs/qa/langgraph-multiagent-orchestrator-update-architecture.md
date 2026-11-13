# QA — langgraph-multiagent-orchestrator: architecture update (2026-11-12)

The architecture section of `/projects/langgraph-multiagent-orchestrator`
was re-transcribed from the project README at `d3ce48f` (2026-11-12). The
README now ships two diagrams, so the page ships two raster views
(1920×1080 each, mockup template `architecture`):

| View | File | Mockup job | Source block |
|---|---|---|---|
| Runtime flow | `architecture.webp` | `architecture` | `<!-- BEGIN GENERATED: runtime-flow -->` (output of `scripts/gen_architecture.py` on the compiled graph, verified byte-identical to the README block) |
| System view | `architecture-system.webp` | `architecture-system` | hand-written `flowchart LR` right after the generated block |

By owner decision the site keeps `tests: 572`, the `Automated tests` card
and the landing counters — the README moved to **579** with the new
architecture drift tests (orchestrator repo, `main`, README-only commit).
Coverage stays 92 (not re-measured).

## Runtime flow — node table (14 visible nodes)

| Node | Type on site | Notes |
|---|---|---|
| `START` | pill, dim | |
| `input_guardrail` | shield (turquoise) | |
| `rejection_output` | danger | |
| `Supervisor` (+ `LLM router`) | model (violet) | |
| `workers ×N` (+ `parallel mandates`) | model | Send() fan-out alias |
| `researcher` | model | |
| `financial_analyst` | model | own node (was combined) |
| `compliance_analyst` | model | own node (was combined) |
| `writer` | model | |
| `reviewer` | model | |
| `human_review` (+ `interrupt()`) | human (amber) | |
| `report_assembler` | code (turquoise) | |
| `output_guardrail` | shield (turquoise) | **new** — screens the report for prompt leakage |
| `END` | pill, dim | |

## Runtime flow — edge table (24 edges)

| # | Edge | Stroke | Label |
|---|---|---|---|
| 1 | `START → input_guardrail` | solid | — |
| 2 | `input_guardrail → rejection_output` | red dashed (gate) | `blocked` |
| 3 | `input_guardrail → Supervisor` | violet dashed | `safe` |
| 4 | `rejection_output → END` | solid | — |
| 5 | `Supervisor → workers ×N` | violet dashed | `Send() fan-out` |
| 6 | `workers ×N → Supervisor` | solid | — |
| 7–11 | `Supervisor → researcher / financial_analyst / compliance_analyst / writer / reviewer` | violet dashed | `next_worker` each |
| 12–16 | the five workers `→ Supervisor` | solid | — |
| 17 | `Supervisor → human_review` | red dashed (gate) | `budget / rounds exhausted` |
| 18 | `Supervisor → report_assembler` | violet dashed | `approved` |
| 19 | `human_review → Supervisor` | violet dashed | `fund` |
| 20 | `human_review → writer` | violet dashed | `edit` |
| 21 | `human_review → report_assembler` | violet dashed | `approve` |
| 22 | `human_review → rejection_output` | red dashed (gate) | `reject` |
| 23 | `report_assembler → output_guardrail` | solid | — |
| 24 | `output_guardrail → END` | solid | — |

Gone vs. the previous image: the combined specialists node, the
`edit / fund` merge, the `revise (round < max)` label, the
`citations re-verified + audit seal` label, `report_assembler → END`.
No invented edges (`writer → reviewer` does not exist).

## System view — node table (14 nodes, 3 group frames)

| Group | Node | Type |
|---|---|---|
| ENTRY | `Console + REST API` (`/api/v1/*`) | code |
| ENTRY | `Job runner` (`job store · SSE stream`) | code |
| LANGGRAPH ORCHESTRATION (`runtime flow above`) | `supervisor` | model |
| " | `researcher`, `financial_analyst`, `compliance_analyst`, `writer`, `reviewer` | model |
| PROMPT PLATFORM | `prompts/<name>/vN.yaml` (`committed seeds`) | code |
| " | `PromptStore` cyl (`SQLite · Postgres`) | store |
| " | `/api/v1/prompts/*` (`+ console Registry tab`) | human |
| " | `draft → candidate → A/B → promoted → retired` (`run_ab_eval + EDD_THRESHOLDS gate`) shield | code |
| " | `PROMPT REGISTRY` (`render(role) → promoted template`) — prominent | code |
| outside | `prompt_name · version · sha256` (`→ trace metadata (LangSmith · Langfuse)`, `→ audit hash-chain`) | store |

## System view — edge table (18 logical edges)

| # | Edge | Stroke |
|---|---|---|
| 1 | `console → runner` | solid |
| 2 | `runner → supervisor` | solid |
| 3–7 | `supervisor → 5 specialists` | dashed |
| 8 | `seeds → store` | solid |
| 9 | `api → lifecycle` | solid |
| 10 | `lifecycle → store` | solid |
| 11 | `store ↔ registry` | double-headed (`bi`) |
| 12–17 | all six agents `→ registry` | violet dashed, shared `render(role)` trunk, single label |
| 18 | `registry → prov` | solid, label `prompt_name / version / sha256` |

Template additions for this diagram (backward-compatible, other jobs
re-rendered byte-identical): `groups[].sub` (frame sub-caption),
`nodes[].prominent` (stronger glow).

## Step 8 — verification results

- `npm run lint && npm run typecheck && npm test && npm run build &&
  npm run validate:content` — all green: lint clean, `tsc --noEmit` clean,
  11/11 tests, build + prerender of 14 routes, `validate:content` 5
  projects / all assets OK (no orphan for `architecture-system.webp`).
- `npm run preview` — `#architecture` at 375 / 768 / 1280 / 1920 on both
  `/projects/langgraph-multiagent-orchestrator` and `/es/…`: 2 figures,
  both `loading="lazy"` with `width=1920 height=1080` (rendered AR 1.78,
  CLS 0.007), titles `Runtime flow` / `System view`, both `<details>`
  open via keyboard, captions `Source: project README` (ES:
  `Fuente: README del proyecto`), no horizontal overflow.
- Regression — `agentic-api`, `mcp-agent-toolkit-py`, `agentic-rag-system`,
  `ecommerce-support-returns-copilot`: 1 figure, 1 details, no `h3`,
  captions unchanged (`Simplified from the private codebase` on the
  on-demand project). The four other architecture mockups re-rendered
  **byte-identical** (md5-verified) after the `groups[].sub` /
  `nodes[].prominent` template additions.
- Landing counter strip unchanged (EN + ES — data-driven `totals`,
  `486 private · 1662 in public repos`); the `Automated tests` card still
  counts to **572**.
- Lighthouse mobile (13.6.0, default mobile run on the project page):
  **performance 90, accessibility 100, best-practices 96, SEO 100**
  (LCP 3.6 s — hero loop poster; TBT 10 ms). Report:
  `update-architecture/lighthouse-mobile.json`.
- Secrets pass: all 332 rendered strings of both mockup jobs scanned for
  keys/tokens/emails/IPs — 0 hits; labels are README identifiers only.

## Screenshots

`docs/qa/langgraph-multiagent-orchestrator/update-architecture/` —
`architecture-before.webp` (previous single diagram from git),
`architecture-section-1280.png` / `architecture-section-375.png`
(rendered section after the change), `lighthouse-mobile.json`.
