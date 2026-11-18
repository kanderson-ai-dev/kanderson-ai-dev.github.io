# Performance baseline — LCP work (2026-11-18)

Context: Cloudflare Web Analytics (24 h window, 16 visits, ~15 LCP samples)
showed LCP 94% Good / 6% Needs Improvement / 0% Poor on `/`. Sample is too
small to prove a regression; the items below are cheap hardening.

Lighthouse was not run locally (no lab tooling); measurements are
build-output based. Judge the result via Cloudflare RUM after ~100 samples.

## Build output (landing route)

| Metric                          | Before          | After          |
| ------------------------------- | --------------- | -------------- |
| Entry JS (gzip)                 | 127,434 B       | 127,536 B      |
| Entry CSS (gzip)                | 36,312 B        | 7,851 B        |
| CSS raw                         | 84,822 B        | 34,050 B       |
| `@font-face` rules in CSS       | 47 (all subsets) | 11 (8 latin + 3 fallbacks) |
| Image `<link rel="preload">` in head | 2 (duplicate) | 1 (React SSR) |
| Font preloads in head           | 0               | 2 (chakra-700, inter-400 latin woff2) |
| Font files emitted              | 32 (all subsets)| 16 (latin only) |

## Changes applied

- Removed the manual LCP-image preload injected by `scripts/postbuild.mjs`;
  React 19 already hoists one preload for the `<img fetchPriority="high">`
  during SSR, so every prerendered page shipped two identical preloads.
- Switched `@fontsource/*` imports to latin-only subsets (Spanish accents are
  inside the latin subset — verified `ñ á é í ó ú ¿ ¡` coverage is U+00C0–U+00FF).
- Preloaded Chakra Petch 700 latin and Inter 400 latin woff2 in every
  prerendered head (hashed names resolved from `dist/assets` in postbuild).
- Added metric-matched local fallback faces (`Chakra Petch Fallback`,
  `Inter Fallback`, `JetBrains Mono Fallback`) with size-adjust / ascent /
  descent overrides computed from the real font tables, so the `swap` paint
  keeps the same line box (targets the ~2% not-good CLS sliver).
- `Particles`: canvas setup deferred to `requestIdleCallback`; skipped on
  Save-Data. Reduced-motion still paints one static frame.
- `AmbientLoop`: video also skipped on `effectiveType` 2g/3g (poster stays).
- `scripts/check-seo.mjs` now fails the build on duplicate preload hrefs.

## Not done (deferred)

- Route code splitting (step 4): landing JS is 128 KB gzip, within the 200 KB
  budget; revisit only if RUM shows hydration time hurting LCP.
- Responsive `srcset` for the 22 KB hero poster (step 6): low payoff.
- Cloudflare cache rule (step 7): not applied, needs user approval; only
  `/assets/*` (hashed names) would be safe without a purge workflow.

## Verify later

- Cloudflare Web Analytics LCP on `/` after ≥ 100 samples (not the current
  15-sample window). Target ≥ 98% Good.
- Lighthouse mobile when available: LCP ≤ 2.0 s, CLS ≤ 0.02.
