const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
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
 * carrying the beta version (section existence alone misses an initial
 * prep that had only empty changesets) — the release notes are frozen:
 * pending changesets with content make it abort rather than silently
 * consuming them into nothing, and pending empty changesets are left in
 * place (deleting them would only open a no-op prep PR). Every check runs
 * before the first write, so an abort leaves the working tree untouched.
 *
 * Respins (YY.MM~beta.N.R) are out of this script's scope: per the beta
 * release design, the release owner prepares one by hand in a single PR on
 * the same beta branch (fix + package.json + debian/changelog + CHANGELOG.md).
 * If package.json or debian/changelog already carries a respin of this beta,
 * the script aborts instead of rewinding the branch to the base beta version.
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

function parseBetaVersion(input) {
  const match = input.match(/^(?:beta\/)?(\d{2}\.(?:04|10))-beta\.(\d+)$/);
  if (!match) {
    console.error(
      `Invalid beta branch/version: '${input}'. ` +
        `Expected beta/YY.MM-beta.N (e.g. beta/27.04-beta.4).`,
    );
    process.exit(1);
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

function readDebianTopVersion(changelogPath) {
  if (!fs.existsSync(changelogPath)) return null;
  const m = fs
    .readFileSync(changelogPath, "utf8")
    .match(/^\S+ \(([^)]+)\) [^;]+;/m);
  return m ? m[1] : null;
}

function prependDebianStanza(changelogPath, debVersion, version) {
  const existing = fs.existsSync(changelogPath)
    ? fs.readFileSync(changelogPath, "utf8")
    : "";
  const headerMatch = existing.match(/^(\S+) \(([^)]+)\) ([^;]+);/m);

  if (headerMatch && headerMatch[2] === debVersion) {
    console.log(`debian/changelog already at ${debVersion} — no change.`);
    return;
  }

  const pkgName = headerMatch ? headerMatch[1] : "landscape-dashboard";
  // Inherit the distribution from the current top entry: one changelog
  // serves all build series, and per-series targeting happens at upload.
  const dist = headerMatch ? headerMatch[3].trim() : "jammy";

  const stanza =
    `${pkgName} (${debVersion}) ${dist}; urgency=medium\n\n` +
    `  * Release ${version} for ${dist}\n\n` +
    ` -- Landscape Team <landscape-team@canonical.com>  ${rfc2822()}\n\n`;

  fs.writeFileSync(changelogPath, stanza + existing);
  console.log(`Added debian/changelog stanza for ${debVersion} (${dist}).`);
}

function main() {
  const { version, debVersion } = parseBetaVersion(getBranchOrVersion());
  const debianChangelogPath = path.join(projectRoot, "debian", "changelog");

  // package.json keeps the -beta.N suffix (beta identity), unlike
  // manual-version-update.cjs which strips pre-release suffixes.
  const pkgPath = path.join(projectRoot, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

  // "Already prepared" means the prep PR merged: the version stamp lives on
  // beta-prep/* until then, so package.json on the beta branch only matches
  // post-merge. This must be captured before the stamp below, and it covers
  // an initial prep that wrote no CHANGELOG section (only empty changesets
  // were pending) — section existence alone misses that case.
  const alreadyPrepared = pkg.version === version;

  // A respin (YY.MM~beta.N.R) of this beta is already stamped on the branch.
  // Re-preparing would rewind package.json and stack an older stanza above
  // the respin's, so stop: respins are prepared by hand, not by this script.
  const debUpstream = debVersion.replace(/-[^-]+$/, "");
  const debTop = readDebianTopVersion(debianChangelogPath);
  const respun = [
    [pkg.version, `${version}.`],
    [pkg.version, `${debUpstream}.`],
    [debTop, `${debUpstream}.`],
  ].some(([v, prefix]) => typeof v === "string" && v.startsWith(prefix));
  if (respun) {
    console.error(
      `This branch already carries a respin of ${version} ` +
        `(package.json: ${pkg.version}, debian/changelog: ${debTop}). ` +
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
    if (entries.length > 0) {
      prependChangelog(changelogPath, renderChangelogSection(version, entries));
    }
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
  prependDebianStanza(debianChangelogPath, debVersion, version);
}

if (require.main === module) {
  main();
}

// Exported so the workflow derives the version through this single parser
// rather than re-implementing the branch-name regex in bash.
module.exports = { parseBetaVersion };
