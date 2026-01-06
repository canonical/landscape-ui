import type { AvailableVersion } from "./AvailableVersion";
import type { Package } from "./Package";

export interface SelectedPackage {
  package: Package;
  selectedVersions: AvailableVersion[];
}
