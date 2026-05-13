# AGENTS.md

Project-level guidance for agents working on the Lighthouse a11y CI initiative.

## Mission

Add a reusable Lighthouse accessibility check to `canonical/landscape-ui` that other Canonical projects can consume via `workflow_call`. See `README.md` for the why.

## Working agreements

1. **Read your spec before coding.** `specs/00-foundation.md` is mandatory reading regardless of which workstream you pick up — it defines the contracts you'll integrate against.
2. **One workstream per PR.** Specs are scoped so 4 agents can work in parallel after foundation lands. Don't sprawl across workstreams in a single PR.
3. **All code changes live in `../ui/`.** This folder is for coordination; product code does not live here.
4. **Match existing conventions.** `../ui/AGENTS.md` is the canonical contributor guide for the UI repo. Follow its lint, test, and commit rules.
5. **Test what you change** — see the testing standard below.

## Testing standard

Every workstream ships tests. Non-negotiable.

- **Pure JS modules** (factory functions, config builders, the PR-comment script, the consumer config) get colocated Vitest unit tests. Aim for 100% branch coverage of the public surface; the repo's existing thresholds in `../ui/vitest.config.ts` (80% statements/lines/functions, 70% branches) are the floor and apply to the new code too.
- **Cover error paths**, not just happy paths. Bad inputs, missing files, unknown WCAG levels, missing env vars — every `throw` and every conditional branch needs a case.
- **No mocking what you don't own.** Test the factory by calling it with real inputs and asserting on the returned config shape. Test the comment builder against committed fixture manifests, not `fs` mocks.
- **Co-locate tests with source**: `audit-sets.test.ts` next to `audit-sets.cjs`. Foundation (`specs/00-foundation.md` §7) configures Vitest to discover tests under `ui/.github/lighthouse/`; do not move that discovery elsewhere.
- **Workflow YAML can't be unit-tested.** Exercise it on a draft PR against `canonical/landscape-ui:main` — that's your integration test. Trigger `workflow_dispatch` to cover both `mode=block` and `mode=annotate`. Don't merge until you see the workflow run green.
- **Run `pnpm coverage` locally** before opening a PR. If your workstream's new code drops coverage, add tests until thresholds pass.
- **See your spec's "Tests" section** for the exact cases your workstream owes.

## Interfaces between workstreams

The foundation spec locks these contracts. If one needs to change, update foundation first and notify the other workstreams.

- `createBaseConfig({ wcagLevel, minScore, urls, numberOfRuns?, settingsOverrides? })` — Workstream A's factory function. Returns the LHCI config object. Workstream C imports it.
- Reusable workflow input surface — full list in `specs/02-reusable-workflow.md`. Workstream B implements; Workstream C calls.
- `.lighthouseci/manifest.json` + `lhr-*.json` shape (LHCI 0.14) — Workstream B's workflow emits these; Workstream D's `build-comment.cjs` parses them.

## Definition of done (per workstream)

- All deliverables listed in your spec exist on the branch.
- Lint, type-check, and unit tests are green in `../ui/`.
- A `patch` changeset is added.
- A draft PR is open against `canonical/landscape-ui:main` referencing your spec.
- The spec's "Done when" section's criteria are satisfied.

## Escalation

If you discover that a spec is wrong or under-specified, stop, write up what you found, and open a discussion before coding around it. The plan at `~/.claude/plans/could-you-take-a-logical-rabin.md` has the longer rationale and may resolve the ambiguity.
