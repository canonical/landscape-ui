---
"landscape-ui": patch
---

Land the Lighthouse a11y feedback layer plus component-level a11y coverage. `.github/lighthouse/build-comment.cjs` is now a zero-dependency Node CLI that converts an LHCI `manifest.json` + `lhr-*.json` set into a sticky-PR Markdown table (score emoji, top failing audits with WCAG mapping, optional artifact link); colocated fixtures and tests cover happy paths, banner modes, the artifact-link toggle, missing-manifest safety, and the all-green/many-failing branches. `vitest-axe` is wired into `src/tests/setup.ts` and three new component a11y tests (`Modal`, `SidePanel`, `Sidebar`) assert `toHaveNoViolations` against their rendered DOM. `docs/testing/a11y.md` Lighthouse and Component-level sections are filled in; `.github/lighthouse/README.md` is rewritten as the external-adopter guide.
