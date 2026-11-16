# QA — supply-chain-compliance-copilot-py project page

Working file for the page build. Evidence screenshots live in
`docs/qa/supply-chain-compliance-copilot-py/` (created as needed) and raw
material in `_raw/supply-chain-compliance-copilot-py/` (never published).

## Material inventory (source → use)

| Source | Where | Use |
|---|---|---|
| `README.md` (private repo) | `..\supply-chain-compliance-copilot-py\README.md` | architecture graph, test counts, scorecard table |
| `evaluation/scorecard.json` (private repo) | same repo | published metrics source (cassette mode, 2026-10-16, gpt-4o-mini capture replayed deterministically) |
| `evaluation/fixtures/smeta-audit-sample.txt` | private repo | fictional audit document for the demo run (Kestrelford Textiles Ltd, BD, Apparel & Garments, Tier 2) |
| `evaluation/adversarial/injected-audit.txt` | private repo | adversarial document for the blocked-state capture, re-uploaded under the neutral name `audit-kestrelford-bd.txt` |
| v2 film master `promo-v2-master-1080p60.mp4` | `_video/supply-chain-compliance-copilot-py/upgrade/out/` | reference only — never committed, never frame-extracted for the page (D2) |
| `rc-sheet.png`, `qa-frames/` | `_video/.../upgrade/` | film-parity reference for image review |
| `docs/case-study/*.png`, `docs/ui-qa/evidence/*.png` (private repo) | same repo | low-res references only; all published images are fresh 2× captures |
| `docs/img/langfuse-*.png`, `Demo.gif`, `demo-frames/` (private repo) | same repo | never published (D4 / D-OD5) |
| EN/ES captions `…-v2.{srt,vtt}`, `…-v2-es.{srt,vtt}` | `video-studio/subtitles/` | caption files for the YouTube upload (user action); vocabulary reference for `copy.es` |

## Scorecard verification (published figures vs `scorecard.json`)

`evaluation/scorecard.json` (mode `cassette`, generated 2026-10-16, `pass: true`):

| Claim | Scorecard / README | OK |
|---|---|---|
| Citation faithfulness 0.96 | `metrics.citation_faithfulness` = 0.96296 | ✓ |
| Faithfulness baseline 0.896 | `baseline.citation_faithfulness` = 0.89583 | ✓ |
| Fabricated quotes 0% vs 10.4% | `metrics.hallucinated_quote_rate` = 0.0, `baseline.hallucinated_quote_rate` = 0.10416 | ✓ |
| Injection block 100% | `metrics.injection_block_rate` = 1.0, `details.adversarial_docs` = 3/3 | ✓ |
| CAPA grounding 100% | `metrics.capa_grounding` = 1.0 (26 CAPAs evaluated) | ✓ |
| 6 synthetic audits, one pass | `details.cases_evaluated` = 6, `mode` = cassette | ✓ |
| 705 tests | README "Current state": 575 backend + 123 frontend + 7 e2e | ✓ |
| Coverage | README documents 91% branch backend / ≥85% frontend only — no line figure, so `coverage` is omitted and the tests note carries "91% backend branch coverage" | ✓ |

No cost figure is published (fixture produces none; D-OD5).

## Fixture-backed demo run (Step 1/2 check)

- Launcher: `video-studio/capture/scc_demo_env.py` (deterministic fixture
  upstream, temp SQLite/checkpoint DBs outside the repo, `OPERATOR_API_KEY`
  `demo-token` held in the page's localStorage only — never in a frame).
- Two runs executed through `_raw/supply-chain-compliance-copilot-py/capture.mjs`
  and `recapture.mjs` (Playwright, 1440×900 @ deviceScaleFactor 2, tablet
  768×1024, phone 390×844): full audit run intake → fan-out → findings with
  quotes → CAPA review pause → approve-all → report, plus the adversarial
  document → blocked state, audit-trail verification, registry list,
  tablet/mobile passes.
- First pass review found the random case-id hex still visible (React splits
  `Case ` and the shortId into separate text nodes) and a test filename
  (`injected-audit.txt`) in the blocked shot. `recapture.mjs` masks the whole
  `h2[title]` heading plus standalone hex nodes (keeping `<code>` audit-root
  fragments, which are the product's own verification feature) and re-uploads
  the adversarial fixture as `audit-kestrelford-bd.txt`. All affected shots
  were retaken and re-reviewed.
- The private repo was never modified (demo env writes to temp dirs; repo
  `git status` untouched by captures).

## Raw captures (`_raw/supply-chain-compliance-copilot-py/`)

Reviewed as images against the forbidden list (no prompt text/diffs/editor,
no terminals/logs/API/JSON, no token fields, no env vars, no file paths, no
snake_case labels, no third-party dashboards, no commit SHAs, no vendor
names, no cost panels, no real names/emails):

| File | Content | Review |
|---|---|---|
| 00-intake.png | New case form (Kestrelford Textiles Ltd, BD, Apparel & Garments, Tier 2, audit-kestrelford-bd.txt) | ✓ recaptured 2026-11-16: neutral filename; HQ-country hint shortened to "Two-letter ISO-3166 code." (the static "Not in risk table" clause was wrong for BD); fictional fixture data only |
| 00-intake-768.png | Same form at 768×1024 | ✓ same pass |
| 00-intake-390.png | Same form at 390×844 (top slice used; site-row overflow at 390 px stays out of frame) | ✓ same pass |
| 01-finding-evidence.png | Risk breakdown + Non-conformities (8) with verbatim Evidence column + CAPA table head | ✓ |
| 02-fanout-lanes.png | Five worker cards (Mapper · Risk Scorer · Compliance Analyst + four area lanes · CAPA Writer · Report Writer) | ✓ |
| 03-risk-panel.png | Risk breakdown element crop (Country 72/100 · Sector 70/100 · tier uplift +8) | ✓ |
| 04-capa-modal.png | CAPA review modal element shot (8 pending, Approve/Edit/Reject radios) | ✓ reviewer field is the generic role "operator" |
| 04-capa-review.png | Same modal over the dimmed case view | ✓ case id masked |
| 05-report.png | Report header: "Report — Kestrelford Textiles Ltd", High (69), Download PDF, "Human review: Approved", risk breakdown, NC table | ✓ export is a real product control |
| 06a-blocked.png | Intake + red "rejected by the input guardrail (possible hidden instructions)", file `audit-kestrelford-bd.txt` | ✓ neutral filename, no matched text echoed |
| 06b-audit-verified.png | CAPA table + Provenance (per-worker prompt versions) + "Audit chain ✓ verified — root …" | ✓ chain roots are the product's own verify feature, not commit SHAs |
| 07-overview.png | Completed case: "Case Kestrelford audit", Completed, five worker lanes, "Pipeline finished", report top | ✓ |
| 08-tablet-768.png | 768 px completed case + report header | ✓ |
| 09-mobile-390.png | 390×844 case cards | ✓ |
| 10-gallery-eventlog.png | Event log (51 humanized event labels, no snake_case) | ✓ |
| 11-gallery-capa.png | NC table + CAPA table (Approved rows) | ✓ |
| 12-gallery-registry.png | Prompt Registry list: workers + v1/v2 lifecycle (Rolled back / Promoted), actors "system"/"operator" | ✓ no prompt text, preview or diff visible |
| 13-mobile-report.png | 390 px full-page report | ✓ |
| mobile-report-crop.png (derived) | 780px slice of 13 at the report header | ✓ derived, review inherited |

Skipped from publication: `capture.mjs`, `recapture.mjs`, `seam-*.png`
(loop seam checks), `loop-src.mp4` (render source), `stills/` intermediates.

## Remotion stills (`_raw/.../stills/`, scale 2, `burnSubtitles:false`)

| Still | Comp frame | Content | Review |
|---|---|---|---|
| hook.png | 1070 (page beat ~70%) | audit page, red-lit lines, "74 hours a week.", "No overtime was recorded." generic-summary ghost marked illustration | ✓ dimmed text band suitable for the page hook |
| title.png | 1564 (reveal ~70%) | INTRODUCING / Supply Chain Compliance **Co-Pilot** / tagline | ✓ |
| loop-poster.png | 2500 (evidence beat) | NC-01 card + thread + lit sentence + "Found in the audit" + area chips | ✓ |

`PromoCompliance2` already takes `burnSubtitles`; no brackets are drawn by
the compliance2 skin (`skin.tsx`: "no grid, no brackets"), so no prop was
added — film output stays byte-identical.

## Loop (`_raw/.../loop-src.mp4` → `loop.{mp4,webm}` + `loop-poster.webp`)

- Remotion render of `PromoCompliance2` frames 2430–2660 (evidence beat,
  burnSubtitles off) → forward+reverse concat = seamless 7.7 s @ 1280×720.
- `loop.mp4` 1.30 MB, `loop.webm` 1.25 MB — both ≤ 3 MB, no audio, no burned
  captions. Seam frames checked (10/225/235/455): no cut at the wrap.

## Site QA (Step 9) — evidence in `step9/` + `film-parity/`

Captured with `docs/qa/supply-chain-compliance-copilot-py-capture.mjs`
(Playwright against `vite preview` on `:4180`, prerendered `dist/`).

**Ordering (new project first in the On-demand group everywhere)**

- `megamenu-1280.png` — header Projects menu: `01 · PRIVATE` Supply Chain,
  `02` E-commerce.
- `home-od-1280.png` / `projects-od-1280.png` — landing On-demand act and
  projects index: Supply Chain first, E-commerce second, both `PRIVATE` +
  `LIVE`; open-source group unchanged below.
- `burger-projects-375.png` — mobile burger menu + On-demand teaser on the
  landing hero.
- `prevnext.png` — no previous project; `NEXT PROJECT →` is E-commerce.

**Page content**

- `page-1280-top.png` / `page-375.png` / `page-768.png` /
  `m375-{top,feature,arch,results,cta}.png` — hero hook, features,
  architecture, results and CTA at 1280 / 768 / 375; zero horizontal
  overflow at 375 (`scrollWidth − innerWidth = 0`).
- `page-es-1280-top.png` — Spanish page localized (nav, hook, tagline,
  badges).
- `sec-how.png`, `sec-arch.png` — six-step workflow and the conceptual
  architecture figure with "Simplified from the private codebase" note and
  accessible "Text description of the diagram" details. **Superseded
  2026-11-16 (D-OD9): the architecture section was removed; `sec-arch.png`
  is kept only as history.**
- `sec-results.png` / `results-baseline.png` — counters settled at exact
  figures: 0.96 faithfulness (baseline 0.90, scorecard 0.963/0.896), 100%
  injection block (3 docs), 100% CAPA grounding, 705 tests
  (575 backend 91% branch + 123 frontend + 7 e2e); fabricated quotes 0% vs
  10.4%. **Superseded 2026-11-16 (D-OD9): results rewritten in buyer
  language — see "Fix V2" below.**
- `cta.png` — end-card CTA; `mailto:contact@kaarstenanderson.com` (both mailto
  links verified in DOM; only GitHub anchors are the site-wide owner profile
  in nav/footer — no project repo link).
- `lightbox-375.png` — gallery lightbox opens; `Esc` closes (0 dialogs left).

**Film parity (`film-parity/`)** — page beats mirror the v2 film:
hero → hook (`A generic AI summary says everything's fine.` over the audit
illustration) → CAPA approval feature → measured results + baseline →
matching end-card CTA.

**Accessibility & performance**

- `AmbientLoop` never loads the video under `prefers-reduced-motion` or
  Save-Data (poster only); pause button with `aria-pressed`/`aria-label`.
- Lighthouse (`lighthouse-mobile.json`): perf **91**, a11y **100**,
  best-practices **96**, SEO **100** — budgets pass (≥90 / ≥95).
- Lighthouse (`lighthouse-desktop.json`): perf **100**, a11y **100**,
  best-practices **96**, SEO **100**.
- The only binary-audit fails match the e-commerce baseline: Cloudflare
  beacon CORS on localhost (environment artifact) and the site-wide `KA_`
  logo `label-content-name-mismatch` — no new issues from this page.

**Confidentiality sweep (rendered `dist/` pages)**

- `sedex`, `langsmith`, `langfuse`, `openai`, `api_key`, `.env`, pytest,
  storage/detector identifiers, source paths: **0 hits**.
- `checkpoint`/`commit` appear only as conceptual copy
  ("checkpointed", "committed scorecard"); `@` only as the contact mailto.
- `validate:content` (all 6 projects green) re-checks asset dimensions,
  budgets, duplicates/orphans, burned-caption heuristic and the confidential
  identifier list.

**Checks run:** `npm run typecheck` ✓ · `npm test` (37 tests, 6 files) ✓ ·
`npm run lint` ✓ · `npm run build` (Vite + prerender 16 routes + SEO guard) ✓ ·
`npm run validate:content` ✓.

## Fix V2 (2026-11-16) — sell the product, not the engineering

Owner review flagged four problems (F-01…F-04); fixed per
`projects/supply-chain-compliance-copilot-py/PLAN_FIX_V2.md`. Evidence in
`docs/qa/supply-chain-compliance-copilot-py/fix-v2/`.

- **F-01 — first image is the product's first screen.** Intake recaptured at
  all three sizes (`node recapture.mjs --intake` against the fixture demo
  env): `00-intake` (1440×900@2), `00-intake-768`, `00-intake-390`. Neutral
  filename `audit-kestrelford-bd.txt`; the static HQ-country hint
  "…Not in risk table: default baseline applies." was wrong for BD (real
  baseline 72/100), so the capture-time DOM patch keeps only "Two-letter
  ISO-3166 code." — the hint never updates on blur, and a mid-form band
  cannot be cropped out. `hero-1600.webp` (trio: desktop/tablet/phone
  intake, kicker `COMPLIANCE COPILOT`, center tag `REAL APP · FIXTURE RUN`),
  `card-800.webp` (title + New case → Supplier tier) and `og.png` (same
  crop, existing title/tagline) regenerated and re-reviewed as images.
  Card/hero alts updated EN+ES.
- **F-02 — results in buyer language.** "Automated tests · 705" removed
  (EN+ES); remaining tiles now read: 100% hidden-instruction documents
  blocked (3 of 3), 100% corrective actions tied to a real finding (26 of
  26), 96% drafted findings passing the quote check — all `measured`, all
  traceable to `evaluation/scorecard.json` (injection_block_rate 1.0,
  capa_grounding 1.0 = 26 CAPAs, citation_faithfulness 0.963). Baseline band
  relabelled "Invented quotes in the report" / "Citas inventadas en el
  informe" — "This system vs a single AI prompt · 6 fictional audits"
  (hallucinated_quote_rate 0.0 vs 0.10416, `cases_evaluated` 6). `tests: 705`
  stays in the typed data (landing counters) but is never rendered.
- **F-03 — architecture removed.** `architecture` field deleted (section +
  sub-nav entry hide automatically in `ProjectPage`), mockup `architecture`
  job deleted, `architecture.webp` removed, engineering talk swept
  (supervisor → coordinator; deterministic/scored in code → fixed rules;
  "in parallel" → "at the same time"/"a la vez"; ES mirrored).
- **F-04 — standing rule.** `docs/DECISIONS.md` D-OD9 added; D-OD4/D-OD7
  scoped to open-source + the grandfathered page. `validate-content.ts`
  fails non-legacy on-demand projects on `architecture` or
  `/\btests?\b|coverage|cobertura|\bCI\b|e2e/i` in result label/note;
  `projects.test.ts` asserts the same. D-OD9 note added to the unbuilt
  on-demand plans and root `Plan.md` §5.

The earlier architecture/results evidence above (`sec-arch.png`,
`m375-arch.png`, first `sec-results.png`) is superseded, kept as history.

**Site QA — evidence in `fix-v2/`** (captured with
`docs/qa/supply-chain-compliance-copilot-py-fix-v2.mjs`, Playwright against
`vite preview` on `:4180`, prerendered `dist/`)

- `megamenu-1280.png` — header On-demand column: the Supply Chain card now
  leads with the intake form, legible at menu size.
- `home-od-1280.png` / `projects-od-1280.png` — landing On-demand act and
  `/projects#on-demand`: the card image is the New case intake crop
  (`COMPLIANCE COPILOT` caption); E-commerce card unchanged.
- `page-1280-top.png` / `page-768-top.png` / `page-375-top.png` — hero trio
  (desktop/tablet/phone intake) under the hook band at all three widths.
- `subnav-1280.png` — sub-nav reads `overview · demo · features · results ·
  stack`; script confirms `architecture in subnav: false`.
- `results-1280.png` / `results-375.png` — counters settled: 100% blocked
  (3 of 3 tampered audits), 100% CAPA tied to a real finding (26 of 26),
  96% drafted findings passing the quote check; baseline band 0% vs 10.4%.
  No test-count tile.
- `cta-1280.png` — end-card CTA + next-project card.
- `page-es-1280-top.png` / `results-es-1280.png` — Spanish page top
  (RESUMEN · DEMO · FUNCIONES · RESULTADOS · STACK, no ARQUITECTURA) and
  Spanish results tiles, same metrics.
- 375 px horizontal overflow: `scrollWidth − innerWidth = 0`.
- Rendered-page sweep (EN + ES `dist/` HTML): 0 hits for `705`,
  `automated tests`, `tests automatizados`, `coverage`, `cobertura`,
  `architecture`, `arquitectura`, `\bCI\b`.
- Lighthouse mobile (`fix-v2/lighthouse-mobile.json`): perf **98**,
  a11y **100**, best-practices **96**, SEO **100** — budgets pass
  (≥90 / ≥95).

**Checks run:** `npm run lint` ✓ · `npm run typecheck` ✓ · `npm test`
(38 tests, 6 files) ✓ · `npm run build` (prerender 16 routes + SEO guard) ✓ ·
`npm run validate:content` (6 projects, all assets OK) ✓.

## Pending (owner actions — not doable from the repo)

- YouTube upload of `promo-v2-master-1080p60.mp4` (unlisted) + EN/ES caption
  files + `youtube-thumbnail.png`; then set `video.youtubeId`.
- User watch-and-listen review of the v2 film (PLAN_upgrade G6).
- 2160p master, 30 s / 15 s cuts (PLAN_upgrade open items).
- Search Console resubmission/indexing requests after deploy (Step 0.5 list).
- `git push` / deploy authorization.
