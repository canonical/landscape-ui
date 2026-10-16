import { getChangedPackagesSinceRef } from "@changesets/git";
import { shouldSkipPackage } from "@changesets/should-skip-package";
//#region src/utils/versionablePackages.ts
async function getVersionableChangedPackages(config, { cwd, ref }) {
	return (await getChangedPackagesSinceRef({
		ref: ref ?? config.baseBranch,
		changedFilePatterns: config.changedFilePatterns,
		cwd
	})).filter((pkg) => !shouldSkipPackage(pkg, {
		ignore: config.ignore,
		allowPrivatePackages: config.privatePackages.version
	}));
}
//#endregion
export { getVersionableChangedPackages as t };
