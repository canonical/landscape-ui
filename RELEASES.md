# Landscape UI Release & Versioning Guide

## Overview

Landscape UI follows the [Landscape Server Release Cycle](https://docs.google.com/document/d/1sKAp5IvArpfArhMNojFwKOHm9LEdHKB4Et6tu1_-0GY/edit?tab=t.0). Our versioning uses **CalVer** ($YY.MM.Point.Patch$) to align with Ubuntu LTS cycles. We use **Changesets** to manage our changelog and automated build branches for PPA deployments.

## 1. Branching Strategy

| Branch          | Release Tier      | Logic                                                                    |
|-----------------|-------------------|--------------------------------------------------------------------------|
| `dev`           | **Development**   | Internal testing. Deploys to  `ppa-build-dev`.                           |
| `main`          | **Beta**          | Feature-complete but may have breaking changes. Deploys to  `ppa-build`. |
| `stable`        | **Latest Stable** | Production-ready with latest features. Updated every 6 months.           |
| `release/YY.04` | **LTS**           | Mission-critical stability.                                              |

---

## 2. The Development Workflow

To ensure our changelog is accurate, every meaningful change requires a "Changeset".

### Step 1: Create a Changeset

Before pushing your code, run:

```bash
pnpm changeset
```

- **Select Type:** Choose `patch` for fixes or `minor` for new features.
- **Description:** Write a concise summary of the change.
- **Result:** A small `.md` file is created in `.changeset/`. **Commit this file** with your code.

### Step 2: Push & Build

When you push to `dev` or `main`, the CI automatically:

1. Calculates the version based on the branch and date (e.g., `26.04.0.45-beta`).
2. Bakes the version and commit hash into the UI.
3. Pushes the compiled artifacts to the corresponding `ppa-build-*` branch.

---

## 3. Backporting to LTS

If a critical bug affects an older LTS (e.g., `24.04`), follow this flow:

1. `git checkout release/24.04`.
2. `git cherry-pick <commit-hash>` your fix from `main`.
3. Run `pnpm changeset` on the LTS branch.
4. `git push`. The CI will generate a point release (e.g., `24.04.1.12`).

---

## 4. UI Version Identification

You can verify the current version and build hash directly in the UI. We inject these values at build time to ensure the `LandscapeActions.tsx` component shows correct information in the sidebar.

**Reminder:** if the version in your UI ends in `-dev` or `-beta`, you are on a testing branch. Production environments should always show a clean `YY.04.X.X` version.
