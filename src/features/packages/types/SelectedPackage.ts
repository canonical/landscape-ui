import type { AvailableVersion } from "./AvailableVersion";

export interface SelectedPackage {
  name: string;
  id: number;
  versions: string[];
}

export interface PackageVersionsInstanceCount {
  name: string;
  id: number;
  versions: AvailableVersion[];
}
