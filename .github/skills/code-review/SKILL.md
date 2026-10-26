---
name: code-review
description: Review guidance for pull requests in the landscape-ui repository. Apply when reviewing any PR in canonical/landscape-ui.
---

# Code review: landscape-ui

The review rules (what to check and what to skip) live in `.github/instructions/code-review.instructions.md`, which Copilot code review loads on every PR. Read it first; don't restate the rules here.

## How to review

- Treat `AGENTS.md` and `docs/` as the authoritative, CI-matched contract; where other comments or docs disagree with them, trust the docs and flag the stale text.
- Reserve comments for correctness, security, and the invariants in the rules file — ESLint/Prettier/Stylelint/tsc already gate style and types, so don't duplicate them.

## Review depth

- For UI changes with a small blast radius: focus on checking existing patterns and behavior changes
- Changes to business logic or shared components (eg login flow): require an audit of all related features
- New pattern, not yet referenced in docs: confirm intent, ask for docs update as part of PR (or in a linked PR)
