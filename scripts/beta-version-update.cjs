const fs = require("fs");
const path = require("path");
const { execFileSync, execSync } = require("child_process");
const {
  readPendingChangesets,
  renderChangelogSection,
  prependChangelog,
} = require("./manual-version-update.cjs");

/**
 * Release-preparation versioning for beta/** branches.
 *
 * A beta branch is cut per pulse and named beta/YY.MM-beta.N (e.g.
 * beta/27.04-beta.4), mirroring the landscape-server beta it ships with. The
 * beta number is pinned by the branch name — it is deliberately NOT derived
 * from tags, because numbers may be skipped to stay aligned with the server
 * (a respun server beta forces the same respin here).
 *
 * Given the branch name, this script prepares the release on the working
 * tree (CI commits it to beta-prep/<version> and opens a PR):
 *
 *   1. package.json     -> "YY.MM-beta.N"   (dash form, matching the git tag
 *                                            convention in the server beta
 *                                            process; the suffix is kept —
 *                                            unlike manual-version-update.cjs,
 *                                            which strips it)
 *   2. CHANGELOG.md     -> pending .changeset/*.md rolled up under a
 *                          "## YY.MM-beta.N" section
 *   3. debian/changelog -> new stanza "landscape-dashboard
 *                          (YY.MM~beta.N-0landscape0) <dist>; urgency=medium"
 *                          (tilde form, so the beta sorts before the final
 *                          YY.MM release). <dist> is inherited from the
 *                          current top entry — the same changelog serves all
 *                          build series (jammy, noble, resolute).
 *   4. .changeset/*.md  -> consumed files are deleted
 *
 * The script is idempotent: re-running it on an already-prepared tree is a
 * no-op (no duplicate CHANGELOG section or debian stanza). One exception:
 * if the prep PR was already merged — detected via package.json already
 * carrying the beta version — the release notes are frozen:
 * pending changesets with content make it abort rather than silently
 * consuming them into nothing, and pending empty changesets are left in
 * place (deleting them would only open a no-op prep PR). Every check runs
 * before the first write, so an abort leaves the working tree untouched.
 *
 * Respins (YY.MM~beta.N.R) are out of this script's scope: per the beta
 * release design, the release owner prepares one by hand in a single PR on
 * the same beta branch (fix + package.json + debian/changelog + CHANGELOG.md).
 * If package.json carries a respin of this beta, or debian/changelog's top
 * entry is already newer than this beta (dpkg ordering) or has this beta
 * below the top, the script aborts instead of rewinding the version.
 * Needs dpkg (present on Ubuntu runners).
 *
 * Usage:
 *   node scripts/beta-version-update.cjs [beta/YY.MM-beta.N | YY.MM-beta.N]
 * Defaults to $GITHUB_REF_NAME, then the current git branch.
 */

const projectRoot = path.resolve(__dirname, "..");

function getBranchOrVersion() {
  if (process.argv[2]) return process.argv[2];
  if (process.env.GITHUB_REF_NAME) return process.env.GITHUB_REF_NAME;
  return execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
}

// Beta number: no leading zeros and no beta.0. dpkg compares numerically,
// so 27.04~beta.04 and 27.04~beta.4 would be the same Debian version.
const BETA_RE = /^(?:beta\/)?(\d{2}\.(?:04|10))-beta\.([1-9]\d*)$/;

// Throws (rather than exiting) so importers get a catchable error; main()
// turns it into a non-zero exit.
function parseBetaVersion(input) {
  const match = BETA_RE.exec(input);
  if (!match) {
    throw new Error(
      `Invalid beta branch/version: '${input}'. ` +
        `Expected beta/YY.MM-beta.N with N >= 1 and no leading zeros ` +
        `(e.g. beta/27.04-beta.4).`,
    );
  }
  const [, cycle, betaNumber] = match;
  return {
    // package.json version / CHANGELOG section key / git tag form
    version: `${cycle}-beta.${betaNumber}`,
    // debian/changelog version (tilde sorts beta before the final release)
    debVersion: `${cycle}~beta.${betaNumber}-0landscape0`,
  };
}

// "Thu, 08 Jan 2026 11:01:29 +0000" (RFC 2822, UTC) as debchange writes it.
function rfc2822(date = new Date()) {
  return date.toUTCString().replace("GMT", "+0000");
}

// Every stanza header in debian/changelog: "pkg (version) dist; ...".
// The first one is the top (current) entry.
function readDebianEntries(text) {
  return [...text.matchAll(/^(\S+) \(([^)]+)\) ([^;]+);/gm)].map((m) => ({
    pkgName: m[1],
    version: m[2],
    dist: m[3].trim(),
  }));
}

function dpkgVersionGreater(a, b) {
  try {
    // Capture stderr so a dpkg error is reported once, in the thrown message.
    execFileSync("dpkg", ["--compare-versions", a, "gt", b], {
      stdio: ["ignore", "ignore", "pipe"],
    });
    return true;
  } catch (err) {
    if (err.code === "ENOENT") {
      throw new Error("dpkg is required to compare Debian versions.");
    }
    // Exit status 1 means "not greater". Anything else (e.g. 2 for a
    // malformed version in debian/changelog) means the order check itself
    // failed, so stop before writing anything.
    if (err.status === 1) return false;
    const detail = err.stderr ? String(err.stderr).trim() : err.message;
    throw new Error(`dpkg could not compare '${a}' with '${b}': ${detail}`);
  }
}

function prependDebianStanza(changelogPath, existing, debVersion, version) {
  const [top] = readDebianEntries(existing);

  if (top && top.version === debVersion) {
    console.log(`debian/changelog already at ${debVersion} — no change.`);
    return;
  }

  const pkgName = top ? top.pkgName : "landscape-dashboard";
  // Inherit the distribution from the current top entry: one changelog
  // serves all build series, and per-series targeting happens at upload.
  const dist = top ? top.dist : "jammy";

  const stanza =
    `${pkgName} (${debVersion}) ${dist}; urgency=medium\n\n` +
    `  * Release ${version} for ${dist}\n\n` +
    ` -- Landscape Team <landscape-team@canonical.com>  ${rfc2822()}\n\n`;

  fs.writeFileSync(changelogPath, stanza + existing);
  console.log(`Added debian/changelog stanza for ${debVersion} (${dist}).`);
}

function main() {
  let parsed;
  try {
    parsed = parseBetaVersion(getBranchOrVersion());
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
  const { version, debVersion } = parsed;

  // In CI, hand the version to later steps (the prep branch name and PR
  // title) so the branch name is parsed in exactly one place.
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `version=${version}\n`);
  }

  const debianChangelogPath = path.join(projectRoot, "debian", "changelog");
  const debianChangelog = fs.existsSync(debianChangelogPath)
    ? fs.readFileSync(debianChangelogPath, "utf8")
    : "";

  // package.json keeps the -beta.N suffix (beta identity), unlike
  // manual-version-update.cjs which strips pre-release suffixes.
  const pkgPath = path.join(projectRoot, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

  // "Already prepared" means the prep PR merged: the version stamp lives on
  // beta-prep/* until then, so package.json on the beta branch only matches
  // post-merge. Capture this before the stamp below.
  const alreadyPrepared = pkg.version === version;

  // debian/changelog must stay monotonic. If its top entry is already newer
  // than this beta (a respin such as YY.MM~beta.N.R, a Debian revision bump,
  // a later beta), or this beta's entry exists below the top, prepending
  // would put an older or duplicate version on top. Respins are prepared by
  // hand, not by this script, so stop.
  const debEntries = readDebianEntries(debianChangelog);
  const debTop = debEntries[0]?.version;
  const debTopIsNewer = debTop && dpkgVersionGreater(debTop, debVersion);
  const debBuried = debEntries
    .slice(1)
    .some((entry) => entry.version === debVersion);
  // package.json carrying a respin of this beta (either form), e.g. when the
  // respin PR stamped package.json before debian/changelog.
  const debUpstream = debVersion.replace(/-[^-]+$/, "");
  const pkgRespun = [`${version}.`, `${debUpstream}.`].some((prefix) =>
    String(pkg.version).startsWith(prefix),
  );
  if (debTopIsNewer || debBuried || pkgRespun) {
    console.error(
      `This branch already carries a version at or above ${version} ` +
        `(package.json: ${pkg.version}, debian/changelog top: ${debTop}). ` +
        `Respins are prepared by hand in a PR on this branch (see the beta ` +
        `release process); this script only prepares the base beta.`,
    );
    process.exit(1);
  }

  // Read pending changesets and decide whether this beta's release notes
  // are frozen BEFORE writing anything, so an abort leaves the tree as-is.
  const changesetDir = path.join(projectRoot, ".changeset");
  const changelogPath = path.join(projectRoot, "CHANGELOG.md");
  const { files, entries } = readPendingChangesets(changesetDir);
  const changelog = fs.existsSync(changelogPath)
    ? fs.readFileSync(changelogPath, "utf8")
    : "";
  const frozen = alreadyPrepared || changelog.includes(`## ${version}\n`);

  if (frozen && entries.length > 0) {
    // Consuming these would drop their release notes (the section is
    // frozen), so fail instead.
    console.error(
      `Release notes for ${version} are frozen (prep already merged or its ` +
        `CHANGELOG section exists), but ${entries.length} changeset(s) with ` +
        `content are pending. Ship these changes in a respin PR (see the beta ` +
        `release process) or the next beta, or remove the pending changesets ` +
        `from this branch.`,
    );
    process.exit(1);
  }

  // 1. package.json
  if (pkg.version !== version) {
    pkg.version = version;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
    console.log(`Updated package.json to ${version}`);
  } else {
    console.log(`package.json already at ${version} — no change.`);
  }

  // 2 + 4. Roll pending changesets into CHANGELOG.md and delete them.
  if (frozen) {
    // Only empty changesets can be pending here (content aborted above).
    // Leave them: deleting them changes nothing user-visible and would
    // only open a no-op prep PR.
    if (files.length > 0) {
      console.log(
        `Release notes for ${version} are frozen — leaving ${files.length} ` +
          `empty changeset(s) in place.`,
      );
    }
  } else {
    prependChangelog(changelogPath, renderChangelogSection(version, entries));
    for (const file of files) {
      fs.unlinkSync(file);
    }
    if (files.length > 0) {
      console.log(
        `Consumed ${files.length} changeset(s) (${entries.length} with content) into CHANGELOG.md`,
      );
    }
  }

  // 3. debian/changelog stanza.
  prependDebianStanza(
    debianChangelogPath,
    debianChangelog,
    debVersion,
    version,
  );
}

if (require.main === module) {
  try {
    main();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

// Exported so the workflow derives the version through this single parser
// rather than re-implementing the branch-name regex in bash.
module.exports = { parseBetaVersion };
