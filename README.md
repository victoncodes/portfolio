# Student Budget Tracker PWA – Monorepo

A Progressive Web App with a Next.js frontend and an Express + Prisma backend.

## What to install (on your computer)
- Node.js >= 18.18 (`https://nodejs.org`)
- Git (`https://git-scm.com`)
- Docker Desktop (`https://www.docker.com`) – optional, for running PostgreSQL locally
- Code editor (VS Code recommended) + extensions: ESLint, Prettier, Tailwind CSS IntelliSense

## Folder structure
```
/apps
  /backend   # Express API (TypeScript, Prisma)
  /frontend  # Next.js PWA (TypeScript, Tailwind, Framer Motion)
/packages
  /tsconfig  # shared tsconfig base
```

## Environment files
- Backend: `apps/backend/.env` (copy from `.env.example`)
- Frontend: `apps/frontend/.env` (copy from `.env.example`)

## Setup & run (step-by-step)
Run all commands from the project root directory.

1) Copy env files
```
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

2) Start PostgreSQL (optional; needed for Postgres dev)
```
docker compose up -d
```
If you don’t have Docker, see "SQLite fallback" below.

3) Install dependencies (monorepo workspaces)
```
npm install
```

4) Prepare the database
- Using Postgres (Docker running):
```
npm run -w @app/backend prisma:migrate -- --name init
npm run -w @app/backend prisma:seed
```
- SQLite fallback (no Docker):
  - Edit `apps/backend/prisma/schema.prisma`: set `provider = "sqlite"`
  - Edit/create `apps/backend/.env` with:
```
DATABASE_URL="file:./dev.db"
PORT=4000
JWT_SECRET="dev-secret"
REFRESH_TOKEN_SECRET="dev-refresh"
NODE_ENV=development
```
  - Then run the same migrate/seed commands above.

5) Run development servers (in two terminals)
- API (backend):
```
npm run -w @app/backend dev
```
- Web (frontend):
```
npm run -w @app/frontend dev
```

URLs:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## Everyday commands
- Generate Prisma client: `npm run -w @app/backend prisma:generate`
- Apply DB migrations: `npm run -w @app/backend prisma:migrate -- --name <name>`
- Seed DB: `npm run -w @app/backend prisma:seed`
- Lint/format: `npm run lint` / `npm run format`

## PWA extras
- App shortcuts and offline fallback are enabled via `next-pwa`.
- Manifest: `apps/frontend/public/manifest.json`
- Offline fallback page: `apps/frontend/public/offline.html`

## Troubleshooting
- If Docker isn’t installed, use the SQLite fallback section above.
- If ports are in use, change `PORT` in `apps/backend/.env` and restart.
- If frontend can’t reach the API, check `NEXT_PUBLIC_API_BASE_URL` in `apps/frontend/.env`. 
