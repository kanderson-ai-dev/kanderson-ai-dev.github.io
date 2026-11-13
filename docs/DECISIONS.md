# DECISIONS — cross-project site decisions

Short records of decisions that affect more than one page. Project-specific
decisions live in the project plans.

## D1 — Feature slot is 16:9 (1600×900)

Film stills are 16:9 and real captures are framed by `tools/mockups/`, so the
feature slot uses `aspect-ratio: 16/9` at 1600×900 (+960/480 variants) —
no browser-side crop. Approved by the owner 2026-11-10.

## D2 — Film stills come only from Remotion

`scripts/render-stills.mjs` renders `npx remotion still` with
`burnSubtitles: false, brackets: false` (the `brackets` prop exists on every
promo composition). Stills are never extracted from the MP4 masters (burned
captions + unreliable seeking).

## D3 — Film stills are illustrations

Anything that says "this is the product" is a real capture (framed by
`tools/mockups/`). Film stills fill only the hook band, posters and concept
beats.

## D4 — Third-party dashboards are never published

No Langfuse / LangSmith screenshots, names or logos anywhere on the site —
reference only. The validator enforces this for on-demand projects.

## D-OD1 — Navigation: one "Projects ▾" entry with two groups

The mega-menu splits into **OPEN SOURCE** ("Public code on GitHub · MIT") and
**ON DEMAND** ("Private code · adapted to your business"), two columns on
desktop ≥1024 px, stacked in the mobile burger. Group headers link to
`/projects#open-source` / `/projects#on-demand`; the On-demand column ends
with "Evaluation access on request →". No second top-level button; project
URLs stay `/projects/<slug>`.

## D-OD2 — The same split everywhere a project list appears

`/projects` has two sections (`#open-source`, `#on-demand`); the technology
filter spans both and an empty section hides. The landing shows both groups
as separate acts before About. On-demand cards carry a "Private" lock badge
and no GitHub affordance; `ContactBand` hides its GitHub button on
on-demand pages; the hero button slot shows "Private project · Get in
touch" → `#contact`. Group order (landing, prev/next): see D-OD6.

## D-OD3 — Landing counters include on-demand projects, split shown

Totals are data-driven: every project declares `tests`/`coverage`; `totals`
sums/maxes them and splits by `access`. Notes read "N open source · M on
demand" and "N in public repos · M private"; when a group is empty the old
notes stay. Private repos count only once their page exists.

## D-OD4 — On-demand architecture: shown, simplified, never internals

Publish only a conceptual diagram transcribed from the project README graph,
with humanized labels. Never publish: source paths, class/error/env-var
names, API routes, prompt text, detector patterns, dataset items, commit
SHAs, or third-party dashboards. Caption: "Simplified from the private
codebase". Enforced by `scripts/validate-content.ts` (confidentiality scan,
per-project allow-list) for every on-demand project. Raster diagrams are
scanned through their mockup config; edges may route through waypoints.

## D-OD5 — On-demand real UI images: live runs, product surfaces only

Real product captures (widget, console queue + trace, approval modal,
Performance & Cost) — prefer frames from the live-run film clips so costs
are real, never the stub's `$0.00`. Forbidden: prompt text/diffs/editor,
status page metadata, terminals/logs/API responses, tokens, env vars, file
paths, dashboards, real personal data.

## D-OD6 — On demand leads

Owner decision 2026-11-11: the on-demand group comes first in every project
list — landing acts, mega-menu, `/projects` sections, prev/next and the
counter notes. On the landing it sits right after the hero, before the
counter strip, and a teaser link under the hero CTAs points to `#on-demand`.
Supersedes the ordering sentences of D-OD2; the same-split-everywhere rule
of D-OD2 stands.

## D-OD7 — Several architecture views per project

A project may publish several architecture views (e.g. runtime flow +
system view); each is transcribed from its own README diagram.

## D-OD8 — On-demand pages show no limitations panel

Owner decision 2026-11-13: on-demand projects are adapted to each client
under contract, so scope gaps are rollout steps, not product limits. The
page shows no "Known limitations" block. Metric evidence labels (`kind`,
`EvidenceChip`, baseline caption) are unaffected and remain mandatory.
Open-source pages keep their limitations block.
