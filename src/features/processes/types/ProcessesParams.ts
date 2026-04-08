export interface GetProcessesParams {
  computer_id: number;
  limit?: number;
  offset?: number;
  search?: string;
}

export interface ProcessesSignalParams {
  computer_id: number;
  pids: number[];
}
