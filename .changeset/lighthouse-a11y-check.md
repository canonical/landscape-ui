---
"landscape-ui": patch
---

Wire up `@lhci/cli` to enforce a Lighthouse accessibility floor: the new `pnpm a11y:ci` command runs Lighthouse against the public routes (`/login`, `/create-account`, `/no-access`) and fails when any score drops below the configured threshold (1.0 by default, override with `LIGHTHOUSE_MIN_SCORE`). A GitHub Actions workflow runs the same check on every pull request.
