const { execSync } = require("child_process");

/**
 * Calendar-based version derivation for Landscape UI.
 *
 * Branch -> version shape:
 *   main             -> ${currentCycle}.0.${run}-beta
 *   point/YYYY-MM-DD -> ${currentCycle}.0.${run}-beta
 *   dev              -> ${currentCycle}.0.${run}-dev
 *   release/YY.MM    -> YY.MM.1.${run}            (cycle pinned by branch name)
 *
 * `currentCycle` is the upcoming Ubuntu release we are working toward:
 *   Jan-Apr  -> YY.04
 *   May-Oct  -> YY.10
 *   Nov-Dec  -> (YY+1).04
 *
 * Pinning `release/*` from the branch name (rather than from the calendar)
 * ensures point releases never drift across cycles — a fix backported to
 * release/26.04 in November 2026 still ships as 26.04.1.X, not 27.04.1.X.
 */

function getCurrentCycle(now = new Date()) {
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-12

  if (month <= 4) {
    return `${String(year).slice(-2)}.04`;
  }
  if (month <= 10) {
    return `${String(year).slice(-2)}.10`;
  }
  // November / December: the next cut is the following April.
  return `${String(year + 1).slice(-2)}.04`;
}

function getBranch() {
  // Prefer the CI-provided ref name; fall back to git for local invocation.
  if (process.env.GITHUB_REF_NAME) {
    return process.env.GITHUB_REF_NAME;
  }
  return execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
}

function getVersion() {
  const branch = getBranch();
  const buildNum = process.env.GITHUB_RUN_NUMBER || "0";

  if (branch === "main" || branch.startsWith("point/")) {
    return `${getCurrentCycle()}.0.${buildNum}-beta`;
  }
  if (branch === "dev") {
    return `${getCurrentCycle()}.0.${buildNum}-dev`;
  }
  if (branch.startsWith("release/")) {
    const cycle = branch.slice("release/".length);
    if (!/^\d{2}\.(04|10)$/.test(cycle)) {
      throw new Error(
        `Invalid release branch name: '${branch}'. Expected 'release/YY.04' or 'release/YY.10'.`,
      );
    }
    return `${cycle}.1.${buildNum}`;
  }

  return `0.0.0-draft.${buildNum}`;
}

console.log(getVersion());
