# Lighthouse a11y — config & reusable workflow

> **Foundation stub.** This page will be filled by Workstream C (`lighthouse-a11y/specs/04-feedback-layer.md`).

This directory holds the shared Lighthouse CI configuration and the source for the reusable GitHub Actions workflow. External adopters consume the workflow via `workflow_call`; the full input reference and override patterns will land here.

## Layout

| Path | Purpose | Owner |
| --- | --- | --- |
| `audit-sets.cjs` | WCAG-keyed audit matrices (a / aa / aaa) | Workstream A |
| `lighthouserc.base.cjs` | `createBaseConfig` factory | Workstream A |
| `build-comment.cjs` | Markdown PR-comment generator (no deps) | Workstream C |
| `urls.public.txt` | Unauthenticated URL list | Workstream B |
| `urls.authenticated.txt` | Authenticated URL list (v1.1) | Workstream B |
| `__fixtures__/` | Synthetic manifests + lhr-*.json for `build-comment` tests | Workstream C |

See `../../../lighthouse-a11y/` for the per-workstream specs.
