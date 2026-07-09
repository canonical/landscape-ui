import type { ExportJob } from "@/features/exports";

export interface InstancesExportJob extends ExportJob {
  readonly type: "instance";
}
