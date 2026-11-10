# tools/mockups — showcase-image generator

Turns raw captures into product images composed on the films' stage
(64 px accent grid + vignette, `FrameBrackets`, glass panels, mono
kickers, chips, `REAL APP · LIVE RUN` browser chrome — same look as the
Remotion films, see `video-studio/src/ragsystem/RealFrame.tsx`).

## Usage

```bash
npm run mockups -- <slug>            # all jobs for a project
npm run mockups -- <slug> --job n   # one job only
```

Reads `tools/mockups/configs/<slug>.json`, renders the matching HTML
template in headless Chromium at `deviceScaleFactor: 2`, writes WebP to
`public/projects/<slug>/`. Output is deterministic (same config +
same assets -> same bytes).

## Config format

```json
{ "jobs": [ {
    "name": "feature-3",                 // label for logs / --job
    "template": "feature-browser",       // templates/<name>.html
    "size": [1600, 900],                 // render size, logical px
    "out": "feature-3.webp",             // file name in public/projects/<slug>/
    "variants": [1600, 960, 480],        // optional -> <stem>-<w>.webp each
    "quality": 85,                       // optional WebP quality
    "params": { "...": "template params" }
} ] }
```

Image params may be paths relative to the repo root or absolute paths;
they are resolved to `file://` URLs automatically.

## Templates

| template | what it does |
|---|---|
| `terminal` | hand-built terminal pane (JB Mono, key/string/number colors, `hl` highlighted lines) inside the film chrome. Never an OS-console capture. `params: {lines:[{t,cls,hl}] \| text, winWidth, tag, url, kicker}` |
| `feature-browser` | floating real-app window on the stage: image + crop + `highlights` (rect/label chips/scrim). `params: {image, imgSize, crop, winWidth, tag, url, highlights, kicker, chips, tilt}` |
| `detail-zoom` | dimmed full capture + magnified crop panel joined by connector lines. `params: {image, imgSize, crop, zoomPos, zoomW, label, tag, bgScale}` |
| `contain` | whole capture fitted in frame — never cropped. `params: {image, imgSize, pad, chrome, tag, kicker, chips}` |
| `hero-trio` | central window + two flanking tilted windows, halo. `params: {center,left,right: {image,imgSize,crop,tag}, centerWidth, sideWidth, kicker, chips}` |
| `card-thumb` | 16:10 card/mega-menu art (cover image or oversized chrome). `params: {image,imgSize,crop,chrome,winWidth,kicker}` |
| `og-card` | 1200×630 social card: subject + title/tagline/brand. `params: {image,imgSize,crop,title,tagline,brand,kicker}` |
| `video-poster` | 1920×1080 still + play button. `params: {image,imgSize,title,tagline}` |
| `architecture` | JSON graph -> SVG diagram: `{nodes:[{id,label,sub,type,x,y,w,h}],edges:[{from,to,label,kind,dash}],unit,legend,kicker}` — `type` ∈ `model/code/human/danger/warn`, `kind:"gate"` = red hard-gate edge |

## Conventions

- Feature slots are 1600×900; cards 800×500; heroes 1600×1000;
  posters 1920×1080; OG 1200×630.
- Anything claiming "this is the product" must wrap a REAL capture
  (`feature-browser`, `contain`, `detail-zoom`, `terminal`). Film stills
  are illustrations only.
- Keep every WebP ≤ 250 KB (≤ 400 KB for 1600 px); check `ls -la`.
