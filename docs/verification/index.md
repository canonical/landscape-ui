# Verification

This document defines the repository verification loop. A task is not complete when code compiles. It is complete when the relevant loop has been closed.

## Default Development Mode

Prefer test-driven development when the change affects behavior and the area has a practical test seam.

Default loop:

1. Define the expected behavior.
2. Add or update the smallest relevant automated test so it fails for the right reason.
3. Implement the change.
4. Re-run the relevant checks.
5. For UI changes, inspect the behavior in a browser-oriented workflow as well.
6. Repeat until the change is correct, or stop and surface the blocker if local verification is not possible.

Skipping the failing-test step is acceptable only when:

- the change is purely documentation
- the change is mechanical with no behavior impact
- the area has no practical automated test seam yet
- the existing test setup cannot express the behavior without disproportionate scaffolding

When the failing-test step is skipped, document why in the work summary.

## Required Checks

For most application changes, verify the smallest applicable set from:

- `pnpm run lint`
- `pnpm prettier --check` for changed Markdown or formatted assets
- targeted Vitest and React Testing Library coverage for unit or component behavior
- targeted Playwright coverage for end-to-end behavior

Run broader checks when the change is cross-cutting or when targeted verification is not sufficient.

Coverage guidance for this repo lives in [../testing/coverage.md](../testing/coverage.md).

## Browser And UI Verification

When a change affects layout, styling, navigation, or interactive behavior:

- inspect the affected screen in a browser-oriented workflow
- exercise the changed interaction path, not just the happy-path test assertion
- compare the result against the intent of the task, not only against absence of errors

For UI-facing changes, also verify:

- the affected view renders correctly
- the interaction flow works in the browser
- the result looks acceptable, not only technically functional
- responsive or state variants are checked when the change could affect them

If verification fails, continue iterating rather than stopping at the first partial fix.

## Blockers And Escalation

If the loop cannot be fully closed, report the exact reason. Typical examples:

- required environment or credentials are unavailable
- the feature needs a product decision before visual acceptance can be judged
- the current test seam is missing and cannot be added safely within the change
- the failure reproduces, but the root cause is outside the requested scope

Do not claim completion when an important check was not run. State what was verified, what was not, and why.
