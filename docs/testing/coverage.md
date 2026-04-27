# Coverage

This document tells agents how to reason about automated test coverage in this repository.

Coverage is a quality signal, not the goal by itself. High percentages are not useful if they come from weak assertions, trivial code paths, or tests that do not protect important behavior.

## How Agents Should Use This Document

Use this document for coverage policy, expectations, and interpretation.

Use [`vitest.config.ts`](../../vitest.config.ts) as the source of truth for the live coverage configuration.

If this document and the config ever differ:

- trust the config for mechanics
- trust this document for intent and review expectations
- update the document if the policy changed, not only the tooling

## What Coverage Is For

In this repo, coverage should help answer questions like:

- did we exercise the important behavior we changed
- do the tests cover the main success, failure, and edge paths
- are we relying on untested branches in logic-heavy code
- are we adding tests that protect regressions, not just inflate a number

Coverage should support review and verification, not replace them.

## Current Coverage Setup

Coverage is currently produced by Vitest, not by Playwright.

The repo already defines:

- `pnpm coverage` -> `vitest run --coverage`
- global thresholds: `80` for statements, lines, and functions, and `70` for branches

Additional provider, reporter, output, include, and exclude details are configured in [`vitest.config.ts`](../../vitest.config.ts). Agents should inspect the config directly when they need those exact mechanics.

## Scope Of Coverage Numbers

Coverage reporting is focused on application code under `src`, not the whole repository.

It excludes low-signal paths such as:

- tests themselves
- config files
- `types`
- barrel `index.ts` files
- declaration files
- other support-only files defined in the Vitest coverage config

That means the reported coverage numbers are primarily about application code exercised through the Vitest suite.

## Coverage Is Cross-Cutting

Coverage is not only a unit-testing concern and not only an E2E concern.

Use the test layer that best proves the behavior:

- unit/component tests should usually provide the measurable code coverage
- E2E tests should prove critical flows and integrated behavior

Do not force behavior into Playwright just to “count” it, and do not write shallow unit tests only to raise percentages.

## How To Interpret Coverage

Line coverage can show whether code ran.

Branch coverage is often more useful for logic-heavy code because it shows whether conditionals and alternate paths were exercised.

Function coverage can help reveal whether important entrypoints were never called.

Practical guidance:

- for simple presentational code, line coverage may be enough
- for logic-heavy helpers, hooks, guards, parsing, filtering, and state transitions, branch coverage matters more
- for bug fixes, make sure the exact failing path is covered, not only the surrounding file

## What Good Coverage Looks Like

Good coverage in this repo usually means:

- the changed behavior is covered by a meaningful assertion
- success and failure paths are both exercised when they matter
- important conditions or feature-flag paths are covered
- tests are written at the narrowest useful layer
- coverage increases because protection increased, not because low-value code was touched

Bad coverage usually looks like:

- rendering a component without asserting the important behavior
- touching code through setup without proving the contract
- adding broad happy-path tests while leaving the bug path uncovered
- chasing percentages without improving regression protection

## Thresholds

This repository currently enforces the following global Vitest coverage thresholds:

- statements: `80%`
- lines: `80%`
- functions: `80%`
- branches: `70%`

These are baseline repository thresholds, not a substitute for judgment.

## How To Use The Thresholds

Treat the enforced thresholds as the floor, not the target.

Expected practice:

- add coverage where behavior changed
- improve branch coverage when logic becomes more complex
- avoid lowering meaningful coverage in the area you touched without a clear reason
- do not stop at the threshold if important behavior is still unprotected

## Higher Expectations For Critical Logic

Some frontend code deserves stricter scrutiny than the global baseline, even if that stricter level is not yet encoded in the config.

Examples:

- hooks with branching behavior
- guards and redirect logic
- auth and permission flows
- parsing, filtering, or transformation helpers
- feature-flagged behavior
- complex state or query orchestration

For those areas, reviewers should expect stronger coverage, especially for branches and error paths.

Practical target:

- `90%+` lines, statements, and functions
- `80-90%` branches

This is currently a review standard, not an enforced global threshold.

## Relationship To Verification

Coverage is part of the overall confidence picture, but it does not prove a task is done on its own.

Use coverage together with:

- targeted unit/component tests
- targeted E2E coverage where appropriate
- manual or browser-based verification for UI changes
- linting and other repo-level checks

For completion criteria, see [../verification/index.md](../verification/index.md).
