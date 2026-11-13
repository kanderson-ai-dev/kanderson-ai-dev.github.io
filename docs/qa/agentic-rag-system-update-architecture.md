# QA — agentic-rag-system: architecture update (2026-11-13)

The architecture section of `/projects/agentic-rag-system` was
re-transcribed from the project README at `8db6287` (2026-11-13). The
README mermaid graph gained the Prompt Registry: two new nodes
(`prompt_registry`, `A/B gate + audit chain`) and five new edges. The
page keeps **one** 1920×1080 raster view (`architecture.webp`, mockup
template `architecture`, `unit: 100`) — the README ships one diagram.

**Edge-count note:** the README graph is written as 13 mermaid
statements, but three of them chain a second edge
(`guardrail -- blocked --> error_output --> END`,
`grade -- retry available --> transform --> retrieve`,
`generate --> output_guardrail --> END`). That is **16 original edges +
5 new = 21 edges**, all present in the raster (the update plan's "18"
counted statements, not edges).

## Node table (13 nodes)

| Node | Type on site | Notes |
|---|---|---|
| `START` | pill, dim | |
| `guardrail` | shield (turquoise) | |
| `error_output` | danger (red) | top-right |
| `budget_gate` | shield (turquoise) | |
| `hybrid retrieve` (`vector · Pinecone/Chroma`, `graph · Neo4j/NetworkX`) | code (turquoise) | |
| `grade_documents` | model (violet) | |
| `transform_query` | model (violet) | **re-typed** — was code; moved to the right of the main column |
| `human_review` | human (amber) | alone on the left column |
| `generate` | model (violet) | |
| `output_guardrail` | shield (turquoise) | |
| `prompt_registry` (`promoted versions`) | cylinder, turquoise, prominent | **new** |
| `A/B gate + audit chain` | shield (turquoise) | **new** |
| `END` | pill, dim | bottom-right, next to `output_guardrail` |

## Edge table (21 edges)

| # | Edge | Stroke | Label |
|---|---|---|---|
| 1 | `START → guardrail` | solid | — |
| 2 | `guardrail → error_output` | red thick (gate) | `blocked` |
| 3 | `error_output → END` | solid, right margin lane | — |
| 4 | `guardrail → budget_gate` | solid | `safe` |
| 5 | `budget_gate → END` | red thick (gate), right margin lane | `exhausted` |
| 6 | `budget_gate → hybrid retrieve` | solid | `ok` |
| 7 | `hybrid retrieve → grade_documents` | solid | — |
| 8 | `grade_documents → generate` | solid | `enough docs` |
| 9 | `grade_documents → transform_query` | solid, over the top | `retry available` |
| 10 | `transform_query → hybrid retrieve` | solid, over the top | — |
| 11 | `grade_documents → human_review` | solid | `retries exhausted` |
| 12 | `human_review → generate` | amber | `approve` |
| 13 | `human_review → hybrid retrieve` | amber, far-left lane | `retry` |
| 14 | `human_review → output_guardrail` | amber, bottom lane | `override` |
| 15 | `generate → output_guardrail` | solid | — |
| 16 | `output_guardrail → END` | solid | — |
| 17 | `prompt_registry → grade_documents` | violet dotted, shared trunk | `grade_documents` |
| 18 | `prompt_registry → generate` | violet dotted, shared trunk | `generate_answer` |
| 19 | `prompt_registry → transform_query` | violet dotted | `transform_query` |
| 20 | `prompt_registry → output_guardrail` | violet dotted, shared trunk | `protected texts` |
| 21 | `A/B gate → prompt_registry` | solid, over the top | `promote / rollback` |

## What moved / defects fixed vs. the previous image

- `transform_query` re-typed `code → model` (it is an LLM rewrite, like
  `grade_documents` and `generate`) and moved to the right of the main
  column; the crowded left side is gone.
- `human_review` alone on the left; its three exits (`approve`, `retry`,
  `override`) are amber (site convention, legend documents it) and no
  label overlaps another.
- `exhausted` (budget_gate → END) and `error_output → END` route down
  the right margin (x ≈ 18.5 / 18.9): they cross no node and do not
  touch the lifecycle nodes. `exhausted` no longer cuts across
  `hybrid retrieve`.
- `transform_query → hybrid retrieve` loops over the top (transform top
  → retrieve top): the only possible edge crossing is avoided, the
  topology is unchanged.
- The three dotted registry edges share a vertical trunk at x ≈ 10.9
  feeding the right side of grade/generate/output_guardrail; the
  `transform_query` feed exits the registry top so its label does not
  stack on the trunk labels. `A/B gate → registry` also routes over the
  top for label room.
- Kicker moved to the top-left margin; it no longer touches `START`.
- Legend row added at the bottom (`dotted = prompt from the registry`,
  `turquoise = code / gate`, `violet = model`, `amber = human`,
  `red = hard gate`).
- Canvas 1600×900 `unit: 90` → **1920×1080 `unit: 100`**, matching the
  orchestrator and copilot diagrams; `edgeLabelSize` ≥ 15 everywhere
  (was 13 on `retry available`).

## Step 5 — verification results

- `npm run lint && npm run typecheck && npm test && npm run build &&
  npm run validate:content` — all green: lint clean, `tsc --noEmit`
  clean, 11/11 tests, build + prerender of 14 routes, `validate:content`
  5 projects / all assets OK.
- `npm run preview` — `#architecture` at 375 / 768 / 1280 / 1920 on both
  `/projects/agentic-rag-system` and `/es/…`: 1 figure, `loading="lazy"`,
  `width=1920 height=1080` honored (rendered AR 1.78, CLS 0.000), no
  `h3`, caption `Source: project README` (ES: `Fuente: README del
  proyecto`), `<details>` opens via keyboard (`Enter`), no horizontal
  overflow, no console errors (only the Cloudflare beacon CORS-blocked
  on localhost, expected).
- Regression — `langgraph-multiagent-orchestrator`: 2 figures with
  titles `Runtime flow` / `System view` and 2 `<details>`, unchanged;
  `ecommerce-support-returns-copilot`: 1 figure, caption `Simplified
  from the private codebase`, unchanged.
- Landing counter strip unchanged (EN `486 private`, ES `486 privados`).
- Lighthouse mobile (13.6.0, default mobile run on the project page):
  **performance 100, accessibility 100, best-practices 96, SEO 100**
  (LCP 1.9 s, TBT 10 ms, CLS 0.002). Report:
  `update-architecture/lighthouse-mobile.json`.
- Secrets pass: all 149 strings of the `architecture` job scanned for
  keys/tokens/emails/IPs — 0 hits; labels are README identifiers only.
- Render: `architecture.webp` 1920×1080, 91 KB (≤ 250 KB). No template
  change was needed — the existing `via`/`fromSide`/`toSide`/`cyl`/
  `dotted`/`color`/`legend` params covered everything.

## Screenshots

`docs/qa/agentic-rag-system/update-architecture/` —
`architecture-before.webp` (previous diagram from git),
`architecture-section-1280.png` / `architecture-section-375.png`
(rendered section after the change), `lighthouse-mobile.json`.
