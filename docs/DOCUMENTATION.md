# User-Facing Documentation

Landscape's public documentation lives in a separate repository:
[canonical/landscape-documentation](https://github.com/canonical/landscape-documentation).
When a change in this repository is user-facing, it needs a companion docs PR
against that repository. This document explains when and how.

## When a docs PR is required

Open a companion docs PR when a change alters what users see or do in the web
portal, for example:

- A new page, feature, or workflow
- Changed navigation, labels, or flow of an existing documented workflow
- Removed or renamed functionality that the docs reference
- Changed prerequisites, defaults, or limitations that the docs state

No docs PR is needed for internal refactors, visual polish that doesn't change
any documented workflow, test-only changes, or tooling changes.

When in doubt, search the docs repo for the affected page or workflow name; if
it's documented, it needs updating.

## Where the docs live locally

Clone the docs repo as a sibling of this repository:

```bash
git clone https://github.com/canonical/landscape-documentation ../landscape-documentation
```

## Working in the docs repo

The docs repo has its own `AGENTS.md` at the root — read and follow it. It
covers the Diátaxis structure, MyST authoring conventions, accuracy rules, and
build/check commands. Key points:

- Docs for the new web portal (this codebase) live under
  `docs/how-to-guides/web-portal/web-portal-24-04-or-later/`. The classic
  portal is documented separately under `classic-web-portal/` — don't edit it
  for changes made here.
- Reference material (API, configuration, terms) lives under `docs/reference/`.
- Landscape has three editions (SaaS, Managed, self-hosted). State
  applicability explicitly when behavior differs — for example, a
  feature-flagged or unreleased feature may be on SaaS before self-hosted.
- Run the required checks from the `docs/` directory before opening the PR:

  ```bash
  make spelling
  make linkcheck
  ```

## Branch targeting

The docs repo has two long-lived branches (see the internal
"Landscape documentation repositories" page for the full model):

- `main` — the latest published docs. Target `main` for corrections and for
  documenting behavior that is already released.
- `develop` — collects docs for unreleased Landscape features. For an
  unreleased feature, create (or contribute to) a long-standing feature branch
  off `develop` — one branch per feature, shared by everyone working on that
  feature — and merge it into `develop` when the feature is complete.
  `develop` is merged into `main` when the release ships.

Before creating a new feature branch in the docs repo, check whether one
already exists for the feature.

## PR checklist integration

The pull request template in this repository includes a **Docs** section. Every
PR must either link the companion docs PR or state that the change is not
user-facing.
