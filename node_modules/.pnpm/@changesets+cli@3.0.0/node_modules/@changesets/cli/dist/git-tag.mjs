import { t as readConfig } from "./read-config.mjs";
import { t as ensureChangesetFolder } from "./shared.mjs";
import { i as createOutputReport, n as createGitTags, r as formatGitTagResults, t as _usingCtx } from "./usingCtx.mjs";
import { spinner } from "@clack/prompts";
import { shouldSkipPackage } from "@changesets/should-skip-package";
import { getPackages } from "@manypkg/get-packages";
//#region src/commands/git-tag/index.ts
async function gitTag(options) {
	try {
		var _usingCtx$1 = _usingCtx();
		const reporter = _usingCtx$1.a(await createOutputReport(options?.output));
		const packages = await getPackages(options?.cwd ?? process.cwd());
		await ensureChangesetFolder(packages.rootDir);
		const config = await readConfig(packages);
		const s = spinner();
		s.start("Creating git tags...");
		const results = await createGitTags({
			packages,
			releases: packages.packages.filter((pkg) => !shouldSkipPackage(pkg, {
				ignore: config.ignore,
				allowPrivatePackages: config.privatePackages.tag
			})).map((pkg) => ({
				kind: "tag-only",
				name: pkg.packageJson.name,
				version: pkg.packageJson.version
			})),
			reporter
		});
		if (results.tagged.length === 0) {
			s.stop("Did not find any packages that need to be tagged.");
			return;
		}
		s.stop(formatGitTagResults(packages.tool, results));
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		await _usingCtx$1.d();
	}
}
//#endregion
export { gitTag };
