import { t as src_default } from "./src.mjs";
import { ExitError } from "@changesets/errors";
import { log } from "@clack/prompts";
import { readConfig } from "@changesets/config";
//#region src/utils/read-config.ts
async function readConfig$1(packages) {
	const { config, warnings, errors } = await readConfig(packages.rootDir, packages);
	const messages = [];
	for (const warning of warnings) messages.push(src_default.yellow(warning));
	if (errors != null) for (const error of errors) messages.push(src_default.red(error));
	const logFn = errors != null ? log.error : log.warn;
	if (messages.length !== 0) logFn(`Found issues in your config:\n- ${messages.join("\n- ")}`);
	if (errors != null) throw new ExitError(1, { cause: new Error(errors.join("\n")) });
	return config;
}
//#endregion
export { readConfig$1 as t };
