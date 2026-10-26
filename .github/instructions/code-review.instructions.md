---
applyTo: "**"
excludeAgent: "cloud-agent"
---

# Code review rules: landscape-ui

Architectural and CI rules already live in `AGENTS.md` and `docs/` (see `docs/FRONTEND.md`, `docs/API.md`, `docs/ci-workflows.md`); don't re-flag what they already cover (import aliases, forms, styling, lint/prettier/tsc). Also skip the changeset check — CI's Validate workflow blocks any PR missing a `.changeset/*.md` file (an empty one satisfies it), so it's mechanically gated like lint. These rules cover what isn't caught automatically.

## What to check

- **Error handling.** Async handlers (`onSubmit`, mutation callbacks) must route failures through `useDebug()`. Flag any `catch` that doesn't call `debug(error)` or that only does a raw `console.error`.
- **API hooks.** New endpoints belong in a feature's `api/` folder as a typed React Query hook that unwraps the raw response (e.g. `{ items, count, isLoading }`), not inline `axios`/`fetch` in components.
- **Root path drift.** `VITE_ROOT_PATH` is `/portal/` in production builds and `/` in dev/E2E. Flag hardcoded paths that assume one over the other instead of using the env/config value.
- **CI workflow edits.** `.github/workflows/` changes are high-risk: don't unpin the SHA-pinned actions in `integration-tests.yml`, don't add build/publish steps to `changeset-version.yml` (main never ships), and don't touch branch selection or the `should_build` guard in `release-and-build.yml`.
- **Vitest globals.** `globals: true` is set in `vitest.config.ts`; `describe`/`it`/`expect`/`vi` etc. are ambient.
