export type ExportJobType = "instance" | "activity";

export type ExportJobStatus = "processing" | "completed" | "failed";

export interface ExportJob {
  readonly id: string;
  readonly name: string;
  readonly filename: string;
  readonly type: ExportJobType;
  readonly row_count: number;
  readonly attribute_labels: string[];
  readonly created_at: string;
  readonly status: ExportJobStatus;
  readonly progress: number;
  readonly estimated_seconds_remaining?: number | null;
  readonly download_ready: boolean;
  readonly retain_until: string;
  readonly query?: string | null;
}
