type PocketPackageName = string;

type PocketPackageVersion = string;

export type PocketPackage = [PocketPackageName, PocketPackageVersion];

export interface PackageDiff {
  [componentArchitecturePair: string]: {
    update?: [PocketPackageName, PocketPackageVersion, PocketPackageVersion][];
    add?: PocketPackage[];
    delete?: PocketPackage[];
  };
}

export interface PocketPackagesList {
  [componentArchitecturePair: string]: PocketPackage[];
}

export interface Package extends Record<string, unknown> {
  name: string;
  summary: string;
  version: string;
  computers: {
    available: number[];
    installed: number[];
    upgrades: number[];
    held: number[];
  };
}

export interface PackageObject {
  arch: string;
  component: string;
  name: string;
  udeb: boolean;
  version: string;
}
