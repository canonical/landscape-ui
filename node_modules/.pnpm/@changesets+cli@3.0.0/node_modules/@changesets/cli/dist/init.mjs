import { t as src_default } from "./src.mjs";
import { i as askQuestion, n as askList, t as askConfirm } from "./cli-utilities.mjs";
import { log } from "@clack/prompts";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getPackages } from "@manypkg/get-packages";
import { defaultWrittenConfig } from "@changesets/config";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
//#region src/commands/init/index.ts
const pkgPath = path.dirname(fileURLToPath(import.meta.resolve("@changesets/cli/package.json")));
async function getInteractiveConfig() {
	const config = { ...defaultWrittenConfig };
	if (await askConfirm("Should the GitHub integration be used for changelogs?", false)) config.changelog = ["@changesets/changelog-github", { repo: await askQuestion("What is the GitHub repository? (e.g. org/repo)", {
		placeholder: "org/repo",
		notEmpty: true
	}) }];
	else config.changelog = "@changesets/cli/changelog";
	config.commit = await askConfirm("Should changeset files and version bumps be automatically committed?", false);
	config.access = await askList("Should packages be published publicly or privately by default?", [{
		label: "Private",
		value: "restricted"
	}, {
		label: "Public",
		value: "public"
	}]);
	config.baseBranch = await askQuestion("Which base branch should be used?", { placeholder: "main" }) || "main";
	const priorityOrder = [
		"$schema",
		"baseBranch",
		"access",
		"format",
		"changelog",
		"commit",
		"ignore",
		"fixed",
		"linked",
		"updateInternalDependencies"
	];
	const sortedConfig = {};
	for (const key of priorityOrder) if (key in config) sortedConfig[key] = config[key];
	for (const key of Object.keys(config)) if (!(key in sortedConfig)) sortedConfig[key] = config[key];
	return `${JSON.stringify(sortedConfig, null, 2)}\n`;
}
async function init(options) {
	const packages = await getPackages(options?.cwd ?? process.cwd());
	const changesetBase = path.resolve(packages.rootDir, ".changeset");
	if (existsSync(path.join(changesetBase, "config.json"))) {
		log.success(`
${src_default.green("Changesets")} has already been initialized.
Changeset commands can be run with no problems.
      `.trim());
		return;
	}
	log.info(`A new ${src_default.blue("Changeset")} configuration is being initialized...\n`);
	if (!existsSync(changesetBase)) await fs.mkdir(changesetBase, { recursive: true });
	const newConfigStr = await getInteractiveConfig();
	await fs.writeFile(path.resolve(changesetBase, "config.json"), newConfigStr);
	if (!existsSync(path.join(changesetBase, "README.md"))) await fs.copyFile(path.resolve(pkgPath, "./default-files/README.md"), path.resolve(changesetBase, "README.md"));
	log.success(`
${src_default.green("Changesets")} initialization is complete.
The ${src_default.blue(".changeset")} folder has been updated with:
- ${src_default.blue("config.json")} (customized based on the provided preferences)
- ${src_default.blue("README.md")} (a quick guide for using changesets)
    `.trim());
}
//#endregion
export { init };
