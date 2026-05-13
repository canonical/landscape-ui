// Shared Lighthouse CI base config factory.
//
// `createBaseConfig` is the locked Foundation contract (see
// lighthouse-a11y/specs/00-foundation.md §2). Other Canonical projects
// consume this module to build their own `lighthouserc.cjs` without
// re-declaring the audit matrix or LHCI runner settings.

const auditSets = require("./audit-sets.cjs");

function createBaseConfig({
  wcagLevel,
  urls,
  numberOfRuns = 1,
  settingsOverrides = {},
  minScore,
} = {}) {
  if (!Array.isArray(urls) || urls.length === 0) {
    throw new Error("createBaseConfig: urls must be a non-empty array");
  }
  const set = auditSets[wcagLevel];
  if (!set) {
    throw new Error(`createBaseConfig: unknown wcagLevel ${wcagLevel}`);
  }
  const floor = minScore ?? set.defaultMinScore;

  return {
    ci: {
      collect: {
        url: urls,
        numberOfRuns,
        settings: {
          onlyCategories: ["accessibility"],
          preset: "desktop",
          chromeFlags: "--no-sandbox --headless=new --disable-gpu",
          ...settingsOverrides,
        },
      },
      assert: {
        assertions: {
          "categories:accessibility": ["error", { minScore: floor }],
          ...set.assertions,
        },
      },
      upload: {
        target: "filesystem",
        outputDir: "./.lighthouseci",
        reportFilenamePattern:
          "%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%",
      },
    },
  };
}

module.exports = { createBaseConfig };
