import fs from "node:fs";
import path from "node:path";
import { detect as detect$1, resolveCommand } from "package-manager-detector";
import { exec } from "tinyexec";
//#region src/utils.ts
/**
* Traverse upwards from `startDir` to `stopDir` (inclusive), calling `cb` in each directory. If
* `cb` returns a non-null value, it'll stop and return that value.
*/
function traverseUpwards(startDir, stopDir, cb) {
	let dir = startDir;
	while (dir) {
		const result = cb(dir);
		if (result !== void 0) return result;
		if (dir === stopDir) break;
		const nextDir = path.dirname(dir);
		if (nextDir === dir) break;
		dir = nextDir;
	}
}
async function packageManagerExecute(packageManager, args, cwd) {
	const cmd = resolveCommand(packageManager, "execute-local", args) ?? {
		command: "npx",
		args
	};
	return await spawnProcess(cmd.command, cmd.args, cwd);
}
async function spawnProcess(command, args, cwd) {
	await exec(command, args, {
		nodeOptions: { cwd },
		throwOnError: true
	});
}
const formatters = {
	prettier: {
		name: "prettier",
		packageName: "prettier",
		configFiles: [
			".prettierrc",
			".prettierrc.json",
			".prettierrc.yml",
			".prettierrc.yaml",
			".prettierrc.json5",
			".prettierrc.js",
			"prettier.config.js",
			".prettierrc.ts",
			"prettier.config.ts",
			".prettierrc.mjs",
			"prettier.config.mjs",
			".prettierrc.mts",
			"prettier.config.mts",
			".prettierrc.cjs",
			"prettier.config.cjs",
			".prettierrc.cts",
			"prettier.config.cts",
			".prettierrc.toml",
			{
				file: "package.json",
				key: "prettier"
			}
		],
		async format(files, ctx) {
			await packageManagerExecute(await ctx.getPackageManager(), [
				"prettier",
				"--write",
				...files
			], ctx.cwd);
		}
	},
	biome: {
		name: "biome",
		packageName: "@biomejs/biome",
		configFiles: [
			"biome.json",
			"biome.jsonc",
			".biome.json",
			".biome.jsonc"
		],
		async format(files, ctx) {
			await packageManagerExecute(await ctx.getPackageManager(), [
				"@biomejs/biome",
				"format",
				"--write",
				...files
			], ctx.cwd);
		}
	},
	oxfmt: {
		name: "oxfmt",
		packageName: "oxfmt",
		configFiles: [
			".oxfmtrc.json",
			".oxfmtrc.jsonc",
			"oxfmt.config.ts"
		],
		async format(files, ctx) {
			await packageManagerExecute(await ctx.getPackageManager(), [
				"oxfmt",
				"--write",
				...files
			], ctx.cwd);
		}
	},
	deno: {
		name: "deno",
		configFiles: [
			"deno.json",
			"deno.jsonc",
			{
				file: "deno.json",
				key: "fmt"
			}
		],
		async format(files, ctx) {
			await spawnProcess("deno", ["fmt", ...files], ctx.cwd);
		}
	},
	dprint: {
		name: "dprint",
		packageName: "dprint",
		configFiles: [
			"dprint.json",
			"dprint.jsonc",
			".dprint.json",
			".dprint.jsonc"
		],
		async format(files, ctx) {
			await packageManagerExecute(await ctx.getPackageManager(), [
				"dprint",
				"fmt",
				...files
			], ctx.cwd);
		}
	}
};
//#endregion
//#region src/detect.ts
const defaultDetectOrder = Object.freeze([
	"dprint",
	"deno",
	"oxfmt",
	"biome",
	"prettier"
]);
/**
* Detect the preferred formatter used in the project.
*/
async function detect(options = {}) {
	const cwd = options.cwd ? path.resolve(options.cwd) : process.cwd();
	const stopDir = options.stopDir ? path.resolve(cwd, options.stopDir) : void 0;
	const order = options.order ?? defaultDetectOrder;
	let found = traverseUpwards(cwd, stopDir, (dir) => {
		for (const formatterName of order) {
			const formatter = formatters[formatterName];
			for (const configFile of formatter.configFiles) if (typeof configFile === "string") {
				const configFilePath = path.join(dir, configFile);
				if (fs.existsSync(configFilePath)) return formatter.name;
			} else if (checkConfigFileWithKeyExists(path.join(dir, configFile.file), configFile.key)) return formatter.name;
		}
	});
	found ??= traverseUpwards(cwd, stopDir, (dir) => {
		for (const formatterName of order) {
			const formatter = formatters[formatterName];
			if (formatter.packageName) {
				const packagePath = path.join(dir, "node_modules", formatter.packageName);
				if (fs.existsSync(packagePath)) return formatter.name;
			}
		}
	});
	return found;
}
function checkConfigFileWithKeyExists(configFile, key) {
	try {
		const content = fs.readFileSync(configFile, "utf-8");
		return key in JSON.parse(content);
	} catch {
		return false;
	}
}
//#endregion
//#region src/format.ts
/**
* Format the given patterns with a specified or auto-detected formatter. It returns `true` if a
* formatter is found and the formatting process passes, otherwise returns `false`.
*/
async function format(patterns, options = {}) {
	const formatterName = options.formatter ?? await detect({
		cwd: options.cwd,
		stopDir: options.stopDir
	});
	if (!formatterName) return false;
	const formatter = formatters[formatterName];
	const ctx = {
		cwd: options.cwd ? path.resolve(options.cwd) : process.cwd(),
		async getPackageManager() {
			if (options.packageManager) return options.packageManager;
			return (await detect$1({
				cwd: options.cwd,
				stopDir: options.stopDir
			}))?.agent ?? "npm";
		}
	};
	await formatter.format(patterns, ctx);
	return true;
}
//#endregion
export { defaultDetectOrder, detect, format };
