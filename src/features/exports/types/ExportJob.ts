export type ExportJobType = "instance" | "activity";

export type ExportJobStatus = "processing" | "completed" | "failed";

export interface ExportJob {
  readonly id: string;
  readonly name: string;
  readonly filename: string;
  readonly type: ExportJobType;
  readonly rowCount: number;
  readonly attributeLabels: string[];
  readonly selectedFieldIds: string[];
  readonly createdAt: string;
  readonly status: ExportJobStatus;
  readonly progress: number;
  readonly estimatedSecondsRemaining?: number | null;
  readonly errorMessage?: string | null;
  readonly downloadReady?: boolean;
  readonly retainUntil?: string | null;
  readonly query?: string | null;
  readonly displayQuery?: string | null;
  readonly hasSelection?: boolean;
}
