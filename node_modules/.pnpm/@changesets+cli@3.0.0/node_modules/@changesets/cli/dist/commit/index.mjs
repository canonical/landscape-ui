//#region src/commit/index.ts
const commitFunctions = {
	getAddMessage: (changeset, options) => {
		const skipMsg = options?.skipCI === "add" || options?.skipCI === true ? `\n\n[skip ci]\n` : "";
		return `docs(changeset): ${changeset.summary}${skipMsg}`;
	},
	getVersionMessage: (releasePlan, options) => {
		const skipCI = options?.skipCI === "version" || options?.skipCI === true;
		const publishableReleases = releasePlan.releases.filter((release) => release.type !== "none");
		return `RELEASING: Releasing ${publishableReleases.length} package(s)

Releases:
${publishableReleases.map((release) => `  ${release.name}@${release.newVersion}`).join("\n")}
${skipCI ? `\n[skip ci]\n` : ""}`;
	}
};
//#endregion
export { commitFunctions as default };
