# QA — On demand leads (2026-11-11)

Evidence for the site-wide reorder that puts on-demand projects first
(decision D-OD6). Checks ran against `npm run preview` (`dist` on
`localhost:4173`) via `_raw/qa-ecom/od-first-qa.cjs` — 58 checks, all green.

## Depth

| Viewport | `#on-demand` top | Screens | Target |
|---|---|---|---|
| 1280×800 | 800 px | 1.00 | ≤ 1.1 |
| 375×812 | 812 px | 1.00 | ≤ 1.1 |
| 768×1024 | 1024 px | 1.00 | ≤ 1.1 |
| 1920×1080 | 1080 px | 1.00 | ≤ 1.1 |

`#work` and `#on-demand` tops coincide (the contact band's "See the work"
lands on the ON DEMAND act). Before: 4.2 / 5.6 screens.

## Landing

- Order: hero (+ teaser link) → ON DEMAND act + intro + copilot card →
  counter strip → OPEN SOURCE act + 4 cards → About → contact.
- Hero teaser `a[href="#on-demand"]` inside the first viewport at
  375 / 768 / 1280 / 1920 (1 line desktop, 2 lines at 375 — CTAs stay on the
  first screen). Tab order: View projects → Get in touch → teaser. Visible
  focus outline. Still visible under `prefers-reduced-motion`.
- Zig-zag alternation continuous: flip pattern `false,true,false,true,false`
  across the group boundary; numbering restarts per group
  (`01 / NODE`, then `01..04 / PYTHON`).
- Copilot card image keeps `loading="lazy"`; LCP = hero loop poster
  (orchestrator), not the copilot card. CLS < 0.02 at all four viewports.
- No horizontal overflow at any viewport.

## Counters

- EN: `5 agentic systems — 1 on demand · 4 open source`,
  `2148 automated tests — 486 private · 1662 in public repos`, `98%`.
- ES: `1 bajo demanda · 4 código abierto`,
  `486 privados · 1662 en repos públicos`; act `BAJO DEMANDA` /
  `CÓDIGO ABIERTO`, teaser `Bajo demanda · Privado · <title> ↓`.

## Navigation

- Mega-menu ≥1024: ON DEMAND column left (narrower), OPEN SOURCE right;
  DOM = visual = Tab order; 5 blurbs inside the panel at 1024/1280/1920.
  Esc closes (`aria-expanded=false`).
- Burger 375: stacked, ON DEMAND group first.
- `/projects`: `#on-demand` section first, then `#open-source`; filter
  unchanged; `/projects#open-source` hash scroll lands on the section.
- Prev/next: copilot → no prev, next = LangGraph orchestrator;
  orchestrator prev = copilot, next = MCP toolkit; agentic-api → no next.

## Lighthouse — `/` (lighthouse 13.6.0)

| Preset | Perf | A11y | BP | SEO | LCP |
|---|---|---|---|---|---|
| Mobile | 100 | 98 | 96 | 100 | 1.9 s |
| Desktop | 100 | 98 | 96 | 100 | — |

Reports: `lighthouse-mobile.json`, `lighthouse-desktop.json`.

## Screenshots (`landing-on-demand-first/`)

`before-*` = captures from the previous layout QA (`_raw/qa-ecom`,
2026-11-11 14:25); `after-*` = this change. Full-page `after-landing-*.png`
were captured with `content-visibility` forced visible and smooth scroll
disabled so lazy sections paint in the stitch.
