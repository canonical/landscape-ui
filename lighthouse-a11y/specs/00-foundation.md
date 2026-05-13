# 00 — Foundation

**Order:** first. Workstreams A–D depend on the contracts and stub files this spec lands.
**Owner:** single engineer; small PR.

## Goal

Establish the directory layout, file stubs, the `@lhci/cli` dependency, and the interface contracts the four parallel workstreams fill in. Once this is merged on `main`, A/B/C/D can proceed independently against a stable shape.

## Why this exists

Without locked interfaces, B and C will race on workflow input names, A and C will race on the `createBaseConfig` signature, and D won't know what manifest shape to parse. Foundation kills those races by shipping stubs with the contracts baked in and bodies stubbed.

## Deliverables

All paths are inside the `ui/` submodule (= `canonical/landscape-ui` on GitHub).

### 1. Directory structure (stubs)

Create the following with stub contents as noted. Each stub MUST be syntactically valid and importable so downstream workstreams can develop against it without errors.

```
ui/
├── .github/
│   ├── lighthouse/
│   │   ├── audit-sets.cjs            stub (see 1a)
│   │   ├── lighthouserc.base.cjs     stub (see 1b)
│   │   ├── build-comment.cjs         stub (see 1c)
│   │   ├── urls.public.txt           empty file (Workstream C fills)
│   │   ├── urls.authenticated.txt    empty file (Workstream C fills, v1.1)
│   │   └── README.md                 skeleton heading only (Workstream D fills)
│   └── workflows/
│       ├── lighthouse-a11y.reusable.yml  stub with input declarations only (see 1d)
│       └── lighthouse-a11y.yml           stub with PR trigger + empty jobs (Workstream C fills)
└── lighthouserc.cjs                  stub (see 1e)
```

**1a — `audit-sets.cjs`:**

```js
module.exports = {
  a:   { defaultMinScore: 0.85, assertions: {} },
  aa:  { defaultMinScore: 0.90, assertions: {} },
  aaa: { defaultMinScore: 0.95, assertions: {} },
};
```

**1b — `lighthouserc.base.cjs`:**

```js
function createBaseConfig(_opts) {
  throw new Error("not implemented — see specs/01-shared-config.md");
}
module.exports = { createBaseConfig };
```

**1c — `build-comment.cjs`:**

```js
#!/usr/bin/env node
// Stub; see specs/04-feedback-layer.md.
process.stdout.write("Lighthouse a11y comment generator not yet implemented.\n");
process.exit(0);
```

**1d — `lighthouse-a11y.reusable.yml`:** the full `on: workflow_call` block with every input from `specs/02-reusable-workflow.md` declared, but `jobs:` containing only a single no-op job (e.g. `run: echo "not implemented — see specs/02-reusable-workflow.md"`). This lets Workstream C's caller compile-check input names while B is still building the body.

**1e — `ui/lighthouserc.cjs`:**

```js
// Stub; see specs/03-landscape-ui-caller.md.
module.exports = { ci: {} };
```

### 2. Contract: `createBaseConfig` factory

Locked signature for Workstream A to honour and Workstream C to consume:

```js
createBaseConfig({
  wcagLevel,         // 'a' | 'aa' | 'aaa', required
  minScore,          // number 0..1, optional (default: audit-sets[wcagLevel].defaultMinScore)
  urls,              // string[], required, non-empty
  numberOfRuns,      // number, optional (default 1)
  settingsOverrides, // object, optional, shallow-merged into ci.collect.settings
})
```

…returning:

```js
{
  ci: {
    collect: { url, numberOfRuns, settings: { onlyCategories: ["accessibility"], preset: "desktop", chromeFlags: "...", ...settingsOverrides } },
    assert:  { assertions: { "categories:accessibility": ["error", { minScore }], ...auditSets[level].assertions } },
    upload:  { target: "filesystem", outputDir: "./.lighthouseci", reportFilenamePattern: "..." },
  }
}
```

### 3. Contract: env vars passed from workflow → config

Workstream B sets these in the LHCI runner step; Workstream C reads them in `ui/lighthouserc.cjs`. Names are locked:

- `LHCI_WCAG_LEVEL` — `a` | `aa` | `aaa`. Default `aa`.
- `LHCI_MIN_SCORE` — numeric string or empty.
- `LHCI_AUTH_MODE` — `public` | `msw` | `both`.
- `LHCI_URLS_FILE` — absolute path to the resolved URL list (B writes; C may inspect).
- `LHCI_MODE` — `block` | `annotate`. Workstream D reads this for the comment banner.
- `LHCI_ARTIFACT_URL` — URL of the uploaded artifact. Workstream D embeds this in the comment.

### 4. Package wiring

Edit `ui/package.json`:

- Add `"@lhci/cli": "^0.14.0"` to `devDependencies`.
- Add scripts:
  ```json
  "a11y:ci":      "lhci autorun --config=./lighthouserc.cjs",
  "a11y:collect": "lhci collect --config=./lighthouserc.cjs",
  "a11y:assert":  "lhci assert  --config=./lighthouserc.cjs",
  "a11y:preview": "vite preview --host 0.0.0.0 --port 4173"
  ```
- Run `pnpm install` and commit the updated `pnpm-lock.yaml`.

### 5. Changeset

Add `ui/.changeset/<random-slug>.md` (use `pnpm exec changeset` or copy an existing one as a template):

```markdown
---
"landscape-ui": patch
---

Scaffold Lighthouse accessibility CI: directory structure, shared base config stubs, reusable workflow input surface, and Landscape UI caller skeleton. Workstreams A–D fill in the bodies.
```

### 6. Docs cross-link placeholder

In `ui/docs/testing/index.md`, add a placeholder under the existing "Read next based on the task:" bullet list (Workstream D will finalize the line):

```markdown
- [a11y.md](a11y.md): Lighthouse accessibility checks (placeholder — Workstream D fills)
```

### 7. Vitest test discovery for the new code paths

The `.cjs` modules added by this initiative live under `ui/.github/lighthouse/` and `ui/lighthouserc.cjs` — outside `src/`. Vitest's existing config (`ui/vitest.config.ts`) won't discover tests there by default.

Edit `ui/vitest.config.ts`:

- Add `**/.github/lighthouse/**/*.test.{ts,cjs,mjs,js}` and `lighthouserc.test.{ts,cjs,mjs,js}` to the `include` glob (or extend the existing default `include`).
- Ensure `coverage.include` covers `.github/lighthouse/**/*.cjs` and `lighthouserc.cjs` so the new code counts against the 80/80/80/70 thresholds.
- Keep the existing `exclude` list intact.

Verify with a placeholder test:

```ts
// ui/.github/lighthouse/audit-sets.test.ts (delete or replace in Workstream A)
import { test, expect } from "vitest";
const sets = require("./audit-sets.cjs");
test("foundation: audit-sets module loads", () => {
  expect(sets).toHaveProperty("a");
  expect(sets).toHaveProperty("aa");
  expect(sets).toHaveProperty("aaa");
});
```

Run `pnpm coverage` and confirm: (a) the placeholder test is discovered and passes, (b) `ui/.github/lighthouse/audit-sets.cjs` shows up in the coverage report (it will be ~50% — that's expected; Workstream A raises it).

### 8. Coverage thresholds unchanged

Do not lower the thresholds in `vitest.config.ts:47-73` (80% statements/lines/functions, 70% branches). Foundation's placeholder stubs will dip coverage below threshold briefly — gate this PR's CI on the existing tests passing, then let Workstreams A/D restore coverage when they fill the stubs.

If the foundation PR cannot land green because the thresholds fail on the stubs, the acceptable workaround is to temporarily exclude the stubs from `coverage.include` in foundation — and the workstream that fills each stub MUST remove that exclusion as part of its PR. Track this in the foundation PR description.

## Out of scope

- Filling any business logic. This spec is structure + contracts only.
- Touching `ui/vite.config.ts` or `ui/src/main.tsx` (those are the MSW v1.1 path).
- `eslint-plugin-jsx-a11y` — separate adjacent PR, not in any spec.

## Done when

- All stub files exist in a single PR against `canonical/landscape-ui:main`.
- `pnpm install` succeeds; `pnpm run lint` is green; existing Vitest and Playwright suites are green.
- `pnpm coverage` runs to completion and discovers tests under the new locations (the placeholder test from §7 passes).
- The PR description names this spec and lists which workstreams it unblocks.
- The CI run for the PR passes including the existing `changeset-check.yml`.
