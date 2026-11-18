---
# Weekly changelog maintenance bot
#
# Three jobs, one PR:
#   1. Backfill missing .changeset/*.md files for user-facing PRs merged
#      without one (the Changesets CI gate gap, RELEASES.md section 7).
#   2. Draft the next Debian changelog block in debian/changelog, with
#      CHANGELOG.md as the source of truth for what changed (the way
#      landscape-server's bot maintains standalone/debian/changelog).
#   3. Write the Web portal island of the shared docs release-notes PR in
#      canonical/landscape-documentation, also sourced from CHANGELOG.md.
#
# This is the gh-aw SOURCE file. After editing, regenerate the compiled
# GitHub Actions workflow with:
#
#     gh aw compile changelog-bot
#
# and commit the generated `.github/workflows/changelog-bot.lock.yml` alongside it.
#
# The shared plumbing (engine, runner setup, gh/node/compose installs, threat
# detection, docs push handler) comes from the shared component imported below.
# What stays here is only what differs for this repo: the trigger, the runners,
# the changelog PR's allowed-files, and the prompt body.

on:
  # Fires every Saturday at around 12:00 UTC.
  schedule: weekly on saturday around 12:00 UTC
  # Allow maintainers to trigger a run on demand.
  workflow_dispatch:

permissions:
  contents: read
  # The agent must list open pull requests to enforce "never open a second
  # changelog PR". Without this the token is Contents:read only and every
  # list_pull_requests call returns 403 "Resource not accessible by integration".
  pull-requests: read

# The agent and threat-detection jobs need Docker/AWF, so they target the noble
# amd64 runners; the framework and safe_outputs jobs use the generic
# self-hosted label. These cannot live in a shared component.
runs-on: [self-hosted, noble, amd64]
runs-on-slim: self-hosted

imports:
  - canonical/landscape-internal-docs/.github/workflows/shared/changelog-bot-infra.md@c11434ac07328e440a933b1c5b763f6d850b594a

# The agent never pushes directly; its file edits are turned into a pull request.
# The credential (LANDSCAPE_CHANGELOG_TOKEN, a fine-grained PAT with contents and
# pull-requests read+write on this repo and canonical/landscape-documentation) is
# bound once in the shared component, together with the docs push handler and the
# comment handler. Only the repo-specific changelog PR rules live here.
safe-outputs:
  create-pull-request:
    title-prefix: "build: "
    labels: [changelog, automation]
    team-reviewers: [canonical/landscape]
    draft: false
    if-no-changes: ignore
    # Exactly one changeset PR per run; the docs update goes through the
    # separate push-to-pull-request-branch handler below.
    max: 1
    preserve-branch-name: true
    recreate-ref: true
    # Push with a plain git push rather than the createCommitOnBranch GraphQL
    # path: that path produces commits GitHub does not mark verified for this
    # bot token, and pushSignedCommits then refuses to publish the branch.
    signed-commits: false
    # The bot adds NEW changeset files and, only when a shippable YY.MM-beta.N
    # version is derivable from CHANGELOG.md, prepends ONE twin of the
    # beta-prep stanza to debian/changelog (see "Draft the Debian changelog
    # block": no calculated main label, no per-bullet enumeration); docs edits
    # are delivered by the push handler, so the create handler rejects any
    # other path outright.
    allowed-files: [".changeset/*.md", "debian/changelog"]
    # Stripped from any delivered patch: CHANGELOG.md is the bot's READ-ONLY
    # source of truth (written by the Changesets "Version Packages"
    # automation, never by this bot), and .changeset/README.md / config.json
    # match the allowlist above, so they are excluded explicitly. (gh-aw
    # allowed-files filters by path only, not diff status, so "new files
    # only" for existing changesets and "prepend only, never rewrite existing
    # blocks" for debian/changelog are enforced by the prompt, not the
    # handler.)
    excluded-files: ["CHANGELOG.md", ".changeset/README.md", ".changeset/config.json"]
    # gh-aw v0.89.21 only opts a dot-folder out of the top-level dot-folder
    # protection via a "<dir>/" prefix entry (globs are not matched here).
    protected-files:
      exclude: [".changeset/"]
---

# Weekly changelog maintenance

You maintain three changelog artifacts for Landscape UI, all delivered as ONE pull request against this repository (plus a push to the shared docs PR):

1. **Missing changesets**: author `.changeset/*.md` entries for user-facing pull requests that were merged without one (the gap documented in `RELEASES.md` section 7). The Changesets release automation (`changesets/action`) consumes them; you never write `CHANGELOG.md` yourself.
2. **Debian changelog**: when `CHANGELOG.md`'s top section carries a shippable `YY.MM-beta.N` version, prepend the matching `landscape-dashboard (YY.MM~beta.N-0landscape0)` stanza — a byte-compatible twin of the block `scripts/beta-version-update.cjs` writes (that script owns the format and is the beta prep flow's writer). Never stamp a computed `main` label and never re-spell a release the prep flow already stamped.
3. **Docs release notes**: write the Web portal island of the shared release-notes PR in `canonical/landscape-documentation`, also sourced from `CHANGELOG.md`.

## Hard prohibitions

- NEVER create, edit, or delete `CHANGELOG.md`, `package.json`, or any lockfile. `CHANGELOG.md` is your READ-ONLY source of truth; it is written by the Changesets "Version Packages" automation. This is mechanically enforced by the pull-request handler: `CHANGELOG.md` is stripped from any patch it delivers, and `package.json` plus the lockfiles stay in the default protected-file set.
- NEVER edit an existing `.changeset/*.md` file. Only ever create NEW files under `.changeset/`.
- NEVER rewrite or reorder existing `debian/changelog` blocks. Only ever PREPEND one new block at the top.
- NEVER open a second changelog PR while one is open, and never push to another PR's branch: the safe-output handlers can only CREATE a pull request in this repository. If an open changelog PR is missing entries, report them in a comment (see "Open the pull request") instead of pushing.

## Gather the commits

1. The scan window is time-based: list the commits from the last four weeks against the repository's default branch, not the ref this run was dispatched on: `git log --since="4 weeks ago" --no-merges --pretty=%H%x09%s origin/main`. Always use `origin/main` for the range — a `workflow_dispatch` run may check out a bot or feature branch whose own commits are automation churn, and those must never be classified as product changes. If `origin/main` is not present locally, use the checked-out HEAD and say so in the run output. `main` is squash-merged, so each merged PR is a single commit on this list. Do NOT anchor on `CHANGELOG.md` commits: the `Version Packages` PR on `main` is closed rather than merged before each cut (RELEASES.md section 3), so `CHANGELOG.md` on `main` is stale and a changelog anchor would silently treat undocumented commits as covered. Four weeks against a weekly schedule gives three weeks of overlap with the previous run, so omissions leapfrogged by later merges are still caught; the deduplication rules below prevent double-filing.
2. Skip any commit whose subject has no trailing pull request reference ` (#1234)`. Such commits cannot carry the `(backfills #<N>)` marker the deduplication relies on, so they can never be filed safely; if one looks user-facing, mention it in the PR body under `Changesets to review` instead of backfilling it.
3. Deduplicate the rest by pull request number. For each commit, extract its PR number `<N>` from the trailing ` (#1234)` reference in the subject. Skip the commit if ANY of the following hold:
   a. Its own commit added a NON-EMPTY changeset: run `git show --name-status --format= <commit>` and look for a line with status `A` (added) whose path matches `.changeset/*.md` (ignoring `.changeset/README.md` and `.changeset/config.json`), then read that file — it counts as coverage only if its frontmatter assigns a bump (`major`/`minor`/`patch`) to a package. Only status `A` counts — a modified (`M`) or deleted (`D`) changeset path is NOT coverage. If the commit added ONLY empty changesets (no package/bump in the frontmatter), do NOT backfill one: an empty changeset can be a deliberate choice (e.g. one shared non-empty changeset for a whole PR stack, as in #799). Flag it in the review section below instead.
   b. A pending changeset already covers it: search the existing `.changeset/*.md` files in the working tree for the PR-specific marker `(backfills #<N>)` (match the full number — `#123` must not match `#1234`). Do NOT treat a bare `#<N>` as coverage: that token can be an unrelated issue, Launchpad, or linked-PR reference. Only the `(backfills #<N>)` marker — which every backfilled changeset ends its summary with — means this PR is already covered.
   c. The changelog already covers it: check whether the TOP section of `CHANGELOG.md` (the latest release — everything from the first `## ` heading up to the second) references `#<N>`. `CHANGELOG.md` on `main` is stale (see step 1), so treat this only as an extra deduplication signal, never as proof that older commits are covered.

## Select user-facing commits only

Include only commits that a Landscape administrator would notice. Do not decide from memory or by skimming. Work from the exact `git log` output you collected and classify every commit, one line at a time.

First, write out a classification table with one row per commit, in this exact format:

```
| # | type | user-facing? | subject |
|---|------|--------------|---------|
| 1 | feat | yes | add hash-id component to snap |
```

Commit subjects in this repo are usually conventional commits, but the type prefix is sometimes capitalized (e.g. `Fix:`) and occasionally missing entirely — match prefixes case-insensitively and use your judgment for non-conforming subjects.

Rules for the `user-facing?` column:

- **yes**: `feat:`, `fix:`, `perf:`, and any breaking change (a `!` before the colon, e.g. `feat!:` / `fix!:`).
- **maybe**: `refactor:` commits, only if they are user-facing.
- **no**: `chore:`, `ci:`, `test:`, `build:`, `docs:`, and `style:` commits, plus anything that only touches tooling, tests, or CI, and any dependency bumps.

After the table, write the count: `Included: N of M`. `N` is the number of rows marked `yes` (count a `maybe` as included only if you marked it yes). If the table has fewer rows than the number of lines in your `git log` output, you dropped commits — redo the table until every commit appears.

**Only if `N` is 0** may you skip authoring changesets and opening a pull request. In that case do not stay silent: find the open changelog pull request in this repository (label `changelog`) and post a comment on it containing the full classification table and the line `Included: 0 of M`, so a human can see exactly which commits were considered and why nothing was drafted. If no open changelog PR exists, report the table in your run summary instead.

If `N` is 1 or more, you MUST continue and open a pull request. Never stop just because most commits are chores; a single `feat:` or `fix:` means proceed.

Breaking changes are not always flagged in the subject. For every selected commit, also inspect the full commit message with `git show -s --format=%B <sha>` and look for `BREAKING CHANGE:` or `BREAKING-CHANGE:` footers. A commit carrying such a footer is a breaking change even when its subject has no `!` — classify it as breaking (a `major` bump in the changeset) and note the breaking nature in the docs island bullet.

For each selected commit, derive a one-line summary from its subject line. Proofread and correct any obvious spelling or grammar errors. Remove Jira issue references such as `LNDENG-5678` wherever they occur in the subject, and strip any trailing GitHub pull request reference such as ` (#1234)`. Do **not** strip `(LP: #NNNN)` references. If there are no user-facing commits in the window at all, stop and make no changes.

## Sort the commits

Group the commits by their type. Adhere to the following order.

- Breaking changes (a `!` in the subject or a `BREAKING CHANGE:`/`BREAKING-CHANGE:` footer)
- `feat`
- `fix`
- `perf`
- `refactor`

Within each group, maintain the relative ordering of the commits. Use this ordering when listing the backfilled entries in the pull request body.

## Author the changesets

For each selected commit that has no changeset, create exactly one new file `.changeset/<word>-<word>-<word>.md`, where the slug is three random lowercase words joined by hyphens (matching existing slugs such as `bold-ducks-fetch.md`) and does not collide with any existing file in `.changeset/`. The file content must be:

```
---
"landscape-ui": <bump>
---

<summary>
```

- `<bump>` is `minor` for features (`feat`), `patch` for fixes and performance work (`fix`, `perf`), `major` for breaking changes (whether flagged by `!` in the subject or by a `BREAKING CHANGE:`/`BREAKING-CHANGE:` footer), and `patch` for user-facing refactors.
- `<summary>` is the single-line summary derived above, in the tone of the existing changesets (e.g. `Show an error when creating a role fails instead of failing silently`): one capitalized sentence, no type prefix, no trailing period, no Jira or PR references. There is one mandatory exception to "no PR references": end the summary with ` (backfills #<N>)` naming the pull request the changeset covers (e.g. `Show an error when creating a role fails instead of failing silently (backfills #1234)`). Later runs rely on this marker to recognize already-covered PRs.
- The package name in the frontmatter must be exactly `"landscape-ui"` (see `.changeset/config.json` and existing entries).

## Review existing changesets

The CI `Changeset` check only guarantees that a changeset file was added. For each commit in the window that added one, read the file(s) and flag mismatches. Do NOT edit or delete them. List them under a `Changesets to review` heading in the PR body, one bullet per PR with the reason and evidence (commit/PR links).

- **Empty changeset on a user-facing change**: the file has no package/bump, but the commit matches "Select user-facing commits". Propose a bump and summary. If the change is only reachable behind a feature flag or in super-admin mode, make this reasoning clear.
- **Non-empty changeset with no user impact**: every path in `git show --name-only --format= <commit>` is a test (`*.test.*`, `*.spec.*`, `e2e/`), mock (`src/tests/mocks/`), CI/tooling (`.github/`, `scripts/`, root config files), or docs file.
- **Fix for an unreleased regression**: for a `fix:` commit F, take the hunks F modified (`git show -U0 F`) and run `git blame --porcelain -L <start>,<end> F^ -- <file>` to find the commits that introduced those lines. If they all fall inside the window, the bug never shipped and the entry should be emptied or removed. A PR title or body that references another PR merged in the same window is supporting evidence. If blame results are mixed, mark the entry "possible", not certain.

Exclude flagged entries from the docs release-notes island. If a pull request is opened, list the flagged entries under a `Changesets to review` heading in its body, one bullet per PR with the reason and evidence (commit/PR links). If no pull request is opened (nothing to backfill and no changelog block to draft), report the flagged entries in your run summary instead — do not open a pull request that contains no files.

## Draft the Debian changelog block

`CHANGELOG.md` is the source of truth for what changed. `debian/changelog` is the deb-compatible artifact consumed by the PPA builds (`scripts/debian-build.sh`), and its format is OWNED by the beta release prep flow: `scripts/beta-version-update.cjs`, run by `.github/workflows/beta-release-prep.yml` on a `beta/YY.MM-beta.N` branch, rolls the pending changesets into a `## YY.MM-beta.N` `CHANGELOG.md` section and prepends the matching stanza `landscape-dashboard (YY.MM~beta.N-0landscape0) <dist>; urgency=medium`. Your block must be a byte-compatible twin of that stanza — same package name, same tilde version form, same revision, same distribution inherited from the current top block — never a competing spelling of the same release. You only ever fill a gap that flow has not already filled.

1. Read the TOP section of `CHANGELOG.md` (the latest release — everything from the first `## ` heading up to the second `## ` heading). Those bullets are the user-facing changes; do NOT re-derive them from commit subjects. They go in the pull request body and the docs island, not in the Debian stanza.
2. Derive the version from the `CHANGELOG.md` top heading, in the exact shape `parseBetaVersion` in `scripts/beta-version-update.cjs` produces: a heading `## YY.MM-beta.N` (cycle `YY.04` or `YY.10`) maps to the Debian upstream version `YY.MM~beta.N` — TILDE, so the beta sorts before the final `YY.MM` release — and the block version is `YY.MM~beta.N-0landscape0`. NEVER run `node scripts/calculate-version.cjs` to fill this in: on `main` it prints the `<cycle>.0.<count>-beta` label, which `RELEASES.md` §1 defines as never shipped, so stamping it would record a non-installable development release and make this bot a second source of package release history.
3. If the top heading is not in that `YY.MM-beta.N` form — for example an older `YY.MM.Point.Build-beta` section, or a lagging section that predates the beta prep flow — do NOT invent or approximate a version. Skip the Debian changelog work for the run, deliver the changesets only, and say so in the pull request body (or the run summary when no pull request is opened): the stanza is skipped because no shippable beta version is derivable from `CHANGELOG.md`. If the top section has no bullets, skip the Debian changelog work for this run as well.
4. Idempotency: read the current top block of `debian/changelog` to find the most recent version (e.g. `landscape-dashboard (26.10~beta.4-0landscape0) jammy; urgency=medium`). If its upstream version already equals the derived `YY.MM~beta.N`, the beta prep flow — or an earlier run — has stamped this release already: make no change to `debian/changelog` this run.
5. Otherwise prepend ONE new block, copying the package name, distribution, and urgency from the current top block (one changelog serves every build series — jammy, noble, resolute — so the distribution is inherited, never hardcoded), matching the format (see https://manpages.debian.org/testing/dpkg-dev/deb-changelog.5.en.html):

   ```
   landscape-dashboard (YY.MM~beta.N-0landscape0) jammy; urgency=medium

     * Release YY.MM-beta.N for jammy

    -- Landscape Team <landscape-team@canonical.com>  <date>
   ```

   - The body is the single `* Release <version> for <dist>` line `beta-version-update.cjs` writes, with `<version>` in the dash form (`YY.MM-beta.N`). Do NOT enumerate `CHANGELOG.md` bullets here; that prose belongs to the pull request body and the docs island, and the stanza must stay identical to what the beta prep flow produces.
   - The Debian revision is always `-0landscape0`.
   - The bullet is indented with two spaces and begins with `* `. The signature line is indented with one space and begins with `-- `, crediting `Landscape Team <landscape-team@canonical.com>` as the beta prep flow does.
   - Use `date -R` for `<date>` (RFC 2822, e.g. `Sat, 18 Jul 2026 12:00:00 +0000`), with two spaces between the email and the date.
   - Leave every existing block below the new one byte-for-byte untouched.

## Open the pull request

Before making any edit, create your working branch from the default branch, not from the ref this run was dispatched on: `git checkout -b <branch> origin/main`. The dispatch ref may be a bot or feature branch carrying automation commits; if you commit on top of it, the resulting PR contains all of those commits. The PR must contain ONLY the changeset and debian/changelog commit(s) on top of `origin/main`.

First check for an existing open changelog pull request in this repository (label `changelog`). Exactly one should ever be open at a time.

- If one is already open, do NOT open a second and do NOT push to its branch — the safe-output handlers can only CREATE a pull request in this repository, never update an existing one. Check whether its changesets already cover the commits you selected (the `(backfills #<N>)` markers) and whether its `debian/changelog` block already covers the `CHANGELOG.md` top section. If both are current, make no changes and note that the existing PR is already up to date. If anything is missing, post ONE comment on that PR with `add_comment` listing the missing backfill entries and/or the missing Debian changelog block and stop; there is no handler that pushes to an existing own-repo pull request branch, so do not claim you updated the PR and do not open a second PR. Make no file changes this run.
- Only if no changelog PR is open, open a single pull request containing all of the new changeset files and, when one was drafted, the new `debian/changelog` block. Use the title `add missing changesets and changelog block` (the `build: ` prefix is added automatically) and a body that lists the backfilled entries in the sorted order from above, notes the merged PR each entry covers, names the Debian changelog version drafted and the `CHANGELOG.md` section it was sourced from (or states that the Debian stanza was skipped because the `CHANGELOG.md` top heading carries no shippable `YY.MM-beta.N` version), explains that the backfilled PRs were merged without a changeset so the Changesets automation had nothing to roll up, and includes the `Changesets to review` heading when any entries were flagged.

Before submitting the pull request, run a final status audit: `git status --porcelain -- .changeset/ debian/changelog`. Every `.changeset/*.md` line must be `??` (untracked, i.e. a NEW file). If any line shows `M` or `D`, you edited or deleted an existing changeset — discard that change (`git checkout -- <path>` or remove the edit) and re-audit until only new files remain. The pull-request handler filters by path only, not diff status, so this check is the mechanical guard for the "new files only" rule; for `debian/changelog`, verify your diff only PREPENDS one block (`git diff debian/changelog` must show only added lines above the previous top block).

Never open a second changelog PR while one is open.

## Docs release notes (shared PR)

You also maintain the user-facing release notes. All Landscape changelog bots share ONE pull request against `canonical/landscape-documentation` that drafts the release notes for the in-development Landscape release. Each bot owns exactly one marked section (island) in that PR. NEVER open a separate per-repo docs PR: find the shared PR and push to it.

The docs work happens in the separate `./landscape-documentation` checkout. The hard prohibitions above apply to this repository (landscape-ui) only; editing the release-notes page in the docs checkout is expected and allowed.

Your island content derives from `CHANGELOG.md`, the same source of truth as the Debian changelog block — NOT from the commit scan. Read the TOP section of this repo's `CHANGELOG.md` (the latest release: everything from the first `## ` heading up to the second) and rewrite its `### Major Changes` / `### Minor Changes` / `### Patch Changes` bullets into docs-appropriate bullets, excluding any entries flagged in `Changesets to review`. Major Changes map to `#### Features`; Minor and Patch Changes map to `#### Features` and `#### Fixes` respectively by their nature. Because it comes from `CHANGELOG.md`, a PR that brought its own changeset is already included — you do not need the commit scan to find it.

Cycle guard: `main`'s `CHANGELOG.md` lags (its `Version Packages` PR is closed, not merged — RELEASES.md §1), so the top section can still belong to the PREVIOUS cycle. Compare the top heading's `YY.MM` (e.g. `## 26.10.0.1081-beta` -> `26.10`) with the target page's release from step 1. If they differ, do NOT rewrite the island from that section: publishing another cycle's entries onto this page would be worse than a stale island. Leave your island exactly as it is, make no docs change this run, and state the mismatch (top section version vs target page) in the run summary and, if you open a pull request, in its body.

1. Determine the in-development Landscape release `YY.MM`: Landscape releases are `YY.04` and `YY.10`. From today's date, the in-development release is the next boundary strictly in the future (before April -> `YY.04`; before October -> `YY.10`; otherwise `(YY+1).04`). Work out the current boundary from today's date and name the target page accordingly — for example, a run in November 2026 targets `docs/reference/release-notes/27.04-release-notes.md`.
2. Find the shared docs PR: use the GitHub tools to list open PRs in `canonical/landscape-documentation` with labels `changelog` and `automation` (title starts with `build: `). If one exists, this is THE docs PR — use it regardless of which `YY.MM` page it targets.
3. If a docs PR exists:
   - In the `./landscape-documentation` checkout, check out that PR's head branch. First read the PR's `headRepositoryOwner`/`headRepository` and head ref with the GitHub tools: the head may live in a FORK (for example a contributor's `landscape-documentation` fork), not in `canonical/landscape-documentation`. The setup checkout fetched only `canonical/landscape-documentation` refs, so a fork head is NOT among them. When the head is in a fork, add that fork as a temporary read-only remote and fetch the head ref from it over HTTPS (the docs repo and its forks are public, so an unauthenticated fetch works): `git -C ./landscape-documentation remote add pr-head https://github.com/<owner>/landscape-documentation.git 2>/dev/null || true; git -C ./landscape-documentation fetch pr-head <head-ref> && git -C ./landscape-documentation checkout FETCH_HEAD`. If the head is in `canonical/landscape-documentation` itself, the branch is already among the fetched refs: `git checkout <branch>`. If the head ref cannot be fetched either way, skip the docs work for this run.
   - Other Landscape bots push to this same shared branch, so the checkout may be stale and another bot may push while you work. Apart from the one fork-head fetch above, the agent environment has NO git credentials — NEVER attempt any other fetch or a rebase. Work from the head ref you just checked out; keep every edit strictly inside your own island markers so it applies cleanly over the other bots' island updates. `push_to_pull_request_branch` applies your patch to the branch's live tip in a credentialed job; if a concurrent push made it conflict, the delivery fails safely — do not retry, the next run redoes the work. NEVER force-push over another bot's commits.
   - Update ONLY your own island (see below). If the release-notes page for the in-development version does not exist on that branch, create it from the template below and add it to the toctree in `docs/reference/release-notes/index.md` (newest non-LTS page goes directly under the LTS entries, matching existing ordering).
   - Commit in the docs checkout and deliver via `push_to_pull_request_branch` with `pull_request_number` set to the docs PR number. Before committing, audit island containment: run `git -C ./landscape-documentation diff` and confirm every changed hunk sits between your `<!-- changelog-bot:landscape-ui:start -->` and `<!-- changelog-bot:landscape-ui:end -->` markers (or, when creating a brand-new page or the toctree entry, is exactly that new page / that one index.md line). The push handler filters by filename only — it cannot see island boundaries — so if any hunk touches another bot's island or any other section, discard it and redo the edit before delivering.
4. If no docs PR exists, skip the docs work for this run entirely: make no changes in the `./landscape-documentation` checkout. NEVER create the shared docs PR yourself — it is created weekly by the `release-notes-draft` workflow in canonical/landscape-documentation, so it should already exist by the time you run. (Your own-repo changelog PR logic is unaffected.)
5. If you have no user-facing changes this cycle, leave your island untouched; do not create or update the docs PR. (Your own-repo changelog PR logic is unaffected.)

### Your island

Island markers (HTML comments, invisible in rendered docs). Your slug is `landscape-ui`. The full island set, in this fixed order:

1. `landscape-server` — Landscape Server
2. `landscape-client` — Landscape Client
3. `landscape-ui` — Web portal
4. `landscape-go` — Snaps (debarchive, outbox, task-handler services)
5. `landscape-server-operator` — Landscape Server charm
6. `landscape-client-charm` — Landscape Client charm
7. `landscape-debarchive-operator` — Debarchive charm
8. `landscape-task-handler-operator` — Task handler charm

Island format inside `## Additional updates`:

```markdown
<!-- changelog-bot:landscape-ui:start -->
### Web portal

#### Features
- <docs-appropriate bullet>

#### Fixes
- <docs-appropriate bullet>
<!-- changelog-bot:landscape-ui:end -->
```

Rules:
- BEFORE writing, read `.github/instructions/release-notes.instructions.md` and `.github/instructions/documentation.instructions.md` in the docs checkout and follow them (applicability: state self-hosted vs SaaS and the component; factual, non-promotional; do not invent benefits, migration steps, or breaking-change claims).
- Rewrite the `CHANGELOG.md` bullets into user-facing docs bullets: no conventional-commit prefixes, no `(scope)`, no `(#1234)`, no Jira keys. Keep Launchpad references but format them as `[LP: #NNNN](https://bugs.launchpad.net/landscape/+bug/NNNN)`. Write in the style of existing release notes (see any `docs/reference/release-notes/*.md` page): complete sentences, no trailing period inconsistency, admin-focused.
- Omit `#### Features` / `#### Fixes` when empty. If your island has no entries yet, put `(pending)` as the island body.
- NEVER edit outside your own island markers. Other sections belong to other bots.
- When creating the page, include ALL eight islands in the fixed order above (yours filled, the rest with `(pending)`), so later bot runs find their markers.

### New-page template

File `docs/reference/release-notes/YY.MM-release-notes.md` (dots in the filename, matching `26.10-release-notes.md`; anchor uses dashes):

```markdown
---
myst:
  html_meta:
    description: "Release notes for Landscape YY.MM. Draft; updated automatically until release."
---

(reference-release-notes-YY-MM)=
# YY.MM release notes

> Landscape Server YY.MM runs on the Ubuntu LTS releases it supports. Copy the exact support statement (releases and codenames) verbatim from the most recent existing `docs/reference/release-notes/*.md` page — do not invent or hard-code codenames here, they change over time.

```{note}
This page is a draft maintained automatically until release.
```

## Highlights

(pending - written at release time)

## Additional updates

(eight islands here)

## Upgrade

(pending - written at release time)

## Bug fixes

(pending - written at release time)
```
