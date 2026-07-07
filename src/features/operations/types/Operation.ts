export type OperationStatus = "idle" | "in progress" | "succeeded" | "failed";

interface OperationMetadata {
  "@type": string;
  description: string;
  operationId: string;
  status: OperationStatus;
  progressPercent: number;
  resource: string;
}

interface OperationResponse {
  "@type": string;
  output?: string;
}

export interface OperationError {
  code: number;
  message: string;
  details?: string[];
}

interface BaseOperation {
  name: string;
  metadata: OperationMetadata;
  done: boolean;
  response?: OperationResponse;
  error?: OperationError;
}

export interface UnfinishedOperation extends BaseOperation {
  done: false;
  error?: never;
}

export interface SuccessfulOperation extends BaseOperation {
  done: true;
  response: OperationResponse;
  error?: never;
}

export interface FailedOperation extends BaseOperation {
  done: true;
  response?: never;
  error: OperationError;
}

export type Operation =
  | UnfinishedOperation
  | SuccessfulOperation
  | FailedOperation;
