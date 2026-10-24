import { t as src_default } from "./src.mjs";
import { t as getCommitFunctions } from "./getCommitFunctions.mjs";
import { a as importantWarning, i as askQuestion, n as askList, r as askMultiselect, t as askConfirm } from "./cli-utilities.mjs";
import { t as readConfig } from "./read-config.mjs";
import { t as getVersionableChangedPackages } from "./versionablePackages.mjs";
import { t as ensureChangesetFolder } from "./shared.mjs";
import { ExitError, InternalError } from "@changesets/errors";
import { confirm, isCancel, log, note } from "@clack/prompts";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as git from "@changesets/git";
import { shouldSkipPackage } from "@changesets/should-skip-package";
import { writeChangeset } from "@changesets/write";
import { getPackages } from "@manypkg/get-packages";
import launchEditor from "launch-editor";
import fs from "node:fs/promises";
import semverLt from "semver/functions/lt.js";
import { tmpdir } from "node:os";
//#region src/utils/askWithEditor.ts
async function askWithEditor(initialContents = "") {
	const tmpDir = await fs.mkdtemp(tmpdir());
	const tmpFile = path.join(tmpDir, "changeset.md");
	await fs.writeFile(tmpFile, initialContents);
	launchEditor(tmpFile);
	const done = await confirm({
		message: "Opening external editor...",
		active: "Continue",
		inactive: "Cancel",
		initialValue: true
	});
	if (!done || isCancel(done)) {
		await fs.rm(tmpDir, { recursive: true });
		return "";
	}
	const contents = await fs.readFile(tmpFile, "utf8");
	await fs.rm(tmpDir, { recursive: true });
	return contents.replace(/^#.*\n?/gm, "").replace(/\n+$/g, "").trim();
}
//#endregion
//#region src/commands/add/createChangeset.ts
async function confirmMajorRelease({ name, version }) {
	if (semverLt(version, "1.0.0")) {
		importantWarning(`
The ${src_default.red("major")} version of ${src_default.blue(name)} will be its ${src_default.red("first major release")} (1.0.0).
If you are unsure if this is correct, contact the package's maintainers ${src_default.red("before committing this changeset")}.
      `);
		return askConfirm(`Are you sure you want to release the ${src_default.red("first major version")} of ${src_default.blue(name)}?`);
	}
	return true;
}
async function getPackagesToRelease(changedPackages, allPackages) {
	if (allPackages.length <= 1) throw new InternalError("getPackagesToRelease should not be called if there is only one package");
	const allSortedPackages = allPackages.toSorted((a, b) => a.packageJson.name.localeCompare(b.packageJson.name));
	const changedPackagesList = [];
	const unchangedPackagesList = [];
	for (const { packageJson } of allSortedPackages) {
		const pkgName = packageJson.name;
		(changedPackages.includes(pkgName) ? changedPackagesList : unchangedPackagesList).push({
			label: pkgName + (packageJson.private ? " (private)" : ""),
			value: pkgName
		});
	}
	const multiselectValues = {};
	if (changedPackagesList.length > 0) multiselectValues["changed packages"] = changedPackagesList;
	if (unchangedPackagesList.length > 0) multiselectValues["unchanged packages"] = unchangedPackagesList;
	return await askMultiselect("Which packages were affected by the changes you made?", multiselectValues, { required: true });
}
function getPkgJsonsByName(packages) {
	return new Map(packages.map(({ packageJson }) => [packageJson.name, packageJson]));
}
function formatPkgNameAndVersion(pkgName, version) {
	return `${src_default.bold(pkgName)}@${src_default.bold(version)}`;
}
function validateSelectedPackageNames(pkgNames, optionsFromCli, messages) {
	for (const [flag, packageNamesFromCli] of [
		["--major", optionsFromCli?.major],
		["--minor", optionsFromCli?.minor],
		["--patch", optionsFromCli?.patch]
	]) for (const pkgName of packageNamesFromCli ?? []) {
		if (pkgNames.has(pkgName)) continue;
		messages.push(`The package ${src_default.blue(pkgName)} is passed to the \`${flag}\` option but it is not found in the project. You may have misspelled the package name.`);
	}
}
function validateDuplicatePackageNames(pkgNames, optionsFromCli, messages) {
	const major = new Set(optionsFromCli?.major).intersection(pkgNames);
	const minor = new Set(optionsFromCli?.minor).intersection(pkgNames);
	const patch = new Set(optionsFromCli?.patch).intersection(pkgNames);
	const duplicates = major.intersection(minor).union(major.intersection(patch)).union(minor.intersection(patch));
	for (const pkgName of duplicates) {
		const flags = [
			major.has(pkgName) && "--major",
			minor.has(pkgName) && "--minor",
			patch.has(pkgName) && "--patch"
		].filter((flag) => flag !== false);
		messages.push(`The package ${src_default.blue(pkgName)} is passed to multiple release type options: ${flags.map((flag) => `\`${flag}\``).join(", ")}. Please select only one release type for this package.`);
	}
}
async function createChangeset(changedPackages, allPackages, optionsFromCli) {
	const releases = [];
	if (optionsFromCli?.major || optionsFromCli?.minor || optionsFromCli?.patch) {
		const pkgNames = new Set(allPackages.map(({ packageJson }) => packageJson.name));
		const messages = [];
		validateSelectedPackageNames(pkgNames, optionsFromCli, messages);
		validateDuplicatePackageNames(pkgNames, optionsFromCli, messages);
		if (messages.length > 0) {
			log.error(messages.join("\n"));
			throw new ExitError(1);
		}
		for (const [type, packageNamesFromCli] of [
			["major", optionsFromCli?.major],
			["minor", optionsFromCli?.minor],
			["patch", optionsFromCli?.patch]
		]) for (const pkgName of packageNamesFromCli ?? []) releases.push({
			name: pkgName,
			type
		});
	} else if (allPackages.length > 1) {
		const packagesToRelease = await getPackagesToRelease(changedPackages, allPackages);
		packagesToRelease.sort((a, b) => a.localeCompare(b));
		const pkgJsonsByName = getPkgJsonsByName(allPackages);
		const pkgsLeftToGetBumpTypeFor = new Set(packagesToRelease);
		const pkgsThatShouldBeMajorBumped = await askMultiselect(src_default.bold(`Which packages should have a ${src_default.red("major")} ${src_default.gray(`(${src_default.red("X")}.X.X)`)} bump?`), { "all packages": packagesToRelease.map((pkgName) => ({
			label: formatPkgNameAndVersion(pkgName, pkgJsonsByName.get(pkgName).version),
			value: pkgName
		})) });
		for (const pkgName of pkgsThatShouldBeMajorBumped) if (await confirmMajorRelease(pkgJsonsByName.get(pkgName))) {
			pkgsLeftToGetBumpTypeFor.delete(pkgName);
			releases.push({
				name: pkgName,
				type: "major"
			});
		}
		if (pkgsLeftToGetBumpTypeFor.size !== 0) {
			const pkgsThatShouldBeMinorBumped = await askMultiselect(src_default.bold(`Which packages should have a ${src_default.green("minor")} ${src_default.gray(`(X.${src_default.green("X")}.X)`)} bump?`), { "all packages": Array.from(pkgsLeftToGetBumpTypeFor, (pkgName) => ({
				label: formatPkgNameAndVersion(pkgName, pkgJsonsByName.get(pkgName).version),
				value: pkgName
			})) });
			for (const pkgName of pkgsThatShouldBeMinorBumped) {
				pkgsLeftToGetBumpTypeFor.delete(pkgName);
				releases.push({
					name: pkgName,
					type: "minor"
				});
			}
		}
		if (pkgsLeftToGetBumpTypeFor.size !== 0) {
			const patchBumpedPackages = Array.from(pkgsLeftToGetBumpTypeFor, (pkgName) => formatPkgNameAndVersion(pkgName, pkgJsonsByName.get(pkgName).version));
			log.info(`
The following packages will be ${src_default.blue("patch")} ${src_default.gray(`(X.X.${src_default.blue("X")})`)} bumped:
${src_default.gray(patchBumpedPackages.join(", "))}
        `.trim());
			for (const pkgName of pkgsLeftToGetBumpTypeFor) releases.push({
				name: pkgName,
				type: "patch"
			});
		}
	} else {
		const pkg = allPackages[0];
		const type = await askList(`What kind of change is this for ${src_default.blue(pkg.packageJson.name)}? ${src_default.gray(`(current version is ${pkg.packageJson.version})`)}`, [
			{
				value: "patch",
				label: `patch ${src_default.gray(`(X.X.${src_default.blue("X")})`)}`
			},
			{
				value: "minor",
				label: `minor ${src_default.gray(`(X.${src_default.green("X")}.X)`)}`
			},
			{
				value: "major",
				label: `major ${src_default.gray(`(${src_default.red("X")}.X.X)`)}`
			}
		]);
		if (type === "major") {
			if (!await confirmMajorRelease(pkg.packageJson)) throw new ExitError(1);
		}
		releases.push({
			name: pkg.packageJson.name,
			type
		});
	}
	if (optionsFromCli?.message != null) return {
		summary: optionsFromCli.message,
		releases
	};
	let summary = await askQuestion("Please enter a summary for this change (this will be in the changelogs).", { placeholder: "  (submit nothing to open an external editor)" });
	if (summary.length === 0) {
		try {
			summary = await askWithEditor("\n\n# Please enter a summary for your changes.\n# An empty message aborts the editor.");
			if (summary.length > 0) return {
				summary,
				releases
			};
		} catch {
			summary = await askQuestion(`${src_default.red("An error happened using external editor. Please type your summary here:")}`, { notEmpty: true });
		}
		summary ||= await askQuestion("Did not find a summary in the edited file. Please enter one:", { notEmpty: true });
	}
	return {
		summary,
		releases
	};
}
//#endregion
//#region src/commands/add/messages.ts
function printConfirmationMessage(changeset, repoHasMultiplePackages) {
	function getReleasesOfType(type) {
		return changeset.releases.filter((release) => release.type === type).map((release) => release.name);
	}
	const majorReleases = getReleasesOfType("major");
	const minorReleases = getReleasesOfType("minor");
	const patchReleases = getReleasesOfType("patch");
	let msg = src_default.bold("Summary of changesets:");
	if (majorReleases.length > 0) msg += `\n${src_default.bold(src_default.red("major"))}:  ${majorReleases.join(", ")}`;
	if (minorReleases.length > 0) msg += `\n${src_default.bold(src_default.green("minor"))}:  ${minorReleases.join(", ")}`;
	if (patchReleases.length > 0) msg += `\n${src_default.bold(src_default.blue("patch"))}:  ${patchReleases.join(", ")}`;
	log.success(msg);
	if (repoHasMultiplePackages) note(`All packages that depend on these whose required versions will be incompatible will also be ${src_default.blue("patch")} bumped when this changeset is applied.`, "NOTE");
}
//#endregion
//#region src/commands/add/index.ts
async function add(options) {
	const packages = await getPackages(options?.cwd ?? process.cwd());
	await ensureChangesetFolder(packages.rootDir);
	if (packages.packages.length === 0) {
		log.error(`No packages found. You might have ${packages.tool.type} workspaces configured but no packages yet?`);
		throw new ExitError(1);
	}
	const config = await readConfig(packages);
	const versionablePackages = packages.packages.filter((pkg) => !shouldSkipPackage(pkg, {
		ignore: config.ignore,
		allowPrivatePackages: config.privatePackages.version
	}));
	if (versionablePackages.length === 0) {
		log.error(`
No versionable packages found
  ${src_default.italic("Ensure the packages to version are not ignored by the config")}
  ${src_default.italic("Ensure that relevant package.json files have a `version` field")}
`.trim());
		throw new ExitError(1);
	}
	const changesetBase = path.resolve(packages.rootDir, ".changeset");
	let newChangeset;
	if (options?.empty) newChangeset = {
		releases: [],
		summary: options?.message ?? ""
	};
	else {
		let changedPackagesNames = [];
		try {
			changedPackagesNames = (await getVersionableChangedPackages(config, {
				cwd: packages.rootDir,
				ref: options?.since
			})).map((pkg) => pkg.packageJson.name);
		} catch (error) {
			log.warn(`
Failed to identify which packages have changed since the ${options?.since ? "ref" : "base branch"} due to an error:
${error.toString()}
`.trim());
		}
		newChangeset = await createChangeset(changedPackagesNames, versionablePackages, {
			message: options?.message,
			major: options?.major,
			minor: options?.minor,
			patch: options?.patch
		});
		printConfirmationMessage(newChangeset, versionablePackages.length > 1);
	}
	const changesetID = await writeChangeset(newChangeset, packages.rootDir, config);
	const [{ getAddMessage }, commitOpts] = await getCommitFunctions(config.commit, packages.rootDir, path.dirname(fileURLToPath(import.meta.url)));
	const finalLogMessageLines = [];
	if (getAddMessage) {
		await git.add(path.resolve(changesetBase, `${changesetID}.md`), packages.rootDir);
		await git.commit(await getAddMessage(newChangeset, commitOpts), packages.rootDir);
		finalLogMessageLines.push(src_default.green(`${options?.empty ? "Empty " : ""}Changeset added and committed!`));
	} else finalLogMessageLines.push(src_default.green(`${options?.empty ? "Empty " : ""}Changeset added - you can now commit it!`));
	if ([...newChangeset.releases].find((c) => c.type === "major")) importantWarning(`
This Changeset includes a major change and we STRONGLY recommend adding more information to the changeset:
  WHAT the breaking change is
  WHY the change was made
  HOW a consumer should update their code
        `);
	else finalLogMessageLines.push(src_default.green("If you want to modify or expand on the changeset summary, you can find it here:"));
	const changesetPath = path.relative(process.cwd(), path.join(changesetBase, `${changesetID}.md`));
	finalLogMessageLines.push(src_default.blue(changesetPath));
	log.success(finalLogMessageLines.join("\n"));
	if (options?.open) launchEditor(changesetPath);
}
//#endregion
export { add };
