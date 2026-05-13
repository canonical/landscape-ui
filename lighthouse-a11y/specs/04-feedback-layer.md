# 04 — Workstream D: feedback layer — PR comment + docs

**Owner:** one engineer. Single PR.
**Depends on:** `00-foundation.md` merged.
**Parallel with:** A, B, C.
**Cooperates with:** B — B's workflow invokes `build-comment.cjs`.

## Goal

Make the Lighthouse results legible — to PR reviewers via a sticky comment, to engineers tuning the checks via docs, and to external Canonical adopters via a top-level README.

## Deliverables

### `ui/.github/lighthouse/build-comment.cjs`

Replace the foundation stub. Node CLI, zero dependencies (or `fs`/`path` only — must run without `npm install`).

Behaviour:
- Reads `./.lighthouseci/manifest.json` (LHCI 0.14 shape — array of run records).
- For each entry, reads the matching `lhr-*.json` for per-audit detail.
- Reads env `LHCI_MODE` (`block` | `annotate`) to pick the banner.
- Reads env `LHCI_ARTIFACT_URL` to embed an artifact link.
- Prints Markdown to stdout. Exits 0 on success.
- If `manifest.json` is missing, prints a short warning Markdown ("Lighthouse did not produce a manifest; see job logs") and exits 0 — never fails the parent step.

Output shape (example):

```markdown
### 🔦 Lighthouse a11y — Annotate-only (not blocking)

| URL | Score | Top failing audits |
| --- | :---: | --- |
| `/login` | 🟢 0.97 | — |
| `/create-account` | 🟡 0.88 | `color-contrast` (WCAG 1.4.3), `button-name` (WCAG 4.1.2) |
| `/no-access` | 🔴 0.74 | `aria-required-attr`, `label`, `link-name` (+3 more) |

[Full report artifact](https://github.com/.../artifacts/12345)
```

Scoring colour: `🟢` ≥ 0.95, `🟡` ≥ 0.85, `🔴` < 0.85.

WCAG mapping comes from a small lookup table inside the script — populate it from `ui/.github/lighthouse/audit-sets.cjs` comments so it stays in sync (or duplicate the mapping; it's short).

### `ui/.github/lighthouse/README.md`

Replace the foundation skeleton. Audience: external Canonical engineers evaluating whether to adopt this workflow in their repo.

Sections:
1. **What this is** — one paragraph: reusable Lighthouse a11y workflow, shared base config, where it lives in `canonical/landscape-ui`.
2. **Quick start** — copy-pasteable `uses:` snippet that runs against an arbitrary URL list with WCAG AA defaults.
3. **Full input reference** — copy the table from `specs/02-reusable-workflow.md`.
4. **Extending the base config** — short example showing how to `require()` the base and override an audit.
5. **WCAG levels** — what the `a` / `aa` / `aaa` presets contain. Mirror `audit-sets.cjs`.
6. **Links** — Lighthouse CI docs, Lighthouse a11y audit reference.

### `ui/docs/testing/a11y.md`

New file. Audience: Landscape UI engineers.

Sections:
1. **What we check** — Lighthouse accessibility category, link to WCAG mapping in this folder.
2. **How CI invokes it** — explain PR (annotate, public URLs), `workflow_dispatch` (configurable), nightly schedule. Link to `ui/.github/workflows/lighthouse-a11y.yml`.
3. **How to run locally**:
   ```bash
   cd ui
   pnpm install
   pnpm build
   pnpm a11y:preview            # terminal A — keeps running
   LHCI_AUTH_MODE=public pnpm a11y:ci   # terminal B
   ```
4. **Interpreting a failure** — read the PR comment, download the `lighthouse-report-pr` artifact, open the HTML report.
5. **Tuning** — edit `ui/lighthouserc.cjs` to override an audit, change the floor, or add a URL. Reference the override line we already ship for `heading-order`.

### `ui/docs/testing/index.md`

Replace the foundation placeholder line. Final:

```markdown
- [a11y.md](a11y.md): Lighthouse accessibility checks (CI + local).
```

Slot it after the `coverage.md` bullet.

## Tests

**Unit — `ui/.github/lighthouse/build-comment.test.ts`.** Commit synthetic fixtures under `ui/.github/lighthouse/__fixtures__/` so tests don't need a live LHCI run.

Fixtures to create (small JSON files, hand-built — based on real LHCI 0.14 shape):

- `manifest-mixed.json` — three URLs scoring 0.97, 0.88, 0.74 (one green, one amber, one red).
- `manifest-all-green.json` — three URLs all ≥ 0.95.
- `lhr-login.json`, `lhr-create-account.json`, `lhr-no-access.json` — matching per-URL reports with realistic `audits` blocks (use `color-contrast`, `button-name`, `aria-required-attr`, etc.).

Required test cases:

- `manifest-mixed` produces a Markdown table with `🟢`, `🟡`, `🔴` (in that order) and the URL paths in the first column.
- For an amber URL with 2 failing audits, the row lists both audit IDs with their WCAG mapping (e.g. `color-contrast` → `1.4.3`).
- For a red URL with > 3 failing audits, the row lists the top 3 plus `(+N more)`.
- `LHCI_MODE=block` → banner contains "Blocking".
- `LHCI_MODE=annotate` → banner contains "Annotate-only".
- `LHCI_MODE` unset → banner has a safe default (pick one: "Blocking" or "Annotate-only" — document the choice).
- `LHCI_ARTIFACT_URL=https://example` → output contains a `[Full report artifact](https://example)` line.
- `LHCI_ARTIFACT_URL` unset → no broken-link line, no empty link.
- Missing `manifest.json` → process exits 0 (use `vi.spyOn(process, "exit")` to assert), output is a short warning Markdown explaining the absence.
- All-green fixture → table has no `—` placeholders missing, no "failing audits" content per row.
- WCAG mapping is consistent with `audit-sets.cjs` comments: assert `color-contrast` maps to `1.4.3`, `button-name` maps to `4.1.2`, `image-alt` maps to `1.1.1` (lock these three to catch drift).

Aim for ≥ 95% coverage of `build-comment.cjs`. Foundation §8's coverage-include adjustment (if any) is removed by this PR.

**Integration:** verified indirectly by spec 02's draft-PR check — the sticky comment must appear and render correctly. Confirm in your PR description that you ran the workflow on a draft PR and saw the comment populate with real data.

**Docs:** no automated test, but ask one Landscape UI engineer to read `ui/docs/testing/a11y.md` and confirm they can run the check locally from those instructions alone. Record their name in the PR description.

## Inputs from other workstreams

- `.lighthouseci/manifest.json` + `lhr-*.json` (B emits these via `lhci upload --target=filesystem`).
- Env vars `LHCI_MODE` and `LHCI_ARTIFACT_URL` (B sets these for the comment-build step). Names are locked in `specs/00-foundation.md` §3.
- `ui/.github/lighthouse/audit-sets.cjs` WCAG comments (A) — read these to keep the comment's WCAG mapping in sync.

## Out of scope

- Authoring the workflow (B) or consumer config (C).
- Hosting HTML reports on GitHub Pages — plan open question, not v1.
- Mobile preset — plan open question, not v1.

## Done when

- `build-comment.cjs` produces valid Markdown from a real `lhci collect` run on Landscape UI.
- Running `node ui/.github/lighthouse/build-comment.cjs` with `LHCI_MODE` and `LHCI_ARTIFACT_URL` set, against a synthetic manifest, prints the expected table.
- `ui/docs/testing/a11y.md` is approved by one Landscape UI engineer for clarity.
- `ui/.github/lighthouse/README.md` is sufficient that a fresh adopter can wire up the workflow without asking questions.
- Draft PR shows the sticky comment with score table and artifact link.
- A `patch` changeset describes the change.
