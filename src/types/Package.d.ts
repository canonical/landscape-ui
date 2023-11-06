type PackageName = string;

type PackageVersion = string;

export type Package = [PackageName, PackageVersion];

export interface PackageDiff {
  [componentArchitecturePair: string]: {
    update?: [PackageName, PackageVersion, PackageVersion][];
    add?: Package[];
    delete?: Package[];
  };
}

export interface PackagesList {
  [componentArchitecturePair: string]: Package[];
}

export interface PackageObject {
  arch: string;
  component: string;
  name: string;
  udeb: boolean;
  version: string;
}
