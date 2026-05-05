export type OperationStatus = "idle" | "in progress" | "succeeded" | "failed";

export interface OperationMetadata {
  description: string;
  operation_id: string;
  status: OperationStatus;
}
