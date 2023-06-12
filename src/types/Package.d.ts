type PackageName = string;

type PackageVersion = string;

export type Package = [PackageName, PackageVersion];

export interface PackageDiff {
  [componentArchitecturePair: string]: {
    update: [PackageName, PackageVersion, PackageVersion][];
    add: Package[];
    delete: Package[];
  };
}
