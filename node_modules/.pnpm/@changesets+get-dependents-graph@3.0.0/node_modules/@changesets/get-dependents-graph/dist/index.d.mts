import { Packages } from "@changesets/types";
//#region src/index.d.ts
declare function getDependentsGraph(packages: Packages, opts?: {
  ignoreDevDependencies?: boolean;
  bumpVersionsWithWorkspaceProtocolOnly?: boolean;
}): Map<string, Array<string>>;
//#endregion
export { getDependentsGraph };