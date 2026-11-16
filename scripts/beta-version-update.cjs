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
 * no-op (no duplicate CHANGELOG section or debian stanza).
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
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const pad = (n) => String(n).padStart(2, "0");
  return (
    `${days[date.getUTCDay()]}, ${pad(date.getUTCDate())} ` +
    `${months[date.getUTCMonth()]} ${date.getUTCFullYear()} ` +
    `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:` +
    `${pad(date.getUTCSeconds())} +0000`
  );
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

  // 1. package.json — keep the -beta.N suffix (beta identity), unlike
  // manual-version-update.cjs which strips pre-release suffixes.
  const pkgPath = path.join(projectRoot, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
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
    if (!existing.includes(`## ${version}\n`)) {
      prependChangelog(changelogPath, renderChangelogSection(version, entries));
    }
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
  prependDebianStanza(
    path.join(projectRoot, "debian", "changelog"),
    debVersion,
    version,
  );
}

main();
