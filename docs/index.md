# Docs Index

This directory is the repository knowledge base and the system of record for internal project documentation. `AGENTS.md` is only the entry map.

## Core Docs

- [ARCHITECTURE.md](ARCHITECTURE.md): current system structure, boot flow, provider composition, routing, and codebase layering
- [API.md](API.md): fetch, query, mutation, endpoint, and old/new API conventions
- [FRONTEND.md](FRONTEND.md): prescriptive frontend implementation rules for code placement, component structure, and repo conventions
- [testing/index.md](testing/index.md): automated test map covering unit/component tests, E2E tests, and coverage guidance
- [verification/index.md](verification/index.md): implementation completion rules, TDD expectations, and closed-loop validation

## Existing Root Docs

- [../README.md](../README.md): project overview, local setup, and developer entrypoint
- [../SECURITY.md](../SECURITY.md): security reporting and remediation policy
- [../RELEASES.md](../RELEASES.md): release process, versioning, and changeset workflow
- [../CONTRIBUTING.md](../CONTRIBUTING.md): contribution basics and code of conduct

## Maintenance Rules

- Keep this directory focused on source-of-truth documents, not task chatter.
- Prefer adding or updating a focused doc over expanding `AGENTS.md`.
- When documentation drifts from code, update the authoritative document to match implementation.
- Cross-link related docs instead of duplicating guidance.
