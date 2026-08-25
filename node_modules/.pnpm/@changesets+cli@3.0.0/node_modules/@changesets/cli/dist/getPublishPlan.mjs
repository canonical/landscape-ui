import { t as src_default } from "./src.mjs";
import { n as splitByTagStatus } from "./gitTags.mjs";
import { stripVTControlCharacters } from "node:util";
import { ExitError } from "@changesets/errors";
import { log } from "@clack/prompts";
import path from "node:path";
import { shouldSkipPackage } from "@changesets/should-skip-package";
import { getPackages } from "@manypkg/get-packages";
import fs from "node:fs/promises";
import { getDependentsGraph } from "@changesets/get-dependents-graph";
import { readPreState } from "@changesets/pre";
import { graphSequencer } from "@pnpm/deps.graph-sequencer";
import semverParse from "semver/functions/parse.js";
import { detect } from "package-manager-detector/detect";
import { exec } from "tinyexec";
import assert from "node:assert/strict";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region src/ponyfills/promise-try.ts
const promiseTryPolyfill = (fn, ...args) => new Promise((resolve) => resolve(fn(...args)));
const promiseTry = "try" in Promise ? Promise.try.bind(Promise) : promiseTryPolyfill;
//#endregion
//#region src/utils/createPromiseQueue.ts
function createPromiseQueue(concurrency) {
	const jobs = [];
	let active = 0;
	function run() {
		if (active >= concurrency) return;
		const job = jobs.shift();
		if (!job) return;
		active++;
		promiseTry(job.fn).then((result) => {
			active--;
			job.resolve(result);
			run();
		}, (error) => {
			active--;
			job.reject(error);
			run();
		});
	}
	return { add: (fn) => {
		const { promise, resolve, reject } = Promise.withResolvers();
		jobs.push({
			fn,
			resolve,
			reject
		});
		run();
		return promise;
	} };
}
const npmRequestQueue = createPromiseQueue(40);
const npmPublishQueue = createPromiseQueue(10);
function isAlreadyPublishedError(message) {
	return message.includes("cannot publish over the previously published");
}
const isPublishSuccessful = (result) => result.result === "published";
const isPublishFailure = (result) => result.result.startsWith("failed");
//#endregion
//#region src/utils/getLastJsonObjectFromString.ts
const getLastJsonObjectFromString = (str) => {
	str = str.replace(/[^}]*$/, "");
	while (str) {
		str = str.replace(/[^{]*/, "");
		try {
			return JSON.parse(str);
		} catch {
			str = str.slice(1);
		}
	}
	return null;
};
//#endregion
//#region src/lib/npm.ts
var npm_exports = /* @__PURE__ */ __exportAll({
	getOtpCode: () => getOtpCode$2,
	handlePublishError: () => handlePublishError,
	info: () => info$2,
	name: () => "npm",
	pack: () => pack$2,
	publish: () => publish$2
});
function isNpmPublishError(err) {
	return err != null && typeof err === "object" && "error" in err && err.error != null && typeof err.error === "object" && "summary" in err.error;
}
function sanitizeEnv$1(env) {
	return {
		...env,
		NPM_CONFIG_OTP: void 0,
		npm_config_otp: void 0
	};
}
function isJsonObject$1(value) {
	return typeof value === "object" && value != null && !Array.isArray(value);
}
function formatJsonError(error) {
	if (!isJsonObject$1(error)) return;
	let message = typeof error.message === "string" ? error.message : typeof error.summary === "string" ? error.summary : void 0;
	if (typeof error.detail === "string" && error.detail) message = message ? `${message}\n${error.detail}` : error.detail;
	return {
		code: typeof error.code === "string" ? error.code : void 0,
		message
	};
}
function getNpmError(stdout, stderr) {
	const json = getLastJsonObjectFromString(stdout);
	if (json?.error) {
		const jsonError = formatJsonError(json.error);
		if (jsonError) return jsonError;
	}
	return { message: stderr || stdout || void 0 };
}
function parseInfoResult$1({ exitCode, stdout, stderr }) {
	if (exitCode !== 0) return { error: getNpmError(stdout, stderr) };
	if (!stdout) return;
	const parsed = JSON.parse(stdout);
	if (Array.isArray(parsed)) {
		assert(parsed.length === 1, "Unexpected empty array output from npm info --json");
		return { info: parsed[0] };
	}
	return { info: parsed };
}
function getRegistryOverrides(packageJson) {
	const registryOverrides = [];
	if (packageJson.name.startsWith("@")) {
		const scope = packageJson.name.split("/")[0];
		if (packageJson.publishConfig?.[`${scope}:registry`]) registryOverrides.push(`--${scope}:registry=${packageJson.publishConfig[`${scope}:registry`]}`);
		if (packageJson.publishConfig?.registry) registryOverrides.push(`--registry=${packageJson.publishConfig.registry}`);
	} else if (packageJson.publishConfig?.registry) registryOverrides.push(`--registry=${packageJson.publishConfig.registry}`);
	return registryOverrides;
}
const info$2 = async ({ cwd, pkg }) => {
	const { packageJson } = pkg;
	const flags = [...getRegistryOverrides(packageJson), "--json"];
	let info = parseInfoResult$1(await exec("npm", [
		"info",
		packageJson.name,
		...flags
	], {
		nodePath: false,
		nodeOptions: { cwd }
	}));
	if (!info) info = parseInfoResult$1(await exec("npm", [
		"info",
		`${packageJson.name}@${packageJson.version}`,
		...flags
	], {
		nodePath: false,
		nodeOptions: { cwd }
	})) ?? { error: { code: "E404" } };
	if ("error" in info) return info.error.code === "E404" ? { published: false } : { error: info.error };
	return {
		published: true,
		info: info.info
	};
};
const pack$2 = async ({ pkg, packDir, outputDir }) => {
	const { exitCode, stdout, stderr } = await exec("npm", [
		"pack",
		packDir,
		"--pack-destination",
		outputDir,
		"--json"
	], {
		nodePath: false,
		nodeOptions: { cwd: pkg.dir }
	});
	if (exitCode !== 0) return { error: getNpmError(stdout, stderr) };
	const json = getLastJsonObjectFromString(stdout);
	let filename = Array.isArray(json) ? json[0]?.filename : json?.filename;
	if (!filename) {
		const pkgOutput = Object.values(json ?? {})[0];
		filename = pkgOutput && typeof pkgOutput === "object" && "filename" in pkgOutput && pkgOutput.filename;
	}
	assert(typeof filename === "string", "Failed to determine tarball filename");
	return { tarballPath: path.join(outputDir, path.basename(filename)) };
};
function getOtpCode$2(otp) {
	return otp || process.env.NPM_CONFIG_OTP || process.env.npm_config_otp || null;
}
function handlePublishError(resultBase, json, processOutput) {
	if (!isNpmPublishError(json)) return {
		...resultBase,
		result: "failed",
		message: processOutput || void 0
	};
	if (isAlreadyPublishedError(json.error.summary)) return {
		...resultBase,
		result: "failed:already-published",
		code: json.error.code
	};
	const message = `
${json.error.summary ?? ""}
${json.error.detail ?? ""}
  `.trim();
	if (json.error.code === "EOTP") {
		const result = {
			...resultBase,
			result: "failed:needs-2fa",
			code: json.error.code,
			message: message || void 0
		};
		if ("authUrl" in json.error) {
			result.authUrl = json.error.authUrl;
			result.doneUrl = json.error.doneUrl;
		}
		return result;
	}
	return {
		...resultBase,
		result: "failed",
		code: json.error.code,
		message: message || void 0
	};
}
const publish$2 = async ({ pkg, release, tarballPath, interactive, otpCode }) => {
	const cwd = pkg.dir;
	const args = [
		"--access",
		release.access,
		"--tag",
		release.tag
	];
	if (!interactive) args.unshift("--json");
	if (otpCode) args.push("--otp", otpCode);
	if (tarballPath) args.unshift(path.relative(cwd, tarballPath));
	else if (pkg.packageJson.publishConfig?.directory != null) args.unshift(path.resolve(cwd, pkg.packageJson.publishConfig.directory));
	const { exitCode, stdout, stderr } = await exec("npm", ["publish", ...args], {
		nodePath: false,
		nodeOptions: {
			stdio: interactive ? "inherit" : "pipe",
			env: sanitizeEnv$1(process.env),
			cwd
		}
	});
	const resultBase = {
		name: release.name,
		version: release.version
	};
	if (exitCode === 0) return {
		...resultBase,
		result: "published"
	};
	const json = getLastJsonObjectFromString(stdout);
	if (!json) return {
		...resultBase,
		result: "failed",
		message: stderr || stdout
	};
	return handlePublishError(resultBase, json, stderr || stdout);
};
//#endregion
//#region src/lib/pnpm.ts
var pnpm_exports = /* @__PURE__ */ __exportAll({
	getOtpCode: () => getOtpCode$1,
	info: () => info$1,
	name: () => name$1,
	pack: () => pack$1,
	publish: () => publish$1
});
function isPnpmPublishError(error) {
	return error != null && typeof error === "object" && "error" in error && typeof error.error === "object" && error.error != null && "code" in error.error && "message" in error.error;
}
function sanitizeEnv(env) {
	return {
		...env,
		PNPM_CONFIG_OTP: void 0,
		pnpm_config_otp: void 0,
		NPM_CONFIG_OTP: void 0,
		npm_config_otp: void 0
	};
}
function getPnpmError(stderr, stdout) {
	const error = getLastJsonObjectFromString(stdout)?.error;
	if (error && typeof error === "object" && !Array.isArray(error)) return {
		code: typeof error.code === "string" ? error.code : void 0,
		message: typeof error.message === "string" ? error.message : void 0
	};
	return { message: stderr || stdout || void 0 };
}
const name$1 = "pnpm";
function parseInfoResult({ exitCode, stdout, stderr }) {
	if (exitCode !== 0) return { error: getPnpmError(stderr, stdout) };
	return stdout ? { info: JSON.parse(stdout) } : void 0;
}
const info$1 = async ({ cwd, pkg }) => {
	const { packageJson } = pkg;
	let info = parseInfoResult(await exec("pnpm", [
		"info",
		packageJson.name,
		"--json"
	], {
		nodePath: false,
		nodeOptions: { cwd }
	}));
	if (!info || "error" in info && info.error.code === "ERR_PNPM_PACKAGE_NOT_FOUND") info = parseInfoResult(await exec("pnpm", [
		"info",
		`${packageJson.name}@${packageJson.version}`,
		"--json"
	], {
		nodePath: false,
		nodeOptions: { cwd }
	})) ?? { error: { code: "E404" } };
	if ("error" in info) return info.error.code === "E404" || info.error.code === "ERR_PNPM_FETCH_404" || info.error.code === "ERR_PNPM_PACKAGE_NOT_FOUND" ? { published: false } : { error: info.error };
	return {
		published: true,
		info: info.info
	};
};
const pack$1 = async ({ pkg, tarballPath }) => {
	const { exitCode, stdout, stderr } = await exec("pnpm", [
		"pack",
		"--out",
		tarballPath,
		"--json"
	], {
		nodePath: false,
		nodeOptions: { cwd: pkg.dir }
	});
	if (exitCode !== 0) return { error: getPnpmError(stderr, stdout) };
	return { tarballPath };
};
const getOtpCode$1 = (otp) => otp || process.env.PNPM_CONFIG_OTP || process.env.pnpm_config_otp || process.env.NPM_CONFIG_OTP || process.env.npm_config_otp || null;
const publish$1 = async ({ pkg, release, tarballPath, interactive, otpCode }) => {
	const cwd = pkg.dir;
	const args = [
		"--access",
		release.access,
		"--tag",
		release.tag,
		"--no-git-checks"
	];
	if (!interactive) args.unshift("--json");
	if (otpCode) args.push("--otp", otpCode);
	if (tarballPath) args.unshift(path.relative(cwd, tarballPath));
	const { exitCode, stdout, stderr } = await exec("pnpm", ["publish", ...args], {
		nodePath: false,
		nodeOptions: {
			stdio: interactive ? "inherit" : "pipe",
			env: sanitizeEnv(process.env),
			cwd
		}
	});
	const resultBase = {
		name: release.name,
		version: release.version
	};
	if (exitCode === 0) return {
		...resultBase,
		result: "published"
	};
	const json = getLastJsonObjectFromString(stdout);
	if (!json) return {
		...resultBase,
		result: "failed",
		message: stderr || stdout || void 0
	};
	if (!isPnpmPublishError(json)) return handlePublishError(resultBase, json, stderr || stdout);
	if (isAlreadyPublishedError(json.error.message)) return {
		...resultBase,
		result: "failed:already-published",
		code: json.error.code
	};
	const message = json.error.message.trim();
	if (json.error.code === "ERR_PNPM_OTP_NON_INTERACTIVE") return {
		...resultBase,
		result: "failed:needs-2fa",
		code: json.error.code,
		message: message || void 0,
		authUrl: json.error.authUrl,
		doneUrl: json.error.doneUrl
	};
	return {
		...resultBase,
		result: "failed",
		code: json.error.code,
		message: message || void 0
	};
};
//#endregion
//#region src/utils/streamNdjson.ts
function* streamNdjson(output) {
	let lineStart = 0;
	while (lineStart <= output.length) {
		let lineEnd = output.indexOf("\n", lineStart);
		if (lineEnd === -1) lineEnd = output.length;
		const line = output.slice(lineStart, lineEnd);
		lineStart = lineEnd + 1;
		if (/^\s*$/.test(line)) continue;
		try {
			yield JSON.parse(line);
		} catch {
			continue;
		}
	}
}
//#endregion
//#region src/lib/yarn.ts
var yarn_exports = /* @__PURE__ */ __exportAll({
	getOtpCode: () => getOtpCode,
	getYarnBerryReporterError: () => getYarnBerryReporterError,
	info: () => info,
	name: () => name,
	pack: () => pack,
	publish: () => publish
});
const name = "yarn";
function isJsonObject(value) {
	return typeof value === "object" && value != null && !Array.isArray(value);
}
function isYarnBerryReporterEvent(event) {
	if (!isJsonObject(event) || event.type !== "error") return false;
	return typeof event.name === "number" && typeof event.data === "string";
}
function getYarnBerryReporterError(output) {
	const errors = [];
	let code;
	for (const event of streamNdjson(output)) {
		if (!isYarnBerryReporterEvent(event)) continue;
		const error = {
			code: typeof event.displayName === "string" && event.displayName ? event.displayName : `YN${String(event.name).padStart(4, "0")}`,
			message: stripVTControlCharacters(event.data)
		};
		if (error.message.startsWith("Failed with errors")) continue;
		if (errors.length > 0 && error.code !== code) break;
		code = error.code;
		errors.push(error);
	}
	if (!errors.length) return;
	return {
		code: errors[0].code,
		message: errors.map((error) => error.message).join("\n")
	};
}
const info = async ({ cwd, pkg }) => {
	const { packageJson } = pkg;
	const result = await exec("yarn", [
		"npm",
		"info",
		packageJson.name,
		"--json"
	], {
		nodePath: false,
		nodeOptions: { cwd }
	});
	if (result.exitCode !== 0) {
		const error = getYarnBerryReporterError(result.stdout) ?? { message: result.stderr || result.stdout };
		return error.code === "YN0035" && error.message?.includes("Response Code: 404") === true ? { published: false } : { error };
	}
	let info;
	for (const entry of streamNdjson(result.stdout)) info = entry;
	return info ? {
		published: true,
		info
	} : { error: {} };
};
const pack = async ({ packDir, tarballPath }) => {
	const { exitCode, stdout, stderr } = await exec("yarn", [
		"pack",
		"--out",
		tarballPath,
		"--json"
	], {
		nodePath: false,
		nodeOptions: { cwd: packDir }
	});
	if (exitCode !== 0) return { error: getYarnBerryReporterError(stdout) || { message: stderr || stdout } };
	return { tarballPath };
};
const getOtpCode = (otp) => otp || null;
const publish = async ({ pkg, release, tarballPath, interactive, otpCode }) => {
	const resultBase = {
		name: release.name,
		version: release.version
	};
	if (pkg.packageJson.publishConfig?.directory) return {
		...resultBase,
		result: "failed",
		message: `Package has publishConfig.directory configured in its package.json, which is not supported when using Yarn.`
	};
	if (tarballPath) return {
		...resultBase,
		result: "failed",
		message: "Yarn does not support publishing from a tarball."
	};
	const args = [
		"npm",
		"publish",
		"--access",
		release.access,
		"--tag",
		release.tag
	];
	if (!interactive) args.push("--json");
	if (otpCode) args.push("--otp", otpCode);
	const { exitCode, stdout, stderr } = await exec("yarn", args, {
		nodePath: false,
		...!interactive && { stdin: "not-otp\n" },
		nodeOptions: {
			cwd: pkg.dir,
			stdio: interactive ? "inherit" : "pipe"
		}
	});
	if (exitCode === 0) return {
		...resultBase,
		result: "published"
	};
	const reporterError = getYarnBerryReporterError(stdout);
	if (!reporterError) return {
		...resultBase,
		result: "failed",
		message: stderr || stdout
	};
	if (reporterError.code === "YN0035" && isAlreadyPublishedError(reporterError.message)) return {
		...resultBase,
		result: "failed:already-published",
		code: reporterError.code
	};
	if (reporterError.code === "YN0033" || /\b(otp|one-time password|authentication)\b/i.test(reporterError.message)) return {
		...resultBase,
		result: "failed:needs-2fa",
		code: reporterError.code,
		message: reporterError.message
	};
	return {
		...resultBase,
		result: "failed",
		code: reporterError.code,
		message: reporterError.message
	};
};
//#endregion
//#region src/commands/publish/getPublishTool.ts
async function getYarnVersion(packages) {
	const { stdout } = await exec("yarn", ["--version"], {
		nodePath: false,
		nodeOptions: { cwd: packages.rootDir }
	});
	const major = Number(stdout.toString().trim().split(".")[0]);
	return Number.isNaN(major) || major >= 2 ? "berry" : "classic";
}
async function getPublishTool(packages) {
	let packageManager = packages.tool.type;
	if (![
		"npm",
		"pnpm",
		"yarn"
	].includes(packageManager)) packageManager = (await detect({ cwd: packages.rootDir }))?.name ?? "npm";
	if (packageManager === "pnpm") return pnpm_exports;
	if (packageManager === "yarn") {
		if (await getYarnVersion(packages) === "classic") throw new Error("Yarn Classic is not supported. Please upgrade to Yarn Berry or another maintained package manager.");
		return yarn_exports;
	}
	return npm_exports;
}
async function readPlanFile(filePath) {
	const json = JSON.parse(await fs.readFile(filePath, "utf8"));
	if (!json || typeof json !== "object") throw new Error("Invalid publish plan file");
	if (!Array.isArray(json.plan)) throw new Error("Invalid publish plan file");
	if (json.version !== 1) throw new Error(`Invalid publish plan file version: expected 1, received ${String(json.version)}`);
	return json.plan;
}
function getReleaseTag(publishedState, preState, tag) {
	if (tag) return tag;
	if (preState != null && publishedState !== "only-pre") return preState.tag;
	return "latest";
}
async function getUnpublishedPackages(packages, preState, access, options) {
	const publishTool = await getPublishTool(packages);
	const results = await Promise.all(packages.packages.filter((pkg) => !pkg.packageJson.private && !shouldSkipPackage(pkg, options)).map(async (pkg) => {
		const response = await npmRequestQueue.add(() => publishTool.info({
			cwd: packages.rootDir,
			pkg
		}));
		if ("error" in response) {
			log.error(`
Received an unexpected error for ${src_default.cyan(pkg.packageJson.name)}: ${response.error.code || "(no code)"}
${response.error.message || "Unknown error"}
            `.trim());
			throw new ExitError(1);
		}
		if (!response.published) log.warn(`Package ${src_default.cyan(pkg.packageJson.name)} was not found in the registry.`);
		let publishedState = "never";
		let publishedVersions = [];
		if (response.published) {
			publishedState = "published";
			publishedVersions = response.info.versions;
			if (preState != null && response.info["dist-tags"].latest && response.info.versions.every((version) => semverParse(version).prerelease[0] === preState.tag)) publishedState = "only-pre";
		}
		return {
			pkg,
			publishedState,
			publishedVersions
		};
	}));
	const packagesToPublish = [];
	const previewLines = [];
	let alreadyPublishedCount = 0;
	for (const result of results) {
		const { pkg, publishedState, publishedVersions } = result;
		const localVersion = pkg.packageJson.version;
		if (!publishedVersions.includes(localVersion)) {
			const release = {
				kind: "publish",
				name: pkg.packageJson.name,
				version: localVersion,
				access: pkg.packageJson.publishConfig?.access || access,
				tag: getReleaseTag(publishedState, preState, options.tag)
			};
			packagesToPublish.push(release);
			previewLines.push(`${src_default.blue(release.name)}@${src_default.green(release.version)}`);
			if (preState != null && publishedState === "only-pre") previewLines.push(`${src_default.gray("└")} will be published to ${src_default.cyan("latest")} rather than ${src_default.cyan(preState.tag)} as it will be its first published version.`);
		} else alreadyPublishedCount++;
	}
	if (packagesToPublish.length !== 0) log.info(`
These packages will be published as they were not found in the registry:
${previewLines.join("\n")}
${src_default.gray(`${alreadyPublishedCount} packages are already published.`)}
      `.trim());
	return packagesToPublish;
}
async function getUntaggedPrivatePackages(cwd, packages, tool, options) {
	return (await splitByTagStatus(cwd, tool, packages.filter((pkg) => pkg.packageJson.private && !shouldSkipPackage(pkg, options)).map((pkg) => ({
		kind: "tag-only",
		name: pkg.packageJson.name,
		version: pkg.packageJson.version
	})))).untagged;
}
function sortReleases(packages, releases, opts) {
	const dependentsGraph = getDependentsGraph(packages, {
		bumpVersionsWithWorkspaceProtocolOnly: opts.bumpVersionsWithWorkspaceProtocolOnly,
		ignoreDevDependencies: true
	});
	const releasesByName = new Map(releases.map((release) => {
		if (!dependentsGraph.has(release.name)) throw new Error(`Package referenced by release entry not found: ${release.name}`);
		return [release.name, release];
	}));
	const graph = new Map(releases.map((release) => [release, []]));
	for (const [dependencyName, dependents] of dependentsGraph) {
		const release = releasesByName.get(dependencyName);
		if (!release) continue;
		for (const dependentName of dependents) {
			const dependentRelease = releasesByName.get(dependentName);
			if (!dependentRelease) continue;
			graph.get(dependentRelease).push(release);
		}
	}
	const result = graphSequencer(graph);
	if (result.cycles.length > 0) log.warn(`Publish plan contains cyclic dependencies: ${result.cycles.map((cycle) => cycle.map((release) => release.name).join(" -> ")).join("; ")}`);
	return result.chunks;
}
async function getPublishPlan(rootDir, config, options) {
	const packages = await getPackages(rootDir);
	const releases = await getUnpublishedPackages(packages, await readPreState(rootDir), config.access, {
		tag: options?.tag,
		ignore: config.ignore,
		allowPrivatePackages: config.privatePackages.tag
	});
	const tagReleases = config.privatePackages.tag ? await getUntaggedPrivatePackages(packages.rootDir, packages.packages, packages.tool, {
		ignore: config.ignore,
		allowPrivatePackages: config.privatePackages.tag
	}) : [];
	if (releases.length === 0 && tagReleases.length === 0) return [];
	return sortReleases(packages, [...releases, ...tagReleases], config);
}
//#endregion
export { isPublishSuccessful as a, isPublishFailure as i, readPlanFile as n, npmPublishQueue as o, getPublishTool as r, createPromiseQueue as s, getPublishPlan as t };
