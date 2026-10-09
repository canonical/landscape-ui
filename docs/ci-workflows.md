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

## Vulnerability Scan (`security.yaml`)

**Trigger:** `workflow_dispatch`; push → `release/**` (ignoring `security/sbom/**`, to avoid a commit loop).

- **build-image** — builds the OCI image, uploads it as the `image-tar` artifact.
- **scan-and-report** (self-hosted) — runs `canonical-secscan-client` against `image.tar`; the scanner's exit code becomes the job's exit code.
- **generate-and-commit-sbom** — Trivy SBOM (`spdx-json`) → artifact, and on a `release/**` push commits it to `security/sbom/release.spdx.json`, with a rebase-and-retry loop (3 attempts) in case another commit lands first.

**Rule:** preserve exit-code propagation and the SBOM commit race protection.

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
