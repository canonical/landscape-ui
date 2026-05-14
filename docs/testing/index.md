# Testing

This directory defines the repository testing contract. The goal is to choose the right automated test layer and prove behavior with the narrowest useful test.

## Start Here

Use the narrowest test that proves the requirement.

Read next based on the task:

- [unit.md](unit.md): unit and component tests with Vitest and React Testing Library
- [e2e.md](e2e.md): end-to-end tests with Playwright
- [coverage.md](coverage.md): how to reason about coverage in this repository

## Test Layers

This repository uses two primary automated test layers:

- unit and component tests with Vitest and React Testing Library
- end-to-end tests with Playwright

Choose the smallest layer that can prove the behavior confidently.
