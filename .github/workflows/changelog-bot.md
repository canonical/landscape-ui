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
  - canonical/landscape-internal-docs/.github/workflows/shared/changelog-bot-infra.md@d627562cfa37544175061045d201f4304154a62e

# The agent never pushes directly; its file edits are turned into a pull request.
# The credential (LANDSCAPE_CHANGELOG_TOKEN, a fine-grained PAT with contents and
# pull-requests read+write on this repo and canonical/landscape-documentation) is
# bound once in the shared component, together with the docs push handler and the
# comment handler. Only the repo-specific changelog PR rules live here.
safe-outputs:
  # add-comment: target and github-token are set in the shared component.
  create-pull-request:
    title-prefix: "build: "
    labels: [changelog, automation]
    team-reviewers: [canonical/landscape]
    draft: false
    if-no-changes: ignore
    # Exactly one changeset PR per run; the docs update goes through the
    # separate push-to-pull-request-branch handler below.
    max: 1
    # preserve-branch-name removed: combined with recreate-ref: true it
    # would cause a collision if two runs land on the same week (the branch
    # name is deterministic from the run timestamp, so a re-run or overlap
    # would force-push over the previous changeset). gh-aw's random hex suffix
    # avoids that.
    recreate-ref: true
    # Push with a plain git push rather than the createCommitOnBranch GraphQL
    # path: that path produces commits GitHub does not mark verified for this
    # bot token, and pushSignedCommits then refuses to publish the branch.
    signed-commits: false
    # The bot adds NEW changeset files and, only when a shippable CalVer
    # version is derivable from CHANGELOG.md, prepends ONE twin of the `dch`
    # stanza to debian/changelog (see "Draft the Debian changelog block": no
    # calculated main label, no per-bullet enumeration); docs edits are
    # delivered by the push handler, so the create handler rejects any other
    # path outright.
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
2. **Debian changelog**: when `CHANGELOG.md`'s top heading is a shippable CalVer release version, prepend the matching `landscape-dashboard (<version>-0landscape0)` stanza — a byte-compatible twin of the block `dch` writes in `.github/workflows/release-and-build.yml` and `scripts/debian-build.sh` (that `dch` invocation owns the format). Never stamp a `-beta` or `-rc` label and never re-spell a release the build already stamped.
3. **Docs release notes**: write the Web portal island of the shared release-notes PR in `canonical/landscape-documentation`, also sourced from `CHANGELOG.md`.

## Hard prohibitions

- NEVER create, edit, or delete `CHANGELOG.md`, `package.json`, or any lockfile. `CHANGELOG.md` is your READ-ONLY source of truth; it is written by the Changesets "Version Packages" automation. This is mechanically enforced by the pull-request handler: `CHANGELOG.md` is stripped from any patch it delivers, and `package.json` plus the lockfiles stay in the default protected-file set.
- NEVER edit an existing `.changeset/*.md` file. Only ever create NEW files under `.changeset/`.
- NEVER rewrite or reorder existing `debian/changelog` blocks. Only ever PREPEND one new block at the top.
- NEVER open a second changelog PR while one is open, and never push to another PR's branch: the safe-output handlers can only CREATE a pull request in this repository. If an open changelog PR is missing entries, report them in a comment (see "Open the pull request") instead of pushing.

## Gather the commits

1. The scan window is time-based: list the commits from the last four weeks against the repository's default branch, not the ref this run was dispatched on: `git log --since="4 weeks ago" --no-merges --pretty=%H%x09%s origin/main`. Always use `origin/main` for the range — a `workflow_dispatch` run may check out a bot or feature branch whose own commits are automation churn, and those must never be classified as product changes. If `origin/main` is not present locally, use the checked-out HEAD and say so in the run output. `main` is squash-merged, so each merged PR is a single commit on this list. Do NOT anchor on `CHANGELOG.md` commits: the `Version Packages` PR on `main` is closed rather than merged before each cut (RELEASES.md section 3), so `CHANGELOG.md` on `main` is stale and a changelog anchor would silently treat undocumented commits as covered. Four weeks against a weekly schedule gives three weeks of overlap with the previous run, so omissions leapfrogged by later merges are still caught; the deduplication rules below prevent double-filing.
2. Skip any commit whose subject has no trailing pull request reference ` (#1234)`. Such commits cannot get a `backfill-<N>.md` filename, which is what deduplication relies on, so they can never be filed safely; if one looks user-facing, mention it in the PR body under `Changesets to review` instead of backfilling it.
3. Deduplicate the rest by pull request number. For each commit, extract its PR number `<N>` from the trailing ` (#1234)` reference in the subject. Skip the commit if ANY of the following hold:
   a. Its own commit added a NON-EMPTY changeset: run `git show --name-status --format= <commit>` and look for a line with status `A` (added) whose path matches `.changeset/*.md` (ignoring `.changeset/README.md` and `.changeset/config.json`), then read that file — it counts as coverage only if its frontmatter assigns a bump (`major`/`minor`/`patch`) to a package. Only status `A` counts — a modified (`M`) or deleted (`D`) changeset path is NOT coverage. If the commit added ONLY empty changesets (no package/bump in the frontmatter), do NOT backfill one: an empty changeset can be a deliberate choice (e.g. one shared non-empty changeset for a whole PR stack, as in #799). Flag it in the review section below instead.
   b. A pending changeset already covers it: check whether `.changeset/backfill-<N>.md` exists in the working tree (match the full number — `backfill-123.md` must not count for `backfill-1234.md`). Do NOT treat a bare `#<N>` anywhere in a changeset's text as coverage: that token can be an unrelated issue, Launchpad, or linked-PR reference. Only the `backfill-<N>.md` filename means this PR is already covered.
   c. A previous bot run already filed it: run `git log --diff-filter=A --format=%H origin/main -- .changeset/backfill-<N>.md` (substituting the actual PR number). If that command prints any commit SHA, the backfill file was already merged to `main` and this PR is covered. Do NOT use bare `#<N>` anywhere in changeset text as a coverage signal — it can be an unrelated issue, Launchpad, or linked-PR reference.

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

Then count `X`: the number of included commits that were NOT skipped by rules 3a, 3b, or 3c above. These are the commits that genuinely need a new backfill changeset. Write `Missing changeset: X of N`.

**Only if `X` is 0** may you skip authoring new changesets and opening a pull request. In that case do not stay silent: find the open changelog pull request in this repository (label `changelog`) and post a comment on it containing the full classification table and the line `Missing changeset: 0 of N`, so a human can see exactly which commits were considered and why nothing was drafted. If no open changelog PR exists, report the table in your run summary instead.

If `X` is 1 or more, you MUST continue and open a pull request.

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

For each selected commit that has no changeset, create exactly one new file `.changeset/backfill-<N>.md`, where `<N>` is the number of the pull request the commit came from (e.g. `.changeset/backfill-1234.md`). The pull request number belongs in the FILENAME, not in the summary: Changesets copies the summary verbatim into CHANGELOG.md, so a marker in the text would ship to readers. The filename also makes later deduplication a file-exists check. The file content must be:

```
---
"landscape-ui": <bump>
---

<summary>
```

- `<bump>` is `minor` for features (`feat`), `patch` for fixes and performance work (`fix`, `perf`), `major` for breaking changes (whether flagged by `!` in the subject or by a `BREAKING CHANGE:`/`BREAKING-CHANGE:` footer), and `patch` for user-facing refactors.
- `<summary>` is the single-line summary derived above, in the tone of the existing changesets (e.g. `Show an error when creating a role fails instead of failing silently`): one capitalized sentence, no type prefix, no trailing period, and no Jira, PR, or backfill references of any kind. Do not append `(backfills #<N>)` or any other marker; the pull request number is already recorded in the filename.
- The package name in the frontmatter must be exactly `"landscape-ui"` (see `.changeset/config.json` and existing entries).

## Review existing changesets

The CI `Changeset` check only guarantees that a changeset file was added. For each commit in the window that added one, read the file(s) and flag mismatches. Do NOT edit or delete them. List them under a `Changesets to review` heading in the PR body, one bullet per PR with the reason and evidence (commit/PR links).

- **Empty changeset on a user-facing change**: the file has no package/bump, but the commit matches "Select user-facing commits". Propose a bump and summary. If the change is only reachable behind a feature flag or in super-admin mode, make this reasoning clear.
- **Non-empty changeset with no user impact**: every path in `git show --name-only --format= <commit>` is a test (`*.test.*`, `*.spec.*`, `e2e/`), mock (`src/tests/mocks/`), CI/tooling (`.github/`, `scripts/`, root config files), or docs file.
- **Fix for an unreleased regression**: for a `fix:` commit F, take the hunks F modified (`git show -U0 F`) and run `git blame --porcelain -L <start>,<end> F^ -- <file>` to find the commits that introduced those lines. If they all fall inside the window, the bug never shipped and the entry should be emptied or removed. A PR title or body that references another PR merged in the same window is supporting evidence. If blame results are mixed, mark the entry "possible", not certain.

Exclude flagged entries from the docs release-notes island. If a pull request is opened, list the flagged entries under a `Changesets to review` heading in its body, one bullet per PR with the reason and evidence (commit/PR links). If no pull request is opened (nothing to backfill and no changelog block to draft), report the flagged entries in your run summary instead — do not open a pull request that contains no files.

## Draft the Debian changelog block

`CHANGELOG.md` is the source of truth for what changed. `debian/changelog` is the deb-compatible artifact consumed by the PPA builds, and every block in it is written by `dch` at build time — in the `build-deb` job of `.github/workflows/release-and-build.yml`, and in `scripts/debian-build.sh`, as:

```
dch --newversion "<version>-0landscape0" --distribution jammy "Release <version> for jammy"
```

with `DEBFULLNAME="Landscape Team"` and `DEBEMAIL="landscape-team@canonical.com"`. That `dch` invocation is the format's only owner: package `landscape-dashboard`, Debian revision `-0landscape0`, distribution `jammy` (both call sites hardcode `jammy`; never invent another series), a single-line body, and the `Landscape Team <landscape-team@canonical.com>` signer. Your block must be a byte-compatible twin of what it produces — never a competing spelling of the same release. You only ever fill a gap that flow has not already filled.

1. Read the TOP section of `CHANGELOG.md` (the latest release — everything from the first `## ` heading up to the second `## ` heading). Those bullets are the user-facing changes; do NOT re-derive them from commit subjects. They go in the pull request body and the docs island, not in the Debian stanza.
2. Derive `<version>` from the `CHANGELOG.md` top heading ONLY when that heading is a shippable CalVer release version: `## YY.MM.Point.Build` or `## YY.MM.Point.Build.X`, with neither a `-beta` nor an `-rc` suffix (`RELEASES.md` §5–§6). `<version>` is that heading verbatim — the same string the build passes to `dch` — so the block version is `<version>-0landscape0`.
3. If the top heading carries `-beta` (as on `main`, e.g. `## 26.10.0.1081-beta`) or `-rc`, or is not CalVer at all (e.g. an older `1.23.0` section), do NOT invent, approximate, or reshape a version from it: `RELEASES.md` §1 and §6 define `-beta` as `main`'s PR-title label only, never installed, and `-rc` as an unpromoted candidate, so stamping either would record a non-installable development release in `debian/changelog` and make this bot a second source of package release history. Skip the Debian changelog work for the run, deliver the changesets only, and say so in the pull request body (or the run summary when no pull request is opened): the stanza is skipped because no shippable version is derivable from `CHANGELOG.md`. NEVER run `node scripts/calculate-version.cjs` to fill this in: on `main` it prints the `<cycle>.0.<count>-beta` label, which is never shipped. If the top section has no bullets, skip the Debian changelog work for this run as well.
4. Idempotency: read the current top block of `debian/changelog` to find the most recent version (e.g. `landscape-dashboard (1.23.0-0landscape0) jammy; urgency=medium`). If its upstream version already equals `<version>`, the build — or an earlier run — has stamped this release already: make no change to `debian/changelog` this run.
5. Otherwise prepend ONE new block, matching `dch`'s output (see https://manpages.debian.org/testing/dpkg-dev/deb-changelog.5.en.html):

   ```
   landscape-dashboard (<version>-0landscape0) jammy; urgency=medium

     * Release <version> for jammy

    -- Landscape Team <landscape-team@canonical.com>  <date>
   ```

   - The body is the single `* Release <version> for jammy` line `dch` writes. Do NOT enumerate `CHANGELOG.md` bullets here; that prose belongs to the pull request body and the docs island, and the stanza must stay identical to what the build produces.
   - The Debian revision is always `-0landscape0`.
   - The bullet is indented with two spaces and begins with `* `. The signature line is indented with one space and begins with `-- `, crediting `Landscape Team <landscape-team@canonical.com>` as `dch` does.
   - Use `date -R` for `<date>` (RFC 2822, e.g. `Sat, 18 Jul 2026 12:00:00 +0000`), with two spaces between the email and the date.
   - Leave every existing block below the new one byte-for-byte untouched.

## Open the pull request

Before making any edit, create your working branch from the default branch, not from the ref this run was dispatched on: `git checkout -b <branch> origin/main`. The dispatch ref may be a bot or feature branch carrying automation commits; if you commit on top of it, the resulting PR contains all of those commits. The PR must contain ONLY the changeset and debian/changelog commit(s) on top of `origin/main`.

First check for an existing open changelog pull request in this repository (label `changelog`). Exactly one should ever be open at a time.

- If one is already open, do NOT open a second and do NOT push to its branch — the safe-output handlers can only CREATE a pull request in this repository, never update an existing one. Check whether its changesets already cover the commits you selected (the `backfill-<N>.md` filenames) and whether its `debian/changelog` block already covers the `CHANGELOG.md` top section. If both are current, make no changes and note that the existing PR is already up to date. If anything is missing, post ONE comment on that PR with `add_comment` listing the missing backfill entries and/or the missing Debian changelog block and stop; there is no handler that pushes to an existing own-repo pull request branch, so do not claim you updated the PR and do not open a second PR. Make no file changes this run.
- Only if no changelog PR is open, open a single pull request containing all of the new changeset files and, when one was drafted, the new `debian/changelog` block. Use the title `add missing changesets and changelog block` (the `build: ` prefix is added automatically) and a body that lists the backfilled entries in the sorted order from above, notes the merged PR each entry covers, names the Debian changelog version drafted and the `CHANGELOG.md` section it was sourced from (or states that the Debian stanza was skipped because the `CHANGELOG.md` top heading carries no shippable CalVer release version), explains that the backfilled PRs were merged without a changeset so the Changesets automation had nothing to roll up, and includes the `Changesets to review` heading when any entries were flagged.

Before submitting the pull request, run a final status audit: `git status --porcelain -- .changeset/ debian/changelog`. Every `.changeset/*.md` line must be `??` (untracked, i.e. a NEW file). If any line shows `M` or `D`, you edited or deleted an existing changeset — discard that change (`git checkout -- <path>` or remove the edit) and re-audit until only new files remain. The pull-request handler filters by path only, not diff status, so this check is the mechanical guard for the "new files only" rule; for `debian/changelog`, verify your diff only PREPENDS one block (`git diff debian/changelog` must show only added lines above the previous top block).

Never open a second changelog PR while one is open.

## Docs release notes (shared PR)

You also maintain the user-facing release notes. All Landscape changelog bots share ONE pull request against `canonical/landscape-documentation` that drafts the release notes for the in-development Landscape release. Each bot owns exactly one marked section (island) in that PR. NEVER open a separate per-repo docs PR: find the shared PR and push to it.

The docs work happens in the separate `./landscape-documentation` checkout. The hard prohibitions above apply to this repository (landscape-ui) only; editing the release-notes page in the docs checkout is expected and allowed.

Your island content derives from `CHANGELOG.md`, the same source of truth as the Debian changelog block — NOT from the commit scan. Read the TOP section of this repo's `CHANGELOG.md` (the latest release: everything from the first `## ` heading up to the second) and rewrite its `### Major Changes` / `### Minor Changes` / `### Patch Changes` bullets into docs-appropriate bullets, excluding any entries flagged in `Changesets to review`. `### Major Changes` and `### Minor Changes` bullets are features; `### Patch Changes` bullets are fixes. Because it comes from `CHANGELOG.md`, a PR that brought its own changeset is already included — you do not need the commit scan to find it.

Cycle guard: `main`'s `CHANGELOG.md` lags (its `Version Packages` PR is closed, not merged — RELEASES.md §1), so the top section can still belong to the PREVIOUS cycle. Compare the top heading's `YY.MM` (e.g. `## 26.10.0.1081-beta` -> `26.10`) with the target page's release from step 1. If they differ, do NOT rewrite the island from that section: publishing another cycle's entries onto this page would be worse than a stale island. Leave your island exactly as it is, make no docs change this run, and state the mismatch (top section version vs target page) in the run summary and, if you open a pull request, in its body.

1. Determine the in-development Landscape release `YY.MM`: Landscape releases are `YY.04` and `YY.10`. From today's date, the in-development release is the next boundary strictly in the future (in or before April -> `YY.04`; in or before October -> `YY.10`; otherwise `(YY+1).04` (matches `getCurrentCycle` in `scripts/calculate-version.cjs`: `month <= 4` / `month <= 10`)). Work out the current boundary from today's date and name the target page accordingly — for example, a run in November 2026 targets `docs/reference/release-notes/27.04-release-notes.md`.
2. Find the shared docs PR: use the GitHub tools to list open PRs in `canonical/landscape-documentation` with labels `changelog` and `automation` (title starts with `build: `). If one exists, this is THE docs PR — use it regardless of which `YY.MM` page it targets.
3. If a docs PR exists:
   - The shared component's setup step already checked out the docs draft PR's head branch before you started. Confirm it: run `git -C ./landscape-documentation branch --show-current` and verify the result equals the docs PR's `headRef`. Also confirm the PR's `headRepositoryOwner` is `canonical` — if the head is in a fork, skip the docs work for this run (the firewall blocks the cross-repo fetch). If either check fails, skip the docs work and explain why in the run summary.
   - The agent environment has NO git credentials — NEVER fetch, add remotes, or rebase. Work from the branch the setup step checked out. Other bots push to this same branch; keep every edit strictly inside your own island markers. `push_to_pull_request_branch` applies your patch to the branch's live tip in a credentialed job; if a concurrent push made it conflict, the delivery fails safely — do not retry, the next run redoes the work. NEVER force-push over another bot's commits.
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

File `docs/reference/release-notes/YY.MM-release-notes.md` (dots in the filename, matching `26.10-release-notes.md`; anchor uses dashes).

For the support statement below, copy the exact wording (releases and codenames) verbatim from the most recent existing `docs/reference/release-notes/*.md` page. Do not invent or hard-code codenames; they change over time. This instruction is not part of the page content.

````markdown
---
myst:
  html_meta:
    description: "Release notes for Landscape YY.MM. Draft; updated automatically until release."
---

(reference-release-notes-YY-MM)=
# YY.MM release notes

> Landscape Server YY.MM runs on the Ubuntu LTS releases it supports (paste the support statement here).

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
````
