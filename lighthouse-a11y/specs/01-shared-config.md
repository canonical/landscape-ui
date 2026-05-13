# 01 — Workstream A: shared base config + WCAG audit matrix

**Owner:** one engineer. Single PR.
**Depends on:** `00-foundation.md` merged.
**Parallel with:** B, C, D.

## Goal

Implement the shared, reusable Lighthouse CI config that other Canonical projects extend. This is the "library" layer: pure JS, no GitHub Actions specifics.

## Deliverables

### `ui/.github/lighthouse/audit-sets.cjs`

Replace the foundation stub. Export `{ a, aa, aaa }`. Each level is `{ defaultMinScore: number, assertions: object }`. Assertion values follow Lighthouse CI shape: `["error" | "warn", { minScore: 1 }]`. Comment each entry with the WCAG criterion it covers (informational only — Lighthouse audits don't map 1:1 to WCAG).

Final curated lists:

- **Level A** — floor `0.85`. Audits:
  `image-alt` (1.1.1), `document-title` (2.4.2), `html-has-lang` (3.1.1), `link-name` (2.4.4 / 4.1.2), `button-name` (4.1.2), `valid-lang` (3.1.2), `meta-viewport` (1.4.4, warn-level only).
- **Level AA** — floor `0.90`. All of A plus:
  `color-contrast` (1.4.3), `label` (1.3.1 / 4.1.2), `aria-allowed-attr`, `aria-required-attr`, `aria-roles`, `aria-valid-attr`, `aria-valid-attr-value`, `aria-hidden-body`, `aria-hidden-focus` (all 4.1.2), `tabindex` (2.4.3), `frame-title` (2.4.1 / 4.1.2), `bypass` (2.4.1), `definition-list` (1.3.1), `dlitem` (1.3.1), `duplicate-id-aria` (4.1.1), `form-field-multiple-labels` (3.3.2, warn), `list` (1.3.1), `listitem` (1.3.1).
- **Level AAA** — floor `0.95`. All of AA plus (all `warn` — many AAA audits are still maturing in Lighthouse):
  `target-size` (2.5.5), `focus-traps` (2.1.2), `focusable-controls` (2.1.1), `interactive-element-affordance`, `heading-order` (1.3.1 / 2.4.6), `skip-link` (2.4.1), `use-landmarks` (1.3.1).

### `ui/.github/lighthouse/lighthouserc.base.cjs`

Replace the foundation stub. Export `{ createBaseConfig }` with the signature locked by foundation (`{ wcagLevel, minScore?, urls, numberOfRuns?, settingsOverrides? }`).

Reference body:

```js
function createBaseConfig({ wcagLevel, urls, numberOfRuns = 1, settingsOverrides = {}, minScore }) {
  if (!Array.isArray(urls) || urls.length === 0) {
    throw new Error("createBaseConfig: urls must be a non-empty array");
  }
  const set = require("./audit-sets.cjs")[wcagLevel];
  if (!set) throw new Error(`createBaseConfig: unknown wcagLevel ${wcagLevel}`);
  const floor = minScore ?? set.defaultMinScore;

  return {
    ci: {
      collect: {
        url: urls,
        numberOfRuns,
        settings: {
          onlyCategories: ["accessibility"],
          preset: "desktop",
          chromeFlags: "--no-sandbox --headless=new --disable-gpu",
          ...settingsOverrides,
        },
      },
      assert: {
        assertions: {
          "categories:accessibility": ["error", { minScore: floor }],
          ...set.assertions,
        },
      },
      upload: {
        target: "filesystem",
        outputDir: "./.lighthouseci",
        reportFilenamePattern: "%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%",
      },
    },
  };
}

module.exports = { createBaseConfig };
```

### Tests

Foundation §7 already wired Vitest to discover tests at these paths. Replace the foundation placeholder test in `audit-sets.test.ts` with the cases below, and add a sibling `lighthouserc.base.test.ts`.

**`ui/.github/lighthouse/audit-sets.test.ts`** — required cases:

- All three levels (`a`, `aa`, `aaa`) export `{ defaultMinScore, assertions }`.
- Floors are exactly `0.85`, `0.90`, `0.95`.
- The set of assertion keys in `aa` is a strict superset of those in `a`.
- The set of assertion keys in `aaa` is a strict superset of those in `aa`.
- Each assertion value is a 2-tuple where index 0 is `"error"` or `"warn"`.
- `aa` includes `color-contrast` as `"error"`; `a` does not include `color-contrast`.
- `aaa` includes `target-size` as `"warn"`.

**`ui/.github/lighthouse/lighthouserc.base.test.ts`** — required cases:

- Happy path: `createBaseConfig({ wcagLevel: "aa", urls: ["http://x"] })` returns `{ ci: { collect, assert, upload } }` with all three keys populated.
- `ci.collect.url` equals the input array exactly (referential or deep).
- `ci.collect.numberOfRuns` defaults to `1`; explicit `numberOfRuns: 3` flows through.
- `ci.collect.settings.onlyCategories` equals `["accessibility"]`.
- `ci.collect.settings.preset` defaults to `"desktop"`; `settingsOverrides: { preset: "mobile" }` overrides to `"mobile"` while preserving the rest.
- `ci.assert.assertions["categories:accessibility"]` is `["error", { minScore: 0.9 }]` for AA default.
- `minScore: 0.5` override is reflected in `ci.assert.assertions["categories:accessibility"][1].minScore`.
- AA returned assertions include `color-contrast`; A returned assertions do not.
- `ci.upload.target === "filesystem"` and `outputDir === "./.lighthouseci"`.
- Error path: `urls: []` throws with a message mentioning "non-empty".
- Error path: `urls: undefined` throws.
- Error path: `wcagLevel: "z"` throws with a message mentioning the bad level.

Run `pnpm coverage` and confirm `audit-sets.cjs` and `lighthouserc.base.cjs` each reach ≥ 95% statements/lines/branches. If foundation excluded these files from coverage temporarily (see foundation §8), this PR must remove that exclusion.

## Inputs from other workstreams

None. This workstream stands on its own once foundation lands.

## Out of scope

- Wiring this into a workflow — that's Workstream B.
- The consumer's `ui/lighthouserc.cjs` — that's Workstream C.
- PR comment generation — that's Workstream D.
- Mobile preset, Pages hosting, MSW path — see plan open questions, not in v1.

## Done when

- `audit-sets.cjs` and `lighthouserc.base.cjs` are fully implemented; no foundation stubs remain.
- The smoke check command in this spec prints `OK`.
- `pnpm run lint` is green.
- A `patch` changeset describes the change.
- Draft PR open against `canonical/landscape-ui:main`.
