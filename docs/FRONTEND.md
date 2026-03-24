# Frontend

This document captures the frontend implementation conventions that new code should follow in this repository. `ARCHITECTURE.md` describes the current system shape; this file is the prescriptive guide for where new frontend code should go and how it should be organized.

## Structure

The codebase separates concerns by responsibility:

- `src/pages/` contains route-level pages and page containers
- `src/features/` contains domain-owned behavior and feature-specific UI
- `src/components/` contains shared components used across multiple domains
- `src/context/`, `src/hooks/`, `src/libs/`, and `src/api/` provide cross-cutting infrastructure

Prefer these boundaries when adding code:

- put route entrypoints and page assembly in `pages`
- put domain logic and domain-specific UI in `features`
- put broadly reusable UI in `components`

## Component Folder Structure

Prefer directory-based component structure over flat single-file exports once a component has meaningful internal complexity.

### Default shape

For most non-trivial components, prefer:

- `ComponentName/ComponentName.tsx`
- `ComponentName/ComponentName.test.tsx`
- `ComponentName/ComponentName.module.scss` when needed
- `ComponentName/index.ts`

Add colocated supporting files when the component needs them:

- `constants.ts`
- `helpers.ts`
- `types.ts`

### Nested `components/` folders

Use an internal `components/` subfolder when a parent component owns tightly related child components that are not intended to become broad shared primitives.

Current examples of this pattern already exist in:

- `src/components/form/CronSchedule/`
- `src/components/form/ScheduleBlock/`
- `src/components/layout/TablePagination/`

Use this structure when:

- the parent component has multiple child views or controls
- the child pieces are tightly coupled to the parent workflow
- extracting those pieces into top-level shared components would make ownership less clear

Do not create nested `components/` folders just to add ceremony around a simple component.

### Types files

For new implementation-local component types, prefer colocated `types.ts`.

Use a local types file when:

- the props or supporting types are large enough to distract from the component
- the same local types are shared across the component, helpers, and tests
- the types belong to the component implementation rather than to the whole feature domain

The repo currently contains a mix of `types.ts` and older `types.d.ts` files. Treat `types.ts` as the preferred direction for new work unless there is a specific reason to use declaration-file behavior.

### Flat legacy structures

Some shared components still use flatter or older folder layouts.

That is current repo reality, but not the preferred direction for new work. When touching those components meaningfully:

- prefer moving them toward the standard folder structure
- colocate tests, styles, helpers, constants, and local types
- only do the migration opportunistically when it keeps the change readable and low-risk

Do not create a large mechanical reorganization unless the work is being done under a dedicated plan.

## Code Placement Direction

For new code, prefer feature ownership over central dumping grounds.

### Hooks

- Put domain-specific hooks inside the owning feature.
- Reserve `src/hooks/` for hooks that are genuinely cross-cutting across multiple domains.
- If a hook mostly exists to serve one feature, it should live with that feature even if it is reused by multiple components inside that feature.

Examples of hooks that should generally stay feature-owned:

- data-fetching hooks for one domain
- mutation hooks for one domain
- feature-specific derived-state hooks
- hooks that encode role, package, repository, or administrator workflows

Examples of hooks that belong in `src/hooks/`:

- auth and account access hooks
- env hooks
- page-parameter and URL-state hooks
- side-panel or notification hooks
- generic selection, sort, or shared interaction hooks

Because the current repo still contains some domain hooks under `src/hooks/`, treat this as the direction for new code and for opportunistic migrations rather than as a statement that the migration is already complete.

### API And Data Access

- Put feature-specific data access close to the owning feature when the API shape is domain-specific.
- Reserve `src/api/` for shared fetch providers and app-wide API infrastructure.
- Avoid growing large central hooks or API modules that mix unrelated domains.

### Types

- Keep feature-owned types close to the feature when they are not broadly shared.
- Keep app-wide or reused domain contracts in shared type locations only when they are truly consumed across domains.

## Routing and Loading

- Route elements are lazy-loaded through `src/routes/elements.tsx`.
- New route-level pages should follow the same pattern so loading behavior stays consistent.
- Dashboard and auth routes are declared separately and wrapped in the appropriate guards.

## TypeScript and Imports

- TypeScript runs in strict mode with `noImplicitAny` and `noUncheckedIndexedAccess`.
- Use the `@/` alias for imports rooted at `src/`.
- ESLint enforces `@typescript-eslint/consistent-type-imports`; prefer `import type` where applicable.
- ESLint restricts deep imports matching `@/features/*/*`; prefer feature entrypoints and public surfaces over reaching into internals.
- Test mocks under `src/tests/mocks/` are restricted to test code and the `src/tests/` area.

## Providers and Shared Context

- Global provider composition is documented in `ARCHITECTURE.md`.
- Add a new provider only when the state or service is truly app-wide or needs to be installed high in the tree.
- Prefer feature-local state, hooks, and query composition over adding new global context by default.
- Route guards and environment-aware behavior should stay close to routing and provider boundaries.

## Styling

- Styling is primarily co-located with components using `*.module.scss`.
- The build runs `tcm` against `src/**` for SCSS modules, so CSS module type generation must continue to work.
- Stylelint covers SCSS files in CI, and Prettier checks Markdown and other formatted assets.

## Testing

- Follow [testing/index.md](testing/index.md) for the repository testing contract and [verification/index.md](verification/index.md) for completion criteria.

## Tooling Constraints

Current enforced constraints from repo tooling include:

- ESLint for TypeScript and React correctness
- Prettier checks for Markdown and other formatted files in CI
- Stylelint for SCSS
- typed CSS module generation as part of the build

Before landing frontend changes, verify the change is compatible with:

- `pnpm run lint`
- `pnpm prettier --check`
- relevant Vitest or Playwright coverage for the area being changed
- visual or interaction verification when the change affects UI behavior
