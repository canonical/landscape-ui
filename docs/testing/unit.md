# Unit Tests

Unit and component tests in this repository are written with Vitest and React Testing Library.

## Use This Layer For

- pure logic
- helpers and formatting
- hooks
- reducers or local state behavior
- component behavior that can be exercised in `jsdom`
- focused rendering, interaction, and state assertions that do not require a real browser flow

These tests should stay fast, targeted, and close to the behavior being changed.

## File Placement

Current repo patterns:

- component and page tests are usually co-located with the unit under test as `*.test.tsx`
- pure helper tests are usually co-located as `*.test.ts`
- hook tests live under `src/hooks/__tests__/` or beside the hook when that is clearer
- shared test infrastructure lives under `src/tests/`

When adding a new unit test, prefer co-location with the thing being tested unless it is shared test infrastructure.

## Core Test Harness

Vitest runs against `src/` with a shared `jsdom` setup in `src/tests/setup.ts`.

That setup already provides:

- `@testing-library/jest-dom` matchers
- automatic RTL cleanup after each test
- a shared MSW server with `onUnhandledRequest: "error"`
- global `ResizeObserver` mocking
- `HTMLCanvasElement.getContext` stubbing
- `document.queryCommandSupported` stubbing
- a `ProgressEvent` polyfill when needed
- `Range.prototype.getBoundingClientRect` mocking and reset hooks
- responsive `matchMedia` reset between tests

Because the setup is global, unit tests should assume network requests must be handled and responsive state will be reset after each test.

## Which Render Helper To Use

This repository uses three main entrypoints:

- `render(...)` from React Testing Library for pure components with no router, provider, or query dependencies
- `renderWithProviders(...)` from `src/tests/render.tsx` for most app-facing components, pages, and containers
- `renderHook(..., { wrapper: renderHookWithProviders() })` for hooks that depend on router, auth, or React Query context

### `render(...)`

Use plain RTL `render(...)` when the unit does not depend on app providers. This is common for pure presentational components such as `src/components/layout/Redirecting/Redirecting.test.tsx` or `src/components/layout/ExpandableTable/ExpandableTable.test.tsx`.

### `renderWithProviders(...)`

Use `renderWithProviders(...)` when the component needs any of:

- routing
- app context
- React Query
- auth state
- notifications
- side-panel behavior

`renderWithProviders(...)` wraps the test in:

- `MemoryRouter`
- `AppProviders`
- `SidePanelProvider`
- `AppNotification` via `NotifyContext`

It also supports route-aware tests:

- `routePath` seeds the current URL
- `routePattern` mounts the component under a matching route definition

This is the default helper for most `src/pages/`, `src/features/`, and app-shell components.

### `renderHookWithProviders()`

Use `renderHookWithProviders()` for hooks that need router or React Query context. The helper provides:

- `MemoryRouter`
- `QueryClientProvider` with test config
- `AuthProvider`

The test query client disables retries and uses `gcTime: 0`, which keeps hook tests deterministic and avoids retry-related timing noise.

## Imports And Declarations

### Preferred import sources

Current suite patterns consistently use:

- `screen`, `within`, `waitFor`, and `renderHook` from `@testing-library/react`
- `userEvent` from `@testing-library/user-event`
- `describe`, `it`, `expect`, `beforeEach`, `afterEach`, and `vi` from `vitest`
- test helpers and fixtures from `@/tests/*`

### Typed props and fixtures

The suite strongly prefers typed local fixtures over untyped inline objects.

Common patterns:

- `const props: ComponentProps<typeof MyComponent> = { ... }`
- `const mockAuth: AuthContextProps = { ... }`
- `const value = { ... } satisfies AccountsContextProps`
- `const rows = [...] as const satisfies Activity[]`

Prefer `ComponentProps<typeof ...>` or the concrete domain/context type for local test data so interface drift is caught by TypeScript.

## Assertion Style

Default assertion style in this repo:

- query by accessible role/name first
- use `screen.findBy...` for async appearance
- use `waitFor(...)` for async state transitions
- use `within(...)` to scope row, cell, menu, or panel assertions
- keep assertions user-facing rather than implementation-detail oriented

Examples already common in the suite:

- `screen.getByRole("button", { name: /save changes/i })`
- `await screen.findByRole("heading", { name: /create account/i })`
- `within(row).getByRole("button", { name: /actions/i })`

The suite does occasionally use `container`, but usually for the custom matchers described below rather than raw DOM traversal.

## Custom Matchers And Helpers

The global setup adds repo-specific matchers from `src/tests/matcher.ts`:

- `toBeOffScreen`
- `toHaveTexts`
- `toHaveInputValues`
- `toHaveInfoItem`
- `toHaveIcon`

Use these when they match the UI pattern directly, especially for:

- table/header text coverage
- info-grid style label/value assertions
- icon-state assertions
- hidden accessible text assertions

Shared helpers from `src/tests/helpers.ts` are also part of the normal unit-test toolkit:

- `expectLoadingState()` for waiting through the shared loading spinner
- `expectErrorNotification()` for generic error-notification assertions
- `setScreenSize(...)` and `resetScreenSize()` for responsive behavior
- range bounding-rect helpers, already managed globally by setup

## Mock Data Strategy

Shared typed fixtures live under `src/tests/mocks/`. These are the default source of truth for unit-test data.

Current patterns:

- import a domain fixture such as `authUser`, `features`, `roles`, `instances`, or `removalProfiles`
- use the shared fixture directly when the default shape is good enough
- create a test-specific variant with object spread when only a few fields differ
- keep the fixture typed to the real domain type

This is the preferred approach over rebuilding large inline payloads inside each test.

## Hook And Module Mocking

Two mocking styles are common, depending on the seam.

### Mock a hook directly

Use direct hook mocking when the behavior is easiest to isolate at the hook boundary:

```ts
vi.mock("@/hooks/useAuth");

beforeEach(() => {
  vi.mocked(useAuth).mockReturnValue(authProps);
});
```

This is common for auth, env, side-panel, and account-selection behavior.

### Partially mock a module

Use `vi.importActual(...)` when only part of a module should be replaced:

```ts
vi.mock("@/features/auth", async () => {
  const actual = await vi.importActual("@/features/auth");
  return {
    ...actual,
    useGetLoginMethods: vi.fn(),
    ProviderList: () => <div data-testid="provider-list">Provider List</div>,
  };
});
```

Use this when you want to keep most of a feature module real but replace one hook or child component.

### Mock lifecycle

Current suite patterns use:

- `vi.clearAllMocks()` to reset call history
- `vi.resetAllMocks()` when return values and implementations should be reset
- `vi.restoreAllMocks()` after spies such as `console.warn`

Pick the narrowest reset that matches the test.

## Network And MSW Patterns

Unit tests in this repo do use MSW, especially for containers, pages, and hooks that fetch data.

The default model is:

- shared handlers are registered once in `src/tests/server/handlers/index.ts`
- handlers build responses from typed fixtures under `src/tests/mocks/`
- `src/tests/setup.ts` starts the server before all tests and resets handlers after each test

The most common per-test override is not `server.use(...)`. Instead, the suite usually drives shared handlers through `setEndpointStatus(...)` from `src/tests/controllers/controller.ts`.

Supported common states:

- `setEndpointStatus("default")`
- `setEndpointStatus("empty")`
- `setEndpointStatus("error")`
- `setEndpointStatus({ status: "error", path: "/features" })`

Documented implication:

- if a unit test triggers network traffic and no handler exists, the test should fail
- if you only need default, empty, or error behavior, prefer `setEndpointStatus(...)`
- if the current shared handlers cannot express the needed case, add the capability to the handler or fixture layer instead of scattering ad hoc network stubs through tests

## Forms And Formik-Based Components

Formik-backed units often use `createFormik(...)` from `src/tests/formik.ts` instead of mounting a full form.

Use it for components that only need a `FormikContextType<T>`-shaped object:

```ts
const formik = createFormik({ all_computers: false, tags: [] });
renderWithProviders(<AssociationBlock formik={formik} />);
```

This keeps form component tests small and focused on rendering and local interactions.

## Responsive Behavior

Responsive UI logic is tested with `setScreenSize(...)` and `resetScreenSize()` from `src/tests/helpers.ts`.

Use this for units whose behavior changes across breakpoints, such as:

- responsive action menus
- table/list layout changes
- conditional mobile vs desktop controls

The helpers work by mocking `window.matchMedia` against the breakpoints defined in `src/constants.ts`.

## Interaction Style

Current suite patterns favor `userEvent` for user-like interactions:

- clicks
- typing
- selecting options

Use `await` with `userEvent` interactions. Use `fireEvent` only when a lower-level event is genuinely needed.

## Recommended Working Template

### Pure component

```tsx
import { render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import MyComponent from "./MyComponent";

const props: ComponentProps<typeof MyComponent> = {
  title: "Example",
};

describe("MyComponent", () => {
  it("renders the title", () => {
    render(<MyComponent {...props} />);

    expect(
      screen.getByRole("heading", { name: props.title }),
    ).toBeInTheDocument();
  });
});
```

### Provider-aware component

```tsx
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { renderWithProviders } from "@/tests/render";
import MyContainer from "./MyContainer";

const props: ComponentProps<typeof MyContainer> = {
  onClose: vi.fn(),
};

describe("MyContainer", () => {
  it("submits successfully", async () => {
    const user = userEvent.setup();

    renderWithProviders(<MyContainer {...props} />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(props.onClose).toHaveBeenCalled();
  });
});
```

### Hook with providers

```tsx
import { renderHook, waitFor } from "@testing-library/react";
import { renderHookWithProviders } from "@/tests/render";
import useMyHook from "@/hooks/useMyHook";

describe("useMyHook", () => {
  it("loads data", async () => {
    const { result } = renderHook(() => useMyHook(), {
      wrapper: renderHookWithProviders(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });
});
```

## Repo Notes

- Shared test utilities and mocks belong under `src/tests/`.
- Prefer the smallest failing test that proves the requirement before changing implementation when the area is practically testable.
- Prefer typed fixtures and helpers from `src/tests/` before inventing one-off local infrastructure.

## Command Shape

Use targeted Vitest coverage when possible, and broaden only when the change crosses multiple areas.
