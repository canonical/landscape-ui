export type ExportJobType = "instance" | "activity";

export type ExportJobStatus = "processing" | "completed" | "failed";

export interface ExportJob {
  id: number;
  name: string;
  filename: string;
  type: ExportJobType;
  row_count: number;
  created_at: string;
  status: ExportJobStatus;
  progress: number;
  estimated_seconds_remaining?: number | null;
  download_ready: boolean;
  retain_until: string;
  query?: string | null;
}
