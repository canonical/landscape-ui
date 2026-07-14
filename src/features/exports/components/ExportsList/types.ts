import type { ExportJob } from "../../types/ExportJob";

export interface ExportRowData extends Record<string, unknown> {
  readonly job: ExportJob;
}
