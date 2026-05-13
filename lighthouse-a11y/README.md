# Landscape UI — Lighthouse Accessibility CI

A reusable Lighthouse accessibility check for `canonical/landscape-ui`'s GitHub Actions pipeline, designed so other Canonical projects can adopt it with a single `uses:` line.

## Why

Landscape UI has zero automated a11y coverage today: no `axe-core`, no `eslint-plugin-jsx-a11y`, no Lighthouse, no `pa11y`. Lint, Vitest, Playwright, and TICS run on PR, but a button missing an accessible name or a contrast regression ships unchecked. This initiative closes that gap with a Lighthouse CI job and packages it for reuse.

## What ships

1. A `workflow_call` reusable workflow at `ui/.github/workflows/lighthouse-a11y.reusable.yml` — consumed by other Canonical repos via `uses: canonical/landscape-ui/.github/workflows/lighthouse-a11y.reusable.yml@<ref>`.
2. A shared base LHCI config + WCAG audit matrix at `ui/.github/lighthouse/`.
3. Landscape UI's own caller workflow + consumer config — proves the reusable workflow and is the canonical example to copy.

Every policy knob is caller-controlled: WCAG level (A/AA/AAA), per-audit overrides, URL list/file, block-vs-annotate mode, build & serve commands, runner.

## Where the code lands

All real changes land inside the `ui/` submodule (= `canonical/landscape-ui` on GitHub). The outer meta-repo is not touched. See `../CLAUDE.md` for the meta-repo's submodule semantics.

## Project layout

```
lighthouse-a11y/
├── CLAUDE.md     Project-level instructions for Claude Code
├── AGENTS.md     Same, for non-Claude agents
├── README.md     You are here
└── specs/
    ├── 00-foundation.md           Foundation — do this first, unblocks everyone else
    ├── 01-shared-config.md        Workstream A — shared LHCI base config + WCAG audit matrix
    ├── 02-reusable-workflow.md    Workstream B — the workflow_call workflow
    ├── 03-landscape-ui-caller.md  Workstream C — Landscape UI caller + consumer config
    └── 04-feedback-layer.md       Workstream D — PR comments, docs, external README
```

## How to use this folder

- **Coordinator**: assign owners to workstreams A–D. Have one engineer do `00-foundation.md` first; merge it; then A–D proceed in parallel.
- **Implementer**: read `CLAUDE.md` and `AGENTS.md`, then read your spec end-to-end before touching code. Each spec lists the contract it depends on from foundation.
- **Reviewer**: each workstream's "Done when" section is the acceptance checklist.

## Status

Planning complete. Implementation has not started. The full plan (rationale, alternatives considered, verification steps) lives at `~/.claude/plans/could-you-take-a-logical-rabin.md` — the specs in this folder are the executable distillation.
