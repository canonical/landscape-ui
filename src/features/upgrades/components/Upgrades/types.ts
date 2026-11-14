import type { InstancePackagesToExclude } from "@/features/packages";

export interface UpgradesFormProps {
  excludedPackages: InstancePackagesToExclude[];
  excludedUsns: string[];
}

export type UpgradesTabId = "instances" | "packages" | "usns";
