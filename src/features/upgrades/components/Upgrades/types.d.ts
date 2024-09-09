import { InstancePackagesToExclude } from "@/features/packages";

export interface UpgradesFormProps {
  excludedPackages: InstancePackagesToExclude[];
  excludedUsns: string[];
}
