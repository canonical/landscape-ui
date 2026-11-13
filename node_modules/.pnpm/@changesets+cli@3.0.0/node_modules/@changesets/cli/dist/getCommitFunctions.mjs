import path from "node:path";
import { pathToFileURL } from "node:url";
import { resolve as resolve$1 } from "import-meta-resolve";
//#region src/commit/getCommitFunctions.ts
function importResolveFromDir(specifier, dir) {
	return resolve$1(specifier, pathToFileURL(path.join(dir, "x.mjs")).toString());
}
async function getCommitFunctions(commit, cwd, contextDir) {
	let commitFunctions = {};
	if (!commit) return [commitFunctions, null];
	const commitOpts = commit[1];
	const changesetPath = path.join(cwd, ".changeset");
	let commitPath;
	try {
		commitPath = importResolveFromDir(commit[0], changesetPath);
	} catch {
		commitPath = importResolveFromDir(commit[0], contextDir);
	}
	let possibleCommitFunc = await import(commitPath);
	if (possibleCommitFunc.default) {
		possibleCommitFunc = possibleCommitFunc.default;
		if (possibleCommitFunc.default) possibleCommitFunc = possibleCommitFunc.default;
	}
	if (typeof possibleCommitFunc.getAddMessage === "function" || typeof possibleCommitFunc.getVersionMessage === "function") commitFunctions = possibleCommitFunc;
	else throw new Error("Could not resolve commit generation functions");
	return [commitFunctions, commitOpts];
}
//#endregion
export { getCommitFunctions as t };
