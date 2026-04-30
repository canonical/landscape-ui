# Landscape UI Release & Versioning Guide

## Overview

Landscape UI uses **CalVer** (`YY.MM.Point.Build`) aligned with the Ubuntu release cadence. Every release cycle — LTS or interim — gets its own long-lived branch, and **Changesets** drives the per-PR CHANGELOG. CI builds each branch into a dedicated `ppa-build-*` branch that the PPAs consume.

## 1. Branching Model

| Branch             | Tier           | Versions               | Publishes to                                                   |
| ------------------ | -------------- | ---------------------- | -------------------------------------------------------------- |
| `dev`              | Development    | `<cycle>.0.<run>-dev`  | `ppa-build-dev`                                                |
| `main`             | Beta           | `<cycle>.0.<run>-beta` | `ppa-build`                                                    |
| `point/YYYY-MM-DD` | Pinned beta    | `<cycle>.0.<run>-beta` | `ppa-build-point`                                              |
| `release/YY.MM`    | Released cycle | `YY.MM.1.<run>`        | `ppa-build-YY.MM` (+ `ppa-build-stable` if currently promoted) |

`<cycle>` for `dev` / `main` / `point/*` is derived from the calendar — the upcoming Ubuntu cut we are working toward (Jan-Apr → `YY.04`, May-Oct → `YY.10`, Nov-Dec → `(YY+1).04`). For `release/YY.MM` it is **pinned to the branch name**, so a hotfix backported in November still ships from the correct cycle.

LTS vs. interim is a **policy** applied to a `release/*` branch (support window, who's allowed to merge, when it's archived) — not a different naming convention. `release/26.04` and `release/26.10` use the same shape; the LTS just lives longer and accepts a narrower set of changes.

### "Latest stable"

There is no `stable` branch. Instead, the workflow auto-derives "latest stable" as the highest-numbered `release/YY.MM` branch on origin. Whenever CI builds that branch, the artifact is published both to its own `ppa-build-YY.MM` and to `ppa-build-stable` — so cutting `release/26.10` later this year automatically makes 26.10 the new stable as soon as the first build runs, no manual flip required.

If you ever need to override that — for example, to demote a fresh cut that turned out to be broken, or to delay promotion of a new cycle — set the `STABLE_RELEASE_BRANCH` Actions variable to the branch you want pinned (e.g. `release/26.04`). While the variable is set, auto-derivation is skipped and only that branch publishes to `ppa-build-stable`. Unset the variable to return to automatic behaviour.

## 2. Development Workflow

Every meaningful change requires a **Changeset** so the CHANGELOG stays accurate.

### Step 1: Create a Changeset

```bash
pnpm changeset
```

- **Type:** `patch` for fixes, `minor` for features, `major` for breaking changes. The type only affects how the entry is grouped in `CHANGELOG.md` — the actual version is computed from the branch + CalVer + run number, not from the type.
- **Description:** A concise one-liner describing the change.
- A small `.md` file lands under `.changeset/`. **Commit it with your code.**

If your change genuinely does not warrant a CHANGELOG entry (a comment-only tweak, internal CI change), use `pnpm changeset --empty`. The `Changeset check` workflow blocks PRs to `main` and `release/*` that have no changeset at all.

### Step 2: Push & Build

When you push, the `Release and PPA Build` workflow:

1. Computes the version (`scripts/calculate-version.cjs`) from branch + date + `GITHUB_RUN_NUMBER`.
2. Bakes version + commit hash into the UI via `VITE_APP_VERSION` and `VITE_APP_COMMIT`.
3. Force-pushes the compiled artifact to the matching `ppa-build-*` branch.
4. If the source branch is the current "latest stable" (auto-derived as the highest-numbered `release/YY.MM` on origin, or whatever `STABLE_RELEASE_BRANCH` overrides it to), also force-pushes to `ppa-build-stable`.
5. Builds an unsigned `.deb` from the same artifact.

The workflow uses `concurrency: release-${{ github.ref }}` so back-to-back pushes to the same branch serialize instead of racing each other to the `ppa-build-*` target.

## 3. Cutting a New Release Cycle

Run this on cut day (typically the day of the Ubuntu release, late April or late October):

```bash
git fetch origin
git checkout -B release/YY.MM origin/main
git push -u origin release/YY.MM
```

The first push triggers a build at `YY.MM.1.0` (or whatever the run number is) and creates `ppa-build-YY.MM`. Because the new branch is the highest-numbered `release/*` on origin, the same build also publishes to `ppa-build-stable` automatically — no extra step needed. The previous stable cycle's branch keeps living and keeps publishing to its own `ppa-build-*`; only the `ppa-build-stable` alias moves.

If for any reason you don't want the new cut to take over `ppa-build-stable` immediately (e.g. you want a few days of soak before promoting), set the `STABLE_RELEASE_BRANCH` Actions variable to the previous cycle's branch before the first push:

> Repository Settings → Secrets and variables → Actions → Variables → `STABLE_RELEASE_BRANCH = release/YY.MM`

Remove the variable when you're ready to let auto-promotion take over again.

## 4. Backporting / Point Releases

For a fix that needs to land on a maintained cycle:

```bash
git checkout release/YY.MM
git cherry-pick <commit-hash>      # or apply directly
pnpm changeset                     # patch
git push
```

CI generates the next point-release version (`YY.MM.1.<run>`) and publishes it to the cycle's PPA.

The same flow works for any `release/*` branch — there is no separate "LTS-only" path. The only differences between maintaining an LTS and an interim cycle are operational: how long you keep accepting backports, how conservative you are about what gets cherry-picked, and when you eventually archive the branch.

## 5. Pinned Betas (`point/*`)

Use a `point/*` branch when `main` has moved ahead with breaking changes but you need to ship a beta from an older known-good commit plus selected fixes.

```bash
git checkout -b point/2026-04-14 <base-commit>
git cherry-pick <fix-1>
git cherry-pick <fix-2>
pnpm changeset                     # patch
git push -u origin point/2026-04-14
```

The build publishes to `ppa-build-point` (separate from `main`'s `ppa-build`, so the two never collide). When `main` catches up and you no longer need the pinned line, delete the branch:

```bash
git push origin --delete point/2026-04-14
```

Multiple point releases per month: use the date suffix to keep each unique (e.g. `point/2026-04-14`, `point/2026-04-28`).

## 6. UI Version Identification

The current version and commit hash are baked into `VITE_APP_VERSION` / `VITE_APP_COMMIT` and surfaced in `UserInfo.tsx`. As a quick sanity check:

- `*-dev` → built from `dev`
- `*-beta` → built from `main` or `point/*`
- `YY.MM.1.X` (no suffix) → built from `release/YY.MM`

A production install should always show a clean `YY.MM.1.X` version with no suffix.

## 7. Troubleshooting

### A PR was merged to `main` or `release/*` without a Changeset

The CI gate (`Changeset check`) should catch this on the PR. If it slipped past — for example, because the gate was disabled for an emergency merge — the symptom is: the build runs, the artifact ships, but `CHANGELOG.md` is not updated, `package.json` is not bumped, and no GitHub Release/Tag is created.

To fix it after the fact:

1. Branch from the affected branch.
2. Run `pnpm changeset` and describe the missing change(s) in one entry.
3. Open a PR against the same branch.

The next CI run consumes the changeset and produces a release that covers the previously-missed work.

### `release/*` builds picking up the wrong cycle

`scripts/calculate-version.cjs` validates branch names — `release/26.04` and `release/26.10` are accepted; anything else throws. If a build is failing with `Invalid release branch name`, the branch was created with a malformed name; rename it (`git branch -m`) and re-push.

### Pinning or demoting "latest stable"

Auto-promotion picks the highest-numbered `release/YY.MM`. To override — for example, to keep stable on the previous cycle while a fresh cut soaks, or to demote a freshly-promoted branch that turned out to have a critical bug — set the `STABLE_RELEASE_BRANCH` Actions variable in repo settings to the branch you want pinned. The next build of that branch (a real fix or an empty changeset push if you want it to take effect immediately) will publish to `ppa-build-stable`. Remove the variable to resume automatic promotion.
