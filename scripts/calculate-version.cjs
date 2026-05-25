const { execSync } = require("child_process");

/**
 * Calendar-based version derivation for Landscape UI.
 *
 * Branch -> version shape:
 *   main             -> ${currentCycle}.0.${count}-beta
 *   point/YYYY-MM-DD -> ${currentCycle}.0.${count}-beta
 *   dev              -> ${currentCycle}.0.${count}-dev
 *   release/YY.MM    -> YY.MM.1.${count}          (cycle pinned by branch name)
 *
 * `currentCycle` is the upcoming Ubuntu release we are working toward:
 *   Jan-Apr  -> YY.04
 *   May-Oct  -> YY.10
 *   Nov-Dec  -> (YY+1).04
 *
 * `count` is derived from git, not from GITHUB_RUN_NUMBER, so each branch
 * has its own monotonic counter:
 *   main / dev               -> total commits reachable from HEAD
 *   release/* / point/*      -> commits added since the cut from main
 *                               (origin/main..HEAD) — first build = 0
 *
 * This means cutting release/26.04 produces 26.04.1.0 on the first build,
 * 26.04.1.1 after the first cherry-pick, and so on — independent of how
 * many CI runs have happened on other branches.
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
    const count =
      gitRevCount("origin/main..HEAD") ?? gitRevCount("main..HEAD");
    if (count !== null) return count;
  }

  // Long-lived trunks (and any unknown branch) just use total commit count
  // on the current ref — monotonic and self-contained, no remote required.
  return gitRevCount("HEAD") ?? "0";
}

function getVersion() {
  const branch = getBranch();
  const buildNum = getBuildNumber(branch);

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
