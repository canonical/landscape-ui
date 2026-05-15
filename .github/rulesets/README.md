# Repository rulesets

This directory holds GitHub **ruleset definitions** as version-controlled JSON.
The files here are the source of truth for branch-protection policy and serve
as the _documented information_ required by ISO 9001 §7.5 and the change-control
controls in ISO/IEC 27001 A.8.32. Committing the JSON makes the policy
auditable, reviewable via PR, and reproducible across environments.

> ⚠️ These files **do not** apply themselves. After a change is merged, a repo
> admin must push the ruleset to GitHub using the steps below. CI does not do
> this automatically (yet).

## Files

| File                                               | Purpose                                                                                          |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [protected-branches.json](protected-branches.json) | Pull-request, status-check, signed-commit, force-push, and Copilot-review rules covering `main`. |

The currently-deployed ruleset id is **`16386358`** (canonical/landscape-ui).
The JSON in this directory is the canonical definition; it omits the
server-assigned `id`, `source`, and `source_type` fields that GitHub adds
when you `GET` a ruleset — keep them out when committing.

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
gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  /repos/canonical/landscape-ui/rulesets/16386358 \
  --input .github/rulesets/protected-branches.json
```

If the id ever changes (ruleset re-created), find the new one with
`gh api /repos/canonical/landscape-ui/rulesets --jq '.[] | {id,name}'`.

### Inspect what's currently live

```bash
gh api /repos/canonical/landscape-ui/rulesets
gh api /repos/canonical/landscape-ui/rulesets/16386358
```

### Diff the committed JSON against what's live

```bash
diff <(gh api /repos/canonical/landscape-ui/rulesets/16386358 \
       --jq 'del(.id, .source, .source_type, .created_at, .updated_at, .node_id, .current_user_can_bypass, .links)') \
     <(jq . .github/rulesets/protected-branches.json)
```

A clean diff means the committed source matches reality — what you want
before signing off an ISO 9001 audit cycle.

## Required status checks

The `required_status_checks` list uses **`<workflow name> / <job id>`** as
the context (the fully-qualified form GitHub displays in the Checks tab).
This makes the gate robust against another workflow defining a job with
the same name. The current set maps to:

| Context                            | Workflow                                                                        | Job          |
| ---------------------------------- | ------------------------------------------------------------------------------- | ------------ |
| `Lint & format / eslint`           | [.github/workflows/lint.yml](../workflows/lint.yml)                             | `eslint`     |
| `Lint & format / prettier`         | [.github/workflows/lint.yml](../workflows/lint.yml)                             | `prettier`   |
| `Lint & format / stylelint`        | [.github/workflows/lint.yml](../workflows/lint.yml)                             | `stylelint`  |
| `Tests + TICS on PRs / unit-tests` | [.github/workflows/run-tests-and-tics.yml](../workflows/run-tests-and-tics.yml) | `unit-tests` |
| `Tests + TICS on PRs / e2e-tests`  | [.github/workflows/run-tests-and-tics.yml](../workflows/run-tests-and-tics.yml) | `e2e-tests`  |
| `Changeset check / verify`         | [.github/workflows/changeset-check.yml](../workflows/changeset-check.yml)       | `verify`     |

If a workflow `name:` or job id is renamed, update the workflow file,
`protected-branches.json`, and this table in the same PR, otherwise the
required-check configuration will drift from the checks GitHub actually
produces for protected pull requests.

## Copilot review

`copilot_code_review` is enabled with `review_on_push: true`. This requires
GitHub Copilot Enterprise on the org; if Copilot is ever turned off, drop
that rule from the JSON and re-apply or the ruleset push will fail.
