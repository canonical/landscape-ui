# Repository rulesets

This directory holds GitHub **ruleset definitions** as version-controlled JSON.
The files here are the source of truth for branch-protection policy and serve
as the *documented information* required by ISO 9001 §7.5 and the change-control
controls in ISO/IEC 27001 A.8.32. Committing the JSON makes the policy
auditable, reviewable via PR, and reproducible across environments.

> ⚠️  These files **do not** apply themselves. After a change is merged, a repo
> admin must push the ruleset to GitHub using the steps below. CI does not do
> this automatically (yet).

## Files

| File | Purpose |
|---|---|
| [protected-branches.json](protected-branches.json) | Pull-request, status-check, signed-commit, and force-push rules covering `main`, `release/*`, and `point/*`. Excludes `changeset-release/**` so the Changesets bot can push to its own branches. |

## Applying a ruleset

Requires a token with the `repo` and `admin:repo_hook` scopes (a repo admin's
PAT or `gh auth login --scopes "repo,admin:repo_hook"`).

### Create (first time)

```bash
gh api \
  --method POST \
  -H "Accept: application/vnd.github+json" \
  /repos/canonical/landscape-ui/rulesets \
  --input .github/rulesets/protected-branches.json
```

Note the `id` field in the response — you'll need it to update later.

### Update (after editing the JSON)

```bash
RULESET_ID=<id from create response, or `gh api /repos/canonical/landscape-ui/rulesets` to list>

gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  /repos/canonical/landscape-ui/rulesets/$RULESET_ID \
  --input .github/rulesets/protected-branches.json
```

### Inspect what's currently live

```bash
gh api /repos/canonical/landscape-ui/rulesets
gh api /repos/canonical/landscape-ui/rulesets/$RULESET_ID
```

## Required status checks

The `required_status_checks` list uses **job names** as they appear in the
Checks tab on a PR. The current set maps to:

| Context | Workflow | Job |
|---|---|---|
| `eslint` | [.github/workflows/lint.yml](../workflows/lint.yml) | `eslint` |
| `prettier` | [.github/workflows/lint.yml](../workflows/lint.yml) | `prettier` |
| `stylelint` | [.github/workflows/lint.yml](../workflows/lint.yml) | `stylelint` |
| `unit-tests` | [.github/workflows/run-tests.yml](../workflows/run-tests.yml) | `unit-tests` |
| `e2e-tests` | [.github/workflows/run-tests.yml](../workflows/run-tests.yml) | `e2e-tests` |
| `verify` | [.github/workflows/changeset-check.yml](../workflows/changeset-check.yml) | `verify` |

If a workflow or job is renamed, update both the workflow file **and** this
ruleset in the same PR, otherwise the rename will silently bypass the gate
until the ruleset catches up.
