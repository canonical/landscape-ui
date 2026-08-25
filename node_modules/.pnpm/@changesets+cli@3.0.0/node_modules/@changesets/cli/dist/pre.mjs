import { t as src_default } from "./src.mjs";
import { t as ensureChangesetFolder } from "./shared.mjs";
import { ExitError, PreEnterButInPreModeError, PreExitButNotInPreModeError } from "@changesets/errors";
import { log } from "@clack/prompts";
import { getPackages } from "@manypkg/get-packages";
import { enterPre, exitPre } from "@changesets/pre";
//#region src/commands/pre/index.ts
async function pre(options) {
	const packages = await getPackages(options.cwd ?? process.cwd());
	await ensureChangesetFolder(packages.rootDir);
	if (options.command === "enter") try {
		await enterPre(packages.rootDir, options.tag);
		log.success(`
Entered pre mode with tag ${src_default.green(options.tag)}!
Run ${src_default.cyan("changeset version")} to version packages with prerelease versions.
        `.trim());
	} catch (err) {
		if (err instanceof PreEnterButInPreModeError) {
			log.error(`
${src_default.cyan("changeset pre enter")} cannot be run when in pre mode.
If you're trying to exit pre mode, run ${src_default.cyan("changeset pre exit")}.
          `.trim());
			throw new ExitError(1);
		}
		throw err;
	}
	else try {
		await exitPre(packages.rootDir);
		log.success(`
Exited pre mode!
Run ${src_default.cyan("changeset version")} to version packages with normal versions.
        `.trim());
	} catch (err) {
		if (err instanceof PreExitButNotInPreModeError) {
			log.error(`
${src_default.cyan("changeset pre exit")} can only be run when in pre mode!
If you're trying to enter pre mode, run ${src_default.cyan("changeset pre enter")}.
          `.trim());
			throw new ExitError(1);
		}
		throw err;
	}
}
//#endregion
export { pre };
