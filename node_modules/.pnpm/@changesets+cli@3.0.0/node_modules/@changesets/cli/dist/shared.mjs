import { t as src_default } from "./src.mjs";
import { ExitError } from "@changesets/errors";
import { log } from "@clack/prompts";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/commands/shared.ts
async function ensureChangesetFolder(rootDir) {
	try {
		await fs.access(path.resolve(rootDir, ".changeset"));
	} catch {
		log.error(`
  There is no .changeset folder.
  If this is the first time ${src_default.green("Changesets")} have been used in this project, run ${src_default.cyan("changeset init")} to get set up.
  If you expected there to be changesets, you should check git history for when the folder was removed to ensure you do not lose any configuration.
        `.trim());
		throw new ExitError(1);
	}
}
//#endregion
export { ensureChangesetFolder as t };
