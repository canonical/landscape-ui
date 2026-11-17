import { a as isPublishSuccessful, i as isPublishFailure, n as readPlanFile, o as npmPublishQueue, r as getPublishTool, t as getPublishPlan } from "./getPublishPlan.mjs";
import { t as src_default } from "./src.mjs";
import { a as importantWarning } from "./cli-utilities.mjs";
import { t as readConfig } from "./read-config.mjs";
import { t as ensureChangesetFolder } from "./shared.mjs";
import { i as createOutputReport, n as createGitTags, r as formatGitTagResults, t as _usingCtx } from "./usingCtx.mjs";
import { ExitError } from "@changesets/errors";
import { log, progress, spinner } from "@clack/prompts";
import path, { resolve } from "node:path";
import { getPackages } from "@manypkg/get-packages";
import { readPreState } from "@changesets/pre";
//#region src/commands/publish/index.ts
function formatPackageList(entry, versionColor = src_default.green) {
	return entry.toSorted((a, b) => a.name.localeCompare(b.name)).map((entry) => {
		const error = "result" in entry && isPublishFailure(entry) ? `\n${src_default.dim(`└`)} ${entry.code || "(no code)"}: ${entry.message || "Unknown error"}` : "";
		return `${src_default.blueBright(entry.name)}@${versionColor(entry.version)}${error}`;
	}).join("\n");
}
function showNonLatestTagWarning(tag, preState) {
	if (preState) importantWarning(`
You are in prerelease mode, so packages will be published to the ${src_default.cyan(preState.tag)} npm tag,
${src_default.red("except")} for packages that have not had normal releases, which will be published to ${src_default.cyan("latest")}.
      `);
	else if (tag !== "latest") log.warn(`Packages will be released under the ${tag} tag.`);
}
async function bulkPublishPackages({ publishTool, publishQueue, packagesByName, artifactDir, otpCode, onResult }) {
	if (publishQueue.length === 0) return [];
	const publishPromises = publishQueue.map(async (item) => {
		const pkg = packagesByName.get(item.release.name);
		const result = await npmPublishQueue.add(() => publishTool.publish({
			pkg,
			release: item.release,
			tarballPath: artifactDir ? resolve(artifactDir, item.release.tarball.path) : null,
			interactive: false,
			otpCode
		}));
		onResult?.(result);
		return {
			release: item.release,
			result
		};
	});
	return Promise.all(publishPromises);
}
async function publish(options) {
	try {
		var _usingCtx$1 = _usingCtx();
		const reporter = _usingCtx$1.a(await createOutputReport(options?.output));
		const cwd = options?.cwd ?? process.cwd();
		const artifactDir = options?.fromPackDir ? path.resolve(cwd, options.fromPackDir) : void 0;
		const packages = await getPackages(cwd);
		const packagesByName = new Map(packages.packages.map((pkg) => [pkg.packageJson.name, pkg]));
		const publishTool = await getPublishTool(packages);
		await ensureChangesetFolder(packages.rootDir);
		const releaseTag = options?.tag && options.tag.length > 0 ? options.tag : void 0;
		const preState = !artifactDir ? await readPreState(packages.rootDir) : void 0;
		if (artifactDir && releaseTag) {
			log.error("Releasing under custom tag is not allowed in artifact mode.");
			throw new ExitError(1);
		}
		if (releaseTag && preState && preState.mode === "pre") {
			log.error(`
Releasing under custom tag is not allowed in pre mode!
To resolve this exit the pre mode by running ${src_default.cyan("changeset pre exit")}.
      `.trim());
			throw new ExitError(1);
		}
		if (releaseTag || preState) showNonLatestTagWarning(options?.tag, preState);
		const config = await readConfig(packages);
		const plan = artifactDir ? await readPlanFile(path.join(artifactDir, "publish-plan.json")) : await getPublishPlan(packages.rootDir, config, { tag: releaseTag });
		if (plan.length === 0) {
			log.warn("No unpublished projects to publish.");
			return;
		}
		let finishedCount = 0;
		const successfulNpmPublishes = [];
		const unsuccessfulNpmPublishes = [];
		const totalPublishCount = plan.reduce((count, chunk) => count + chunk.filter((release) => release.kind === "publish").length, 0);
		const gitTagReleases = [];
		const tagOnlyReleases = /* @__PURE__ */ new Set();
		let otpCode = publishTool.getOtpCode(options?.otp);
		let sequential = process.stdin.isTTY && otpCode == null;
		const p = progress({ max: totalPublishCount });
		const renderProgressMessage = () => finishedCount === 0 ? "Publishing packages" : `Publishing packages (${finishedCount}/${totalPublishCount})`;
		const advanceProgress = () => {
			finishedCount++;
			p.advance(1, renderProgressMessage());
		};
		if (totalPublishCount > 0) p.start(renderProgressMessage());
		publishChunks: for (const chunk of plan) {
			let publishQueue = [];
			for (const release of chunk) {
				if (release.kind === "tag-only") {
					if (options?.gitTag ?? true) {
						gitTagReleases.push(release);
						tagOnlyReleases.add(release);
					}
					continue;
				}
				publishQueue.push({
					release,
					result: void 0
				});
			}
			while (publishQueue.length > 0) {
				if (sequential) {
					const item = publishQueue.shift();
					let interactive = false;
					let result = item.result ?? await npmPublishQueue.add(() => publishTool.publish({
						pkg: packagesByName.get(item.release.name),
						release: item.release,
						tarballPath: artifactDir ? path.resolve(artifactDir, item.release.tarball.path) : null,
						interactive,
						otpCode
					}));
					while (result.result === "failed:needs-2fa") {
						otpCode = null;
						p.stop(`${src_default.blue(item.release.name)} requires 2FA verification to publish...`);
						if (totalPublishCount >= 2) importantWarning(src_default.italic(`
Make sure to check the "skip 2fa for 5 minutes" option to not have to do this
for every package being published after this!
                `.trim()));
						interactive = true;
						result = await npmPublishQueue.add(() => publishTool.publish({
							pkg: packagesByName.get(item.release.name),
							release: item.release,
							tarballPath: artifactDir ? path.resolve(artifactDir, item.release.tarball.path) : null,
							interactive,
							otpCode: null
						}));
					}
					advanceProgress();
					if (result.result === "failed:already-published") {
						if (finishedCount === totalPublishCount) p.clear();
						else if (interactive) p.start(renderProgressMessage());
						continue;
					}
					if (isPublishSuccessful(result)) {
						successfulNpmPublishes.push(result);
						if (!interactive) sequential = false;
						else if (finishedCount < totalPublishCount) p.start(renderProgressMessage());
					}
					if (isPublishFailure(result)) {
						p.clear();
						unsuccessfulNpmPublishes.push(result);
						break publishChunks;
					}
					continue;
				}
				const publishedItems = await bulkPublishPackages({
					publishTool,
					publishQueue,
					packagesByName,
					otpCode,
					artifactDir,
					onResult: (result) => {
						if (process.stdin.isTTY && result.result === "failed:needs-2fa") return;
						advanceProgress();
					}
				});
				const results = publishedItems.map((item) => item.result);
				const successes = results.filter(isPublishSuccessful);
				successfulNpmPublishes.push(...successes);
				const failures = results.filter((result) => result.result === "failed");
				unsuccessfulNpmPublishes.push(...failures);
				const recoverableItems = publishedItems.filter((item) => item.result.result === "failed:needs-2fa");
				if (failures.length > 0 || !process.stdin.isTTY) {
					unsuccessfulNpmPublishes.push(...recoverableItems.map((item) => item.result));
					publishQueue = [];
					if (failures.length > 0 || recoverableItems.length > 0) break publishChunks;
					continue;
				}
				publishQueue = recoverableItems.map((item, index) => ({
					release: item.release,
					result: index === 0 ? item.result : void 0
				}));
				if (publishQueue.length > 0) {
					sequential = true;
					otpCode = null;
				}
			}
		}
		if (successfulNpmPublishes.length !== 0) {
			const message = `Successfully published:
${formatPackageList(successfulNpmPublishes)}`;
			if (sequential) log.success(message);
			else p.stop(message);
			if (options?.gitTag ?? true) gitTagReleases.push(...successfulNpmPublishes.map((result) => ({
				kind: "tag-only",
				...result
			})));
		} else p.clear();
		if (unsuccessfulNpmPublishes.length !== 0) log.error(`
Some packages failed to publish:
${formatPackageList(unsuccessfulNpmPublishes, src_default.red)}
      `.trim());
		if (gitTagReleases.length > 0) {
			const p = spinner();
			p.start("Creating git tags...");
			const results = await createGitTags({
				packages,
				releases: gitTagReleases,
				reporter
			});
			p.stop(formatGitTagResults(packages.tool, {
				tagged: results.tagged.filter((release) => tagOnlyReleases.has(release)),
				existing: results.existing
			}));
		}
		if (unsuccessfulNpmPublishes.length !== 0) throw new ExitError(1);
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
//#endregion
export { publish };
