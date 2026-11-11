# QA — ecommerce-support-returns-copilot project page

Working file for the page build. Evidence screenshots live in
`docs/qa/ecommerce-support-returns-copilot/`.

## Material inventory (source → use)

| Source | Where | Use |
|---|---|---|
| `docs/ui-qa/*.png` (project repo) | `ecommerce-support-returns-copilot/docs/ui-qa/` | 1280×800 @1x — below the 1440px target; replaced by keyless recaptures at 1440×900 @2x |
| Live clips `01..05-*.mp4` | `video-studio/public/upgrade/clips/` (copies `_video/.../clips/`) | 1440×810, real live run — frames for console surfaces (real costs) |
| Film master `promo-master-2160p60.mp4` | `_video/.../upgrade/out/` | reference only — never extracted (D2) |
| `poster-1920x1080.png`, `loop-gate.*` | `_video/.../upgrade/out/` | reference only — page assets re-rendered from Remotion |
| `evaluation/scorecard.json` | project repo | published metrics source (2026-10-14, live, gpt-4o-mini) |

## Scorecard verification (published figures vs `scorecard.json`)

| Claim | Scorecard | OK |
|---|---|---|
| Resolution accuracy 1.00 vs baseline 0.11 | `metrics.resolution_accuracy` 1, `baseline.metrics.resolution_accuracy` 0.1111 | ✓ |
| Cost/ticket ~$0.0006 | `metrics.avg_cost_usd` 0.0006 | ✓ |
| Deflection 81% | `metrics.deflection_rate` 0.8056 | ✓ |
| Injection block 100% vs 0% | `metrics.injection_block_rate` 1, baseline 0 | ✓ |
| 36 synthetic tickets, single live run | `cases` = 36, `mode` = "live", `runs_executed` = 1 | ✓ |
| 486 tests | README: 442 backend + 26 frontend + 18 e2e | ✓ |
| 97.1% coverage | README badge: 97.1% backend lines | ✓ |

## Keyless run (Step 1 check)

- `npm run dev` on the real repo with `OPENAI_API_KEY="" LANGCHAIN_API_KEY=""
  DEMO_OPENAI_API_KEY="" CONSOLE_AUTH_DISABLED=true` (env vars empty so dotenv
  treats them as absent): server reports `"mode":"stub","live_llm":false`. ✓
- `data/app.sqlite` backed up before captures and restored after; stray `nul`
  file removed; `git status` clean afterwards. No repo modification. ✓

## Raw captures (`_raw/ecommerce-support-returns-copilot/`)

Keyless Playwright, 1440×900 @2x (mobile/tablet at device size @2x):

| File | Source | Content | Review |
|---|---|---|---|
| widget-resolved-1440.png | keyless (ORD-1001) | REFUND APPROVED + policy citation | ✓ seed data only |
| widget-requires-approval-1440.png | keyless (ORD-1005) | UNDER SPECIALIST REVIEW, $240>cap | ✓ |
| widget-blocked-1440.png | keyless (injection string) | REQUEST NOT PROCESSED | ✓ customer-facing text only, no detector internals |
| widget-duplicate-1440.png | keyless (ORD-1007 2nd return) | ALREADY REFUNDED | ✓ |
| console-duplicate-1440.png | keyless console | queue + ALREADY REFUNDED ticket + trace | ✓ stub budget header is honest ($0.00/$5.00) |
| console-registry-1440.png | keyless console | Prompt Registry list only; Model column hidden via CSS (vendor name per film rule) | ✓ no prompt bodies/diffs visible |
| widget-mobile-390.png | keyless (ORD-1023) | REFUND APPROVED, mobile | ✓ |
| widget-tablet-768.png | keyless (ORD-1005) | UNDER SPECIALIST REVIEW, tablet | ✓ |

Live-clip frames (1440×810, real costs — picked by eye):

| File | Source | Content |
|---|---|---|
| pick-02-4.5.png | clip 02 @4.5s | console queue + trace + policy citations (feature-1, hero laptop) |
| pick-03-8.png | clip 03 @8s | approval modal $240 vs $75 (feature-2) |
| pick-05-5.png | clip 05 @5s | Performance & Cost, live costs (feature-5) |

Skipped: `console-performance-narrow.png` (stub $0.00 costs — plan forbids);
approval-queue list clip frame (mostly empty, weak composition).

## Forbidden-content review

- No keys/tokens/env vars/file paths/class names in any capture. ✓
- No Langfuse/LangSmith surfaces captured. ✓
- Registry list: Model column masked (gpt-4o-mini is the vendor name — film
  rule). No prompt text/diff/editor visible. ✓
- All customers are seed/fictional (Aurora Outfitters); ticket refs are
  product refs (#4858d18d etc.), not commit SHAs. ✓
- `/status` page not captured (shows CI/repo signals). `demo.gif` unused. ✓
- Stub ($0.00) cost surfaces never used for Performance & Cost — that feature
  uses the live-run clip only. ✓

## Page assets (Step 4)

All in `public/projects/ecommerce-support-returns-copilot/`, rendered via
`tools/mockups` (Playwright stage, 2×, sharp WebP q85):

| Asset | Source | Note |
|---|---|---|
| hero-1600.webp | pick-02-4.5 + widget-tablet + widget-mobile | trio composition |
| card-800.webp | pick-02-4.5 crop | legible at menu size |
| og.png | pick-02-4.5 | private/on-demand label, no repo |
| video-poster-1920.webp | Remotion still `title` f1354 (clean) | play overlay |
| hook-1920.webp | Remotion still `hook` f179 with `hookOverlay:false` | wall only, no headline — page text overlays cleanly |
| feature-1..6-1600.webp | captures + live-clip frames | 6 (blocked) → 1 (citations) → 2 (cap) → 3 (duplicate) → 4 (desktop+mobile) → 5 (perf) page order per film |
| gallery-1..4-1200.webp | widget requires-approval, tablet, registry, duplicate | each own alt |
| architecture.webp | `architecture` template 1920×960 | Mermaid transcribed node-for-node, humanized labels, no identifiers |
| loop.mp4 / loop.webm / loop-poster.webp | `UpgradeLoop` comp (600f @60fps → 10 s) | cyclic draw/hold/undraw, no audio, ≤ 1 MB each |

`PromoUpgrade` gained a `hookOverlay?: boolean` prop (default `true`, films
byte-identical) so stills can drop the hook headline; `brackets` was already
added for clean stills. `phone-pair` template added for feature-4
(desktop + phone inset, reusable).

## Rendered-page QA (Step 9, `npm run preview` on dist)

Screenshots: `docs/qa/ecommerce-support-returns-copilot/step9/`.

- `/` landing: ON DEMAND act card (01 / NODE, LIVE + PRIVATE badges, blurb,
  stack chips, "Private systems I adapt to your business…"). ✓
- Counter strip EN: `5` systems (`4 open source · 1 on demand`), `2148`
  tests (`1662 in public repos · 486 private`), `98%` top coverage. ✓
- ES mirror: `4 código abierto · 1 bajo demanda`, `1662 en repos públicos ·
  486 privados`. ✓
- `/projects` On demand section: PRIVATE + LIVE badges, no GitHub affordance. ✓
- Mega-menu @1280: two groups (OPEN SOURCE 01–04 / ON DEMAND 01 + PRIVATE
  badge + "Evaluation access on request →" + "View all projects →"). ✓
- Mobile burger @375: same groups stacked, scrollable. ✓
- Project page: hook band over clean wall still; FILM COMING SOON placeholder
  on title-card poster (`youtubeId: null`); scroll-spy tabs work; feature
  zig-zag in film order; architecture img 1920×960 + "Simplified from the
  private codebase" caption + `<details>` description; results counters +
  baseline 1.00 vs 0.11; limitations block; contact band with CTA and NO
  GitHub button; prev-link → Guardrailed Agentic AI API (no next). ✓
- "Private project · Get in touch" present in hero slot. ✓
- Lightbox opens on feature images (incl. @375). ✓
- Reduced motion: `prefers-reduced-motion` → loop poster img, zero loop
  video requests. ✓
- No horizontal overflow @375 (docW = innerWidth = 375). ✓

## Film parity

`docs/qa/ecommerce-support-returns-copilot/film-parity/` — 1920×1080 page
sections beside matching clean Remotion stills: hook (wall), hero (title),
feature-approval (human beat), results-baseline (proof counters), cta (end
card). Page reads as the same production. ✓

## Performance (Lighthouse on dist, npx)

| Preset | Perf | A11y | BP | SEO |
|---|---|---|---|---|
| Desktop project page | 0.99 | 1.00 | 0.96 | 1.00 |
| Mobile project page | 0.91–0.99 | 1.00 | 0.96 | 1.00 |

Budget notes: initial mobile image weight 0.23 MB (hook 44 KB + hero 91 KB +
lazy cards) — far under the 2.5 MB plan cap; loop mp4/webm absent from
initial requests; LCP was the only weak metric until the hook still was
recompressed (80 → 44 KB, quality 50 — it renders at 30% opacity behind the
hook headline, so the extra detail was invisible). Post-fix LCP ≈ 2.0–3.5 s
simulated (run-to-run variance), score ≥ 0.91. Reports:
`docs/qa/ecommerce-support-returns-copilot/lighthouse-{desktop,mobile}.json`.

## Verification commands (all green)

`npm run lint` · `npm run typecheck` · `npm test` (9/9) · `npm run build`
(sitemap includes the route) · `npm run validate:content` (5 projects, all
assets OK — incl. caption guard on film-derived assets and the D-OD4
confidentiality scan).

## Pending (user actions)

- YouTube upload (unlisted) + ID → set `video.youtubeId`, verify via oEmbed.
- Watch-and-listen review of the film master.
- `git push` / deploy authorization.
