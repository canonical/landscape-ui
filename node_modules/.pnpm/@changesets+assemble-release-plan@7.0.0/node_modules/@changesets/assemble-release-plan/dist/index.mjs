import { InternalError } from "@changesets/errors";
import { getDependentsGraph } from "@changesets/get-dependents-graph";
import { shouldSkipPackage } from "@changesets/should-skip-package";
import semverParse from "semver/functions/parse.js";
import semverGt from "semver/functions/gt.js";
import path from "node:path";
import semverSatisfies from "semver/functions/satisfies.js";
import validRange from "semver/ranges/valid.js";
import semverInc from "semver/functions/inc.js";
//#region src/utils.ts
function getHighestReleaseType(releases) {
	if (releases.length === 0) throw new Error(`Large internal Changesets error when calculating highest release type in the set of releases. Please contact the maintainers`);
	let highestReleaseType = "none";
	for (const release of releases) switch (release.type) {
		case "major": return "major";
		case "minor":
			highestReleaseType = "minor";
			break;
		case "patch":
			if (highestReleaseType === "none") highestReleaseType = "patch";
			break;
	}
	return highestReleaseType;
}
function getCurrentHighestVersion(packageGroup, packagesByName) {
	let highestVersion;
	for (const pkgName of packageGroup) {
		const pkg = mapGetOrThrowInternal(packagesByName, pkgName, `We were unable to version for package group: ${pkgName} in package group: ${packageGroup.toString()}`);
		if (highestVersion == null || semverGt(pkg.packageJson.version, highestVersion)) highestVersion = pkg.packageJson.version;
	}
	return highestVersion;
}
function mapGetOrThrow(map, key, errorMessage) {
	const value = map.get(key);
	if (value == null) throw new Error(errorMessage);
	return value;
}
function mapGetOrThrowInternal(map, key, errorMessage) {
	const value = map.get(key);
	if (value == null) throw new InternalError(errorMessage);
	return value;
}
//#endregion
//#region src/apply-links.ts
function applyLinks(releases, packagesByName, linked) {
	let updated = false;
	for (const linkedPackages of linked) {
		const releasingLinkedPackages = [...releases.values()].filter((release) => linkedPackages.includes(release.name) && release.type !== "none");
		if (releasingLinkedPackages.length === 0) continue;
		const highestReleaseType = getHighestReleaseType(releasingLinkedPackages);
		const highestVersion = getCurrentHighestVersion(linkedPackages, packagesByName);
		for (const linkedPackage of releasingLinkedPackages) {
			if (linkedPackage.type !== highestReleaseType) {
				updated = true;
				linkedPackage.type = highestReleaseType;
			}
			if (linkedPackage.oldVersion !== highestVersion) {
				updated = true;
				linkedPackage.oldVersion = highestVersion;
			}
		}
	}
	return updated;
}
//#endregion
//#region src/increment.ts
function incrementVersion(release, preInfo) {
	if (release.type === "none") return release.oldVersion;
	let version = semverInc(release.oldVersion, release.type);
	if (preInfo != null && preInfo.state.mode !== "exit") {
		const preVersion = mapGetOrThrowInternal(preInfo.preVersions, release.name, `preVersion for ${release.name} does not exist when preState is defined`);
		version += `-${preInfo.state.tag}.${preVersion}`;
	}
	return version;
}
//#endregion
//#region src/determine-dependents.ts
function determineDependents({ releases, packagesByName, rootDir, dependencyGraph, preInfo, config }) {
	let updated = false;
	const pkgsToSearch = [...releases.values()];
	while (pkgsToSearch.length > 0) {
		const nextRelease = pkgsToSearch.shift();
		if (!nextRelease) continue;
		mapGetOrThrowInternal(dependencyGraph, nextRelease.name, `Error in determining dependents - could not find package in repository: ${nextRelease.name}`).map((dependent) => {
			let type;
			const dependentPackage = mapGetOrThrowInternal(packagesByName, dependent, "Dependency map is incorrect");
			if (shouldSkipPackage(dependentPackage, {
				ignore: config.ignore,
				allowPrivatePackages: config.privatePackages.version
			})) type = "none";
			else {
				const dependencyPackage = mapGetOrThrowInternal(packagesByName, nextRelease.name, "Dependency map is incorrect");
				const dependencyVersionRanges = getDependencyVersionRanges(rootDir, dependentPackage.packageJson, nextRelease, dependencyPackage);
				for (const { depType, versionRange } of dependencyVersionRanges) if (nextRelease.type === "none") continue;
				else if ((!releases.has(dependent) || releases.get(dependent).type === "none") && (config.___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH.updateInternalDependents === "always" || !semverSatisfies(incrementVersion(nextRelease, preInfo), versionRange))) switch (depType) {
					case "dependencies":
					case "optionalDependencies":
					case "peerDependencies":
						if (type !== "major" && type !== "minor") type = "patch";
						break;
					case "devDependencies": if (type !== "major" && type !== "minor" && type !== "patch") type = "none";
				}
			}
			if (releases.has(dependent) && releases.get(dependent).type === type) type = void 0;
			return {
				name: dependent,
				type,
				pkgJSON: dependentPackage.packageJson
			};
		}).filter((dependentItem) => !!dependentItem.type).forEach(({ name, type, pkgJSON }) => {
			updated = true;
			const existing = releases.get(name);
			if (existing && type === "major" && existing.type !== "major") {
				existing.type = "major";
				pkgsToSearch.push(existing);
			} else {
				const newDependent = {
					name,
					type,
					oldVersion: pkgJSON.version,
					changesets: []
				};
				pkgsToSearch.push(newDependent);
				releases.set(name, newDependent);
			}
		});
	}
	return updated;
}
function getDependencyVersionRanges(rootDir, dependentPkgJSON, dependencyRelease, dependencyPackage) {
	const DEPENDENCY_TYPES = [
		"dependencies",
		"devDependencies",
		"peerDependencies",
		"optionalDependencies"
	];
	const dependencyVersionRanges = [];
	for (const type of DEPENDENCY_TYPES) {
		let versionRange = dependentPkgJSON[type]?.[dependencyRelease.name];
		if (!versionRange) continue;
		if (versionRange.startsWith("workspace:")) {
			versionRange = versionRange.replace(/^workspace:/, "");
			switch (versionRange) {
				case "*":
					versionRange = dependencyRelease.oldVersion;
					break;
				case "^":
				case "~":
					versionRange = `${versionRange}${dependencyRelease.oldVersion}`;
					break;
				default: if (!validRange(versionRange)) if (path.posix.normalize(versionRange) === path.relative(rootDir, dependencyPackage.dir).replace(/\\/g, "/")) versionRange = dependencyRelease.oldVersion;
				else continue;
			}
		}
		dependencyVersionRanges.push({
			depType: type,
			versionRange
		});
	}
	return dependencyVersionRanges;
}
//#endregion
//#region src/flatten-releases.ts
const changeTypes = {
	major: 3,
	minor: 2,
	patch: 1,
	none: 0
};
/**
* Flattens a list of changesets into a package->release-type map
*/
function flattenReleases(changesets, packagesByName, config) {
	const releases = /* @__PURE__ */ new Map();
	for (const changeset of changesets) for (const { name, type } of changeset.releases) {
		const pkg = mapGetOrThrowInternal(packagesByName, name, `Couldn't find package named "${name}" listed in changeset "${changeset.id}"`);
		if (shouldSkipPackage(pkg, {
			ignore: config.ignore,
			allowPrivatePackages: config.privatePackages.version
		})) continue;
		const release = releases.get(name);
		if (release == null) {
			releases.set(name, {
				name,
				type,
				oldVersion: pkg.packageJson.version,
				changesets: [changeset.id]
			});
			continue;
		}
		if (changeTypes[type] > changeTypes[release.type]) release.type = type;
		release.changesets.push(changeset.id);
	}
	return releases;
}
//#endregion
//#region src/match-fixed-constraint.ts
function matchFixedConstraint(releases, packagesByName, config) {
	let updated = false;
	for (const fixedPackages of config.fixed) {
		const releasingFixedPackages = [...releases.values()].filter((release) => fixedPackages.includes(release.name) && release.type !== "none");
		if (releasingFixedPackages.length === 0) continue;
		const highestReleaseType = getHighestReleaseType(releasingFixedPackages);
		const highestVersion = getCurrentHighestVersion(fixedPackages, packagesByName);
		for (const pkgName of fixedPackages) {
			if (shouldSkipPackage(mapGetOrThrowInternal(packagesByName, pkgName, `Could not find package named "${pkgName}" listed in fixed group ${JSON.stringify(fixedPackages)}`), {
				ignore: config.ignore,
				allowPrivatePackages: config.privatePackages.version
			})) continue;
			const release = releases.get(pkgName);
			if (!release) {
				updated = true;
				releases.set(pkgName, {
					name: pkgName,
					type: highestReleaseType,
					oldVersion: highestVersion,
					changesets: []
				});
				continue;
			}
			if (release.type !== highestReleaseType) {
				updated = true;
				release.type = highestReleaseType;
			}
			if (release.oldVersion !== highestVersion) {
				updated = true;
				release.oldVersion = highestVersion;
			}
		}
	}
	return updated;
}
//#endregion
//#region src/index.ts
function getPreVersion(version) {
	let preVersion = semverParse(version).prerelease[1] ?? -1;
	if (typeof preVersion !== "number") throw new InternalError("preVersion is not a number");
	preVersion++;
	return preVersion;
}
function getSnapshotSuffix(template, snapshotParameters) {
	const snapshotRefDate = /* @__PURE__ */ new Date();
	const placeholderValues = {
		commit: snapshotParameters.commit,
		"commit-short": snapshotParameters.commit?.slice(0, 7),
		tag: snapshotParameters.tag,
		timestamp: snapshotRefDate.getTime().toString(),
		datetime: snapshotRefDate.toISOString().replace(/\.\d{3}Z$/, "").replace(/[^\d]/g, "")
	};
	if (!template) return [placeholderValues.tag, placeholderValues.datetime].filter(Boolean).join("-");
	const placeholders = Object.keys(placeholderValues);
	if (!template.includes(`{tag}`) && placeholderValues.tag != null) throw new Error(`Failed to compose snapshot version: "{tag}" placeholder is missing, but the snapshot parameter is defined (value: '${placeholderValues.tag}')`);
	return placeholders.reduce((prev, key) => {
		return prev.replace(new RegExp(`\\{${key}\\}`, "g"), () => {
			const value = placeholderValues[key];
			if (value == null) throw new Error(`Failed to compose snapshot version: "{${key}}" placeholder is used without having a value defined!`);
			return value;
		});
	}, template);
}
function getSnapshotVersion(release, preInfo, useCalculatedVersion, snapshotSuffix) {
	if (release.type === "none") return release.oldVersion;
	return `${useCalculatedVersion ? incrementVersion(release, preInfo) : `0.0.0`}-${snapshotSuffix}`;
}
function getNewVersion(release, preInfo) {
	if (release.type === "none") return release.oldVersion;
	return incrementVersion(release, preInfo);
}
function assembleReleasePlan(changesets, packages, config, preState, snapshot) {
	const packagesByName = new Map(packages.packages.map((x) => [x.packageJson.name, x]));
	const relevantChangesets = getRelevantChangesets(changesets, packagesByName, config, preState);
	const preInfo = getPreInfo(packagesByName, config, preState);
	const releases = flattenReleases(relevantChangesets, packagesByName, config);
	const dependencyGraph = getDependentsGraph(packages, { bumpVersionsWithWorkspaceProtocolOnly: config.bumpVersionsWithWorkspaceProtocolOnly });
	let releasesValidated = false;
	while (releasesValidated === false) {
		const dependentAdded = determineDependents({
			releases,
			packagesByName,
			rootDir: packages.rootDir,
			dependencyGraph,
			preInfo,
			config
		});
		const fixedConstraintUpdated = matchFixedConstraint(releases, packagesByName, config);
		releasesValidated = !applyLinks(releases, packagesByName, config.linked) && !dependentAdded && !fixedConstraintUpdated;
	}
	if (preInfo?.state.mode === "exit") for (const pkg of packages.packages) {
		if (shouldSkipPackage(pkg, {
			ignore: config.ignore,
			allowPrivatePackages: config.privatePackages.version
		})) continue;
		const preVersion = preInfo.preVersions.get(pkg.packageJson.name);
		if (preVersion != null && preVersion !== 0) {
			const existingRelease = releases.get(pkg.packageJson.name);
			if (!existingRelease) releases.set(pkg.packageJson.name, {
				name: pkg.packageJson.name,
				type: "patch",
				oldVersion: pkg.packageJson.version,
				changesets: []
			});
			else if (existingRelease.type === "none") existingRelease.type = "patch";
		}
	}
	const snapshotSuffix = snapshot && getSnapshotSuffix(config.snapshot.prereleaseTemplate, snapshot);
	return {
		changesets: relevantChangesets,
		releases: Array.from(releases.values(), (incompleteRelease) => {
			return {
				...incompleteRelease,
				newVersion: snapshotSuffix ? getSnapshotVersion(incompleteRelease, preInfo, config.snapshot.useCalculatedVersion, snapshotSuffix) : getNewVersion(incompleteRelease, preInfo)
			};
		}),
		preState: preInfo?.state
	};
}
function getRelevantChangesets(changesets, packagesByName, config, preState) {
	for (const changeset of changesets) {
		const skippedPackages = [];
		const notSkippedPackages = [];
		for (const release of changeset.releases) if (shouldSkipPackage(mapGetOrThrow(packagesByName, release.name, `Found changeset ${changeset.id} for package ${release.name} which is not in the workspace`), {
			ignore: config.ignore,
			allowPrivatePackages: config.privatePackages.version
		})) skippedPackages.push(release.name);
		else notSkippedPackages.push(release.name);
		if (skippedPackages.length > 0 && notSkippedPackages.length > 0) throw new Error(`Found mixed changeset ${changeset.id}\nFound ignored packages: ${skippedPackages.join(" ")}\nFound not ignored packages: ${notSkippedPackages.join(" ")}\nMixed changesets that contain both ignored and not ignored packages are not allowed`);
	}
	if (preState && preState.mode !== "exit") return changesets.filter((changeset) => !changeset.id.startsWith("pre/"));
	return changesets;
}
function getHighestPreVersion(groupKind, packageGroup, packagesByName) {
	let highestPreVersion = 0;
	for (const pkgName of packageGroup) {
		const pkg = mapGetOrThrowInternal(packagesByName, pkgName, `Could not find package named "${pkgName}" listed in ${groupKind} group ${JSON.stringify(packageGroup)}`);
		highestPreVersion = Math.max(getPreVersion(pkg.packageJson.version), highestPreVersion);
	}
	return highestPreVersion;
}
function getPreInfo(packagesByName, config, preState) {
	if (preState == null) return;
	const preVersions = /* @__PURE__ */ new Map();
	for (const [, pkg] of packagesByName) {
		if (shouldSkipPackage(pkg, {
			ignore: config.ignore,
			allowPrivatePackages: config.privatePackages.version
		})) continue;
		preVersions.set(pkg.packageJson.name, getPreVersion(pkg.packageJson.version));
	}
	for (const fixedGroup of config.fixed) {
		const highestPreVersion = getHighestPreVersion("fixed", fixedGroup, packagesByName);
		for (const fixedPackage of fixedGroup) preVersions.set(fixedPackage, highestPreVersion);
	}
	for (const linkedGroup of config.linked) {
		const highestPreVersion = getHighestPreVersion("linked", linkedGroup, packagesByName);
		for (const linkedPackage of linkedGroup) preVersions.set(linkedPackage, highestPreVersion);
	}
	return {
		state: preState,
		preVersions
	};
}
/** @deprecated Use named export `assembleReleasePlan` instead */
const assembleReleasePlanDefault = assembleReleasePlan;
//#endregion
export { assembleReleasePlan, assembleReleasePlanDefault as default };
