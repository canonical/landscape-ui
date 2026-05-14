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

## Versioning Reminder

> [!IMPORTANT]
> Landscape UI uses **CalVer** (`YY.MM.Point.Build`). Version derivation by branch:
>
> - `main` / `point/*` → `YY.MM.0.<run>-beta`
> - `dev` → `YY.MM.0.<run>-dev`
> - `release/YY.MM` → `YY.MM.1.<run>` (cycle pinned by branch name)
