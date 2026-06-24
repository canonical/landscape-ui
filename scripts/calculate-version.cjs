const { execSync } = require("child_process");

/**
 * Calendar-based version derivation for Landscape UI.
 *
 * Branch -> version shape:
 *   main             -> ${currentCycle}.0.${count}-beta
 *   dev              -> ${currentCycle}.0.${count}-dev
 *   release/YY.MM    -> YY.MM.0.${n}[-rc]     (cycle base; point 0)
 *   point/YY.MM.P    -> YY.MM.P.${n}[-rc]     (point release P within YY.MM)
 *
 * `currentCycle` (main/dev only) is the upcoming Ubuntu release we are working
 * toward:
 *   Jan-Apr  -> YY.04
 *   May-Oct  -> YY.10
 *   Nov-Dec  -> (YY+1).04
 *
 * Cycle and point for release/point branches come from the branch NAME, never
 * the calendar, so a fix backported in November 2026 still ships as 26.04.X,
 * not 27.04.X.
 *
 * The trailing counter `n` for release/point branches is TAG-ANCHORED: it is
 * the number of *release-worthy* commits added since the branch's `.0` build
 * tag (`v${cycle}.${point}.0` / `...0-rc`). "Release-worthy" excludes the
 * housekeeping commit types in SKIP_TYPES (chore/ci/docs/test/style), so a
 * formatting or CI-only commit does not burn a version number. When no `.0`
 * tag exists yet — a freshly cut branch, or the first build under this scheme —
 * the current HEAD *is* the cut: n = 0, and CI tags it `.0`. Every later build
 * counts up from that anchor, independent of main and immune to main drift.
 *
 * `-rc` suffix: every release/point build is a release candidate UNLESS its
 * branch is listed in the RELEASED_POINT_BRANCHES repo variable (passed in via
 * env as a comma/whitespace-separated list of branch refs). Promotion to GA is
 * therefore a one-line variable edit plus a rebuild — no code change.
 */

// Conventional-commit types that do not advance the version on release/point
// branches. A `fix(ci):` still counts (its type is `fix`); only a `chore(ci):`
// — type `chore` — is skipped.
const SKIP_TYPES = /^(chore|ci|docs|test|style)(\([^)]*\))?!?:/i;

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

function git(args) {
  try {
    return execSync(`git ${args}`, {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return null;
  }
}

function totalCommitCount() {
  return git("rev-list --count HEAD") ?? "0";
}

// release/YY.MM -> point 0 ; point/YY.MM.P -> point P. Returns null for any
// branch that isn't a calendar release/point branch.
function parseReleaseBranch(branch) {
  const release = branch.match(/^release\/(\d{2}\.(?:04|10))$/);
  if (release) return { cycle: release[1], point: 0 };
  const point = branch.match(/^point\/(\d{2}\.(?:04|10))\.(\d+)$/);
  if (point) return { cycle: point[1], point: Number(point[2]) };
  return null;
}

// The `.0` build tag is the counter anchor. It may carry the `-rc` suffix from
// the build that created it; either spelling marks the same cut commit.
function anchorTag(cycle, point) {
  const out = git(`tag --list v${cycle}.${point}.0 v${cycle}.${point}.0-rc`);
  if (!out) return null;
  const [first] = out
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  return first ?? null;
}

function releaseWorthyCount(base) {
  const out = git(`log --format=%s ${base}..HEAD`);
  if (!out) return 0;
  return out.split("\n").filter((s) => s && !SKIP_TYPES.test(s)).length;
}

function pointBuildNumber(cycle, point) {
  const base = anchorTag(cycle, point);
  if (!base) return 0; // HEAD is the cut; CI tags it `.0`.
  return releaseWorthyCount(base);
}

// Accept either short (`point/26.04.1`) or fully-qualified
// (`refs/heads/point/26.04.1`) refs on both sides of the comparison.
function shortRef(ref) {
  return ref.trim().replace(/^refs\/heads\//, "");
}

function isReleasedBranch(branch) {
  const current = shortRef(branch);
  return (process.env.RELEASED_POINT_BRANCHES || "")
    .split(/[\s,]+/)
    .filter(Boolean)
    .map(shortRef)
    .includes(current);
}

function getVersion() {
  const branch = getBranch();

  if (branch === "main") {
    return `${getCurrentCycle()}.0.${totalCommitCount()}-beta`;
  }
  if (branch === "dev") {
    return `${getCurrentCycle()}.0.${totalCommitCount()}-dev`;
  }

  if (branch.startsWith("release/") || branch.startsWith("point/")) {
    const parsed = parseReleaseBranch(branch);
    if (!parsed) {
      throw new Error(
        `Invalid release/point branch name: '${branch}'. Expected ` +
          `'release/YY.04', 'release/YY.10', or 'point/YY.MM.P'.`,
      );
    }
    const { cycle, point } = parsed;
    const version = `${cycle}.${point}.${pointBuildNumber(cycle, point)}`;
    return isReleasedBranch(branch) ? version : `${version}-rc`;
  }

  return `0.0.0-draft.${totalCommitCount()}`;
}

console.log(getVersion());
