import { Package } from "@/types/Package";
import { Usn } from "@/types/Usn";

export interface InstancesUpgradesTableItem extends Record<string, unknown> {
  instanceName: string;
  affectedPackages: number;
}

export type UpgradesTableItem = InstancesUpgradesTableItem | Package | Usn;
