export type InstancesExportJobStatus =
  | "processing"
  | "completed"
  | "failed"
  | "canceled";

export interface InstancesExportJob {
  readonly id: string;
  readonly name: string;
  readonly filename: string;
  readonly instanceCount: number;
  readonly attributeLabels: string[];
  readonly selectedFieldIds: string[];
  readonly createdAt: string;
  readonly status: InstancesExportJobStatus;
  readonly progress: number;
  readonly estimatedSecondsRemaining?: number | null;
  readonly errorMessage?: string | null;
  readonly downloadReady?: boolean;
}
