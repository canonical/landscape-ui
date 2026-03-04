import type { InstanceModalRow } from "../../types";

export interface DistributionCategory {
  title: string;
  instances: InstanceModalRow[];
  isIneligibleCategory: boolean;
}
