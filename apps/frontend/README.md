# Frontend (Next.js PWA)

Run locally:
1. Copy env: `cp apps/frontend/.env.example apps/frontend/.env`
2. Install deps at root: `npm install`
3. Start dev server: `npm run -w @app/frontend dev`

Dev: http://localhost:3000

PWA:
- Manifest at `/public/manifest.json`
- Service worker via `next-pwa` (disabled in dev)
- Add icons in `/public/icons`