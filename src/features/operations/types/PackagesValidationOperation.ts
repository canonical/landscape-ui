import type { Any } from "@canonical/landscape-openapi";
import type { OperationStatus } from "./Operation";

export interface PackagesValidationState {
  done: boolean;
  status: OperationStatus;
  response: string[];
  count: number;
  error?: {
    code?: number;
    message?: string;
  };
}

export interface PackagesValidationOperation {
  name: string;
  done: boolean;
  metadata: {
    status: OperationStatus;
    "@type": string;
    description: string;
    operationId: string;
  };
  response?: {
    "@type": string;
    output?: string;
  };
  error?: {
    code?: number;
    message?: string;
    details?: Any[];
  };
}
