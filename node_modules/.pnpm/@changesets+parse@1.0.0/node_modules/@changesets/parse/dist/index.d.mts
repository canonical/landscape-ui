import { Release } from "@changesets/types";
//#region src/index.d.ts
declare function parseChangesetFile(contents: string): {
  summary: string;
  releases: Release[];
};
/** @deprecated Use named export `parseChangesetFile` instead */
declare const parseChangesetFileDefault: typeof parseChangesetFile;
//#endregion
export { parseChangesetFileDefault as default, parseChangesetFile };