import { PreState } from "@changesets/types";
//#region src/index.d.ts
declare function readPreState(rootDir: string): Promise<PreState | undefined>;
declare function exitPre(rootDir: string): Promise<void>;
declare function enterPre(rootDir: string, tag: string): Promise<void>;
//#endregion
export { enterPre, exitPre, readPreState };