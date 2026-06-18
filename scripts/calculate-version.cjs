const { execSync } = require("child_process");

/**
 * Version derivation for Landscape UI.
 *
 * Branch -> version shape:
 *   main          -> ${currentCycle}.0.${count}-beta  (PR-title label only; never shipped)
 *   release/YY.MM -> YY.MM.0.${count}                 (base of a cycle; cycle pinned by name)
 *   point/YY.MM.N -> YY.MM.N.${count}                 (Nth point release; once released)
 *                 -> YY.MM.N.${count}-rc              (candidate, until promoted)
 *
 * A point release is promoted from candidate to release by listing its branch
 * in the RELEASED_POINT_BRANCHES Actions variable (comma-separated). Until then
 * its builds carry an -rc suffix.
 *
 * `currentCycle` is the upcoming Ubuntu release we are working toward. It is now
 * only used for main's (never-shipped) version-PR label, since everything that
 * actually ships is pinned by its branch name:
 *   Jan-Apr  -> YY.04
 *   May-Oct  -> YY.10
 *   Nov-Dec  -> (YY+1).04
 *
 * `count` is derived from git, not from GITHUB_RUN_NUMBER, so each branch has
 * its own monotonic counter:
 *   main                -> total commits reachable from HEAD
 *   release/* / point/* -> commits added since the cut from main
 *                          (origin/main..HEAD) — first build = 0
 *
 * This means cutting release/26.10 produces 26.10.0.0 on the first build,
 * 26.10.0.1 after the first cherry-pick, and so on; the first point release
 * cut from main is point/26.10.1 -> 26.10.1.0, the next point/26.10.2, etc.
 * Pinning the cycle and point number from the branch name (rather than the
 * calendar) ensures a release never drifts across cycles on rebuild.
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

function gitRevCount(spec) {
  try {
    return execSync(`git rev-list --count ${spec}`, {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return null;
  }
}

function getBuildNumber(branch) {
  // Derived branches get a counter that resets at the cut: commits added on
  // the branch since it diverged from main. First build of a fresh release
  // or point branch = 0.
  if (branch.startsWith("release/") || branch.startsWith("point/")) {
    const count = gitRevCount("origin/main..HEAD") ?? gitRevCount("main..HEAD");
    if (count !== null) return count;
  }

  // Long-lived trunks (and any unknown branch) just use total commit count
  // on the current ref — monotonic and self-contained, no remote required.
  return gitRevCount("HEAD") ?? "0";
}

// A point release branch ships a clean release once it's listed in the
// RELEASED_POINT_BRANCHES Actions variable; until then it's a candidate (-rc).
function isReleasedPoint(branch) {
  return (process.env.RELEASED_POINT_BRANCHES || "")
    .split(",")
    .map((b) => b.trim())
    .filter(Boolean)
    .includes(branch);
}

function getVersion() {
  const branch = getBranch();
  const buildNum = getBuildNumber(branch);

  // main: integration trunk / CHANGELOG baseline. Never shipped — this version
  // only labels its "Version Packages" PR, so it stays calendar-derived.
  if (branch === "main") {
    return `${getCurrentCycle()}.0.${buildNum}-beta`;
  }

  // release/YY.MM: the base of a cycle -> point segment 0.
  if (branch.startsWith("release/")) {
    const cycle = branch.slice("release/".length);
    if (!/^\d{2}\.(04|10)$/.test(cycle)) {
      throw new Error(
        `Invalid release branch name: '${branch}'. Expected 'release/YY.04' or 'release/YY.10'.`,
      );
    }
    return `${cycle}.0.${buildNum}`;
  }

  // point/YY.MM.N: the Nth point release of a cycle. Cycle and point number
  // come straight from the branch name; candidates carry -rc until promoted.
  if (branch.startsWith("point/")) {
    const spec = branch.slice("point/".length);
    const match = spec.match(/^(\d{2}\.(?:04|10))\.(\d+)$/);
    if (!match) {
      throw new Error(
        `Invalid point branch name: '${branch}'. Expected 'point/YY.04.N' or 'point/YY.10.N' (e.g. point/26.10.1).`,
      );
    }
    const [, cycle, point] = match;
    const version = `${cycle}.${point}.${buildNum}`;
    return isReleasedPoint(branch) ? version : `${version}-rc`;
  }

  return `0.0.0-draft.${buildNum}`;
}

console.log(getVersion());
