# QA — Mobile projects mega-menu (2026-11-13)

## Problem (owner screenshot, Android Chrome)

With the burger open and PROJECTS expanded, at ≤ 900 px:

- Group headings were cut off on the left ("ON DEMAND" showed as "DEMAND",
  "Evaluation access on request" as "luation access…"); thumbnails cut too.
- The panel was drawn on top of the rest of the menu — Contact, EN/ES,
  GitHub and the "Open to work" pill were hidden under it.
- Group headings read as small low-contrast labels, not section headers;
  blurbs clipped to one line.
- Hero text showed through behind the menu links.

## Root cause

- `.megaPanel` was `position: absolute; left: 50%; transform:
  translateX(-50%); min-width: 520px` with no mobile override — inside the
  ~360 px burger column it spilled ~60–80 px past both edges.
- The `@media (max-width: 900px)` block only restyled `.navLinks`; the
  panel stayed an overlay covering the links below it.
- `.navLinks.open` had no `max-height`/`overflow-y` and a 97 %-opaque
  background; `.megaGroupSub` used `--dim` (≈ 2.9:1 — fails WCAG AA) and
  `.megaBlurb` was `nowrap`.
- `MegaMenu` opened on emulated touch mouse-events; the burger had no
  `aria-controls` and no Escape handling.

## Fix

- ≤ 900 px: the panel is an inline accordion row inside the burger column
  (`position: static; display: none|block`), the menu scrolls
  (`max-height: calc(100dvh - var(--nav-h)); overflow-y: auto`) on a fully
  opaque `--bg-deep` background, the inner GlassPanel chrome is removed,
  group heads get an accent border + tint, `.megaGroupSub` is `--muted`
  everywhere, blurbs clamp to two lines, tap targets ≥ 44 px.
- 901–1023 px: `.mega` goes static so the floating panel anchors to the
  right edge of the full-width nav and can never overflow the viewport.
- `MegaMenu`: hover timers only run under `(hover: hover) and
  (pointer: fine)`; panel `id` + `aria-controls`; closes on route change.
- Navbar: `id="primary-nav"` + burger `aria-controls`; Escape closes the
  burger and returns focus to it.

## Verified

`node scripts/qa-mobile-menu.mjs` — before: 42 failures; after: all pass.
For each of 360×780, 390×844, 412×915 (`en` + `es`, touch emulation) and
960×800 (floating panel): panel inside viewport, `#mega-on-demand` /
`#mega-open-source` fully visible and uncovered, Contact / EN-ES / GitHub /
status pill reachable by scrolling the menu, no horizontal page scroll.

Desktop regression at 1280 and 1440: two-column menu identical (hover
open, Enter open, Escape close, panel inside viewport).

Screenshots: `before-*.png`, `after-*.png` in this folder.

Lighthouse mobile on `/` (lighthouse 13.6.0, `lighthouse-mobile.json`):
performance 95 · accessibility 98 · best-practices 96 · SEO 100.
