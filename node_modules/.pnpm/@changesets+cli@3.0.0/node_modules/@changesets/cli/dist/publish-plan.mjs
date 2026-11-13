import { t as getPublishPlan } from "./getPublishPlan.mjs";
import { t as readConfig } from "./read-config.mjs";
import { t as ensureChangesetFolder } from "./shared.mjs";
import { log } from "@clack/prompts";
import path from "node:path";
import { getPackages } from "@manypkg/get-packages";
import fs from "node:fs/promises";
//#region src/commands/publish-plan/index.ts
async function publishPlan(options) {
	const cwd = options?.cwd ?? process.cwd();
	const packages = await getPackages(cwd);
	await ensureChangesetFolder(packages.rootDir);
	const config = await readConfig(packages);
	const plan = await getPublishPlan(packages.rootDir, config, { tag: options?.tag });
	const entries = plan.flat();
	const releases = entries.filter((release) => release.kind === "publish");
	const tagReleases = entries.filter((release) => release.kind === "tag-only");
	if (options?.output) {
		const outputPath = path.resolve(cwd, options.output);
		await fs.mkdir(path.dirname(outputPath), { recursive: true });
		await fs.writeFile(path.resolve(cwd, options.output), JSON.stringify({
			version: 1,
			plan
		}, void 0, 2));
		return plan;
	}
	if (releases.length === 0 && tagReleases.length === 0) {
		log.info("No projects to publish or tag.");
		return [];
	}
	if (releases.length > 0) log.info(`
Packages to publish:
${releases.map((release) => `- ${release.name}@${release.version} (${release.tag})`).join("\n")}
      `.trim());
	if (tagReleases.length > 0) log.info(`
Packages to tag:
${tagReleases.map((release) => `- ${release.name}@${release.version}`).join("\n")}
      `.trim());
	return plan;
}
//#endregion
export { publishPlan };
