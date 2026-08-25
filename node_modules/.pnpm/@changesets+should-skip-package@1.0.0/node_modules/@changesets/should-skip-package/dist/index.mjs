//#region src/index.ts
function shouldSkipPackage({ packageJson }, { ignore, allowPrivatePackages }) {
	if (ignore.includes(packageJson.name)) return true;
	if (packageJson.private && !allowPrivatePackages) return true;
	return !packageJson.version;
}
//#endregion
export { shouldSkipPackage };
