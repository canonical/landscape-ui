import fs from "node:fs/promises";
import path from "node:path";
import { GitError } from "@changesets/errors";
import { getPackages } from "@manypkg/get-packages";
import picomatch from "picomatch";
import { exec } from "tinyexec";
//#region src/index.ts
async function add(pathToFile, cwd) {
	const gitCmd = await exec("git", ["add", pathToFile], { nodeOptions: { cwd } });
	if (gitCmd.exitCode !== 0) console.log(pathToFile, gitCmd.stderr.toString());
	return gitCmd.exitCode === 0;
}
async function commit(message, cwd) {
	return (await exec("git", [
		"commit",
		"-m",
		message,
		"--allow-empty"
	], { nodeOptions: { cwd } })).exitCode === 0;
}
async function getAllTags(cwd) {
	const gitCmd = await exec("git", ["tag"], { nodeOptions: { cwd } });
	if (gitCmd.exitCode !== 0) throw new Error(gitCmd.stderr.toString());
	const tags = gitCmd.stdout.toString().trim().split("\n");
	return new Set(tags);
}
async function tag(tagStr, cwd) {
	return (await exec("git", [
		"tag",
		tagStr,
		"-m",
		tagStr
	], { nodeOptions: { cwd } })).exitCode === 0;
}
async function getDivergedCommit(cwd, ref) {
	const cmd = await exec("git", [
		"merge-base",
		ref,
		"HEAD"
	], { nodeOptions: { cwd } });
	if (cmd.exitCode !== 0) throw new Error(`Failed to find where HEAD diverged from "${ref}". Does "${ref}" exist and it's synced with remote?`);
	return cmd.stdout.toString().trim();
}
/**
* Get the SHAs for the commits that added files, including automatically
* extending a shallow clone if necessary to determine any commits.
* @param gitPaths - Paths to fetch
* @param options - `cwd` and `short`
*/
async function getCommitsThatAddFiles(gitPaths, { cwd, short = false }) {
	const map = /* @__PURE__ */ new Map();
	let remaining = gitPaths;
	do {
		const commitInfos = await Promise.all(remaining.map(async (gitPath) => {
			const [commitSha, parentSha] = (await exec("git", [
				"log",
				"--diff-filter=A",
				"--follow",
				"--max-count=1",
				short ? "--pretty=format:%h:%p" : "--pretty=format:%H:%p",
				gitPath
			], { nodeOptions: { cwd } })).stdout.toString().split(":");
			return {
				path: gitPath,
				commitSha,
				parentSha
			};
		}));
		const commitsWithMissingParents = [];
		for (const info of commitInfos) if (info.commitSha) if (info.parentSha) map.set(info.path, info.commitSha);
		else commitsWithMissingParents.push(info);
		if (commitsWithMissingParents.length === 0) break;
		if (await isRepoShallow({ cwd })) {
			await deepenCloneBy({
				by: 50,
				cwd
			});
			remaining = commitsWithMissingParents.map((p) => p.path);
		} else {
			for (const unresolved of commitsWithMissingParents) map.set(unresolved.path, unresolved.commitSha);
			break;
		}
	} while (true);
	return gitPaths.map((p) => map.get(p));
}
async function isRepoShallow({ cwd }) {
	const isShallowRepoOutput = (await exec("git", ["rev-parse", "--is-shallow-repository"], { nodeOptions: { cwd } })).stdout.toString().trim();
	if (isShallowRepoOutput === "--is-shallow-repository") {
		const gitDir = (await exec("git", ["rev-parse", "--git-dir"], { nodeOptions: { cwd } })).stdout.toString().trim();
		const fullGitDir = path.resolve(cwd, gitDir);
		try {
			await fs.access(path.join(fullGitDir, "shallow"));
			return true;
		} catch {
			return false;
		}
	} else return isShallowRepoOutput === "true";
}
async function deepenCloneBy({ by, cwd }) {
	const cmd = await exec("git", ["fetch", `--deepen=${by}`], { nodeOptions: { cwd } });
	if (cmd.exitCode !== 0) throw new Error(cmd.stderr.toString());
}
async function getRepoRoot({ cwd }) {
	const { stdout, exitCode, stderr } = await exec("git", ["rev-parse", "--show-cdup"], { nodeOptions: { cwd } });
	if (exitCode !== 0) throw new Error(stderr.toString());
	return path.resolve(cwd, stdout.toString().trim().replace(/\n|\r/g, ""));
}
async function getChangedFilesSince({ cwd, ref, fullPath = false }) {
	const divergedAt = await getDivergedCommit(cwd, ref);
	const cmd = await exec("git", [
		"diff",
		"--name-only",
		"--no-relative",
		divergedAt
	], { nodeOptions: { cwd } });
	if (cmd.exitCode !== 0) throw new Error(`Failed to diff against ${divergedAt}. Is ${divergedAt} a valid ref?`);
	const files = cmd.stdout.toString().trim().split("\n").filter((a) => a);
	if (!fullPath) return files;
	const repoRoot = await getRepoRoot({ cwd });
	return files.map((file) => path.resolve(repoRoot, file));
}
async function getChangedChangesetFilesSinceRef({ cwd, ref }) {
	try {
		const cmd = await exec("git", [
			"diff",
			"--name-only",
			"--diff-filter=d",
			"--no-relative",
			await getDivergedCommit(cwd, ref)
		], { nodeOptions: { cwd } });
		const rootChangesetsRegex = /\.changeset\/[^/]+\.md$/;
		const preChangesetsRegex = /\.changeset\/pre\/[^/]+\.md$/;
		return cmd.stdout.toString().trim().split("\n").filter((file) => rootChangesetsRegex.test(file) || preChangesetsRegex.test(file));
	} catch (err) {
		if (err instanceof GitError) return [];
		throw err;
	}
}
async function getChangedPackagesSinceRef({ cwd, ref, changedFilePatterns = ["**"] }) {
	const changedFiles = await getChangedFilesSince({
		ref,
		cwd,
		fullPath: true
	});
	return (await getPackages(cwd)).packages.toSorted((pkgA, pkgB) => pkgB.dir.length - pkgA.dir.length).filter((pkg) => {
		const changedPackageFiles = [];
		for (let i = changedFiles.length - 1; i >= 0; i--) {
			const file = changedFiles[i];
			if (!path.relative(pkg.dir, file).startsWith("..")) {
				changedFiles.splice(i, 1);
				const relativeFile = file.slice(pkg.dir.length + 1);
				changedPackageFiles.push(relativeFile);
			}
		}
		return changedPackageFiles.length > 0 && globMatchSome(changedPackageFiles, changedFilePatterns);
	});
}
async function tagExists(tagStr, cwd) {
	return !!(await exec("git", [
		"tag",
		"-l",
		tagStr
	], { nodeOptions: { cwd } })).stdout.toString().trim();
}
async function getCurrentCommitId({ cwd, short = false }) {
	return (await exec("git", [
		"rev-parse",
		short && "--short",
		"HEAD"
	].filter(Boolean), { nodeOptions: { cwd } })).stdout.toString().trim();
}
async function remoteTagExists(tagStr) {
	return !!(await exec("git", [
		"ls-remote",
		"--tags",
		"origin",
		"-l",
		tagStr
	])).stdout.toString().trim();
}
function globMatchSome(paths, patterns) {
	if (!patterns) return paths.length > 0;
	const matchers = patterns.map((p) => picomatch(p, void 0, true));
	return paths.some((path) => {
		if (path.includes("\\")) path = path.replace(/\\/g, "/");
		let passed = false;
		for (const matcher of matchers) if (!passed) {
			if (!matcher.state.negated && matcher(path)) passed = true;
		} else if (matcher.state.negated && !matcher(path)) passed = false;
		return passed;
	});
}
//#endregion
export { add, commit, deepenCloneBy, getAllTags, getChangedChangesetFilesSinceRef, getChangedFilesSince, getChangedPackagesSinceRef, getCommitsThatAddFiles, getCurrentCommitId, getDivergedCommit, isRepoShallow, remoteTagExists, tag, tagExists };
