---
name: code-review
description: Review guidance for pull requests in the landscape-ui repository. Apply when reviewing any PR in canonical/landscape-ui.
---

# Code review: landscape-ui

Architectural and CI rules already live in `.github/copilot-instructions.md`; read it first and don't re-flag what it already covers (import aliases, forms, styling, lint/prettier/tsc). Also skip the changeset check — CI's Validate workflow blocks any PR missing a `.changeset/*.md` file (an empty one satisfies it), so it's mechanically gated like lint. This skill covers what isn't caught automatically.

## What to check

- **Error handling.** Async handlers (`onSubmit`, mutation callbacks) must route failures through `useDebug()`. Flag any `catch` that doesn't call `debug(error)` or that only does a raw `console.error`.
- **API hooks.** New endpoints belong in a feature's `api/` folder as a typed React Query hook that unwraps the raw response (e.g. `{ items, count, isLoading }`), not inline `axios`/`fetch` in components.
- **Root path drift.** `VITE_ROOT_PATH` is `/portal/` in production builds and `/` in dev/E2E. Flag hardcoded paths that assume one over the other instead of using the env/config value.
- **CI workflow edits.** `.github/workflows/` changes are high-risk: don't unpin the SHA-pinned actions in `integration-tests.yml`, don't add build/publish steps to `changeset-version.yml` (main never ships), and don't touch branch selection or the `should_build` guard in `release-and-build.yml`.
- **Vitest globals.** `globals: true` is set in `vitest.config.ts`; `describe`/`it`/`expect`/`vi` etc. are ambient. 

## How to review

- Treat `.github/copilot-instructions.md` as the authoritative, CI-matched contract; where other comments or docs disagree with it, trust that file and flag the stale text.
- Reserve comments for correctness, security, and the invariants above — ESLint/Prettier/Stylelint/tsc already gate style and types, so don't duplicate them.
