type PocketPackageName = string;

type PocketPackageVersion = string;

export type PocketPackage = [PocketPackageName, PocketPackageVersion];

export interface PackageDiff {
  [componentArchitecturePair: string]: {
    add?: PocketPackage[];
    delete?: PocketPackage[];
    update?: [PocketPackageName, PocketPackageVersion, PocketPackageVersion][];
  };
}

export interface PocketPackagesList {
  [componentArchitecturePair: string]: PocketPackage[];
}

export interface Package extends Record<string, unknown> {
  computers: {
    available: number[];
    held: number[];
    installed: number[];
    upgrades: number[];
  };
  name: string;
  summary: string;
  version: string;
  usn?: {
    name: string;
    summary: string;
  };
}

export interface PackageObject {
  arch: string;
  component: string;
  name: string;
  udeb: boolean;
  version: string;
}
