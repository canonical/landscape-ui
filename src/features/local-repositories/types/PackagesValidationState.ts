import type { OperationStatus, OperationError } from "@/features/operations";

export interface PackagesValidationState {
  done: boolean;
  status: OperationStatus;
  response: string[];
  count: number;
  error?: Omit<OperationError, "details">;
}
