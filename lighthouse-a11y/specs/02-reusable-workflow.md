# 02 — Workstream B: reusable `workflow_call` workflow

**Owner:** one engineer. Single PR.
**Depends on:** `00-foundation.md` merged (stub workflow + `@lhci/cli` in `package.json`).
**Parallel with:** A, C, D.
**Cooperates with:** D — this workflow invokes `build-comment.cjs`.

## Goal

Implement the reusable GitHub Actions workflow that other Canonical repos consume via `uses: canonical/landscape-ui/.github/workflows/lighthouse-a11y.reusable.yml@<ref>`. This is the "platform" layer.

## Deliverables

### `ui/.github/workflows/lighthouse-a11y.reusable.yml`

Replace the foundation stub with the full implementation. Input declarations are locked by foundation — fill in the body.

### Full input surface (locked)

| Input | Type | Default | Purpose |
|---|---|---|---|
| `wcag-level` | string | `aa` | Selects assertion preset (`a` / `aa` / `aaa`). |
| `min-score` | string | `""` | Override accessibility category floor; empty = derived from level. |
| `config-path` | string | `./lighthouserc.cjs` | Consumer's LHCI config, expected to extend the base. |
| `urls` | string | `""` | Newline-separated URL list (mutually exclusive with `urls-file`). |
| `urls-file` | string | `""` | Path to JSON/text file with URLs in the consumer repo. |
| `mode` | string | `block` | `block` or `annotate`. |
| `auth-mode` | string | `public` | `public` / `msw` / `both`. v1 only honours `public`. |
| `build-command` | string | `pnpm build` | Build before serving. |
| `serve-command` | string | `pnpm preview --host 0.0.0.0 --port 4173` | Background server. |
| `serve-url` | string | `http://localhost:4173` | Health-check target. |
| `serve-ready-timeout-seconds` | number | `180` | How long to wait for serve-url to return 200. |
| `working-directory` | string | `.` | All steps `cd` here first. |
| `node-version` | string | `24` | |
| `package-manager` | string | `pnpm` | `pnpm` / `npm` / `yarn`. |
| `package-manager-version` | string | `10` | |
| `install-command` | string | `""` | Empty → derived from `package-manager`. |
| `upload-artifact-name` | string | `lighthouse-report` | |
| `artifact-retention-days` | number | `30` | |
| `pr-comment` | boolean | `true` | Sticky comment via `marocchino/sticky-pull-request-comment@v2`. |
| `lhci-version` | string | `0.14.x` | `@lhci/cli` pin (Node 24 compatible). |
| `runs-on` | string | `ubuntu-latest` | Escape hatch for self-hosted JSON array string. |

Plus optional secret `lhci-github-app-token` (used by `lhci upload` if/when we switch to GitHub status checks).

### Permissions

```yaml
permissions:
  contents: read
  pull-requests: write
```

Workflow is opt-in via `uses:`, so `pull-requests: write` is safe at job level.

### Job steps (in order)

1. **Checkout**: `actions/checkout@v5`.
2. **Setup package manager + Node**: branch on `inputs.package-manager`. For pnpm, mirror `ui/.github/workflows/lint.yml:23-34` (`pnpm/action-setup@v4` then `actions/setup-node@v4` with `cache: "pnpm"`).
3. **Install dependencies**: if `inputs.install-command` is non-empty use it verbatim; else derive — `pnpm install --frozen-lockfile`, `npm ci`, or `yarn install --frozen-lockfile`. Always run in `inputs.working-directory`.
4. **Build**: `bash -c "${{ inputs.build-command }}"` in working dir.
5. **Resolve URL list**:
   - If `inputs.urls` is non-empty: write each line to `$RUNNER_TEMP/urls.txt`.
   - Else if `inputs.urls-file` is non-empty: copy that file to `$RUNNER_TEMP/urls.txt`.
   - Else: fail with a clear error.
   - Lines starting with `/` are prefixed with `inputs.serve-url`.
   - Export the resolved file path as `LHCI_URLS_FILE` for the LHCI step.
6. **Auth-mode warning**: if `inputs.auth-mode` is `msw` or `both`, emit a `::warning::` line ("MSW mode requires landscape-ui v1.1 changes; falling back to public") and proceed with the public flow. Do not fail.
7. **Start server in background**: `nohup bash -c "${{ inputs.serve-command }}" > /tmp/serve.log 2>&1 &`. Poll `inputs.serve-url` with `curl --fail --silent --retry 0` until 200, up to `inputs.serve-ready-timeout-seconds` seconds. Print `/tmp/serve.log` and fail clearly on timeout.
8. **Install LHCI**: `npm install --no-save @lhci/cli@${{ inputs.lhci-version }}` in working dir. (Don't depend on the consumer having `@lhci/cli` in their lockfile — they may not.)
9. **Run Lighthouse** — set env from inputs:
   ```yaml
   env:
     LHCI_WCAG_LEVEL: ${{ inputs.wcag-level }}
     LHCI_MIN_SCORE:  ${{ inputs.min-score }}
     LHCI_AUTH_MODE:  ${{ inputs.auth-mode }}
     LHCI_MODE:       ${{ inputs.mode }}
     LHCI_URLS_FILE:  ${{ env.LHCI_URLS_FILE }}
   ```
   - `mode: block` → `npx lhci autorun --config=${{ inputs.config-path }}`. Step fails on assertion failure.
   - `mode: annotate` → run `npx lhci collect --config=...` then `npx lhci upload --config=... || true`. Do **not** run `lhci assert`. Force exit 0 on this step.
10. **Upload artifact**: `actions/upload-artifact@v4` with `name: ${{ inputs.upload-artifact-name }}`, `path: ${{ inputs.working-directory }}/.lighthouseci`, `retention-days: ${{ inputs.artifact-retention-days }}`. Run with `if: always()` so failures still leave a report.
11. **Capture artifact URL**: read the action's output (the action returns the artifact's url/id) and export to env as `LHCI_ARTIFACT_URL`.
12. **Build PR comment**: if `inputs.pr-comment == true` AND `github.event_name == 'pull_request'`:
    - `node ${{ inputs.working-directory }}/.github/lighthouse/build-comment.cjs > $RUNNER_TEMP/comment.md` (script env: `LHCI_MODE`, `LHCI_ARTIFACT_URL`).
    - `uses: marocchino/sticky-pull-request-comment@v2` with `header: lighthouse-a11y`, `path: $RUNNER_TEMP/comment.md`.
    - Guard with `if: always()` so a failing assert in block-mode still posts the comment.

### Concurrency

```yaml
concurrency:
  group: lighthouse-a11y-${{ github.workflow }}-${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: true
```

## Tests

The workflow YAML itself isn't unit-testable. The testing contract for this workstream is:

**Integration (mandatory, both must pass):**

1. **Self-call on `canonical/landscape-ui`** — open a draft PR. Confirm:
   - The `pr-public` job runs to completion.
   - The artifact `lighthouse-report-pr` is uploaded.
   - The sticky comment lands on the PR with the expected banner ("Annotate-only" or "Blocking").
   - `mode: annotate` exits 0 even when audits would fail; `mode: block` exits non-zero on failure.
2. **External consumer probe** — from any throwaway repo, draft a workflow that calls this reusable workflow via `uses: canonical/landscape-ui/.github/workflows/lighthouse-a11y.reusable.yml@<sha>` with only `urls` + `wcag-level` + `mode: annotate`. Confirm the run is green end-to-end and produces a comment + artifact.

**Unit (mandatory for any helper extracted from the workflow):**

If you extract URL resolution, server readiness polling, or auth-mode warning logic into a script (`.cjs` or shell) under `ui/.github/lighthouse/` rather than inlining in YAML, that script ships with a Vitest test. Required cases for a URL-resolver helper:

- Both `urls` and `urls-file` empty → throws with a clear error.
- `urls` newline-separated input → returns array of trimmed, non-empty lines.
- `urls-file` containing JSON array → returns the array.
- `urls-file` containing newline text → returns the array.
- Lines starting with `/` get prefixed by `serve-url`; absolute `http(s)://` lines pass through untouched.
- Both `urls` and `urls-file` set → throws (mutually exclusive).

If you keep all logic inline in YAML (acceptable for v1), document in the PR description why no helper was extracted and rely on the integration tests above.

**Regression check (mandatory):**

3. Push a commit on the draft PR that intentionally breaks accessibility (e.g. remove the `aria-label` from a button on `/login`). Confirm the `mode: block` workflow-dispatch run goes red with `button-name` in the failing audits, and the comment surfaces it.

## Inputs from other workstreams

- `createBaseConfig` (A) — not imported here; consumer config imports it.
- `build-comment.cjs` (D) — invoked in step 12. Contract: reads `./.lighthouseci/manifest.json` + `lhr-*.json`, reads env `LHCI_MODE` and `LHCI_ARTIFACT_URL`, prints Markdown to stdout, exits 0. If D isn't merged yet, guard step 12 with `continue-on-error: true` so B's PR can land first.

## Out of scope

- Landscape UI's caller workflow (Workstream C).
- The body of `build-comment.cjs` (Workstream D).
- Authenticated routes via MSW (v1.1).
- Self-hosted runner tuning — consumer can pass `runs-on` if `ubuntu-latest` doesn't fit.

## Done when

- Reusable workflow has no stub markers left.
- Step graph runs green on a draft PR in `canonical/landscape-ui` (calling itself).
- A second, throwaway repo can `uses:` this workflow with only `urls` + `wcag-level` and get a green run end-to-end including artifact + sticky comment.
- A `patch` changeset describes the change.
