# CI/CD Workflows

This is a reference for the workflows under `.github/workflows/` other than Integration Tests, which has its own deep-dive doc: [docs/integration-testing.md](integration-testing.md) (including the SHA-pinned third-party actions convention — unique to that workflow).

Agents must follow these triggers, job orders, and guardrails when touching `.github/workflows/`.

## Validate (`validate.yml`)

**Trigger:** PR → `main`, `release/**`, `point/**`; merge queue (`merge_group`).

Independent jobs (no `needs` chain):

- **ESLint** — `pnpm eslint --cache`
- **Prettier** — `pnpm prettier --check src`
- **Stylelint** — `pnpm stylelint "src/**/*.module.scss"`
- **Playwright** (self-hosted; `ubuntu-latest` for fork PRs; `mcr.microsoft.com/playwright` container) — matrix over `saas` / `self-hosted`; builds with `pnpm run build:e2e` (`VITE_ROOT_PATH=/`), installs browsers, runs the matching project against the `dev` backend (`vars.API_PROXY_TARGET`), uploads `playwright-report-<target>`
- **Vitest** (self-hosted; `ubuntu-latest` for fork PRs) — `pnpm exec vitest run --coverage` with `VITE_ROOT_PATH=/portal/` and `NODE_OPTIONS=--max_old_space_size=4096`; uploads `vitest-report` from `reports/`
- **Changeset** — fails the PR unless it *adds* a file under `.changeset/*.md` (excluding `README.md`). An empty changeset (`pnpm changeset --empty`) satisfies it.
- **Backporter tests** — `node --test '.github/scripts/backporter/*.test.cjs'` on Node 24, with SHA-pinned checkout/setup-node and no pnpm install or dependency cache.

**Rule:** fork PRs get no `vars.*` (the `dev` environment's variables come through empty), so the Playwright and Vitest `VITE_API_*` env lines fall back to literal defaults only when `github.event.pull_request.head.repo.fork` is true; keep those defaults in sync with `.env.production`, and never add a secret to either job. Fork PR runs stay on GitHub-hosted runners; merge-queue runs (`merge_group` has no fork flag) use self-hosted runners, which is safe because entering the queue requires an approving code-owner review.

## Backporter link (`backporter-link.yaml`)

**Trigger:** `pull_request_target` opened/reopened/edited against `release/**`
or `point/**`. A PR titled `<title> (backport of #N)` against a target in the
script's `BACKPORT_BRANCHES` allowlist links its URL into source PR N's bare
"Releases this PR should be backported to" entry. Enable a target only after
its own PR CI runs. Human procedure: [backport-pr skill](../.github/skills/backport-pr/SKILL.md).

**Trust:** only a same-repository head or OWNER/MEMBER/COLLABORATOR may link,
and the source must have merged into main. The job never checks out PR code:
it sparse-checks the default branch's script with `persist-credentials: false`
and uses only `GITHUB_TOKEN`. It shares the workflow-level, non-cancelling
`backporter-source-body` group with other source-body writers; `queue: max`
keeps pending runs from replacing each other. Only open backports link, and
`edited` runs only when the title or base changed.

## Changeset Version (`changeset-version.yml`)

**Trigger:** push → `main`.

Maintains the "Version Packages" PR via `changesets/action@v1` + `scripts/manual-version-update.cjs`. No build, no tag, no publish — `main` is the integration trunk and CHANGELOG baseline, not a publish target; betas ship from `point/**`, stable from `release/**`.

**Rule:** do not add a build or `ppa-build-*` step here.

## Release and PPA Build (`release-and-build.yml`)

**Trigger:** push → `release/**` or `point/**`; `workflow_dispatch` (guarded to those refs).

- **process-release** — computes the version (`scripts/calculate-version.cjs`), derives the per-branch `ppa-build-*` destination, resolves stable promotion (highest `release/YY.MM` on origin, or the `STABLE_RELEASE_BRANCH` override), and sets `should_build=false` when `v<version>` is already tagged (no-op rebuild guard). When building: version bump → production build (`VITE_ROOT_PATH=/portal/`) → force-publish `dist/` to the destination branch → tag `v<version>` → mirror to `ppa-build-stable` if promoted.
- **build-deb** — needs `process-release`; builds the unsigned `.deb` from the `dist` artifact.

**Rule:** do not change branch selection, the `should_build` tag guard, or the tag-after-deploy ordering.

## Security Scan (`security.yaml` + `security-scan.yaml`)

**Trigger (`security.yaml`):** completion of a **Release and PPA Build** run, whatever its conclusion, → the branch it published (the record is force-pushed before the tag and deb steps, so a run that failed afterwards still shipped a build; `meta` fails when nothing was published); `workflow_dispatch` (optional `ref` input, defaults to the dispatching branch); weekly cron (`0 3 * * 1`).

SSDLC evidence for the shipped product (SEC0025 vulnerability scanning, SEC0027 SBOM). The product is the `landscape-dashboard` `.deb` (the package name from `debian/control`) of bundled static assets, which carries no package metadata of its own, so the SBOM and the vulnerability report come from `pnpm-lock.yaml` (production dependencies only) and the `.deb` is what goes to the central scanner.

`security.yaml` only picks branches and fans out; `security-scan.yaml` is the reusable `workflow_call` that scans one branch (`ref` input). One scan per branch and trigger runs at a time: release-triggered scans queue rather than cancel, so a scan already in progress finishes its evidence run, while manual and scheduled scans cancel an older in-progress one. Builds published faster than they can be scanned are not each scanned individually: GitHub keeps one pending run per group and `meta` reads the `ppa-build-*` tip, so the next scan describes the latest build, which is also the only one the PPA ships.

- **targets** — the branch list: the branch a release just published, the dispatch `ref`, or on the weekly schedule `main` plus every branch in the `SUPPORTED_RELEASE_BRANCHES` repo variable (fallback: the highest `release/YY.MM` on origin). Shipped releases are therefore rechecked for newly disclosed CVEs without anyone pushing to them. The scan hangs off the release workflow rather than the push that triggered it because on a push the build has not been published yet, so the scan would still describe the previous release.
- **scan** — matrix over that list calling `security-scan.yaml` with `contents: write` as the cap; `fail-fast: false` so one red branch does not cancel the others.

Inside `security-scan.yaml`:

- **meta** — the published version and the commit it was built from, read out of the branch's `ppa-build-*` tip, whose subject `release-and-build.yml` writes as `Build v<version> from <branch> [<sha>]`; plus the SSDLC cycle (from the `release/YY.MM` or `point/YY.MM.N` name, calendar fallback elsewhere) and the secscan channel (`candidate` while the published version is `-rc`, `stable` after, `edge` off release refs). The publish record is the authority here rather than `scripts/calculate-version.cjs`: the script is resolved from the scanned branch, and the oldest release branches do not carry it while older ones derive the build number from `GITHUB_RUN_NUMBER`, which in this workflow is this run's number rather than the release build's. A branch with no `ppa-build-*` record has shipped nothing and fails the scan with that message. Off release refs (`main`) nothing is published, so the tip is scanned and labelled `<branch>-<short sha>`.
- **sbom** — Trivy `fs` scan of the lockfile → SPDX JSON artifact (90 days). Read-only.
- **persist-sbom** (release/point refs only) — downloads that artifact and commits it to the unprotected `sbom` branch as `<release branch>/landscape-ui.spdx.json` (e.g. `release/26.10/landscape-ui.spdx.json`), next to a `commit` file holding the scanned SHA, with a fetch-reapply-retry loop (3 attempts) so concurrent pushes from different release branches never need a rebase. Overlapping scans of the same ref (a weekly run and a release publish) are safe too: a run only writes when its commit is newer than the one in the `commit` file, so the newest scan wins whichever finishes last and reruns of an unchanged release add no commits. The recorded commit is fetched before that comparison, since it can come from a run that started after this one checked out, and the overwrite happens only when the recorded commit is an ancestor of the scanned one; if the two cannot be ordered (diverged history, or git cannot compare them) the job fails rather than defaulting to an overwrite. Release and point branches are ruleset-protected and refuse direct pushes, so the SBOM cannot live next to the code. One file per branch keeps the history diffable between versions; GitHub artifact retention alone is not enough for the SSDLC review. The only job with `contents: write`, kept apart from the Trivy step so the third-party action never runs with a token that can push, and it checks out the workflow's own ref rather than the scanned commit, so release-branch code is never on disk next to that token.
- **vulnerability-report** — Trivy `fs` scan → full unfiltered JSON report artifact (every severity, fixed or not, for the SSDLC vulnerability tracker), then a gating pass that fails on fixable HIGH/CRITICAL findings. Both scans are pointed at an empty ignore file outside the checkout, so a `.trivyignore` on the scanned branch cannot hide findings from either.
- **build-deb** (release/point refs only) — same production build inputs and `dpkg-buildpackage` steps as `release-and-build.yml`, at the anchored commit, so the scanned `.deb` matches what that workflow published. It installs without the pnpm cache: a cache written while installing from the scanned commit would be served to runs on `main`.
- **secscan** (self-hosted, release/point refs only, 30-minute timeout) — submits the `.deb` to `canonical-secscan-client` (`--format deb --type package --base jammy`) with the SSDLC metadata. The job fails unless the client reports `Scan has succeeded.` (it exits 0 on a scan that broke on the service side, with the scan log on stderr, which the results artifact captures); after that the scanner's exit code becomes the job's exit code (100 = findings remain, 101 = stale exclusions), except that 100 passes when the `Target vulnerabilities:` list is empty, because the client also counts the jammy environment's own baseline CVEs, which are never zero and not ours.

**Rule:** preserve the publish-record anchor in `meta`, the `Scan has succeeded.` check and exit-code propagation in `secscan`, exit-code propagation in `vulnerability-report`, the unfiltered report (SEC0025 says do not delete findings), the SBOM commit race protection, and the read-only default token. Keep the deb build steps in sync with `release-and-build.yml`.

**Per cycle, by hand:** download the SBOM, the Trivy report and the secscan results from the release-branch run and file them in the SSDLC Artifacts folder for the cycle; copy findings into the vulnerability tracker with the team's assessment. Keep `SUPPORTED_RELEASE_BRANCHES` current when a release goes out of support.

## Full TICS report (`tics-full.yml`)

**Trigger:** `workflow_dispatch`; monthly cron (`0 3 1 * *`).

- **unit-tests** — same shape as the Validate Vitest job; uploads `vitest-report`.
- **tics-report** — needs `unit-tests`; self-hosted TIOBE runner, `mode: qserver`, `installTics: true`, a per-run `tmpdir`, and a repository-wide `concurrency` group (self-hosted runners share machine state, so qserver runs must be serialized).

**Rule:** keep `pnpm run tcm:run` before the TICS step — it needs the generated CSS module declarations.

## API Contract Eval Loop (`api-contract-eval.yml`)

**Trigger:** `workflow_dispatch`; weekly cron (Mondays 06:00 UTC). Not part of the PR merge gate — informational only.

Runs `pnpm coverage:full` to produce the MSW contract-coverage report, deterministically diffs frontend-exercised routes against the Playwright API-contract specs (`pnpm eval:collect`), then asks an LLM to draft spec suggestions for the top-5 gaps (`pnpm eval:suggest`, needs `secrets.LLM_API_KEY`; OpenRouter by default). Uploads the `api-contract-eval-report` artifact even if the LLM step fails, but an LLM failure still fails the job; only the artifact upload is unconditional.

## CI Tooling Contracts

- **Node:** `24` · **pnpm:** `10` · **Install:** `pnpm install --frozen-lockfile` only
- **Playwright:** install browsers (`pnpm exec playwright install --with-deps`) inside the job that runs them — never move this out
- **Caching:** `actions/setup-node@v4` with `cache: "pnpm"`

## Agents MUST NOT

- Suggest `npm`/`yarn` commands or change Node/pnpm versions.
- Add a build or publish step to `changeset-version.yml` — `main` does not ship.
- Change branch selection or the `should_build` tag guard in `release-and-build.yml`.
- Alter the publish-record anchor or exit-code propagation in `security-scan.yaml`'s `meta`, `secscan` or `vulnerability-report` jobs, or widen its default token beyond `contents: read`.
- Treat `api-contract-eval.yml` as a required merge check — it isn't one.
