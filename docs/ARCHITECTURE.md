# Architecture

This document describes the current application shape in the repository. It should track implementation as it exists today, not an aspirational target.

## Boot Flow

The application boot path is:

`src/main.tsx` -> `src/App.tsx`

Current responsibilities in that path:

- `src/main.tsx` initializes global styles, configures Sentry, conditionally starts MSW in local development, mounts React, and wraps the app with `AppErrorBoundary`, `BrowserRouter`, and `AppProviders`.
- `src/App.tsx` renders the global shell and installs the top-level React Router route tree.

## Provider Stack

The provider composition is defined centrally in `src/providers/AppProviders.tsx`.

Current order:

1. `ThemeProvider`
2. `EnvProvider`
3. `NotifyProvider`
4. `ReactQueryProvider`
5. `AuthProvider`
6. `AccountsProvider`
7. `FetchOldProvider`
8. `FetchProvider`

This ordering matters because data fetching, auth state, notifications, and environment configuration are wired globally rather than per feature.

## Routing Model

Routing is composed in `src/routes/`:

- `DashboardRoutes.tsx` contains authenticated dashboard routes under `AuthGuard`
- `AuthRoutes.tsx` contains guest/authentication routes under `GuestGuard`
- `elements.tsx` centralizes lazy route imports behind a shared `Loadable` wrapper with `Suspense`

Route paths are assembled from `src/libs/routes/`, with one file per domain. Feature flags and deployment-specific behavior are enforced in the route tree through guards such as `FeatureGuard` and `SelfHostedGuard`.

## Codebase Layering

The main top-level code organization is:

- `src/pages/`: route-level page entrypoints and route containers
- `src/features/`: domain-specific feature code, often with co-located API hooks, components, types, and tests
- `src/components/`: shared UI, layout, guard, form, and filter building blocks
- `src/context/`: application-wide providers and context state
- `src/api/`: shared fetch providers and API concerns that are not owned by a single feature
- `src/libs/`: shared route builders (`src/libs/routes/`), page parameter utilities (`src/libs/pageParamsManager/`), and other cross-cutting non-UI helpers
- `src/hooks/`: reusable hooks, currently a mix of app-wide hooks and some domain-owned hooks
- `src/tests/`: shared test setup, mocks, and browser/test utilities
- `e2e/`: Playwright end-to-end coverage

In practice:

- `pages` own route composition and page-level containers
- `features` own domain behavior
- `components` hold reusable parts that should not belong to one domain

### Current Hook Placement

`src/hooks/` is not purely cross-cutting today.

It currently contains:

- app-wide hooks such as auth, env, side-panel, fetch, notifications, selection, and page-parameter helpers
- domain-oriented hooks such as `useRoles`, `useUsers`, `useAdministrators`, and `useReports`

That mixed state is the current implementation reality. Directional placement rules for new code belong in `FRONTEND.md`, not here.

## Domain Shape

The repository is feature-heavy and route-driven. `src/features/` and `src/pages/dashboard/` are both organized around product domains. The feature surface is broad — read `src/features/` directly to see the current domain list.

When making a change:

- start from the route entrypoint if the task is page or navigation oriented
- start from the feature directory if the task is domain behavior oriented
- use shared components only when the abstraction is truly cross-domain

## Operational Notes

- Environment-driven behavior is configured through Vite environment variables exposed in `src/constants.ts`.
- The app supports both SaaS and self-hosted behavior, and some routes or features are guarded accordingly.
- Testing is split between Vitest for component/unit coverage and Playwright for end-to-end route flows.
