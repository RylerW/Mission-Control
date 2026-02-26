# Mission Control Dashboard (Scaffold)

React + TypeScript + Tailwind scaffold for a modular Mission Control UI.

## Architecture

- `src/layout`: shell components (`Sidebar`, `Topbar`, `AppShell`).
- `src/components`: reusable UI building blocks (`Card`, `SectionHeader`, `StatusBadge`, `KpiTile`, `DataTable`).
- `src/features/*`: one feature module per section.
- `src/types/domain.ts`: shared domain interfaces (`Task`, `ContentItem`, `SecurityIssue`, `Agent`, `TokenUsageSummary`, `Metric`).
- `src/services/mockApi.ts`: asynchronous mocked data services for future API replacement.
- `src/config/navigation.ts`: configuration-driven route navigation metadata.

## Extending

- Replace methods in `src/services/mockApi.ts` with HTTP calls to n8n, agent registry, SIEM/RMM, and token logs.
- Keep feature pages focused on display and state; data shape is centralized in `src/types/domain.ts`.
