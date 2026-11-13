# QA — Spanish content (Part B, D-I18N1)

Date: 2026-11 (PLAN_fix_v3 Part B). Scope: every `/es/...` route — landing,
projects index, and the five published project pages — at desktop (1440 px)
and mobile (375 px), plus prerendered-head inspection.

## What was checked

| Check | Method | Result |
| --- | --- | --- |
| `<html lang="es">` on every `/es` route | `scripts/qa-spanish.mjs` | PASS (7/7 × 2 viewports) |
| Spanish `<title>` per route (site/projects/product names) | prerendered `dist/es/**/index.html` | PASS |
| Spanish meta `description` (dict / project tagline) | same | PASS |
| `og:title`, `og:description`, `og:url` localized | same | PASS |
| `og:locale` `es_ES` + `og:locale:alternate` `en_US` | same | PASS |
| Canonical + `hreflang` en/es/x-default triplet | same | PASS |
| Sitemap `xhtml:link` alternates | `dist/sitemap.xml` | PASS |
| Spanish chrome: nav, subnav, section titles, CTAs | `qa-spanish` expected-strings | PASS |
| No English-only UI strings in body text | `qa-spanish` leak scan (17 phrases) | PASS — zero leaks |
| Spanish image `alt` resolved on project pages | `qa-spanish` DOM scan | PASS |
| Prev/next project nav localized | `qa-spanish` | PASS |
| Client-side `document.title` + `<html lang>` on navigation | `titleForPath` in `src/i18n` (used by `ScrollManager`) | PASS |
| Lighthouse mobile `/es` | `npx lighthouse` | accessibility **98**, SEO **100** |

## Evidence

- `docs/qa/spanish/*.png` — screenshots, 7 routes × 2 viewports.
- `docs/qa/spanish/lighthouse-es.json` — full Lighthouse report.
- `scripts/qa-spanish.mjs` — rerunnable: `npm run preview` +
  `node scripts/qa-spanish.mjs --shots`.

## Content notes

- Product names stay English (`Guardrailed Agentic AI API`, …); all prose,
  alt texts and architecture captions translated.
- Numbers, `results[].value`/`kind`, baselines and image sources identical
  across languages — enforced by `validate-content.ts` + registry tests
  (including a negative bilingual check).
- Confidentiality scan for the on-demand project runs over the Spanish copy
  too — clean.
- Tone: neutral Spanish, informal "tú"; technical terms stay English
  (guardrail, prompt, scorecard, LangGraph, MCP, CI).

## Pending

- **Native-speaker review of the Spanish copy is still required** — the
  translations were authored in-repo, not reviewed by a human speaker.
