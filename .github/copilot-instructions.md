# Landscape UI – Copilot Instructions

## Purpose

This file defines project context, build conventions, and review constraints for **GitHub Copilot** and related AI coding assistants.  
Copilot must align with these patterns when proposing or reviewing code.

---

## Repository Overview

**Landscape UI** is Canonical’s next-generation web interface for managing Ubuntu systems.  
Frontend only — communicates with Landscape API through authenticated REST endpoints.

**Stack**

- React 19 + TypeScript (strict mode)
- Vite 7 (build/dev server)
- PNPM for dependency management
- React Query (@tanstack/react-query) for server state
- React Router v7 for routing
- Formik + Yup for forms
- Axios (via FetchProvider)
- Vanilla Framework + @canonical/react-components for styling
- Vitest / Playwright / MSW / ESLint for quality control

---

## Repository Structure

```
src/
 ├─ app/                 # Entry point, global layout, routing
 ├─ features/<name>/     # Feature folders (API + components + tests)
 │   ├─ api/             # React Query hooks
 │   ├─ components/      # Feature components
 │   ├─ types/           # Local types/interfaces
 │   ├─ constants.ts
 │   ├─ helpers.ts
 │   └─ index.ts
 ├─ context/             # Global React contexts
 ├─ libs/                # Shared logic (routes, tables, utils)
 ├─ components/          # Shared UI elements
 ├─ hooks/               # Cross-feature custom hooks
 ├─ tests/               # Test utilities and mocks
 └─ styles/              # SCSS modules and Vanilla overrides
```

**Alias root:** `@/` → `src/`

---

## Build and Run

```bash
pnpm install --frozen-lockfile
cp .env.local.example .env.local
pnpm dev       # Vite dev server (5173)
pnpm build     # Lint + typecheck + Vite build
pnpm vitest    # Unit/integration tests
pnpm test      # Playwright E2E
```

---

## Architectural Invariants

Copilot must **not** propose changes that violate these rules.

| Area              | Rule                                                                     |
| ----------------- | ------------------------------------------------------------------------ |
| **Imports**       | Use `@/` alias only. No deep imports into `features/*/*`.                |
| **API calls**     | Must go through React Query hooks in each feature’s `api/`.              |
| **State**         | Local state: React hooks. Server state: React Query. No Redux/MobX.      |
| **Forms**         | Always use Formik + Yup.                                                 |
| **Styling**       | Vanilla Framework classes for layout; component styles use SCSS modules. |
| **Testing**       | Use Vitest + React Testing Library. Mock network via MSW.                |
| **Auth**          | Only `useAuth()` / `FetchProvider` manage authentication.                |
| **Routing**       | Routes defined in `src/libs/routes`. Type-safe generation only.          |
| **Feature Flags** | Access via `useAuth().isFeatureEnabled(key)`.                            |
| **Build Output**  | Generated `dist/` is gitignored. Never edit manually.                    |

---

## Copilot Behavior Rules

### 1. Code Generation

Copilot should:

- Use **existing hooks/components** before suggesting new ones.
- Prefer **composition** over duplication.
- Propose typed React Query hooks that adapt the raw API response into a simple, usable object (e.g., return `{ scripts, count, isLoading }` instead of the raw data object), matching the example pattern.
- Generate **async/await** API calls wrapped in `try/catch`.
- Always infer `type` imports (`import type`) for TS interfaces.
- Respect ESLint and Prettier configs from root.

### 2. Review Feedback Expectations

When analyzing PRs, Copilot should:

- Check for architectural invariant violations above.
- Warn if new code bypasses providers (`useAuth`, `FetchProvider`, `NotifyProvider`).
- Verify consistent naming (`PascalCase` for components, `camelCase` for helpers).
- Flag untested UI or logic.
- Ensure proper semantic HTML (`<button>`, `<label>`, `<main>`, etc.).
- Point out missing `aria-` or keyboard accessibility attributes.
- Validate keyboard navigation support.
- Check that color contrast follows Vanilla Framework tokens.
- Reject inline styling or direct DOM manipulation.
- Require cleanup of temporary debugging (console, TODOs, etc.).
- Ensure imports are grouped logically.

### 3. Commit and PR Guidance

Copilot should encourage:

- Focused commits with clear, imperative messages.
- Matching unit tests per feature change.
- Updates to this file when workflow conventions change.
- Descriptive PR titles and summaries.

---

## Common Patterns

### Example: Data Fetching Pattern

```tsx
// src/features/scripts/api/useGetScripts.ts
import type { Script } from "@/features/scripts";
import useFetch from "@/hooks/useFetch";
import usePageParams from "@/hooks/usePageParams";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { PaginatedGetHookParams } from "@/types/api/PaginatedGetHookParams";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

const DEFAULT_CONFIG: PaginatedGetHookParams = {
  listenToUrlParams: true,
};

interface GetScriptsParams {
  limit?: number;
  offset?: number;
  parent_access_group?: string;
  search?: string;
  script_type: string;
}

const getStatus = (status: string) => {
  if (status === "all") {
    return "v2";
  }

  if (status) {
    return status;
  }

  return "active";
};

export const useGetScripts = (
  config?: PaginatedGetHookParams,
  params?: GetScriptsParams,
  options: Omit<
    UseQueryOptions<
      AxiosResponse<ApiPaginatedResponse<Script>>,
      AxiosError<ApiError>
    >,
    "queryKey" | "queryFn"
  > = {},
) => {
  const authFetch = useFetch();
  const { currentPage, pageSize, status, search } = usePageParams();

  config = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  const paramsWithPagination = {
    ...(config.listenToUrlParams
      ? {
          limit: pageSize,
          offset: (currentPage - 1) * pageSize,
          search: search ?? undefined,
          script_type: getStatus(status),
        }
      : params),
  };

  const { data, isLoading } = useQuery<
    AxiosResponse<ApiPaginatedResponse<Script>>,
    AxiosError<ApiError>
  >({
    queryKey: ["scripts", paramsWithPagination, config],
    queryFn: async () =>
      authFetch.get("scripts", { params: paramsWithPagination }),
    ...options,
  });

  return {
    scripts: data?.data.results ?? [],
    scriptsCount: data?.data.count ?? 0,
    isScriptsLoading: isLoading,
  };
};
```

### Example: Form Handling Pattern (Formik + Canonical Components)

```tsx
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import { Form, Input, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { INITIAL_VALUES, VALIDATION_SCHEMA } from "./constants";
import type { FormProps } from "./types";
import { getFormikError } from "@/utils/formikErrors";

const NewAccessGroupForm: FC = () => {
  const { createAccessGroupQuery, getAccessGroupQuery } = useRoles();
  const { mutateAsync } = createAccessGroupQuery;
  const { closeSidePanel } = useSidePanel();
  const { data: accessGroupsResponse, isLoading: isGettingAccessGroups } =
    getAccessGroupQuery();

  const accessGroupsOptionsResults = (accessGroupsResponse?.data ?? []).map(
    (accessGroup) => ({
      label: accessGroup.title,
      value: accessGroup.name,
    }),
  );

  const debug = useDebug();
  const formik = useFormik<FormProps>({
    initialValues: INITIAL_VALUES,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: async (values) => {
      try {
        await mutateAsync(values);
        closeSidePanel();
      } catch (error) {
        debug(error);
      }
    },
  });

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <Input
        type="text"
        label="Title"
        required
        error={getFormikError(formik, "title")}
        {...formik.getFieldProps("title")}
      />
      <Select
        required
        label="Parent"
        disabled={isGettingAccessGroups}
        options={accessGroupsOptionsResults}
        error={getFormikError(formik, "parent")}
        {...formik.getFieldProps("parent")}
      />
      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText="Add access group"
      />
    </Form>
  );
};

export default NewAccessGroupForm;
```

### Example: Error Handling Pattern (useDebug)

- All try/catch blocks should use the useDebug hook to handle errors. This hook centralizes error parsing, developer-only console logging, and user-facing notifications.

```ts
// src/hooks/useDebug.ts (Simplified for instruction)
import { IS_DEV_ENV } from "@/constants";
import type { ApiError } from "@/types/api/ApiError";
import { isAxiosError } from "axios";
import useNotify from "./useNotify";

export default function useDebug() {
  const { notify } = useNotify();

  return (error: unknown) => {
    let errorMessage = "Unknown error";

    if (isAxiosError<ApiError>(error) && error.response) {
      errorMessage = error.response.data.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    // Always show a notification to the user
    notify.error({ message: errorMessage, error });

    // Only log the full error in development
    if (IS_DEV_ENV) {
      console.error("An error occurred:", error);
    }
  };
}
```

Usage in Forms:

```tsx
// In a Formik onSubmit:
  onSubmit: async (values) => {
    try {
      await mutateAsync(values);
      closeSidePanel();
    } catch (error) {
      // Correct: debug() handles everything.
      debug(error);
    }
  },
```

### Conditional Routing

```tsx
<Route
  path={ROUTES.instances()}
  element={
    <AuthRoute>
      <InstancesPage />
    </AuthRoute>
  }
/>
```

---

## Testing Standards

- **Unit/integration:** Vitest (`*.test.tsx`) alongside source files
- **Mocks:** MSW handlers in `src/tests/mocks/`
- **E2E:** Playwright (`pnpm test`, `pnpm test:ui`)
- **Coverage threshold:** 85% line coverage minimum
- **Snapshot tests:** Avoid unless required for layout regressions

---

## CI/CD Workflows (Authoritative)

The repo uses multiple workflows. Copilot must follow these triggers, job orders, and tool versions.

### Lint & Format (`.github/workflows/lint.yml`)

**Trigger:** PR → `dev`  
**Jobs:**

- **ESLint:** Diff-only TS/TSX (added/modified).
- **Prettier:** Diff-only JS/TS/TSX/JSON/MD/HTML.
- **Stylelint:** Diff-only SCSS.  
  **Common:**
- Node `22.15.1`, pnpm `10`, `pnpm install --frozen-lockfile`.
- Skip job if no matching changed files.

### Tests + TICS on PRs (`.github/workflows/run-tests-and-tics.yml`)

**Trigger:** PR → `dev`  
**Jobs:**

- **e2e-tests** (self-hosted runner, Playwright container): build → install browsers → run `common` and `self-hosted` projects → upload report.
- **unit-tests** (self-hosted): `vitest run --coverage` → upload coverage artifact to `reports/`.
- **tics-report** (Ubuntu hosted): downloads `vitest-report` → runs TICS action with `installTics: true`.  
  **Env (examples):** `VITE_API_URL`, `VITE_API_URL_OLD`, `VITE_ROOT_PATH=/new_dashboard/`, `VITE_SELF_HOSTED_ENV=true`.  
  **Constraints:** keep memory flag `NODE_OPTIONS='--max_old_space_size=4096'`.

### Tests on Push (`.github/workflows/run-tests.yml`)

**Trigger:** push → `dev`  
**Jobs:**

- **eslint-check:** `pnpm run lint:ci`.
- **e2e-tests:** needs eslint; same pattern as PR e2e.
- **unit-tests:** needs eslint; same pattern as PR unit tests; uploads `coverage-report`.

### PPA Build Commit (`.github/workflows/ppa-build.yml`)

**Trigger:** push → `dev` **or** successful `Release` workflow (`workflow_run`)  
**Jobs:**

- **build:** checks out `dev` (or `main` when from `workflow_run`), builds with env:
  - `VITE_API_URL=/api/v2/`, `VITE_API_URL_OLD=/api/`, `VITE_ROOT_PATH=/new_dashboard/`
  - archives `dist` as artifact.
- **commit:** checks out destination branch (`ppa-build-dev` or `ppa-build`) → replaces tree with built `dist/` → auto-commits.  
  **Rule:** Do not change branch selection logic or artifact dance.

### Release (`.github/workflows/release.yml`)

**Trigger:** push → `main`  
**Job:** **semantic-release** with `GITHUB_TOKEN` and full history (`fetch-depth: 0`).  
**Rule:** Only `main` publishes tags and releases. Do not introduce prerelease steps elsewhere.

### Security Scan & SBOM (`.github/workflows/security.yml`)

**Triggers:** manual, weekly cron, PRs touching `Dockerfile` or this workflow  
**Jobs:**

- **build-image:** builds and pushes OCI image to GHCR, saves as `image.tar` artifact.
- **scan-and-report** (self-hosted): runs Canonical secscan client on `image.tar`.
  - Exit code handling: `0` = clean; `100–199` = CVEs found → fail; other non-zero = scan failure → fail.
  - On failure: open GitHub issue with scan output.
- **generate-and-submit-sbom:** Trivy SBOM (`spdx-json`) and submit to GitHub Dependency Graph; upload artifact.  
  **Rule:** Preserve exit-code semantics and issue creation logic.

### Full TICS (Manual) (`.github/workflows/tics-full.yml`)

**Trigger:** workflow_dispatch  
**Jobs:**

- **unit-tests:** same as PR unit tests; uploads `vitest-report`.
- **tics-report:** self-hosted TIOBE runner with `mode: qserver`.

---

### CI Tooling Contracts

- **Node:** `22.15.1`
- **pnpm:** `10`
- **Install:** `pnpm install --frozen-lockfile` only
- **Build:** `pnpm run build` before Playwright runs
- **Playwright:** install browsers with `pnpm exec playwright install --with-deps` inside the container job
- **Caching:** use `actions/setup-node@v4` cache `"pnpm"`
- **Artifacts:** preserve report paths as defined (`playwright-report`, `reports/`, `dist`)

### Copilot MUST NOT

- Suggest `npm`/`yarn` commands or change Node/pnpm versions.
- Bypass diff-filter logic in `lint.yml`.
- Move Playwright browser install outside the e2e job.
- Change branch logic in PPA build or release triggers.
- Alter TICS exit-code handling or security scan failure behavior.

## Update Policy

Whenever code or CI steps change:

1. Update this file.
2. Validate build and test steps.
3. Ensure Copilot-suggested patterns remain valid.

---

## Summary Rule for Copilot

> Follow the architecture, type safety, and feature isolation principles defined here.  
> Suggest improvements only if they comply with this document’s invariants.
