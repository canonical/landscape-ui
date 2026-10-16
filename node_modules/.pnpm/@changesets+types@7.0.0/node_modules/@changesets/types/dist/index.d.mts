//#region src/index.d.ts
type MaybePromise<T> = T | Promise<T>;
type VersionType = "major" | "minor" | "patch" | "none";
type DependencyType = "dependencies" | "devDependencies" | "peerDependencies" | "optionalDependencies";
type AccessType = "public" | "restricted";
type Release = {
  name: string;
  type: VersionType;
};
interface ComprehensiveReleaseBase {
  name: string;
  type: "major" | "minor" | "patch" | "none";
  changesets: string[];
  oldVersion: string | undefined;
  newVersion: string | undefined;
}
interface ComprehensiveMajorRelease extends ComprehensiveReleaseBase {
  type: "major";
  oldVersion: string;
  newVersion: string;
}
interface ComprehensiveMinorRelease extends ComprehensiveReleaseBase {
  type: "minor";
  oldVersion: string;
  newVersion: string;
}
interface ComprehensivePatchRelease extends ComprehensiveReleaseBase {
  type: "patch";
  oldVersion: string;
  newVersion: string;
}
interface ComprehensiveNoneRelease extends ComprehensiveReleaseBase {
  type: "none";
  oldVersion: string | undefined;
  newVersion: string | undefined;
}
type ComprehensiveRelease = ComprehensiveMajorRelease | ComprehensiveMinorRelease | ComprehensivePatchRelease | ComprehensiveNoneRelease;
type Changeset = {
  summary: string;
  releases: Array<Release>;
};
type NewChangeset = Changeset & {
  id: string;
};
type ReleasePlan = {
  changesets: NewChangeset[];
  releases: ComprehensiveRelease[];
  preState: PreState | undefined;
};
type PackageJSON = {
  name: string;
  version: string;
  dependencies?: {
    [key: string]: string;
  };
  peerDependencies?: {
    [key: string]: string;
  };
  devDependencies?: {
    [key: string]: string;
  };
  optionalDependencies?: {
    [key: string]: string;
  };
  resolutions?: {
    [key: string]: string;
  };
  private?: boolean;
  publishConfig?: {
    access?: AccessType;
    directory?: string;
    registry?: string;
    [registry: `${string}:registry`]: string;
  };
};
type PackageGroup = ReadonlyArray<string>;
type Fixed = ReadonlyArray<PackageGroup>;
type Linked = ReadonlyArray<PackageGroup>;
interface PrivatePackages {
  version: boolean;
  tag: boolean;
}
type Config = {
  changelog: false | readonly [string, null | Record<string, unknown>];
  commit: false | readonly [string, null | Record<string, unknown>];
  fixed: Fixed;
  linked: Linked;
  access: AccessType;
  baseBranch: string;
  changedFilePatterns: readonly string[];
  /**
   * The formatter to use to format changesets and changelogs. Set `false` to disable formatting.
   * The default value of `"auto"` will auto-detect the formatter based on the project's configuration files.
   */
  format: "auto" | "prettier" | "oxfmt" | "deno" | "dprint" | false;
  /** Features enabled for Private packages */
  privatePackages: PrivatePackages;
  /** The minimum bump type to trigger automatic update of internal dependencies that are part of the same release */
  updateInternalDependencies: "patch" | "minor";
  ignore: ReadonlyArray<string>;
  /** This is supposed to be used with pnpm's `link-workspace-packages: false` and Berry's `enableTransparentWorkspaces: false` */
  bumpVersionsWithWorkspaceProtocolOnly?: boolean;
  ___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH: Required<ExperimentalOptions>;
  snapshot: {
    useCalculatedVersion: boolean;
    prereleaseTemplate: string | null;
  };
};
type WrittenConfig = {
  changelog?: false | readonly [string, null | Record<string, unknown>] | string;
  commit?: boolean | readonly [string, null | Record<string, unknown>] | string;
  fixed?: Fixed;
  linked?: Linked;
  access?: AccessType;
  baseBranch?: string;
  changedFilePatterns?: readonly string[];
  format?: "auto" | "prettier" | "oxfmt" | "deno" | "dprint" | false;
  /** Opt in to tracking non-npm / private packages */
  privatePackages?: boolean | {
    version?: boolean;
    tag?: boolean;
  };
  /** The minimum bump type to trigger automatic update of internal dependencies that are part of the same release */
  updateInternalDependencies?: "patch" | "minor";
  ignore?: ReadonlyArray<string>;
  bumpVersionsWithWorkspaceProtocolOnly?: boolean;
  snapshot?: {
    useCalculatedVersion?: boolean;
    prereleaseTemplate?: string;
  };
  ___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH?: ExperimentalOptions;
};
type ExperimentalOptions = {
  onlyUpdatePeerDependentsWhenOutOfRange?: boolean;
  updateInternalDependents?: "always" | "out-of-range";
};
type NewChangesetWithCommit = NewChangeset & {
  commit?: string;
};
type ModCompWithPackage = ComprehensiveRelease & {
  packageJson: PackageJSON;
  dir: string;
};
type GetReleaseLine = (changeset: NewChangesetWithCommit, type: VersionType, changelogOpts: null | Record<string, unknown>) => MaybePromise<string>;
type GetDependencyReleaseLine = (changesets: NewChangesetWithCommit[], dependenciesUpdated: ModCompWithPackage[], changelogOpts: null | Record<string, unknown>) => MaybePromise<string>;
type ChangelogFunctions = {
  getReleaseLine: GetReleaseLine;
  getDependencyReleaseLine: GetDependencyReleaseLine;
};
type GetAddMessage = (changeset: Changeset, commitOpts: null | Record<string, unknown>) => MaybePromise<string>;
type GetVersionMessage = (releasePlan: ReleasePlan, commitOpts: null | Record<string, unknown>) => MaybePromise<string>;
type CommitFunctions = {
  getAddMessage?: GetAddMessage;
  getVersionMessage?: GetVersionMessage;
};
type PreState = {
  mode: "pre" | "exit";
  tag: string;
};
interface Package {
  dir: string;
  packageJson: PackageJSON;
}
interface Packages {
  rootDir: string;
  rootPackage?: Package;
  packages: Array<Package>;
  tool: {
    type: "yarn" | "pnpm" | "lerna" | "bolt" | "root" | (string & {});
  };
}
//#endregion
export { AccessType, ChangelogFunctions, Changeset, CommitFunctions, ComprehensiveRelease, Config, DependencyType, ExperimentalOptions, Fixed, GetAddMessage, GetDependencyReleaseLine, GetReleaseLine, GetVersionMessage, Linked, ModCompWithPackage, NewChangeset, NewChangesetWithCommit, Package, PackageGroup, PackageJSON, Packages, PreState, PrivatePackages, Release, ReleasePlan, VersionType, WrittenConfig };