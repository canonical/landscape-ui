type PocketPackageName = string;

type PocketPackageVersion = string;

export type PocketPackage = [PocketPackageName, PocketPackageVersion];

export type PackageDiff = Record<
  string,
  {
    add?: PocketPackage[];
    delete?: PocketPackage[];
    update?: [PocketPackageName, PocketPackageVersion, PocketPackageVersion][];
  }
>;

export type PocketPackagesList = Record<string, PocketPackage[]>;

interface CommonPackageInfo extends Record<string, unknown> {
  id: number;
  name: string;
  summary: string;
}

interface InstancePackageInfo extends Record<string, unknown> {
  available_version: string | null;
  current_version: string | null;
  status: "available" | "installed" | "held" | "security";
}

export type InstancePackage = CommonPackageInfo & InstancePackageInfo;

interface InstancePackageInfoWithInstanceId extends InstancePackageInfo {
  id: number;
}

export interface Package extends CommonPackageInfo {
  computers: InstancePackageInfoWithInstanceId[];
}

export interface PackageObject {
  arch: string;
  component: string;
  name: string;
  udeb: boolean;
  version: string;
}

export interface DowngradePackageVersion extends CommonPackageInfo {
  version: string;
}
