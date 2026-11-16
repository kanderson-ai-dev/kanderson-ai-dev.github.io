# Image-slot recapture inventory

Baseline for the quality fix. Every image slot per project: current source →
target source. "Remotion still" = `burnSubtitles: false, brackets: false`,
rendered via `scripts/render-stills.mjs` at --scale=2, then scaled (never
cropped) to slot size. "Mockup" = `tools/mockups/` template on a real capture.
Backup of the current assets: `_raw/_backup/2026-11-10/projects/`.

## Landing

| Slot | File | Current source | Target source |
|---|---|---|---|
| hero loop | langgraph `loop.webm` / `loop.mp4` | re-cut from a film segment with baked text | owner-picked seamless loop (Ph 3 candidates A/B/C) |
| loop poster | `loop-poster.webp` | cropped film frame | clean still from the chosen loop comp |
| showcase cards | each project's `card-800.webp` | see per-project card | same as project card |

## langgraph-multiagent-orchestrator (comp `Orchestrator2Upgrade`)

| Slot | File | Current source | Target source |
|---|---|---|---|
| card 800×500 | `card-800.webp` | thumb-clean.png (drawbox-erased) padded | `ThumbOrchestrator2` "team" re-render, brackets+URL off, padded to 16:10 |
| hero 1600×1000 | `hero-1600.webp` | same | same |
| og 1200×630 | `og.png` | same | same |
| poster 1920×1080 | `video-poster-1920.webp` | thumb-clean.png scaled | `ThumbOrchestrator2` re-render, brackets+URL off |
| hook 1920×1080 | `hook-1920.webp` | film frame, cropped | Remotion still, s02 problem beat ("Fast answers. Nobody checks.") — the coldopen beat is a permanent letterbox strip and cannot fill 16:9; the problem beat is the film's narrative hook |
| feature 1 routing | `feature-1-1400.webp` | film frame, cropped 14:9 | Remotion still, lead beat, 1600×900 |
| feature 2 citation | `feature-2-1400.webp` | film frame, cropped | Remotion still, promise1 (CAUGHT) beat, 1600×900 |
| feature 3 budget | `ui-budget.webp` | real console capture (framed) | same capture re-framed via mockup `feature-browser` 16:9 (Ph 7) |
| feature 4 audit | `ui-audit.webp` | real console capture | mockup `feature-browser` 16:9 (Ph 7) |
| feature 5 HITL | `feature-5-1400.webp` | film frame, cropped | Remotion still, control beat, 1600×900 |
| feature 6 registry | `ui-registry.webp` | real console capture | mockup `feature-browser` 16:9 (Ph 7) |
| gallery 1 scorecard | `gallery-1-1200.webp` | film frame, cropped | real scorecard UI via `feature-browser` (Ph 7) |
| gallery 2 API docs | `gallery-2-1200.webp` | film frame, cropped | real capture via `feature-browser` (Ph 7) |
| gallery 3 report | `gallery-3-1200.webp` | film frame, cropped to column | real `report-audit-badge.png` via `contain` (I-09) |
| architecture | `architecture.svg` | hand-drawn SVG, invented nodes | README Mermaid transcribed (Ph 6) |

## mcp-agent-toolkit-py (comp `PromoMcpToolkit3`)

| Slot | File | Current source | Target source |
|---|---|---|---|
| card 800×500 | `card-800.webp` | film hero frame, cropped | clean title/reveal still, padded to 16:10 |
| hero 1600×1000 | `hero-1600.webp` | same | same |
| og 1200×630 | `og.png` | same | same |
| poster 1920×1080 | `video-poster-1920.webp` | film frame, cropped | `ThumbMcpToolkit3` re-render or clean still |
| hook 1920×1080 | `hook-1920.webp` | film frame, cropped | Remotion still, hook beat |
| features 1–4, 6 | `ui-*.webp` (discovery, guardrail, ab, auditlog, traffic) | real dark console captures (framed) | same captures re-framed via `feature-browser` 16:9 (Ph 7) |
| feature 5 scorecard | `feature-5-1400.webp` | film frame, "13/13" cut at left (I-07) | Remotion still, proof beat, full frame, 1600×900 |
| architecture | `architecture.svg` | wrong nodes (`reports.db`, `/reports/*.md`) | README "System overview" Mermaid (Ph 6) |

## agentic-rag-system (comp `PromoRag`, props `agentic-rag-system-film-4k.json`)

| Slot | File | Current source | Target source |
|---|---|---|---|
| card 800×500 | `card-800.webp` | thumb-clean.png (drawbox-erased) padded | `RagThumbnail` re-render, brackets+URL off, padded to 16:10 |
| hero 1600×1000 | `hero-1600.webp` | same | same |
| og 1200×630 | `og.png` | same | same |
| poster 1920×1080 | `video-poster-1920.webp` | thumb-clean.png scaled | `RagThumbnail` re-render, brackets+URL off |
| hook 1920×1080 | `hook-1920.webp` | film frame, cropped | Remotion still, hook/trick-question beat |
| feature 1 sources | `feature-1-1400.webp` | film frame, cropped | real `landing-answer.png` / `console-chat.png` via `feature-browser` (I-13, Ph 7) |
| feature 2 evidence | `feature-2-1400.webp` | film frame, QUESTION card cut (I-08) | Remotion still, console/grade beat, 1600×900 |
| features 3–6 | `ui-hitl/quality/ab/cost.webp` | real console captures (framed) | same captures re-framed via `feature-browser` 16:9 (Ph 7) |
| `ui-promptdiff.webp` | file | stale, unreferenced (I-20) | delete (Ph 9/10) |
| architecture | `architecture.svg` | hand-drawn SVG, missing nodes | README Mermaid transcribed (Ph 6) |

## agentic-api (comp `PromoAgenticApi`)

| Slot | File | Current source | Target source |
|---|---|---|---|
| card 800×500 | `card-800.webp` | title frame cropped (zoomed, I-04) | interim: clean title still padded 16:10 → Ph 5 hero-trio |
| hero 1600×1000 | `hero-1600.webp` | same | interim title still → Ph 5 hero-trio (Swagger/terminal/SSE) |
| og 1200×630 | `og.png` | same | from hero |
| poster 1920×1080 | `video-poster-1920.webp` | title frame cropped | `ThumbAgenticApi` re-render or clean title still |
| hook 1920×1080 | `hook-1920.webp` | film frame, cropped | Remotion still, hook beat |
| features 1–6 | `feature-*-1400.webp` | all film frames, wrong beats (I-03, I-05) | real keyless captures via mockup templates (Ph 5) |
| gallery 1–5 | — (none today) | — | real captures (Ph 5) |
| architecture | `architecture.svg` | hand-drawn SVG, missing nodes | README Mermaid transcribed (Ph 6) |

## Phase 5 — agentic-api real captures (2026-11-10)

All API published imagery now traces to real keyless-run responses or README
live-captured samples. Isolated run: temp `prompts/`+`evaluation/` copies,
`PYTHONPATH`=repo, CWD=temp, `CHECKPOINT_DB_PATH`=temp, no keys,
`PROMPT_ADMIN_OPEN=true` for registry writes only. Temp dirs deleted; repo
`git status` clean.

| Asset | Source |
|---|---|
| hero-1600.webp | trio: dark Swagger `/docs` screenshot + blocked-response terminal + SSE stream |
| card-800.webp / og.png | dark Swagger `/docs` |
| feature-1-1600.webp | detail-zoom on real blocked response (`blocked:true`, empty plan/tool_calls) |
| feature-2-1600.webp | README SSE sample verbatim (fictional session id), `output_guardrail` release highlighted |
| feature-3-1600.webp | stack: real `planner/v1.yaml` + real A/B gate 409 (tool_selection 1.0→0.25, `passed:false`) + audit `{"valid":true}` |
| feature-4-1600.webp | README `15 * 4 → 60` + "now double that" → 120, same fictional session_id |
| feature-5-1600.webp | real `/metrics` counters + JSON log line sharing fictional request_id |
| feature-6-1600.webp | real 429 body + real `not_ready` response + real Dockerfile excerpt |
| gallery-1..5 | Swagger `/docs`, `/health`, `planner/diff`, 429, audit verify |
| hook-1920.webp, video-poster-1920.webp | film art by design (decorative band / film thumb) |

Scan: no paths, keys, real UUIDs, or foreign hostnames in rendered assets.
`OPENAI_API_KEY` / `RATE_LIMIT_PER_MINUTE` appear verbatim because they are
part of the real API's public contract (committed `.env.example`, readiness
response body) — names only, no values.

## supply-chain-compliance-copilot-py (comp `PromoCompliance2`, props `supply-chain-compliance-copilot-py-v2.json`)

New page — no current assets. All product imagery comes from the
fixture-backed demo run (`scc_demo_env.py`, token `demo-token`, captures in
`_raw/supply-chain-compliance-copilot-py/`); film stills are Remotion
renders at `--scale=2`, `burnSubtitles:false`.

| Slot | File | Source | Status |
|---|---|---|---|
| hero 1600×1000 | `hero-1600.webp` | hero-trio: `07-overview` (laptop), `08-tablet-768`, `09-mobile-390` | done |
| card 800×500 | `card-800.webp` | card-thumb on `07-overview` (case heading + five worker lanes) | done |
| og 1200×630 | `og.png` | og-card on `07-overview` | done |
| poster 1920×1080 | `video-poster-1920.webp` | Remotion still `title` @frame 1564 (reveal beat) | done |
| hook 1920×1080 | `hook-1920.webp` | Remotion still `hook` @frame 1070 (page beat) | done |
| loop 1280×720 | `loop.webm` / `loop.mp4` / `loop-poster.webp` | Remotion render frames 2430–2660 (evidence beat), forward+reverse seamless concat; poster = still @2500 | done |
| feature 1 finding | `feature-1-1600.webp` | detail-zoom on `01-finding-evidence` (finding row + verbatim quote) | done |
| feature 2 specialists | `feature-2-1600.webp` | feature-browser on `02-fanout-lanes` | done |
| feature 3 risk | `feature-3-1600.webp` | feature-browser on `03-risk-panel` | done |
| feature 4 CAPA gate | `feature-4-1600.webp` | feature-browser on `04-capa-modal` | done |
| feature 5 report | `feature-5-1600.webp` | feature-browser on `05-report` | done |
| feature 6 blocked | `feature-6-1600.webp` | detail-zoom on `06a-blocked` (guardrail rejection) | done |
| gallery 1 event log | `gallery-1-1200.webp` | feature-browser on `10-gallery-eventlog` | done |
| gallery 2 CAPA table | `gallery-2-1200.webp` | feature-browser on `11-gallery-capa` | done |
| gallery 3 registry | `gallery-3-1200.webp` | feature-browser on `12-gallery-registry` (list view only, no prompt text) | done |
| gallery 4 mobile report | `gallery-4-1200.webp` | contain on `mobile-report-crop` (derived 780px slice of `13-mobile-report`) | done |
| ~~architecture~~ | ~~`architecture.webp`~~ | removed under D-OD9 (2026-11-16): on-demand pages ship no architecture section | superseded |

Pending recaptures: none for this page. Outstanding film work (2160p master,
30 s/15 s cuts, YouTube upload + ID, owner watch-and-listen) is tracked in
`docs/qa/supply-chain-compliance-copilot-py.md`.
