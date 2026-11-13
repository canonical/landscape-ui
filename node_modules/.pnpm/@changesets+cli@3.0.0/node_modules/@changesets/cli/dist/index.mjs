import { t as src_default } from "./src.mjs";
import { format } from "node:util";
import { ExitError, InternalError } from "@changesets/errors";
import { intro, log, outro, updateSettings } from "@clack/prompts";
import { cac } from "cac";
//#region package.json
var version = "3.0.0";
//#endregion
//#region ../errors/src/index.ts
var ExitError$1 = class extends Error {
	code;
	constructor(code, options) {
		super(`The process exited with code: ${code}`, options);
		this.code = code;
	}
};
//#endregion
//#region src/cli.ts
const cli = cac("changeset");
cli.version(version);
cli.help((sections) => {
	sections[0] = { body: `🦋 changeset v${version}` };
});
cli.globalCommand.outputVersion = () => console.info(version);
function normalizeOptions(options, { array } = {}) {
	delete options["--"];
	for (const key in options) {
		if (options[key] == null || key.length === 1) {
			delete options[key];
			continue;
		}
		if (array?.includes(key)) {
			const v = options[key];
			options[key] = (Array.isArray(v) ? v.map(String) : [String(v)]).flatMap((value) => value.split(",").map((part) => part.trim()).filter(Boolean));
		} else if (Array.isArray(options[key])) options[key] = options[key].at(-1);
		if (typeof options[key] === "number") options[key] = String(options[key]);
	}
	return options;
}
function withEnvOptions(options) {
	if (options.output == null && process.env.CHANGESETS_OUTPUT) options.output = process.env.CHANGESETS_OUTPUT;
}
cli.command("init", "Initialize a new changesets setup").action(async (options) => {
	normalizeOptions(options);
	const { init } = await import("./init.mjs");
	await init(options);
});
cli.command("add", "Add a new changeset (default)").usage("[command] [options]").example("  $ changeset -m 'Description'").example("  $ changeset --open --since main").alias("!").option("--empty", "Add an empty changeset").option("--open", "Open the changeset in the editor after creating it").option("--since <branch>", "Detect changed packages since the provided git ref").option("-m, --message <text>", "Directly provide a message to the changeset").option("--major <pkg>", "Package(s) to major bump (comma-separated)").option("--minor <pkg>", "Package(s) to minor bump (comma-separated)").option("--patch <pkg>", "Package(s) to patch bump (comma-separated)").action(async (options) => {
	normalizeOptions(options, { array: [
		"major",
		"minor",
		"patch"
	] });
	const { add } = await import("./add.mjs");
	await add(options);
});
cli.command("version", "Version packages and create changelogs").example("  $ changeset version").example("  $ changeset version --snapshot 'pr#123'").option("--ignore <pkg>", "Packages to ignore").option("--snapshot [name]", "Create a snapshot prerelease").option("--snapshot-prerelease-template <template>", "Template for snapshot prerelease").action(async (options) => {
	normalizeOptions(options, { array: ["ignore"] });
	const { version } = await import("./version.mjs");
	await version(options);
});
cli.command("publish", "Publish packages to npm and create git tags").example("  $ changeset publish --otp 123456").example("  $ changeset publish --tag beta").option("--otp <code>", "One time password for npm publish").option("--tag <name>", "Publish with the given npm dist-tag").option("--from-pack-dir <dir>", "Publish from a packed output directory").option("--git-tag", "Create a git tag for the release", { default: true }).action(async (options) => {
	withEnvOptions(normalizeOptions(options));
	const { publish } = await import("./publish.mjs");
	await publish(options);
});
cli.command("publish-plan", "Show packages that are ready to publish or tag").option("-o, --output <file>", "Output the publish plan as JSON to a file [experimental]").action(async (options) => {
	withEnvOptions(normalizeOptions(options));
	const { publishPlan } = await import("./publish-plan.mjs");
	await publishPlan(options);
});
cli.command("pack", "Pack publishable packages into tarballs").option("--from-publish-plan <file>", "Read the publish plan from a JSON file").option("--out-dir <dir>", "Write pack output into this directory").action(async (options) => {
	normalizeOptions(options);
	if (!options.outDir) {
		log.error("The --out-dir option is required.");
		throw new ExitError$1(1);
	}
	const { pack } = await import("./pack.mjs");
	await pack(options);
});
cli.command("status", "Show the changesets that currently exist").example("  $ changeset status --verbose").option("--since <branch>", "Show changesets since the provided git ref").option("-v, --verbose", "Show more information about the changesets").option("-o, --output <file>", "Output the status as JSON to a file").action(async (options) => {
	withEnvOptions(normalizeOptions(options));
	const { status } = await import("./status.mjs");
	await status(options);
});
cli.command("git-tag", "Create git tags for the current version of all packages").alias("tag").action(async (options) => {
	if (cli.matchedCommandName === "tag") log.warn("The 'tag' command is deprecated. Please use 'git-tag' instead.");
	withEnvOptions(normalizeOptions(options));
	const { gitTag } = await import("./git-tag.mjs");
	await gitTag(options);
});
cli.command("pre <enter|exit> [tag]", "Enter or exit prerelease mode (tag required for enter)").action(async (command, tag, options) => {
	normalizeOptions(options);
	if (command !== "enter" && command !== "exit") {
		log.error(`Only ${src_default.cyan("enter")} or ${src_default.cyan("exit")} is accepted after pre`);
		throw new ExitError$1(1);
	}
	if (command === "enter" && typeof tag !== "string") {
		log.error(`A tag must be passed when using pre enter`);
		throw new ExitError$1(1);
	}
	const { pre } = await import("./pre.mjs");
	await pre({
		...options,
		command,
		tag
	});
});
//#endregion
//#region src/index.ts
updateSettings({ withGuide: false });
try {
	cli.parse(process.argv, { run: false });
	const commandName = cli.matchedCommand?.name;
	if (process.stdin.isTTY && (commandName === "add" || commandName === "publish")) updateSettings({ withGuide: true });
	if (commandName != null) intro(`🦋 changeset v${version}`);
	await cli.runMatchedCommand();
} catch (err) {
	if (err instanceof InternalError) log.error(`
The following error is an internal unexpected error, these should never happen.
Please open an issue with the following link:
https://github.com/changesets/changesets/issues/new?title=${encodeURIComponent(`Unexpected error during ${cli.matchedCommand?.name || "add"} command`)}&body=${encodeURIComponent(`## Error

\`\`\`
${format(err).replace(process.cwd().replace(/\\/g, "/"), "<cwd>")}
\`\`\`

## Versions

- @changesets/cli@${version}
- node@${process.version}

## Extra details

<!-- Add any extra details of what you were doing, ideas you have about what might have caused the error and reproduction steps if possible. If you have a repository we can look at that would be great. 😁 -->
`)}
      `.trim());
	if (err instanceof ExitError) {
		outro(src_default.red(`🦋 Exited with code ${err.code}`));
		process.exit(err.code);
	}
	log.error(err.stack);
	outro(src_default.red("🦋 Exited with code 1"));
	process.exit(1);
}
//#endregion
export {};
