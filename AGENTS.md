# AGENTS.md

This file is the agent-facing entrypoint for repository knowledge. It is not the source of truth.

Start here, then follow the smallest relevant link:

- Project overview and local setup: [README.md](README.md)
- Knowledge base index: [docs/index.md](docs/index.md)
- Architecture and codebase map: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- API conventions and data-access patterns: [docs/API.md](docs/API.md)
- Frontend conventions and constraints: [docs/FRONTEND.md](docs/FRONTEND.md)
- Testing workflow: [docs/testing/index.md](docs/testing/index.md)
- Verification workflow: [docs/verification/index.md](docs/verification/index.md)
- Security policy: [SECURITY.md](SECURITY.md)
- Release process and versioning: [RELEASES.md](RELEASES.md)
- Contribution basics: [CONTRIBUTING.md](CONTRIBUTING.md)

## Project Purpose

`landscape-ui` is the modern React and TypeScript web interface for Canonical Landscape. Its purpose is to replace the legacy UI, migrating Landscape workflows into the new dashboard until the classic interface can be removed. The codebase is organized around dashboard domains such as instances, repositories, profiles, settings, authentication, and account management.

## Progressive Disclosure

- Do not treat this file as the system of record.
- Prefer the smallest relevant document for the task.
- Use code as the final arbiter when docs and implementation differ.
- Start with [docs/index.md](docs/index.md) if you are not sure which doc applies.

## Where To Look

- For current system structure, read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
- For fetch, query, mutation, and endpoint conventions, read [docs/API.md](docs/API.md).
- For frontend implementation and placement conventions, read [docs/FRONTEND.md](docs/FRONTEND.md).
- For automated test strategy, read [docs/testing/index.md](docs/testing/index.md).
- For completion criteria and closed-loop validation, read [docs/verification/index.md](docs/verification/index.md).

## Source-of-Truth Rule

The knowledge base lives under `docs/` plus established root documents such as `README.md`, `SECURITY.md`, and `RELEASES.md`. Keep `AGENTS.md` short and stable; add detail to the relevant source document instead of expanding this file into a manual.

## Common Commands

Package manager is `pnpm`. Do not use `npm` or `yarn`.

```
pnpm dev                        # start the Vite dev server
pnpm vitest                     # run unit and component tests (Vitest)
pnpm vitest MyComponent         # run tests matching a name pattern
pnpm vitest --reporter=verbose  # run with detailed per-test output
pnpm coverage                   # run Vitest with coverage report
pnpm run lint                   # run ESLint with auto-fix
pnpm build                      # production build (lint + tsc + vite build)
pnpm test                       # run Playwright E2E tests (not unit tests)
pnpm test:saas                  # run only SaaS-tagged E2E tests
pnpm test:self-hosted           # run only self-hosted-tagged E2E tests
pnpm changeset                  # create a changeset for changelog (required before merge)
```

Note: `pnpm test` runs Playwright, not Vitest. Use `pnpm vitest` for unit and component test work.

## Environment Setup

Copy `.env.local.example` to `.env.local` and fill in values for your local Landscape instance. Required variables include `VITE_API_URL`, `VITE_API_URL_OLD`, and `VITE_ROOT_PATH`. Set `VITE_MSW_ENABLED=true` to use Mock Service Worker for offline development. See `.env.local.example` for the full list.

Node.js ≥24 is required (`engines` in `package.json`).

## Agent Failure Protocol

**Stop and ask the user instead of retrying** when:

- A file write (overwrite, truncation, replacement) appears to succeed (exit 0) but the file content does not change on re-read. This indicates VS Code workspace locking or a tool limitation — retrying the same approach will not help.
- Two different tool strategies for the same operation both fail to produce the expected result.
- A `replace_string_in_file` cannot find a unique anchor because the target content is duplicated or spans more than ~30 lines.

In these cases: describe the exact manual action needed (file path, line numbers, what to delete/change) and wait for the user to confirm it is done before continuing.
