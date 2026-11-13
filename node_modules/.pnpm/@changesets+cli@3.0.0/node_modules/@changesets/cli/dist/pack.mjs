import { n as readPlanFile, r as getPublishTool, s as createPromiseQueue, t as getPublishPlan } from "./getPublishPlan.mjs";
import { t as src_default } from "./src.mjs";
import { t as readConfig } from "./read-config.mjs";
import { t as ensureChangesetFolder } from "./shared.mjs";
import { ExitError } from "@changesets/errors";
import { log } from "@clack/prompts";
import path from "node:path";
import { getPackages } from "@manypkg/get-packages";
import fs from "node:fs/promises";
import os from "node:os";
import { createReadStream } from "node:fs";
import { createHash } from "node:crypto";
import { pipeline } from "node:stream/promises";
//#region src/utils/workspaceConcurrency.ts
const MAX_DEFAULT_WORKSPACE_CONCURRENCY = 4;
let availableParallelism;
function getAvailableParallelism() {
	return availableParallelism ??= Math.max(1, os.availableParallelism());
}
function getDefaultWorkspaceConcurrency() {
	return Math.min(MAX_DEFAULT_WORKSPACE_CONCURRENCY, getAvailableParallelism());
}
//#endregion
//#region src/commands/pack/index.ts
function getNormalizedTarballFilename(name, version) {
	return `${name.replace(/^@/, "").replace("/", "-")}-${version}.tgz`;
}
async function getIntegrity(filePath) {
	const hash = createHash("sha256");
	await pipeline(createReadStream(filePath), hash);
	return `sha256-${hash.digest("base64")}`;
}
async function pack(options) {
	const cwd = options.cwd ?? process.cwd();
	const packages = await getPackages(cwd);
	await ensureChangesetFolder(packages.rootDir);
	const config = await readConfig(packages);
	const plan = options.fromPublishPlan ? await readPlanFile(path.resolve(cwd, options.fromPublishPlan)) : await getPublishPlan(packages.rootDir, config);
	const outputDir = path.resolve(cwd, options.outDir);
	const packagesDir = path.join(outputDir, "packages");
	await fs.mkdir(packagesDir, { recursive: true });
	const releases = plan.flat().filter((release) => release.kind === "publish");
	const queue = createPromiseQueue(getDefaultWorkspaceConcurrency());
	const packagesByName = new Map(packages.packages.map((pkg) => [pkg.packageJson.name, pkg]));
	const publishTool = await getPublishTool(packages);
	const packedReleases = await Promise.all(releases.map((release) => queue.add(async () => {
		const pkg = packagesByName.get(release.name);
		if (!pkg) throw new Error(`Package not found: ${release.name}`);
		const publishDirOverride = pkg.packageJson.publishConfig?.directory;
		if (publishDirOverride && publishTool.name === "yarn") {
			log.error(`Package ${src_default.blue(pkg.packageJson.name)} has publishConfig.directory set to ${src_default.blue(publishDirOverride)}, which is not supported when using Yarn. Please remove publishConfig.directory from your package.json.`);
			throw new ExitError(1);
		}
		const packDir = publishDirOverride ? path.resolve(pkg.dir, publishDirOverride) : pkg.dir;
		const tarballFilename = getNormalizedTarballFilename(release.name, release.version);
		const tarballPath = path.join(packagesDir, tarballFilename);
		const packResult = await publishTool.pack({
			pkg,
			packDir,
			outputDir: packagesDir,
			tarballPath
		});
		if ("error" in packResult) {
			const code = packResult.error.code ? `: ${packResult.error.code}` : "";
			log.error(`An error occurred while packing ${release.name}${code}\n${packResult.error.message || "Unknown error"}`);
			throw new ExitError(1);
		}
		const resolvedTarballFilename = path.basename(packResult.tarballPath);
		const integrity = await getIntegrity(packResult.tarballPath);
		return {
			name: release.name,
			version: release.version,
			tarball: {
				path: path.posix.join("packages", resolvedTarballFilename),
				integrity
			}
		};
	})));
	const tarballFilenamesByRelease = new Map(packedReleases.map((release) => [`${release.name}@${release.version}`, release]));
	const packedPlan = plan.map((group) => group.map((release) => {
		if (release.kind !== "publish") return release;
		const packedRelease = tarballFilenamesByRelease.get(`${release.name}@${release.version}`);
		return {
			...release,
			tarball: packedRelease.tarball
		};
	}));
	await fs.writeFile(path.join(outputDir, "publish-plan.json"), JSON.stringify({
		version: 1,
		plan: packedPlan
	}, void 0, 2));
	if (releases.length === 0) {
		log.info("No packages to pack.");
		return;
	}
	log.info(`
Packed packages:
${packedReleases.map((release) => `- ${release.name}@${release.version}`).join("\n")}
    `.trim());
}
//#endregion
export { pack };
