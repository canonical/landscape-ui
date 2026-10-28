import { Package } from "@changesets/types";
//#region src/index.d.ts
declare function add(pathToFile: string, cwd: string): Promise<boolean>;
declare function commit(message: string, cwd: string): Promise<boolean>;
declare function getAllTags(cwd: string): Promise<Set<string>>;
declare function tag(tagStr: string, cwd: string): Promise<boolean>;
declare function getDivergedCommit(cwd: string, ref: string): Promise<string>;
/**
 * Get the SHAs for the commits that added files, including automatically
 * extending a shallow clone if necessary to determine any commits.
 * @param gitPaths - Paths to fetch
 * @param options - `cwd` and `short`
 */
declare function getCommitsThatAddFiles(gitPaths: string[], { cwd, short }: {
  cwd: string;
  short?: boolean;
}): Promise<(string | undefined)[]>;
declare function isRepoShallow({ cwd }: {
  cwd: string;
}): Promise<boolean>;
declare function deepenCloneBy({ by, cwd }: {
  by: number;
  cwd: string;
}): Promise<void>;
declare function getChangedFilesSince({ cwd, ref, fullPath }: {
  cwd: string;
  ref: string;
  fullPath?: boolean;
}): Promise<Array<string>>;
declare function getChangedChangesetFilesSinceRef({ cwd, ref }: {
  cwd: string;
  ref: string;
}): Promise<Array<string>>;
declare function getChangedPackagesSinceRef({ cwd, ref, changedFilePatterns }: {
  cwd: string;
  ref: string;
  changedFilePatterns?: readonly string[];
}): Promise<Package[]>;
declare function tagExists(tagStr: string, cwd: string): Promise<boolean>;
declare function getCurrentCommitId({ cwd, short }: {
  cwd: string;
  short?: boolean;
}): Promise<string>;
declare function remoteTagExists(tagStr: string): Promise<boolean>;
//#endregion
export { add, commit, deepenCloneBy, getAllTags, getChangedChangesetFilesSinceRef, getChangedFilesSince, getChangedPackagesSinceRef, getCommitsThatAddFiles, getCurrentCommitId, getDivergedCommit, isRepoShallow, remoteTagExists, tag, tagExists };