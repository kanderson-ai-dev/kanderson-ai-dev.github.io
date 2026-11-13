# QA — In-page anchor scrolling (Part C)

Date: 2026-11 (PLAN_fix_v3 Part C). Scope: every in-page anchor — navbar
About/Contact, hero CTAs, on-demand teaser, contact-band "See the work",
project-page sub-nav, `/projects` cross-route links, mega-menu group
headings, deep links — on `/` and `/es`, at 1440×900 and 390×844.

## Root cause (C2, confirmed)

`content-visibility: auto` lays off-screen `.cv` sections out at their
`contain-intrinsic-size: auto 600px` placeholder. The browser's native
anchor jump — and React's `scrollIntoView` — computed the target offset
against placeholders, and as sections rendered mid-scroll they grew and
pushed the target down. Targets also landed under the sticky navbar (no
`scroll-margin-top`), and `/projects` had no `#about`/`#contact` at all
(dead links). The burger/mega-menu only closed on `pathname` change, so
hash-only navigation left them open.

## Before (C1 reproduction, pre-fix)

Fresh load of `/`, click navbar About, measure after the scroll settles:

| Viewport | `#about` top at click time | Scroll after 1st click | Real `#about` top after the scroll | Missed by |
|---|---|---|---|---|
| 1440×900 | 2872 px | 2872 px | 4077 px | **1205 px** |
| 390×844 | 3196 px | 3196 px | 5363 px | **2167 px** |

`node scripts/qa-anchors.mjs` on the pre-fix code: **72 failures**
(36 cases × 2 viewports; every case failed at least once) — landing anchors
hundreds-to-thousands of px short, sub-nav/hero targets hidden behind the
sticky chrome at `top: 0`, `/projects` About/Contact dead, burger open.

## Fix

- `src/hooks/useHashScroll.ts` — `scrollToId(id)`: sets `html.cv-off`
  (forces every `.cv` section to real height), flushes layout on the next
  frame, `scrollIntoView` (`smooth`, or `auto` under
  `prefers-reduced-motion`), **holds `cv-off` for the whole scroll**
  (releasing mid-flight collapses the document under the moving target —
  measured: doc height drops ~48–80 px and targets drift ~32 px), releases
  on `scrollend` / a still-scrollY fallback, waits for the post-release
  re-skip collapse to settle, then applies one instant `scrollBy`
  correction and moves focus to the target (`tabindex="-1"`,
  `focus({ preventScroll: true })`). Refcounted so overlapping scrolls
  never strip `cv-off` early.
- `src/components/HashLink.tsx` — router `Link` that also calls
  `scrollToId` directly when the URL already points at the same hash
  (second click on the same anchor still scrolls).
- `ScrollManager` (`src/App.tsx`) — routes every hash through
  `scrollToId`; sets `<html lang>`/`document.title` even on hash
  navigation (C2 item 6).
- `scroll-margin-top` on every anchor target (`pages.module.css`,
  `:global(:where(#…))` — bare `#id` selectors get hashed by CSS Modules):
  `nav-h + 16px` on landing/projects targets, `nav-h + --subnav-h + 16px`
  on project-page sections (`--subnav-h: 44px` in `tokens.css`).
- All raw `<a href="#…">` replaced: navbar About/Contact (cross-route via
  `l('/') + '#about'`; Contact is local `#contact` where a `ContactBand`
  exists, `l('/') + '#contact'` on `/projects`), hero CTAs, on-demand
  teaser, contact-band button, project-page CTAs and sub-nav links,
  mega-menu group headings + evaluation link.
- Burger and mega-menu now close on every nav-link click, not only on
  `pathname` change.
- `content-visibility: auto` kept for normal scrolling — `cv-off` exists
  only for the duration of a controlled scroll.

## After (post-fix run)

`node scripts/qa-anchors.mjs` — **all cases pass**, 0 failures:

| Case | 1440×900 | 390×844 |
|---|---|---|
| `/` + `/es` navbar About / Contact | lands at `nav-h + 16px` | lands + burger closed |
| `/` + `/es` hero "Get in touch" → `#contact` | lands (page-bottom clamp OK) | lands |
| `/` + `/es` on-demand teaser → `#on-demand` | lands | lands |
| `/` + `/es` contact band "See the work" → `#work` | lands | lands |
| `/` + `/es` deep link `#about` on load | lands | lands |
| `/` + `/es` project sub-nav ×5 | lands at `nav-h + subnav-h + 16px` | lands |
| `/projects` navbar About / Contact (cross-route) | navigates to `/#…` and lands | navigates + burger closed |
| mega-menu "On demand" / "Open source" headings | navigates to `/projects#…` and lands | lands + burger closed |

Note on `#contact`: it is the last section before the footer, so on all
viewports the scroll clamps at the page bottom with the section fully in
view rather than at the exact margin — the check asserts visibility in
that case.

## Manual / emulation checks

- `prefers-reduced-motion: reduce` (Playwright emulation): instant jump —
  `scrollY` 0 → 3997 in one step, `#about` lands at 80 px, focus on
  `#about`.
- Keyboard only (Tab to About, Enter): lands at 80 px,
  `document.activeElement` is `#about` (`tabindex="-1"`).
- Forced-layout cost: `cv-off` + full layout flush on the landing at 4×
  CPU throttle (mobile) = **33.7 ms** < ~50 ms budget → un-skipping all
  sections is fine; no need to restrict to sections before the target.
- Sub-nav scroll-spy keeps working: after a sub-nav click the
  IntersectionObserver marks the reached section active (observed in QA
  runs — subnav `active` class follows the landed section).

## Lighthouse (mobile, `/`)

| Category | Score | Budget |
|---|---|---|
| Performance | **94** | ≥ 90 |
| Accessibility | **98** | ≥ 95 |
| SEO | **100** | ≥ 95 |

## Rerun

```bash
npm run preview
node scripts/qa-anchors.mjs
```
