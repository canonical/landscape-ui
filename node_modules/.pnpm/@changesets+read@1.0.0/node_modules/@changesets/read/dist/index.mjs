import fs from "node:fs/promises";
import path from "node:path";
import * as git from "@changesets/git";
import { parseChangesetFile } from "@changesets/parse";
//#region src/index.ts
const ignoredMdFiles = [
	/^README\.md$/i,
	"AGENTS.md",
	"CLAUDE.md",
	"GEMINI.md"
];
async function filterChangesetsSinceRef(changesets, changesetBase, sinceRef) {
	const newHashes = (await git.getChangedChangesetFilesSinceRef({
		cwd: changesetBase,
		ref: sinceRef
	})).map((c) => c.replace(/^.*\.changeset\//, ""));
	return changesets.filter((dir) => newHashes.includes(dir));
}
async function readChangesets(rootDir, sinceRef) {
	const changesetBase = path.join(rootDir, ".changeset");
	let changesets = [];
	try {
		changesets.push(...await fs.readdir(changesetBase));
	} catch (err) {
		if (err.code === "ENOENT") throw new Error("There is no .changeset directory in this project", { cause: err });
		throw err;
	}
	try {
		changesets.push(...(await fs.readdir(path.join(changesetBase, "pre"))).map((file) => `pre/${file}`));
	} catch (err) {
		if (err.code !== "ENOENT") throw err;
	}
	if (sinceRef != null) changesets = await filterChangesetsSinceRef(changesets, changesetBase, sinceRef);
	changesets = changesets.filter((file) => {
		file = path.basename(file);
		return !file.startsWith(".") && file.endsWith(".md") && !ignoredMdFiles.some((pattern) => typeof pattern === "string" ? pattern === file : pattern.test(file));
	});
	const changesetContents = changesets.map(async (file) => {
		return {
			...parseChangesetFile(await fs.readFile(path.join(changesetBase, file), "utf8")),
			id: file.replace(/\.md$/, "")
		};
	});
	return await Promise.all(changesetContents);
}
/** @deprecated Use named export `readChangesets` instead */
const readChangesetsDefault = readChangesets;
//#endregion
export { readChangesetsDefault as default, readChangesets };
