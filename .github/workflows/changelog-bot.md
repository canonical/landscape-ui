---
# Biweekly missing-changesets PR bot (GitHub Agentic Workflow).
#
# This is the gh-aw SOURCE file. After editing, regenerate the compiled
# GitHub Actions workflow with:
#
#     gh aw compile changelog-bot
#
# and commit the generated `.github/workflows/changelog-bot.lock.yml` alongside it.

on:
  # Cron cannot express "every other Saturday", so we fire every Saturday at
  # around 12:00 UTC and the prompt gates on ISO-week parity (see the body below).
  schedule: weekly on saturday around 12:00 UTC
  # Allow maintainers to trigger a run on demand (ignores the biweekly gate).
  workflow_dispatch:

permissions:
  contents: read

# The default checkout is shallow (fetch-depth 1) with no tags, which makes the
# agent see only the latest commit. Fetch full history so it can diff against
# the last CHANGELOG.md update and read the commit log. A second checkout
# fetches the documentation repo (all branches) for the shared release-notes PR.
checkout:
  - fetch-depth: 0
  - repository: canonical/landscape-documentation
    path: ./landscape-documentation
    fetch: ["*"]
    github-token: ${{ secrets.COPILOT_GITHUB_TOKEN }}

engine:
  id: copilot
  model: sonnet

# Only the shell commands the agent needs to inspect history and format dates.
tools:
  bash:
    - "git"
    - "date"
    - "safeoutputs"
  edit:

# The agent never pushes directly; its file edits are turned into a pull request.
# One token governs both PR handlers (required when two handlers touch the same
# repo); it must have write access to canonical/landscape-documentation.
safe-outputs:
  github-token: ${{ secrets.COPILOT_GITHUB_TOKEN }}
  create-pull-request:
    title-prefix: "build: "
    labels: [changelog, automation]
    team-reviewers: [canonical/landscape]
    draft: false
    if-no-changes: ignore
    max: 2
    allowed-repos: ["canonical/landscape-documentation"]
    preserve-branch-name: true
    recreate-ref: true
    # The bot only ever adds NEW changeset files here or edits release-notes
    # pages in the docs repo; the handler rejects any other path outright.
    allowed-files: [".changeset/*.md", "docs/reference/release-notes/*.md"]
    # Stripped from any delivered patch: CHANGELOG.md belongs to the Version
    # Packages automation, so the prohibition is enforced mechanically.
    excluded-files: ["CHANGELOG.md"]
    # gh-aw v0.89.21 only opts a dot-folder out of the top-level dot-folder
    # protection via a "<dir>/" prefix entry (globs are not matched here).
    # The allowlist above still hard-blocks `.changeset/config.json`/README.md.
    protected-files:
      exclude: [".changeset/"]
  push-to-pull-request-branch:
    target: "*"
    target-repo: canonical/landscape-documentation
    required-labels: [changelog, automation]
    # Docs PR updates may only touch release-notes pages (including index.md).
    allowed-files: ["docs/reference/release-notes/*.md"]
    max: 1
---

# Biweekly missing changesets

You backfill missing Changesets for Landscape UI. This repo's `CHANGELOG.md` and version bumps are produced by the Changesets release automation (`changesets/action`), so your job is NOT to write the changelog yourself. Your job is to author `.changeset/*.md` entries for user-facing pull requests that were merged without one (the gap documented in `RELEASES.md` section 7), then open a single pull request containing all of the new changesets.

## Hard prohibitions

- NEVER create, edit, or delete `CHANGELOG.md`, `package.json`, or any lockfile. Those are outputs of the Changesets "Version Packages" automation; touching them fights that automation. This is mechanically enforced by the pull-request handler: `CHANGELOG.md` is stripped from any patch it delivers, and `package.json` plus the lockfiles stay in the default protected-file set.
- NEVER edit an existing `.changeset/*.md` file.
- Only ever create NEW files under `.changeset/`.

## Biweekly gate

This workflow is scheduled every Saturday but should only act every **other** Saturday. Releases publish on **odd** ISO weeks.

This run was triggered by the `${{ github.event_name }}` event. Use that value literally to decide whether the gate applies:

1. If the triggering event is `workflow_dispatch`, always proceed regardless of the week number (manual runs bypass the biweekly gate entirely).
2. Otherwise (a `schedule` run), run `date +%V` to get the current ISO week number. If that week number is **even**, stop immediately and make no changes — do not open a pull request. Only proceed on **odd** weeks.

## Gather the commits

1. Find the anchor: the SECOND-most-recent commit that touched `CHANGELOG.md` — run `git log --format=%H -2 -- CHANGELOG.md` and take the older (second) of the two SHAs. If only one such commit exists, use it. If none exist, fall back to the last two weeks of history (`--since="2 weeks ago"`). Anchoring one release window back intentionally overlaps the previous run's window so omissions from it are caught; the deduplication rules below prevent double-filing.
2. List the commits since the anchor with `git log <anchor>..HEAD --no-merges --pretty=%H%x09%s`. `main` is squash-merged, so each merged PR is a single commit on this list.
3. Deduplicate by pull request number. For each commit, extract its PR number `<N>` from the trailing ` (#1234)` reference in the subject. Skip the commit if ANY of the following hold (a commit with no PR number in its subject can only be skipped via rule (a)):
   a. Its own commit added a changeset: run `git show --name-status --format= <commit>` and look for a line with status `A` (added) whose path matches `.changeset/*.md` (ignoring `.changeset/README.md` and `.changeset/config.json`). Only status `A` counts — a modified (`M`) or deleted (`D`) changeset path is NOT coverage.
   b. A pending changeset already covers it: search the existing `.changeset/*.md` files in the working tree for the exact reference `#<N>` (match the full number — `#123` must not match `#1234`). Every backfilled changeset ends its summary with `(backfills #<N>)`, so a pending changeset containing `#<N>` means this PR is already covered.
   c. The changelog already covers it: check whether the TOP section of `CHANGELOG.md` (the latest release — everything from the first `## ` heading up to the second) references `#<N>`.

## Select user-facing commits only

Include only commits that a Landscape administrator would notice. Commit subjects in this repo are usually conventional commits, but the type prefix is sometimes capitalized (e.g. `Fix:`) and occasionally missing entirely — match prefixes case-insensitively and use your judgment for non-conforming subjects.

- **Include**: `feat:`, `fix:`, `perf:`, and any breaking change (a `!` before the colon, e.g. `feat!:` / `fix!:`).
- **Maybe Include**: `refactor: ` commits, only if they are user-facing.
- **Exclude**: `chore:`, `ci:`, `test:`, `build:`, `docs:`, and `style:`, commits,
  plus anything that only touches tooling, tests, or CI, and any dependency bumps.

Breaking changes are not always flagged in the subject. For every selected commit, also inspect the full commit message with `git show -s --format=%B <sha>` and look for `BREAKING CHANGE:` or `BREAKING-CHANGE:` footers. A commit carrying such a footer is a breaking change even when its subject has no `!` — classify it as breaking (a `major` bump in the changeset) and note the breaking nature in the docs island bullet.

For each selected commit, derive a one-line summary from its subject line. Proofread and correct any obvious spelling or grammar errors. Remove Jira issue references such as `LNDENG-5678` wherever they occur in the subject, and strip any trailing GitHub pull request reference such as ` (#1234)`. Do **not** strip `(LP: #NNNN)` references. If there are no user-facing commits without a changeset, stop and make no changes.

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
- **Fix for an unreleased regression**: for a `fix:` commit F, take the hunks F modified (`git show -U0 F`) and run `git blame --porcelain -L <start>,<end> F^ -- <file>` to find the commits that introduced those lines. If they all fall inside the window (after the anchor), the bug never shipped and the entry should be emptied or removed. A PR title or body that references another PR merged in the same window is supporting evidence. If blame results are mixed, mark the entry "possible", not certain.

Exclude flagged entries from the docs release-notes island.
## Open the pull request

Open a single pull request containing all of the new changeset files. Use the title `add missing changesets` (the `build: ` prefix is added automatically) and a body that lists the backfilled entries in the sorted order from above, notes the merged PR each entry covers, and explains that these PRs were merged without a changeset so the Changesets automation had nothing to roll up. If no changesets were needed, do nothing — do not open an empty pull request.

## Docs release notes (shared PR)

You also maintain the user-facing release notes. All Landscape changelog bots share ONE pull request against `canonical/landscape-documentation` that drafts the release notes for the in-development Landscape release. Each bot owns exactly one marked section (island) in that PR. NEVER open a separate per-repo docs PR: find the shared PR and push to it.

The docs work happens in the separate `./landscape-documentation` checkout. The hard prohibitions above apply to this repository (landscape-ui) only; editing the release-notes page in the docs checkout is expected and allowed.

Your island content derives from the same user-facing merged PRs you selected for changesets above: rewrite those selected commits into docs-appropriate bullets.

1. Determine the in-development Landscape release `YY.MM`: Landscape releases are `YY.04` and `YY.10`. From today's date, the in-development release is the next boundary strictly in the future (before April -> `YY.04`; before October -> `YY.10`; otherwise `(YY+1).04`). As of November 2026 this is **27.04** (betas are underway), so the target page is `docs/reference/release-notes/27.04-release-notes.md`.
2. Find the shared docs PR: use the GitHub tools to list open PRs in `canonical/landscape-documentation` with labels `changelog` and `automation` (title starts with `build: `). If one exists, this is THE docs PR — use it regardless of which `YY.MM` page it targets.
3. If a docs PR exists:
   - In the `./landscape-documentation` checkout, check out that PR's head branch (PR refs were fetched via the wildcard fetch; e.g. `git checkout <branch>` after identifying it, or `git fetch origin pull/<N>/head:<branch>`).
   - Other Landscape bots push to this same shared branch, so your checkout may already be stale and another bot may push while you work. Before committing in the docs checkout, fetch the branch's latest tip (`git fetch origin <branch>`) and rebase/reset your work onto it (`git reset --hard origin/<branch>` if you have not committed yet and have no uncommitted edits to keep, otherwise rebase), so your push is a fast-forward over the other bots' island updates. NEVER force-push over another bot's commits.
   - Update ONLY your own island (see below). If the release-notes page for the in-development version does not exist on that branch, create it from the template below and add it to the toctree in `docs/reference/release-notes/index.md` (newest non-LTS page goes directly under the LTS entries, matching existing ordering).
   - Commit in the docs checkout and deliver via `push_to_pull_request_branch` with `pull_request_number` set to the docs PR number.
4. If no docs PR exists, skip the docs work for this run entirely: make no changes in the `./landscape-documentation` checkout. NEVER create the shared docs PR yourself — only landscape-server's bot creates it; every other bot only ever updates an existing one. (Your own-repo changelog PR logic is unaffected.)
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
- Rewrite your selected commits into user-facing docs bullets: no conventional-commit prefixes, no `(scope)`, no `(#1234)`, no Jira keys. Keep Launchpad references but format them as `[LP: #NNNN](https://bugs.launchpad.net/landscape/+bug/NNNN)`. Write in the style of existing release notes (see any `docs/reference/release-notes/*.md` page): complete sentences, no trailing period inconsistency, admin-focused.
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

> Landscape Server YY.MM runs on Ubuntu 26.04 LTS Resolute Raccoon, 24.04 LTS Noble Numbat, or 22.04 LTS Jammy Jellyfish.

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
