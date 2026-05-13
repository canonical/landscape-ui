---
"landscape-ui": patch
---

Add accessibility-testing foundation: pin `@lhci/cli`, `@axe-core/playwright`, `vitest-axe`, and `eslint-plugin-jsx-a11y`, scaffold the `.github/lighthouse/` config tree, the `e2e/features/a11y/` and `src/tests/a11y/` directories, the `lighthouse-a11y.{reusable,}.yml` workflow stubs, and the `docs/testing/a11y.md` skeleton. Wires `jsx-a11y` into the ESLint flat config with rules off so Workstream A can enable them without merge conflict. No behavior change yet — downstream workstreams (Lighthouse shared config, reusable workflow, feedback layer, Playwright+axe layer) land on top of this foundation.
