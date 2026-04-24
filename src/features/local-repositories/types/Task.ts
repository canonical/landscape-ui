export type TaskStatus = "idle" | "in progress" | "succeeded" | "failed";

export interface Task {
  name: string;
  display_name: string;
  task_id: string;
  status: TaskStatus;
  output: string;
}
