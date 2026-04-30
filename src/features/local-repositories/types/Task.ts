import type { Status } from "@canonical/landscape-openapi";

export type TaskStatus = "idle" | "in progress" | "succeeded" | "failed";

export interface TaskMetadata {
  description: string;
  operation_id: string;
  status: TaskStatus;
}

export interface Task {
  name?: string;
  done?: boolean;
  error?: Status;
  response?: string[];
  metadata?: TaskMetadata;
}
