import * as git from "@changesets/git";
//#region src/utils/gitTags.ts
function buildGitTag(tool, { name, version }) {
	return tool.type !== "root" ? `${name}@${version}` : `v${version}`;
}
async function splitByTagStatus(cwd, tool, releases) {
	if (releases.length === 0) return {
		untagged: [],
		existing: []
	};
	const localTags = await git.getAllTags(cwd);
	const tagStatuses = await Promise.all(releases.map(async (release) => {
		const tagName = buildGitTag(tool, release);
		return localTags.has(tagName) || await git.remoteTagExists(tagName);
	}));
	const untagged = [];
	const existing = [];
	for (const [index, hasTag] of tagStatuses.entries()) (hasTag ? existing : untagged).push(releases[index]);
	return {
		untagged,
		existing
	};
}
//#endregion
export { splitByTagStatus as n, buildGitTag as t };
