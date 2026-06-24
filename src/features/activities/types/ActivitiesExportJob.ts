import type { ExportJob } from "@/features/exports";

export interface ActivitiesExportJob extends ExportJob {
  readonly type: "activity";
}
