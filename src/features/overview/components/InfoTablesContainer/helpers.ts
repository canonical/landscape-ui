import { OldPackage } from "@/types/Package";
import { Usn } from "@/types/Usn";

export interface InstancesUpgradesTableItem extends Record<string, unknown> {
  id: number;
  instanceName: string;
  affectedPackages: number;
}

export type UpgradesTableItem = InstancesUpgradesTableItem | OldPackage | Usn;
