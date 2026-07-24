## Summary

Summarize the changes made in this pull request. Include any relevant context or background information that would help reviewers understand the purpose and scope of the changes.

## Release Impact

Pick the target branch (see [RELEASES.md](../RELEASES.md) for the full model):

- [ ] `dev` — internal testing → publishes to `ppa-build-dev`
- [ ] `main` — next beta → publishes to `ppa-build`
- [ ] `release/YY.MM` — point release on a maintained cycle → publishes to `ppa-build-YY.MM` (and to `ppa-build-stable` if this is the currently-promoted branch). Specify cycle: `release/____`

Change type (tick one):

- [ ] Patch (fix)
- [ ] Minor (feature)
- [ ] Major (breaking)

> The change-type label is informational and only affects how the entry is rendered in the CHANGELOG. The actual version is computed from the branch and CalVer cycle — `pnpm changeset`'s `patch`/`minor` choice does not influence it.

## Checklist

- [ ] **Changeset added** — I have run `pnpm changeset` (or `pnpm changeset --empty` if no CHANGELOG line is warranted) and committed the resulting `.md` file. Required for PRs targeting `main` and `release/*`; enforced by the `Changeset check` workflow.
- [ ] **UI verified** — I have verified the changes locally.
- [ ] **Linting clean** — No linting errors are present (especially in `scripts/`).

## Reviewer Setup

This section is intended to aid reviewers in finding what page(s) of the ui was changed, and knowing if any special conditions are required for running the code.

**MSW (Mock Service Worker)**

- [ ] MSW must be enabled (`VITE_MSW_ENABLED=true` in `.env.local`)
- [ ] MSW not required

**Backend**

- [ ] A specific backend branch from Landscape server must be utilized locally — Branch: `______`
- [ ] No specific backend branch required

**Where to Find the Changes**

_Describe where in the UI the changes are visible and how to navigate there (if applicable). Paste a direct URL to the new page/component if applicable (e.g. `http://localhost:5173/...`):_

> **Example:** To test restarting an instance — navigate to the home page → click **Instances** → select an instance → open the **Operations** action menu → click **Restart**.
>
> _describe here_

**Testing Instructions** _(optional)_

_Describe any special testing instructions:_

1.

**Screenshots** _(optional)_

<!-- Attach screenshots of UI changes -->

---

## Versioning Reminder

> [!IMPORTANT]
> Landscape UI uses **CalVer** (`YY.MM.Point.Build`). Version derivation by branch:
>
> - `main` / `point/*` → `YY.MM.0.<run>-beta`
> - `dev` → `YY.MM.0.<run>-dev`
> - `release/YY.MM` → `YY.MM.1.<run>` (cycle pinned by branch name)
