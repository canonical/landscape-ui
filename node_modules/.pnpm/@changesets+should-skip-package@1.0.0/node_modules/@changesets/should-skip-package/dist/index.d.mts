import { Package, PackageGroup } from "@changesets/types";
//#region src/index.d.ts
declare function shouldSkipPackage({ packageJson }: Package, { ignore, allowPrivatePackages }: {
  ignore: PackageGroup;
  allowPrivatePackages: boolean;
}): boolean;
//#endregion
export { shouldSkipPackage };