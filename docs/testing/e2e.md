# End-To-End Tests

End-to-end tests in this repository are written with Playwright.

## Use This Layer For

- route flows
- browser interactions
- navigation
- integrated state changes across screens
- user-visible workflows that depend on the real app shell or router
- behavior that is only meaningful when exercised in a browser environment

Avoid pushing everything into end-to-end coverage when a smaller unit or component test would prove the same contract faster and more reliably.

Current direction:

- feature-first specs under `e2e/features/`
- shared helpers and fixtures under `e2e/support/`
- reusable page or component objects when a flow benefits from them
- project tagging for SaaS vs self-hosted behavior
- helper-driven navigation and login instead of repeating raw URL and form logic everywhere

## File Placement

Current repo structure:

- `e2e/features/<domain>/*.spec.ts`: feature-level Playwright specs
- `e2e/features/<domain>/*.page.ts`: feature-specific page objects when they provide value
- `e2e/shared/components/`: reusable E2E component objects, such as table pagination helpers
- `e2e/support/fixtures/`: custom Playwright fixtures
- `e2e/support/helpers/`: navigation, auth, intercept, and environment helpers
- `e2e/support/pages/`: shared page-object base classes

When adding a new E2E test, prefer placing it under the relevant feature directory and only extracting page objects or helpers when the behavior is reused or meaningfully clarified by the abstraction.

## Playwright Configuration

The suite is configured in `playwright.config.ts`.

Current behavior:

- tests live under `e2e/features`
- only `**/*.spec.ts` files are executed
- projects are split into `saas` and `self-hosted`
- project selection is driven by `@saas` and `@self-hosted` tags
- local runs use `pnpm dev`
- CI runs use `pnpm preview`
- failed retries keep traces, and failed tests retain videos

The config also starts the app automatically and sets:

- `VITE_ROOT_PATH=/`
- `VITE_MSW_ENABLED=false`

That means E2E coverage is pointed at the running app, not the unit-test MSW environment.

## Prefer The Shared Fixture Layer

Most E2E specs should import `test` and `expect` from `e2e/support/fixtures/auth.ts`, not directly from `@playwright/test`.

That fixture layer currently provides:

- `authenticatedPage`: a page that has already logged in and closed the welcome modal
- `standaloneAccountMock`: an option for self-hosted account-existence scenarios
- console, page-error, and request-failure logging written to the test output directory

This is the default starting point for new specs because it keeps authentication setup and basic diagnostics consistent.

## Choosing `page` vs `authenticatedPage`

Use `authenticatedPage` when:

- the flow starts from an already logged-in state
- login is not part of the behavior under test
- the page would otherwise be blocked by the welcome modal

Use raw `page` when:

- login itself is the subject of the test
- redirect handling during auth is the subject of the test
- the spec needs to install routes or environment mocks before navigation

This split is already visible in the auth, activities, and repositories specs.

## Navigation And Auth Helpers

Prefer the shared helper layer over re-implementing URL and login behavior in each spec.

Current helpers:

- `navigateTo(page, path, params?)`
- `navigateToSidebarLink(page, name)`
- `clickSidebarButton(page, name)`
- `login(page, email, password, params?)`
- `closeWelcomeModal(page)`
- `waitForEnvironmentError(page)`

These helpers already encode root-path handling and common flows, so use them instead of open-coding URL building or sidebar interaction.

## Environment-Specific Coverage

The suite supports both SaaS and self-hosted environments.

Current pattern:

- wrap SaaS-only expectations in `test.describe("@saas", ...)`
- wrap self-hosted-only expectations in `test.describe("@self-hosted", ...)`
- let Playwright project filtering include or exclude tests based on those tags

Use this when the UI or behavior differs between deployment modes, such as repository mirrors or standalone-account flows.

## Page Objects And Shared Components

The E2E suite is starting to adopt page-object-style abstractions, but selectively rather than everywhere.

Current examples:

- `LoginPage` for login interactions and heading checks
- `MirrorsPage` for repository mirrors
- `TablePagination` as a reusable E2E component object
- `basePage` for shared page assertions such as heading checks

Guidance for new coverage:

- use a page object when the same screen behavior appears in multiple tests
- use a shared component object for reusable widgets that appear across pages
- do not create a page object just to wrap one or two trivial selectors once

The current pattern is pragmatic rather than dogmatic.

## Network And Request Control

E2E tests do not use the unit-test MSW server. Network control is done with Playwright routing and request observation.

Current patterns:

- inline `page.route(...)` in a spec for targeted auth or callback overrides
- dedicated helpers such as `mockStandaloneAccount(page, exists)`
- optional helper utilities in `e2e/support/helpers/intercept.ts` for request interception and request waiting

At the moment, inline `page.route(...)` is still common for targeted response overrides, especially in auth callback scenarios. The suite is not yet standardized around a single interception abstraction.

Guidance:

- use `page.route(...)` directly when the override is local to one spec and easy to read inline
- extract a helper when the same route behavior is reused or is domain-specific enough to deserve a named abstraction

## Assertion Style

Current suite patterns favor:

- `expect(page).toHaveURL(...)` for navigation and redirect assertions
- `getByRole(...)` and other accessible locators for UI assertions
- page-object methods for stable, repeated assertions such as heading checks

Examples already common in the repo:

- `await expect(page).toHaveURL(/overview/)`
- `await expect(page.getByRole("button", { name: "Create account" })).toBeVisible()`
- `await expect(authenticatedPage.getByText("Mirrors")).toBeVisible()`

Prefer asserting user-visible behavior over internal implementation details.

## Stable Workflow For New Specs

When adding a new E2E test, follow this order:

1. Decide whether the flow needs `page` or `authenticatedPage`.
2. Place the spec under the owning feature directory in `e2e/features/`.
3. Use shared navigation and auth helpers first.
4. Add environment tags if the behavior differs between SaaS and self-hosted.
5. Extract a page object or shared component helper only if the selectors or actions are reused.
6. Add route interception only where the scenario cannot be expressed cleanly against the default app behavior.

## Recommended Working Templates

### Authenticated navigation flow

```ts
import { test, expect } from "../../support/fixtures/auth";
import { navigateToSidebarLink } from "../../support/helpers/navigation";

test("shows the target screen", async ({ authenticatedPage }) => {
  await navigateToSidebarLink(authenticatedPage, "Activities");

  await expect(authenticatedPage).toHaveURL(/activities/);
});
```

### Environment-specific behavior

```ts
import { test, expect } from "../../support/fixtures/auth";

test.describe("@self-hosted", () => {
  test("shows self-hosted only behavior", async ({ authenticatedPage }) => {
    await expect(authenticatedPage.getByText("Mirrors")).toBeVisible();
  });
});
```

### Route override inside a spec

```ts
import { test, expect } from "../../support/fixtures/auth";
import { navigateTo } from "../../support/helpers/navigation";

test("redirects to an internal return_to", async ({ page }) => {
  await page.route("**/auth/handle-code**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        return_to: {
          external: false,
          url: "/scripts",
        },
      }),
    });
  });

  await navigateTo(page, "/handle-auth/oidc", {
    code: "mock-code",
    state: "mock-state",
  });

  await expect(page).toHaveURL(/\/scripts/);
});
```

## Repo Notes

- Playwright coverage lives under `e2e/features/`.
- Use this layer when the requirement depends on routing, browser state, or a multi-screen user flow.
- For UI-facing changes, Playwright coverage often proves correctness, but it does not replace visual verification of the resulting screen.
- Prefer building on the existing helper and fixture layer instead of introducing raw one-off setup in every spec.

## Command Shape

Use targeted Playwright coverage for the changed path first, then broaden when the affected workflow is cross-cutting.
