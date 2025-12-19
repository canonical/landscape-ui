import type { Package } from "./Package";

export interface SelectedPackage {
  package: Package;
  selectedVersions: string[];
}
