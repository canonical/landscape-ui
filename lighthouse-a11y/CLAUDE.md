# CLAUDE.md

Guidance for Claude Code working inside this project folder.

## What this project is

A coordination workspace for adding a reusable Lighthouse accessibility check to `canonical/landscape-ui`'s GitHub Actions pipeline. The check must:

1. Run on PR (and on demand / nightly) with WCAG level, per-audit, URL, and block-or-annotate knobs all caller-controlled.
2. Be packaged as a `workflow_call` reusable workflow so other Canonical projects can adopt it with one `uses:` line.

This folder is **planning + specs only**. It contains no executable code. All real changes land in the `ui/` submodule.

## Where to work

- Read `specs/00-foundation.md` first — it sets up the directory layout and the interface contracts the other four streams depend on.
- After foundation is merged, implement one of `specs/01-*` through `specs/04-*`. Each is independent.
- All edits land under `../ui/` (= `canonical/landscape-ui` on GitHub). Push from inside that submodule; the outer meta-repo isn't touched.

## Conventions to respect (in the `ui/` submodule)

- pnpm 10, Node 24, Vite, conventional commits, Changesets.
- Match the existing workflow style in `../ui/.github/workflows/`: `actions/checkout@v5`, `pnpm/action-setup@v4`, `actions/setup-node@v4` with `cache: "pnpm"`.
- Before any PR: `pnpm run lint`, `pnpm coverage`, and the relevant Playwright suites.
- A changeset entry is mandatory — `changeset-check.yml` enforces it.
- Read `../ui/AGENTS.md` for the full UI-repo contributor guide.

## Testing standard (non-negotiable)

Every workstream ships tests. Specifically:

- Every pure-JS module created or edited under `../ui/.github/lighthouse/` and `../ui/lighthouserc.cjs` gets a colocated Vitest test file.
- The repo's existing coverage thresholds (80% statements/lines/functions, 70% branches; see `../ui/vitest.config.ts`) are the floor. Don't lower them.
- Cover error paths, not just happy paths — every `throw` and every conditional branch deserves a case.
- Workflow YAML can't be unit-tested; exercise it on a draft PR. That's the integration test.
- See your spec's "Tests" section for the exact cases your workstream owes.

## Out of scope

- Anything outside `../ui/`. The other submodules (`server/`, `client/`, `go/`, `documentation/`) are untouched.
- `eslint-plugin-jsx-a11y` adoption — adjacent improvement, separate PR. Mentioned in the plan, not in any spec.
- The MSW-authenticated-routes path. v1 scans public/auth-page URLs only. The v1.1 follow-up that enables authenticated scanning needs source edits to `vite.config.ts` and `src/main.tsx` and is explicitly deferred. See the plan for the path.

## When you finish a workstream

Land a single PR in `canonical/landscape-ui:main`. Title prefix: `ci:` or `feat(ci):` (conventional commits). Include a `patch` changeset. Reference the spec you implemented in the PR description.

## Reference

- Full implementation plan: `~/.claude/plans/could-you-take-a-logical-rabin.md`
- Meta-repo guide: `../CLAUDE.md`
- UI contributor guide: `../ui/AGENTS.md`
