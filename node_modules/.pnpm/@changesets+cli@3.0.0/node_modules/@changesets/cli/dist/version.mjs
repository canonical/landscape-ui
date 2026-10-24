import { t as src_default } from "./src.mjs";
import { t as getCommitFunctions } from "./getCommitFunctions.mjs";
import { a as importantWarning } from "./cli-utilities.mjs";
import { t as readConfig } from "./read-config.mjs";
import { t as ensureChangesetFolder } from "./shared.mjs";
import { ExitError } from "@changesets/errors";
import { log } from "@clack/prompts";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as git from "@changesets/git";
import { shouldSkipPackage } from "@changesets/should-skip-package";
import { getPackages } from "@manypkg/get-packages";
import { getDependentsGraph } from "@changesets/get-dependents-graph";
import { readPreState } from "@changesets/pre";
import { assembleReleasePlan } from "@changesets/assemble-release-plan";
import { readChangesets } from "@changesets/read";
import { applyReleasePlan } from "@changesets/apply-release-plan";
//#region src/commands/version/index.ts
async function version(options) {
	const cwd = options.cwd ?? process.cwd();
	const packages = await getPackages(cwd);
	await ensureChangesetFolder(packages.rootDir);
	const config = await readConfig(packages);
	const messages = [];
	let ignore;
	if (options.ignore != null) if (config.ignore.length > 0) messages.push("It looks like you are trying to use the `--ignore` option while ignore is defined in the config file. This is currently not allowed, you can only use one of them at a time.");
	else ignore = options.ignore;
	const releaseConfig = {
		...config,
		ignore: ignore ?? config.ignore,
		snapshot: {
			...config.snapshot,
			prereleaseTemplate: options.snapshotPrereleaseTemplate ?? config.snapshot.prereleaseTemplate
		},
		commit: options.snapshot ? false : config.commit
	};
	validateIgnoredPackageNames(packages, options.ignore, messages);
	validateSkippedDependents(packages, releaseConfig, messages);
	if (messages.length > 0) {
		log.error(messages.join("\n"));
		throw new ExitError(1);
	}
	const [changesets, preState] = await Promise.all([readChangesets(cwd), readPreState(cwd)]);
	if (preState?.mode === "pre") if (options.snapshot != null) {
		log.error(`
Snapshot release is not allowed in pre mode.
To resolve this exit the pre mode by running ${src_default.cyan("changeset pre exit")}.
        `.trim());
		throw new ExitError(1);
	} else importantWarning(`
You are in prerelease mode!
If you meant to do a normal release you should revert these changes and run ${src_default.cyan("changeset pre exit")}.
You can then run ${src_default.cyan("changeset version")} again to do a normal release.
        `);
	if (changesets.length === 0 && (preState == null || preState.mode !== "exit")) {
		log.warn("No unreleased changesets found.");
		throw new ExitError(1);
	}
	const releasePlan = assembleReleasePlan(changesets, packages, releaseConfig, preState, options.snapshot ? {
		tag: options.snapshot === true ? void 0 : options.snapshot,
		commit: ["{commit}", "{commit-short}"].some((placeholder) => releaseConfig.snapshot.prereleaseTemplate?.includes(placeholder)) ? await git.getCurrentCommitId({ cwd }) : void 0
	} : void 0);
	const contextDir = path.dirname(fileURLToPath(import.meta.url));
	const [ ...touchedFiles] = await applyReleasePlan(releasePlan, packages, releaseConfig, options.snapshot, contextDir);
	const [{ getVersionMessage }, commitOpts] = await getCommitFunctions(releaseConfig.commit, cwd, contextDir);
	if (getVersionMessage) {
		let touchedFile;
		while (touchedFile = touchedFiles.shift()) await git.add(path.relative(cwd, touchedFile), cwd);
		if (!await git.commit(await getVersionMessage(releasePlan, commitOpts), cwd)) log.error("Changesets ran into trouble committing your files");
		else log.success("All files have been updated and committed. You're ready to publish!");
	} else log.success("All files have been updated. Review them and commit at your leisure");
}
function validateIgnoredPackageNames(packages, ignoreFromCli, messages) {
	if (!ignoreFromCli) return;
	const pkgNames = new Set(packages.packages.map(({ packageJson }) => packageJson.name));
	for (const pkgName of ignoreFromCli) {
		if (pkgNames.has(pkgName)) continue;
		messages.push(`The package ${src_default.blue(pkgName)} is passed to the \`--ignore\` option but it is not found in the project. You may have misspelled the package name.`);
	}
}
function validateSkippedDependents(packages, config, messages) {
	const packagesByName = new Map(packages.packages.map((pkg) => [pkg.packageJson.name, pkg]));
	const dependentsGraph = getDependentsGraph(packages, {
		ignoreDevDependencies: true,
		bumpVersionsWithWorkspaceProtocolOnly: config.bumpVersionsWithWorkspaceProtocolOnly
	});
	for (const pkg of packages.packages) {
		if (!shouldSkipPackage(pkg, {
			ignore: config.ignore,
			allowPrivatePackages: config.privatePackages.version
		})) continue;
		const skippedPackage = pkg.packageJson.name;
		const dependents = dependentsGraph.get(skippedPackage) || [];
		for (const dependent of dependents) {
			const dependentPkg = packagesByName.get(dependent);
			if (dependentPkg.packageJson.private) continue;
			if (!shouldSkipPackage(dependentPkg, {
				ignore: config.ignore,
				allowPrivatePackages: config.privatePackages.version
			})) messages.push(`The package ${src_default.blue(dependent)} depends on the skipped package ${src_default.blue(skippedPackage)} (either by \`ignore\` option or by \`privatePackages.version\`), but ${src_default.blue(dependent)} is not being skipped. Please pass ${src_default.blue(dependent)} to the ${src_default.cyan("--ignore")} flag.`);
		}
	}
}
//#endregion
export { version };
