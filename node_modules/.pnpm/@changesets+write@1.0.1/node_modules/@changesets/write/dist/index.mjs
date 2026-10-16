import fs from "node:fs/promises";
import path from "node:path";
import { defaultDetectOrder, detect, format } from "@changesets/format";
import { humanId } from "human-id";
//#region src/index.ts
async function getFormatter(config, cwd) {
	if (config === false) return async () => {};
	const formatter = config === "auto" ? await detect({
		cwd,
		order: defaultDetectOrder.filter((f) => f !== "biome")
	}) : config;
	if (!formatter) return async () => {};
	return async (patterns) => {
		await format(patterns, {
			cwd,
			formatter
		});
	};
}
async function writeChangeset({ summary, releases }, rootDir, options) {
	const changesetBase = path.resolve(rootDir, ".changeset");
	const changesetID = humanId({
		separator: "-",
		capitalize: false
	});
	const formatter = await getFormatter(options?.format ?? "auto", rootDir);
	const newChangesetPath = path.resolve(changesetBase, `${changesetID}.md`);
	const changesetContents = `---
${releases.map((release) => `"${release.name}": ${release.type}`).join("\n")}
---

${summary}
`;
	await fs.mkdir(path.dirname(newChangesetPath), { recursive: true });
	await fs.writeFile(newChangesetPath, changesetContents);
	await formatter([newChangesetPath]);
	return changesetID;
}
/** @deprecated Use named export `writeChangeset` instead */
const writeChangesetDefault = writeChangeset;
//#endregion
export { writeChangesetDefault as default, writeChangeset };
