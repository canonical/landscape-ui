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

export interface OldPackage extends Record<string, unknown> {
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

export interface Package extends Record<string, unknown> {
  available_version: string | null;
  current_version: string | null;
  name: string;
  status: "available" | "installed" | "held" | "security" | "upgrade";
  summary: string;
  usn?: {
    info: string;
    usn: string;
    usn_link: string;
  };
}
