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
