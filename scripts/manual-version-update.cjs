const fs = require("fs");
const path = require("path");

/**
 * Versioning hook for the @changesets/action workflow step.
 *
 * Standard `changeset version` can't bump CalVer strings (they aren't valid
 * semver — `changeset version` writes `null` and only partially clears the
 * queue), so this script reproduces the parts we actually need:
 *
 *   1. Update package.json with the CalVer string from calculate-version.cjs.
 *   2. Roll every pending .changeset/*.md file into CHANGELOG.md under a
 *      new section keyed on the build's CalVer version.
 *   3. Delete the consumed .changeset/*.md files so the next run starts
 *      from an empty queue.
 *
 * The action picks up the resulting working-tree changes and opens (or
 * updates) the "Version Packages" PR.
 */

const newVersion = process.argv[2];
if (!newVersion) {
  console.error("No version provided");
  process.exit(1);
}

const cleanVersion = newVersion.replace("-beta", "").replace("-dev", "");
const projectRoot = path.resolve(__dirname, "..");
const pkgPath = path.join(projectRoot, "package.json");
const changelogPath = path.join(projectRoot, "CHANGELOG.md");
const changesetDir = path.join(projectRoot, ".changeset");

const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
pkg.version = cleanVersion;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

const { files, entries } = readPendingChangesets(changesetDir);

if (entries.length > 0) {
  const section = renderChangelogSection(newVersion, entries);
  prependChangelog(changelogPath, section);
}

for (const file of files) {
  fs.unlinkSync(file);
}

if (files.length > 0) {
  console.log(
    `Consumed ${files.length} changeset(s) (${entries.length} with content) into CHANGELOG.md`,
  );
}
console.log(`Updated package.json to ${cleanVersion}`);

function readPendingChangesets(dir) {
  if (!fs.existsSync(dir)) return { files: [], entries: [] };
  const files = [];
  const entries = [];
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith(".md") || name === "README.md") continue;
    const file = path.join(dir, name);
    files.push(file);
    const parsed = parseChangeset(fs.readFileSync(file, "utf8"));
    if (parsed && parsed.summary) entries.push(parsed);
  }
  return { files, entries };
}

function parseChangeset(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return null;
  const frontmatter = match[1];
  const summary = match[2].trim();
  const bumpMatch = frontmatter.match(/:\s*(patch|minor|major)\s*$/m);
  if (!bumpMatch) return null;
  return { bumpType: bumpMatch[1], summary };
}

function renderChangelogSection(version, entries) {
  const groups = { major: [], minor: [], patch: [] };
  for (const e of entries) groups[e.bumpType].push(e.summary);

  const labels = {
    major: "Major Changes",
    minor: "Minor Changes",
    patch: "Patch Changes",
  };
  let out = `## ${version}\n\n`;
  for (const bump of ["major", "minor", "patch"]) {
    if (groups[bump].length === 0) continue;
    out += `### ${labels[bump]}\n\n`;
    for (const summary of groups[bump]) {
      out += `${renderBullets(summary)}\n`;
    }
    out += `\n`;
  }
  return out;
}

function renderBullets(summary) {
  // If the changeset body is itself a flat markdown list (every non-empty
  // line starts with `-` or `*`), preserve it as multiple top-level bullets
  // — otherwise the leading dash gets re-prefixed and we end up with
  // visible `- - item` lines. For prose summaries, collapse internal
  // whitespace into a single bullet.
  const lines = summary.trim().split(/\r?\n/);
  const nonEmpty = lines.filter((l) => l.trim() !== "");
  const isList =
    nonEmpty.length > 0 && nonEmpty.every((l) => /^\s*[-*]\s+/.test(l));
  if (isList) {
    return nonEmpty
      .map((l) => `- ${l.replace(/^\s*[-*]\s+/, "").trim()}`)
      .join("\n");
  }
  return `- ${summary.trim().replace(/\s*\n\s*/g, " ")}`;
}

function prependChangelog(filePath, section) {
  const existing = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, "utf8")
    : "";

  // Insert below the transition header (everything up to and including the
  // first `---` divider line) when present, so the "Landscape Lifecycle
  // Transition" preamble stays at the top. If there is no divider yet, the
  // new section becomes the first block.
  const dividerIdx = existing.split("\n").findIndex((l) => l.trim() === "---");
  if (dividerIdx === -1) {
    fs.writeFileSync(filePath, section + existing);
    return;
  }
  const lines = existing.split("\n");
  const before = lines.slice(0, dividerIdx + 1).join("\n");
  const rest = lines.slice(dividerIdx + 1).join("\n").replace(/^\n+/, "");
  fs.writeFileSync(filePath, `${before}\n\n${section}${rest}`);
}
