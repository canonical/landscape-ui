import { t as src_default } from "./src.mjs";
import { t as readConfig } from "./read-config.mjs";
import { t as getVersionableChangedPackages } from "./versionablePackages.mjs";
import { t as ensureChangesetFolder } from "./shared.mjs";
import { ExitError } from "@changesets/errors";
import { log } from "@clack/prompts";
import path from "node:path";
import { getPackages } from "@manypkg/get-packages";
import fs from "node:fs/promises";
import { readPreState } from "@changesets/pre";
import { assembleReleasePlan } from "@changesets/assemble-release-plan";
import { readChangesets } from "@changesets/read";
//#region src/commands/status/index.ts
async function status(options) {
	const cwd = options?.cwd ?? process.cwd();
	const packages = await getPackages(cwd);
	await ensureChangesetFolder(packages.rootDir);
	const config = await readConfig(packages);
	const preState = await readPreState(packages.rootDir);
	const releasePlan = assembleReleasePlan(await readChangesets(packages.rootDir, options?.since), packages, config, preState);
	if ((await getVersionableChangedPackages(config, {
		cwd: packages.rootDir,
		ref: options?.since
	})).length > 0 && releasePlan.changesets.length === 0) {
		log.error(`
Some packages have been changed but no changesets were found. Run ${src_default.cyan("changeset add")} to resolve this error.
If this change doesn't need a release, run ${src_default.cyan("changeset add --empty")}.
      `.trim());
		throw new ExitError(1);
	}
	if (options?.output) {
		await fs.writeFile(path.resolve(cwd, options.output), JSON.stringify(releasePlan, void 0, 2));
		return;
	}
	printStatus(releasePlan.releases.toSorted((a, b) => a.name.localeCompare(b.name)), options?.verbose);
	return releasePlan;
}
function printStatus(releases, verbose) {
	log.info(`
Packages to be bumped:
${printPackageList(releases, verbose)}
    `.trim());
}
const typeColors = {
	major: src_default.red,
	minor: src_default.green,
	patch: src_default.blue
};
function printPackageList(releases, verbose) {
	const majors = releases.filter((r) => r.type === "major");
	const minors = releases.filter((r) => r.type === "minor");
	const patches = releases.filter((r) => r.type === "patch");
	return [
		["major", majors],
		["minor", minors],
		["patch", patches]
	].map(([type, releases]) => {
		if (releases.length === 0) return "";
		const lines = [`- ${typeColors[type](type)}`];
		releases.forEach(({ name, newVersion, changesets }) => {
			const addedLineIndex = lines.push(`  - ${src_default.cyan(name)}`) - 1;
			if (verbose) {
				lines[addedLineIndex] += ` -> ${src_default.green(newVersion)}`;
				lines.push(...changesets.map((changeset) => `    - ${src_default.blue(`.changeset/${changeset}.md`)}`));
			}
		});
		return lines.flat().join("\n").trim();
	}).join("\n").trim();
}
//#endregion
export { status };
