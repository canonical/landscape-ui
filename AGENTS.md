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
pnpm dev          # start the Vite dev server
pnpm vitest       # run unit and component tests (Vitest)
pnpm run lint     # run ESLint with auto-fix
pnpm build        # production build (lint + tsc + vite build)
pnpm test         # run Playwright E2E tests (not unit tests)
```

Note: `pnpm test` runs Playwright, not Vitest. Use `pnpm vitest` for unit and component test work.
