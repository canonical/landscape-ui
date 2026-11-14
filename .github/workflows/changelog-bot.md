---
# Weekly missing-changesets PR bot (GitHub Agentic Workflow).
#
# This is the gh-aw SOURCE file. After editing, regenerate the compiled
# GitHub Actions workflow with:
#
#     gh aw compile changelog-bot
#
# and commit the generated `.github/workflows/changelog-bot.lock.yml` alongside it.

on:
  # Fires every Saturday at around 12:00 UTC.
  schedule: weekly on saturday around 12:00 UTC
  # Allow maintainers to trigger a run on demand.
  workflow_dispatch:

permissions:
  contents: read

# The default checkout is shallow (fetch-depth 1) with no tags, which makes the
# agent see only the latest commit. Fetch full history so it can scan the
# commit window and read the commit log. A second checkout fetches the
# documentation repo (all branches) for the shared release-notes PR; that repo
# is public, so it needs no token (an explicit one would leak onto the primary
# checkout in the safe-output jobs).
checkout:
  - fetch-depth: 0
  - repository: canonical/landscape-documentation
    path: ./landscape-documentation
    fetch: ["*"]

engine:
  id: gemini
  # The native Gemini engine uses GEMINI_API_KEY directly and takes an exact
  # model id, avoiding the pi engine's model-grammar rejection of vendored
  # OpenRouter ids (github/gh-aw#77514). Gemini does not resolve gh-aw model
  # aliases, so this must be an exact id.
  model: gemini-3.5-flash
  env:
    GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}

network:
  allowed: [defaults]

# Run on the Canonical self-hosted fleet: the agent and threat-detection jobs
# need Docker/AWF and target the noble/amd64 runners; the framework and
# safe_outputs jobs use the slim self-hosted label.
runs-on: [self-hosted, noble, amd64]
runs-on-slim: self-hosted

# The self-hosted runner image ships an old Node that breaks gh-aw's runtime
# scripts ("Cannot find module 'node:fs'" in the activation job). Pin a modern
# Node for the activation job only.
jobs:
  activation:
    pre-steps:
      - name: Setup modern Node for gh-aw runtime
        uses: actions/setup-node@v4
        with:
          node-version: "24"

# The self-hosted runner image also ships an old gh that lacks 'gh attestation
# verify', which the agent job's AWF install requires. Install a
# checksum-verified modern gh before the agent's Setup Scripts.
pre-steps:
  - name: Install modern gh CLI
    run: |
      GH_VERSION="2.83.1"
      GH_SHA256="1c5252d4ce3db07b51c01ff0b909583da6364ff3fdc06d0c2e75e62dc0380a34"
      tmp="$(mktemp -d)"
      curl -fsSL "https://github.com/cli/cli/releases/download/v${GH_VERSION}/gh_${GH_VERSION}_linux_amd64.tar.gz" -o "$tmp/gh.tgz"
      echo "${GH_SHA256}  $tmp/gh.tgz" | sha256sum -c -
      tar -xzf "$tmp/gh.tgz" -C "$tmp"
      install -m 0755 "$tmp/gh_${GH_VERSION}_linux_amd64/bin/gh" /usr/local/bin/gh
      rm -rf "$tmp"
      gh version
    env:
      GH_TOKEN: ${{ github.token }}

# The self-hosted runner image does not ship the Docker Compose plugin, so the
# AWF sandbox's `docker compose up -d` fails with "unknown shorthand flag: 'd'
# in -d" and the agent job exits 125. Install the plugin in the agent job
# before the AWF bring-up (same fix as the DISA STIG evaluator's
# test-airgap.md).
steps:
  - name: Install Docker Compose plugin
    run: |
      if docker compose version >/dev/null 2>&1; then
        echo "Docker Compose plugin already present, skipping install."
        docker compose version
        exit 0
      fi
      COMPOSE_VERSION="v5.5.0"
      mkdir -p ~/.docker/cli-plugins
      curl -fsSL "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-linux-x86_64" \
        -o ~/.docker/cli-plugins/docker-compose
      chmod +x ~/.docker/cli-plugins/docker-compose
      docker compose version

# Shell access for inspecting history and formatting dates. The pi engine
# cannot allowlist individual commands, so bash is open; the AWF sandbox and
# safe-output handlers still confine network and writes.
tools:
  bash: ["*"]
  edit:

# The agent never pushes directly; its file edits are turned into a pull request.
# gh-aw binds the whole safe_outputs job to ONE credential for its git checkouts
# and pushes (github/gh-aw#77580), and the default GITHUB_TOKEN cannot write to
# canonical/landscape-documentation. The job therefore runs on
# LANDSCAPE_CHANGELOG_TOKEN, a fine-grained PAT with contents/pull-requests
# read+write on this repo and landscape-documentation, which covers both the
# own-repo changeset PR and the docs release-notes push.
safe-outputs:
  github-token: ${{ secrets.LANDSCAPE_CHANGELOG_TOKEN }}
  # The safe_outputs job runs on the slim self-hosted label (no Docker needed).
  runs-on: self-hosted
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
    # The bot only ever adds NEW changeset files in this repo; docs edits are
    # delivered by the push handler, so the create handler rejects any other
    # path outright.
    allowed-files: [".changeset/*.md"]
    # Stripped from any delivered patch: CHANGELOG.md belongs to the Version
    # Packages automation, and .changeset/README.md / config.json match the
    # allowlist above, so they are excluded explicitly. (gh-aw allowed-files
    # filters by path only, not diff status, so "new files only" for other
    # existing changesets is enforced by the prompt, not the handler.)
    excluded-files: ["CHANGELOG.md", ".changeset/README.md", ".changeset/config.json"]
    # gh-aw v0.89.21 only opts a dot-folder out of the top-level dot-folder
    # protection via a "<dir>/" prefix entry (globs are not matched here).
    protected-files:
      exclude: [".changeset/"]
  # gh-aw defaults threat detection to the Codex engine, which needs a Codex
  # credential this repo does not carry. Pin it to the Copilot CLI so it uses
  # COPILOT_GITHUB_TOKEN, matching the documented secret contract.
  threat-detection:
    engine: copilot
    # Threat detection needs Docker/AWF like the agent job.
    runs-on: [self-hosted, noble, amd64]
  push-to-pull-request-branch:
    target: "*"
    target-repo: canonical/landscape-documentation
    github-token: ${{ secrets.LANDSCAPE_CHANGELOG_TOKEN }}
    required-labels: [changelog, automation]
    # Docs PR updates may only touch release-notes pages (including index.md).
    allowed-files: ["docs/reference/release-notes/*.md"]
    max: 1
---

# Weekly missing changesets

You backfill missing Changesets for Landscape UI. This repo's `CHANGELOG.md` and version bumps are produced by the Changesets release automation (`changesets/action`), so your job is NOT to write the changelog yourself. Your job is to author `.changeset/*.md` entries for user-facing pull requests that were merged without one (the gap documented in `RELEASES.md` section 7), then open a single pull request containing all of the new changesets.

## Hard prohibitions

- NEVER create, edit, or delete `CHANGELOG.md`, `package.json`, or any lockfile. Those are outputs of the Changesets "Version Packages" automation; touching them fights that automation. This is mechanically enforced by the pull-request handler: `CHANGELOG.md` is stripped from any patch it delivers, and `package.json` plus the lockfiles stay in the default protected-file set.
- NEVER edit an existing `.changeset/*.md` file.
- Only ever create NEW files under `.changeset/`.

## Gather the commits

1. The scan window is time-based: list the commits from the last four weeks with `git log --since="4 weeks ago" --no-merges --pretty=%H%x09%s`. `main` is squash-merged, so each merged PR is a single commit on this list. Do NOT anchor on `CHANGELOG.md` commits: the `Version Packages` PR on `main` is closed rather than merged before each cut (RELEASES.md section 3), so `CHANGELOG.md` on `main` is stale and a changelog anchor would silently treat undocumented commits as covered. Four weeks against a weekly schedule gives three weeks of overlap with the previous run, so omissions leapfrogged by later merges are still caught; the deduplication rules below prevent double-filing.
2. Skip any commit whose subject has no trailing pull request reference ` (#1234)`. Such commits cannot carry the `(backfills #<N>)` marker the deduplication relies on, so they can never be filed safely; if one looks user-facing, mention it in the PR body under `Changesets to review` instead of backfilling it.
3. Deduplicate the rest by pull request number. For each commit, extract its PR number `<N>` from the trailing ` (#1234)` reference in the subject. Skip the commit if ANY of the following hold:
   a. Its own commit added a NON-EMPTY changeset: run `git show --name-status --format= <commit>` and look for a line with status `A` (added) whose path matches `.changeset/*.md` (ignoring `.changeset/README.md` and `.changeset/config.json`), then read that file — it counts as coverage only if its frontmatter assigns a bump (`major`/`minor`/`patch`) to a package. Only status `A` counts — a modified (`M`) or deleted (`D`) changeset path is NOT coverage. If the commit added ONLY empty changesets (no package/bump in the frontmatter), do NOT backfill one: an empty changeset can be a deliberate choice (e.g. one shared non-empty changeset for a whole PR stack, as in #799). Flag it in the review section below instead.
   b. A pending changeset already covers it: search the existing `.changeset/*.md` files in the working tree for the exact reference `#<N>` (match the full number — `#123` must not match `#1234`). Every backfilled changeset ends its summary with `(backfills #<N>)`, so a pending changeset containing `#<N>` means this PR is already covered.
   c. The changelog already covers it: check whether the TOP section of `CHANGELOG.md` (the latest release — everything from the first `## ` heading up to the second) references `#<N>`. `CHANGELOG.md` on `main` is stale (see step 1), so treat this only as an extra deduplication signal, never as proof that older commits are covered.

## Select user-facing commits only

Include only commits that a Landscape administrator would notice. Commit subjects in this repo are usually conventional commits, but the type prefix is sometimes capitalized (e.g. `Fix:`) and occasionally missing entirely — match prefixes case-insensitively and use your judgment for non-conforming subjects.

- **Include**: `feat:`, `fix:`, `perf:`, and any breaking change (a `!` before the colon, e.g. `feat!:` / `fix!:`).
- **Maybe Include**: `refactor: ` commits, only if they are user-facing.
- **Exclude**: `chore:`, `ci:`, `test:`, `build:`, `docs:`, and `style:`, commits,
  plus anything that only touches tooling, tests, or CI, and any dependency bumps.

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

Exclude flagged entries from the docs release-notes island. If a pull request is opened, list the flagged entries under a `Changesets to review` heading in its body, one bullet per PR with the reason and evidence (commit/PR links). If no pull request is opened (nothing to backfill), report the flagged entries in your run summary instead — do not open a pull request that contains no files.

## Open the pull request

Open a single pull request containing all of the new changeset files. Use the title `add missing changesets` (the `build: ` prefix is added automatically) and a body that lists the backfilled entries in the sorted order from above, notes the merged PR each entry covers, explains that these PRs were merged without a changeset so the Changesets automation had nothing to roll up, and includes the `Changesets to review` heading when any entries were flagged. If no changesets were needed, do nothing — do not open an empty pull request.

## Docs release notes (shared PR)

You also maintain the user-facing release notes. All Landscape changelog bots share ONE pull request against `canonical/landscape-documentation` that drafts the release notes for the in-development Landscape release. Each bot owns exactly one marked section (island) in that PR. NEVER open a separate per-repo docs PR: find the shared PR and push to it.

The docs work happens in the separate `./landscape-documentation` checkout. The hard prohibitions above apply to this repository (landscape-ui) only; editing the release-notes page in the docs checkout is expected and allowed.

Your island content derives from ALL user-facing commits selected in the window above — not only the ones missing a changeset: a PR that brought its own changeset still belongs in the release notes. Rewrite those selected commits into docs-appropriate bullets, excluding any entries flagged in `Changesets to review`.

1. Determine the in-development Landscape release `YY.MM`: Landscape releases are `YY.04` and `YY.10`. From today's date, the in-development release is the next boundary strictly in the future (before April -> `YY.04`; before October -> `YY.10`; otherwise `(YY+1).04`). As of November 2026 this is **27.04** (betas are underway), so the target page is `docs/reference/release-notes/27.04-release-notes.md`.
2. Find the shared docs PR: use the GitHub tools to list open PRs in `canonical/landscape-documentation` with labels `changelog` and `automation` (title starts with `build: `). If one exists, this is THE docs PR — use it regardless of which `YY.MM` page it targets.
3. If a docs PR exists:
   - In the `./landscape-documentation` checkout, check out that PR's head branch (branches were fetched via the wildcard fetch at setup: `git checkout <branch>`). If the branch is not among the fetched refs, skip the docs work for this run — the agent has no credentials to fetch it.
   - Other Landscape bots push to this same shared branch, so the checkout (fetched at setup time) may be stale and another bot may push while you work. The agent environment has NO git credentials — `git fetch` fails here, so NEVER attempt to fetch or rebase. Work from the PR branch ref as fetched at setup; keep every edit strictly inside your own island markers so it applies cleanly over the other bots' island updates. `push_to_pull_request_branch` applies your patch to the branch's live tip in a credentialed job; if a concurrent push made it conflict, the delivery fails safely — do not retry, the next run redoes the work. NEVER force-push over another bot's commits.
   - Update ONLY your own island (see below). If the release-notes page for the in-development version does not exist on that branch, create it from the template below and add it to the toctree in `docs/reference/release-notes/index.md` (newest non-LTS page goes directly under the LTS entries, matching existing ordering).
   - Commit in the docs checkout and deliver via `push_to_pull_request_branch` with `pull_request_number` set to the docs PR number.
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
