const { execFileSync } = require("node:child_process");
const { appendFileSync, readFileSync } = require("node:fs");
const path = require("node:path");

const BASE = /^(?:beta\/)?(\d{2}\.(?:04|10))-beta\.([1-9]\d*)$/;
const VERSION = /^(\d{2}\.(?:04|10))-beta\.([1-9]\d*)(?:\.[1-9]\d*)?$/;
const REVISION = "0landscape0";

function parseBetaVersion(input) {
  const match = BASE.exec(input);
  if (!match) {
    throw new Error(
      `Invalid beta branch/version: '${input}'. Expected beta/YY.MM-beta.N.`,
    );
  }
  const version = `${match[1]}-beta.${match[2]}`;
  return { version, debVersion: `${debianUpstream(version)}-${REVISION}` };
}

function debianUpstream(version) {
  return version.replace("-beta.", "~beta.");
}

function readBetaRelease(branch, root = path.resolve(__dirname, "..")) {
  const { version: base } = parseBetaVersion(branch);
  const { version } = JSON.parse(
    readFileSync(path.join(root, "package.json"), "utf8"),
  );

  // An inherited version belongs to a different cut. A malformed stamp for
  // this cut must fail rather than being treated as an unprepared branch.
  const upstreamBase = debianUpstream(base);
  if (typeof version !== "string")
    throw new Error("Missing package.json version");
  if (
    version !== base &&
    !version.startsWith(`${base}.`) &&
    version !== upstreamBase &&
    !version.startsWith(`${upstreamBase}.`)
  ) {
    return null;
  }
  if (!VERSION.test(version))
    throw new Error(`Invalid dash-form beta version: ${version}`);

  const heading = readFileSync(path.join(root, "CHANGELOG.md"), "utf8").match(
    /^## (.+)$/m,
  )?.[1];
  if (heading !== version)
    throw new Error(`Top CHANGELOG.md heading must be '## ${version}'`);

  const debVersion = execFileSync(
    "dpkg-parsechangelog",
    ["--show-field", "Version"],
    {
      cwd: root,
      encoding: "utf8",
    },
  ).trim();
  const separator = debVersion.lastIndexOf("-");
  const upstream =
    separator === -1 ? debVersion : debVersion.slice(0, separator);
  const revision = separator === -1 ? "" : debVersion.slice(separator + 1);
  const expected = debianUpstream(version);
  if (upstream !== expected) {
    throw new Error(
      `Top debian/changelog upstream version must be ${expected}; got ${upstream}`,
    );
  }
  if (revision !== REVISION) {
    throw new Error(
      `Top debian/changelog revision must be ${REVISION}; got '${revision}'`,
    );
  }
  return version;
}

function routeBetaPush(branch, runId) {
  const version = readBetaRelease(branch);
  if (version === null) return { decision: "prepare" };

  const git = (...args) =>
    execFileSync("git", args, { encoding: "utf8" }).trim();
  if (git("ls-remote", "--tags", "--refs", "origin", `refs/tags/${version}`)) {
    return { decision: "skip", version };
  }
  const sha = git("rev-parse", "HEAD");
  return {
    decision: "publish",
    version,
    "deb-version": `${debianUpstream(version)}-${REVISION}`,
    marker: `Landscape-UI-Beta:${runId}:${sha}`,
    sha,
  };
}

if (require.main === module) {
  const route = routeBetaPush(
    process.env.GITHUB_REF_NAME,
    process.env.GITHUB_RUN_ID,
  );
  console.log(
    `Beta release: ${route.decision}${route.version ? ` (${route.version})` : ""}`,
  );
  appendFileSync(
    process.env.GITHUB_OUTPUT,
    Object.entries(route)
      .map(([key, value]) => `${key}=${value}\n`)
      .join(""),
  );
}

module.exports = { parseBetaVersion, readBetaRelease };
