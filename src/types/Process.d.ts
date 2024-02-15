export interface Process extends Record<string, unknown> {
  computer_id: number;
  cpu_utilization: number;
  gid: number;
  name: string;
  pid: number;
  start_time: string;
  state: number;
  uid: number;
  vm_size: number;
}
