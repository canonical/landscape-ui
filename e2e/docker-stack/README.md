# Docker Stack Tests

This directory contains Playwright test suites that run against a real, localized Landscape backend stack deployed via Docker.

By grouping these tests together, we explicitly declare their shared dependency on the Docker backend and ensure they use the same seeded sample data.

For architecture details and roadmap, see [docs/integration-testing.md](../../docs/integration-testing.md).

---

## Triggering in CI

The **Integration Tests** workflow (`.github/workflows/integration-tests.yml`) runs automatically on:

- PRs targeting `main` (code changes only — docs/markdown paths are ignored)
- Pushes to `main`
- Nightly at 02:00 UTC (catches upstream backend regressions)

**Execution Order (Fail Fast):**

1. **API Contract Tests:** Validates UI TypeScript/Zod definitions against the real backend JSON shape.
2. **e2e selfHosted Tests:** UI integration tests with full self-hosted features.
3. **e2e SaaS Tests:** UI integration tests validating SaaS mode feature guards.

**Manual trigger with a custom backend ref:**

1. Go to **Actions → Integration Tests** in GitHub
2. Click **Run workflow**
3. Set `packaging_ref` to a branch, tag, or SHA from `canonical/landscape-packaging`
   containing `docker/configs/.env.testing` and `.env.ui.testing`. Use the default
   `main` only once it contains them; a blank input also falls back to `main`.
   CI fails explicitly if this prerequisite is missing.

---

## Running locally

### Prerequisites

- Docker + Docker Compose v2
- `canonical/landscape-packaging` cloned with submodules (e.g., `~/landscape-packaging`)
- `pnpm` + Node 24

### 1. Start the backend with sample data

Use a dedicated disposable VM/runner without an existing Landscape stack; packaging
has fixed container names and ports, so project names alone do not isolate stacks.
Do not wipe shared volumes. Follow the [testing-mode startup instructions](../../docs/integration-testing.md#1-start-the-backend-stack)
to build the backend, then bootstrap with the full CI arguments:

```bash
# In your landscape-packaging/docker/ui-dev/ directory
export LANDSCAPE_DEPLOYMENT_MODE=testing
LANDSCAPE_BOOTSTRAP_SCHEMA_ARGS="--with-computers --with-free-disk-space --with-free-memory-and-swap --with-load-averages --with-temperatures --with-network-traffic --with-active-processes --with-packages --with-package-activities --with-script-activities --with-users-and-groups --with-cpu-usage --with-ceph-usage --with-compute-usage --with-swift-usage --with-user-and-group-activities --with-custom-graph --with-scripts --with-account-password foo" make schema
make up
```

`make schema` enables `LANDSCAPE_RUN_SCHEMA=1` and waits for the `schema` service;
`builder` alone does not seed data. Keep testing mode exported for backend runtime
and diagnostics. Leave `LANDSCAPE_UI` unset so Playwright can start its own Vite.
Frontend modes remain explicitly `e2e.selfHosted` and `e2e.saas`.

The testing profile gives John Smith (`john@example.com`, `pwd`)
access to both `standalone` (**Organization**) and `second-account` (**Second Account**).
Shared API/browser setup explicitly selects `standalone` to preserve existing
fixture prerequisites; see [testing-profile compatibility](../../docs/integration-testing.md#testing-profile-compatibility).

The organisation-switch regression uses its own fresh session and explicitly
requires both organisations. See the [regression validation procedure](../../docs/integration-testing.md#organisation-switch-regression)
for its post-handler completion signal and mutation check.

Wait for both services to respond:

```bash
curl -sf http://localhost:9091/api/v2/login/methods
curl -sf http://localhost:8080/
```

### 2. Install browsers (first time)

    pnpm exec playwright install --with-deps chromium

### 3. Run the tests

You can run individual suites based on your needs:

```bash
# API Contract Tests (Fast, no browser UI)
pnpm exec playwright test --config e2e/docker-stack/playwright.api-contract.config.ts

# UI - Self-hosted mode (loads .env.e2e.selfHosted)
pnpm exec playwright test --config e2e/docker-stack/playwright.integration.config.ts

# UI - SaaS mode (loads .env.e2e.saas)
pnpm exec playwright test --config e2e/docker-stack/playwright.integration.saas.config.ts
```

Test reports are written to:

- `playwright-api-contract-report/`
- `playwright-integration-report/`
- `playwright-integration-saas-report/`

---

## Adding API Contract Tests (`api/`)

Create `*.spec.ts` inside `e2e/docker-stack/api/`. These tests interact with the API endpoints directly to validate schemas.

```ts
import { test, expect } from "@playwright/test";

test.describe("My Feature API Contract", () => {
  test("GET /api/v2/feature returns Feature shape", async ({ request }) => {
    const res = await request.get("/api/v2/feature");
    expect(res.ok()).toBeTruthy();

    const body = await res.json();
    expect(body).toHaveProperty("id");
  });
});
```

---

## Adding UI Integration Tests (`ui/`)

### Self-hosted test

Create a file matching `*.integration.spec.ts` under `e2e/docker-stack/ui/`. `global-setup.ts` automatically logs in the user.

```ts
import { test, expect } from "@playwright/test";

test.describe("my feature (real backend)", () => {
  test("does something real", async ({ page }) => {
    await page.goto("/my-feature");
    await expect(
      page.getByRole("heading", { name: "My Feature" }),
    ).toBeVisible();
  });
});
```

### SaaS mode test

Name the file `*.saas.integration.spec.ts`. These run with `VITE_SELF_HOSTED_ENV=false`.

```ts
import { test, expect } from "@playwright/test";

test("self-hosted-only route redirects to /env-error in SaaS mode", async ({
  page,
}) => {
  await page.goto("/instances");
  await page.waitForLoadState("networkidle");

  await page.goto("/my-self-hosted-only-route");
  await page.waitForURL("**/env-error", { timeout: 10_000 });
});
```
