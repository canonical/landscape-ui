import { Config, Packages, ReleasePlan } from "@changesets/types";
//#region src/index.d.ts
declare function applyReleasePlan(releasePlan: ReleasePlan, packages: Packages, config?: Config, snapshot?: string | boolean, contextDir?: string): Promise<string[]>;
/** @deprecated Use named export `applyReleasePlan` instead */
declare const applyReleasePlanDefault: typeof applyReleasePlan;
//#endregion
export { applyReleasePlan, applyReleasePlanDefault as default };