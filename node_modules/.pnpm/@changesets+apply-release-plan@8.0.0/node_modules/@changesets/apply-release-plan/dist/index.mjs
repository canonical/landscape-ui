import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { defaultConfig } from "@changesets/config";
import { defaultDetectOrder, detect, format } from "@changesets/format";
import * as git from "@changesets/git";
import { shouldSkipPackage } from "@changesets/should-skip-package";
import { resolve } from "import-meta-resolve";
import { applyEdits, parseTree, printParseErrorCode } from "jsonc-parser";
import validRange from "semver/ranges/valid.js";
import semverSatisfies from "semver/functions/satisfies.js";
import Range from "semver/classes/range.js";
import semverPrerelease from "semver/functions/prerelease.js";
//#region src/edit-json.ts
/**
* A simple JSON editing utility that preserves formatting. They specified operation keys
* must exist in the JSON for this implementation.
*/
function editJson(json, operations) {
	const errors = [];
	const parsed = parseTree(json, errors, {
		allowEmptyContent: false,
		allowTrailingComma: false,
		disallowComments: true
	});
	if (!parsed) throw new Error("Failed to parse JSON");
	if (errors.length > 0) {
		const error = errors[0];
		throw new Error(`Failed to parse JSON at offset ${error.offset}: ${printParseErrorCode(error.error)}`);
	}
	return applyEdits(json, operations.map((op) => {
		const valueNode = getValueNode(parsed, op.keys);
		if (!valueNode) throw new Error(`Key path "${op.keys.join(".")}" not found in JSON`);
		return {
			content: JSON.stringify(op.value),
			offset: valueNode.offset,
			length: valueNode.length
		};
	}));
}
function getValueNode(root, keys) {
	let node = root;
	for (const key of keys) {
		if (node.type !== "object") return null;
		const property = node.children?.find((child) => child.type === "property" && child.children?.length === 2 && child.children[0].value === key);
		if (!property) return null;
		node = property.children[1];
	}
	return node;
}
//#endregion
//#region src/utils.ts
/**
* Shared utility functions and business logic
*/
const bumpTypes = [
	"none",
	"patch",
	"minor",
	"major"
];
function getBumpLevel(type) {
	const level = bumpTypes.indexOf(type);
	if (level < 0) throw new Error(`Unrecognised bump type ${type}`);
	return level;
}
function shouldUpdateDependencyBasedOnConfig(cwd, release, { depVersionRange, depType }, { minReleaseType, onlyUpdatePeerDependentsWhenOutOfRange }) {
	if (release.newVersion == null) return false;
	if (depVersionRange.startsWith("workspace:")) {
		depVersionRange = depVersionRange.replace(/^workspace:/, "");
		switch (depVersionRange) {
			case "*": return true;
			case "^":
			case "~":
				depVersionRange = `${depVersionRange}${release.oldVersion}`;
				break;
			default: if (!validRange(depVersionRange)) return path.posix.normalize(depVersionRange) === path.relative(cwd, release.dir).replace(/\\/g, "/");
		}
	}
	if (!semverSatisfies(release.newVersion, depVersionRange)) return true;
	const minLevel = getBumpLevel(minReleaseType);
	let shouldUpdate = getBumpLevel(release.type) >= minLevel;
	if (depType === "peerDependencies") shouldUpdate = !onlyUpdatePeerDependentsWhenOutOfRange;
	return shouldUpdate;
}
function capitalize(str) {
	return str[0].toUpperCase() + str.slice(1);
}
//#endregion
//#region src/get-changelog-entry.ts
async function getChangelogEntry(cwd, release, releases, changesets, changelogFuncs, changelogOpts, { updateInternalDependencies, onlyUpdatePeerDependentsWhenOutOfRange }) {
	if (release.type === "none") return null;
	const changelogLines = {
		major: [],
		minor: [],
		patch: []
	};
	changesets.forEach((cs) => {
		const rls = cs.releases.find((r) => r.name === release.name);
		if (rls && rls.type !== "none") changelogLines[rls.type].push(Promise.resolve(changelogFuncs.getReleaseLine(cs, rls.type, changelogOpts)));
	});
	const dependentReleases = releases.filter((rel) => {
		const dependencyVersionRange = release.packageJson.dependencies?.[rel.name];
		const peerDependencyVersionRange = release.packageJson.peerDependencies?.[rel.name];
		const versionRange = dependencyVersionRange || peerDependencyVersionRange;
		const usesWorkspaceRange = versionRange?.startsWith("workspace:");
		return versionRange && (usesWorkspaceRange || validRange(versionRange) != null) && shouldUpdateDependencyBasedOnConfig(cwd, rel, {
			depVersionRange: versionRange,
			depType: dependencyVersionRange ? "dependencies" : "peerDependencies"
		}, {
			minReleaseType: updateInternalDependencies,
			onlyUpdatePeerDependentsWhenOutOfRange
		});
	});
	const relevantChangesetIds = /* @__PURE__ */ new Set();
	dependentReleases.forEach((rel) => {
		rel.changesets.forEach((cs) => {
			relevantChangesetIds.add(cs);
		});
	});
	const relevantChangesets = changesets.filter((cs) => relevantChangesetIds.has(cs.id));
	changelogLines.patch.push(Promise.resolve(changelogFuncs.getDependencyReleaseLine(relevantChangesets, dependentReleases, changelogOpts)));
	const resolvedChangelogLines = {
		major: await Promise.all(changelogLines.major),
		minor: await Promise.all(changelogLines.minor),
		patch: await Promise.all(changelogLines.patch)
	};
	return [
		`## ${release.newVersion}`,
		generateMarkdownForVersionType("major", resolvedChangelogLines.major),
		generateMarkdownForVersionType("minor", resolvedChangelogLines.minor),
		generateMarkdownForVersionType("patch", resolvedChangelogLines.patch)
	].filter((line) => line).join("\n\n");
}
function generateMarkdownForVersionType(type, lines) {
	const releaseLines = lines.filter((l) => l);
	if (!releaseLines.length) return;
	let content = `### ${capitalize(type)} Changes`;
	let newLines = 2;
	for (const line of releaseLines) {
		const startNewLinesCount = line.match(/^\n*/)?.[0].length ?? 0;
		newLines += startNewLinesCount;
		const newLinesContent = "\n".repeat(Math.min(Math.max(newLines, 1), 2));
		content += newLinesContent + line.trim();
		newLines = line.match(/\n*$/)?.[0].length ?? 0;
	}
	return content;
}
//#endregion
//#region src/version-package.ts
const DEPENDENCY_TYPES = [
	"dependencies",
	"devDependencies",
	"peerDependencies",
	"optionalDependencies"
];
function getDependencyVersionEdits(packageJson, versionsToUpdate, { cwd, updateInternalDependencies, onlyUpdatePeerDependentsWhenOutOfRange, bumpVersionsWithWorkspaceProtocolOnly, snapshot }) {
	const pkgJsonEdits = [];
	for (const depType of DEPENDENCY_TYPES) {
		const deps = packageJson[depType];
		if (deps) for (const release of versionsToUpdate) {
			if (release.newVersion == null) continue;
			const { name, newVersion } = release;
			let depCurrentVersion = deps[name];
			if (!depCurrentVersion || depCurrentVersion.startsWith("file:") || depCurrentVersion.startsWith("link:") || !shouldUpdateDependencyBasedOnConfig(cwd, release, {
				depVersionRange: depCurrentVersion,
				depType
			}, {
				minReleaseType: updateInternalDependencies,
				onlyUpdatePeerDependentsWhenOutOfRange
			})) continue;
			const usesWorkspaceRange = depCurrentVersion.startsWith("workspace:");
			if (!usesWorkspaceRange && (bumpVersionsWithWorkspaceProtocolOnly || validRange(depCurrentVersion) == null)) continue;
			if (usesWorkspaceRange) {
				const workspaceDepVersion = depCurrentVersion.replace(/^workspace:/, "");
				if (workspaceDepVersion === "*" || workspaceDepVersion === "^" || workspaceDepVersion === "~" || validRange(workspaceDepVersion) == null) continue;
				depCurrentVersion = workspaceDepVersion;
			}
			if (new Range(depCurrentVersion).range !== "" || semverPrerelease(newVersion) != null) {
				let newNewRange = snapshot ? newVersion : `${getVersionRangeType(depCurrentVersion)}${newVersion}`;
				if (usesWorkspaceRange) newNewRange = `workspace:${newNewRange}`;
				pkgJsonEdits.push({
					keys: [depType, name],
					value: newNewRange
				});
			}
		}
	}
	return pkgJsonEdits;
}
function getVersionRangeType(versionRange) {
	if (versionRange.charAt(0) === "^") return "^";
	if (versionRange.charAt(0) === "~") return "~";
	if (versionRange.startsWith(">=")) return ">=";
	if (versionRange.startsWith("<=")) return "<=";
	if (versionRange.charAt(0) === ">") return ">";
	return "";
}
//#endregion
//#region src/index.ts
function importResolveFromDir(specifier, dir) {
	return resolve(specifier, pathToFileURL(path.join(dir, "x.mjs")).toString());
}
async function getCommitsThatAddChangesets(changesetIds, cwd) {
	const paths = changesetIds.map((id) => `.changeset/${id}.md`);
	return await git.getCommitsThatAddFiles(paths, { cwd });
}
async function getFormatter(config, cwd) {
	if (config === false) return async () => {};
	const formatter = config === "auto" ? await detect({
		cwd,
		order: defaultDetectOrder.filter((f) => f !== "biome")
	}) : config;
	if (!formatter) return async () => {};
	return async (patterns) => {
		await format(patterns, {
			cwd,
			formatter
		});
	};
}
async function updatePackageJson(dir, edits) {
	if (edits.length === 0) return;
	const pkgJsonPath = path.resolve(dir, "package.json");
	const pkgUpdated = editJson(await fs.readFile(pkgJsonPath, "utf8"), edits);
	await fs.writeFile(pkgJsonPath, pkgUpdated);
	return pkgJsonPath;
}
async function applyReleasePlan(releasePlan, packages, config = defaultConfig, snapshot, contextDir = import.meta.dirname) {
	const cwd = packages.rootDir;
	const touchedFiles = [];
	const packagesByName = new Map(packages.packages.map((x) => [x.packageJson.name, x]));
	const { releases, changesets } = releasePlan;
	const releaseWithChangelogs = await getNewChangelogEntry(releases.map((release) => {
		const pkg = packagesByName.get(release.name);
		if (!pkg) throw new Error(`Could not find matching package for release of: ${release.name}`);
		return {
			...release,
			...pkg
		};
	}), changesets, config, cwd, contextDir);
	if (releasePlan.preState?.mode === "exit" && snapshot == null) {
		await fs.rm(path.join(cwd, ".changeset", "pre.json"), {
			recursive: true,
			force: true
		});
		touchedFiles.push(path.join(cwd, ".changeset", "pre.json"));
	}
	const versionsToUpdate = releases.map((release) => ({
		...release,
		dir: packagesByName.get(release.name).dir
	}));
	const dependencyUpdateOptions = {
		cwd,
		updateInternalDependencies: config.updateInternalDependencies,
		onlyUpdatePeerDependentsWhenOutOfRange: config.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH.onlyUpdatePeerDependentsWhenOutOfRange,
		bumpVersionsWithWorkspaceProtocolOnly: config.bumpVersionsWithWorkspaceProtocolOnly,
		snapshot
	};
	const filesToFormat = [];
	for (const release of releaseWithChangelogs) {
		const { changelog, dir, name, newVersion, packageJson } = release;
		const pkgJsonEdits = getDependencyVersionEdits(packageJson, versionsToUpdate, dependencyUpdateOptions);
		if (newVersion != null) pkgJsonEdits.push({
			keys: ["version"],
			value: newVersion
		});
		const pkgJsonPath = await updatePackageJson(dir, pkgJsonEdits);
		if (pkgJsonPath) touchedFiles.push(pkgJsonPath);
		if (changelog && changelog.length > 0) {
			const changelogPath = path.resolve(dir, "CHANGELOG.md");
			await updateChangelog(changelogPath, changelog, name);
			touchedFiles.push(changelogPath);
			filesToFormat.push(changelogPath);
		}
	}
	if (packages.rootPackage) {
		const pkgJsonEdits = getDependencyVersionEdits(packages.rootPackage.packageJson, versionsToUpdate, dependencyUpdateOptions);
		const pkgJsonPath = await updatePackageJson(packages.rootPackage.dir, pkgJsonEdits);
		if (pkgJsonPath) touchedFiles.push(pkgJsonPath);
	}
	if (filesToFormat.length > 0) await (await getFormatter(config.format, cwd))(filesToFormat);
	const isPreChangesets = releasePlan.preState?.mode === "pre";
	if (isPreChangesets && changesets.length > 0) await fs.mkdir(path.resolve(cwd, ".changeset", "pre"), { recursive: true });
	await Promise.all(changesets.map(async (changeset) => {
		const changesetPath = path.resolve(cwd, ".changeset", `${changeset.id}.md`);
		if (await fs.access(changesetPath).then(() => true, () => false)) {
			if (!changeset.releases.some((release) => shouldSkipPackage(packagesByName.get(release.name), {
				ignore: config.ignore,
				allowPrivatePackages: config.privatePackages.version
			}))) if (isPreChangesets) {
				const newChangesetPath = path.resolve(cwd, ".changeset", "pre", `${changeset.id}.md`);
				await fs.rename(changesetPath, newChangesetPath);
				touchedFiles.push(changesetPath, newChangesetPath);
			} else {
				await fs.rm(changesetPath, {
					recursive: true,
					force: true
				});
				touchedFiles.push(changesetPath);
			}
		}
	}));
	return touchedFiles;
}
async function getNewChangelogEntry(releasesWithPackage, changesets, config, cwd, contextDir) {
	if (!config.changelog) return Promise.resolve(releasesWithPackage.map((release) => ({
		...release,
		changelog: null
	})));
	let getChangelogFuncs = {
		getReleaseLine: () => Promise.resolve(""),
		getDependencyReleaseLine: () => Promise.resolve("")
	};
	const changelogOpts = config.changelog[1];
	const changesetPath = path.join(cwd, ".changeset");
	let changelogPath;
	try {
		changelogPath = importResolveFromDir(config.changelog[0], changesetPath);
	} catch {
		changelogPath = importResolveFromDir(config.changelog[0], contextDir);
	}
	let possibleChangelogFunc = await import(changelogPath);
	if (possibleChangelogFunc.default) {
		possibleChangelogFunc = possibleChangelogFunc.default;
		if (possibleChangelogFunc.default) possibleChangelogFunc = possibleChangelogFunc.default;
	}
	if (typeof possibleChangelogFunc.getReleaseLine === "function" && typeof possibleChangelogFunc.getDependencyReleaseLine === "function") getChangelogFuncs = possibleChangelogFunc;
	else throw new Error("Could not resolve changelog generation functions");
	const commits = await getCommitsThatAddChangesets(changesets.map((cs) => cs.id), cwd);
	const moddedChangesets = changesets.map((cs, i) => ({
		...cs,
		commit: commits[i]
	}));
	return Promise.all(releasesWithPackage.map(async (release) => {
		const changelog = await getChangelogEntry(cwd, release, releasesWithPackage, moddedChangesets, getChangelogFuncs, changelogOpts, {
			updateInternalDependencies: config.updateInternalDependencies,
			onlyUpdatePeerDependentsWhenOutOfRange: config.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH.onlyUpdatePeerDependentsWhenOutOfRange
		});
		return {
			...release,
			changelog
		};
	})).catch((e) => {
		console.error("The following error was encountered while generating changelog entries");
		console.error("We have escaped applying the changesets, and no files should have been affected");
		throw e;
	});
}
async function updateChangelog(changelogPath, changelog, name) {
	const templateString = `\n\n${changelog.trim()}\n`;
	let fileData;
	try {
		fileData = (await fs.readFile(changelogPath)).toString();
	} catch (err) {
		if (err?.code !== "ENOENT") throw err;
		await fs.writeFile(changelogPath, `# ${name}${templateString}`);
		return;
	}
	if (!fileData) {
		const completelyNewChangelog = `# ${name}${templateString}`;
		await fs.writeFile(changelogPath, completelyNewChangelog);
		return;
	}
	const isVersionHeading = /^#{1,6}\s+\d+\.\d+/.test(fileData);
	let newChangelog;
	if (isVersionHeading) newChangelog = templateString.trimStart() + fileData;
	else {
		const index = fileData.indexOf("\n");
		newChangelog = index === -1 ? fileData + templateString : fileData.slice(0, index) + templateString + fileData.slice(index + 1);
	}
	await fs.writeFile(changelogPath, newChangelog);
}
/** @deprecated Use named export `applyReleasePlan` instead */
const applyReleasePlanDefault = applyReleasePlan;
//#endregion
export { applyReleasePlan, applyReleasePlanDefault as default };
