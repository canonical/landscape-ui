# Lighthouse a11y — config & reusable workflow

This directory ships the shared Lighthouse CI configuration used by `canonical/landscape-ui` and the source for the reusable GitHub Actions workflow that any Canonical project can adopt.

## What this is

A `workflow_call` reusable workflow plus a small, dependency-free config library that lets a repo gate its PRs on Lighthouse's accessibility category without re-implementing the audit matrix, the LHCI runner settings, or the sticky-comment generator. Scans run against the **dev server** (not a production build) so authors can iterate on accessibility regressions in the same edit-save loop as the rest of their work. Configuration is caller-driven: WCAG level, score floor, URL list, run mode (block vs. annotate), and auth mode (public / MSW-mocked / both) are all inputs.

## Quick start

In any consumer repo, add a workflow under `.github/workflows/`:

```yaml
name: Lighthouse a11y

on:
  pull_request:
    branches: [main]

jobs:
  a11y:
    uses: canonical/landscape-ui/.github/workflows/lighthouse-a11y.reusable.yml@main
    with:
      wcag-level: aa
      mode: annotate
      auth-mode: public
      urls-file: .github/lighthouse/urls.public.txt
```

Provide a `urls.public.txt` listing one path per line (paths starting with `/` are prefixed with the workflow's `serve-url`). That's the minimum viable adoption.

## Full input reference

The reusable workflow declares every input in [lighthouse-a11y.reusable.yml](../workflows/lighthouse-a11y.reusable.yml); the surface and defaults are owned by [specs/02-reusable-workflow.md](../../lighthouse-a11y/specs/02-reusable-workflow.md). Common inputs:

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `wcag-level` | string | `aa` | `a` / `aa` / `aaa`. |
| `min-score` | string | `""` | Override the per-level floor. Empty string = use the level default. |
| `urls-file` | string | `""` | Path (relative to repo root) to a newline-separated URL list. |
| `urls` | string | `""` | Inline newline-separated URL list. Use this *or* `urls-file`, not both. |
| `mode` | string | `block` | `block` fails the workflow on assertion violation; `annotate` only comments. |
| `auth-mode` | string | `public` | `public` / `msw` / `both`. |
| `config-path` | string | `./lighthouserc.cjs` | Caller's consumer config. |
| `build-command` | string | `""` | Empty by default — we scan the dev server, so no build step. Set this if your repo prefers `vite preview` over `vite dev`. |
| `serve-command` | string | `pnpm dev --host 0.0.0.0 --port 5173` | Must serve at `serve-url`. Override if your dev command differs. |
| `serve-url` | string | `http://localhost:5173` | Base URL paths from `urls-file` are joined against. |
| `pr-comment` | boolean | `true` | Post the sticky score-table comment back on the PR. |
| `upload-artifact-name` | string | `lighthouse-report` | Artifact name for the LHCI report bundle. |

See the spec for the complete input surface and the env-var contract between the workflow and the config.

## Extending the base config

Consumers `require()` the shared base factory and apply repo-specific overrides:

```js
const {
  createBaseConfig,
} = require("./.github/lighthouse/lighthouserc.base.cjs");

const config = createBaseConfig({
  wcagLevel: process.env.LHCI_WCAG_LEVEL ?? "aa",
  urls: ["http://localhost:5173/"],
});

// Override an audit (e.g. while remediating a known regression):
config.ci.assert.assertions["heading-order"] = ["warn"];

module.exports = config;
```

The factory's signature is locked in [specs/00-foundation.md §2](../../lighthouse-a11y/specs/00-foundation.md). It returns the standard LHCI shape with `ci.collect`, `ci.assert`, and `ci.upload` populated.

## WCAG levels

[audit-sets.cjs](audit-sets.cjs) exports three curated audit matrices. Each entry carries an inline comment with the WCAG success criterion it most closely covers (informational — Lighthouse audits don't map 1:1 to WCAG).

| Level | Floor | Coverage |
| --- | --- | --- |
| `a` | `0.85` | Document-level basics: `image-alt`, `document-title`, `html-has-lang`, `link-name`, `button-name`, `valid-lang`, `meta-viewport` (warn). |
| `aa` | `0.90` | All of A plus `color-contrast`, `label`, the ARIA validity audits, `tabindex`, `frame-title`, `bypass`, list-structure audits, and `duplicate-id-aria`. |
| `aaa` | `0.95` | All of AA plus `target-size`, `focus-traps`, `focusable-controls`, `heading-order`, `skip-link`, `use-landmarks` (all `warn` — these audits are still maturing in Lighthouse). |

## Layout

| Path | Purpose |
| --- | --- |
| `audit-sets.cjs` | WCAG-keyed audit matrices (`a` / `aa` / `aaa`). |
| `lighthouserc.base.cjs` | `createBaseConfig` factory. |
| `build-comment.cjs` | Markdown PR-comment generator (no runtime deps). |
| `urls.public.txt` | Unauthenticated URL list used by the PR job. |
| `urls.authenticated.txt` | Authenticated URL list (v1.1 / MSW auth-mode). |
| `__fixtures__/` | Synthetic manifests + `lhr-*.json` for `build-comment` tests. |

## Links

- [Lighthouse CI docs](https://github.com/GoogleChrome/lighthouse-ci/tree/main/docs)
- [Lighthouse accessibility audit reference](https://developer.chrome.com/docs/lighthouse/accessibility)
- Per-workstream specs: [`../../lighthouse-a11y/`](../../lighthouse-a11y/).
