import { Config, NewChangeset, Packages, PreState, ReleasePlan } from "@changesets/types";
//#region src/index.d.ts
type SnapshotReleaseParameters = {
  tag?: string | undefined;
  commit?: string | undefined;
};
declare function assembleReleasePlan(changesets: NewChangeset[], packages: Packages, config: Config, preState: PreState | undefined, snapshot?: SnapshotReleaseParameters): ReleasePlan;
/** @deprecated Use named export `assembleReleasePlan` instead */
declare const assembleReleasePlanDefault: typeof assembleReleasePlan;
//#endregion
export { assembleReleasePlan, assembleReleasePlanDefault as default };