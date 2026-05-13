// Stub — filled by Workstream A (lighthouse-a11y/specs/01-shared-config.md).
//
// Will export `createBaseConfig({ wcagLevel, minScore, urls, numberOfRuns?, settingsOverrides? })`
// returning a Lighthouse CI config object (ci.collect / ci.assert / ci.upload).
//
// The signature is the locked Foundation contract — downstream consumers
// (lighthouserc.cjs, the reusable workflow) are wired against it.

function createBaseConfig(_options) {
  throw new Error(
    "createBaseConfig is a foundation stub. " +
      "Workstream A must implement it. See lighthouse-a11y/specs/01-shared-config.md.",
  );
}

module.exports = { createBaseConfig };
