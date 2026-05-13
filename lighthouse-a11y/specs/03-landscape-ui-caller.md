# 03 — Workstream C: Landscape UI caller + consumer config

**Owner:** one engineer. Single PR.
**Depends on:** `00-foundation.md` merged. Contracts from `01-shared-config.md` (createBaseConfig signature) and `02-reusable-workflow.md` (workflow inputs).
**Parallel with:** A, B, D — but C's draft PR cannot go green until A and B are merged, since C consumes both.

## Goal

Make Landscape UI itself a working consumer of the reusable workflow. Prove the reusable workflow end-to-end and produce the canonical example other repos copy. This is the "consumer" layer.

## Deliverables

### `ui/lighthouserc.cjs`

Replace the foundation stub.

```js
const { createBaseConfig } = require("./.github/lighthouse/lighthouserc.base.cjs");

const PORT = 4173;
const baseUrl = `http://localhost:${PORT}`;

const publicUrls = [
  `${baseUrl}/login`,
  `${baseUrl}/create-account`,
  `${baseUrl}/no-access`,
];

const authenticatedUrls = [
  `${baseUrl}/`,
  `${baseUrl}/instances`,
  `${baseUrl}/profiles/package`,
  `${baseUrl}/settings/general`,
];

const mode = process.env.LHCI_AUTH_MODE ?? "public";
const urls = mode === "msw"  ? authenticatedUrls
          : mode === "both" ? [...publicUrls, ...authenticatedUrls]
          : publicUrls;

const config = createBaseConfig({
  wcagLevel: process.env.LHCI_WCAG_LEVEL ?? "aa",
  minScore:  process.env.LHCI_MIN_SCORE ? Number(process.env.LHCI_MIN_SCORE) : undefined,
  urls,
});

// Landscape-specific overrides — example: heading order is mid-migration to Vanilla
// Framework conventions; warn for now so we surface regressions without blocking PRs.
config.ci.assert.assertions["heading-order"] = ["warn"];

module.exports = config;
```

### `ui/.github/lighthouse/urls.public.txt`

Replace the foundation empty file. One URL or path per line; lines starting with `/` will be prefixed with the workflow's `serve-url`.

```
/login
/create-account
/no-access
/handle-auth/oidc
/handle-auth/ubuntu-one
/accept-invitation/test-secure-id
```

Source: `AUTH_PATHS` in `src/libs/routes/auth.ts:7-16` — derive from there if it changes.

### `ui/.github/lighthouse/urls.authenticated.txt`

Replace the foundation empty file. For v1.1 use; v1 callers fall back to public (the reusable workflow handles this).

```
/
/instances
/profiles/package
/settings/general
/account/general
```

Source: `src/routes/DashboardRoutes.tsx:22-205` — keep these representative, not exhaustive.

### `ui/.github/workflows/lighthouse-a11y.yml`

Replace the foundation stub.

```yaml
name: Lighthouse a11y

on:
  pull_request:
    branches: [main]
  workflow_dispatch:
    inputs:
      mode:
        type: choice
        default: annotate
        options: [annotate, block]
      auth-mode:
        type: choice
        default: public
        options: [public, msw, both]
  schedule:
    - cron: "30 3 * * *"   # nightly thorough; remove if noisy

jobs:
  pr-public:
    if: github.event_name == 'pull_request'
    uses: canonical/landscape-ui/.github/workflows/lighthouse-a11y.reusable.yml@main
    with:
      wcag-level: aa
      mode: annotate                # soak in annotate; see plan open questions
      auth-mode: public
      urls-file: .github/lighthouse/urls.public.txt
      config-path: ./lighthouserc.cjs
      upload-artifact-name: lighthouse-report-pr
      pr-comment: true

  thorough:
    if: github.event_name == 'workflow_dispatch' || github.event_name == 'schedule'
    uses: canonical/landscape-ui/.github/workflows/lighthouse-a11y.reusable.yml@main
    with:
      wcag-level: aa
      mode: ${{ github.event_name == 'schedule' && 'annotate' || inputs.mode }}
      auth-mode: ${{ github.event_name == 'schedule' && 'both' || inputs.auth-mode }}
      build-command: pnpm build:e2e
      urls-file: .github/lighthouse/urls.authenticated.txt
      config-path: ./lighthouserc.cjs
      upload-artifact-name: lighthouse-report-thorough
      pr-comment: false
```

## Tests

**Unit — `ui/lighthouserc.test.ts`** (colocated with `ui/lighthouserc.cjs`). Required cases:

- With no `LHCI_*` env vars set, the exported `ci.collect.url` equals exactly the public URL list (3 entries).
- `LHCI_AUTH_MODE=msw` → `ci.collect.url` equals the authenticated URL list.
- `LHCI_AUTH_MODE=both` → `ci.collect.url` is the concatenation `[...publicUrls, ...authenticatedUrls]`, in that order, no duplicates.
- `LHCI_AUTH_MODE=public` (explicit) matches the no-env default.
- `LHCI_WCAG_LEVEL=aaa` → `ci.assert.assertions["categories:accessibility"][1].minScore === 0.95`.
- `LHCI_MIN_SCORE=0.5` → floor in `categories:accessibility` is `0.5` (override wins over the level default).
- The Landscape-specific `heading-order: ["warn"]` override is present in `ci.assert.assertions`.
- Module-load is deterministic — calling the module fresh after env mutation reflects the new env (use `vi.resetModules()` between cases or wrap in `vi.isolateModules`).

Tip: `lighthouserc.cjs` is CommonJS but Vitest can `require()` or dynamic-`import()` it. Use `vi.stubEnv("LHCI_AUTH_MODE", "msw")` + `vi.resetModules()` + `await import("./lighthouserc.cjs")` per case to avoid cross-test contamination.

**Integration:** the workflow integration checks in spec 02 cover this caller end-to-end. No additional integration test required here — but verify the local recipe:

```bash
cd ui
pnpm a11y:preview                     # terminal A
LHCI_AUTH_MODE=public pnpm a11y:ci    # terminal B → exit 0 if at/above floor
```

…and document the result in the PR description.

## Inputs from other workstreams

- `createBaseConfig` from A — must accept `{ wcagLevel, minScore, urls }` and return the LHCI shape.
- Reusable workflow inputs from B — must accept the keys this spec passes: `wcag-level`, `mode`, `auth-mode`, `urls-file`, `config-path`, `upload-artifact-name`, `pr-comment`, `build-command`. Foundation stubs the input declarations; B fills the body.

## Out of scope

- `build-comment.cjs` (Workstream D).
- `docs/testing/a11y.md` (Workstream D).
- Touching `vite.config.ts` or `src/main.tsx` for MSW — v1.1.

## Done when

- Caller workflow appears on a PR as `Lighthouse a11y / pr-public` alongside Lint, Tests/TICS, Changeset.
- `lighthouse-report-pr` artifact is attached to the PR's workflow run.
- A sticky comment with score table is posted, marked "Annotate-only".
- `workflow_dispatch` run with `mode=block, auth-mode=public` either passes assertions or fails with a clear list of audit IDs (no infrastructure errors).
- Local: `pnpm a11y:preview` in one terminal, `LHCI_AUTH_MODE=public pnpm a11y:ci` in another, exit 0 if at/above floor.
- A `patch` changeset describes the change.
