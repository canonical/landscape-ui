#!/usr/bin/env node
// Stub — filled by Workstream C (lighthouse-a11y/specs/04-feedback-layer.md).
//
// Will read `./.lighthouseci/manifest.json` and per-URL `lhr-*.json`, then
// print a Markdown sticky PR comment to stdout. Reads env `LHCI_MODE` and
// `LHCI_ARTIFACT_URL`. Never fails — on missing manifest, prints a warning
// Markdown block and exits 0.

process.stdout.write(
  "### 🔦 Lighthouse a11y — Foundation stub\n\n" +
    "`build-comment.cjs` has not been implemented yet. " +
    "See lighthouse-a11y/specs/04-feedback-layer.md (Workstream C).\n",
);
process.exit(0);
