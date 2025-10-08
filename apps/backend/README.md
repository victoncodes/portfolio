# Backend (Express + Prisma + PostgreSQL)

Run locally (PostgreSQL via Docker):
1. Ensure Docker is installed and running.
2. From repo root: `docker compose up -d`
3. Copy env: `cp apps/backend/.env.example apps/backend/.env`
4. Install deps at root: `npm install`
5. Migrate & seed:
   - `npm run -w @app/backend prisma:migrate -- --name init`
   - `npm run -w @app/backend prisma:seed`
6. Start API: `npm run -w @app/backend dev`

API: http://localhost:4000

Optional SQLite (no Docker):
- Change provider to "sqlite" in `prisma/schema.prisma`.
- Create `.env` with:
```
DATABASE_URL="file:./dev.db"
PORT=4000
JWT_SECRET="dev-secret"
REFRESH_TOKEN_SECRET="dev-refresh"
NODE_ENV=development
```
- Then run generate/migrate/seed/dev as above.

Env vars: `DATABASE_URL`, `PORT`, `JWT_SECRET`, `REFRESH_TOKEN_SECRET`, `NODE_ENV`.
Healthcheck: `GET /health` -> `{ ok: true }`.