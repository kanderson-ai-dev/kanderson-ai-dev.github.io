# Multi-Agent CRM page — QA record

## Capture setup (nothing written to the product repo)

- Product served from its folder in stub mode: temp data dir, seeded demo data, throwaway demo password set only in that shell, no `.env` (`--no-dotenv`), tracing and model keys empty. Product `git status` was clean afterwards.
- Script: `docs/qa/agentic-crm-capture.mjs`, kept local and not committed (Playwright, 1440x900 @2, tablet 768 @2, phone 390 @3, reduced motion). Raw frames stay in `_raw/agentic-crm/` (never published).

## Capture-time clean-ups

1. White-label wordmark: the product's internal working title -> "Multi-Agent CRM", logo letter "A" -> "M" (DOM text substitution).
2. Hidden by injected CSS/DOM: demo-workspace badge, style-guide nav item and palette entry, the deal page AI Copilot card, the leads-table Email column.
3. Name substitution on every `/api/v1/**` JSON response (web-check failures): four seed company names that matched real companies were mapped to invented names (case-preserving, so domains follow). Replacement names were web-checked (no real company found); a dozen other candidates were rejected because they are real companies.
4. No login screen, user menu, workspace name, e-mail address or toast in any frame.

## Raw capture review (each viewed as an image)

| File | Result |
|---|---|
| 00-dashboard-dark | pass |
| 00-dashboard-tablet-768 | pass |
| 00-dashboard-phone-390 | pass |
| 02-deals-board-dark | pass |
| 10-deal-record-light | pass (copilot card hidden) |
| 11-account-detail-dark | pass |
| 12-leads-dialog-light | first take showed an Email column -> column hidden, retaken, pass |
| 13-deals-phone-390 | pass |
| 14-command-palette-dark | first take listed "Style guide" -> hidden, retaken, pass; not published (optional slot unused) |

## Designed screens (features 2-5)

The product has no agent, proposal, approval or audit screens yet. Features 2-5 use authored HTML screens (agent team, change proposals, approvals inbox, audit chain) rendered inside the running product's real shell (sidebar, header, fonts, tokens), kept local like the capture script. They are mockups, labelled as such in the image alts; replace them with real captures once the product ships those screens.

## Film-derived images

Still rendering below is used only for the film poster, hook and loop poster. Stills rendered with `scripts/render-stills.mjs` from the Remotion compositions (no captions, no brackets): hook, title, team, gate, inbox, chain. `CrmLoop` is 6.0 s, 1280x720, silent (webm 1.1 MB, mp4 0.55 MB). Loop poster at frame 270; frame 0 and the last frame are the same empty world (seamless).

## Checks run

- lint, typecheck, unit tests (38), build (18 prerendered routes, canonical = hreflang self = sitemap loc), `validate:content`: all green.
- `node scripts/qa-spanish.mjs`: 9 routes x 2 viewports OK (CRM and Supply Chain routes added; two stale expectations fixed).
- `docs/qa/agentic-crm-site-qa.mjs` at 375/768/1280/1920, EN and ES: no horizontal overflow, `<html lang>`, one h1, no banned term in rendered text, mailto CTA, no Architecture/Results/Limitations headings, lightbox open/arrow/Escape, EN/ES toggle, mega-menu and index order (CRM first), landing counters.
- Film captions: master 103.37 s; EN and ES SRT have 23 cues each ending at 99.72 s.
- Weights: all page images 921 KB total, largest WebP 86 KB; initial JS 127 KB gzip.

## Not run / pending

- Lighthouse and axe are not installed in this environment; run them before deploy.
- Watch-and-listen review of the film (user).
- Film upload to YouTube and `youtubeId` (user).
