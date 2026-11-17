import { NewChangeset } from "@changesets/types";
//#region src/index.d.ts
declare function readChangesets(rootDir: string, sinceRef?: string): Promise<Array<NewChangeset>>;
/** @deprecated Use named export `readChangesets` instead */
declare const readChangesetsDefault: typeof readChangesets;
//#endregion
export { readChangesetsDefault as default, readChangesets };