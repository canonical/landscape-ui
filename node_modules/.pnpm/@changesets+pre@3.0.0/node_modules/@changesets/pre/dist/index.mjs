import fs from "node:fs/promises";
import path from "node:path";
import { PreEnterButInPreModeError, PreExitButNotInPreModeError } from "@changesets/errors";
import { getPackages } from "@manypkg/get-packages";
//#region src/index.ts
async function outputFile(filePath, content) {
	await fs.mkdir(path.dirname(filePath), { recursive: true });
	await fs.writeFile(filePath, content, "utf8");
}
async function readPreState(rootDir) {
	const preStatePath = path.resolve(rootDir, ".changeset", "pre.json");
	let preState;
	try {
		const contents = await fs.readFile(preStatePath, "utf8");
		try {
			preState = JSON.parse(contents);
		} catch (err) {
			if (err instanceof SyntaxError) console.error("error parsing json:", contents);
			throw err;
		}
	} catch (err) {
		if (err.code !== "ENOENT") throw err;
	}
	preState = preState ? await migratePreState(rootDir, preState) : void 0;
	return preState;
}
async function exitPre(rootDir) {
	const preStatePath = path.resolve(rootDir, ".changeset", "pre.json");
	const preState = await readPreState(rootDir);
	if (preState == null) throw new PreExitButNotInPreModeError();
	await outputFile(preStatePath, JSON.stringify({
		...preState,
		mode: "exit"
	}, null, 2) + "\n");
}
async function enterPre(rootDir, tag) {
	const packages = await getPackages(rootDir);
	const preStatePath = path.resolve(packages.rootDir, ".changeset", "pre.json");
	if ((await readPreState(packages.rootDir))?.mode === "pre") throw new PreEnterButInPreModeError();
	await outputFile(preStatePath, JSON.stringify({
		mode: "pre",
		tag
	}, null, 2) + "\n");
}
async function migratePreState(rootDir, preState) {
	if (preState.initialVersions == null && preState.changesets == null) return preState;
	if (preState.initialVersions != null) delete preState.initialVersions;
	if (preState.changesets != null) {
		const preChangesetsDir = path.resolve(rootDir, ".changeset", "pre");
		await fs.mkdir(preChangesetsDir, { recursive: true });
		for (const changeset of preState.changesets) {
			const oldPath = path.resolve(rootDir, ".changeset", `${changeset}.md`);
			const newPath = path.resolve(preChangesetsDir, `${changeset}.md`);
			try {
				await fs.rename(oldPath, newPath);
			} catch {}
		}
		delete preState.changesets;
	}
	await outputFile(path.resolve(rootDir, ".changeset", "pre.json"), JSON.stringify(preState, null, 2) + "\n");
	return preState;
}
//#endregion
export { enterPre, exitPre, readPreState };
