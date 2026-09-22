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
        submitButtonLoading={formik.isSubmitting}
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

### Hook Testing Pattern

**Do not create dedicated test files for custom hooks** (e.g., `useCustomHook.test.tsx`). This violates React's rule: _"Hooks can only be called inside of the body of a function component."_

**Instead, test hooks implicitly through component integration tests:**

- **Queries (fetch hooks):** Test in container/page component tests that render the hook's consumer components
- **Mutations (create/edit/delete hooks):** Test through form/action component tests by:
  - Rendering the component that uses the mutation
  - Simulating user interactions (form submission, button clicks)
  - Verifying success/error states and side effects

**Example:** Instead of `usePublicationTargets.test.tsx`, test the hook's methods through:

- `NewPublicationTargetForm.test.tsx` → exercises `createPublicationTargetQuery`
- `EditTargetForm.test.tsx` → exercises `editPublicationTargetQuery`
- `RemoveTargetForm.test.tsx` → exercises `removePublicationTargetQuery` (including error paths)

This pattern ensures hooks are tested in realistic component contexts with all required providers (QueryClientProvider, FetchProvider, etc.) already configured via `renderWithProviders`.

---

## CI/CD Workflows (Authoritative)

The repo uses six workflows. Copilot must follow these triggers, job orders, and tool versions.

### Validate (`.github/workflows/validate.yml`)

**Trigger:** PR → `main`, `release/**`, `point/**`; merge queue (`merge_group`)  
**Jobs** (independent — no `needs` chain):

- **ESLint:** `pnpm eslint --cache`.
- **Prettier:** `pnpm prettier --check src`.
- **Stylelint:** `pnpm stylelint "src/**/*.module.scss"`.
- **Playwright** (self-hosted runner, Playwright container): matrix for `saas` + `self-hosted`; each builds with `pnpm run build:e2e` → installs browsers → runs matching Playwright project (untagged "common" tests run in both) → uploads `playwright-report-<target>`.
- **Vitest** (self-hosted): `pnpm exec vitest run --coverage` → uploads `vitest-report` from `reports/`.
- **Changeset:** fails the PR unless it _adds_ a file under `.changeset/*.md` (excluding `README.md`). An empty changeset (`pnpm changeset --empty`) satisfies it.  
  **Env (examples):** `VITE_API_URL`, `VITE_API_URL_OLD`, `VITE_ROOT_PATH`, `VITE_SELF_HOSTED_ENV=true/false`, `VITE_MSW_ENABLED=true/false`.  
  **Constraints:** keep memory flag `NODE_OPTIONS='--max_old_space_size=4096'` on the Vitest job.

### Integration Tests (`.github/workflows/integration-tests.yml`)

**Trigger:** PR → `main` and push → `main` — both `paths-ignore` `docs/**`, `feature-plans/**`, `debian/**` and `**.md`; nightly cron `0 2 * * *`; `workflow_dispatch` with a `packaging_ref` input  
**Job:** **integration-tests** (Ubuntu hosted, 45-minute timeout), skipped for fork PRs. Checks out `landscape-packaging` with a GitHub App token, vendors `landscape-go`, starts the backend stack with Docker Compose, waits for schema migrations / debarchive seeding / appserver readiness, then runs three Playwright configs from `e2e/docker-stack/`: API contract, self-hosted, SaaS — uploading a report per config.  
**Rule:** Third-party actions here are SHA-pinned. Keep them pinned; do not relax them to floating tags.

### Changeset Version (`.github/workflows/changeset-version.yml`)

**Trigger:** push → `main`  
**Job:** **version** — maintains the "Version Packages" PR via `changesets/action@v1` with `scripts/manual-version-update.cjs`. No build, no tag, no publish.  
**Rule:** `main` is the integration trunk and CHANGELOG baseline, not a publish target. Do not add build or `ppa-build-*` steps here.

### Release and PPA Build (`.github/workflows/release-and-build.yml`)

**Trigger:** push → `release/**` or `point/**`; `workflow_dispatch` (guarded to those same refs)  
**Jobs:**

- **process-release:** computes the version via `scripts/calculate-version.cjs`, derives the per-branch `ppa-build-*` destination, resolves stable promotion (highest `release/YY.MM` on origin, or the `STABLE_RELEASE_BRANCH` override), and sets `should_build=false` when `v<version>` is already tagged. When building: version bump → production build → force-publish `dist/` to the destination branch → tag `v<version>` → mirror to `ppa-build-stable` if promoted.
- **build-deb:** needs `process-release`; builds the unsigned `.deb` from the `dist` artifact and uploads it.  
  **Rule:** Do not change branch selection, the `should_build` tag guard, or the tag-after-deploy ordering.

### Vulnerability Scan (`.github/workflows/security.yaml`)

**Triggers:** `workflow_dispatch`; push → `release/**` (ignoring `security/sbom/**`)  
**Jobs:**

- **build-image:** builds the OCI image and uploads it as the `image-tar` artifact.
- **scan-and-report** (self-hosted): runs `canonical-secscan-client` against `image.tar` with SSDLC metadata; the scanner's exit code becomes the job's exit code.
- **generate-and-commit-sbom:** Trivy SBOM (`spdx-json`) → artifact, and on a `release/**` push commits it to `security/sbom/release.spdx.json`.  
  **Rule:** Preserve exit-code propagation and the SBOM commit race protection.

### Full TICS (`.github/workflows/tics-full.yml`)

**Trigger:** `workflow_dispatch`; monthly cron `0 3 1 * *`  
**Jobs:**

- **unit-tests:** same shape as the Validate Vitest job; uploads `vitest-report`.
- **tics-report:** needs `unit-tests`; self-hosted TIOBE runner with `mode: qserver`, `installTics: true`, a per-run `tmpdir`, and a repository-wide `concurrency` group.  
  **Rule:** Keep `pnpm run tcm:run` before the TICS step — it needs the generated CSS module declarations.

---

### CI Tooling Contracts

- **Node:** `24`
- **pnpm:** `10`
- **Install:** `pnpm install --frozen-lockfile` only
- **Build:** `pnpm run build:e2e` before the Validate Playwright run; `pnpm run build` for release builds
- **Playwright:** install browsers with `pnpm exec playwright install --with-deps` inside the job that runs them
- **Caching:** use `actions/setup-node@v4` cache `"pnpm"`
- **Artifacts:** preserve report names and paths as defined (`playwright-report-<target>`, `vitest-report` ← `reports/`, `dist`, `image-tar`)

### Copilot MUST NOT

- Suggest `npm`/`yarn` commands or change Node/pnpm versions.
- Add a build or publish step to `changeset-version.yml` — `main` does not ship.
- Move Playwright browser install outside the job that runs the tests.
- Change branch selection or the `should_build` tag guard in `release-and-build.yml`.
- Alter TICS exit-code handling or security scan failure behavior.
- Unpin the SHA-pinned actions in `integration-tests.yml`.

## Update Policy

Whenever code or CI steps change:

1. Update this file.
2. Validate build and test steps.
3. Ensure Copilot-suggested patterns remain valid.

---

## Summary Rule for Copilot

> Follow the architecture, type safety, and feature isolation principles defined here.  
> Suggest improvements only if they comply with this document’s invariants.
