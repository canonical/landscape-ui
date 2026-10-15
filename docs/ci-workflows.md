# CI/CD Workflows

This is a reference for the workflows under `.github/workflows/` other than Integration Tests, which has its own deep-dive doc: [docs/integration-testing.md](integration-testing.md) (including the SHA-pinned third-party actions convention — unique to that workflow).

Agents must follow these triggers, job orders, and guardrails when touching `.github/workflows/`.

## Validate (`validate.yml`)

**Trigger:** PR → `main`, `release/**`, `point/**`; merge queue (`merge_group`).

Independent jobs (no `needs` chain):

- **ESLint** — `pnpm eslint --cache`
- **Prettier** — `pnpm prettier --check src`
- **Stylelint** — `pnpm stylelint "src/**/*.module.scss"`
- **Playwright** (self-hosted, `mcr.microsoft.com/playwright` container) — matrix over `saas` / `self-hosted`; builds with `pnpm run build:e2e` (`VITE_ROOT_PATH=/`), installs browsers, runs the matching project, uploads `playwright-report-<target>`
- **Vitest** (self-hosted) — `pnpm exec vitest run --coverage` with `VITE_ROOT_PATH=/portal/` and `NODE_OPTIONS=--max_old_space_size=4096`; uploads `vitest-report` from `reports/`
- **Changeset** — fails the PR unless it *adds* a file under `.changeset/*.md` (excluding `README.md`). An empty changeset (`pnpm changeset --empty`) satisfies it.

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

**Trigger (`security.yaml`):** push → `release/**` or `point/**`; `workflow_dispatch` (optional `ref` input, defaults to the dispatching branch); weekly cron (`0 3 * * 1`).

SSDLC evidence for the shipped product (SEC0025 vulnerability scanning, SEC0027 SBOM). The product is the `landscape-dashboard` `.deb` (the package name from `debian/control`) of bundled static assets, which carries no package metadata of its own, so the SBOM and the vulnerability report come from `pnpm-lock.yaml` (production dependencies only) and the `.deb` is what goes to the central scanner.

`security.yaml` only picks branches and fans out; `security-scan.yaml` is the reusable `workflow_call` that scans one branch (`ref` input).

- **targets** — the branch list: the pushed branch, the dispatch `ref`, or on the weekly schedule `main` plus every branch in the `SUPPORTED_RELEASE_BRANCHES` repo variable (fallback: the highest `release/YY.MM` on origin). Shipped releases are therefore rechecked for newly disclosed CVEs without anyone pushing to them.
- **scan** — matrix over that list calling `security-scan.yaml` with `contents: write` as the cap; `fail-fast: false` so one red branch does not cancel the others.

Inside `security-scan.yaml`:

- **meta** — version at the branch tip (`scripts/calculate-version.cjs`, with `GITHUB_REF_NAME` set to the input branch on the `node` process itself, since the runner ignores `GITHUB_*` in `env` blocks), SSDLC cycle (from the `release/YY.MM` or `point/YY.MM.N` name, calendar fallback elsewhere), secscan channel (`candidate` while `-rc`, `stable` once the branch is in `RELEASED_BRANCHES`, `edge` off release refs), and the commit to scan: the `v<version>` tag when it exists, otherwise the tip. A `chore(deps)` push does not bump the version and the release workflow skips publishing for it, so the tag anchor keeps every job on the commit that actually shipped.
- **sbom** — Trivy `fs` scan of the lockfile → SPDX JSON artifact (90 days), and on release/point refs commits it to the unprotected `sbom` branch as `<release branch>/landscape-ui.spdx.json` (e.g. `release/26.10/landscape-ui.spdx.json`), with a fetch-reapply-retry loop (3 attempts) so concurrent pushes from different release branches never need a rebase. Release and point branches are ruleset-protected and refuse direct pushes, so the SBOM cannot live next to the code. One file per branch keeps the history diffable between versions; GitHub artifact retention alone is not enough for the SSDLC review. The only job with `contents: write`.
- **vulnerability-report** — Trivy `fs` scan → full unfiltered JSON report artifact (every severity, fixed or not, for the SSDLC vulnerability tracker), then a gating pass that fails on fixable HIGH/CRITICAL findings.
- **build-deb** (release/point refs only) — same production build inputs and `dpkg-buildpackage` steps as `release-and-build.yml`, at the anchored commit, so the scanned `.deb` matches what that workflow published.
- **secscan** (self-hosted, release/point refs only, 30-minute timeout) — submits the `.deb` to `canonical-secscan-client` (`--format deb --type package --base jammy`) with the SSDLC metadata; the scanner's exit code becomes the job's exit code.

**Rule:** preserve the tag anchor in `meta`, exit-code propagation in `secscan` and `vulnerability-report`, the unfiltered report (SEC0025 says do not delete findings), the SBOM commit race protection, and the read-only default token. Keep the deb build steps in sync with `release-and-build.yml`.

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
- Alter the tag anchor or exit-code propagation in `security-scan.yaml`'s `meta`, `secscan` or `vulnerability-report` jobs, or widen its default token beyond `contents: read`.
- Treat `api-contract-eval.yml` as a required merge check — it isn't one.
