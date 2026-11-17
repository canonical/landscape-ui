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
 * if the version's CHANGELOG section already exists AND new changesets are
 * pending (i.e. the prep PR was merged and more changes landed on the beta
 * branch), it aborts rather than silently consuming them into nothing.
 *
 * Respins (YY.MM~beta.N.R, made on the SAME beta branch per the beta release
 * design) are not supported yet: if package.json or debian/changelog already
 * carries a respin of this beta, the script aborts instead of rewinding the
 * branch to the base beta version.
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

  // 1. package.json — keep the -beta.N suffix (beta identity), unlike
  // manual-version-update.cjs which strips pre-release suffixes.
  const pkgPath = path.join(projectRoot, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

  // A respin (YY.MM~beta.N.R) of this beta is already stamped on the branch.
  // Re-preparing would rewind package.json and stack an older stanza above
  // the respin's, so stop until respins are supported.
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
        `Respins are not supported by this script yet — prepare them by hand.`,
    );
    process.exit(1);
  }

  if (pkg.version !== version) {
    pkg.version = version;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
    console.log(`Updated package.json to ${version}`);
  } else {
    console.log(`package.json already at ${version} — no change.`);
  }

  // 2 + 4. Roll pending changesets into CHANGELOG.md and delete them.
  // Skip the CHANGELOG write entirely when the section already exists
  // (idempotent re-run after changesets were consumed).
  const changesetDir = path.join(projectRoot, ".changeset");
  const changelogPath = path.join(projectRoot, "CHANGELOG.md");
  const { files, entries } = readPendingChangesets(changesetDir);

  if (entries.length > 0) {
    const existing = fs.existsSync(changelogPath)
      ? fs.readFileSync(changelogPath, "utf8")
      : "";
    if (existing.includes(`## ${version}\n`)) {
      // The prep PR for this beta was already merged: its CHANGELOG section
      // is frozen. Deleting the pending changesets here would silently drop
      // their release notes, so fail instead.
      console.error(
        `CHANGELOG.md already has a ${version} section, but ${entries.length} ` +
          `changeset(s) are pending. Release notes for this beta are frozen — ` +
          `ship these changes in a respin (not yet automated) or the next ` +
          `beta, or remove the pending changesets from this branch.`,
      );
      process.exit(1);
    }
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

  // 3. debian/changelog stanza.
  prependDebianStanza(debianChangelogPath, debVersion, version);
}

if (require.main === module) {
  main();
}

// Exported so the workflow derives the version through this single parser
// rather than re-implementing the branch-name regex in bash.
module.exports = { parseBetaVersion };
