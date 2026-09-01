export interface PackageComputers {
  count: number;
}

export interface Package extends Record<string, unknown> {
  id: number;
  name: string;
  summary: string;
  version: string;
  computers: PackageComputers;
}

export type PackageWithVersions = [Package, number[]];
