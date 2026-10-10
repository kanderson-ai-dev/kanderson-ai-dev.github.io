# kaarstenanderson.com

Personal portfolio website — Vite + React + TypeScript, deployed to GitHub
Pages with GitHub Actions and served at https://kaarstenanderson.com.

## Develop

```bash
npm ci
npm run dev        # local dev server
npm run build      # typecheck + production build into dist/
```

## Deploy

Every push to `main` builds the site and publishes `dist/` to GitHub Pages
(Settings → Pages → Source: GitHub Actions). The custom domain lives in
`public/CNAME`.
