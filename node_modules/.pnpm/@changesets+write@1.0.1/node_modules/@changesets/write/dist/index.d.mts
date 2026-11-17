import { Changeset, Config } from "@changesets/types";
//#region src/index.d.ts
declare function writeChangeset({ summary, releases }: Changeset, rootDir: string, options?: {
  format?: Config["format"];
}): Promise<string>;
/** @deprecated Use named export `writeChangeset` instead */
declare const writeChangesetDefault: typeof writeChangeset;
//#endregion
export { writeChangesetDefault as default, writeChangeset };