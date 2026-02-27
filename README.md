# Mission Control Dashboard

React + TypeScript + Tailwind frontend with a lightweight Node API backend.

## Run locally

1. Start the backend API:

```bash
npm run dev:api
```

2. Start the frontend (new terminal):

```bash
npm run dev
```

Frontend runs on `http://localhost:5173` and proxies `/api` to `http://localhost:4000`.

## Architecture

- `src/layout`: shell components (`Sidebar`, `Topbar`, `AppShell`)
- `src/components`: reusable UI building blocks (`Card`, `SectionHeader`, `StatusBadge`, `KpiTile`, `DataTable`)
- `src/features/*`: feature modules for each section
- `src/types/domain.ts`: shared domain interfaces
- `src/services/mockApi.ts`: frontend API client (now real HTTP calls)
- `server/index.js`: API routes and HTTP server
- `server/store.js`: in-memory domain state and mutation helpers

## Backend endpoints

- `GET /api/overview`
- `GET /api/tasks`
- `GET /api/content`
- `POST /api/content`
- `GET /api/security`
- `GET /api/agents`
- `POST /api/agents/:id/toggle`
- `POST /api/agents/:id/run`
- `GET /api/tokens`
- `GET /api/business-metrics`

## Integrating your real agents/bots

Replace the in-memory logic in `server/store.js` with calls to your agent registry, n8n workflows, and bot runtimes. Keep the same response shape to avoid frontend changes.
