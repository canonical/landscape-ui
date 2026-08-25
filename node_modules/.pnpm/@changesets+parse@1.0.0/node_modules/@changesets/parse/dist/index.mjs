import * as yaml from "yaml";
//#region src/index.ts
const mdRegex = /\s*---([^]*?)\r?\n\s*---(\s*(?:\n|$)[^]*)/;
const EXAMPLE_FORMAT = `---\n"package-name": patch\n---`;
const validVersionTypes = [
	"major",
	"minor",
	"patch",
	"none"
];
function truncate(s, max = 200) {
	return s.length > max ? s.slice(0, max) + "..." : s;
}
function validateReleases(releases, contents) {
	for (const release of releases) {
		if (typeof release.name !== "string" || release.name.trim() === "") throw new Error(`could not parse changeset - invalid package name in frontmatter.\nExpected a non-empty string for package name, but got: ${JSON.stringify(release.name)}\nChangeset contents:\n${truncate(contents)}`);
		if (typeof release.type !== "string") throw new Error(`could not parse changeset - invalid release type for package "${release.name}".\nExpected a string for release type, but got: ${typeof release.type}\nChangeset contents:\n${truncate(contents)}`);
		if (!validVersionTypes.includes(release.type)) throw new Error(`could not parse changeset - invalid version type ${JSON.stringify(release.type)} for package "${release.name}".\nValid version types are: ${validVersionTypes.join(", ")}\nChangeset contents:\n${truncate(contents)}`);
	}
}
function parseChangesetFile(contents) {
	const trimmedContents = contents.trim();
	if (!trimmedContents) throw new Error(`could not parse changeset - file is empty.
Changesets must have frontmatter with package names and version types.
Example:\n${EXAMPLE_FORMAT}\n\nYour changeset summary here.`);
	const execResult = mdRegex.exec(contents);
	if (!execResult) throw new Error(`could not parse changeset - missing or invalid frontmatter.
Changesets must start with frontmatter delimited by "---".
Example:\n${EXAMPLE_FORMAT}\n\nYour changeset summary here.\nReceived content:\n${truncate(trimmedContents)}`);
	const [, roughReleases, roughSummary] = execResult;
	const summary = roughSummary.trim();
	let yamlStuff;
	try {
		yamlStuff = yaml.parse(roughReleases);
	} catch (e) {
		throw new Error(`could not parse changeset - invalid YAML in frontmatter.
The frontmatter between the "---" delimiters must be valid YAML.
YAML error: ${e instanceof Error ? e.message : String(e)}\nFrontmatter content:\n${roughReleases}`, { cause: e });
	}
	let releases = [];
	if (yamlStuff) {
		if (typeof yamlStuff !== "object" || Array.isArray(yamlStuff)) throw new Error(`could not parse changeset - frontmatter must be an object mapping package names to version types.\nExpected format:\n${EXAMPLE_FORMAT}\nReceived:\n${roughReleases}`);
		releases = Object.entries(yamlStuff).map(([name, type]) => ({
			name,
			type
		}));
	}
	validateReleases(releases, contents);
	return {
		releases,
		summary
	};
}
/** @deprecated Use named export `parseChangesetFile` instead */
const parseChangesetFileDefault = parseChangesetFile;
//#endregion
export { parseChangesetFileDefault as default, parseChangesetFile };
