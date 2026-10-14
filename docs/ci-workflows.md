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

## Security Scan (`security.yaml`)

**Trigger:** push → `release/**` or `point/**` (ignoring `security/sbom/**`, to avoid a commit loop); `workflow_dispatch`; weekly cron on `main` (`0 3 * * 1`).

SSDLC evidence for the shipped product (SEC0025 vulnerability scanning, SEC0027 SBOM). The product is the `landscape-dashboard` `.deb` (the package name from `debian/control`) of bundled static assets, which carries no package metadata of its own, so the SBOM and the vulnerability report come from `pnpm-lock.yaml` at the same commit (production dependencies only) and the `.deb` is what goes to the central scanner.

- **meta** — version (`scripts/calculate-version.cjs`), SSDLC cycle (from the `release/YY.MM` or `point/YY.MM.N` branch name, calendar fallback elsewhere), secscan channel (`candidate` while `-rc`, `stable` once the branch is in `RELEASED_BRANCHES`, `edge` off release refs) and whether the ref is a release/point branch.
- **sbom** — Trivy `fs` scan of the lockfile → SPDX JSON artifact (90 days), and on release/point refs commits it to `security/sbom/landscape-ui.spdx.json` with a rebase-and-retry loop (3 attempts). One file per branch so the git history is diffable between versions; GitHub artifact retention alone is not enough for the SSDLC review.
- **vulnerability-report** — Trivy `fs` scan → full unfiltered JSON report artifact (every severity, fixed or not, for the SSDLC vulnerability tracker), then a gating pass that fails on fixable HIGH/CRITICAL findings.
- **build-deb** (release/point refs only) — same production build inputs and `dpkg-buildpackage` steps as `release-and-build.yml`, so the scanned `.deb` matches what that workflow publishes for the commit.
- **secscan** (self-hosted, release/point refs only, 30-minute timeout) — submits the `.deb` to `canonical-secscan-client` (`--format deb --type package --base jammy`) with the SSDLC metadata; the scanner's exit code becomes the job's exit code.

**Rule:** preserve exit-code propagation, the unfiltered report (SEC0025 says do not delete findings), and the SBOM commit race protection. Keep the deb build steps in sync with `release-and-build.yml`.

**Per cycle, by hand:** download the SBOM, the Trivy report and the secscan results from the release-branch run and file them in the SSDLC Artifacts folder for the cycle; copy findings into the vulnerability tracker with the team's assessment.

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
- Alter exit-code propagation in `security.yaml`'s `scan-and-report` job.
- Treat `api-contract-eval.yml` as a required merge check — it isn't one.
