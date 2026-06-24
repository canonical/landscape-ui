# Landscape UI Release & Versioning Guide

## Overview

Landscape UI uses **CalVer** (`YY.MM.Point.Build`) aligned with the Ubuntu release cadence. Every release cycle — LTS or interim — gets its own long-lived branch, and **Changesets** drives the per-PR CHANGELOG. CI builds each branch into a dedicated `ppa-build-*` branch that the PPAs consume.

## 1. Branching Model

| Branch          | Tier                                   | Versions                                 | Publishes to                                                   |
| --------------- | -------------------------------------- | ---------------------------------------- | -------------------------------------------------------------- |
| `main`          | Integration trunk / CHANGELOG baseline | `<cycle>.0.<count>-beta`                 | — (no build; version PR only)                                  |
| `release/YY.MM` | Cycle base                             | `YY.MM.0.<count>` / `YY.MM.0.<count>-rc` | `ppa-build-YY.MM` (+ `ppa-build-stable` if currently promoted) |
| `point/YY.MM.N` | Point release (Nth of the cycle)       | `YY.MM.N.<count>` / `YY.MM.N.<count>-rc` | `ppa-build-YY.MM.N`                                            |

`main` does **not** publish an artifact; it is the integration trunk. The only Changesets work it does is run `changeset-version.yml` on each push to maintain its "Version Packages" PR — merging that PR consumes the accumulated `.changeset/*.md` into the canonical `CHANGELOG.md` and bumps `package.json`. That consumption is what keeps the backlog drained, so a freshly-cut slice inherits only the changesets added since the last baseline rather than the entire history. Merging it is never forced; nothing ships off `main`.

Everything that ships is pinned by its branch name. `release/YY.MM` is the base of a cycle (point segment `0`). `point/YY.MM.N` is the Nth point release of that cycle, cut from `main`. Both build as a candidate (`-rc`) until promoted to a release — the `-rc` rule is uniform across `release/*` and `point/*`; see §5. The build/publish flow (`release-and-build.yml`) runs only for `release/*` and `point/*`.

`<count>` is a per-branch counter derived from git history, not from `GITHUB_RUN_NUMBER`:

- For `main`: total commit count reachable from `HEAD` (large number, but monotonic).
- For `release/*` / `point/*`: **tag-anchored** — the number of _release-worthy_ commits since the branch's `.0` build tag (`v<version>.0[-rc]`, created on the first build). "Release-worthy" excludes housekeeping commit types (`chore`/`ci`/`docs`/`test`/`style`), so a formatting- or CI-only commit doesn't burn a version. The first build of a freshly cut `release/26.10` is `26.10.0.0-rc` (no anchor yet → HEAD is the cut); the first cherry-picked fix is `26.10.0.1-rc`; and so on. The first point release is `point/26.10.1` → `26.10.1.0-rc`, the next `point/26.10.2` → `26.10.2.0-rc`. (Every build carries `-rc` until its branch is promoted via `RELEASED_BRANCHES`, §5 — the counter is independent of the suffix.) Counters never collide across branches, are immune to `main` drift, and don't get inflated by builds running elsewhere. CI tags every built version `v<version>`, which doubles as the next build's anchor and an immutable version↔commit record.

The cycle (`YY.MM`) and point number (`N`) are **pinned by the branch name** for everything that ships, so a release never drifts across cycles on rebuild. `<cycle>` is calendar-derived only for `main`'s never-shipped version label — the upcoming Ubuntu cut we are working toward (Jan-Apr → `YY.04`, May-Oct → `YY.10`, Nov-Dec → `(YY+1).04`).

LTS vs. interim is a **policy** applied to a `release/*` branch (support window, who's allowed to merge, when it's archived) — not a different naming convention. `release/26.04` and `release/26.10` use the same shape; the LTS just lives longer and accepts a narrower set of changes.

### "Latest stable"

There is no `stable` branch. Instead, the workflow auto-derives "latest stable" as the highest-numbered `release/YY.MM` branch on origin. Whenever CI builds that branch, the artifact is published both to its own `ppa-build-YY.MM` and to `ppa-build-stable` — so cutting `release/26.10` later this year automatically points the stable alias at 26.10 as soon as the first build runs, no manual flip required.

Note that auto-derivation only moves the `ppa-build-stable` _alias_; it does **not** drop the `-rc` suffix. A cycle base ships as a candidate (`YY.MM.0.<count>-rc`) until you list its branch in `RELEASED_BRANCHES` (§5), exactly like a point release. So promoting a cycle to a clean stable is a deliberate two-part act: it becomes the alias automatically, but ships clean only once listed.

If you ever need to override that — for example, to demote a fresh cut that turned out to be broken, or to delay promotion of a new cycle — set the `STABLE_RELEASE_BRANCH` Actions variable to the branch you want pinned (e.g. `release/26.04`). While the variable is set, auto-derivation is skipped and only that branch publishes to `ppa-build-stable`. Unset the variable to return to automatic behaviour.

## 2. Development Workflow

Every meaningful change requires a **Changeset** so the CHANGELOG stays accurate.

### Step 1: Create a Changeset

```bash
pnpm changeset
```

- **Type:** `patch` for fixes, `minor` for features, `major` for breaking changes. The type only affects how the entry is grouped in `CHANGELOG.md` — the actual version is computed from the branch name + the tag-anchored release-worthy commit count, not from the type.
- **Description:** A concise one-liner describing the change.
- A small `.md` file lands under `.changeset/`. **Commit it with your code.**

If your change genuinely does not warrant a CHANGELOG entry (a comment-only tweak, internal CI change), use `pnpm changeset --empty`. The `Changeset check` workflow blocks PRs to `main` and `release/*` that have no changeset at all.

### Step 2: Push & Build

> Pushes to `main` only run `changeset-version.yml`, which maintains the "Version Packages" PR (CHANGELOG + `package.json`) — no artifact is built or published. The build flow below runs for `release/*` and `point/*`.

When you push to a publishing branch, the `Release and PPA Build` workflow:

1. Computes the version (`scripts/calculate-version.cjs`) from the branch name + the tag-anchored release-worthy commit count. If that version is already tagged (a housekeeping-only push), the rest of the workflow is skipped as a no-op.
2. Bakes version + commit hash into the UI via `VITE_APP_VERSION` and `VITE_APP_COMMIT`.
3. Force-pushes the compiled artifact to the matching `ppa-build-*` branch.
4. If the source branch is the current "latest stable" (auto-derived as the highest-numbered `release/YY.MM` on origin, or whatever `STABLE_RELEASE_BRANCH` overrides it to), also force-pushes to `ppa-build-stable`.
5. Tags the source commit `v<version>` (immutable record + next build's counter anchor).
6. Builds an unsigned `.deb` from the same artifact.

The workflow uses `concurrency: release-${{ github.ref }}` so back-to-back pushes to the same branch serialize instead of racing each other to the `ppa-build-*` target.

## 3. Cutting a New Release Cycle

Run this on cut day (typically the day of the Ubuntu release, late April or late October):

```bash
git fetch origin
git checkout -B release/YY.MM origin/main
git push -u origin release/YY.MM
```

The first push triggers a build at `YY.MM.0.0-rc` and creates both `ppa-build-YY.MM` and the `vYY.MM.0.0-rc` anchor tag — a freshly cut branch has no anchor yet, so its HEAD is the cut and the counter starts at `0`. Because the new branch is the highest-numbered `release/*` on origin, the same build also publishes to `ppa-build-stable` automatically — but it ships as a candidate (`-rc`) until you promote the cycle by listing it in `RELEASED_BRANCHES` (§5). The previous stable cycle's branch keeps living and keeps publishing to its own `ppa-build-*`; only the `ppa-build-stable` alias moves.

> **Before the first push**, close any open Changesets-bot "Version Packages" PR targeting `main`. The bot stamps the PR title with the branch's version shape _at the time it opened the PR_; if you merge it onto the freshly cut release branch, the resulting commit subject will look like `26.04.0.86-beta` (a `main`-shape version) even though the actual built artifact is `26.04.0.0`. Letting Changesets re-open the PR fresh on each branch avoids the confusion.

If for any reason you don't want the new cut to take over `ppa-build-stable` immediately (e.g. you want a few days of soak before promoting), set the `STABLE_RELEASE_BRANCH` Actions variable to the previous cycle's branch before the first push:

> Repository Settings → Secrets and variables → Actions → Variables → `STABLE_RELEASE_BRANCH = release/YY.MM`

Remove the variable when you're ready to let auto-promotion take over again.

## 4. Backporting Fixes to a Maintained Cycle

For a fix that needs to land on a released cycle, open a PR targeting that `release/YY.MM` branch (branch protection blocks direct pushes):

```bash
git checkout -b fix/my-backport release/YY.MM
git cherry-pick <commit-hash>      # or apply directly
pnpm changeset                     # patch
git push -u origin fix/my-backport
# then open a PR into release/YY.MM
```

Once merged, CI builds the next patch of the cycle base (`YY.MM.0.<count>`) and publishes it to the cycle's PPA. The same flow works for any `release/*` branch — there is no separate "LTS-only" path. The only differences between maintaining an LTS and an interim cycle are operational: how long you keep accepting backports, how conservative you are about what gets cherry-picked, and when you eventually archive the branch.

## 5. Point Releases (`point/YY.MM.N`)

A point release bundles the current state of `main` into a numbered release within a cycle. Cut it from `main` (where the latest stable code lives), naming it for the cycle it targets and the next point number:

```bash
git fetch origin
git checkout -B point/26.10.2 origin/main
git push -u origin point/26.10.2
```

The first build is `26.10.2.0-rc`, published to `ppa-build-26.10.2`. It is a **candidate** (`-rc`) until you promote it.

### Patches

Land further fixes via PRs into the branch (branch protection blocks direct pushes). Each release-worthy merge bumps the patch counter: `26.10.2.1-rc`, `26.10.2.2-rc`, and so on. Housekeeping-only commits (`chore`/`ci`/`docs`/`test`/`style`) don't bump it — the build for such a push is a no-op (the version is unchanged, so its tag already exists).

### Promoting a candidate to a release

When the candidate is ready, add its branch to the `RELEASED_BRANCHES` Actions variable (comma/space separated; short or `refs/heads/*` form both work):

> Repository Settings → Secrets and variables → Actions → Variables → `RELEASED_BRANCHES = point/26.10.1,point/26.10.2`

The variable governs **both** `point/*` and `release/*` (the cycle base) — listing a branch is what drops its `-rc`. Editing the variable doesn't push a commit, so trigger a build to apply it: either land the next change, or run the workflow manually (Actions → _Release and PPA Build_ → **Run workflow** on the branch). The next build drops the `-rc` suffix (e.g. `26.10.2.3`) and publishes the released artifact to the same `ppa-build-26.10.2`. Branches that aren't listed are always candidates, so nothing ships as a release by accident.

To **demote**, remove the branch from the variable. Note this only applies going forward — from the next release-worthy commit, which builds a fresh `…-rc`. It does **not** retroactively re-stamp the already-published build: that version's `v<version>` tag is immutable, so a rebuild at the same commit recomputes a `…-rc` version whose tag already exists and is skipped. (The artifact is byte-identical either way — only the baked-in version label differs.) If you need the cycle/point base to stop being "latest stable" immediately, pin `STABLE_RELEASE_BRANCH` (§1) rather than relying on demotion.

Each point release gets its own `ppa-build-YY.MM.N` target, so concurrent point releases in the same cycle (e.g. `26.10.1` and `26.10.2`) never collide.

## 6. UI Version Identification

The current version and commit hash are baked into `VITE_APP_VERSION` / `VITE_APP_COMMIT` and surfaced in `UserInfo.tsx`. As a quick sanity check:

- `YY.MM.N.X-rc` (N ≥ 1) → a point-release **candidate** (`point/YY.MM.N`, not yet promoted)
- `YY.MM.N.X` (N ≥ 1, no suffix) → a **released** point release (`point/YY.MM.N`)
- `YY.MM.0.X-rc` → a cycle-base **candidate** (`release/YY.MM`, not yet promoted)
- `YY.MM.0.X` (no suffix) → a **released** cycle base (`release/YY.MM`)
- `*-beta` → `main`'s version label only; never installed

A production install should always show a clean `YY.MM.N.X` version with no `-rc` or `-beta` suffix.

## 7. Troubleshooting

### A PR was merged to `main` or `release/*` without a Changeset

The CI gate (`Changeset check`) should catch this on the PR. If it slipped past — for example, because the gate was disabled for an emergency merge — the symptom is: the build runs, the artifact ships, the `v<version>` tag is created, but `CHANGELOG.md` is not updated and `package.json` is not bumped (those come from the Changesets "Version Packages" PR, which needs a changeset to have anything to roll up).

To fix it after the fact:

1. Branch from the affected branch.
2. Run `pnpm changeset` and describe the missing change(s) in one entry.
3. Open a PR against the same branch.

The next CI run consumes the changeset and produces a release that covers the previously-missed work.

### `release/*` builds picking up the wrong cycle

`scripts/calculate-version.cjs` validates branch names — `release/YY.04`, `release/YY.10`, and `point/YY.MM.N` (e.g. `point/26.10.1`) are accepted; anything else throws. If a build is failing with `Invalid release/point branch name`, the branch was created with a malformed name; rename it (`git branch -m`) and re-push.

### Pinning or demoting "latest stable"

Auto-promotion picks the highest-numbered `release/YY.MM`. To override — for example, to keep stable on the previous cycle while a fresh cut soaks, or to demote a freshly-promoted branch that turned out to have a critical bug — set the `STABLE_RELEASE_BRANCH` Actions variable in repo settings to the branch you want pinned. The next build of that branch (a real fix or an empty changeset push if you want it to take effect immediately) will publish to `ppa-build-stable`. Remove the variable to resume automatic promotion.
