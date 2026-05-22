# Backend Test Context for UI Developers

To avoid duplicating test coverage in the UI's Playwright integration tests, please refer to this summary of existing backend tests.

## landscape-go (debarchive & api)
- **Framework:** Standard Go `testing` package, `go-cmp`.
- **Strategy:** Heavy use of real PostgreSQL databases via `testcontainers`. Each test runs in an isolated transaction (`setupTx`).
- **Coverage:** HTTP handlers, data access layers, and core repository logic are fully tested against the database. An extensive `e2e` suite runs against a Docker stack.

## landscape-server (Python backend)
- **Framework:** Twisted Trial, `testtools`, `testresources`.
- **Strategy:** Real PostgreSQL databases via Storm ORM (`ZStormResourceManager`). Each test class receives a freshly provisioned database instance.
- **Coverage:** Full coverage of HTTP handlers (`APIHandlerTest`), REST methods (`APITest`), and database models (`ModelTest`).

## UI Integration Test Strategy (Playwright API)
Given the comprehensive backend coverage, the UI's Playwright API tests in this directory should **only** verify the JSON shape contract. Do not write tests for deep database constraints, locking scenarios, or backend business logic. Focus purely on whether the UI's TypeScript interfaces (`CreateLocalRequest`, `Local`, etc.) match the API payloads and responses.